// IOSControl Admin VIP — Customer Operations Console
// Single-file SPA logic. Talks to existing worker at ioscontrol-worker.ioscontrol.workers.dev
// No backend changes — all new features (filters, bulk, command palette) are client-side.

const API = 'https://ioscontrol-worker.ioscontrol.workers.dev';
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

let state = {
  token: localStorage.getItem('admin_token') || '',
  view: 'overview',
  users: [],
  transactions: [],
  audit: [],
  licenses: [],
  licenseCache: new Map(),     // userId -> { licenses, fetchedAt }
  licensesLoading: false,
  licensesLoadedAt: 0,
  selectedUsers: new Set(),
  currentUser: null,
  cmdSelected: 0,
  filters: { user: '', userChip: '', tx: '', txType: '', txStatus: '', key: '', keyChip: '', audit: '' }
};

// ─── UTILS ───
const fmt = n => (Number(n) || 0).toLocaleString('vi-VN') + 'đ';
const num = n => (Number(n) || 0).toLocaleString('vi-VN');
const initials = (name, email) => ((name || email || '?').trim()[0] || '?').toUpperCase();
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const relTime = iso => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 604800) return Math.floor(s / 86400) + 'd ago';
  return d.toLocaleDateString('vi-VN');
};
const balanceClass = v => { const n = Number(v) || 0; return n >= 100000 ? 'balance-high' : n === 0 ? 'balance-zero' : 'balance-low'; };

function toast(msg, kind = 'info') {
  const el = $('toast');
  el.textContent = msg;
  el.className = 'toast ' + kind + ' show';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 3200);
}

function qrPayload(k) { return 'ioscontrol://activate?key=' + encodeURIComponent(k); }
function showQR(k) {
  $('qrModal').classList.add('show');
  $('qrKeyText').textContent = k;
  $('qrBox').innerHTML = '';
  if (window.QRCode) new QRCode($('qrBox'), { text: qrPayload(k), width: 200, height: 200, correctLevel: QRCode.CorrectLevel.M });
  else $('qrBox').innerHTML = '<a class="btn btn-good" href="' + qrPayload(k) + '">Open IOSControl</a>';
  $('qrCopyKey').onclick = () => navigator.clipboard.writeText(k).then(() => toast('Copied key', 'success'));
  $('qrCopyLink').onclick = () => navigator.clipboard.writeText(qrPayload(k)).then(() => toast('Copied deeplink', 'success'));
}
function closeQR() { $('qrModal').classList.remove('show'); }
window.closeQR = closeQR;


// ─── API ───
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) headers.Authorization = 'Bearer ' + state.token;
  const res = await fetch(API + path, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.error || 'Request failed');
  return json;
}

async function loadStats() {
  const s = await api('/portal/api/admin/stats');
  const u = s.users || {}, r = s.revenue || {}, k = s.keys || {};
  $('kRevenue').textContent = fmt(r.revenue_total);
  $('kRevenueSub').textContent = fmt(r.revenue_today) + ' today · ' + fmt(r.revenue_7d) + ' 7d';
  $('kUsers').textContent = num(u.total_users);
  $('kUsersSub').textContent = num(u.active_users) + ' active · ' + num(u.disabled_users) + ' disabled';
  $('kKeys').textContent = num(k.active_keys);
  $('kKeysSub').textContent = num(k.bound_keys) + ' bound · ' + num(k.locked_keys) + ' locked';
  $('kWallet').textContent = fmt(u.wallet_liability);
  $('kWalletSub').textContent = num(r.pending_tx) + ' pending payments';

  // Money view KPIs
  const moneyKpis = $('moneyKpis');
  if (moneyKpis) moneyKpis.innerHTML = [
    ['Today', fmt(r.revenue_today)],
    ['7 days', fmt(r.revenue_7d)],
    ['30 days', fmt(r.revenue_30d)],
    ['Total', fmt(r.revenue_total)]
  ].map(([l, v]) => `<div class="kpi"><div class="kpi-label">${l}</div><div class="kpi-value">${v}</div></div>`).join('');

  renderChart('revChart', [r.revenue_today || 0, (r.revenue_7d || 0) / 7, (r.revenue_30d || 0) / 30, r.revenue_total ? (r.revenue_total / 365) : 0]);
  renderChart('moneyChart', [r.revenue_today || 0, (r.revenue_7d || 0) / 7, (r.revenue_30d || 0) / 30, r.revenue_total || 0]);
  renderInbox(s);
}

async function loadUsers() {
  const q = state.filters.user;
  const limit = 50; // Backend clamps max to 50; fetch every page client-side.
  const first = await api('/portal/api/admin/users?' + new URLSearchParams({ limit, page: 1, q }));
  const rows = [...(first.rows || [])];
  const total = Number(first.total || rows.length);
  const pages = Math.min(Number(first.pages || Math.ceil(total / limit) || 1), 200);

  for (let page = 2; page <= pages; page++) {
    const j = await api('/portal/api/admin/users?' + new URLSearchParams({ limit, page, q }));
    rows.push(...(j.rows || []));
  }

  state.users = rows;
  const loadedIds = new Set(rows.map(u => String(u.id)));
  state.selectedUsers.forEach(id => { if (!loadedIds.has(String(id))) state.selectedUsers.delete(id); });
  renderUsers();
  updateBulkBar();

  const visible = filterUsersClient().length;
  const label = total > rows.length ? `${num(visible)} shown · ${num(rows.length)}/${num(total)} loaded` : `${num(visible)} customer(s)`;
  const sub = $('kUsersSub');
  if (sub && state.view === 'users') sub.textContent = label;
}

async function loadTx() {
  const qs = new URLSearchParams({ limit: 100, q: state.filters.tx, type: state.filters.txType, status: state.filters.txStatus });
  const j = await api('/portal/api/admin/transactions?' + qs);
  state.transactions = j.rows || [];
  renderTx();
  renderRecentTx();
}

async function loadAudit() {
  const j = await api('/portal/api/admin/audit?limit=100&q=' + encodeURIComponent(state.filters.audit));
  state.audit = j.rows || [];
  renderAudit();
}

async function loadAll() {
  try {
    await Promise.all([loadStats(), loadUsers(), loadTx(), loadAudit()]);
    if (window.lucide) lucide.createIcons();
  } catch (e) { toast(e.message, 'error'); }
}


// ─── RENDER ───
function renderChart(svgId, values) {
  const el = $(svgId); if (!el) return;
  const max = Math.max(...values, 1);
  const w = 600, h = 140, pad = 20;
  const step = (w - pad * 2) / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => `${pad + i * step},${h - pad - (v / max) * (h - pad * 2)}`).join(' ');
  el.innerHTML = `<defs><linearGradient id="${svgId}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".5"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></linearGradient></defs><polyline points="${pad},${h-pad} ${pts} ${w-pad},${h-pad}" fill="url(#${svgId}-g)" stroke="none"/><polyline points="${pts}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function renderInbox(stats) {
  const r = stats.revenue || {}, k = stats.keys || {}, u = stats.users || {};
  const items = [];
  if (Number(r.pending_tx) > 0) items.push({ dot: 'amber', text: `${num(r.pending_tx)} pending payment(s) need verification`, count: r.pending_tx, action: () => switchView('money') });
  if (Number(k.locked_keys) > 0) items.push({ dot: 'red', text: `${num(k.locked_keys)} locked key(s)`, count: k.locked_keys, action: () => { state.filters.keyChip = 'locked'; switchView('licenses'); } });
  if (Number(u.disabled_users) > 0) items.push({ dot: 'red', text: `${num(u.disabled_users)} disabled user(s)`, count: u.disabled_users, action: () => { state.filters.userChip = 'disabled'; switchView('users'); } });
  // Soon-expiring keys (client-side, computed when users load)
  const expiring = state.users.filter(u => u.active_keys > 0).length;
  if (expiring > 0) items.push({ dot: 'blue', text: `${num(expiring)} customer(s) with active licenses`, count: expiring, action: () => { state.filters.userChip = 'active'; switchView('users'); } });
  if (items.length === 0) items.push({ dot: 'blue', text: 'All systems healthy', count: '✓', action: () => {} });

  $('inbox').innerHTML = items.map((it, i) => `<div class="inbox-item" data-inbox="${i}"><span class="inbox-dot ${it.dot}"></span><span class="inbox-text">${esc(it.text)}</span><span class="inbox-count">${esc(it.count)}</span></div>`).join('');
  $$('#inbox .inbox-item').forEach((el, i) => el.onclick = items[i].action);
}

function filterUsersClient() {
  const q = state.filters.user.toLowerCase();
  const chip = state.filters.userChip;
  return state.users.filter(u => {
    if (q && !((u.username || '') + ' ' + (u.email || '') + ' ' + (u.first_name || '') + ' ' + (u.last_name || '')).toLowerCase().includes(q)) return false;
    if (chip === 'active' && u.status !== 'active') return false;
    if (chip === 'disabled' && u.status !== 'disabled') return false;
    if (chip === 'high' && (Number(u.balance_vnd) || 0) < 100000) return false;
    if (chip === 'zero' && (Number(u.balance_vnd) || 0) > 0) return false;
    return true;
  });
}

function renderUsers() {
  const rows = filterUsersClient();
  if (!rows.length) {
    $('usersBody').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No customers found</td></tr>';
    return;
  }
  $('usersBody').innerHTML = rows.map(u => {
    const checked = state.selectedUsers.has(u.id) ? 'checked' : '';
    const name = `${u.last_name || ''} ${u.first_name || ''}`.trim() || u.username || u.email || '—';
    return `<tr data-uid="${esc(u.id)}">
      <td><input type="checkbox" class="u-check" data-uid="${esc(u.id)}" ${checked} style="width:auto;min-height:auto"></td>
      <td><div class="user-cell"><div class="avatar">${esc(initials(name, u.email))}</div><div class="user-info"><div class="user-name">${esc(u.username || name)}</div><div class="user-email">${esc(u.email || '—')}</div></div></div></td>
      <td class="balance-cell ${balanceClass(u.balance_vnd)}">${fmt(u.balance_vnd)}</td>
      <td>${num(u.active_keys || 0)}<span style="color:var(--muted-2)">/${num(u.key_count || 0)}</span></td>
      <td style="color:var(--muted)">${esc(relTime(u.created_at))}</td>
      <td><span class="pill pill-${u.status}">${esc(u.status || 'active')}</span></td>
      <td style="text-align:right"><div class="row-actions">
        <button class="btn btn-xs btn-ghost" data-quick="50000" data-uid="${esc(u.id)}" title="+50k">+50k</button>
        <button class="btn btn-xs btn-ghost" data-quick="100000" data-uid="${esc(u.id)}" title="+100k">+100k</button>
        <button class="btn btn-xs btn-primary" data-open="${esc(u.id)}" title="Open"><i data-lucide="arrow-right" style="width:11px;height:11px"></i></button>
      </div></td>
    </tr>`;
  }).join('');
  $$('.u-check').forEach(el => el.onchange = e => { const id = e.target.dataset.uid; if (e.target.checked) state.selectedUsers.add(id); else state.selectedUsers.delete(id); updateBulkBar(); });
  $$('[data-open]').forEach(el => el.onclick = () => openUser(el.dataset.open));
  $$('[data-quick]').forEach(el => el.onclick = async (e) => { e.stopPropagation(); await quickCredit(el.dataset.uid, Number(el.dataset.quick)); });
  if (window.lucide) lucide.createIcons();
}

function updateBulkBar() {
  const n = state.selectedUsers.size;
  $('bulkBar').classList.toggle('show', n > 0);
  $('bulkCount').textContent = n + ' selected';
}

function renderTx() {
  const rows = state.transactions;
  if (!rows.length) {
    $('txBody').innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--muted)">No transactions found</td></tr>';
    return;
  }
  $('txBody').innerHTML = rows.map(t => `<tr>
    <td style="color:var(--muted)">${esc(relTime(t.created_at))}</td>
    <td><b>${esc(t.username || t.email || '—')}</b></td>
    <td><span class="pill" style="background:${txTypeBg(t.type)};color:${txTypeColor(t.type)};border-color:${txTypeColor(t.type)}33">${esc(t.type)}</span></td>
    <td class="balance-cell ${Number(t.amount_vnd) >= 0 ? 'balance-high' : 'balance-low'}">${Number(t.amount_vnd) >= 0 ? '+' : ''}${fmt(t.amount_vnd)}</td>
    <td>${fmt(t.balance_after)}</td>
    <td><span class="pill pill-${t.status}">${esc(t.status)}</span></td>
    <td class="mono" style="font-size:11px;color:var(--muted)">${esc(t.order_code || '—')}</td>
    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${esc(t.note || '—')}</td>
  </tr>`).join('');
}

function txTypeBg(t) { return ({ topup: 'rgba(16,185,129,.1)', spend: 'rgba(124,58,237,.1)', admin_credit: 'rgba(245,158,11,.1)', admin_debit: 'rgba(244,63,94,.1)' })[t] || 'rgba(255,255,255,.05)'; }
function txTypeColor(t) { return ({ topup: '#10b981', spend: '#a78bfa', admin_credit: '#f59e0b', admin_debit: '#f43f5e' })[t] || '#8892b0'; }

function renderRecentTx() {
  const rows = state.transactions.slice(0, 8);
  if (!rows.length) { $('recentTxBody').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--muted)">No recent activity</td></tr>'; return; }
  $('recentTxBody').innerHTML = rows.map(t => `<tr>
    <td style="color:var(--muted)">${esc(relTime(t.created_at))}</td>
    <td><b>${esc(t.username || t.email || '—')}</b></td>
    <td><span class="pill" style="background:${txTypeBg(t.type)};color:${txTypeColor(t.type)}">${esc(t.type)}</span></td>
    <td class="balance-cell ${Number(t.amount_vnd) >= 0 ? 'balance-high' : 'balance-low'}">${Number(t.amount_vnd) >= 0 ? '+' : ''}${fmt(t.amount_vnd)}</td>
    <td>${fmt(t.balance_after)}</td>
    <td><span class="pill pill-${t.status}">${esc(t.status)}</span></td>
    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${esc(t.note || '—')}</td>
  </tr>`).join('');
}

function renderAudit() {
  const rows = state.audit;
  if (!rows.length) { $('auditBody').innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--muted)">No audit logs</td></tr>'; return; }
  $('auditBody').innerHTML = rows.map(a => `<tr>
    <td style="color:var(--muted)">${esc(relTime(a.created_at))}</td>
    <td><b>${esc(a.actor_user_id || 'admin')}</b></td>
    <td><span class="pill pill-new">${esc(a.action || '')}</span></td>
    <td class="mono" style="font-size:11px">${esc(a.target_type || '')} ${esc(a.target_id || '')}</td>
    <td class="mono" style="font-size:11px;color:var(--muted);max-width:300px;overflow:hidden;text-overflow:ellipsis">${esc(a.metadata || '')}</td>
  </tr>`).join('');
}


// ─── UI HANDLERS ───
function switchView(v) {
  state.view = v;
  $$('.view').forEach(el => el.classList.toggle('active', el.id === 'v' + v[0].toUpperCase() + v.slice(1)));
  $$('.nav-item[data-view]').forEach(el => el.classList.toggle('active', el.dataset.view === v));
  $$('.mobile-nav button[data-view]').forEach(el => el.classList.toggle('active', el.dataset.view === v));
  const titles = { overview: 'Overview', users: 'Customers', money: 'Money', licenses: 'Licenses', audit: 'Audit' };
  $('pageTitle').textContent = titles[v] || v;
  if (window.lucide) lucide.createIcons();
  if (v === 'users') renderUsers();
  if (v === 'licenses') loadLicensesView();
}

// Lazy-fetch licenses for all users with key_count > 0.
// Backend doesn't have a list-all-licenses endpoint, so we aggregate via per-user detail.
async function loadLicensesView(force = false) {
  // If users haven't been loaded yet, do that first
  if (!state.users.length) {
    try { await loadUsers(); } catch (e) { toast(e.message, 'error'); return; }
  }

  const targets = state.users.filter(u => Number(u.key_count) > 0);
  const cacheAge = Date.now() - state.licensesLoadedAt;
  const cacheValid = !force && state.licensesLoadedAt > 0 && cacheAge < 60_000
    && targets.every(u => state.licenseCache.has(u.id));

  if (cacheValid) { renderLicensesView(); return; }
  if (state.licensesLoading) return;

  state.licensesLoading = true;
  renderLicensesLoading(0, targets.length);

  // Parallel fetch with concurrency 6 to be gentle on the worker
  const concurrency = 6;
  let done = 0;
  const queue = [...targets];
  async function worker() {
    while (queue.length) {
      const u = queue.shift();
      try {
        const j = await api('/portal/api/admin/users/' + encodeURIComponent(u.id));
        state.licenseCache.set(u.id, { licenses: j.licenses || [], user: j.user || u });
      } catch { state.licenseCache.set(u.id, { licenses: [], user: u }); }
      done++;
      renderLicensesLoading(done, targets.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, targets.length) }, worker));

  state.licensesLoading = false;
  state.licensesLoadedAt = Date.now();
  renderLicensesView();
}

function renderLicensesLoading(done, total) {
  if (!total) {
    $('keysBody').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">No customers with licenses yet.</td></tr>';
    return;
  }
  const pct = Math.floor((done / total) * 100);
  $('keysBody').innerHTML = `<tr><td colspan="7" style="padding:30px">
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--muted)">
      <div style="display:flex;align-items:center;gap:10px"><div class="spin" style="width:14px;height:14px;border:2px solid var(--line);border-top-color:var(--accent);border-radius:999px;animation:spin .8s linear infinite"></div><span>Loading licenses ${done}/${total} customers · ${pct}%</span></div>
      <div style="width:240px;height:4px;background:var(--surface-2);border-radius:999px;overflow:hidden"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#7c3aed,#22d3ee);transition:width .25s"></div></div>
    </div>
  </td></tr>`;
}

function renderLicensesView() {
  // Aggregate from cache
  const all = [];
  state.licenseCache.forEach((entry, uid) => {
    const userMeta = state.users.find(u => u.id === uid) || entry.user || {};
    const display = userMeta.username || userMeta.email || uid;
    (entry.licenses || []).forEach(l => all.push({ ...l, _user: display, _uid: uid }));
  });

  const q = state.filters.key.toLowerCase();
  const chip = state.filters.keyChip;
  const rows = all.filter(l => {
    if (q && !((l.license_key || '') + ' ' + (l.udid || '') + ' ' + (l._user || '')).toLowerCase().includes(q)) return false;
    if (chip === 'active' && l.status !== 'active') return false;
    if (chip === 'expired' && l.status !== 'expired') return false;
    if (chip === 'locked' && !l.locked) return false;
    return true;
  });

  // Update counter (if element exists)
  const counter = $('keysCount');
  if (counter) counter.textContent = `${rows.length} of ${all.length}`;

  if (!rows.length) {
    const empty = all.length ? 'No licenses match the current filter.' : 'No licenses found across all customers.';
    $('keysBody').innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">${empty}</td></tr>`;
    return;
  }

  $('keysBody').innerHTML = rows.map(l => `<tr>
    <td class="mono" style="font-size:11px;font-weight:700">${esc(l.license_key)}</td>
    <td><a href="#" data-open-user="${esc(l._uid)}" style="color:var(--text);text-decoration:none">${esc(l._user || '—')}</a></td>
    <td class="mono" style="font-size:10px;color:var(--muted);max-width:140px;overflow:hidden;text-overflow:ellipsis">${esc(l.udid || '—')}</td>
    <td>${esc(l.expires_at || '—')}</td>
    <td>${num(l.days_left || 0)}d</td>
    <td><span class="pill pill-${l.locked ? 'locked' : l.status}">${l.locked ? 'locked' : esc(l.status)}</span></td>
    <td style="text-align:right">
      <button class="btn btn-xs btn-ghost" onclick="showQR('${esc(l.license_key)}')">QR</button>
      <button class="btn btn-xs btn-warn" onclick="toggleLockKey('${esc(l.license_key)}', ${l.locked ? 0 : 1})">${l.locked ? 'Unlock' : 'Lock'}</button>
      <button class="btn btn-xs btn-bad" onclick="unbindKey('${esc(l.license_key)}')">Unbind</button>
    </td>
  </tr>`).join('');

  $$('#keysBody [data-open-user]').forEach(el => el.onclick = (e) => { e.preventDefault(); openUser(el.dataset.openUser); });
}
window.showQR = showQR;
window.toggleLockKey = async function(k, locked) {
  try {
    await api('/portal/api/admin/licenses/' + encodeURIComponent(k) + '/lock', { method: 'POST', body: JSON.stringify({ locked: !!locked }) });
    toast('License ' + (locked ? 'locked' : 'unlocked'), 'success');
    state.licensesLoadedAt = 0; // invalidate cache so next view fetch is fresh
    await loadStats();
    if (state.view === 'licenses') await loadLicensesView(true);
  } catch (e) { toast(e.message, 'error'); }
};
window.unbindKey = async function(k) {
  if (!confirm('Unbind ' + k + ' from device?')) return;
  try {
    await api('/portal/api/admin/licenses/' + encodeURIComponent(k) + '/unbind', { method: 'POST' });
    toast('License unbound', 'success');
    state.licensesLoadedAt = 0;
    await loadStats();
    if (state.view === 'licenses') await loadLicensesView(true);
  } catch (e) { toast(e.message, 'error'); }
};

async function quickCredit(uid, amount) {
  try {
    await api('/portal/api/admin/users/' + encodeURIComponent(uid) + '/wallet-adjust', { method: 'POST', body: JSON.stringify({ amount_vnd: amount, note: `Quick credit ${fmt(amount)}` }) });
    toast('Credited ' + fmt(amount), 'success');
    await loadUsers();
    await loadStats();
  } catch (e) { toast(e.message, 'error'); }
}

async function openUser(id) {
  try {
    const j = await api('/portal/api/admin/users/' + encodeURIComponent(id));
    state.currentUser = { ...j.user, transactions: j.transactions || [], licenses: j.licenses || [] };
    const u = state.currentUser;
    $('soTitle').innerHTML = `<div style="display:flex;align-items:center;gap:10px"><div class="avatar">${esc(initials((u.last_name || '') + ' ' + (u.first_name || ''), u.email))}</div><div><div>${esc(u.username || u.email)}</div><div style="font-size:11px;color:var(--muted);font-weight:500">${esc(u.email || '')}</div></div></div>`;
    renderSlideOver();
    $('slideover').classList.add('open');
    $('soBackdrop').classList.add('open');
    if (window.lucide) lucide.createIcons();
  } catch (e) { toast(e.message, 'error'); }
}
function closeSlideOver() {
  $('slideover').classList.remove('open');
  $('soBackdrop').classList.remove('open');
  state.currentUser = null;
}

function renderSlideOver() {
  const u = state.currentUser;
  if (!u) return;
  // Overview pane
  $('soOverview').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
      <div class="kpi"><div class="kpi-label">Balance</div><div class="kpi-value ${balanceClass(u.balance_vnd)}" style="font-size:20px">${fmt(u.balance_vnd)}</div></div>
      <div class="kpi"><div class="kpi-label">Active Keys</div><div class="kpi-value" style="font-size:20px">${num(u.licenses.filter(l => l.status === 'active').length)}</div><div class="kpi-sub">of ${num(u.licenses.length)} total</div></div>
    </div>
    <div style="display:grid;gap:8px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--muted)">Status</span><span class="pill pill-${u.status}">${esc(u.status)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--muted)">Name</span><b>${esc((u.last_name || '') + ' ' + (u.first_name || ''))}</b></div>
      <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--muted)">Joined</span><span>${esc(u.created_at || '—')}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:12px"><span style="color:var(--muted)">User ID</span><span class="mono" style="font-size:10px">${esc(u.id)}</span></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-sm ${u.status === 'active' ? 'btn-bad' : 'btn-good'}" onclick="toggleUserStatus()">${u.status === 'active' ? '<i data-lucide="ban"></i>Disable' : '<i data-lucide="check-circle"></i>Enable'}</button>
      <button class="btn btn-sm btn-ghost" onclick="document.querySelector('.so-tab[data-sotab=wallet]').click()"><i data-lucide="wallet"></i>Adjust Wallet</button>
    </div>
  `;
  // Wallet pane
  $('soWallet').innerHTML = `
    <div style="padding:14px;background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-md);margin-bottom:14px">
      <div style="font-size:11px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px">Quick Credit</div>
      <div class="preset-grid">
        <button class="preset" data-amt="10000">+10k</button>
        <button class="preset" data-amt="50000">+50k</button>
        <button class="preset" data-amt="100000">+100k</button>
        <button class="preset" data-amt="500000">+500k</button>
        <button class="preset" data-amt="1000000">+1M</button>
      </div>
      <div style="font-size:11px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 8px">Quick Debit</div>
      <div class="preset-grid">
        <button class="preset negative" data-amt="-10000">−10k</button>
        <button class="preset negative" data-amt="-50000">−50k</button>
        <button class="preset negative" data-amt="-100000">−100k</button>
      </div>
      <div style="font-size:11px;color:var(--muted);font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin:14px 0 8px">Custom amount</div>
      <div style="display:flex;gap:8px">
        <input id="soAmt" type="number" placeholder="VND (+/-)" style="flex:1">
        <input id="soNote" placeholder="Reason" style="flex:1.5">
        <button class="btn btn-sm btn-primary" onclick="applyCustomWallet()">Apply</button>
      </div>
    </div>
    <div class="tablewrap" style="border:1px solid var(--line);border-radius:var(--r-md)">
      <table><thead><tr><th>Time</th><th>Type</th><th>Amount</th><th>Note</th></tr></thead><tbody>
      ${u.transactions.length ? u.transactions.map(t => `<tr><td style="color:var(--muted)">${esc(relTime(t.created_at))}</td><td><span class="pill" style="background:${txTypeBg(t.type)};color:${txTypeColor(t.type)}">${esc(t.type)}</span></td><td class="balance-cell ${Number(t.amount_vnd) >= 0 ? 'balance-high' : 'balance-low'}">${Number(t.amount_vnd) >= 0 ? '+' : ''}${fmt(t.amount_vnd)}</td><td>${esc(t.note || '—')}</td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--muted)">No transactions</td></tr>'}
      </tbody></table>
    </div>
  `;
  $$('#soWallet .preset').forEach(b => b.onclick = () => applyWalletPreset(Number(b.dataset.amt)));

  // Licenses pane
  $('soLicenses').innerHTML = `
    <div class="tablewrap" style="border:1px solid var(--line);border-radius:var(--r-md)">
      <table><thead><tr><th>Key</th><th>Label</th><th>Expires</th><th>Status</th><th style="text-align:right">Actions</th></tr></thead><tbody>
      ${u.licenses.length ? u.licenses.map(l => `<tr>
        <td class="mono" style="font-size:11px;font-weight:700">${esc(l.license_key)}</td>
        <td>${esc(l.label || '—')}</td>
        <td>${esc(l.expires_at || '—')}</td>
        <td><span class="pill pill-${l.locked ? 'locked' : l.status}">${l.locked ? 'locked' : esc(l.status)}</span></td>
        <td style="text-align:right">
          <button class="btn btn-xs btn-ghost" onclick="showQR('${esc(l.license_key)}')">QR</button>
          <button class="btn btn-xs btn-warn" onclick="soToggleLock('${esc(l.license_key)}',${l.locked ? 0 : 1})">${l.locked ? 'Unlock' : 'Lock'}</button>
          <button class="btn btn-xs btn-bad" onclick="soUnbind('${esc(l.license_key)}')">Unbind</button>
        </td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--muted)">No licenses</td></tr>'}
      </tbody></table>
    </div>
  `;

  // Activity pane (transactions as timeline)
  $('soActivity').innerHTML = u.transactions.length ? `<div style="display:grid;gap:10px">${u.transactions.map(t => `<div style="display:flex;gap:12px;padding:12px;background:var(--surface-2);border-radius:var(--r-md);border:1px solid var(--line)"><div style="width:8px;height:8px;border-radius:999px;background:${txTypeColor(t.type)};margin-top:6px;flex-shrink:0"></div><div style="flex:1"><div style="font-weight:700;font-size:12px">${esc(t.type)} · ${Number(t.amount_vnd) >= 0 ? '+' : ''}${fmt(t.amount_vnd)}</div><div style="font-size:11px;color:var(--muted);margin-top:2px">${esc(t.note || '')} · ${esc(relTime(t.created_at))}</div></div></div>`).join('')}</div>` : '<div style="text-align:center;padding:30px;color:var(--muted)">No activity</div>';
  if (window.lucide) lucide.createIcons();
}

async function applyWalletPreset(amt) {
  const u = state.currentUser; if (!u) return;
  try {
    await api('/portal/api/admin/users/' + encodeURIComponent(u.id) + '/wallet-adjust', { method: 'POST', body: JSON.stringify({ amount_vnd: amt, note: `Preset ${amt > 0 ? '+' : ''}${fmt(amt)}` }) });
    toast((amt > 0 ? 'Credited ' : 'Debited ') + fmt(Math.abs(amt)), 'success');
    await openUser(u.id); await loadStats(); await loadUsers();
  } catch (e) { toast(e.message, 'error'); }
}
window.applyCustomWallet = async function() {
  const u = state.currentUser; if (!u) return;
  const amt = Number($('soAmt').value);
  const note = $('soNote').value.trim() || 'Manual adjustment';
  if (!amt) { toast('Enter amount', 'error'); return; }
  try {
    await api('/portal/api/admin/users/' + encodeURIComponent(u.id) + '/wallet-adjust', { method: 'POST', body: JSON.stringify({ amount_vnd: amt, note }) });
    toast('Wallet updated', 'success');
    await openUser(u.id); await loadStats(); await loadUsers();
  } catch (e) { toast(e.message, 'error'); }
};
window.toggleUserStatus = async function() {
  const u = state.currentUser; if (!u) return;
  const next = u.status === 'active' ? 'disabled' : 'active';
  try {
    await api('/portal/api/admin/users/' + encodeURIComponent(u.id) + '/status', { method: 'POST', body: JSON.stringify({ status: next }) });
    toast('User ' + next, 'success');
    await openUser(u.id); await loadStats(); await loadUsers();
  } catch (e) { toast(e.message, 'error'); }
};
window.soToggleLock = async function(k, locked) {
  try {
    await api('/portal/api/admin/licenses/' + encodeURIComponent(k) + '/lock', { method: 'POST', body: JSON.stringify({ locked: !!locked }) });
    toast('License ' + (locked ? 'locked' : 'unlocked'), 'success');
    if (state.currentUser) await openUser(state.currentUser.id);
  } catch (e) { toast(e.message, 'error'); }
};
window.soUnbind = async function(k) {
  if (!confirm('Unbind ' + k + ' from device?')) return;
  try {
    await api('/portal/api/admin/licenses/' + encodeURIComponent(k) + '/unbind', { method: 'POST' });
    toast('License unbound', 'success');
    if (state.currentUser) await openUser(state.currentUser.id);
  } catch (e) { toast(e.message, 'error'); }
};

// Bulk operations
async function bulkCredit() {
  const ids = [...state.selectedUsers]; if (!ids.length) return;
  const amt = Number(prompt('Amount to credit each of ' + ids.length + ' user(s) (VND):', '50000'));
  if (!amt) return;
  let ok = 0, err = 0;
  for (const id of ids) {
    try { await api('/portal/api/admin/users/' + encodeURIComponent(id) + '/wallet-adjust', { method: 'POST', body: JSON.stringify({ amount_vnd: amt, note: 'Bulk credit' }) }); ok++; }
    catch { err++; }
  }
  toast(`Bulk done: ${ok} ok, ${err} failed`, err ? 'error' : 'success');
  state.selectedUsers.clear(); updateBulkBar();
  await loadUsers(); await loadStats();
}
async function bulkDisable() {
  const ids = [...state.selectedUsers]; if (!ids.length) return;
  if (!confirm('Disable ' + ids.length + ' user(s)?')) return;
  let ok = 0, err = 0;
  for (const id of ids) {
    try { await api('/portal/api/admin/users/' + encodeURIComponent(id) + '/status', { method: 'POST', body: JSON.stringify({ status: 'disabled' }) }); ok++; }
    catch { err++; }
  }
  toast(`Bulk done: ${ok} ok, ${err} failed`, err ? 'error' : 'success');
  state.selectedUsers.clear(); updateBulkBar();
  await loadUsers(); await loadStats();
}
function exportCsv() {
  const rows = filterUsersClient();
  const header = ['username', 'email', 'first_name', 'last_name', 'balance_vnd', 'key_count', 'active_keys', 'status', 'created_at'];
  const csv = [header.join(',')].concat(rows.map(r => header.map(h => JSON.stringify(r[h] == null ? '' : r[h])).join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'customers-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  toast('CSV exported', 'success');
}

// Command Palette
function openCmd() { $('cmdOverlay').classList.add('open'); $('cmdInput').value = ''; $('cmdInput').focus(); state.cmdSelected = 0; renderCmdResults(''); }
function closeCmd() { $('cmdOverlay').classList.remove('open'); }
function renderCmdResults(q) {
  q = q.toLowerCase().trim();
  const items = [];
  // Quick views
  if (!q || 'home overview dashboard'.includes(q)) items.push({ icon: 'layout-dashboard', title: 'Go to Overview', sub: 'Dashboard & alerts', action: () => switchView('overview') });
  if (!q || 'customers users'.includes(q)) items.push({ icon: 'users', title: 'Go to Customers', sub: 'User management', action: () => switchView('users') });
  if (!q || 'money revenue transactions'.includes(q)) items.push({ icon: 'wallet', title: 'Go to Money', sub: 'Revenue & transactions', action: () => switchView('money') });
  if (!q || 'licenses keys'.includes(q)) items.push({ icon: 'key-round', title: 'Go to Licenses', sub: 'License management', action: () => switchView('licenses') });
  if (!q || 'audit log'.includes(q)) items.push({ icon: 'scroll-text', title: 'Go to Audit', sub: 'Activity logs', action: () => switchView('audit') });
  // Users matching
  if (q) state.users.filter(u => ((u.username || '') + ' ' + (u.email || '')).toLowerCase().includes(q)).slice(0, 6).forEach(u => {
    items.push({ icon: 'user', title: u.username || u.email, sub: fmt(u.balance_vnd) + ' · ' + (u.email || ''), action: () => { closeCmd(); switchView('users'); openUser(u.id); } });
  });
  // Refresh
  if (!q || 'refresh reload'.includes(q)) items.push({ icon: 'refresh-cw', title: 'Refresh data', sub: 'Reload all panels', action: () => { closeCmd(); loadAll(); } });
  // Logout
  if (!q || 'logout signout'.includes(q)) items.push({ icon: 'log-out', title: 'Logout', sub: 'Sign out of admin', action: doLogout });

  state.cmdItems = items;
  state.cmdSelected = 0;
  $('cmdResults').innerHTML = items.length ? items.map((it, i) => `<div class="cmd-item ${i === 0 ? 'selected' : ''}" data-cmd="${i}"><div class="cmd-item-icon"><i data-lucide="${it.icon}" style="width:14px;height:14px"></i></div><div class="cmd-item-text"><div class="cmd-item-title">${esc(it.title)}</div><div class="cmd-item-sub">${esc(it.sub)}</div></div></div>`).join('') : '<div style="padding:20px;text-align:center;color:var(--muted);font-size:12px">No results</div>';
  $$('#cmdResults .cmd-item').forEach((el, i) => { el.onclick = () => { items[i].action(); if (!items[i].title.startsWith('Go to')) closeCmd(); else closeCmd(); }; });
  if (window.lucide) lucide.createIcons();
}

// Auth
async function doLogin() {
  try {
    const j = await api('/portal/api/admin/login', { method: 'POST', body: JSON.stringify({ username: $('loginUser').value, password: $('loginPass').value }) });
    state.token = j.token;
    localStorage.setItem('admin_token', state.token);
    showApp(true);
    await loadAll();
  } catch (e) {
    $('loginMsg').textContent = e.message;
  }
}
function doLogout() {
  localStorage.removeItem('admin_token');
  state.token = '';
  showApp(false);
}
function showApp(on) {
  $('loginPage').classList.toggle('hide', on);
  $('appShell').classList.toggle('hide', !on);
  if (window.lucide) setTimeout(() => lucide.createIcons(), 0);
}


// ─── INIT ───
function bindEvents() {
  // Login
  $('loginBtn').onclick = doLogin;
  $('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
  $('logoutBtn').onclick = doLogout;

  // Nav
  $$('.nav-item[data-view]').forEach(b => b.onclick = () => switchView(b.dataset.view));
  $$('.mobile-nav button[data-view]').forEach(b => b.onclick = () => switchView(b.dataset.view));

  // Topbar
  $('refreshBtn').onclick = loadAll;
  $('cmdTrigger').onclick = openCmd;

  // Users filters
  $('userSearch').addEventListener('input', e => { state.filters.user = e.target.value; renderUsers(); });
  $$('#vUsers .chip').forEach(c => c.onclick = () => { $$('#vUsers .chip').forEach(x => x.classList.remove('active')); c.classList.add('active'); state.filters.userChip = c.dataset.filter; renderUsers(); });
  $('selectAll').onchange = e => {
    if (e.target.checked) filterUsersClient().forEach(u => state.selectedUsers.add(u.id));
    else state.selectedUsers.clear();
    renderUsers(); updateBulkBar();
  };
  $('bulkAll').onchange = e => { $('selectAll').checked = e.target.checked; $('selectAll').onchange({ target: e.target }); };
  $('bulkClear').onclick = () => { state.selectedUsers.clear(); renderUsers(); updateBulkBar(); };
  $('bulkCredit').onclick = bulkCredit;
  $('bulkDisable').onclick = bulkDisable;
  $('exportCsv').onclick = exportCsv;

  // Tx filters
  $('txSearch').addEventListener('input', e => { state.filters.tx = e.target.value; });
  $('txTypeFilter').onchange = e => { state.filters.txType = e.target.value; };
  $('txStatusFilter').onchange = e => { state.filters.txStatus = e.target.value; };
  $('txFilterBtn').onclick = () => loadTx();

  // Keys filters
  $('keySearch').addEventListener('input', e => { state.filters.key = e.target.value; renderLicensesView(); });
  $$('#vLicenses .chip').forEach(c => c.onclick = () => { $$('#vLicenses .chip').forEach(x => x.classList.remove('active')); c.classList.add('active'); state.filters.keyChip = c.dataset.kfilter; renderLicensesView(); });
  const keysRefresh = $('keysRefresh');
  if (keysRefresh) keysRefresh.onclick = () => loadLicensesView(true);

  // Audit
  $('auditSearch').addEventListener('input', e => { state.filters.audit = e.target.value; });
  $('auditFilterBtn').onclick = () => loadAudit();

  // Slide-over
  $('soClose').onclick = closeSlideOver;
  $('soBackdrop').onclick = closeSlideOver;
  $$('.so-tab').forEach(t => t.onclick = () => {
    $$('.so-tab').forEach(x => x.classList.remove('active'));
    $$('.so-pane').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    $('so' + t.dataset.sotab[0].toUpperCase() + t.dataset.sotab.slice(1)).classList.add('active');
    if (window.lucide) lucide.createIcons();
  });

  // Command palette
  $('cmdInput').addEventListener('input', e => renderCmdResults(e.target.value));
  $('cmdInput').addEventListener('keydown', e => {
    if (!state.cmdItems) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); state.cmdSelected = Math.min(state.cmdSelected + 1, state.cmdItems.length - 1); updateCmdSelection(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); state.cmdSelected = Math.max(state.cmdSelected - 1, 0); updateCmdSelection(); }
    if (e.key === 'Enter') { e.preventDefault(); state.cmdItems[state.cmdSelected]?.action(); closeCmd(); }
  });

  // Global keyboard
  document.addEventListener('keydown', e => {
    const key = typeof e.key === 'string' ? e.key : '';
    if ((e.metaKey || e.ctrlKey) && key === 'k') { e.preventDefault(); openCmd(); return; }
    if (key === 'Escape') { closeCmd(); closeQR(); closeSlideOver(); return; }
    // Skip view shortcuts when typing in input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    const map = { '1': 'overview', '2': 'users', '3': 'money', '4': 'licenses', '5': 'audit' };
    if (map[key]) { e.preventDefault(); switchView(map[key]); }
    if (key.toLowerCase() === 'r') { e.preventDefault(); loadAll(); }
  });
}
function updateCmdSelection() {
  $$('#cmdResults .cmd-item').forEach((el, i) => el.classList.toggle('selected', i === state.cmdSelected));
  $$('#cmdResults .cmd-item')[state.cmdSelected]?.scrollIntoView({ block: 'nearest' });
}

// Bootstrap
bindEvents();
if (state.token) {
  api('/portal/api/admin/me').then(() => { showApp(true); loadAll(); }).catch(() => { state.token = ''; localStorage.removeItem('admin_token'); showApp(false); });
} else {
  showApp(false);
}
if (window.lucide) lucide.createIcons();

