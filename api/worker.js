// IOSControl Payment API — Cloudflare Worker
// Handles both Stripe (international) and PayOS (Vietnam) payments
// Deploy: wrangler deploy
//
// Required KV namespace: LICENSES (bind in wrangler.toml)
// Required secrets (wrangler secret put):
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET
//   PAYOS_CLIENT_ID
//   PAYOS_API_KEY
//   PAYOS_CHECKSUM_KEY

const PLANS = {
  7:   { vnd: 6999,   usd: 299,   label: '7 days' },
  30:  { vnd: 29900,  usd: 999,   label: '30 days' },
  365: { vnd: 299000, usd: 4999,  label: '365 days' }
};

// ═══ CORS Headers ═══
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

// ═══ Main Router ═══
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // POST /api/create-payment — create Stripe or PayOS session
      if (path === '/api/create-payment' && request.method === 'POST') {
        return handleCreatePayment(request, env);
      }

      // POST /api/webhook/stripe — Stripe payment callback
      if (path === '/api/webhook/stripe' && request.method === 'POST') {
        return handleStripeWebhook(request, env);
      }

      // POST /api/webhook/payos — PayOS payment callback
      if (path === '/api/webhook/payos' && request.method === 'POST') {
        return handlePayOSWebhook(request, env);
      }

      // GET /api/verify?udid=xxx — check license status
      if (path === '/api/verify' && request.method === 'GET') {
        return handleVerify(url, env);
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }
};

// ═══ Create Payment ═══
async function handleCreatePayment(request, env) {
  const { udid, days, currency } = await request.json();

  if (!udid || !days || !PLANS[days]) {
    return jsonResponse({ error: 'Invalid params. Required: udid, days (7/30/365)' }, 400);
  }

  const plan = PLANS[days];
  const useStripe = currency === 'usd' || currency === 'USD';
  const orderCode = Date.now() % 1000000000; // unique order ID

  if (useStripe) {
    // ── Stripe Checkout Session ──
    const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][unit_amount]': plan.usd.toString(),
        'line_items[0][price_data][product_data][name]': `IOSControl Premium — ${plan.label}`,
        'line_items[0][quantity]': '1',
        'metadata[udid]': udid,
        'metadata[days]': days.toString(),
        'metadata[order_code]': orderCode.toString(),
        'success_url': `https://ioscontrol.com/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `https://ioscontrol.com/buy.html`,
      }),
    });

    const data = await session.json();
    return jsonResponse({ url: data.url, provider: 'stripe', order_code: orderCode });

  } else {
    // ── PayOS ──
    const body = {
      orderCode,
      amount: plan.vnd,
      description: `IOSControl ${plan.label}`,
      returnUrl: `https://ioscontrol.com/payment-success`,
      cancelUrl: `https://ioscontrol.com/buy.html`,
      items: [{ name: `IOSControl Premium — ${plan.label}`, quantity: 1, price: plan.vnd }],
    };

    // TODO: Sign with PAYOS_CHECKSUM_KEY
    const payosResp = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': env.PAYOS_CLIENT_ID,
        'x-api-key': env.PAYOS_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await payosResp.json();
    return jsonResponse({ url: data.data?.checkoutUrl, provider: 'payos', order_code: orderCode });
  }
}

// ═══ Stripe Webhook ═══
async function handleStripeWebhook(request, env) {
  const body = await request.text();
  // TODO: Verify signature with env.STRIPE_WEBHOOK_SECRET
  
  const event = JSON.parse(body);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const udid = session.metadata?.udid;
    const days = parseInt(session.metadata?.days);

    if (udid && days) {
      await activateLicense(env, udid, days);
    }
  }

  return jsonResponse({ received: true });
}

// ═══ PayOS Webhook ═══
async function handlePayOSWebhook(request, env) {
  const body = await request.json();
  // TODO: Verify checksum with env.PAYOS_CHECKSUM_KEY

  if (body.code === '00' && body.data?.orderCode) {
    const orderCode = body.data.orderCode;
    // Look up order → get UDID + days
    // For now, extract from description or use a separate KV store for pending orders
    const udid = body.data.metadata?.udid;
    const days = parseInt(body.data.metadata?.days);

    if (udid && days) {
      await activateLicense(env, udid, days);
    }
  }

  return jsonResponse({ received: true });
}

// ═══ Verify License ═══
async function handleVerify(url, env) {
  const udid = url.searchParams.get('udid');
  if (!udid) {
    return jsonResponse({ error: 'Missing udid parameter' }, 400);
  }

  const license = await env.LICENSES.get(`license:${udid}`, 'json');
  
  if (!license) {
    return jsonResponse({ licensed: false, status: 'free' });
  }

  const now = new Date();
  const expiresAt = new Date(license.expires_at);
  const isActive = expiresAt > now;
  const daysLeft = isActive ? Math.ceil((expiresAt - now) / 86400000) : 0;

  return jsonResponse({
    licensed: isActive,
    status: isActive ? 'active' : 'expired',
    key: license.key,
    expires_at: license.expires_at,
    days_left: daysLeft,
    max_runtime: isActive ? -1 : 120, // -1 = unlimited, 120 = 2 minutes
  });
}

// ═══ Activate License ═══
async function activateLicense(env, udid, days) {
  const existing = await env.LICENSES.get(`license:${udid}`, 'json');
  
  let expiresAt;
  if (existing && new Date(existing.expires_at) > new Date()) {
    // Extend: add days to remaining time
    expiresAt = new Date(existing.expires_at);
    expiresAt.setDate(expiresAt.getDate() + days);
  } else {
    // New: start from now
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
  }

  const key = `IOSC-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}`;

  const license = {
    key: existing?.key || key,
    udid,
    created_at: existing?.created_at || new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    days,
    status: 'active',
    updated_at: new Date().toISOString(),
  };

  await env.LICENSES.put(`license:${udid}`, JSON.stringify(license));
  return license;
}

function randomHex(len) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
