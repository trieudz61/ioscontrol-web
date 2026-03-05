// IOSControl Docs — Rendering Engine with i18n + Theme Toggle
(function() {
  const sidebar = document.getElementById('sidebarNav');
  const sidebarHeader = document.getElementById('sidebarHeader');
  const content = document.getElementById('content');
  const searchInput = document.getElementById('searchInput');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const langToggle = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');

  // State
  let currentLang = localStorage.getItem('icontrol-lang') || 'en';
  let currentTheme = localStorage.getItem('icontrol-theme') || 'dark';

  // Helper: get localized text
  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'function') return obj;
    return obj[currentLang] || obj['en'] || '';
  }

  // Helper: get UI string
  function ui(key) {
    return UI_STRINGS[currentLang][key] || UI_STRINGS['en'][key] || key;
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeIcon.innerHTML = `<i data-lucide="${currentTheme === 'dark' ? 'moon' : 'sun'}" style="width:16px;height:16px;"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    localStorage.setItem('icontrol-theme', currentTheme);
  }

  // Apply language
  function applyLang() {
    langLabel.textContent = currentLang.toUpperCase();
    searchInput.placeholder = ui('searchPlaceholder');
    sidebarHeader.textContent = ui('apiRef');
    localStorage.setItem('icontrol-lang', currentLang);
  }

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });

  // Language toggle
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'vi' : 'en';
    applyLang();
    buildSidebar();
    buildContent();
    initScrollSpy();
  });

  // Build sidebar
  function buildSidebar() {
    let html = '';
    // Guide section
    html += '<div class="sidebar-header" style="margin-top:8px">GUIDE</div>';
    GUIDE_SECTIONS.forEach(g => {
      html += `<a href="#guide-${g.id}" class="sidebar-link sidebar-guide-link">${t(g.title)}</a>`;
    });
    html += `<div class="sidebar-header" style="margin-top:16px">${ui('apiRef')}</div>`;
    API_SECTIONS.forEach(s => {
      html += `<div class="sidebar-section">
        <a href="#${s.id}" class="sidebar-section-title"><span class="icon">${s.icon}</span> ${t(s.title)}</a>`;
      s.apis.forEach(a => {
        const shortName = a.name.split('(')[0];
        html += `<a href="#${s.id}-${shortName}" class="sidebar-link">${shortName}</a>`;
      });
      html += '</div>';
    });
    sidebar.innerHTML = html;
  }

  // Syntax highlight code
  function hl(code) {
    // Tokenize first, then wrap — avoids regex conflicts
    const KW = /^(local|if|then|end|for|do|while|function|return|in|else|elseif|not|and|or|true|false|nil|import|from|def|class|pass|break|continue|const|new)$/;
    const FN = /^(tap|swipe|sleep|log|getColor|findColor|findColors|findImage|screenshot|ocrText|ocrFind|waitForColor|waitForImage|waitForText|appRun|appKill|appState|openURL|inputText|toast|alert|vibrate|httpGet|httpPost|recordStart|recordStop|recordPlay|pinch|rotate|screenSize|deviceInfo|randomInt|randomFloat|randomSleep|getClipboard|setClipboard|readFile|writeFile|appendFile|jsonDecode|jsonEncode|wifiInfo|schedule|scheduleAfter|onNotification|recordSave|recordLoad|usleep|longPress|touchDown|touchMove|touchUp|keyDown|keyUp|getColors|tapImage|tapText|swipeUntilImage|swipeUntilText|dialogInput|dialogChoice|showOverlay|updateOverlay|hideOverlay|timestamp|md5|setCellularData|setAirplaneMode|getIP|getLocalIP|deleteScreenshot|convertBase64|saveToSystemAlbum|keepAwake|execute|stop|getSN|getVersion|frontMostAppId|getOrientation|getScreenResolution|intToRgb|rgbToInt|copyText|clipText|math\.rad|math\.cos|math\.sin|string\.format|os\.date|os\.time|ipairs|pairs|tonumber|tostring|type|print)$/;
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    // Tokenizer regex — order matters (comments first, then strings, numbers, words, operators, rest)
    const tok = /(--.*)|(\"(?:[^\"\\]|\\.)*\")|('(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|(\b[a-zA-Z_][\w.]*\b)|(==|~=|!=|>=|<=|\.\.|\.\.|=>)|(\S)/g;
    let out = '', m;
    let last = 0;
    while ((m = tok.exec(code)) !== null) {
      // Add any whitespace/gap between tokens
      if (m.index > last) out += esc(code.slice(last, m.index));
      last = m.index + m[0].length;
      if (m[1]) { out += '<span class="cm">' + esc(m[1]) + '</span>'; }
      else if (m[2]) { out += '<span class="str">' + esc(m[2]) + '</span>'; }
      else if (m[3]) { out += '<span class="str">' + esc(m[3]) + '</span>'; }
      else if (m[4]) { out += '<span class="num">' + esc(m[4]) + '</span>'; }
      else if (m[5]) {
        if (KW.test(m[5])) out += '<span class="kw">' + esc(m[5]) + '</span>';
        else if (FN.test(m[5])) out += '<span class="fn">' + esc(m[5]) + '</span>';
        else out += esc(m[5]);
      }
      else if (m[6]) { out += '<span class="op">' + esc(m[6]) + '</span>'; }
      else { out += esc(m[0]); }
    }
    if (last < code.length) out += esc(code.slice(last));
    return out;
  }

  // Python syntax highlight
  function hlPy(code) {
    const KW = /^(if|else|elif|for|while|def|class|return|import|from|as|in|not|and|or|True|False|None|try|except|finally|with|pass|break|continue|yield|lambda|raise|assert|del|global|nonlocal|is)$/;
    const FN = /^(tap|swipe|sleep|log|get_color|find_color|find_colors|find_image|screenshot|ocr_text|ocr_find|wait_for_color|wait_for_image|wait_for_text|app_run|app_kill|app_state|open_url|input_text|toast|alert|vibrate|http_get|http_post|record_start|record_stop|record_play|pinch|rotate|screen_size|device_info|random_int|random_float|random_sleep|get_clipboard|set_clipboard|read_file|write_file|json_decode|json_encode|wifi_info|schedule|schedule_after|on_notification|record_save|record_load|usleep|long_press|touch_down|touch_move|touch_up|key_down|key_up|get_colors|print|range|len|str|int|float|type|isinstance|enumerate|zip|map|filter|format|open)$/;
    const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const tok = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?''')|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|(\b[a-zA-Z_]\w*\b)|(==|!=|>=|<=|->|\+=|-=|\*=|\/=|\/\/|:=)|(\S)/g;
    let out = '', m, last = 0;
    while ((m = tok.exec(code)) !== null) {
      if (m.index > last) out += esc(code.slice(last, m.index));
      last = m.index + m[0].length;
      if (m[1]) { out += '<span class="cm">' + esc(m[1]) + '</span>'; }
      else if (m[2]) { out += '<span class="str">' + esc(m[2]) + '</span>'; }
      else if (m[3]) { out += '<span class="str">' + esc(m[3]) + '</span>'; }
      else if (m[4]) { out += '<span class="str">' + esc(m[4]) + '</span>'; }
      else if (m[5]) { out += '<span class="num">' + esc(m[5]) + '</span>'; }
      else if (m[6]) {
        if (KW.test(m[6])) out += '<span class="kw">' + esc(m[6]) + '</span>';
        else if (FN.test(m[6])) out += '<span class="fn">' + esc(m[6]) + '</span>';
        else out += esc(m[6]);
      }
      else if (m[7]) { out += '<span class="op">' + esc(m[7]) + '</span>'; }
      else { out += esc(m[0]); }
    }
    if (last < code.length) out += esc(code.slice(last));
    return out;
  }

  // Build content
  function buildContent() {
    let totalAPIs = 0;
    API_SECTIONS.forEach(s => totalAPIs += s.apis.length);

    let html = `<div class="docs-intro">
      <h1>${ui('introTitle')} <span>${ui('introTitleHL')}</span></h1>
      <p>${ui('introDesc')(totalAPIs, API_SECTIONS.length)}</p>
      <div class="quick-start">
        <div class="qs-card"><div class="qs-icon"><i data-lucide="package" style="width:24px;height:24px;"></i></div><h4>${ui('qs1Title')}</h4><p>${ui('qs1Desc')}</p></div>
        <div class="qs-card"><div class="qs-icon"><i data-lucide="hand" style="width:24px;height:24px;"></i></div><h4>${ui('qs2Title')}</h4><p>${ui('qs2Desc')}</p></div>
        <div class="qs-card"><div class="qs-icon"><i data-lucide="zap" style="width:24px;height:24px;"></i></div><h4>${ui('qs3Title')}</h4><p>${ui('qs3Desc')}</p></div>
        <div class="qs-card"><div class="qs-icon"><i data-lucide="wifi" style="width:24px;height:24px;"></i></div><h4>${ui('qs4Title')}</h4><p>${ui('qs4Desc')}</p></div>
        <div class="qs-card"><div class="qs-icon"><i data-lucide="bar-chart-2" style="width:24px;height:24px;"></i></div><h4>${ui('qs5Title')}</h4><p>${ui('qs5Desc')}</p></div>
        <div class="qs-card"><div class="qs-icon"><i data-lucide="message-square" style="width:24px;height:24px;"></i></div><h4>${ui('qs6Title')}</h4><p>${ui('qs6Desc')}</p></div>
      </div>
    </div>`;

    // ═══ Guide Section ═══
    html += '<div class="guide-container">';
    GUIDE_SECTIONS.forEach((g, idx) => {
      html += `<div class="guide-card" id="guide-${g.id}">
        <div class="guide-card-header" onclick="this.parentElement.classList.toggle('open')">
          <span class="guide-icon">${g.icon}</span>
          <span class="guide-chapter">${idx + 1}.</span>
          <span class="guide-title">${t(g.title)}</span>
          <span class="guide-chevron"><i data-lucide="chevron-down" style="width:16px;height:16px;"></i></span>
        </div>
        <div class="guide-card-body">${t(g.content)}</div>
      </div>`;
    });
    html += '</div>';

    // ═══ API Sections Divider ═══
    html += `<div class="api-divider"><span>${ui('apiRef')}</span></div>`;

    API_SECTIONS.forEach(s => {
      html += `<div class="api-section" id="${s.id}">
        <h2><span class="sec-icon">${s.icon}</span> ${t(s.title)}</h2>
        <p>${t(s.desc)}</p>`;

      s.apis.forEach(a => {
        const shortName = a.name.split('(')[0];
        const methodClass = a.type === 'get' ? 'method-get' : a.type === 'post' ? 'method-post' : a.type === 'ws' ? 'method-ws' : 'method-func';
        const methodLabel = a.type === 'get' ? 'GET' : a.type === 'post' ? 'POST' : a.type === 'ws' ? 'WS' : '𝑓';

        html += `<div class="api-card" id="${s.id}-${shortName}">
          <div class="api-card-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="api-method ${methodClass}">${methodLabel}</span>
            <span class="api-name">${a.name}</span>
            <span class="api-desc-short">${t(a.desc)}</span>
          </div>
          <div class="api-card-body">`;

        // Description
        html += `<p style="color:var(--text-dim);font-size:14px;margin-bottom:16px">${t(a.desc)}</p>`;

        // Params
        if (a.params && a.params.length > 0) {
          html += `<div class="params-title">${ui('parameters')}</div>
            <table class="params-table"><thead><tr><th>${ui('name')}</th><th>${ui('type')}</th><th>${ui('description')}</th></tr></thead><tbody>`;
          a.params.forEach(p => {
            const reqBadge = p.req ? `<span class="param-required">${ui('required')}</span>` : `<span class="param-optional">${ui('optional')}</span>`;
            html += `<tr><td>${p.n} ${reqBadge}</td><td>${p.t}</td><td>${t(p.d)}</td></tr>`;
          });
          html += '</tbody></table>';
        }

        // Returns
        if (a.ret) {
          html += `<div class="returns"><div class="returns-title">${ui('returns')}</div><p><code>${t(a.ret)}</code></p></div>`;
        }

        // Example (side-by-side Python | Lua)
        if (a.example || a.example_py) {
          const isRest = a.type === 'get' || a.type === 'post' || a.type === 'ws';
          if (isRest) {
            // REST/WS: single column
            html += `<div class="code-block"><div class="code-block-header"><span><i data-lucide="file-code" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;"></i>${ui('example')} — Shell</span></div><pre>${hl(a.example)}</pre></div>`;
          } else if (a.example_py && a.example) {
            // Side-by-side Python | Lua
            html += `<div class="code-side-by-side">
              <div class="code-block code-half"><div class="code-block-header"><span><i data-lucide="file-code" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;"></i>Python</span></div><pre>${hlPy(a.example_py)}</pre></div>
              <div class="code-block code-half"><div class="code-block-header"><span><i data-lucide="moon" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;"></i>Lua</span></div><pre>${hl(a.example)}</pre></div>
            </div>`;
          } else {
            // Fallback: single column
            const lang = a.example_py ? 'Python' : 'Lua';
            const code = a.example_py || a.example;
            const hlfn = a.example_py ? hlPy : hl;
            html += `<div class="code-block"><div class="code-block-header"><span><i data-lucide="file-code" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;"></i>${ui('example')} — ${lang}</span></div><pre>${hlfn(code)}</pre></div>`;
          }
        }

        // REST endpoint
        if (a.rest && a.type === 'func') {
          html += `<div class="code-block"><div class="code-block-header"><span><i data-lucide="plug" style="width:13px;height:13px;vertical-align:-2px;margin-right:4px;"></i>${ui('restEndpoint')}</span></div><pre style="color:var(--green)">${a.rest}</pre></div>`;
        }

        // Tags
        if (a.tags) {
          html += '<div class="api-tags">';
          a.tags.forEach(tg => {
            if (tg === 'new') html += `<span class="api-tag tag-new">${ui('tagNew')}</span>`;
            if (tg === 'exclusive') html += `<span class="api-tag tag-exclusive">${ui('tagExclusive')}</span>`;
            if (tg === 'advanced') html += `<span class="api-tag tag-advanced">${ui('tagAdvanced')}</span>`;
          });
          html += '</div>';
        }

        html += '</div></div>';
      });

      html += '</div>';
    });

    content.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Search
  let searchResults;
  function initSearch() {
    const wrapper = document.querySelector('.nav-search');
    // Remove old search results if any
    const old = wrapper.querySelector('.search-results');
    if (old) old.remove();

    searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    wrapper.appendChild(searchResults);

    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('blur', () => setTimeout(() => searchResults.classList.remove('visible'), 200));
    document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInput.focus(); } });
  }

  function handleSearch() {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { searchResults.classList.remove('visible'); return; }

    let matches = [];
    API_SECTIONS.forEach(s => {
      s.apis.forEach(a => {
        const descText = t(a.desc).toLowerCase();
        if (a.name.toLowerCase().includes(q) || descText.includes(q)) {
          const shortName = a.name.split('(')[0];
          matches.push({ name: a.name, desc: t(a.desc), href: `#${s.id}-${shortName}`, icon: s.icon });
        }
      });
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-dim);font-size:13px">${ui('noResults')}</div>`;
    } else {
      searchResults.innerHTML = matches.slice(0, 10).map(m =>
        `<a class="search-result-item" href="${m.href}" onclick="handleSearchClick(event, '${m.href}')">
          <span>${m.icon}</span>
          <span class="sr-name">${m.name}</span>
          <span class="sr-desc">${m.desc}</span>
        </a>`
      ).join('');
    }
    searchResults.classList.add('visible');
  }

  window.handleSearchClick = function(e, href) {
    e.preventDefault();
    searchResults.classList.remove('visible');
    searchInput.value = '';
    const id = href.replace('#','');
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('open'); }
  };

  // Active sidebar link on scroll
  function initScrollSpy() {
    const links = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.api-card');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const id = entry.target.id;
          const link = document.querySelector(`.sidebar-link[href="#${id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    sections.forEach(s => observer.observe(s));
  }

  // ═══ Hamburger Menu ═══
  (function initHamburger() {
    const hBtn = document.getElementById('docsHamburger');
    const overlay = document.getElementById('mobileOverlay');
    const mobileSidebar = document.getElementById('mobileSidebarNav');
    if (!hBtn || !overlay) return;

    hBtn.addEventListener('click', () => {
      hBtn.classList.toggle('active');
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
      // Copy sidebar content to mobile overlay
      if (overlay.classList.contains('open') && sidebar) {
        mobileSidebar.innerHTML = sidebar.innerHTML;
      }
    });

    // Close on link click
    overlay.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a') || e.target.closest('.sidebar-link')) {
        hBtn.classList.remove('active');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Mobile theme toggle sync
    const mTheme = document.getElementById('mobileThemeToggle2');
    const mLang = document.getElementById('mobileLangToggle2');
    if (mTheme) {
      mTheme.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme();
        const icon = currentTheme === 'dark' ? 'moon' : 'sun';
        document.getElementById('mobileThemeIcon2').innerHTML = `<i data-lucide="${icon}" style="width:16px;height:16px;"></i>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    }
    if (mLang) {
      mLang.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'vi' : 'en';
        applyLang();
        buildSidebar();
        buildContent();
        initScrollSpy();
        document.getElementById('mobileLangLabel2').textContent = currentLang.toUpperCase();
        // Re-copy sidebar
        if (overlay.classList.contains('open') && sidebar) {
          mobileSidebar.innerHTML = sidebar.innerHTML;
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    }
  })();

  // Init
  applyTheme();
  applyLang();
  buildSidebar();
  buildContent();
  initSearch();
  initScrollSpy();
  // Final re-render of all Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();
})();
