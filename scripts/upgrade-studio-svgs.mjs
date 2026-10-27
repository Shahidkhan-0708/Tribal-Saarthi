import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const baseOutDir = path.resolve('docs/ui-mockups');
const scholarDir = path.join(baseOutDir, '01-scholar-portal');
const officerDir = path.join(baseOutDir, '02-officer-portal');
const systemDir = path.join(baseOutDir, '03-system-auth');

[scholarDir, officerDir, systemDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// -------------------------------------------------------------
// Lucide Vector Paths
// -------------------------------------------------------------
const icons = {
  home: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </g>`,
  scholarship: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
    </g>`,
  tracker: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </g>`,
  wallet: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
    </g>`,
  profile: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    </g>`,
  family: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </g>`,
  offline: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </g>`,
  help: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </g>`,
  checkCircle: (x, y, color = '#10B981', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </g>`,
  shield: (x, y, color = '#047857', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </g>`,
  bell: (x, y, color = '#57534E', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </g>`,
  search: (x, y, color = '#57534E', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </g>`,
  lock: (x, y, color = '#A8A29E', size = 14) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </g>`
};

// -------------------------------------------------------------
// Ultra-Fidelity Design Tokens & Global Styles
// -------------------------------------------------------------
const commonStyles = `
  <defs>
    <!-- Embedded Google Web Fonts -->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500;600;700&amp;display=swap');
      * { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .title { font-weight: 800; font-size: 21px; fill: #0F172A; letter-spacing: -0.02em; }
      .subtitle { font-weight: 500; font-size: 13px; fill: #64748B; }
      .badge { font-weight: 800; font-size: 10px; text-anchor: middle; letter-spacing: 0.05em; }
      .btn-text { font-weight: 700; font-size: 12px; fill: #FFFFFF; text-anchor: middle; }
    </style>

    <!-- Gradients -->
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#047857" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
    <linearGradient id="brandCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#065F46" />
      <stop offset="100%" stop-color="#022C22" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="motifGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="65%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="darkCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="goldButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    
    <!-- Multi-tier Elevated Drop Shadows -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.04" />
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.06" />
    </filter>
    <filter id="heroShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#047857" flood-opacity="0.22" />
    </filter>
    <filter id="modalShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="35" flood-color="#000000" flood-opacity="0.35" />
    </filter>

    <!-- Tribal Geometric Motif Pattern -->
    <pattern id="tribalPattern" width="32" height="16" patternUnits="userSpaceOnUse">
      <path d="M0 8 L8 0 L16 8 L8 16 Z M16 8 L24 0 L32 8 L24 16 Z" fill="url(#motifGrad)" fill-opacity="0.10"/>
      <circle cx="8" cy="8" r="1.5" fill="#D97706" />
      <circle cx="24" cy="8" r="1.5" fill="#047857" />
    </pattern>
  </defs>
`;

function renderBrowserWindow(url = 'https://tribesaarthi.gov.in/scholar/dashboard') {
  return `
  <!-- Desktop Browser Window Frame -->
  <path d="M0 16 A16 16 0 0 1 16 0 L1424 0 A16 16 0 0 1 1440 16 L1440 38 L0 38 Z" fill="#0F172A" />
  
  <!-- Window Traffic Lights -->
  <circle cx="22" cy="19" r="5.5" fill="#EF4444" />
  <circle cx="38" cy="19" r="5.5" fill="#F59E0B" />
  <circle cx="54" cy="19" r="5.5" fill="#10B981" />

  <!-- Active Tab -->
  <path d="M80 38 L95 12 A4 4 0 0 1 99 10 L280 10 A4 4 0 0 1 284 12 L299 38 Z" fill="#1E293B" />
  <circle cx="112" cy="24" r="5" fill="#059669" />
  <text x="126" y="27" font-size="11" font-weight="600" fill="#F8FAFC">Tribe Saarthi · MoTA</text>

  <!-- Omnibar -->
  <rect x="420" y="8" width="600" height="22" rx="6" fill="#020617" stroke="#334155" stroke-width="1" />
  ${icons.lock(432, 12, '#10B981', 14)}
  <text x="720" y="23" font-size="11" font-weight="500" fill="#94A3B8" text-anchor="middle" class="mono">${url}</text>

  <!-- National Saffron-White-Green Micro Ribbon -->
  <rect x="0" y="38" width="1440" height="3" fill="url(#motifGrad)" />
  `;
}

function renderSidebar(activeKey = 'home', role = 'student') {
  const items = role === 'student' ? [
    { key: 'home', label: 'Dashboard', icon: 'home' },
    { key: 'scholarships', label: 'Scholarships', icon: 'scholarship' },
    { key: 'applications', label: 'My Applications', icon: 'tracker' },
    { key: 'documents', label: 'Documents', icon: 'wallet' },
    { key: 'profile', label: 'Profile & PVTG', icon: 'profile' },
    { key: 'family', label: 'Family Consent', icon: 'family' },
    { key: 'offline', label: 'Offline Queue', icon: 'offline' },
    { key: 'help', label: 'Help & Saarthi', icon: 'help' },
  ] : [
    { key: 'queue', label: 'Review Queue', icon: 'tracker' },
    { key: 'detail', label: 'Case Inspection', icon: 'search' },
    { key: 'coverage', label: 'Coverage Analytics', icon: 'scholarship' },
    { key: 'switchboard', label: 'Sabotage Tester', icon: 'offline' },
    { key: 'audit', label: 'Forensic Audit Log', icon: 'shield' },
    { key: 'help', label: 'Help Requests', icon: 'help' },
  ];

  let svg = `
  <!-- Left Sidebar Shell -->
  <rect x="0" y="41" width="250" height="919" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  
  <!-- Tribal Pattern Accent Header in Sidebar -->
  <rect x="0" y="41" width="250" height="70" fill="url(#tribalPattern)" />
  <rect x="0" y="41" width="250" height="70" fill="#FFFFFF" fill-opacity="0.88" />
  
  <!-- Official Lion Capital / MoTA Emblem Crest -->
  <g transform="translate(24, 52)">
    <circle cx="18" cy="18" r="18" fill="url(#brandGrad)" />
    <circle cx="18" cy="18" r="14" fill="none" stroke="#FDE68A" stroke-width="1.2" stroke-dasharray="2 1.5" />
    <text x="18" y="23" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>
    <text x="46" y="15" font-size="15" font-weight="800" fill="#0F172A">Tribe Saarthi</text>
    <text x="46" y="28" font-size="9" font-weight="800" fill="#B45309" letter-spacing="0.5">MIN. OF TRIBAL AFFAIRS</text>
  </g>
  <line x1="20" y1="110" x2="230" y2="110" stroke="#F1F5F9" stroke-width="1" />

  <!-- Nav Category Title -->
  <text x="24" y="132" font-size="10" font-weight="800" fill="#94A3B8" letter-spacing="0.1em">
    ${role === 'student' ? 'SCHOLAR PORTAL' : 'OFFICER DESK'}
  </text>
  `;

  let y = 145;
  for (const it of items) {
    const isActive = it.key === activeKey;
    const iconRenderer = icons[it.icon] || icons.home;
    if (isActive) {
      svg += `
      <rect x="16" y="${y}" width="218" height="40" rx="10" fill="url(#brandGrad)" filter="url(#cardShadow)" />
      ${iconRenderer(30, y + 11, '#FDE68A', 18)}
      <text x="58" y="${y + 25}" font-size="13" font-weight="700" fill="#FFFFFF">${it.label}</text>
      <circle cx="218" cy="${y + 20}" r="3.5" fill="#FDE68A" />
      `;
    } else {
      svg += `
      <rect x="16" y="${y}" width="218" height="40" rx="10" fill="transparent" />
      ${iconRenderer(30, y + 11, '#64748B', 18)}
      <text x="58" y="${y + 25}" font-size="13" font-weight="600" fill="#475569">${it.label}</text>
      `;
    }
    y += 46;
  }

  const userName = role === 'student' ? 'Asha Kiran Ekka' : 'Sh. A.K. Verma';
  const userSub = role === 'student' ? 'ST Scholar · BIT Mesra' : 'District Welfare Nodal';
  svg += `
  <!-- Bottom User Capsule -->
  <line x1="20" y1="860" x2="230" y2="860" stroke="#E2E8F0" stroke-width="1" />
  <rect x="16" y="876" width="218" height="68" rx="14" fill="#F8FAFC" stroke="#E2E8F0" />
  
  <!-- Avatar with online indicator -->
  <circle cx="44" cy="910" r="18" fill="url(#brandGrad)" />
  <text x="44" y="915" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">${role === 'student' ? 'AE' : 'AV'}</text>
  <circle cx="56" cy="922" r="4.5" fill="#10B981" stroke="#FFFFFF" stroke-width="1.5" />
  
  <text x="70" y="904" font-size="12" font-weight="700" fill="#0F172A">${userName}</text>
  <text x="70" y="918" font-size="10" font-weight="600" fill="#64748B">${userSub}</text>
  <text x="70" y="934" font-size="10" font-weight="700" fill="#EF4444">Sign out ↗</text>
  `;

  return svg;
}

function renderHeader(portalLabel = 'Scholar Portal') {
  return `
  <!-- Top App Bar Header -->
  <rect x="250" y="41" width="1190" height="56" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  
  <!-- Breadcrumb and National Emblem -->
  <text x="275" y="74" font-size="12" font-weight="800" fill="#0F172A">भारत सरकार</text>
  <text x="345" y="74" font-size="12" fill="#CBD5E1">|</text>
  <text x="360" y="74" font-size="12" font-weight="600" fill="#475569">Ministry of Tribal Affairs</text>
  <text x="520" y="74" font-size="12" fill="#CBD5E1">|</text>
  <rect x="535" y="60" width="75" height="22" rx="6" fill="#F1F5F9" stroke="#E2E8F0" />
  <text x="572" y="75" font-size="10" class="mono" font-weight="700" fill="#475569" text-anchor="middle">SIH-26238</text>

  <!-- Status Capsule on Right -->
  <rect x="940" y="55" width="145" height="30" rx="15" fill="#ECFDF5" stroke="#A7F3D0" />
  <circle cx="956" cy="70" r="3.5" fill="#10B981" />
  <circle cx="956" cy="70" r="6" fill="#10B981" fill-opacity="0.25" />
  <text x="972" y="74" font-size="11" font-weight="700" fill="#065F46">Pilot Live · Online</text>

  <!-- Notifications Icon -->
  <circle cx="1110" cy="70" r="16" fill="#F8FAFC" stroke="#E2E8F0" />
  ${icons.bell(1101, 61, '#475569', 18)}
  <circle cx="1120" cy="62" r="4" fill="#EF4444" />

  <!-- Language Switcher -->
  <rect x="1140" y="55" width="100" height="30" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="1190" y="74" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">हिन्दी / English ▾</text>

  <!-- Guided Tour Button -->
  <rect x="1255" y="55" width="160" height="30" rx="8" fill="url(#brandGrad)" filter="url(#cardShadow)" />
  <text x="1335" y="74" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">★ Interactive Tour</text>
  `;
}

// -------------------------------------------------------------
// Upgraded 01: Student Home Desktop (Ultra-Fidelity)
// -------------------------------------------------------------
function makeStudentHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" rx="16" />
  ${renderBrowserWindow('https://tribesaarthi.gov.in/scholar/dashboard')}
  ${renderSidebar('home', 'student')}
  ${renderHeader()}

  <!-- Ambient Decorative Glow -->
  <circle cx="1300" cy="200" r="280" fill="#059669" fill-opacity="0.04" />
  <circle cx="400" cy="800" r="320" fill="#D97706" fill-opacity="0.03" />

  <!-- Main Content Canvas -->
  <g transform="translate(280, 115)">
    <!-- Header Title & Subtitle -->
    <text x="0" y="24" class="title">Scholar Overview &amp; Priority Actions</text>
    <text x="0" y="44" class="subtitle">Authoritative status of your scholarship application, DigiLocker credentials, and Direct Benefit Transfer</text>

    <!-- Priority Next Action Card (Hero) -->
    <g filter="url(#heroShadow)">
      <rect x="0" y="65" width="750" height="155" rx="18" fill="url(#brandCardGrad)" />
      
      <!-- Subtle internal pattern -->
      <rect x="0" y="65" width="750" height="155" rx="18" fill="url(#tribalPattern)" fill-opacity="0.4" />
      
      <!-- Top Action Tag -->
      <rect x="25" y="88" width="140" height="24" rx="12" fill="#064E3B" stroke="#059669" stroke-width="1" />
      <circle cx="38" cy="100" r="3.5" fill="#FDE68A" />
      <text x="95" y="104" class="badge" fill="#FDE68A">PRIMARY ACTION</text>
      
      <!-- Card Titles -->
      <text x="25" y="142" font-size="21" font-weight="800" fill="#FFFFFF" letter-spacing="-0.01em">Disbursement Confirmation Available</text>
      <text x="25" y="166" font-size="13" font-weight="500" fill="#A7F3D0">Post-Matric Scholarship FY 2026-27 (₹32,000) sanctioned to your Bank of India account.</text>
      
      <!-- CTA Button -->
      <g filter="url(#cardShadow)">
        <rect x="25" y="182" width="220" height="34" rx="10" fill="url(#goldButtonGrad)" />
        <text x="135" y="204" font-size="12" font-weight="800" fill="#78350F" text-anchor="middle">View Direct Bank Receipt →</text>
      </g>
    </g>

    <!-- DigiLocker Status Card -->
    <g filter="url(#cardShadow)">
      <rect x="770" y="65" width="350" height="155" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <rect x="795" y="88" width="120" height="22" rx="11" fill="#F0FDF4" stroke="#BBF7D0" />
      <circle cx="806" cy="99" r="3" fill="#10B981" />
      <text x="860" y="103" class="badge" fill="#047857">DIGILOCKER SYNC</text>
      
      <text x="795" y="138" font-size="22" font-weight="800" fill="#047857" letter-spacing="-0.02em">3 Verified Documents</text>
      <text x="795" y="158" font-size="12" font-weight="500" fill="#64748B">Caste Cert, Income Cert &amp; Marksheet sync active</text>
      
      <line x1="795" y1="175" x2="1095" y2="175" stroke="#F1F5F9" />
      ${icons.checkCircle(795, 185, '#047857', 16)}
      <text x="818" y="198" font-size="11" font-weight="700" fill="#047857">Seeded with Aadhaar •••• •••• 5821</text>
    </g>

    <!-- Application Progress Bar -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="245" width="1120" height="135" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <text x="30" y="280" font-size="15" font-weight="800" fill="#0F172A">Post-Matric ST Scholarship 2026-27 · Application #TS-84920</text>
      <text x="960" y="280" font-size="12" font-weight="700" fill="#047857">STAGE 3 OF 4 COMPLETE</text>
      
      <!-- Stepper Line -->
      <line x1="80" y1="325" x2="1040" y2="325" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" />
      <line x1="80" y1="325" x2="720" y2="325" stroke="url(#brandGrad)" stroke-width="6" stroke-linecap="round" />

      <!-- Step 1: Submitted -->
      <circle cx="80" cy="325" r="16" fill="#047857" filter="url(#cardShadow)" />
      ${icons.checkCircle(72, 317, '#FFFFFF', 16)}
      <text x="80" y="356" font-size="11" font-weight="800" fill="#0F172A" text-anchor="middle">1. Submitted</text>
      <text x="80" y="370" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">02-OCT-2026</text>

      <!-- Step 2: Institute -->
      <circle cx="400" cy="325" r="16" fill="#047857" filter="url(#cardShadow)" />
      ${icons.checkCircle(392, 317, '#FFFFFF', 16)}
      <text x="400" y="356" font-size="11" font-weight="800" fill="#0F172A" text-anchor="middle">2. Institute Verified</text>
      <text x="400" y="370" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">12-OCT-2026</text>

      <!-- Step 3: District -->
      <circle cx="720" cy="325" r="16" fill="#047857" filter="url(#cardShadow)" />
      ${icons.checkCircle(712, 317, '#FFFFFF', 16)}
      <text x="720" y="356" font-size="11" font-weight="800" fill="#0F172A" text-anchor="middle">3. District Sanction</text>
      <text x="720" y="370" font-size="10" font-weight="600" fill="#047857" text-anchor="middle">17-OCT-2026 ✓</text>

      <!-- Step 4: DBT Disbursed -->
      <circle cx="1040" cy="325" r="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.5" />
      <text x="1040" y="330" font-size="11" font-weight="800" fill="#94A3B8" text-anchor="middle">4</text>
      <text x="1040" y="356" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">4. DBT Disbursed</text>
      <text x="1040" y="370" font-size="10" font-weight="600" fill="#94A3B8" text-anchor="middle">Expected 24-OCT</text>
    </g>

    <!-- Honest Notifications Section -->
    <text x="0" y="415" font-size="16" font-weight="800" fill="#0F172A">Official Announcements &amp; Updates</text>
    
    <!-- Notification 1 -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="435" width="750" height="74" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <circle cx="35" cy="472" r="14" fill="#EFF6FF" />
      <text x="35" y="476" font-size="12" font-weight="800" fill="#2563EB" text-anchor="middle">i</text>
      <text x="60" y="462" font-size="13" font-weight="700" fill="#0F172A">Institute Verification Completed</text>
      <text x="60" y="482" font-size="12" font-weight="500" fill="#64748B">BIT Mesra Nodal Officer approved enrollment and academic marksheet on 14 Oct 2026.</text>
      <rect x="630" y="457" width="100" height="24" rx="12" fill="#F1F5F9" />
      <text x="680" y="473" font-size="10" font-weight="700" fill="#475569" text-anchor="middle">INFORMATIONAL</text>
    </g>

    <!-- Notification 2 -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="520" width="750" height="74" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <circle cx="35" cy="557" r="14" fill="#FEF3C7" />
      <text x="35" y="561" font-size="12" font-weight="800" fill="#D97706" text-anchor="middle">!</text>
      <text x="60" y="547" font-size="13" font-weight="700" fill="#0F172A">Annual Income Certificate Due for Renewal Next Term</text>
      <text x="60" y="567" font-size="12" font-weight="500" fill="#64748B">Certificate valid until March 2027. No immediate action required for this semester.</text>
      <rect x="655" y="542" width="75" height="24" rx="12" fill="#FEF3C7" />
      <text x="692" y="558" font-size="10" font-weight="700" fill="#92400E" text-anchor="middle">NOTICE</text>
    </g>

    <!-- APAAR Card Widget -->
    <g filter="url(#cardShadow)">
      <rect x="770" y="435" width="350" height="159" rx="18" fill="url(#darkCardGrad)" />
      
      <!-- Card Chip & Hologram vector -->
      <rect x="795" y="460" width="36" height="26" rx="4" fill="#D97706" stroke="#FDE68A" stroke-width="1" />
      <line x1="795" y1="473" x2="831" y2="473" stroke="#FDE68A" stroke-width="1" />
      <line x1="813" y1="460" x2="813" y2="486" stroke="#FDE68A" stroke-width="1" />
      
      <text x="845" y="475" font-size="10" font-weight="800" fill="#FDE68A" letter-spacing="0.1em">MINISTRY OF EDUCATION · APAAR</text>
      <text x="795" y="515" font-size="18" font-weight="800" fill="#FFFFFF" class="mono" letter-spacing="0.05em">9482 · 1049 · 5821</text>
      <text x="795" y="540" font-size="12" font-weight="600" fill="#94A3B8">Asha Kiran Ekka · Scheduled Tribe</text>
      
      <rect x="795" y="555" width="165" height="22" rx="11" fill="#064E3B" stroke="#059669" stroke-width="0.8" />
      <circle cx="806" cy="566" r="3" fill="#10B981" />
      <text x="882" y="570" font-size="9" font-weight="700" fill="#A7F3D0" text-anchor="middle">✓ Aadhaar &amp; DigiLocker Seeded</text>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// Upgraded 02: Student Mobile (Dynamic Island, 390x844)
// -------------------------------------------------------------
function makeStudentMobile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  
  <!-- Mobile Device Canvas -->
  <rect width="390" height="844" rx="40" fill="#FAF7F2" stroke="#1E293B" stroke-width="4" />
  
  <!-- Dynamic Island Pill -->
  <rect x="135" y="11" width="120" height="30" rx="15" fill="#020617" />
  <circle cx="232" cy="26" r="5.5" fill="#0F172A" />

  <!-- Status Bar Time & Icons -->
  <text x="36" y="32" font-size="13" font-weight="800" fill="#0F172A">9:41</text>
  <g transform="translate(325, 22)">
    <rect x="0" y="6" width="3" height="6" rx="1" fill="#0F172A" />
    <rect x="5" y="4" width="3" height="8" rx="1" fill="#0F172A" />
    <rect x="10" y="2" width="3" height="10" rx="1" fill="#0F172A" />
    <rect x="15" y="0" width="3" height="12" rx="1" fill="#0F172A" />
    <rect x="24" y="1" width="20" height="10" rx="3" fill="none" stroke="#0F172A" stroke-width="1.5" />
    <rect x="26" y="3" width="13" height="6" rx="1.5" fill="#0F172A" />
    <path d="M45 4.5v3" stroke="#0F172A" stroke-linecap="round" />
  </g>

  <!-- Mobile Top Header -->
  <g transform="translate(0, 48)">
    <rect x="0" y="0" width="390" height="52" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
    
    <!-- Hamburger Button -->
    <rect x="16" y="10" width="32" height="32" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
    <line x1="24" y1="19" x2="40" y2="19" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />
    <line x1="24" y1="26" x2="40" y2="26" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />
    <line x1="24" y1="33" x2="40" y2="33" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />

    <!-- Ministry Title -->
    <circle cx="68" cy="26" r="14" fill="url(#brandGrad)" />
    <text x="68" y="30" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>
    <text x="90" y="30" font-size="15" font-weight="800" fill="#0F172A">Tribe Saarthi</text>
    
    <!-- User Chip -->
    <rect x="270" y="11" width="104" height="30" rx="15" fill="#F1F5F9" stroke="#E2E8F0" />
    <circle cx="284" cy="26" r="8" fill="url(#brandGrad)" />
    <text x="284" y="29" font-size="8" font-weight="800" fill="#FFFFFF" text-anchor="middle">AE</text>
    <text x="298" y="30" font-size="11" font-weight="700" fill="#0F172A">Asha · ST ▾</text>
  </g>

  <!-- Mobile Body Content -->
  <g transform="translate(16, 110)">
    <text x="0" y="18" font-size="18" font-weight="800" fill="#0F172A">Scholar Dashboard</text>
    <text x="0" y="34" font-size="12" font-weight="500" fill="#64748B">Scheduled Tribe Welfare Portal</text>

    <!-- Priority Action Card -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="48" width="358" height="160" rx="16" fill="url(#brandCardGrad)" />
      <rect x="0" y="48" width="358" height="160" rx="16" fill="url(#tribalPattern)" fill-opacity="0.3" />
      
      <rect x="16" y="64" width="115" height="22" rx="11" fill="#064E3B" stroke="#059669" stroke-width="0.8" />
      <circle cx="26" cy="75" r="3" fill="#FDE68A" />
      <text x="72" y="79" font-size="9" font-weight="800" fill="#FDE68A">ACTION READY</text>
      
      <text x="16" y="112" font-size="17" font-weight="800" fill="#FFFFFF">Disbursement Ready</text>
      <text x="16" y="132" font-size="12" fill="#D1FAE5">₹32,000 Direct Benefit Transfer approved to your bank.</text>
      
      <rect x="16" y="152" width="165" height="34" rx="10" fill="url(#goldButtonGrad)" />
      <text x="98" y="174" font-size="11" font-weight="800" fill="#78350F" text-anchor="middle">View DBT Receipt →</text>
    </g>

    <!-- Stepper Card -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="222" width="358" height="140" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
      <text x="16" y="248" font-size="13" font-weight="800" fill="#0F172A">Post-Matric ST Scholarship</text>
      <text x="16" y="266" font-size="11" fill="#64748B">Stage 3 of 4 Complete · App #TS-84920</text>
      
      <line x1="30" y1="298" x2="328" y2="298" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" />
      <line x1="30" y1="298" x2="228" y2="298" stroke="#059669" stroke-width="4" stroke-linecap="round" />

      <circle cx="30" cy="298" r="10" fill="#047857" />
      <circle cx="129" cy="298" r="10" fill="#047857" />
      <circle cx="228" cy="298" r="10" fill="#047857" />
      <circle cx="328" cy="298" r="10" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2" />

      <text x="30" y="322" font-size="9" font-weight="700" fill="#0F172A" text-anchor="middle">Draft</text>
      <text x="129" y="322" font-size="9" font-weight="700" fill="#0F172A" text-anchor="middle">Institute</text>
      <text x="228" y="322" font-size="9" font-weight="700" fill="#047857" text-anchor="middle">District ✓</text>
      <text x="328" y="322" font-size="9" font-weight="600" fill="#94A3B8" text-anchor="middle">Disbursed</text>
    </g>

    <!-- Quick Tools Split Grid -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="375" width="170" height="78" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      ${icons.wallet(16, 388, '#047857', 20)}
      <text x="44" y="403" font-size="12" font-weight="800" fill="#0F172A">DigiLocker</text>
      <text x="16" y="425" font-size="10" font-weight="700" fill="#047857">3 Docs Verified ✓</text>

      <rect x="188" y="375" width="170" height="78" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      ${icons.help(204, 388, '#2563EB', 20)}
      <text x="232" y="403" font-size="12" font-weight="800" fill="#0F172A">Saarthi AI</text>
      <text x="204" y="425" font-size="10" font-weight="600" fill="#475569">Santhali / हिन्दी</text>
    </g>

    <!-- Latest Notice Card -->
    <g filter="url(#cardShadow)">
      <rect x="0" y="465" width="358" height="66" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <circle cx="28" cy="498" r="12" fill="#ECFDF5" />
      <text x="28" y="502" font-size="11" font-weight="800" fill="#047857" text-anchor="middle">i</text>
      <text x="50" y="492" font-size="12" font-weight="700" fill="#0F172A">BIT Mesra Verification OK</text>
      <text x="50" y="508" font-size="10" fill="#64748B">Academic eligibility approved on 14 Oct.</text>
    </g>
  </g>

  <!-- Mobile Bottom Navigation Bar -->
  <g transform="translate(0, 764)">
    <rect x="0" y="0" width="390" height="80" fill="#FFFFFF" stroke="#E2E8F0" />
    
    <!-- Home Tab Active -->
    ${icons.home(36, 12, '#047857', 22)}
    <text x="47" y="46" font-size="10" font-weight="800" fill="#047857" text-anchor="middle">Home</text>
    <circle cx="47" cy="54" r="2" fill="#047857" />

    <!-- Schemes Tab -->
    ${icons.scholarship(114, 12, '#94A3B8', 22)}
    <text x="125" y="46" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">Schemes</text>

    <!-- Track Tab -->
    ${icons.tracker(192, 12, '#94A3B8', 22)}
    <text x="203" y="46" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">Track</text>

    <!-- Wallet Tab -->
    ${icons.wallet(268, 12, '#94A3B8', 22)}
    <text x="279" y="46" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">Wallet</text>

    <!-- Profile Tab -->
    ${icons.profile(340, 12, '#94A3B8', 22)}
    <text x="351" y="46" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">Profile</text>
    
    <!-- iOS Home Indicator -->
    <rect x="125" y="68" width="140" height="5" rx="2.5" fill="#0F172A" />
  </g>
</svg>`;
}

// Write the upgraded primary SVGs
fs.writeFileSync(path.join(scholarDir, '01-scholar-dashboard-desktop.svg'), makeStudentHome(), 'utf8');
fs.writeFileSync(path.join(scholarDir, '02-scholar-dashboard-mobile.svg'), makeStudentMobile(), 'utf8');
fs.writeFileSync(path.join(baseOutDir, '01-student-home.svg'), makeStudentHome(), 'utf8');
fs.writeFileSync(path.join(baseOutDir, '02-student-mobile.svg'), makeStudentMobile(), 'utf8');

console.log('Upgraded 01-scholar-dashboard-desktop.svg and 02-scholar-dashboard-mobile.svg to studio-grade vector quality.');

// Re-pack the ZIP file so the user gets the updated assets
try {
  const zipPath = path.resolve('docs/Tribe-Saarthi-Complete-22-SVGs.zip');
  execSync(`powershell -Command "Compress-Archive -Path 'docs/ui-mockups/*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
  console.log('Successfully re-compressed docs/Tribe-Saarthi-Complete-22-SVGs.zip');
} catch (e) {
  console.error('Failed to update zip:', e);
}
