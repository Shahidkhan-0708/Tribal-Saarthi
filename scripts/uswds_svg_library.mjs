// =============================================================
// USWDS 3.0 SVG Component & Layout Library
// Shared styling for the case-file design in design-plans/svg-design-direction.md
// =============================================================

export function sanitizeXml(xml) {
  if (!xml) return '';
  // Replace bare ampersands not part of standard XML entities
  return xml.replace(/&(?!(amp|lt|gt|apos|quot|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
}

export const I = {
  home: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </g>`,
  book: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </g>`,
  apps: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </g>`,
  doc: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </g>`,
  docCheck: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="m9 15 2 2 4-4"/>
    </g>`,
  help: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </g>`,
  chat: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </g>`,
  user: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    </g>`,
  users: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </g>`,
  sync: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </g>`,
  shield: (x, y, color = '#075A46', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </g>`,
  bell: (x, y, color = '#52666D', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </g>`,
  search: (x, y, color = '#52666D', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </g>`,
  check: (x, y, color = '#075A46', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </g>`,
  checkCircle: (x, y, color = '#075A46', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11 14 15 10"/>
    </g>`,
  alert: (x, y, color = '#8A4F13', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </g>`,
  clock: (x, y, color = '#52666D', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </g>`,
  key: (x, y, color = '#52666D', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21 2-2 2m-1.5 1.5L12 11m0 0a5 5 0 1 0-7 7 5 5 0 0 0 7-7zm0 0 4-4m-2 6 2-2m-1-1 2-2"/>
    </g>`,
  download: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </g>`,
  lock: (x, y, color = '#075A46', size = 14) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </g>`
};

export function makeDefs() {
  return `
  <defs>
    <style>
      * { 
        font-family: 'Trebuchet MS', 'Nirmala UI', Arial, sans-serif;
        text-rendering: geometricPrecision; 
        -webkit-font-smoothing: antialiased; 
        -moz-osx-font-smoothing: grayscale;
      }
      .mono { 
        font-family: 'Trebuchet MS', 'Nirmala UI', Arial, sans-serif;
        font-feature-settings: "tnum" 1; 
      }
      .stat-anchor { font-weight: 700; font-variant-numeric: tabular-nums; }
      .badge { font-weight: 700; text-anchor: middle; }
    </style>

    <!-- USWDS Gradients -->
    <linearGradient id="govPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#075A46" />
      <stop offset="100%" stop-color="#075A46" />
    </linearGradient>
    <linearGradient id="govOchreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8A4F13" />
      <stop offset="100%" stop-color="#8A4F13" />
    </linearGradient>
    <linearGradient id="govHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#075A46" />
      <stop offset="100%" stop-color="#075A46" />
    </linearGradient>

    <!-- Elevation is reserved for dialogs. -->
    <filter id="modalShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="28" flood-color="#152E35" flood-opacity="0.32" />
    </filter>

  </defs>
  <rect width="100%" height="100%" fill="#EEF3F3" />`;
}

// -------------------------------------------------------------
// Official USWDS Government Banner (usa-banner)
// -------------------------------------------------------------
export function renderUsaBanner(width = 1440) {
  return `
  <!-- USWDS Official Government Banner -->
  <g class="usa-banner">
    <rect width="${width}" height="32" fill="#EEF3F3" stroke="#CFDADD" />
    <g transform="translate(48, 6)">
      <!-- Government Seal / Ashoka Emblem Vector Graphic -->
      <circle cx="10" cy="10" r="9" fill="#075A46" />
      <circle cx="10" cy="10" r="5" fill="#FFFFFF" />
      <circle cx="10" cy="10" r="2.5" fill="#075A46" />
      
      <text x="26" y="14" font-size="11" font-weight="600" fill="#152E35">
        Tribe Saarthi · Scholarship support for tribal students
      </text>

      <!-- Security HTTPS Seal -->
      <g transform="translate(${width - 320}, 1)">
        ${I.lock(0, 2, '#075A46', 14)}
        <text x="18" y="13" font-size="11" font-weight="600" fill="#075A46">Design preview · Sample records</text>
      </g>
    </g>
  </g>`;
}

// -------------------------------------------------------------
// Desktop Header & Navigation
// -------------------------------------------------------------
export function renderGovHeader(activeTab = 'home', role = 'student') {
  const isOfficer = role === 'officer';
  const roleTitle = isOfficer ? 'Officer Verification Desk' : 'Scholar Portal';
  const userName = isOfficer ? 'Dr. K. Soren' : 'Mohan Birhor';
  const userRole = isOfficer ? 'BIT Mesra Nodal Officer' : 'BIT Mesra · 2024-CSE-104';

  return `
  <!-- USWDS Header & Navigation -->
  <g transform="translate(0, 32)">
    <rect width="1440" height="72" fill="#FFFFFF" stroke="#CFDADD" />
    <rect width="1440" height="3" fill="url(#govPrimaryGrad)" />

    <g transform="translate(48, 16)">
      <!-- Logo & Brand -->
      <circle cx="20" cy="20" r="20" fill="url(#govPrimaryGrad)" />
      <text x="20" y="26" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">TS</text>

      <text x="50" y="18" font-size="20" font-weight="700" fill="#152E35">Tribe Saarthi</text>
      <text x="50" y="32" font-size="10.5" font-weight="700" fill="#075A46">${roleTitle} · MoTA</text>

      <!-- Search Bar -->
      <g transform="translate(260, 0)">
        <rect width="320" height="40" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
        ${I.search(12, 11, '#52666D', 18)}
        <text x="38" y="25" font-size="12" fill="#52666D">Search scholarships, schemes, records...</text>
      </g>

      <!-- Language Selector -->
      <g transform="translate(620, 6)">
        <rect width="110" height="28" rx="6" fill="#EEF3F3" stroke="#CFDADD" />
        <text x="55" y="18" font-size="10.5" font-weight="700" fill="#152E35" text-anchor="middle">English / हिंदी ▾</text>
      </g>

      <!-- Right User Controls -->
      <g transform="translate(1060, 0)">
        <!-- Bell Notification -->
        <circle cx="16" cy="20" r="18" fill="#EEF3F3" stroke="#CFDADD" />
        ${I.bell(7, 11, '#52666D', 18)}
        <circle cx="23" cy="12" r="4.5" fill="#DC2626" />

        <!-- User Profile Pill -->
        <g transform="translate(50, 0)">
          <rect width="240" height="40" rx="20" fill="#EEF3F3" stroke="#CFDADD" />
          <circle cx="20" cy="20" r="16" fill="url(#govPrimaryGrad)" />
          <text x="20" y="25" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">${userName.split(' ').map(n=>n[0]).join('')}</text>
          
          <text x="44" y="18" font-size="13" font-weight="700" fill="#152E35">${userName}</text>
          <text x="44" y="33" font-size="11" fill="#52666D">${userRole}</text>
        </g>
      </g>
    </g>
  </g>`;
}

// -------------------------------------------------------------
// Desktop Sidebar
// -------------------------------------------------------------
export function renderGovSidebar(activeKey = 'home', role = 'student') {
  const isOfficer = role === 'officer';
  const navItems = isOfficer ? [
    { key: 'queue', label: 'Review Queue', icon: I.docCheck },
    { key: 'inspection', label: 'Case Inspection', icon: I.search },
    { key: 'sanction', label: 'Approve scholarship', icon: I.shield },
    { key: 'switchboard', label: 'Service testing', icon: I.sync },
    { key: 'analytics', label: 'Coverage gaps', icon: I.apps },
    { key: 'audit', label: 'Decision history', icon: I.key },
  ] : [
    { key: 'home', label: 'Dashboard', icon: I.home },
    { key: 'scholarships', label: 'Scholarships', icon: I.book },
    { key: 'apps', label: 'Applications', icon: I.apps },
    { key: 'wallet', label: 'My documents', icon: I.doc },
    { key: 'profile', label: 'My profile', icon: I.user },
    { key: 'family', label: 'Family access', icon: I.users },
    { key: 'offline', label: 'Saved changes', icon: I.sync },
    { key: 'help', label: 'Help and Saarthi', icon: I.help },
  ];

  return `
  <!-- USWDS Left Navigation Rail -->
  <g transform="translate(0, 104)">
    <rect width="240" height="856" fill="#FFFFFF" stroke="#CFDADD" />
    
    <g transform="translate(16, 24)">
      ${navItems.map((item, i) => {
        const isActive = item.key === activeKey;
        const y = i * 48;
        const bg = isActive ? '#E8F2EE' : 'transparent';
        const textColor = isActive ? '#075A46' : '#52666D';
        const fontWeight = isActive ? '800' : '600';
        const iconColor = isActive ? '#075A46' : '#52666D';

        return `
          <g transform="translate(0, ${y})">
            ${isActive ? `<rect x="-16" y="0" width="4" height="42" fill="#075A46" rx="2" />` : ''}
            <rect width="208" height="42" rx="8" fill="${bg}" />
            ${item.icon(14, 12, iconColor, 18)}
            <text x="44" y="26" font-size="14" font-weight="${fontWeight}" fill="${textColor}">${item.label}</text>
            ${isActive ? `<circle cx="194" cy="21" r="3" fill="#075A46" />` : ''}
          </g>
        `;
      }).join('\n')}

      <!-- Bottom System Resilience Indicator -->
      <g transform="translate(0, 680)">
        <rect width="208" height="74" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
        <circle cx="20" cy="24" r="6" fill="#075A46" />
        <text x="34" y="27" font-size="12" font-weight="700" fill="#075A46">Your work is saved</text>
        <text x="34" y="44" font-size="11" fill="#52666D">Last sync: 18 Oct, 15:45</text>
        <text x="14" y="62" font-size="11" fill="#52666D">Need help? Open Saarthi.</text>
      </g>
    </g>
  </g>`;
}

// -------------------------------------------------------------
// Recharts / Tremor / USWDS Donut Chart Component
// -------------------------------------------------------------
export function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

export function makeDonutArc(cx, cy, rOut, rIn, startAngle, endAngle) {
  const sweep = Math.max(0.1, Math.min(359.9, endAngle - startAngle));
  const p1Out = polarToCartesian(cx, cy, rOut, startAngle + sweep);
  const p2Out = polarToCartesian(cx, cy, rOut, startAngle);
  const p1In = polarToCartesian(cx, cy, rIn, startAngle + sweep);
  const p2In = polarToCartesian(cx, cy, rIn, startAngle);
  const largeArc = sweep <= 180 ? 0 : 1;

  return [
    'M', p2Out.x.toFixed(2), p2Out.y.toFixed(2),
    'A', rOut, rOut, 0, largeArc, 1, p1Out.x.toFixed(2), p1Out.y.toFixed(2),
    'L', p1In.x.toFixed(2), p1In.y.toFixed(2),
    'A', rIn, rIn, 0, largeArc, 0, p2In.x.toFixed(2), p2In.y.toFixed(2),
    'Z'
  ].join(' ');
}

export function renderDonutChartComponent({
  cx, cy, rOut = 54, rIn = 36, segments, centerValue = '', centerSub = '', legendX, legendY, legendWidth = 160, legendCols = 1, itemHeight = 22
}) {
  let cur = 0;
  const paths = segments.map((s) => {
    const sweep = (s.percent / 100) * 359.9;
    const arc = makeDonutArc(cx, cy, rOut, rIn, cur, cur + sweep);
    cur += sweep;
    return `<path d="${arc}" fill="${s.color}" stroke="#FFFFFF" stroke-width="2" />`;
  }).join('\n');

  const centerText = `
    <text x="${cx}" y="${cy - (centerSub ? 2 : -5)}" font-size="14" font-weight="700" fill="#152E35" text-anchor="middle" class="stat-anchor">${centerValue}</text>
    ${centerSub ? `<text x="${cx}" y="${cy + 13}" font-size="8.5" font-weight="700" fill="#52666D" text-anchor="middle">${centerSub}</text>` : ''}
  `;

  let legends = '';
  if (legendX !== undefined && legendY !== undefined) {
    legends = `<g transform="translate(${legendX}, ${legendY})">
      ${segments.map((s, idx) => {
        const row = Math.floor(idx / legendCols);
        const col = idx % legendCols;
        const lx = col * legendWidth;
        const ly = row * itemHeight;
        return `
          <g transform="translate(${lx}, ${ly})">
            <rect x="0" y="2" width="9" height="9" rx="2.5" fill="${s.color}" />
            <text x="14" y="10" font-size="10.5" font-weight="600" fill="#152E35">${s.label}</text>
            <text x="${legendWidth - 4}" y="10" font-size="10.5" font-weight="700" fill="${s.color}" text-anchor="end">${s.percent}%${s.amount ? ` · ${s.amount}` : ''}</text>
          </g>
        `;
      }).join('\n')}
    </g>`;
  }

  return `
    <g class="donut-chart-component">
      ${paths}
      ${centerText}
      ${legends}
    </g>
  `;
}

// -------------------------------------------------------------
// Watermelon / USWDS Multi-Stage Stepper Component
// -------------------------------------------------------------
export function renderStepperPipelineComponent({ x, y, width, steps }) {
  const stepCount = steps.length;
  const stepSpacing = (width - 40) / (stepCount - 1);

  return `
    <g transform="translate(${x}, ${y})" class="pipeline-diagram-component">
      <line x1="20" y1="14" x2="${width - 20}" y2="14" stroke="#CFDADD" stroke-width="3" stroke-linecap="round" />
      ${steps.map((st, i) => {
        const sx = 20 + i * stepSpacing;
        const isDone = st.status === 'done';
        const isActive = st.status === 'active';
        
        let nodeIcon = '';
        if (isDone) {
          nodeIcon = `
            <circle cx="${sx}" cy="14" r="12" fill="#075A46" />
            ${I.check(sx - 6, 8, '#FFFFFF', 12)}
          `;
        } else if (isActive) {
          nodeIcon = `
            <circle cx="${sx}" cy="14" r="14" fill="url(#govOchreGrad)" />
            <circle cx="${sx}" cy="14" r="18" fill="none" stroke="#8A4F13" stroke-width="2" stroke-dasharray="3 3" />
            <circle cx="${sx}" cy="14" r="4.5" fill="#FFFFFF" />
          `;
        } else {
          nodeIcon = `
            <circle cx="${sx}" cy="14" r="11" fill="#EEF3F3" stroke="#CBD5E1" stroke-width="1.5" />
            <text x="${sx}" y="18" font-size="9.5" font-weight="700" fill="#52666D" text-anchor="middle">${i + 1}</text>
          `;
        }

        const textColor = isDone ? '#075A46' : (isActive ? '#8A4F13' : '#52666D');
        const textWeight = isActive ? '700' : '600';

        return `
          <g>
            ${nodeIcon}
            <text x="${sx}" y="36" font-size="10" font-weight="${textWeight}" fill="${textColor}" text-anchor="middle">${st.title}</text>
            ${st.sub ? `<text x="${sx}" y="52" font-size="10" font-weight="400" fill="#52666D" text-anchor="middle">${st.sub}</text>` : ''}
          </g>
        `;
      }).join('\n')}
    </g>
  `;
}

// -------------------------------------------------------------
// Merkle Cryptographic DAG Chain Component
// -------------------------------------------------------------
export function renderMerkleChainComponent({ x, y, width, blocks }) {
  const blockWidth = (width - (blocks.length - 1) * 36) / blocks.length;
  return `
    <g transform="translate(${x}, ${y})" class="merkle-chain-component">
      ${blocks.map((b, i) => {
        const bx = i * (blockWidth + 36);
        const arrow = i < blocks.length - 1 ? `
          <g transform="translate(${blockWidth}, 26)">
            <line x1="6" y1="0" x2="30" y2="0" stroke="#075A46" stroke-width="2" stroke-dasharray="3 2" />
            <polygon points="30,0 24,-4 24,4" fill="#075A46" />
          </g>
        ` : '';

        return `
          <g transform="translate(${bx}, 0)">
            <rect width="${blockWidth}" height="58" rx="8" fill="#EEF3F3" stroke="#CBD5E1" stroke-width="1.2" />
            <rect width="${blockWidth}" height="4" rx="2" fill="${b.color || '#075A46'}" />
            <text x="10" y="18" font-size="11" fill="#52666D">Record #${b.id}</text>
            <text x="10" y="35" font-size="13" font-weight="700" fill="#152E35">${b.op}</text>
            <text x="10" y="51" font-size="11" fill="#075A46" class="mono">${b.hash}</text>
            <circle cx="${blockWidth - 14}" cy="16" r="6" fill="#E8F2EE" />
            ${I.check(blockWidth - 18, 12, '#075A46', 8)}
            ${arrow}
          </g>
        `;
      }).join('\n')}
    </g>
  `;
}
