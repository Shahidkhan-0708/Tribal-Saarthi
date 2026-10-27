(function () {
  var ICONS = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><path d="M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    alert: '<path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2"/><path d="M12 19v3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    signature: '<path d="M3 17c3 1 5-1 6-3s2-6 4-6 2 4 1 6-1 4 1 4 3-2 4-4"/><path d="M3 21h18"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15v3M12 9v9M17 5v13"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    activity: '<path d="M22 12h-4l-3 8L9 4l-3 8H2"/>',
    wifioff: '<path d="m2 2 20 20"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 12.9a10 10 0 0 1 4-2.4"/><path d="M19 12.9a10 10 0 0 0-2.5-1.7"/><path d="M2 8.8a16 16 0 0 1 4.4-2.5"/><path d="M22 8.8a16 16 0 0 0-5-2.7"/><path d="M12 20h.01"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>',
    scale: '<path d="m16 16 3-8 3 8c-2 1.5-4 1.5-6 0z"/><path d="m2 16 3-8 3 8c-2 1.5-4 1.5-6 0z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M5 8h14"/>',
    qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1M14 20h1M18 18h3v3h-3"/>',
    bookOpen: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M12 20h.01"/>',
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>'
  };

  function sprite() {
    var wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    var html = '';

    Object.keys(ICONS).forEach(function (k) {
      html += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    });
    wrap.innerHTML = html;
    document.body.insertBefore(wrap, document.body.firstChild);
  }

  var NAV = {
    scholar: [
      ['home', 'Dashboard', 'dashboard.html'],
      ['bookOpen', 'Scholarships', 'scholarship-discovery.html'],
      ['layers', 'Applications', 'application-tracker.html'],
      ['file', 'My documents', 'document-wallet.html'],
      ['user', 'My profile', 'scholar-profile.html'],
      ['users', 'Family access', 'family-access.html'],
      ['refresh', 'Saved changes', 'offline-sync.html']
    ],
    officer: [
      ['layers', 'Review queue', 'officer-review-queue.html', '145'],
      ['eye', 'Case inspection', 'officer-case-inspection.html'],
      ['signature', 'Approve scholarship', 'sanction-signing.html'],
      ['activity', 'Service testing', 'resilience-console.html'],
      ['chart', 'Coverage gaps', 'coverage-analytics.html'],
      ['database', 'Decision history', 'audit-log.html']
    ]
  };

  function icon(name, cls) {
    return '<svg class="' + (cls || 'i') + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  function buildShell() {
    var body = document.body;
    var role = body.dataset.role || 'scholar';
    var page = body.dataset.page || '';
    var isOfficer = role === 'officer';
    var items = NAV[role] || NAV.scholar;

    var gov = document.createElement('div');
    gov.className = 'govstrip';
    gov.innerHTML =
      '<div class="l">' + icon('shield') +
      '<span>Scholarship support for tribal students</span><span style="color:#334155">·</span>' +
      '<b>Ministry of Tribal Affairs</b><span class="hide-sm" style="color:#94A3B8">Demo environment</span></div>' +
      '<div class="r"><span class="tag">' + icon('lock') + 'Secure session · TLS 1.3</span>' +
      '<span class="hide-sm" style="color:#334155">|</span>' +
      '<span class="hide-sm">Design preview — sample records</span></div>';

    var header = document.createElement('header');
    header.className = 'appbar';
    header.innerHTML =
      '<a class="brand" href="dashboard.html" aria-label="Tribe Saarthi home">' +
        '<span class="brand-mark">TS</span>' +
        '<span><span class="brand-name">Tribe Saarthi</span>' +
        '<span class="brand-sub">' + (isOfficer ? 'Officer verification desk · MoTA' : 'Scholar portal · MoTA') + '</span></span>' +
      '</a>' +
      '<div class="searchbar">' + icon('search') +
        '<input type="search" placeholder="' + (isOfficer ? 'Search cases, scholars, receipts…' : 'Search scholarships, schemes, records…') + '" aria-label="Search">' +
        '<kbd>⌘K</kbd>' +
      '</div>' +
      '<span class="spacer"></span>' +
      '<button class="langselect" type="button" aria-label="Change language"><span>English</span><span style="color:#64748B">/</span><span>हिंदी</span>' + icon('chevronDown') + '</button>' +
      '<button class="iconbtn" type="button" aria-label="Notifications">' + icon('bell') + '<span class="dot"></span></button>' +
      '<a class="userpill" href="' + (isOfficer ? 'officer-review-queue.html' : 'scholar-profile.html') + '">' +
        '<span class="avatar ' + (isOfficer ? 'dark' : '') + '">' + (isOfficer ? 'KS' : 'MB') + '</span>' +
        '<span><span class="nm">' + (isOfficer ? 'Dr. K. Soren' : 'Mohan Birhor') + '</span>' +
        '<span class="rl">' + (isOfficer ? 'BIT Mesra Nodal Officer' : 'BIT Mesra · 2024-CSE-104') + '</span></span>' +
      '</a>';

    var main = document.querySelector('main.page');
    if (!main) return;
    body.insertBefore(gov, main);
    body.insertBefore(header, main);

    var layout = document.createElement('div');
    layout.className = 'layout';
    main.parentNode.insertBefore(layout, main);

    var rail = document.createElement('aside');
    rail.className = 'rail';
    var navHtml = '<div class="rail-label">' + (isOfficer ? 'Verification desk' : 'Your workspace') + '</div><nav class="rail-nav">';
    items.forEach(function (it) {
      var slug = it[2].replace('.html', '');
      var active = page === slug ? ' active' : '';
      navHtml += '<a class="navitem' + active + '" href="' + it[2] + '" data-od-id="nav-' + slug + '"' + (active ? ' aria-current="page"' : '') + '>' +
        icon(it[0]) + '<span>' + it[1] + '</span>' + (it[3] ? '<span class="count">' + it[3] + '</span>' : '') + '</a>';
    });
    navHtml += '</nav><div class="rail-divider"></div>';
    navHtml += '<a class="navitem" href="help-saarthi.html">' + icon('help') + '<span>Help &amp; Saarthi</span></a>';
    navHtml += '<div class="rail-foot">' +
      '<div class="syncbox"><div class="row"><span class="pulse"></span><span>' + (isOfficer ? 'Desk synced' : 'Work saved') + '</span></div>' +
      '<p>Last sync 18 Oct, 15:45<br>' + (isOfficer ? '4 records waiting for signature' : 'All changes are on this device') + '</p></div>' +
      '<div class="rail-help"><a href="#main">' + icon('shield') + '<span>' + (isOfficer ? 'Audit trail active' : 'Privacy &amp; consent') + '</span></a></div>' +
      '</div>';
    rail.innerHTML = navHtml;

    layout.appendChild(rail);
    layout.appendChild(main);

    var mob = document.createElement('nav');
    mob.className = 'mobilebar';
    mob.setAttribute('aria-label', 'Primary');
    var mobile = isOfficer
      ? [['layers','Queue','officer-review-queue.html'],['eye','Cases','officer-case-inspection.html'],['chart','Gaps','coverage-analytics.html'],['database','History','audit-log.html']]
      : [['home','Home','dashboard.html'],['bookOpen','Schemes','scholarship-discovery.html'],['file','Documents','document-wallet.html'],['user','Profile','scholar-profile.html']];
    mobile.forEach(function (m) {
      var active = page === m[2].replace('.html', '') ? ' active' : '';
      mob.innerHTML += '<a class="' + active.trim() + '" href="' + m[2] + '">' + icon(m[0]) + '<span>' + m[1] + '</span></a>';
    });
    document.body.appendChild(mob);

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = icon('check') + '<span></span>';
    document.body.appendChild(toast);
  }

  var toastTimer;
  function toast(msg) {
    var t = document.querySelector('.toast');
    if (!t) return;
    t.querySelector('span:last-child').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function wire() {
    document.addEventListener('click', function (e) {
      var act = e.target.closest('[data-toast]');
      if (act) { e.preventDefault(); toast(act.getAttribute('data-toast')); }

      var copy = e.target.closest('[data-copy]');
      if (copy) {
        var val = copy.getAttribute('data-copy');
        if (navigator.clipboard) navigator.clipboard.writeText(val).catch(function () {});
        toast('Copied to clipboard');
      }

      var open = e.target.closest('[data-open]');
      if (open) {
        e.preventDefault();
        var m = document.getElementById(open.getAttribute('data-open'));
        if (m) { m.hidden = false; document.body.classList.add('modal-open'); var f = m.querySelector('button, input, select, textarea, a'); if (f) setTimeout(function(){f.focus();},30); }
      }
      var close = e.target.closest('[data-close]');
      if (close) {
        e.preventDefault();
        var mm = close.closest('.modal-backdrop, .modal');
        if (mm) { (mm.classList.contains('modal') ? mm.closest('.modal-backdrop') : mm).hidden = true; document.body.classList.remove('modal-open'); }
      }
      if (e.target.classList.contains('modal-backdrop')) {
        e.target.hidden = true;
        document.body.classList.remove('modal-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openM = document.querySelector('.modal-backdrop:not([hidden])');
        if (openM) { openM.hidden = true; document.body.classList.remove('modal-open'); }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        var s = document.querySelector('.searchbar input, .search-inline input');
        if (s) { e.preventDefault(); s.focus(); }
      }
    });

    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      var tabs = group.querySelectorAll('[data-tab]');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== tab.getAttribute('data-tab'); });
        });
      });
    });

    document.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var g = btn.closest('[data-filter-group]');
        g.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
      });
    });

    document.querySelectorAll('[data-table-filter]').forEach(function (input) {
      input.addEventListener('input', function () {
        var q = input.value.toLowerCase();
        document.querySelectorAll('[data-row]').forEach(function (row) {
          row.style.display = row.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('[data-confirm]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var msg = btn.getAttribute('data-confirm');
        if (window.confirm(msg)) toast('Recorded');
      });
    });
  }

  sprite();
  buildShell();
  wire();

  window.Saarthi = { toast: toast };
})();
