import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('docs/ui-mockups');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// -------------------------------------------------------------
// Shared SVG Styling & Helpers
// -------------------------------------------------------------
const commonStyles = `
  <defs>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="motifGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#BD9456" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="darkCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1C1917" />
      <stop offset="100%" stop-color="#0C0A09" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.05" />
    </filter>
  </defs>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .title { font-weight: 800; font-size: 20px; fill: #1C1917; }
    .subtitle { font-weight: 500; font-size: 13px; fill: #57534E; }
    .badge { font-weight: 700; font-size: 10px; text-anchor: middle; }
    .btn-text { font-weight: 700; font-size: 12px; fill: #FFFFFF; text-anchor: middle; }
  </style>
`;

function renderTopAccent() {
  return `<rect x="0" y="0" width="100%" height="4" fill="url(#motifGrad)" />`;
}

function renderSidebar(activeKey = 'home', role = 'student') {
  const items = role === 'student' ? [
    { key: 'home', label: 'Dashboard', icon: '⊞', href: '/student' },
    { key: 'scholarships', label: 'Scholarships', icon: '◎', href: '/student/discovery' },
    { key: 'applications', label: 'My Applications', icon: '✓', href: '/student/application' },
    { key: 'documents', label: 'Documents', icon: '📁', href: '/student/wallet' },
    { key: 'history', label: 'History & DBT', icon: '₹', href: '/student/history' },
    { key: 'help', label: 'Help & Grievance', icon: '?', href: '/student/grievance' },
  ] : [
    { key: 'queue', label: 'Review Queue', icon: '✓', href: '/officer' },
    { key: 'coverage', label: 'Coverage Analytics', icon: '📊', href: '/officer/coverage' },
    { key: 'broadcasts', label: 'Announcements', icon: '📢', href: '/officer/broadcasts' },
    { key: 'audit', label: 'Activity Log', icon: '🛡', href: '/officer/audit' },
    { key: 'help', label: 'Help Requests', icon: '?', href: '/officer/grievances' },
  ];

  let svg = `
  <!-- Left Sidebar -->
  <rect x="0" y="4" width="250" height="956" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
  
  <!-- Logo / Ministry Brand -->
  <circle cx="45" cy="45" r="18" fill="#F5F5F4" stroke="#047857" stroke-width="2" />
  <circle cx="58" cy="58" r="4" fill="#10B981" />
  <text x="45" y="49" font-size="14" font-weight="900" fill="#047857" text-anchor="middle">TS</text>
  <text x="75" y="42" font-size="15" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
  <text x="75" y="56" font-size="10" font-weight="700" fill="#78350F" letter-spacing="0.5">MIN. OF TRIBAL AFFAIRS</text>
  <line x1="20" y1="75" x2="230" y2="75" stroke="#F5F5F4" stroke-width="1" />

  <!-- Nav Category -->
  <text x="30" y="100" font-size="10" font-weight="700" fill="#A8A29E" letter-spacing="1">
    ${role === 'student' ? 'SCHOLAR PORTAL' : 'OFFICER DESK'}
  </text>
  `;

  let y = 115;
  for (const it of items) {
    const isActive = it.key === activeKey;
    if (isActive) {
      svg += `
      <rect x="18" y="${y}" width="214" height="40" rx="10" fill="url(#brandGrad)" />
      <text x="35" y="${y + 24}" font-size="14" fill="#FDE68A">${it.icon}</text>
      <text x="60" y="${y + 25}" font-size="12" font-weight="700" fill="#FFFFFF">${it.label}</text>
      <circle cx="218" cy="${y + 20}" r="3" fill="#FDE68A" />
      `;
    } else {
      svg += `
      <rect x="18" y="${y}" width="214" height="40" rx="10" fill="transparent" />
      <text x="35" y="${y + 24}" font-size="14" fill="#78716C">${it.icon}</text>
      <text x="60" y="${y + 25}" font-size="12" font-weight="600" fill="#44403C">${it.label}</text>
      `;
    }
    y += 48;
  }

  // Bottom user card
  const userName = role === 'student' ? 'Asha Kiran Ekka' : 'Sh. A.K. Verma';
  const userSub = role === 'student' ? 'student Account' : 'nodal Account';
  svg += `
  <line x1="20" y1="870" x2="230" y2="870" stroke="#E7E5E4" stroke-width="1" />
  <rect x="20" y="885" width="210" height="60" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
  <text x="32" y="908" font-size="12" font-weight="700" fill="#1C1917">${userName}</text>
  <text x="32" y="923" font-size="10" font-weight="600" fill="#78716C">${userSub}</text>
  <rect x="165" y="897" width="52" height="18" rx="6" fill="#DBEAFE" />
  <text x="191" y="910" font-size="9" font-weight="800" fill="#1E40AF" text-anchor="middle">${role.toUpperCase()}</text>
  <text x="32" y="938" font-size="10" font-weight="700" fill="#E11D48">Sign out</text>
  `;

  return svg;
}

function renderHeader(title = 'Overview') {
  return `
  <!-- Top App Bar -->
  <rect x="250" y="4" width="1190" height="56" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
  <text x="275" y="37" font-size="12" font-weight="700" fill="#1C1917">भारत सरकार (Govt of India)</text>
  <text x="430" y="37" font-size="12" fill="#A8A29E">·</text>
  <text x="445" y="37" font-size="12" font-weight="600" fill="#57534E">Ministry of Tribal Affairs</text>
  <text x="590" y="37" font-size="12" fill="#A8A29E">·</text>
  <rect x="605" y="22" width="60" height="20" rx="4" fill="#F5F5F4" />
  <text x="635" y="36" font-size="10" font-family="monospace" font-weight="600" fill="#57534E" text-anchor="middle">PS 26238</text>

  <!-- Controls on Right -->
  <text x="960" y="37" font-size="11" font-weight="500" fill="#78716C">Local demo · no offline sync</text>
  
  <rect x="1110" y="16" width="130" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="1120" y="36" font-size="11" font-weight="700" fill="#1C1917">Asha · student ▾</text>

  <rect x="1250" y="16" width="80" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="1262" y="36" font-size="11" font-weight="600" fill="#1C1917">English ▾</text>

  <rect x="1340" y="16" width="80" height="30" rx="8" fill="url(#brandGrad)" />
  <text x="1380" y="36" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">▶ Tour</text>
  `;
}

// -------------------------------------------------------------
// 1. Student Home Desktop (1440 x 960)
// -------------------------------------------------------------
function makeStudentHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('home', 'student')}
  ${renderHeader('Dashboard')}

  <!-- Page Content Container -->
  <g transform="translate(280, 80)">
    <!-- Compact Task-Focused Greeting Banner -->
    <rect x="0" y="0" width="1120" height="85" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="25" y="16" width="105" height="20" rx="10" fill="#FEF3C7" />
    <text x="77" y="30" class="badge" fill="#92400E">★ PVTG SCHOLAR</text>
    <rect x="140" y="16" width="130" height="20" rx="10" fill="#D1FAE5" />
    <text x="205" y="30" class="badge" fill="#065F46">✓ SYNTHETIC DEMO PROFILE</text>

    <text x="25" y="60" font-size="20" font-weight="800" fill="#1C1917">Namaste, Asha Kiran Ekka 🎓</text>
    <text x="310" y="60" class="subtitle">B.Tech Computer Science (Year 3) · Ranchi, Jharkhand · BIT Mesra</text>

    <rect x="940" y="24" width="155" height="38" rx="10" fill="url(#amberGrad)" />
    <text x="1017" y="48" class="btn-text">Explore 4 Schemes →</text>

    <!-- Next Required Action Priority Card -->
    <g transform="translate(0, 105)">
      <rect x="0" y="0" width="1120" height="65" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <circle cx="35" cy="32" r="16" fill="#D1FAE5" />
      <text x="35" y="37" font-size="14" text-anchor="middle" fill="#047857">✓</text>
      <text x="65" y="26" font-size="13" font-weight="700" fill="#1C1917">Current Task Status: Institute Review in Progress</text>
      <text x="65" y="44" font-size="12" fill="#78716C">Post-Matric ST Scholarship · No action required from you right now. Verification is proceeding at the institution desk.</text>
      <text x="1020" y="38" font-size="12" font-weight="700" fill="#047857">View Tracker →</text>
    </g>

    <!-- Active Application Pipeline Card -->
    <g transform="translate(0, 185)">
      <rect x="0" y="0" width="1120" height="340" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      
      <!-- Card Header -->
      <text x="25" y="35" font-size="10" font-weight="800" fill="#B45309" letter-spacing="1">ACTIVE SCHOLARSHIP PIPELINE</text>
      <text x="25" y="62" font-size="17" font-weight="800" fill="#1C1917">Post-Matric Scholarship for ST Students · AY 2026-27</text>
      <text x="25" y="80" class="subtitle">Application ID: app_asha_2026_01 · Submitted on 12 Oct 2026</text>
      
      <rect x="960" y="25" width="135" height="32" rx="10" fill="#D1FAE5" stroke="#A7F3D0" />
      <text x="1027" y="46" font-size="13" font-weight="800" fill="#065F46" text-anchor="middle">₹1,20,000 / yr</text>

      <!-- 5-Stage Stepper -->
      <g transform="translate(25, 105)">
        <text x="0" y="0" font-size="11" font-weight="700" fill="#57534E">Application Progress Lifecycle</text>
        <text x="1000" y="0" font-size="10" font-family="monospace" fill="#A8A29E">Stage 2 of 5</text>

        <!-- Stage 1 (Done) -->
        <rect x="0" y="15" width="200" height="65" rx="12" fill="#ECFDF5" stroke="#A7F3D0" />
        <circle cx="25" cy="38" r="10" fill="#059669" />
        <text x="25" y="42" font-size="10" fill="#FFF" text-anchor="middle">✓</text>
        <text x="45" y="36" font-size="12" font-weight="700" fill="#064E3B">Submitted</text>
        <text x="45" y="52" font-size="10" fill="#059669">Registry match complete</text>

        <!-- Stage 2 (Active) -->
        <rect x="220" y="15" width="200" height="65" rx="12" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2" />
        <circle cx="245" cy="38" r="10" fill="#D97706" />
        <text x="245" y="42" font-size="10" fill="#FFF" text-anchor="middle">2</text>
        <text x="265" y="36" font-size="12" font-weight="700" fill="#92400E">Institute Desk</text>
        <text x="265" y="52" font-size="10" font-weight="700" fill="#B45309">ACTIVE REVIEW</text>

        <!-- Stage 3 (Pending) -->
        <rect x="440" y="15" width="200" height="65" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
        <circle cx="465" cy="38" r="10" fill="#D6D3D1" />
        <text x="465" y="42" font-size="10" fill="#78716C" text-anchor="middle">3</text>
        <text x="485" y="36" font-size="12" font-weight="600" fill="#78716C">Department</text>
        <text x="485" y="52" font-size="10" fill="#A8A29E">State verification</text>

        <!-- Stage 4 (Pending) -->
        <rect x="660" y="15" width="200" height="65" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
        <circle cx="685" cy="38" r="10" fill="#D6D3D1" />
        <text x="685" y="42" font-size="10" fill="#78716C" text-anchor="middle">4</text>
        <text x="705" y="36" font-size="12" font-weight="600" fill="#78716C">Sanctioned</text>
        <text x="705" y="52" font-size="10" fill="#A8A29E">Official DBT order</text>

        <!-- Stage 5 (Pending) -->
        <rect x="880" y="15" width="190" height="65" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
        <circle cx="905" cy="38" r="10" fill="#D6D3D1" />
        <text x="905" y="42" font-size="10" fill="#78716C" text-anchor="middle">5</text>
        <text x="925" y="36" font-size="12" font-weight="600" fill="#78716C">Disbursed</text>
        <text x="925" y="52" font-size="10" fill="#A8A29E">PFMS direct credit</text>
      </g>

      <!-- Multi-source Engine Checks -->
      <g transform="translate(25, 210)">
        <line x1="0" y1="0" x2="1070" y2="0" stroke="#F5F5F4" stroke-width="1" />
        <text x="0" y="22" font-size="11" font-weight="800" fill="#57534E" letter-spacing="0.5">MULTI-SOURCE ENGINE VERIFICATION STATUS</text>
        <text x="940" y="22" font-size="10" fill="#78716C">Simulated Connectors</text>

        <rect x="0" y="35" width="250" height="46" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="15" y="55" font-size="11" font-weight="700" fill="#1C1917">AISHE Institute Match</text>
        <text x="15" y="70" font-size="9" fill="#78716C">BIT Mesra (Active)</text>
        <rect x="175" y="47" width="60" height="20" rx="6" fill="#D1FAE5" />
        <text x="205" y="60" class="badge" fill="#065F46">PASS ✓</text>

        <rect x="270" y="35" width="250" height="46" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="285" y="55" font-size="11" font-weight="700" fill="#1C1917">State ST Certificate DB</text>
        <text x="285" y="70" font-size="9" fill="#78716C">JH-ST-2023-88741</text>
        <rect x="445" y="47" width="60" height="20" rx="6" fill="#D1FAE5" />
        <text x="475" y="60" class="badge" fill="#065F46">PASS ✓</text>

        <rect x="540" y="35" width="250" height="46" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="555" y="55" font-size="11" font-weight="700" fill="#1C1917">e-District Income Cert</text>
        <text x="555" y="70" font-size="9" fill="#78716C">Annual: ₹1,80,000</text>
        <rect x="715" y="47" width="60" height="20" rx="6" fill="#D1FAE5" />
        <text x="745" y="60" class="badge" fill="#065F46">PASS ✓</text>

        <rect x="810" y="35" width="260" height="46" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="825" y="55" font-size="11" font-weight="700" fill="#1C1917">UIDAI Aadhaar OTP</text>
        <text x="825" y="70" font-size="9" fill="#78716C">e-KYC verified</text>
        <rect x="995" y="47" width="60" height="20" rx="6" fill="#D1FAE5" />
        <text x="1025" y="60" class="badge" fill="#065F46">PASS ✓</text>
      </g>

      <!-- Bottom Card Links -->
      <line x1="25" y1="305" x2="1095" y2="305" stroke="#F5F5F4" stroke-width="1" />
      <text x="25" y="325" font-size="12" font-weight="700" fill="#047857">Full Application &amp; Receipt Slip →</text>
      <text x="270" y="325" font-size="12" font-weight="700" fill="#047857">Document Wallet (Reusable) →</text>
      <text x="940" y="325" font-size="12" font-weight="600" fill="#78716C">PFMS DBT Disbursement History →</text>
    </g>

    <!-- Digital Student ID (APAAR) Identity Bar -->
    <g transform="translate(0, 540)">
      <rect x="0" y="0" width="1120" height="68" rx="14" fill="url(#darkCardGrad)" />
      <circle cx="35" cy="34" r="16" fill="#3B260C" />
      <text x="35" y="39" font-size="14" text-anchor="middle" fill="#FBBF24">🏛</text>
      <text x="65" y="28" font-size="10" font-weight="800" fill="#FBBF24" letter-spacing="1">APAAR DIGITAL STUDENT IDENTITY (NEP 2020)</text>
      <text x="65" y="48" font-size="14" font-family="monospace" font-weight="700" fill="#FFFFFF">9823-4412-8874-9012</text>
      <text x="320" y="48" font-size="12" fill="#A8A29E">ABC Bank: <tspan fill="#34D399" font-weight="700">72 Academic Credits</tspan> · Asha Kiran Ekka</text>
      
      <rect x="950" y="18" width="150" height="32" rx="8" fill="#3B260C" stroke="#78350F" />
      <text x="1025" y="38" font-size="11" font-weight="700" fill="#FDE68A" text-anchor="middle">View Academic Card</text>
    </g>

    <!-- 4 Quick Stats Navigation Grid -->
    <g transform="translate(0, 625)">
      <rect x="0" y="0" width="265" height="90" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="20" y="30" font-size="12" font-weight="700" fill="#78716C">Document Wallet</text>
      <text x="20" y="58" font-size="24" font-weight="800" fill="#1C1917">5</text>
      <text x="20" y="76" font-size="11" font-weight="600" fill="#059669">5 verified &amp; reusable</text>

      <rect x="285" y="0" width="265" height="90" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="305" y="30" font-size="12" font-weight="700" fill="#78716C">Total Disbursed (PFMS)</text>
      <text x="305" y="58" font-size="24" font-weight="800" fill="#1C1917">₹1,20,000</text>
      <text x="305" y="76" font-size="11" font-weight="500" fill="#78716C">Direct Benefit Transfer</text>

      <rect x="570" y="0" width="265" height="90" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="590" y="30" font-size="12" font-weight="700" fill="#78716C">Seeded Schemes</text>
      <text x="590" y="58" font-size="24" font-weight="800" fill="#1C1917">4</text>
      <text x="590" y="76" font-size="11" font-weight="600" fill="#0284C7">Auto-matched to profile</text>

      <rect x="855" y="0" width="265" height="90" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="875" y="30" font-size="12" font-weight="700" fill="#78716C">Help &amp; Grievances</text>
      <text x="875" y="58" font-size="24" font-weight="800" fill="#1C1917">0</text>
      <text x="875" y="76" font-size="11" font-weight="500" fill="#78716C">All tickets resolved</text>
    </g>

    <!-- Recent Updates (Distinguishing informational updates from action items) -->
    <g transform="translate(0, 730)">
      <rect x="0" y="0" width="1120" height="95" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="20" y="28" font-size="13" font-weight="800" fill="#1C1917">Recent Announcements &amp; Updates (1)</text>
      <text x="960" y="28" font-size="11" fill="#78716C">Informational only</text>
      
      <rect x="20" y="42" width="1080" height="42" rx="8" fill="#FBF9F5" />
      <rect x="30" y="53" width="95" height="20" rx="6" fill="#E7E5E4" />
      <text x="77" y="66" class="badge" fill="#44403C">UPDATE</text>
      <text x="140" y="66" font-size="12" font-weight="600" fill="#1C1917">AY 2026-27 ST Scholarship verification schedule announced for Jharkhand institutions</text>
      <text x="1000" y="66" font-size="10" font-family="monospace" fill="#A8A29E">15 Oct 2026</text>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 2. Student Mobile Screen (390 x 844)
// -------------------------------------------------------------
function makeStudentMobile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="390" height="844" fill="#FAF7F2" />
  <rect x="0" y="0" width="390" height="4" fill="url(#motifGrad)" />

  <!-- Mobile Header -->
  <rect x="0" y="4" width="390" height="52" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
  <!-- Menu Hamburger Button -->
  <rect x="12" y="14" width="32" height="32" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <line x1="20" y1="23" x2="36" y2="23" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
  <line x1="20" y1="30" x2="36" y2="30" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
  <line x1="20" y1="37" x2="36" y2="37" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />

  <circle cx="65" cy="30" r="12" fill="#F5F5F4" stroke="#047857" stroke-width="1.5" />
  <text x="85" y="34" font-size="14" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
  
  <rect x="270" y="15" width="105" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="280" y="34" font-size="11" font-weight="700" fill="#1C1917">Asha · ST ▾</text>

  <!-- Mobile Greeting Card -->
  <rect x="12" y="68" width="366" height="90" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
  <rect x="24" y="80" width="90" height="18" rx="8" fill="#FEF3C7" />
  <text x="69" y="93" class="badge" fill="#92400E">★ PVTG SCHOLAR</text>
  <text x="24" y="122" font-size="16" font-weight="800" fill="#1C1917">Namaste, Asha Kiran Ekka</text>
  <text x="24" y="142" font-size="11" fill="#78716C">B.Tech CS (Yr 3) · BIT Mesra · Ranchi</text>

  <!-- Mobile Next Action Card -->
  <rect x="12" y="168" width="366" height="60" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
  <circle cx="32" cy="198" r="12" fill="#D1FAE5" />
  <text x="32" y="202" font-size="11" text-anchor="middle" fill="#047857">✓</text>
  <text x="52" y="192" font-size="11" font-weight="700" fill="#1C1917">Status: Institute Review Stage</text>
  <text x="52" y="210" font-size="10" fill="#78716C">Post-Matric ST · No action required right now</text>

  <!-- Mobile Application Pipeline Card -->
  <rect x="12" y="238" width="366" height="270" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
  <text x="24" y="260" font-size="9" font-weight="800" fill="#B45309" letter-spacing="1">CURRENT APPLICATION</text>
  <text x="24" y="280" font-size="13" font-weight="800" fill="#1C1917">Post-Matric ST Scholarship · ₹1.2L</text>
  <text x="24" y="296" font-size="10" fill="#78716C">Submitted on 12 Oct 2026 · Stage 2 of 5</text>

  <!-- Stepper Row -->
  <g transform="translate(24, 310)">
    <rect x="0" y="0" width="60" height="42" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
    <text x="30" y="24" font-size="9" font-weight="700" fill="#065F46" text-anchor="middle">1. Done ✓</text>

    <rect x="66" y="0" width="68" height="42" rx="8" fill="#FEF3C7" stroke="#F59E0B" />
    <text x="100" y="24" font-size="9" font-weight="800" fill="#B45309" text-anchor="middle">2. Institute</text>

    <rect x="140" y="0" width="62" height="42" rx="8" fill="#F5F5F4" />
    <text x="171" y="24" font-size="9" fill="#78716C" text-anchor="middle">3. Dept</text>

    <rect x="208" y="0" width="62" height="42" rx="8" fill="#F5F5F4" />
    <text x="239" y="24" font-size="9" fill="#78716C" text-anchor="middle">4. Order</text>

    <rect x="276" y="0" width="66" height="42" rx="8" fill="#F5F5F4" />
    <text x="309" y="24" font-size="9" fill="#78716C" text-anchor="middle">5. Disbursed</text>
  </g>

  <!-- Multi-source checks summary -->
  <g transform="translate(24, 370)">
    <text x="0" y="0" font-size="10" font-weight="700" fill="#57534E">Multi-Source Verification Engine</text>
    <rect x="0" y="10" width="166" height="30" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="10" y="28" font-size="9" font-weight="600" fill="#1C1917">AISHE Institute ✓</text>
    
    <rect x="176" y="10" width="166" height="30" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="186" y="28" font-size="9" font-weight="600" fill="#1C1917">State ST Cert ✓</text>

    <rect x="0" y="46" width="166" height="30" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="10" y="64" font-size="9" font-weight="600" fill="#1C1917">e-District Income ✓</text>

    <rect x="176" y="46" width="166" height="30" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="186" y="64" font-size="9" font-weight="600" fill="#1C1917">Aadhaar e-KYC ✓</text>
  </g>

  <!-- Mobile Quick 4-card Grid -->
  <g transform="translate(12, 520)">
    <rect x="0" y="0" width="176" height="65" rx="10" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="15" y="24" font-size="10" font-weight="700" fill="#78716C">Document Wallet</text>
    <text x="15" y="48" font-size="18" font-weight="800" fill="#1C1917">5</text>

    <rect x="190" y="0" width="176" height="65" rx="10" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="205" y="24" font-size="10" font-weight="700" fill="#78716C">Total Disbursed</text>
    <text x="205" y="48" font-size="18" font-weight="800" fill="#1C1917">₹1.20L</text>

    <rect x="0" y="75" width="176" height="65" rx="10" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="15" y="99" font-size="10" font-weight="700" fill="#78716C">Seeded Schemes</text>
    <text x="15" y="123" font-size="18" font-weight="800" fill="#1C1917">4</text>

    <rect x="190" y="75" width="176" height="65" rx="10" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="205" y="99" font-size="10" font-weight="700" fill="#78716C">Grievances</text>
    <text x="205" y="123" font-size="18" font-weight="800" fill="#1C1917">0</text>
  </g>

  <!-- Mobile APAAR Card bar -->
  <rect x="12" y="680" width="366" height="52" rx="10" fill="url(#darkCardGrad)" />
  <text x="25" y="700" font-size="9" font-weight="800" fill="#FBBF24">APAAR DIGITAL ID</text>
  <text x="25" y="720" font-size="12" font-family="monospace" fill="#FFFFFF">9823-4412-8874-9012</text>
  <rect x="250" y="692" width="115" height="28" rx="6" fill="#3B260C" />
  <text x="307" y="710" font-size="10" font-weight="700" fill="#FDE68A" text-anchor="middle">View Card</text>

  <!-- Mobile Drawer Preview overlay (Showing open reachable drawer) -->
  <g transform="translate(0, 0)">
    <!-- Semi-transparent backdrop -->
    <rect x="0" y="0" width="390" height="844" fill="#000000" fill-opacity="0.4" />
    <!-- Drawer Paper -->
    <rect x="0" y="0" width="280" height="844" fill="#FFFFFF" filter="url(#shadow)" />
    <!-- Drawer Header -->
    <rect x="0" y="0" width="280" height="60" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
    <text x="20" y="36" font-size="15" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
    <text x="240" y="36" font-size="16" font-weight="700" fill="#78716C">✕</text>

    <!-- Drawer Navigation Links -->
    <rect x="12" y="80" width="256" height="40" rx="8" fill="url(#brandGrad)" />
    <text x="25" y="105" font-size="14" fill="#FDE68A">⊞</text>
    <text x="45" y="105" font-size="13" font-weight="700" fill="#FFFFFF">Dashboard</text>

    <text x="25" y="150" font-size="14" fill="#78716C">◎</text>
    <text x="45" y="150" font-size="13" font-weight="600" fill="#44403C">Scholarships</text>

    <text x="25" y="195" font-size="14" fill="#78716C">✓</text>
    <text x="45" y="195" font-size="13" font-weight="600" fill="#44403C">My Applications</text>

    <text x="25" y="240" font-size="14" fill="#78716C">📁</text>
    <text x="45" y="240" font-size="13" font-weight="600" fill="#44403C">Document Wallet</text>

    <text x="25" y="285" font-size="14" fill="#78716C">₹</text>
    <text x="45" y="285" font-size="13" font-weight="600" fill="#44403C">Disbursement History</text>

    <text x="25" y="330" font-size="14" fill="#78716C">?</text>
    <text x="45" y="330" font-size="13" font-weight="600" fill="#44403C">Help &amp; Grievances</text>

    <!-- Bottom Account Info in Drawer -->
    <rect x="12" y="760" width="256" height="60" rx="10" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="25" y="784" font-size="12" font-weight="700" fill="#1C1917">Asha Kiran Ekka</text>
    <text x="25" y="802" font-size="10" font-weight="600" fill="#E11D48">Sign Out</text>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 3. Scholarships Discovery Desktop (1440 x 960)
// -------------------------------------------------------------
function makeScholarships() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('scholarships', 'student')}
  ${renderHeader('Scholarships')}

  <g transform="translate(280, 80)">
    <!-- Header with Search & Filter -->
    <rect x="0" y="0" width="1120" height="70" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="25" y="32" font-size="16" font-weight="800" fill="#1C1917">Scholarship Discovery</text>
    <text x="25" y="52" class="subtitle">Advisory matches evaluated against your verified profile &amp; declared criteria</text>

    <rect x="750" y="16" width="350" height="38" rx="10" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="765" y="40" font-size="12" fill="#78716C">🔍 Search schemes by name, ministry, or degree...</text>

    <!-- Filter chips -->
    <g transform="translate(0, 85)">
      <rect x="0" y="0" width="105" height="30" rx="15" fill="url(#brandGrad)" />
      <text x="52" y="20" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">All (4)</text>

      <rect x="115" y="0" width="130" height="30" rx="15" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="180" y="20" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Post-Matric (2)</text>

      <rect x="255" y="0" width="140" height="30" rx="15" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="325" y="20" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Higher Studies (1)</text>

      <rect x="405" y="0" width="130" height="30" rx="15" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="470" y="20" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">PVTG Priority (1)</text>
    </g>

    <!-- Scheme 1 Card -->
    <g transform="translate(0, 130)">
      <rect x="0" y="0" width="1120" height="170" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <rect x="25" y="20" width="120" height="22" rx="6" fill="#ECFDF5" />
      <text x="85" y="35" class="badge" fill="#047857">100% ELIGIBLE ✓</text>
      <rect x="155" y="20" width="110" height="22" rx="6" fill="#FEF3C7" />
      <text x="210" y="35" class="badge" fill="#92400E">CENTRAL SECTOR</text>

      <text x="25" y="68" font-size="17" font-weight="800" fill="#1C1917">Post-Matric Scholarship for ST Students</text>
      <text x="25" y="88" class="subtitle">Ministry of Tribal Affairs · Complete tuition fees + maintenance allowance</text>
      
      <text x="25" y="115" font-size="12" fill="#44403C">Criteria: ST Category (✓), Family Income &lt; ₹2.5L (✓), Course: B.Tech (✓)</text>
      <text x="25" y="135" font-size="11" font-weight="600" fill="#B45309">Deadline: 30 Nov 2026 · Academic Year 2026-27</text>

      <text x="820" y="70" font-size="22" font-weight="800" fill="#047857">₹1,20,000</text>
      <text x="820" y="88" font-size="11" fill="#78716C">Annual Benefit (DBT)</text>

      <rect x="940" y="55" width="155" height="40" rx="10" fill="#D1FAE5" stroke="#A7F3D0" />
      <text x="1017" y="80" font-size="12" font-weight="800" fill="#065F46" text-anchor="middle">Applied · In Review</text>
    </g>

    <!-- Scheme 2 Card -->
    <g transform="translate(0, 315)">
      <rect x="0" y="0" width="1120" height="170" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <rect x="25" y="20" width="120" height="22" rx="6" fill="#ECFDF5" />
      <text x="85" y="35" class="badge" fill="#047857">100% ELIGIBLE ✓</text>
      <rect x="155" y="20" width="130" height="22" rx="6" fill="#DBEAFE" />
      <text x="220" y="35" class="badge" fill="#1E40AF">OVERSEAS FELLOWSHIP</text>

      <text x="25" y="68" font-size="17" font-weight="800" fill="#1C1917">National Overseas Scholarship for ST Students</text>
      <text x="25" y="88" class="subtitle">Higher education abroad in Engineering, Science, Management and Humanities</text>
      
      <text x="25" y="115" font-size="12" fill="#44403C">Criteria: ST Category (✓), Qualifying Marks &gt;= 60% (✓), Family Income &lt; ₹8.0L (✓)</text>
      <text x="25" y="135" font-size="11" font-weight="600" fill="#B45309">Deadline: 31 Dec 2026 · Requires admission offer</text>

      <text x="820" y="70" font-size="22" font-weight="800" fill="#047857">₹25,00,000</text>
      <text x="820" y="88" font-size="11" fill="#78716C">Full Tuition + Living</text>

      <rect x="940" y="55" width="155" height="40" rx="10" fill="url(#brandGrad)" />
      <text x="1017" y="80" class="btn-text">Apply Now →</text>
    </g>

    <!-- Scheme 3 Card -->
    <g transform="translate(0, 500)">
      <rect x="0" y="0" width="1120" height="170" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <rect x="25" y="20" width="120" height="22" rx="6" fill="#ECFDF5" />
      <text x="85" y="35" class="badge" fill="#047857">100% ELIGIBLE ✓</text>
      <rect x="155" y="20" width="140" height="22" rx="6" fill="#FEE2E2" />
      <text x="225" y="35" class="badge" fill="#991B1B">TOP CLASS INSTITUTIONS</text>

      <text x="25" y="68" font-size="17" font-weight="800" fill="#1C1917">Top Class Education for ST Students (Institutes of Excellence)</text>
      <text x="25" y="88" class="subtitle">Full scholarship for ST students studying at premier institutions like IITs, NITs, BITs</text>
      
      <text x="25" y="115" font-size="12" fill="#44403C">Criteria: Enrolled in notified institute (✓), Family Income &lt; ₹6.0L (✓)</text>
      <text x="25" y="135" font-size="11" font-weight="600" fill="#B45309">Deadline: 15 Jan 2027 · BIT Mesra is a designated institute</text>

      <text x="820" y="70" font-size="22" font-weight="800" fill="#047857">₹2,00,000</text>
      <text x="820" y="88" font-size="11" fill="#78716C">Tuition + Books/PC</text>

      <rect x="940" y="55" width="155" height="40" rx="10" fill="url(#brandGrad)" />
      <text x="1017" y="80" class="btn-text">Apply Now →</text>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 4. Applications & Tracker Desktop (1440 x 960)
// -------------------------------------------------------------
function makeApplicationsTracker() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('applications', 'student')}
  ${renderHeader('My Applications')}

  <g transform="translate(280, 80)">
    <!-- Header -->
    <rect x="0" y="0" width="1120" height="70" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="25" y="32" font-size="16" font-weight="800" fill="#1C1917">My Applications &amp; Tracking Lifecycle</text>
    <text x="25" y="52" class="subtitle">Complete audit trail of stages, official sanction orders, and tamper-evident receipts</text>

    <!-- Main Active Tracking Card -->
    <g transform="translate(0, 85)">
      <rect x="0" y="0" width="1120" height="420" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <text x="25" y="35" font-size="10" font-weight="800" fill="#B45309" letter-spacing="1">APPLICATION TRACKER · ID: APP_ASHA_2026_01</text>
      <text x="25" y="65" font-size="18" font-weight="800" fill="#1C1917">Post-Matric ST Scholarship · ₹1,20,000</text>
      
      <rect x="940" y="25" width="155" height="32" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
      <text x="1017" y="46" font-size="12" font-weight="800" fill="#047857" text-anchor="middle">Institute Review Stage</text>

      <!-- Stepper Visual -->
      <g transform="translate(25, 90)">
        <line x1="50" y1="20" x2="1020" y2="20" stroke="#E7E5E4" stroke-width="4" />
        <line x1="50" y1="20" x2="280" y2="20" stroke="#059669" stroke-width="4" />

        <circle cx="50" cy="20" r="14" fill="#059669" />
        <text x="50" y="25" font-size="11" fill="#FFF" font-weight="800" text-anchor="middle">✓</text>
        <text x="50" y="50" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">Submitted</text>
        <text x="50" y="65" font-size="10" fill="#78716C" text-anchor="middle">12 Oct 2026</text>

        <circle cx="280" cy="20" r="16" fill="#F59E0B" stroke="#FFF" stroke-width="3" />
        <text x="280" y="25" font-size="11" fill="#FFF" font-weight="800" text-anchor="middle">2</text>
        <text x="280" y="50" font-size="11" font-weight="800" fill="#B45309" text-anchor="middle">Institute Review</text>
        <text x="280" y="65" font-size="10" font-weight="700" fill="#D97706" text-anchor="middle">In Progress</text>

        <circle cx="530" cy="20" r="12" fill="#D6D3D1" />
        <text x="530" y="24" font-size="10" fill="#78716C" font-weight="700" text-anchor="middle">3</text>
        <text x="530" y="50" font-size="11" font-weight="600" fill="#78716C" text-anchor="middle">Department</text>

        <circle cx="780" cy="20" r="12" fill="#D6D3D1" />
        <text x="780" y="24" font-size="10" fill="#78716C" font-weight="700" text-anchor="middle">4</text>
        <text x="780" y="50" font-size="11" font-weight="600" fill="#78716C" text-anchor="middle">Sanction Order</text>

        <circle cx="1020" cy="20" r="12" fill="#D6D3D1" />
        <text x="1020" y="24" font-size="10" fill="#78716C" font-weight="700" text-anchor="middle">5</text>
        <text x="1020" y="50" font-size="11" font-weight="600" fill="#78716C" text-anchor="middle">Disbursed (PFMS)</text>
      </g>

      <!-- Attached Documents List -->
      <g transform="translate(25, 190)">
        <line x1="0" y1="0" x2="1070" y2="0" stroke="#F5F5F4" stroke-width="1" />
        <text x="0" y="25" font-size="12" font-weight="800" fill="#1C1917">Attached Document Versions (Immutable Cross-Scheme Reuse)</text>
        
        <rect x="0" y="40" width="340" height="60" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="15" y="62" font-size="12" font-weight="700" fill="#1C1917">ST Category Certificate</text>
        <text x="15" y="80" font-size="10" fill="#78716C">Version 2 · Verified by District Magistrate</text>
        <text x="280" y="72" font-size="11" font-weight="700" fill="#047857">Verified ✓</text>

        <rect x="365" y="40" width="340" height="60" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="380" y="62" font-size="12" font-weight="700" fill="#1C1917">Income Certificate</text>
        <text x="380" y="80" font-size="10" fill="#78716C">Version 1 · Annual Income ₹1,80,000</text>
        <text x="645" y="72" font-size="11" font-weight="700" fill="#047857">Verified ✓</text>

        <rect x="730" y="40" width="340" height="60" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="745" y="62" font-size="12" font-weight="700" fill="#1C1917">BIT Mesra Admission Slip</text>
        <text x="745" y="80" font-size="10" fill="#78716C">Version 1 · Enrolled B.Tech Yr 3</text>
        <text x="1005" y="72" font-size="11" font-weight="700" fill="#B45309">Under Review</text>
      </g>

      <!-- Tamper-evident receipt & Action Slip -->
      <g transform="translate(25, 320)">
        <line x1="0" y1="0" x2="1070" y2="0" stroke="#F5F5F4" stroke-width="1" />
        <rect x="0" y="15" width="60" height="60" fill="#F5F5F4" stroke="#E7E5E4" />
        <text x="30" y="50" font-size="18" text-anchor="middle">▦</text>

        <text x="75" y="32" font-size="11" font-weight="700" fill="#1C1917">Tamper-Evident Digital Application Receipt</text>
        <text x="75" y="48" font-size="10" font-family="monospace" fill="#78716C">SHA-256 Digest: 8f3a8b23c91e0a...7c1a (Verified against Supabase Decision Log)</text>
        <text x="75" y="64" font-size="10" fill="#059669">Receipt QR allows public rate-limited verification without disclosing private student profile</text>

        <rect x="880" y="24" width="190" height="40" rx="10" fill="url(#brandGrad)" />
        <text x="975" y="48" class="btn-text">Download Official Slip (PDF)</text>
      </g>
    </g>

    <!-- Past Applications History -->
    <g transform="translate(0, 520)">
      <rect x="0" y="0" width="1120" height="90" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="25" y="30" font-size="13" font-weight="800" fill="#1C1917">Past Completed Applications</text>
      
      <rect x="25" y="42" width="1070" height="36" rx="6" fill="#FBF9F5" />
      <text x="40" y="64" font-size="12" font-weight="700" fill="#1C1917">Post-Matric Scholarship for ST Students · AY 2025-26</text>
      <text x="600" y="64" font-size="11" font-family="monospace" fill="#78716C">PFMS Ref: PFMS-2025-ST-99124</text>
      <rect x="940" y="48" width="130" height="24" rx="6" fill="#D1FAE5" />
      <text x="1005" y="64" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">DISBURSED ₹1.20L ✓</text>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 5. Officer Review Queue Desktop (1440 x 960)
// -------------------------------------------------------------
function makeOfficerQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('queue', 'officer')}
  ${renderHeader('Officer Review Queue')}

  <g transform="translate(280, 80)">
    <!-- Header with Sabotage Widget -->
    <rect x="0" y="0" width="1120" height="85" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="25" y="32" font-size="16" font-weight="800" fill="#1C1917">State Officer Review Desk · Tribal Welfare Dept</text>
    <text x="25" y="52" class="subtitle">Multi-level scrutiny queue · Gated approval, deficiency resolution, and DBT sanction</text>

    <!-- Sabotage Switchboard Simulator -->
    <rect x="760" y="16" width="340" height="52" rx="10" fill="#FEF2F2" stroke="#FCA5A5" />
    <text x="775" y="35" font-size="10" font-weight="800" fill="#991B1B">LIVE "KILL-A-SOURCE" SIMULATOR</text>
    <rect x="775" y="42" width="100" height="20" rx="4" fill="#DC2626" />
    <text x="825" y="55" font-size="9" font-weight="700" fill="#FFF" text-anchor="middle">Kill Income API</text>
    <rect x="885" y="42" width="100" height="20" rx="4" fill="#059669" />
    <text x="935" y="55" font-size="9" font-weight="700" fill="#FFF" text-anchor="middle">Restore Sources</text>

    <!-- Filter Tabs -->
    <g transform="translate(0, 100)">
      <rect x="0" y="0" width="130" height="32" rx="8" fill="url(#brandGrad)" />
      <text x="65" y="21" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">All Cases (14)</text>

      <rect x="140" y="0" width="160" height="32" rx="8" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="220" y="21" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Pending Institute (5)</text>

      <rect x="310" y="0" width="180" height="32" rx="8" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="400" y="21" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Pending Department (6)</text>

      <rect x="500" y="0" width="170" height="32" rx="8" fill="#FFFFFF" stroke="#E7E5E4" />
      <text x="585" y="21" font-size="11" font-weight="600" fill="#B45309" text-anchor="middle">Deficiency Flagged (3)</text>
    </g>

    <!-- Cases Data Table -->
    <g transform="translate(0, 145)">
      <rect x="0" y="0" width="1120" height="450" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      
      <!-- Table Header -->
      <rect x="0" y="0" width="1120" height="42" rx="16" fill="#FBF9F5" />
      <text x="25" y="26" font-size="11" font-weight="700" fill="#78716C">APPLICANT</text>
      <text x="220" y="26" font-size="11" font-weight="700" fill="#78716C">SCHEME</text>
      <text x="450" y="26" font-size="11" font-weight="700" fill="#78716C">TRIBE / DISTRICT</text>
      <text x="640" y="26" font-size="11" font-weight="700" fill="#78716C">STAGE</text>
      <text x="800" y="26" font-size="11" font-weight="700" fill="#78716C">PIPELINE CHECKS</text>
      <text x="1000" y="26" font-size="11" font-weight="700" fill="#78716C">ACTION</text>

      <!-- Row 1 -->
      <line x1="0" y1="42" x2="1120" y2="42" stroke="#E7E5E4" />
      <text x="25" y="75" font-size="13" font-weight="800" fill="#1C1917">Asha Kiran Ekka</text>
      <text x="25" y="92" font-size="11" fill="#78716C">app_asha_2026_01</text>
      <text x="220" y="75" font-size="12" font-weight="600" fill="#1C1917">Post-Matric ST</text>
      <text x="220" y="92" font-size="11" fill="#78716C">BIT Mesra · ₹1.20L</text>
      <text x="450" y="75" font-size="12" font-weight="600" fill="#1C1917">Oraon (PVTG)</text>
      <text x="450" y="92" font-size="11" fill="#78716C">Ranchi, Jharkhand</text>
      <rect x="640" y="65" width="120" height="24" rx="6" fill="#FEF3C7" />
      <text x="700" y="81" font-size="10" font-weight="700" fill="#92400E" text-anchor="middle">Institute Review</text>
      <text x="800" y="81" font-size="11" font-weight="700" fill="#047857">4/4 Passed ✓</text>
      <rect x="990" y="62" width="105" height="30" rx="8" fill="url(#brandGrad)" />
      <text x="1042" y="81" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">Inspect &amp; Review</text>

      <!-- Row 2 -->
      <line x1="0" y1="110" x2="1120" y2="110" stroke="#F5F5F4" />
      <text x="25" y="145" font-size="13" font-weight="800" fill="#1C1917">Mohan Ram Rojat</text>
      <text x="25" y="162" font-size="11" fill="#78716C">app_mohan_2026_02</text>
      <text x="220" y="145" font-size="12" font-weight="600" fill="#1C1917">National Overseas</text>
      <text x="220" y="162" font-size="11" fill="#78716C">IIT Bombay · ₹25L</text>
      <text x="450" y="145" font-size="12" font-weight="600" fill="#1C1917">Baiga (PVTG Priority)</text>
      <text x="450" y="162" font-size="11" fill="#78716C">Mandla, MP</text>
      <rect x="640" y="135" width="120" height="24" rx="6" fill="#FEE2E2" />
      <text x="700" y="151" font-size="10" font-weight="700" fill="#991B1B" text-anchor="middle">Deficiency Flagged</text>
      <text x="800" y="151" font-size="11" font-weight="700" fill="#DC2626">Income Cert Mismatch ⚠</text>
      <rect x="990" y="132" width="105" height="30" rx="8" fill="#B45309" />
      <text x="1042" y="151" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">View Deficiency</text>

      <!-- Row 3 -->
      <line x1="0" y1="180" x2="1120" y2="180" stroke="#F5F5F4" />
      <text x="25" y="215" font-size="13" font-weight="800" fill="#1C1917">Sunita Murmu</text>
      <text x="25" y="232" font-size="11" fill="#78716C">app_sunita_2026_03</text>
      <text x="220" y="215" font-size="12" font-weight="600" fill="#1C1917">Pre-Matric ST</text>
      <text x="220" y="232" font-size="11" fill="#78716C">Govt Model School · ₹45K</text>
      <text x="450" y="215" font-size="12" font-weight="600" fill="#1C1917">Santal (ST)</text>
      <text x="450" y="232" font-size="11" fill="#78716C">Mayurbhanj, Odisha</text>
      <rect x="640" y="205" width="120" height="24" rx="6" fill="#DBEAFE" />
      <text x="700" y="221" font-size="10" font-weight="700" fill="#1E40AF" text-anchor="middle">Department Stage</text>
      <text x="800" y="221" font-size="11" font-weight="700" fill="#047857">Verified Ready</text>
      <rect x="990" y="202" width="105" height="30" rx="8" fill="url(#brandGrad)" />
      <text x="1042" y="221" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">Sign Sanction ✍</text>

      <!-- Row 4 -->
      <line x1="0" y1="250" x2="1120" y2="250" stroke="#F5F5F4" />
      <text x="25" y="285" font-size="13" font-weight="800" fill="#1C1917">Birsa Munda</text>
      <text x="25" y="302" font-size="11" fill="#78716C">app_birsa_2026_04</text>
      <text x="220" y="285" font-size="12" font-weight="600" fill="#1C1917">Top Class Education</text>
      <text x="220" y="302" font-size="11" fill="#78716C">IIT Kharagpur · ₹2.0L</text>
      <text x="450" y="285" font-size="12" font-weight="600" fill="#1C1917">Munda (ST)</text>
      <text x="450" y="302" font-size="11" fill="#78716C">Khunti, Jharkhand</text>
      <rect x="640" y="275" width="120" height="24" rx="6" fill="#D1FAE5" />
      <text x="700" y="291" font-size="10" font-weight="700" fill="#065F46" text-anchor="middle">Sanctioned</text>
      <text x="800" y="291" font-size="11" font-weight="700" fill="#047857">PFMS Queued</text>
      <rect x="990" y="272" width="105" height="30" rx="8" fill="#047857" />
      <text x="1042" y="291" font-size="11" font-weight="700" fill="#FFF" text-anchor="middle">Trigger DBT</text>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 6. Document Wallet Desktop (1440 x 960)
// -------------------------------------------------------------
function makeDocumentWallet() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('documents', 'student')}
  ${renderHeader('Document Wallet')}

  <g transform="translate(280, 80)">
    <!-- Header with Upload CTA -->
    <rect x="0" y="0" width="1120" height="85" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="25" y="34" font-size="17" font-weight="800" fill="#1C1917">DigiLocker-Style Student Document Wallet</text>
    <text x="25" y="55" class="subtitle">Zero-Re-Upload Architecture · Upload once, reuse across all Central &amp; State scholarship schemes</text>

    <rect x="920" y="22" width="175" height="40" rx="10" fill="url(#brandGrad)" />
    <text x="1007" y="47" class="btn-text">＋ Upload New Document</text>

    <!-- Upload Dropzone / Banner -->
    <g transform="translate(0, 105)">
      <rect x="0" y="0" width="1120" height="75" rx="12" fill="#ECFDF5" stroke="#A7F3D0" stroke-dasharray="4 4" />
      <text x="560" y="35" font-size="13" font-weight="700" fill="#065F46" text-anchor="middle">Drag &amp; drop PDF, JPEG, or PNG certificate (Max 10 MB)</text>
      <text x="560" y="55" font-size="11" fill="#047857" text-anchor="middle">Supports mobile camera capture · Document SHA-256 fingerprint generated client-side</text>
    </g>

    <!-- Documents Grid (2x2) -->
    <g transform="translate(0, 200)">
      <!-- Doc 1: ST Certificate -->
      <rect x="0" y="0" width="545" height="180" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <circle cx="45" cy="45" r="20" fill="#ECFDF5" />
      <text x="45" y="51" font-size="16" text-anchor="middle">📜</text>
      <text x="80" y="40" font-size="15" font-weight="800" fill="#1C1917">Scheduled Tribe (ST) Certificate</text>
      <text x="80" y="58" class="subtitle">Issued by Sub-Divisional Officer, Ranchi · Certificate No: JH-ST-2023-88741</text>
      
      <rect x="420" y="28" width="105" height="24" rx="6" fill="#D1FAE5" />
      <text x="472" y="44" class="badge" fill="#065F46">VERIFIED ✓</text>

      <line x1="25" y1="85" x2="520" y2="85" stroke="#F5F5F4" />
      <text x="25" y="112" font-size="11" font-family="monospace" fill="#78716C">SHA-256: 4f1a9c3d...b82e · Version: 2 (Corrects v1)</text>
      <text x="25" y="132" font-size="11" font-weight="600" fill="#047857">Reused across: Post-Matric ST, Top Class Scholarship</text>
      
      <rect x="25" y="145" width="110" height="26" rx="6" fill="#F5F5F4" />
      <text x="80" y="162" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View Private File</text>

      <!-- Doc 2: Income Certificate -->
      <rect x="575" y="0" width="545" height="180" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <circle cx="620" cy="45" r="20" fill="#ECFDF5" />
      <text x="620" y="51" font-size="16" text-anchor="middle">₹</text>
      <text x="655" y="40" font-size="15" font-weight="800" fill="#1C1917">Annual Family Income Certificate</text>
      <text x="655" y="58" class="subtitle">Issued by Circle Officer · Annual declared income: ₹1,80,000</text>
      
      <rect x="995" y="28" width="105" height="24" rx="6" fill="#D1FAE5" />
      <text x="1047" y="44" class="badge" fill="#065F46">VERIFIED ✓</text>

      <line x1="600" y1="85" x2="1095" y2="85" stroke="#F5F5F4" />
      <text x="600" y="112" font-size="11" font-family="monospace" fill="#78716C">SHA-256: 9b2e04f1...1a3c · Version: 1</text>
      <text x="600" y="132" font-size="11" font-weight="600" fill="#047857">Valid until: 31 March 2027 · Reused in 2 applications</text>

      <rect x="600" y="145" width="110" height="26" rx="6" fill="#F5F5F4" />
      <text x="655" y="162" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View Private File</text>

      <!-- Doc 3: Domicile Certificate -->
      <rect x="0" y="200" width="545" height="180" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <circle cx="45" cy="245" r="20" fill="#ECFDF5" />
      <text x="45" y="251" font-size="16" text-anchor="middle">🏠</text>
      <text x="80" y="240" font-size="15" font-weight="800" fill="#1C1917">State Domicile / Residential Certificate</text>
      <text x="80" y="258" class="subtitle">Permanent Resident of Ranchi, Jharkhand</text>
      
      <rect x="420" y="228" width="105" height="24" rx="6" fill="#D1FAE5" />
      <text x="472" y="244" class="badge" fill="#065F46">VERIFIED ✓</text>

      <line x1="25" y1="285" x2="520" y2="285" stroke="#F5F5F4" />
      <text x="25" y="312" font-size="11" font-family="monospace" fill="#78716C">SHA-256: 3c1a9b2e...04f1 · Version: 1</text>
      <text x="25" y="332" font-size="11" font-weight="600" fill="#047857">Reused across all state quota applications</text>

      <rect x="25" y="345" width="110" height="26" rx="6" fill="#F5F5F4" />
      <text x="80" y="362" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View Private File</text>

      <!-- Doc 4: Admission Proof -->
      <rect x="575" y="200" width="545" height="180" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <circle cx="620" cy="245" r="20" fill="#FEF3C7" />
      <text x="620" y="251" font-size="16" text-anchor="middle">🎓</text>
      <text x="655" y="240" font-size="15" font-weight="800" fill="#1C1917">Institute Admission &amp; Bonafide Letter</text>
      <text x="655" y="258" class="subtitle">BIT Mesra · Roll No: BTECH/CS/2024/041 · 3rd Year Bonafide</text>
      
      <rect x="995" y="228" width="105" height="24" rx="6" fill="#FEF3C7" />
      <text x="1047" y="244" class="badge" fill="#92400E">UNDER REVIEW</text>

      <line x1="600" y1="285" x2="1095" y2="285" stroke="#F5F5F4" />
      <text x="600" y="312" font-size="11" font-family="monospace" fill="#78716C">SHA-256: e82b3a9c...1d4f · Version: 1</text>
      <text x="600" y="332" font-size="11" font-weight="600" fill="#B45309">Under review by Nodal Officer, BIT Mesra</text>

      <rect x="600" y="345" width="110" height="26" rx="6" fill="#F5F5F4" />
      <text x="655" y="362" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View Private File</text>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 7. Help & Grievances Desktop (1440 x 960)
// -------------------------------------------------------------
function makeHelpGrievances() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('help', 'student')}
  ${renderHeader('Help & Grievance')}

  <g transform="translate(280, 80)">
    <!-- Header -->
    <rect x="0" y="0" width="1120" height="70" rx="14" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="25" y="32" font-size="16" font-weight="800" fill="#1C1917">Help, Inquiries &amp; Grievance Redressal</text>
    <text x="25" y="52" class="subtitle">Direct grievance submission to state nodal officers with mandated SLA resolution tracking</text>

    <!-- Two-column: Left = Form & Tickets, Right = Saarthi AI Assistant -->
    <g transform="translate(0, 85)">
      <!-- Left: File a Grievance Form -->
      <rect x="0" y="0" width="700" height="340" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <text x="25" y="35" font-size="15" font-weight="800" fill="#1C1917">File an Inquiry or Grievance</text>
      <text x="25" y="55" class="subtitle">Assigned directly to your District Welfare Officer with 7-day resolution SLA</text>

      <text x="25" y="90" font-size="11" font-weight="700" fill="#44403C">Grievance Category</text>
      <rect x="25" y="100" width="650" height="36" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
      <text x="40" y="123" font-size="12" fill="#1C1917">Verification Delay / Pending Review ▾</text>

      <text x="25" y="155" font-size="11" font-weight="700" fill="#44403C">Subject</text>
      <rect x="25" y="165" width="650" height="36" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
      <text x="40" y="188" font-size="12" fill="#1C1917">Institute stage verification pending beyond 14 days</text>

      <text x="25" y="220" font-size="11" font-weight="700" fill="#44403C">Detailed Explanation</text>
      <rect x="25" y="230" width="650" height="55" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
      <text x="40" y="250" font-size="11" fill="#78716C">Application app_asha_2026_01 was submitted on 12 Oct 2026. Required documents are verified.</text>

      <rect x="520" y="295" width="155" height="34" rx="8" fill="url(#brandGrad)" />
      <text x="597" y="316" class="btn-text">Submit Grievance →</text>

      <!-- Right Column: Saarthi Voice & AI Assistant -->
      <g transform="translate(725, 0)">
        <rect x="0" y="0" width="395" height="490" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
        <rect x="0" y="0" width="395" height="60" rx="16" fill="url(#brandGrad)" />
        <text x="20" y="36" font-size="15" font-weight="800" fill="#FFF">🤖 Saarthi AI Assistant</text>
        <rect x="290" y="20" width="85" height="24" rx="12" fill="#065F46" />
        <text x="332" y="36" font-size="10" font-weight="700" fill="#A7F3D0" text-anchor="middle">Hindi / English</text>

        <!-- Chat messages -->
        <rect x="20" y="80" width="320" height="55" rx="10" fill="#F5F5F4" />
        <text x="32" y="100" font-size="11" font-weight="700" fill="#047857">Saarthi:</text>
        <text x="32" y="118" font-size="11" fill="#1C1917">नमस्ते आशा! आपकी पोस्ट-मैट्रिक छात्रवृत्ति संस्थान स्तर पर समीक्षाधीन है।</text>

        <rect x="80" y="150" width="295" height="40" rx="10" fill="#ECFDF5" />
        <text x="92" y="174" font-size="11" fill="#064E3B">क्या मुझे कोई दस्तावेज़ दोबारा अपलोड करना होगा?</text>

        <rect x="20" y="205" width="350" height="70" rx="10" fill="#F5F5F4" />
        <text x="32" y="225" font-size="11" font-weight="700" fill="#047857">Saarthi:</text>
        <text x="32" y="243" font-size="11" fill="#1C1917">नहीं, आपके सभी 4 प्रमाणपत्र सत्यापित हैं। अधिकारी द्वारा समीक्षा पूर्ण होते ही आपको एसएमएस प्राप्त होगा।</text>

        <!-- Quick prompt chips -->
        <text x="20" y="305" font-size="10" font-weight="700" fill="#78716C">COMMON QUESTIONS:</text>
        <rect x="20" y="320" width="355" height="28" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="30" y="338" font-size="10" fill="#1C1917">📌 How to track PFMS payment status?</text>

        <rect x="20" y="355" width="355" height="28" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="30" y="373" font-size="10" fill="#1C1917">📌 How to resolve document deficiency?</text>

        <rect x="20" y="390" width="355" height="28" rx="6" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="30" y="408" font-size="10" fill="#1C1917">📌 Eligibility criteria for overseas scholarship</text>

        <!-- Input box -->
        <rect x="20" y="435" width="355" height="38" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
        <text x="35" y="458" font-size="11" fill="#78716C">Ask Saarthi a question...</text>
      </g>

      <!-- Bottom: Recent Grievances List -->
      <g transform="translate(0, 360)">
        <rect x="0" y="0" width="700" height="130" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
        <text x="25" y="30" font-size="13" font-weight="800" fill="#1C1917">Your Active &amp; Resolved Inquiries</text>
        
        <rect x="20" y="45" width="660" height="65" rx="8" fill="#FBF9F5" stroke="#E7E5E4" />
        <text x="35" y="68" font-size="12" font-weight="700" fill="#1C1917">GRV-2026-JH-0041 · ST Certificate Verification Delay</text>
        <text x="35" y="85" font-size="10" fill="#78716C">Assigned to: Sh. A.K. Verma (State Nodal Officer) · Filed: 05 Oct 2026</text>
        <rect x="560" y="60" width="105" height="24" rx="6" fill="#D1FAE5" />
        <text x="612" y="76" class="badge" fill="#065F46">RESOLVED ✓</text>
      </g>
    </g>
  </g>
</svg>
`;
}

// -------------------------------------------------------------
// 8. Pilot Sign-in Screen Desktop (1440 x 960)
// -------------------------------------------------------------
function makePilotSignIn() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}

  <!-- Minimal Header -->
  <rect x="0" y="4" width="1440" height="60" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
  <circle cx="45" cy="34" r="16" fill="#F5F5F4" stroke="#047857" stroke-width="1.5" />
  <text x="45" y="39" font-size="12" font-weight="900" fill="#047857" text-anchor="middle">TS</text>
  <text x="75" y="33" font-size="16" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
  <text x="75" y="47" font-size="10" font-weight="700" fill="#78350F">MINISTRY OF TRIBAL AFFAIRS · WORKING PILOT</text>
  
  <rect x="1310" y="19" width="100" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="1360" y="38" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">English / हिन्दी</text>

  <!-- Centered Sign-in Card Frame -->
  <g transform="translate(480, 110)">
    <rect x="0" y="0" width="480" height="740" rx="20" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Card Header -->
    <circle cx="240" cy="55" r="28" fill="#FBF9F5" stroke="#047857" stroke-width="2" />
    <text x="240" y="62" font-size="20" text-anchor="middle">🏛</text>
    <text x="240" y="110" font-size="20" font-weight="800" fill="#1C1917" text-anchor="middle">Tribe Saarthi · Working Pilot</text>
    <text x="240" y="130" font-size="12" fill="#78716C" text-anchor="middle">Invite-Only Access · Dedicated Hosted Staging</text>

    <!-- PWA Install Banner -->
    <rect x="35" y="150" width="410" height="46" rx="10" fill="#ECFDF5" stroke="#A7F3D0" />
    <text x="50" y="172" font-size="11" font-weight="700" fill="#065F46">📲 Install Tribe Saarthi PWA</text>
    <text x="50" y="186" font-size="10" fill="#047857">Enable offline draft editing &amp; camera capture on Android</text>
    <rect x="355" y="158" width="80" height="28" rx="6" fill="#059669" />
    <text x="395" y="176" font-size="10" font-weight="700" fill="#FFF" text-anchor="middle">Install</text>

    <!-- Disclosures & Privacy Notice -->
    <rect x="35" y="210" width="410" height="58" rx="10" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="45" y="228" font-size="10" font-weight="700" fill="#92400E">PILOT DISCLOSURE</text>
    <text x="45" y="244" font-size="10" fill="#78716C">In-app delivery is live. Government connectors, OCR, and payments</text>
    <text x="45" y="258" font-size="10" fill="#78716C">are simulated for this evaluation cohort. No real credentials leaked.</text>

    <!-- Sign In Form -->
    <g transform="translate(35, 290)">
      <text x="0" y="0" font-size="12" font-weight="700" fill="#1C1917">Email Address</text>
      <rect x="0" y="10" width="410" height="42" rx="8" fill="#FFFFFF" stroke="#D6D3D1" />
      <text x="15" y="36" font-size="13" fill="#1C1917">asha.ekka@student.tribe.gov.in</text>

      <text x="0" y="75" font-size="12" font-weight="700" fill="#1C1917">Password</text>
      <rect x="0" y="85" width="410" height="42" rx="8" fill="#FFFFFF" stroke="#D6D3D1" />
      <text x="15" y="111" font-size="14" fill="#78716C">••••••••••••••••</text>

      <rect x="0" y="145" width="410" height="44" rx="10" fill="url(#brandGrad)" />
      <text x="205" y="172" class="btn-text">Sign In to Workspace →</text>
    </g>

    <!-- Password Recovery Section -->
    <g transform="translate(35, 510)">
      <line x1="0" y1="0" x2="410" y2="0" stroke="#E7E5E4" />
      <text x="0" y="25" font-size="12" font-weight="700" fill="#1C1917">Forgot password or accepted invitation?</text>
      <rect x="0" y="35" width="410" height="40" rx="8" fill="#FFFFFF" stroke="#D6D3D1" />
      <text x="15" y="59" font-size="12" fill="#78716C">Enter recovery email...</text>

      <rect x="0" y="85" width="410" height="38" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
      <text x="205" y="108" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">Send Password Reset Link</text>
    </g>

    <!-- Pilot Footnote -->
    <text x="240" y="685" font-size="10" fill="#A8A29E" text-anchor="middle">Tribe Saarthi Working Pilot · Build Mode: pilot · SIH 2026</text>
    <text x="240" y="705" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">PostgreSQL RLS · Scoped Auth · Immutable Storage</text>
  </g>
</svg>
`;
}

// Write all files
const svgs = [
  { name: '01-student-home.svg', content: makeStudentHome() },
  { name: '02-student-mobile.svg', content: makeStudentMobile() },
  { name: '03-scholarships.svg', content: makeScholarships() },
  { name: '04-applications-tracker.svg', content: makeApplicationsTracker() },
  { name: '05-officer-review-queue.svg', content: makeOfficerQueue() },
  { name: '06-document-wallet.svg', content: makeDocumentWallet() },
  { name: '07-help-grievances.svg', content: makeHelpGrievances() },
  { name: '08-pilot-signin.svg', content: makePilotSignIn() },
];

for (const s of svgs) {
  const filePath = path.join(outDir, s.name);
  fs.writeFileSync(filePath, s.content.trim(), 'utf8');
  console.log(`Generated: ${filePath}`);
}
console.log(`All ${svgs.length} SVG mockups generated successfully in docs/ui-mockups/`);
