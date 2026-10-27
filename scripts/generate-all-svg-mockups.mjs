import fs from 'node:fs';
import path from 'node:path';

const baseOutDir = path.resolve('docs/ui-mockups');
const scholarDir = path.join(baseOutDir, '01-scholar-portal');
const officerDir = path.join(baseOutDir, '02-officer-portal');
const systemDir = path.join(baseOutDir, '03-system-auth');

[scholarDir, officerDir, systemDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

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
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.05" />
    </filter>
    <filter id="modalShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.25" />
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

function renderTopAccent(width = 1440) {
  return `<rect x="0" y="0" width="${width}" height="4" fill="url(#motifGrad)" />`;
}

function renderSidebar(activeKey = 'home', role = 'student') {
  const items = role === 'student' ? [
    { key: 'home', label: 'Dashboard', icon: '⊞' },
    { key: 'scholarships', label: 'Scholarships', icon: '◎' },
    { key: 'applications', label: 'My Applications', icon: '✓' },
    { key: 'documents', label: 'Documents', icon: '📁' },
    { key: 'profile', label: 'Profile & PVTG', icon: '👤' },
    { key: 'family', label: 'Family Consent', icon: '👪' },
    { key: 'offline', label: 'Offline Queue', icon: '⚡' },
    { key: 'help', label: 'Help & Saarthi', icon: '?' },
  ] : [
    { key: 'queue', label: 'Review Queue', icon: '✓' },
    { key: 'detail', label: 'Case Inspection', icon: '🔍' },
    { key: 'coverage', label: 'Coverage Analytics', icon: '📊' },
    { key: 'switchboard', label: 'Sabotage Tester', icon: '⚡' },
    { key: 'audit', label: 'Forensic Audit Log', icon: '🛡' },
    { key: 'help', label: 'Help Requests', icon: '?' },
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
  <text x="30" y="98" font-size="10" font-weight="700" fill="#A8A29E" letter-spacing="1">
    ${role === 'student' ? 'SCHOLAR PORTAL' : 'OFFICER DESK'}
  </text>
  `;

  let y = 110;
  for (const it of items) {
    const isActive = it.key === activeKey;
    if (isActive) {
      svg += `
      <rect x="18" y="${y}" width="214" height="38" rx="10" fill="url(#brandGrad)" />
      <text x="35" y="${y + 23}" font-size="13" fill="#FDE68A">${it.icon}</text>
      <text x="60" y="${y + 24}" font-size="12" font-weight="700" fill="#FFFFFF">${it.label}</text>
      <circle cx="218" cy="${y + 19}" r="3" fill="#FDE68A" />
      `;
    } else {
      svg += `
      <rect x="18" y="${y}" width="214" height="38" rx="10" fill="transparent" />
      <text x="35" y="${y + 23}" font-size="13" fill="#78716C">${it.icon}</text>
      <text x="60" y="${y + 24}" font-size="12" font-weight="600" fill="#44403C">${it.label}</text>
      `;
    }
    y += 44;
  }

  const userName = role === 'student' ? 'Asha Kiran Ekka' : 'Sh. A.K. Verma';
  const userSub = role === 'student' ? 'ST Scholar · BIT Mesra' : 'District Welfare Nodal';
  svg += `
  <line x1="20" y1="870" x2="230" y2="870" stroke="#E7E5E4" stroke-width="1" />
  <rect x="20" y="885" width="210" height="60" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
  <text x="32" y="908" font-size="12" font-weight="700" fill="#1C1917">${userName}</text>
  <text x="32" y="923" font-size="10" font-weight="600" fill="#78716C">${userSub}</text>
  <rect x="165" y="897" width="54" height="18" rx="6" fill="#DBEAFE" />
  <text x="192" y="910" font-size="9" font-weight="800" fill="#1E40AF" text-anchor="middle">${role.toUpperCase()}</text>
  <text x="32" y="938" font-size="10" font-weight="700" fill="#E11D48">Sign out</text>
  `;

  return svg;
}

function renderHeader(portalLabel = 'Scholar Portal') {
  return `
  <!-- Top App Bar -->
  <rect x="250" y="4" width="1190" height="56" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
  <text x="275" y="37" font-size="12" font-weight="700" fill="#1C1917">भारत सरकार (Govt of India)</text>
  <text x="430" y="37" font-size="12" fill="#A8A29E">·</text>
  <text x="445" y="37" font-size="12" font-weight="600" fill="#57534E">Ministry of Tribal Affairs</text>
  <text x="590" y="37" font-size="12" fill="#A8A29E">·</text>
  <rect x="605" y="22" width="70" height="20" rx="4" fill="#F5F5F4" />
  <text x="640" y="36" font-size="10" font-family="monospace" font-weight="600" fill="#57534E" text-anchor="middle">PS 26238</text>

  <!-- Controls on Right -->
  <text x="960" y="37" font-size="11" font-weight="500" fill="#78716C">Production Pilot · Verified</text>
  
  <rect x="1110" y="16" width="130" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="1120" y="36" font-size="11" font-weight="700" fill="#1C1917">Asha · Student ▾</text>

  <rect x="1250" y="16" width="80" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="1262" y="36" font-size="11" font-weight="600" fill="#1C1917">English ▾</text>

  <rect x="1340" y="16" width="80" height="30" rx="8" fill="url(#brandGrad)" />
  <text x="1380" y="36" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">▶ Guide</text>
  `;
}

// =============================================================
// SCHOLAR PORTAL SCREENS (12 Screens)
// =============================================================

// 01: Student Home Desktop
function makeStudentHome() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('home', 'student')}
  ${renderHeader()}

  <!-- Main Content Area -->
  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Scholar Overview</text>
    <text x="0" y="44" class="subtitle">Next required actions, verified state, and scholarship lifecycle tracker</text>

    <!-- Urgent Next Action Card (Hero) -->
    <rect x="0" y="65" width="750" height="150" rx="16" fill="url(#brandGrad)" filter="url(#shadow)" />
    <rect x="25" y="88" width="130" height="22" rx="11" fill="#065F46" />
    <text x="90" y="103" class="badge" fill="#A7F3D0">PRIMARY ACTION</text>
    <text x="25" y="142" font-size="20" font-weight="800" fill="#FFFFFF">Disbursement Confirmation Available</text>
    <text x="25" y="164" font-size="13" font-weight="500" fill="#D1FAE5">Post-Matric Scholarship FY 2026-27 (₹32,000) sanctioned to your Bank of India account.</text>
    <rect x="25" y="180" width="170" height="32" rx="8" fill="#FDE68A" />
    <text x="110" y="201" font-size="12" font-weight="800" fill="#78350F" text-anchor="middle">View Direct Bank Receipt →</text>

    <!-- Side Metric Cards -->
    <rect x="770" y="65" width="350" height="150" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="795" y="98" font-size="12" font-weight="700" fill="#A8A29E">DIGILOCKER WALLET STATUS</text>
    <text x="795" y="128" font-size="22" font-weight="800" fill="#047857">3 Documents Verified</text>
    <text x="795" y="148" font-size="12" fill="#57534E">Caste Cert, Income Cert &amp; Marksheet sync active</text>
    <line x1="795" y1="165" x2="1095" y2="165" stroke="#F5F5F4" />
    <text x="795" y="188" font-size="12" font-weight="700" fill="#047857">DigiLocker Linked: 12-OCT-2026 ✓</text>

    <!-- Application Progress Bar -->
    <rect x="0" y="240" width="1120" height="120" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="30" y="275" font-size="15" font-weight="800" fill="#1C1917">Post-Matric ST Scholarship 2026-27 · Application #TS-84920</text>
    
    <!-- Stepper Line -->
    <line x1="80" y1="315" x2="1040" y2="315" stroke="#E5E7EB" stroke-width="4" />
    <line x1="80" y1="315" x2="720" y2="315" stroke="#10B981" stroke-width="4" />

    <!-- Step 1 -->
    <circle cx="80" cy="315" r="14" fill="#047857" />
    <text x="80" y="320" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="80" y="342" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">Submitted</text>

    <!-- Step 2 -->
    <circle cx="390" cy="315" r="14" fill="#047857" />
    <text x="390" y="320" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="390" y="342" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">Institute Verified</text>

    <!-- Step 3 -->
    <circle cx="720" cy="315" r="14" fill="#047857" />
    <text x="720" y="320" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="720" y="342" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">District Sanctioned</text>

    <!-- Step 4 -->
    <circle cx="1040" cy="315" r="14" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="2" />
    <text x="1040" y="320" font-size="11" font-weight="800" fill="#9CA3AF" text-anchor="middle">4</text>
    <text x="1040" y="342" font-size="11" font-weight="600" fill="#6B7280" text-anchor="middle">DBT Disbursed</text>

    <!-- Honest Notifications Section -->
    <text x="0" y="395" font-size="16" font-weight="800" fill="#1C1917">Official Announcements &amp; Updates</text>
    
    <!-- Notification 1 -->
    <rect x="0" y="415" width="750" height="70" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <circle cx="35" cy="450" r="12" fill="#D1FAE5" />
    <text x="35" y="454" font-size="12" fill="#047857" text-anchor="middle">i</text>
    <text x="60" y="443" font-size="13" font-weight="700" fill="#1C1917">Institute Verification Completed</text>
    <text x="60" y="463" font-size="12" fill="#57534E">BIT Mesra Nodal Officer approved enrollment and academic marksheet on 14 Oct 2026.</text>
    <text x="650" y="450" font-size="11" font-weight="600" fill="#78716C">Informational</text>

    <!-- Notification 2 -->
    <rect x="0" y="495" width="750" height="70" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <circle cx="35" cy="530" r="12" fill="#FEF3C7" />
    <text x="35" y="534" font-size="12" fill="#B45309" text-anchor="middle">!</text>
    <text x="60" y="523" font-size="13" font-weight="700" fill="#1C1917">Annual Income Certificate Due for Renewal Next Term</text>
    <text x="60" y="543" font-size="12" fill="#57534E">Certificate valid until March 2027. No immediate action required for this semester.</text>
    <text x="650" y="530" font-size="11" font-weight="600" fill="#78716C">Notice</text>

    <!-- APAAR Card Widget -->
    <rect x="770" y="415" width="350" height="150" rx="16" fill="url(#darkCardGrad)" filter="url(#shadow)" />
    <text x="800" y="445" font-size="11" font-weight="700" fill="#FDE68A" letter-spacing="1">AUTOMATED PERMANENT ACADEMIC REGISTRY</text>
    <text x="800" y="475" font-size="18" font-weight="800" fill="#FFFFFF">APAAR ID: 9482-1049-5821</text>
    <text x="800" y="498" font-size="12" fill="#A8A29E">Asha Kiran Ekka · Scheduled Tribe</text>
    <text x="800" y="520" font-size="11" fill="#10B981">✓ Aadhaar Verified &amp; DigiLocker Seeded</text>
  </g>
</svg>`;
}

// 02: Student Mobile 390x844
function makeStudentMobile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="390" height="844" fill="#FAF7F2" />
  ${renderTopAccent(390)}

  <!-- Mobile Header -->
  <rect x="0" y="4" width="390" height="52" fill="#FFFFFF" stroke="#E7E5E4" stroke-width="1" />
  <rect x="12" y="14" width="32" height="32" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <line x1="20" y1="23" x2="36" y2="23" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
  <line x1="20" y1="30" x2="36" y2="30" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
  <line x1="20" y1="37" x2="36" y2="37" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />

  <circle cx="65" cy="30" r="12" fill="#F5F5F4" stroke="#047857" stroke-width="1.5" />
  <text x="85" y="34" font-size="14" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
  
  <rect x="270" y="15" width="105" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
  <text x="280" y="34" font-size="11" font-weight="700" fill="#1C1917">Asha · ST ▾</text>

  <!-- Mobile Body Container -->
  <g transform="translate(16, 70)">
    <text x="0" y="20" font-size="18" font-weight="800" fill="#1C1917">Dashboard</text>
    <text x="0" y="36" font-size="12" font-weight="500" fill="#57534E">Scheduled Tribe Scholar Portal</text>

    <!-- Next Action Card -->
    <rect x="0" y="50" width="358" height="155" rx="14" fill="url(#brandGrad)" />
    <rect x="16" y="66" width="100" height="20" rx="10" fill="#065F46" />
    <text x="66" y="80" font-size="9" font-weight="800" fill="#A7F3D0" text-anchor="middle">NEXT ACTION</text>
    <text x="16" y="112" font-size="16" font-weight="800" fill="#FFFFFF">Disbursement Ready (₹32,000)</text>
    <text x="16" y="132" font-size="11" fill="#D1FAE5">Direct Benefit Transfer approved to your bank.</text>
    <rect x="16" y="150" width="150" height="32" rx="8" fill="#FDE68A" />
    <text x="91" y="170" font-size="11" font-weight="800" fill="#78350F" text-anchor="middle">View DBT Receipt →</text>

    <!-- Mobile Stepper Card -->
    <rect x="0" y="220" width="358" height="135" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="16" y="246" font-size="13" font-weight="800" fill="#1C1917">Post-Matric Scholarship</text>
    <text x="16" y="262" font-size="11" fill="#78716C">Application #TS-84920 · 3 of 4 stages complete</text>
    
    <line x1="30" y1="290" x2="328" y2="290" stroke="#E5E7EB" stroke-width="4" />
    <line x1="30" y1="290" x2="228" y2="290" stroke="#10B981" stroke-width="4" />

    <circle cx="30" cy="290" r="10" fill="#047857" />
    <circle cx="129" cy="290" r="10" fill="#047857" />
    <circle cx="228" cy="290" r="10" fill="#047857" />
    <circle cx="328" cy="290" r="10" fill="#F3F4F6" stroke="#9CA3AF" />

    <text x="30" y="315" font-size="9" font-weight="700" fill="#1C1917" text-anchor="middle">Draft</text>
    <text x="129" y="315" font-size="9" font-weight="700" fill="#1C1917" text-anchor="middle">Institute</text>
    <text x="228" y="315" font-size="9" font-weight="700" fill="#1C1917" text-anchor="middle">District</text>
    <text x="328" y="315" font-size="9" font-weight="600" fill="#9CA3AF" text-anchor="middle">Disbursed</text>

    <!-- Notification Card -->
    <text x="0" y="380" font-size="14" font-weight="800" fill="#1C1917">Updates</text>
    <rect x="0" y="395" width="358" height="65" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="16" y="420" font-size="12" font-weight="700" fill="#1C1917">Institute Verification Passed</text>
    <text x="16" y="438" font-size="11" fill="#78716C">Academic marks confirmed by BIT Mesra on 14 Oct.</text>

    <!-- Quick Tools -->
    <rect x="0" y="475" width="170" height="70" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="14" y="500" font-size="12" font-weight="700" fill="#1C1917">📁 DigiLocker</text>
    <text x="14" y="520" font-size="10" fill="#047857">3 Verified Documents</text>

    <rect x="188" y="475" width="170" height="70" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <text x="202" y="500" font-size="12" font-weight="700" fill="#1C1917">? Saarthi AI</text>
    <text x="202" y="520" font-size="10" fill="#57534E">Ask in Santhali/Hindi</text>
  </g>

  <!-- Bottom Nav Bar -->
  <rect x="0" y="776" width="390" height="68" fill="#FFFFFF" stroke="#E7E5E4" />
  <text x="48" y="805" font-size="16" fill="#047857" text-anchor="middle">⊞</text>
  <text x="48" y="822" font-size="9" font-weight="800" fill="#047857" text-anchor="middle">Home</text>

  <text x="126" y="805" font-size="16" fill="#78716C" text-anchor="middle">◎</text>
  <text x="126" y="822" font-size="9" font-weight="600" fill="#78716C" text-anchor="middle">Schemes</text>

  <text x="204" y="805" font-size="16" fill="#78716C" text-anchor="middle">✓</text>
  <text x="204" y="822" font-size="9" font-weight="600" fill="#78716C" text-anchor="middle">Track</text>

  <text x="282" y="805" font-size="16" fill="#78716C" text-anchor="middle">📁</text>
  <text x="282" y="822" font-size="9" font-weight="600" fill="#78716C" text-anchor="middle">Wallet</text>

  <text x="350" y="805" font-size="16" fill="#78716C" text-anchor="middle">👤</text>
  <text x="350" y="822" font-size="9" font-weight="600" fill="#78716C" text-anchor="middle">Profile</text>
</svg>`;
}

// 03: Scholarship Discovery
function makeScholarships() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('scholarships', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Scholarship Discovery</text>
    <text x="0" y="44" class="subtitle">Advisory scheme matching based on your declared category, education, and income evidence</text>

    <!-- Filter Toolbar -->
    <rect x="0" y="65" width="1120" height="50" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <rect x="15" y="75" width="70" height="30" rx="8" fill="url(#brandGrad)" />
    <text x="50" y="94" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">All (4)</text>

    <rect x="95" y="75" width="110" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="150" y="94" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Post-Matric (2)</text>

    <rect x="215" y="75" width="150" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="290" y="94" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">National Fellowship (1)</text>

    <rect x="375" y="75" width="130" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="440" y="94" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Top Class ST (1)</text>

    <!-- Card 1 -->
    <rect x="0" y="135" width="1120" height="150" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="25" y="155" width="80" height="22" rx="6" fill="#D1FAE5" />
    <text x="65" y="170" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">100% MATCH</text>
    <text x="120" y="171" font-size="16" font-weight="800" fill="#1C1917">Post-Matric Scholarship Scheme for ST Students</text>
    <text x="25" y="200" font-size="13" fill="#57534E">Annual maintenance allowance and fee reimbursement for higher secondary and undergraduate students.</text>
    <text x="25" y="228" font-size="12" font-weight="700" fill="#047857">Benefit: ₹32,000 / year · Deadline: 30 Nov 2026 · Ministry of Tribal Affairs</text>
    <rect x="940" y="190" width="150" height="40" rx="10" fill="url(#brandGrad)" />
    <text x="1015" y="215" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Apply Online →</text>

    <!-- Card 2 -->
    <rect x="0" y="305" width="1120" height="150" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="25" y="325" width="80" height="22" rx="6" fill="#D1FAE5" />
    <text x="65" y="340" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">ELIGIBLE</text>
    <text x="120" y="341" font-size="16" font-weight="800" fill="#1C1917">Top Class Education for Scheduled Tribe Students</text>
    <text x="25" y="370" font-size="13" fill="#57534E">Full tuition coverage, computer allowance, and books grant for premiere institutions (IIT, NIT, BIT).</text>
    <text x="25" y="398" font-size="12" font-weight="700" fill="#047857">Benefit: Up to ₹2,50,000 / year · Deadline: 15 Dec 2026</text>
    <rect x="940" y="360" width="150" height="40" rx="10" fill="url(#brandGrad)" />
    <text x="1015" y="385" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Apply Online →</text>

    <!-- Card 3 -->
    <rect x="0" y="475" width="1120" height="150" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="25" y="495" width="90" height="22" rx="6" fill="#FEF3C7" />
    <text x="70" y="510" font-size="10" font-weight="800" fill="#B45309" text-anchor="middle">CRITERIA CHECK</text>
    <text x="130" y="511" font-size="16" font-weight="800" fill="#1C1917">National Overseas Scholarship for ST Candidates</text>
    <text x="25" y="540" font-size="13" fill="#57534E">Financial assistance to selected ST candidates pursuing Masters or Ph.D abroad.</text>
    <text x="25" y="568" font-size="12" font-weight="700" fill="#78716C">Benefit: Full Tuition + Living Allowance · Requires Foreign University Offer Letter</text>
    <rect x="940" y="530" width="150" height="40" rx="10" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="1015" y="555" font-size="12" font-weight="700" fill="#44403C" text-anchor="middle">View Criteria</text>
  </g>
</svg>`;
}

// 04: Application Step 1 - Profile & Domicile
function makeAppStep1() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('applications', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Post-Matric Scholarship Application · FY 2026-27</text>
    <text x="0" y="44" class="subtitle">Step 1 of 3: Scholar Identity, Domicile &amp; Tribal Category Verification</text>

    <!-- Stepper Indicator -->
    <rect x="0" y="65" width="1120" height="70" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
    <circle cx="80" cy="100" r="14" fill="#047857" />
    <text x="80" y="105" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">1</text>
    <text x="110" y="105" font-size="13" font-weight="700" fill="#047857">Profile &amp; Category</text>

    <line x1="260" y1="100" x2="480" y2="100" stroke="#E5E7EB" stroke-width="2" />
    <circle cx="500" cy="100" r="14" fill="#F5F5F4" stroke="#9CA3AF" />
    <text x="500" y="105" font-size="11" font-weight="700" fill="#6B7280" text-anchor="middle">2</text>
    <text x="530" y="105" font-size="13" font-weight="600" fill="#6B7280">Evidence &amp; Documents</text>

    <line x1="720" y1="100" x2="940" y2="100" stroke="#E5E7EB" stroke-width="2" />
    <circle cx="960" cy="100" r="14" fill="#F5F5F4" stroke="#9CA3AF" />
    <text x="960" y="105" font-size="11" font-weight="700" fill="#6B7280" text-anchor="middle">3</text>
    <text x="990" y="105" font-size="13" font-weight="600" fill="#6B7280">Check Answers &amp; Submit</text>

    <!-- Form Container -->
    <rect x="0" y="155" width="1120" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Row 1: Name & DOB -->
    <text x="35" y="195" font-size="12" font-weight="700" fill="#1C1917">Full Legal Name (as per Aadhaar)</text>
    <rect x="35" y="205" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="232" font-size="13" font-weight="600" fill="#1C1917">Asha Kiran Ekka</text>

    <text x="575" y="195" font-size="12" font-weight="700" fill="#1C1917">Date of Birth</text>
    <rect x="575" y="205" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="590" y="232" font-size="13" font-weight="600" fill="#1C1917">15-08-2004</text>

    <!-- Row 2: Category & Tribe -->
    <text x="35" y="280" font-size="12" font-weight="700" fill="#1C1917">Social Category</text>
    <rect x="35" y="290" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="317" font-size="13" font-weight="600" fill="#1C1917">Scheduled Tribe (ST) · Verified via DigiLocker ✓</text>

    <text x="575" y="280" font-size="12" font-weight="700" fill="#1C1917">Recognized ST Tribe / Sub-tribe</text>
    <rect x="575" y="290" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="590" y="317" font-size="13" font-weight="600" fill="#1C1917">Santhal</text>

    <!-- Row 3: Income & PVTG -->
    <text x="35" y="365" font-size="12" font-weight="700" fill="#1C1917">Annual Family Income (₹)</text>
    <rect x="35" y="375" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="402" font-size="13" font-weight="600" fill="#1C1917">₹ 1,20,000 (Income Certificate JH/2026/8941)</text>

    <text x="575" y="365" font-size="12" font-weight="700" fill="#1C1917">PVTG (Particularly Vulnerable Tribal Group)</text>
    <rect x="575" y="375" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="590" y="402" font-size="13" font-weight="600" fill="#1C1917">[x] Member of recognized PVTG Community</text>

    <!-- Row 4: Domicile & Institute -->
    <text x="35" y="450" font-size="12" font-weight="700" fill="#1C1917">Permanent Domicile State / District</text>
    <rect x="35" y="460" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="487" font-size="13" font-weight="600" fill="#1C1917">Jharkhand · Ranchi District</text>

    <text x="575" y="450" font-size="12" font-weight="700" fill="#1C1917">Enrolled Institution &amp; Course</text>
    <rect x="575" y="460" width="510" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="590" y="487" font-size="13" font-weight="600" fill="#1C1917">Birla Institute of Technology (BIT Mesra) · B.Tech CS 2nd Yr</text>

    <!-- Bottom Action Bar -->
    <line x1="35" y1="535" x2="1085" y2="535" stroke="#E7E5E4" />
    <text x="35" y="575" font-size="12" fill="#78716C">Autosaved locally · Offline capable</text>
    
    <rect x="850" y="555" width="235" height="44" rx="10" fill="url(#brandGrad)" />
    <text x="967" y="582" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Save &amp; Continue to Documents →</text>
  </g>
</svg>`;
}

// 05: Application Step 2 - Documents
function makeAppStep2() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('applications', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Post-Matric Scholarship Application · FY 2026-27</text>
    <text x="0" y="44" class="subtitle">Step 2 of 3: Required Supporting Evidence &amp; DigiLocker Verification</text>

    <!-- Stepper Indicator -->
    <rect x="0" y="65" width="1120" height="70" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
    <circle cx="80" cy="100" r="14" fill="#047857" />
    <text x="80" y="105" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="110" y="105" font-size="13" font-weight="700" fill="#047857">Profile &amp; Category</text>

    <line x1="260" y1="100" x2="480" y2="100" stroke="#047857" stroke-width="2" />
    <circle cx="500" cy="100" r="14" fill="#047857" />
    <text x="500" y="105" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">2</text>
    <text x="530" y="105" font-size="13" font-weight="700" fill="#047857">Evidence &amp; Documents</text>

    <line x1="720" y1="100" x2="940" y2="100" stroke="#E5E7EB" stroke-width="2" />
    <circle cx="960" cy="100" r="14" fill="#F5F5F4" stroke="#9CA3AF" />
    <text x="960" y="105" font-size="11" font-weight="700" fill="#6B7280" text-anchor="middle">3</text>
    <text x="990" y="105" font-size="13" font-weight="600" fill="#6B7280">Check Answers &amp; Submit</text>

    <!-- Document Checklist Container -->
    <rect x="0" y="155" width="1120" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Doc 1: ST Certificate -->
    <rect x="35" y="185" width="1050" height="70" rx="10" fill="#F0FDF4" stroke="#BBF7D0" />
    <circle cx="65" cy="220" r="14" fill="#047857" />
    <text x="65" y="225" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="95" y="213" font-size="14" font-weight="700" fill="#1C1917">Scheduled Tribe (ST) Caste Certificate</text>
    <text x="95" y="233" font-size="12" fill="#047857">Auto-pulled from DigiLocker · Issuer: SDO Ranchi · Cert #JH/2024/ST/84920</text>
    <rect x="940" y="202" width="120" height="34" rx="8" fill="#DCFCE7" />
    <text x="1000" y="223" font-size="11" font-weight="800" fill="#166534" text-anchor="middle">VERIFIED SEAL</text>

    <!-- Doc 2: Income Certificate -->
    <rect x="35" y="270" width="1050" height="70" rx="10" fill="#F0FDF4" stroke="#BBF7D0" />
    <circle cx="65" cy="305" r="14" fill="#047857" />
    <text x="65" y="310" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="95" y="298" font-size="14" font-weight="700" fill="#1C1917">Income Certificate FY 2025-26</text>
    <text x="95" y="318" font-size="12" fill="#047857">Auto-pulled from DigiLocker · Income: ₹1,20,000 · Valid through 31 Mar 2027</text>
    <rect x="940" y="287" width="120" height="34" rx="8" fill="#DCFCE7" />
    <text x="1000" y="308" font-size="11" font-weight="800" fill="#166534" text-anchor="middle">VERIFIED SEAL</text>

    <!-- Doc 3: Previous Marksheet -->
    <rect x="35" y="355" width="1050" height="70" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <circle cx="65" cy="390" r="14" fill="#2563EB" />
    <text x="65" y="395" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">📄</text>
    <text x="95" y="383" font-size="14" font-weight="700" fill="#1C1917">Class 12th / Previous Semester Marksheet</text>
    <text x="95" y="403" font-size="12" fill="#64748B">marksheet_sem1_asha.pdf (1.8 MB) · SHA-256 e8f149... · Pending Institute Verification</text>
    <rect x="940" y="372" width="120" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" />
    <text x="1000" y="393" font-size="11" font-weight="700" fill="#1D4ED8" text-anchor="middle">REPLACE FILE</text>

    <!-- Doc 4: Fee Receipt -->
    <rect x="35" y="440" width="1050" height="70" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <circle cx="65" cy="475" r="14" fill="#2563EB" />
    <text x="65" y="480" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">📄</text>
    <text x="95" y="468" font-size="14" font-weight="700" fill="#1C1917">College Admission Proof &amp; Fee Receipt</text>
    <text x="95" y="488" font-size="12" fill="#64748B">bit_mesra_fee_receipt_2026.pdf (940 KB) · Validated</text>
    <rect x="940" y="457" width="120" height="34" rx="8" fill="#EFF6FF" stroke="#BFDBFE" />
    <text x="1000" y="478" font-size="11" font-weight="700" fill="#1D4ED8" text-anchor="middle">REPLACE FILE</text>

    <!-- Navigation Bar -->
    <line x1="35" y1="535" x2="1085" y2="535" stroke="#E7E5E4" />
    <rect x="35" y="555" width="130" height="44" rx="10" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="100" y="582" font-size="12" font-weight="700" fill="#44403C" text-anchor="middle">← Back to Step 1</text>
    
    <rect x="850" y="555" width="235" height="44" rx="10" fill="url(#brandGrad)" />
    <text x="967" y="582" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Save &amp; Check Answers →</text>
  </g>
</svg>`;
}

// 06: Application Step 3 - Check Answers (GOV.UK style)
function makeAppStep3() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('applications', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Check your answers before submitting</text>
    <text x="0" y="44" class="subtitle">Review your declared details and attached evidence. Changes can be made before final submission.</text>

    <!-- Stepper Indicator -->
    <rect x="0" y="65" width="1120" height="70" rx="14" fill="#FFFFFF" stroke="#E7E5E4" />
    <circle cx="80" cy="100" r="14" fill="#047857" />
    <text x="80" y="105" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="110" y="105" font-size="13" font-weight="700" fill="#047857">Profile &amp; Category</text>

    <line x1="260" y1="100" x2="480" y2="100" stroke="#047857" stroke-width="2" />
    <circle cx="500" cy="100" r="14" fill="#047857" />
    <text x="500" y="105" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="530" y="105" font-size="13" font-weight="700" fill="#047857">Evidence &amp; Documents</text>

    <line x1="720" y1="100" x2="940" y2="100" stroke="#047857" stroke-width="2" />
    <circle cx="960" cy="100" r="14" fill="#047857" />
    <text x="960" y="105" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">3</text>
    <text x="990" y="105" font-size="13" font-weight="700" fill="#047857">Check Answers &amp; Submit</text>

    <!-- Review Table -->
    <rect x="0" y="155" width="1120" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />

    <!-- Section 1 -->
    <text x="35" y="195" font-size="14" font-weight="800" fill="#1C1917">1. Personal &amp; Community Details</text>
    
    <text x="35" y="225" font-size="13" font-weight="600" fill="#57534E">Full Name</text>
    <text x="260" y="225" font-size="13" font-weight="700" fill="#1C1917">Asha Kiran Ekka</text>
    <text x="1020" y="225" font-size="12" font-weight="700" fill="#047857">Change</text>
    <line x1="35" y1="238" x2="1085" y2="238" stroke="#F5F5F4" />

    <text x="35" y="260" font-size="13" font-weight="600" fill="#57534E">Social Category &amp; Tribe</text>
    <text x="260" y="260" font-size="13" font-weight="700" fill="#1C1917">Scheduled Tribe (ST) · Santhal Tribe (PVTG Flagged)</text>
    <text x="1020" y="260" font-size="12" font-weight="700" fill="#047857">Change</text>
    <line x1="35" y1="273" x2="1085" y2="273" stroke="#F5F5F4" />

    <text x="35" y="295" font-size="13" font-weight="600" fill="#57534E">Permanent Domicile</text>
    <text x="260" y="295" font-size="13" font-weight="700" fill="#1C1917">Jharkhand, Ranchi</text>
    <text x="1020" y="295" font-size="12" font-weight="700" fill="#047857">Change</text>
    <line x1="35" y1="308" x2="1085" y2="308" stroke="#F5F5F4" />

    <!-- Section 2 -->
    <text x="35" y="340" font-size="14" font-weight="800" fill="#1C1917">2. Scheme &amp; Institution</text>

    <text x="35" y="370" font-size="13" font-weight="600" fill="#57534E">Target Scheme</text>
    <text x="260" y="370" font-size="13" font-weight="700" fill="#1C1917">Post-Matric Scholarship for ST Students (₹32,000 / year)</text>
    <text x="1020" y="370" font-size="12" font-weight="700" fill="#047857">Change</text>
    <line x1="35" y1="383" x2="1085" y2="383" stroke="#F5F5F4" />

    <text x="35" y="405" font-size="13" font-weight="600" fill="#57534E">Institution</text>
    <text x="260" y="405" font-size="13" font-weight="700" fill="#1C1917">Birla Institute of Technology (BIT Mesra) · UG B.Tech CS</text>
    <text x="1020" y="405" font-size="12" font-weight="700" fill="#047857">Change</text>
    <line x1="35" y1="418" x2="1085" y2="418" stroke="#F5F5F4" />

    <!-- Solemn Declaration Box -->
    <rect x="35" y="440" width="1050" height="90" rx="10" fill="#FFFBEB" stroke="#FDE68A" />
    <text x="55" y="468" font-size="12" font-weight="800" fill="#92400E">Solemn Tribal Declaration &amp; Consent</text>
    <text x="55" y="492" font-size="12" fill="#78350F">I declare under penalty of perjury that the ST community evidence, income certificates, and academic enrollment data</text>
    <text x="55" y="510" font-size="12" fill="#78350F">are genuine and valid. I consent to online direct Aadhaar seeding validation for DBT scholarship credit.</text>

    <!-- Navigation Bar -->
    <line x1="35" y1="545" x2="1085" y2="545" stroke="#E7E5E4" />
    <rect x="35" y="565" width="130" height="44" rx="10" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="100" y="592" font-size="12" font-weight="700" fill="#44403C" text-anchor="middle">← Back to Step 2</text>
    
    <rect x="800" y="565" width="285" height="44" rx="10" fill="url(#brandGrad)" />
    <text x="942" y="592" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Submit Final Application (Online) →</text>
  </g>
</svg>`;
}

// 07: Application Lifecycle Tracker
function makeAppTracker() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('applications', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Applications &amp; Lifecycle Tracker</text>
    <text x="0" y="44" class="subtitle">Complete audit trail of institutional reviews, state sanctions, and DBT disbursement</text>

    <!-- Main Application Card -->
    <rect x="0" y="65" width="1120" height="280" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="35" y="105" font-size="18" font-weight="800" fill="#1C1917">Post-Matric Scholarship Scheme for ST Students · 2026-27</text>
    <text x="35" y="128" font-size="13" fill="#57534E">Application Reference: TS-JH-2026-84920 · Academic Year 2026-27 · Sanction Amount: ₹32,000</text>
    <rect x="940" y="90" width="145" height="28" rx="8" fill="#D1FAE5" />
    <text x="1012" y="108" font-size="11" font-weight="800" fill="#065F46" text-anchor="middle">STAGE 3 SANCTIONED</text>

    <!-- Visual 4-Step Progression -->
    <line x1="80" y1="180" x2="1040" y2="180" stroke="#E5E7EB" stroke-width="4" />
    <line x1="80" y1="180" x2="720" y2="180" stroke="#10B981" stroke-width="4" />

    <!-- Step 1 -->
    <circle cx="80" cy="180" r="16" fill="#047857" />
    <text x="80" y="185" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="80" y="215" font-size="12" font-weight="800" fill="#1C1917" text-anchor="middle">1. Submission</text>
    <text x="80" y="232" font-size="11" fill="#047857" text-anchor="middle">02-OCT-2026</text>

    <!-- Step 2 -->
    <circle cx="400" cy="180" r="16" fill="#047857" />
    <text x="400" y="185" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="400" y="215" font-size="12" font-weight="800" fill="#1C1917" text-anchor="middle">2. Institute Audit</text>
    <text x="400" y="232" font-size="11" fill="#047857" text-anchor="middle">12-OCT-2026</text>

    <!-- Step 3 -->
    <circle cx="720" cy="180" r="16" fill="#047857" />
    <text x="720" y="185" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="720" y="215" font-size="12" font-weight="800" fill="#1C1917" text-anchor="middle">3. District Sanction</text>
    <text x="720" y="232" font-size="11" fill="#047857" text-anchor="middle">17-OCT-2026</text>

    <!-- Step 4 -->
    <circle cx="1040" cy="180" r="16" fill="#F3F4F6" stroke="#9CA3AF" stroke-width="2" />
    <text x="1040" y="185" font-size="12" font-weight="800" fill="#9CA3AF" text-anchor="middle">4</text>
    <text x="1040" y="215" font-size="12" font-weight="700" fill="#6B7280" text-anchor="middle">4. DBT Bank Credit</text>
    <text x="1040" y="232" font-size="11" fill="#9CA3AF" text-anchor="middle">Expected 24-OCT</text>

    <line x1="35" y1="270" x2="1085" y2="270" stroke="#F5F5F4" />
    <text x="35" y="305" font-size="12" font-weight="600" fill="#57534E">Bank Beneficiary: Bank of India · A/C Ending ••8491 · Aadhaar Seeded &amp; NPCI Active</text>
    <rect x="910" y="285" width="175" height="34" rx="8" fill="url(#brandGrad)" />
    <text x="997" y="306" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Download Receipt (PDF)</text>

    <!-- Detailed Audit Trail -->
    <text x="0" y="380" font-size="16" font-weight="800" fill="#1C1917">Immutable Decision Log</text>
    
    <rect x="0" y="400" width="1120" height="240" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <text x="35" y="435" font-size="13" font-weight="700" fill="#1C1917">17-OCT-2026 14:22</text>
    <text x="200" y="435" font-size="13" font-weight="700" fill="#047857">District Sanction Signed</text>
    <text x="420" y="435" font-size="13" fill="#57534E">Officer Sh. A.K. Verma verified caste schedule alignment and signed sanction order TS-SANC-8812.</text>
    <line x1="35" y1="455" x2="1085" y2="455" stroke="#F5F5F4" />

    <text x="35" y="485" font-size="13" font-weight="700" fill="#1C1917">12-OCT-2026 11:05</text>
    <text x="200" y="485" font-size="13" font-weight="700" fill="#047857">Institute Verification Approved</text>
    <text x="420" y="485" font-size="13" fill="#57534E">BIT Mesra Nodal Officer validated B.Tech CS admission, 85% attendance, and fee structure.</text>
    <line x1="35" y1="505" x2="1085" y2="505" stroke="#F5F5F4" />

    <text x="35" y="535" font-size="13" font-weight="700" fill="#1C1917">02-OCT-2026 09:14</text>
    <text x="200" y="535" font-size="13" font-weight="700" fill="#047857">Application Submitted Online</text>
    <text x="420" y="535" font-size="13" fill="#57534E">Scholar Asha Kiran Ekka submitted digital draft with 4 validated DigiLocker attachments.</text>
    <line x1="35" y1="555" x2="1085" y2="555" stroke="#F5F5F4" />

    <text x="35" y="585" font-size="13" font-weight="700" fill="#1C1917">01-OCT-2026 18:30</text>
    <text x="200" y="585" font-size="13" font-weight="700" fill="#78716C">Draft Created</text>
    <text x="420" y="585" font-size="13" fill="#57534E">Auto-populated from Student APAAR ID 9482-1049-5821.</text>
  </g>
</svg>`;
}

// 08: DigiLocker Document Wallet
function makeDocumentWallet() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('documents', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">DigiLocker Document Wallet</text>
    <text x="0" y="44" class="subtitle">Secure storage, automatic authority fetching, and verified digital seals for tribal welfare schemes</text>

    <!-- Top Connection Banner -->
    <rect x="0" y="65" width="1120" height="70" rx="14" fill="#F0FDF4" stroke="#BBF7D0" />
    <circle cx="35" cy="100" r="14" fill="#047857" />
    <text x="35" y="105" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✓</text>
    <text x="65" y="95" font-size="14" font-weight="800" fill="#065F46">DigiLocker Account Connected &amp; Synced</text>
    <text x="65" y="115" font-size="12" fill="#047857">Linked to Aadhaar •••• •••• 5821 · Automatic re-verification enabled with State Issuing Authorities</text>
    <rect x="940" y="82" width="150" height="36" rx="8" fill="#047857" />
    <text x="1015" y="104" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Sync Latest Docs ↻</text>

    <!-- Document Grid -->
    <!-- Card 1: Caste Cert -->
    <rect x="0" y="160" width="355" height="230" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="25" y="185" width="60" height="22" rx="6" fill="#D1FAE5" />
    <text x="55" y="200" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">VERIFIED</text>
    <text x="25" y="235" font-size="16" font-weight="800" fill="#1C1917">ST Caste Certificate</text>
    <text x="25" y="258" font-size="12" fill="#57534E">Issuer: Revenue Dept, Govt of Jharkhand</text>
    <text x="25" y="278" font-size="11" font-family="monospace" fill="#78716C">Cert: JH/2024/ST/84920</text>
    <line x1="25" y1="295" x2="330" y2="295" stroke="#F5F5F4" />
    <text x="25" y="325" font-size="12" font-weight="700" fill="#047857">SHA-256 Validated ✓</text>
    <rect x="230" y="340" width="100" height="32" rx="8" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="280" y="360" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View PDF</text>

    <!-- Card 2: Income Cert -->
    <rect x="380" y="160" width="355" height="230" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="405" y="185" width="60" height="22" rx="6" fill="#D1FAE5" />
    <text x="435" y="200" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">VERIFIED</text>
    <text x="405" y="235" font-size="16" font-weight="800" fill="#1C1917">Annual Income Certificate</text>
    <text x="405" y="258" font-size="12" fill="#57534E">Issuer: Tehsildar Office, Ranchi</text>
    <text x="405" y="278" font-size="11" font-family="monospace" fill="#78716C">Amount: ₹1,20,000 / year</text>
    <line x1="405" y1="295" x2="710" y2="295" stroke="#F5F5F4" />
    <text x="405" y="325" font-size="12" font-weight="700" fill="#047857">Valid through March 2027 ✓</text>
    <rect x="610" y="340" width="100" height="32" rx="8" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="660" y="360" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View PDF</text>

    <!-- Card 3: Marksheet -->
    <rect x="760" y="160" width="355" height="230" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="785" y="185" width="80" height="22" rx="6" fill="#EFF6FF" />
    <text x="825" y="200" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle">INSTITUTE OK</text>
    <text x="785" y="235" font-size="16" font-weight="800" fill="#1C1917">Academic Marksheet (12th)</text>
    <text x="785" y="258" font-size="12" fill="#57534E">CBSE Board Exam 2024</text>
    <text x="785" y="278" font-size="11" font-family="monospace" fill="#78716C">Roll: 26238104 · Marks: 88.4%</text>
    <line x1="785" y1="295" x2="1090" y2="295" stroke="#F5F5F4" />
    <text x="785" y="325" font-size="12" font-weight="700" fill="#2563EB">Verified by BIT Mesra</text>
    <rect x="990" y="340" width="100" height="32" rx="8" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="1040" y="360" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">View PDF</text>

    <!-- Upload New Document Area -->
    <rect x="0" y="420" width="1120" height="150" rx="16" fill="#FFFFFF" stroke="#D6D3D1" stroke-dasharray="6 6" />
    <text x="560" y="475" font-size="16" font-weight="800" fill="#1C1917" text-anchor="middle">Upload Additional Supporting Documents</text>
    <text x="560" y="500" font-size="13" fill="#78716C" text-anchor="middle">Drag and drop PDF, JPEG, or PNG files (up to 10 MB each), or browse device storage</text>
    <rect x="480" y="515" width="160" height="36" rx="8" fill="url(#brandGrad)" />
    <text x="560" y="537" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Browse Device</text>
  </g>
</svg>`;
}

// 09: Help & Saarthi Assistant
function makeHelpAssistant() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('help', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Help, Inquiries &amp; Saarthi Assistant</text>
    <text x="0" y="44" class="subtitle">Multilingual conversational assistance (Hindi, English, Santhali) and grievance redressal tracking</text>

    <!-- Saarthi AI Chat Window -->
    <rect x="0" y="65" width="680" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Chat Header -->
    <rect x="0" y="65" width="680" height="55" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
    <circle cx="35" cy="92" r="14" fill="#047857" />
    <text x="35" y="97" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">TS</text>
    <text x="60" y="90" font-size="14" font-weight="800" fill="#1C1917">Saarthi Assistant (सारथी)</text>
    <text x="60" y="107" font-size="11" fill="#047857">Online · Tribal Welfare AI Helper</text>
    <rect x="560" y="78" width="100" height="28" rx="8" fill="#F1F5F9" />
    <text x="610" y="96" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">हिन्दी / Santhali</text>

    <!-- Chat Bubble 1 (User) -->
    <rect x="360" y="140" width="290" height="50" rx="12" fill="#047857" />
    <text x="375" y="162" font-size="12" fill="#FFFFFF">मेरा छात्रवृत्ति पैसा बैंक खाते में कब तक आएगा?</text>
    <text x="375" y="178" font-size="10" fill="#A7F3D0">10:14 AM</text>

    <!-- Chat Bubble 2 (Assistant) -->
    <rect x="25" y="205" width="460" height="110" rx="12" fill="#F1F5F9" stroke="#E2E8F0" />
    <text x="40" y="230" font-size="13" font-weight="700" fill="#1C1917">नमस्ते आशा जी!</text>
    <text x="40" y="252" font-size="12" fill="#334155">आपका पोस्ट-मैट्रिक आवेदन (#TS-84920) जिला कल्याण अधिकारी द्वारा स्वीकृत हो चुका है।</text>
    <text x="40" y="272" font-size="12" fill="#334155">₹32,000 की राशि PFMS के माध्यम से 24 अक्टूबर तक आपके Bank of India खाते में भेज दी जाएगी।</text>
    <text x="40" y="295" font-size="10" fill="#64748B">10:15 AM · Verified with Server Records</text>

    <!-- Input Bar -->
    <rect x="20" y="525" width="530" height="42" rx="10" fill="#F8FAFC" stroke="#CBD5E1" />
    <text x="35" y="551" font-size="13" fill="#94A3B8">Ask a question about your scholarship in English, हिन्दी, or संथाली...</text>
    <rect x="565" y="525" width="95" height="42" rx="10" fill="url(#brandGrad)" />
    <text x="612" y="551" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Send ➤</text>

    <!-- Right Side: Grievances & Helpline -->
    <g transform="translate(710, 65)">
      <!-- Grievance Redressal Card -->
      <rect x="0" y="0" width="410" height="280" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <text x="25" y="35" font-size="15" font-weight="800" fill="#1C1917">Active Grievance Tickets</text>
      <text x="25" y="55" font-size="12" fill="#57534E">Official escalation to District Nodal Officer</text>

      <rect x="25" y="75" width="360" height="90" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
      <text x="40" y="100" font-size="13" font-weight="700" fill="#1C1917">Ticket #GR-2026-092 · Resolved</text>
      <text x="40" y="120" font-size="11" fill="#57534E">Category: Aadhaar Name Mismatch in Domicile</text>
      <text x="40" y="140" font-size="11" font-weight="700" fill="#047857">Resolution: Corrected via DigiLocker API on 10 Oct</text>

      <rect x="25" y="180" width="360" height="40" rx="8" fill="url(#brandGrad)" />
      <text x="205" y="205" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">+ Lodge New Grievance</text>

      <!-- Emergency Helpline -->
      <rect x="0" y="305" width="410" height="215" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      <text x="25" y="340" font-size="15" font-weight="800" fill="#1C1917">Direct Ministry Helplines</text>
      
      <text x="25" y="375" font-size="13" font-weight="700" fill="#1C1917">Toll-Free Tribal Scholar Line</text>
      <text x="25" y="395" font-size="16" font-weight="800" fill="#047857">1800-11-2026</text>
      <text x="25" y="415" font-size="11" fill="#78716C">Mon–Sat 09:30 AM to 06:00 PM</text>

      <line x1="25" y1="435" x2="385" y2="435" stroke="#F5F5F4" />
      <text x="25" y="460" font-size="13" font-weight="700" fill="#1C1917">Jharkhand Tribal Welfare Desk</text>
      <text x="25" y="480" font-size="12" fill="#57534E">Email: helpdesk-tribal@jharkhand.gov.in</text>
    </g>
  </g>
</svg>`;
}

// 10: Student Profile & PVTG
function makeStudentProfile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('profile', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Scholar Profile &amp; Tribal Registry</text>
    <text x="0" y="44" class="subtitle">Authoritative identity data, PVTG special declaration, and direct bank seeding validation</text>

    <!-- Top Identity Card -->
    <rect x="0" y="65" width="1120" height="150" rx="16" fill="url(#brandGrad)" filter="url(#shadow)" />
    <circle cx="65" cy="140" r="35" fill="#FFFFFF" />
    <text x="65" y="148" font-size="24" font-weight="800" fill="#047857" text-anchor="middle">AE</text>
    <text x="120" y="125" font-size="22" font-weight="800" fill="#FFFFFF">Asha Kiran Ekka</text>
    <text x="120" y="148" font-size="13" fill="#D1FAE5">Scheduled Tribe (ST) · Santhal Tribe · PVTG Beneficiary</text>
    <text x="120" y="170" font-size="12" font-weight="600" fill="#FDE68A">APAAR ID: 9482-1049-5821 · Student UUID: 582104-JH</text>

    <!-- Details Section -->
    <rect x="0" y="240" width="1120" height="430" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Group 1: Identity & Aadhaar -->
    <text x="35" y="280" font-size="14" font-weight="800" fill="#1C1917">Aadhaar &amp; Identity Seeding</text>
    
    <rect x="35" y="295" width="510" height="60" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="50" y="320" font-size="12" font-weight="700" fill="#475569">Aadhaar Masked Number</text>
    <text x="50" y="340" font-size="14" font-weight="800" fill="#0F172A">•••• •••• 5821 (Verified UIDAI ✓)</text>

    <rect x="575" y="295" width="510" height="60" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="590" y="320" font-size="12" font-weight="700" fill="#475569">Bank DBT Account Link</text>
    <text x="590" y="340" font-size="14" font-weight="800" fill="#047857">Bank of India · A/C ••8491 (Aadhaar Seeded ✓)</text>

    <!-- Group 2: Tribal Category -->
    <text x="35" y="390" font-size="14" font-weight="800" fill="#1C1917">Tribal Community &amp; PVTG Status</text>

    <rect x="35" y="405" width="510" height="60" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="50" y="430" font-size="12" font-weight="700" fill="#475569">Designated Tribe</text>
    <text x="50" y="450" font-size="14" font-weight="800" fill="#0F172A">Santhal (Scheduled Tribe, Jharkhand)</text>

    <rect x="575" y="405" width="510" height="60" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
    <text x="590" y="430" font-size="12" font-weight="700" fill="#92400E">PVTG Priority Benefit</text>
    <text x="590" y="450" font-size="14" font-weight="800" fill="#78350F">Enrolled in Particularly Vulnerable Tribal Group Scheme</text>

    <!-- Group 3: Institution -->
    <text x="35" y="500" font-size="14" font-weight="800" fill="#1C1917">Current Higher Education</text>

    <rect x="35" y="515" width="510" height="60" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="50" y="540" font-size="12" font-weight="700" fill="#475569">Institution</text>
    <text x="50" y="560" font-size="14" font-weight="800" fill="#0F172A">Birla Institute of Technology (BIT Mesra, Ranchi)</text>

    <rect x="575" y="515" width="510" height="60" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="590" y="540" font-size="12" font-weight="700" fill="#475569">Course &amp; Roll Number</text>
    <text x="590" y="560" font-size="14" font-weight="800" fill="#0F172A">B.Tech Computer Science · Year 2 · Roll #26238104</text>

    <!-- Save Button -->
    <rect x="895" y="605" width="190" height="42" rx="10" fill="url(#brandGrad)" />
    <text x="990" y="631" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Update Profile Data</text>
  </g>
</svg>`;
}

// 11: Family Access Consent
function makeFamilyConsent() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('family', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Family &amp; Guardian Access Consent</text>
    <text x="0" y="44" class="subtitle">Grant invited family members read-only online access to view your scholarship progress and disbursement status</text>

    <!-- Information Banner -->
    <rect x="0" y="65" width="1120" height="80" rx="14" fill="#EFF6FF" stroke="#BFDBFE" />
    <text x="30" y="98" font-size="14" font-weight="800" fill="#1E40AF">Privacy &amp; Data Control Guarantee</text>
    <text x="30" y="122" font-size="12" fill="#1E3A8A">Family access is strictly read-only and requires your voluntary permission. Family members cannot edit forms, upload files, or alter your bank account.</text>

    <!-- Invite Form Card -->
    <rect x="0" y="165" width="1120" height="150" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="35" y="200" font-size="15" font-weight="800" fill="#1C1917">Invite a Family Member / Guardian</text>
    
    <text x="35" y="235" font-size="12" font-weight="700" fill="#57534E">Guardian Email Address</text>
    <rect x="35" y="248" width="480" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="274" font-size="13" fill="#1C1917">mother.ekka@gmail.com</text>

    <text x="540" y="235" font-size="12" font-weight="700" fill="#57534E">Relationship</text>
    <rect x="540" y="248" width="300" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="555" y="274" font-size="13" fill="#1C1917">Parent / Mother ▾</text>

    <rect x="865" y="248" width="220" height="42" rx="8" fill="url(#brandGrad)" />
    <text x="975" y="274" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Grant Read-Only Access</text>

    <!-- Active Grants Table -->
    <text x="0" y="350" font-size="16" font-weight="800" fill="#1C1917">Currently Active Family Grants</text>

    <rect x="0" y="370" width="1120" height="200" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <text x="35" y="410" font-size="12" font-weight="700" fill="#A8A29E">GUARDIAN EMAIL</text>
    <text x="320" y="410" font-size="12" font-weight="700" fill="#A8A29E">RELATION</text>
    <text x="520" y="410" font-size="12" font-weight="700" fill="#A8A29E">GRANTED ON</text>
    <text x="720" y="410" font-size="12" font-weight="700" fill="#A8A29E">STATUS</text>
    <text x="980" y="410" font-size="12" font-weight="700" fill="#A8A29E">ACTION</text>
    <line x1="35" y1="425" x2="1085" y2="425" stroke="#E7E5E4" />

    <!-- Row 1 -->
    <text x="35" y="460" font-size="13" font-weight="700" fill="#1C1917">mother.ekka@gmail.com</text>
    <text x="320" y="460" font-size="13" fill="#57534E">Mother</text>
    <text x="520" y="460" font-size="13" fill="#57534E">12-AUG-2026</text>
    <rect x="720" y="445" width="60" height="20" rx="4" fill="#D1FAE5" />
    <text x="750" y="459" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">ACTIVE</text>
    <rect x="960" y="442" width="120" height="28" rx="6" fill="#FEE2E2" />
    <text x="1020" y="460" font-size="11" font-weight="800" fill="#B91C1C" text-anchor="middle">Revoke Access</text>
  </g>
</svg>`;
}

// 12: Offline Sync Queue
function makeOfflineQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('offline', 'student')}
  ${renderHeader()}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Durable Offline Queue &amp; Conflict Manager</text>
    <text x="0" y="44" class="subtitle">Tribal area resilient synchronization: Draft applications, document uploads, and notes stored in IndexedDB</text>

    <!-- Network Banner -->
    <rect x="0" y="65" width="1120" height="70" rx="14" fill="#F0FDF4" stroke="#BBF7D0" />
    <circle cx="35" cy="100" r="14" fill="#047857" />
    <text x="35" y="105" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">⚡</text>
    <text x="65" y="95" font-size="14" font-weight="800" fill="#065F46">Network Status: Online · All 3 Local Operations Synchronized</text>
    <text x="65" y="115" font-size="12" fill="#047857">IndexedDB cache active · Zero data loss guaranteed during cellular/tower disconnects</text>
    <rect x="940" y="82" width="150" height="36" rx="8" fill="url(#brandGrad)" />
    <text x="1015" y="104" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Force Sync Now ↻</text>

    <!-- Queue Operations Table -->
    <rect x="0" y="155" width="1120" height="420" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <text x="35" y="195" font-size="15" font-weight="800" fill="#1C1917">Local Operations History</text>
    
    <text x="35" y="230" font-size="12" font-weight="700" fill="#A8A29E">TIMESTAMP</text>
    <text x="240" y="230" font-size="12" font-weight="700" fill="#A8A29E">OPERATION</text>
    <text x="500" y="230" font-size="12" font-weight="700" fill="#A8A29E">PAYLOAD</text>
    <text x="800" y="230" font-size="12" font-weight="700" fill="#A8A29E">STATUS</text>
    <text x="980" y="230" font-size="12" font-weight="700" fill="#A8A29E">SERVER ACK</text>
    <line x1="35" y1="245" x2="1085" y2="245" stroke="#E7E5E4" />

    <!-- Row 1 -->
    <text x="35" y="280" font-size="13" font-weight="600" fill="#1C1917">Today 18:22:10</text>
    <text x="240" y="280" font-size="13" font-weight="700" fill="#047857">save_draft</text>
    <text x="500" y="280" font-size="13" fill="#57534E">Application #TS-84920 (Profile edit)</text>
    <rect x="800" y="265" width="70" height="22" rx="4" fill="#D1FAE5" />
    <text x="835" y="280" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">SYNCED</text>
    <text x="980" y="280" font-size="12" font-family="monospace" fill="#047857">ACK-29402 ✓</text>
    <line x1="35" y1="300" x2="1085" y2="300" stroke="#F5F5F4" />

    <!-- Row 2 -->
    <text x="35" y="335" font-size="13" font-weight="600" fill="#1C1917">Today 16:04:15</text>
    <text x="240" y="335" font-size="13" font-weight="700" fill="#047857">upload_document</text>
    <text x="500" y="335" font-size="13" fill="#57534E">fee_receipt_bit_mesra.pdf (940 KB)</text>
    <rect x="800" y="320" width="70" height="22" rx="4" fill="#D1FAE5" />
    <text x="835" y="335" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">SYNCED</text>
    <text x="980" y="335" font-size="12" font-family="monospace" fill="#047857">ACK-29388 ✓</text>
    <line x1="35" y1="355" x2="1085" y2="355" stroke="#F5F5F4" />

    <!-- Row 3 -->
    <text x="35" y="390" font-size="13" font-weight="600" fill="#1C1917">Yesterday 20:10</text>
    <text x="240" y="390" font-size="13" font-weight="700" fill="#047857">lodge_grievance</text>
    <text x="500" y="390" font-size="13" fill="#57534E">Aadhaar name spelling inquiry</text>
    <rect x="800" y="375" width="70" height="22" rx="4" fill="#D1FAE5" />
    <text x="835" y="390" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">SYNCED</text>
    <text x="980" y="390" font-size="12" font-family="monospace" fill="#047857">ACK-29310 ✓</text>
  </g>
</svg>`;
}

// =============================================================
// OFFICER PORTAL SCREENS (7 Screens)
// =============================================================

// 13: Officer Review Queue
function makeOfficerQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('queue', 'officer')}
  ${renderHeader('Officer Desk')}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Officer Review Queue</text>
    <text x="0" y="44" class="subtitle">Verification workbench for District Welfare Officers and Institutional Nodal Officers</text>

    <!-- 3-Queue Tabs -->
    <rect x="0" y="65" width="1120" height="50" rx="12" fill="#FFFFFF" stroke="#E7E5E4" />
    <rect x="15" y="75" width="130" height="30" rx="8" fill="url(#brandGrad)" />
    <text x="80" y="94" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Pending Review (14)</text>

    <rect x="155" y="75" width="130" height="30" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="220" y="94" font-size="11" font-weight="600" fill="#44403C" text-anchor="middle">Verified (128)</text>

    <rect x="295" y="75" width="130" height="30" rx="8" fill="#FEE2E2" stroke="#FECACA" />
    <text x="360" y="94" font-size="11" font-weight="700" fill="#B91C1C" text-anchor="middle">Flagged / Deficient (3)</text>

    <!-- Table Container -->
    <rect x="0" y="130" width="1120" height="420" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />

    <!-- Table Header -->
    <text x="35" y="165" font-size="11" font-weight="700" fill="#A8A29E">APPLICANT &amp; TRIBE</text>
    <text x="270" y="165" font-size="11" font-weight="700" fill="#A8A29E">SCHEME &amp; AMOUNT</text>
    <text x="540" y="165" font-size="11" font-weight="700" fill="#A8A29E">INSTITUTE</text>
    <text x="740" y="165" font-size="11" font-weight="700" fill="#A8A29E">DOCUMENT STATUS</text>
    <text x="960" y="165" font-size="11" font-weight="700" fill="#A8A29E">ACTIONS</text>
    <line x1="35" y1="180" x2="1085" y2="180" stroke="#E7E5E4" />

    <!-- Row 1 -->
    <text x="35" y="215" font-size="13" font-weight="800" fill="#1C1917">Asha Kiran Ekka</text>
    <text x="35" y="233" font-size="11" fill="#047857">Santhal Tribe · PVTG Member</text>
    <text x="270" y="215" font-size="13" font-weight="700" fill="#1C1917">Post-Matric ST</text>
    <text x="270" y="233" font-size="11" fill="#78716C">₹32,000 / year</text>
    <text x="540" y="215" font-size="13" font-weight="600" fill="#1C1917">BIT Mesra</text>
    <text x="540" y="233" font-size="11" fill="#78716C">B.Tech CS 2nd Yr</text>
    <rect x="740" y="208" width="100" height="22" rx="4" fill="#D1FAE5" />
    <text x="790" y="223" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">3/3 VERIFIED</text>
    <rect x="940" y="205" width="70" height="30" rx="6" fill="url(#brandGrad)" />
    <text x="975" y="224" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Approve</text>
    <rect x="1020" y="205" width="65" height="30" rx="6" fill="#FEE2E2" />
    <text x="1052" y="224" font-size="11" font-weight="700" fill="#B91C1C" text-anchor="middle">Inspect</text>
    <line x1="35" y1="250" x2="1085" y2="250" stroke="#F5F5F4" />

    <!-- Row 2 -->
    <text x="35" y="285" font-size="13" font-weight="800" fill="#1C1917">Birsa Munda</text>
    <text x="35" y="303" font-size="11" fill="#57534E">Munda Tribe · Khunti</text>
    <text x="270" y="285" font-size="13" font-weight="700" fill="#1C1917">Top Class ST</text>
    <text x="270" y="303" font-size="11" fill="#78716C">₹1,80,000 / year</text>
    <text x="540" y="285" font-size="13" font-weight="600" fill="#1C1917">IIT Kharagpur</text>
    <text x="540" y="303" font-size="11" fill="#78716C">B.Tech Mining</text>
    <rect x="740" y="278" width="110" height="22" rx="4" fill="#FEF3C7" />
    <text x="795" y="293" font-size="10" font-weight="800" fill="#92400E" text-anchor="middle">INCOME AUDIT</text>
    <rect x="940" y="275" width="70" height="30" rx="6" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="975" y="294" font-size="11" font-weight="700" fill="#44403C" text-anchor="middle">Review</text>
    <rect x="1020" y="275" width="65" height="30" rx="6" fill="#FEE2E2" />
    <text x="1052" y="294" font-size="11" font-weight="700" fill="#B91C1C" text-anchor="middle">Inspect</text>
  </g>
</svg>`;
}

// 14: Officer Case Detail Inspection
function makeCaseInspection() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('detail', 'officer')}
  ${renderHeader('Officer Desk')}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Case Detail Inspection &amp; Document Review</text>
    <text x="0" y="44" class="subtitle">Applicant: Asha Kiran Ekka · Application #TS-84920 · Scheduled Tribe Verification</text>

    <!-- Split Screen: Left PDF Preview (width 540) -->
    <rect x="0" y="65" width="540" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <rect x="0" y="65" width="540" height="45" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="25" y="93" font-size="13" font-weight="800" fill="#1C1917">Document Viewer: ST_Certificate_Asha_Ekka.pdf</text>
    <text x="440" y="93" font-size="11" font-weight="700" fill="#2563EB">Page 1 of 1</text>

    <!-- Simulated Document Content -->
    <rect x="40" y="130" width="460" height="420" rx="8" fill="#FBF9F5" stroke="#CBD5E1" />
    <!-- Emblem -->
    <circle cx="270" cy="175" r="20" fill="#FFFFFF" stroke="#047857" stroke-width="2" />
    <text x="270" y="180" font-size="12" font-weight="900" fill="#047857" text-anchor="middle">GOI</text>
    <text x="270" y="210" font-size="12" font-weight="800" fill="#1C1917" text-anchor="middle">GOVERNMENT OF JHARKHAND · REVENUE DEPT</text>
    <text x="270" y="226" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">SCHEDULED TRIBE CERTIFICATE</text>

    <text x="65" y="270" font-size="11" fill="#334155">This is to certify that Kum. Asha Kiran Ekka, daughter of Sh. B. Ekka</text>
    <text x="65" y="290" font-size="11" fill="#334155">resident of Village Hatia, District Ranchi, belongs to the Santhal Tribe</text>
    <text x="65" y="310" font-size="11" fill="#334155">which is recognized as a Scheduled Tribe under Constitution Order 1950.</text>
    <text x="65" y="340" font-size="11" font-family="monospace" fill="#047857">Certificate No: JH/2024/ST/84920 · Date: 14-04-2024</text>
    
    <!-- Stamp -->
    <circle cx="430" cy="460" r="30" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="4 2" />
    <text x="430" y="463" font-size="8" font-weight="800" fill="#2563EB" text-anchor="middle">SEAL OF SDO</text>
    <text x="430" y="473" font-size="8" font-weight="800" fill="#2563EB" text-anchor="middle">RANCHI</text>

    <!-- Split Screen: Right OCR & Review Decisions (width 550) -->
    <g transform="translate(570, 65)">
      <rect x="0" y="0" width="550" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
      
      <text x="30" y="35" font-size="15" font-weight="800" fill="#1C1917">Automated Verification Digest</text>
      
      <!-- Comparison Table -->
      <rect x="25" y="55" width="500" height="240" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
      
      <text x="40" y="85" font-size="11" font-weight="700" fill="#64748B">FIELD</text>
      <text x="180" y="85" font-size="11" font-weight="700" fill="#64748B">DECLARED VALUE</text>
      <text x="360" y="85" font-size="11" font-weight="700" fill="#64748B">DIGILOCKER / OCR</text>
      <line x1="40" y1="95" x2="510" y2="95" stroke="#E2E8F0" />

      <text x="40" y="125" font-size="12" font-weight="700" fill="#1E293B">Candidate Name</text>
      <text x="180" y="125" font-size="12" fill="#1E293B">Asha Kiran Ekka</text>
      <text x="360" y="125" font-size="12" font-weight="700" fill="#047857">Asha Kiran Ekka ✓</text>

      <text x="40" y="165" font-size="12" font-weight="700" fill="#1E293B">Recognized Tribe</text>
      <text x="180" y="165" font-size="12" fill="#1E293B">Santhal</text>
      <text x="360" y="165" font-size="12" font-weight="700" fill="#047857">Santhal (ST) ✓</text>

      <text x="40" y="205" font-size="12" font-weight="700" fill="#1E293B">State Domicile</text>
      <text x="180" y="205" font-size="12" fill="#1E293B">Jharkhand</text>
      <text x="360" y="205" font-size="12" font-weight="700" fill="#047857">Jharkhand ✓</text>

      <text x="40" y="245" font-size="12" font-weight="700" fill="#1E293B">Annual Income</text>
      <text x="180" y="245" font-size="12" fill="#1E293B">₹1,20,000</text>
      <text x="360" y="245" font-size="12" font-weight="700" fill="#047857">₹1,20,000 ✓</text>

      <!-- Reviewer Action Buttons -->
      <text x="30" y="325" font-size="14" font-weight="800" fill="#1C1917">Record Officer Decision</text>
      
      <rect x="25" y="345" width="235" height="44" rx="10" fill="url(#brandGrad)" />
      <text x="142" y="372" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Approve &amp; Advance Stage</text>

      <rect x="290" y="345" width="235" height="44" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
      <text x="407" y="372" font-size="12" font-weight="700" fill="#92400E" text-anchor="middle">⚠️ Raise Deficiency Notice</text>

      <rect x="25" y="405" width="500" height="44" rx="10" fill="#FEE2E2" stroke="#FECACA" />
      <text x="275" y="432" font-size="12" font-weight="700" fill="#B91C1C" text-anchor="middle">✗ Reject Application (with Reason)</text>
    </g>
  </g>
</svg>`;
}

// 15: Deficiency Notice Modal
function makeDeficiencyModal() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('queue', 'officer')}
  ${renderHeader('Officer Desk')}

  <!-- Dimmed Background Overlay -->
  <rect x="0" y="0" width="1440" height="960" fill="#000000" fill-opacity="0.4" />

  <!-- Center Modal Window -->
  <g transform="translate(420, 180)">
    <rect x="0" y="0" width="600" height="520" rx="20" fill="#FFFFFF" filter="url(#modalShadow)" />
    
    <!-- Modal Header -->
    <rect x="0" y="0" width="600" height="65" rx="20" fill="#FFFBEB" stroke="#FDE68A" />
    <circle cx="35" cy="32" r="14" fill="#F59E0B" />
    <text x="35" y="37" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">!</text>
    <text x="60" y="37" font-size="16" font-weight="800" fill="#92400E">Raise Formal Deficiency Notice</text>
    
    <text x="560" y="37" font-size="16" font-weight="700" fill="#78350F">✕</text>

    <!-- Modal Body -->
    <text x="35" y="95" font-size="13" font-weight="700" fill="#1C1917">Applicant: Asha Kiran Ekka · Application #TS-84920</text>
    <text x="35" y="115" font-size="12" fill="#57534E">This notice returns the application to the scholar with specific correction instructions.</text>

    <text x="35" y="150" font-size="12" font-weight="700" fill="#1C1917">Deficient Document / Requirement</text>
    <rect x="35" y="160" width="530" height="40" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="185" font-size="13" font-weight="600" fill="#1C1917">Annual Income Certificate (Renewal Required) ▾</text>

    <text x="35" y="225" font-size="12" font-weight="700" fill="#1C1917">Specific Deficiency Explanation</text>
    <rect x="35" y="235" width="530" height="90" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="260" font-size="12" fill="#1C1917">The uploaded income certificate was issued for FY 2023-24.</text>
    <text x="50" y="280" font-size="12" fill="#1C1917">Please upload current financial year 2025-26 certificate issued by Tehsildar.</text>

    <text x="35" y="355" font-size="12" font-weight="700" fill="#1C1917">Correction Deadline for Scholar</text>
    <rect x="35" y="365" width="530" height="40" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="50" y="390" font-size="13" font-weight="600" fill="#1C1917">30 October 2026 (12 Days Allowed)</text>

    <!-- Modal Footer -->
    <line x1="35" y1="435" x2="565" y2="435" stroke="#E7E5E4" />
    
    <rect x="300" y="455" width="100" height="40" rx="8" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="350" y="480" font-size="12" font-weight="700" fill="#44403C" text-anchor="middle">Cancel</text>

    <rect x="415" y="455" width="150" height="40" rx="8" fill="url(#amberGrad)" />
    <text x="490" y="480" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Send Notice ➤</text>
  </g>
</svg>`;
}

// 16: Digital Sanction Signing
function makeDigitalSanction() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('queue', 'officer')}
  ${renderHeader('Officer Desk')}

  <!-- Dimmed Background Overlay -->
  <rect x="0" y="0" width="1440" height="960" fill="#000000" fill-opacity="0.4" />

  <g transform="translate(390, 160)">
    <rect x="0" y="0" width="660" height="560" rx="20" fill="#FFFFFF" filter="url(#modalShadow)" />
    
    <!-- Modal Header -->
    <rect x="0" y="0" width="660" height="65" rx="20" fill="#ECFDF5" stroke="#A7F3D0" />
    <circle cx="35" cy="32" r="14" fill="#047857" />
    <text x="35" y="37" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">✍</text>
    <text x="60" y="38" font-size="16" font-weight="800" fill="#065F46">Cryptographic Sanction Order Signing</text>
    
    <text x="35" y="95" font-size="14" font-weight="800" fill="#1C1917">Sanction Order Ref: SANC-MOTA-JH-2026-8812</text>
    <text x="35" y="118" font-size="12" fill="#57534E">Direct Benefit Transfer authorization for Post-Matric ST Scholarship.</text>

    <!-- Financial Breakdown Box -->
    <rect x="35" y="135" width="590" height="110" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
    <text x="55" y="165" font-size="12" font-weight="700" fill="#64748B">BENEFICIARY</text>
    <text x="55" y="185" font-size="14" font-weight="800" fill="#0F172A">Asha Kiran Ekka</text>
    <text x="55" y="205" font-size="11" fill="#64748B">Aadhaar Linked Bank of India</text>

    <text x="320" y="165" font-size="12" font-weight="700" fill="#64748B">SANCTION AMOUNT</text>
    <text x="320" y="190" font-size="22" font-weight="800" fill="#047857">₹ 32,000</text>
    <text x="320" y="210" font-size="11" fill="#047857">Direct PFMS Transfer</text>

    <!-- Signing Officer Box -->
    <rect x="35" y="260" width="590" height="90" rx="10" fill="#FBF9F5" stroke="#CBD5E1" />
    <text x="55" y="285" font-size="12" font-weight="700" fill="#1C1917">Authorized Signing Officer</text>
    <text x="55" y="308" font-size="13" font-weight="800" fill="#047857">Sh. A.K. Verma · District Welfare Nodal Officer, Ranchi</text>
    <text x="55" y="328" font-size="11" font-family="monospace" fill="#57534E">SHA-256 Digest: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd...</text>

    <!-- Solemn Authority Notice -->
    <text x="35" y="375" font-size="11" fill="#78716C">By applying this digital signature, you verify that caste alignment, academic credentials, and income criteria meet official Ministry guidelines.</text>

    <!-- Footer Actions -->
    <line x1="35" y1="475" x2="625" y2="475" stroke="#E7E5E4" />
    <rect x="330" y="495" width="100" height="42" rx="8" fill="#F5F5F4" stroke="#D6D3D1" />
    <text x="380" y="521" font-size="12" font-weight="700" fill="#44403C" text-anchor="middle">Cancel</text>

    <rect x="445" y="495" width="180" height="42" rx="8" fill="url(#brandGrad)" />
    <text x="535" y="521" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">✍ Sign &amp; Authorize DBT</text>
  </g>
</svg>`;
}

// 17: Sabotage Switchboard
function makeSabotageSwitchboard() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('switchboard', 'officer')}
  ${renderHeader('Officer Desk')}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Officer QA &amp; Resilience Switchboard</text>
    <text x="0" y="44" class="subtitle">Simulate external failure modes, third-party downtime, and server conflict edge cases</text>

    <!-- Main Switchboard Panel -->
    <rect x="0" y="65" width="1120" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Switch 1: DigiLocker Outage -->
    <rect x="35" y="95" width="1050" height="85" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="60" y="130" font-size="15" font-weight="800" fill="#1C1917">Simulate DigiLocker API 503 Outage</text>
    <text x="60" y="152" font-size="12" fill="#57534E">Forces the portal to fall back to manual document upload and local PDF validation.</text>
    <rect x="980" y="118" width="80" height="36" rx="18" fill="#E5E7EB" />
    <circle cx="1000" cy="136" r="14" fill="#FFFFFF" filter="url(#shadow)" />
    <text x="1035" y="141" font-size="11" font-weight="800" fill="#6B7280">OFF</text>

    <!-- Switch 2: Duplicate Caste Cert -->
    <rect x="35" y="195" width="1050" height="85" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="60" y="230" font-size="15" font-weight="800" fill="#1C1917">Inject Duplicate Caste Certificate Detection</text>
    <text x="60" y="252" font-size="12" fill="#57534E">Triggers duplicate ST certificate alert across two different candidate accounts.</text>
    <rect x="980" y="218" width="80" height="36" rx="18" fill="#10B981" />
    <circle cx="1040" cy="236" r="14" fill="#FFFFFF" filter="url(#shadow)" />
    <text x="1000" y="241" font-size="11" font-weight="800" fill="#FFFFFF">ON</text>

    <!-- Switch 3: PFMS DBT Timeout -->
    <rect x="35" y="295" width="1050" height="85" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="60" y="330" font-size="15" font-weight="800" fill="#1C1917">Simulate PFMS / NPCI DBT Gateway Timeout</text>
    <text x="60" y="352" font-size="12" fill="#57534E">Tests graceful retry queuing and prevents double payment deduction.</text>
    <rect x="980" y="318" width="80" height="36" rx="18" fill="#E5E7EB" />
    <circle cx="1000" cy="336" r="14" fill="#FFFFFF" filter="url(#shadow)" />
    <text x="1035" y="341" font-size="11" font-weight="800" fill="#6B7280">OFF</text>

    <!-- Switch 4: Packet Drop Offline -->
    <rect x="35" y="395" width="1050" height="85" rx="12" fill="#FBF9F5" stroke="#E7E5E4" />
    <text x="60" y="430" font-size="15" font-weight="800" fill="#1C1917">Force Mobile Offline Mode (Drop Network Packets)</text>
    <text x="60" y="452" font-size="12" fill="#57534E">Simulates weak rural connectivity; tests local IndexedDB queuing without errors.</text>
    <rect x="980" y="418" width="80" height="36" rx="18" fill="#E5E7EB" />
    <circle cx="1000" cy="436" r="14" fill="#FFFFFF" filter="url(#shadow)" />
    <text x="1035" y="441" font-size="11" font-weight="800" fill="#6B7280">OFF</text>

    <!-- Bottom Action Button -->
    <rect x="35" y="510" width="220" height="42" rx="10" fill="url(#brandGrad)" />
    <text x="145" y="536" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Reset All Test Overrides</text>
  </g>
</svg>`;
}

// 18: Coverage Gap Analytics
function makeCoverageGap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('coverage', 'officer')}
  ${renderHeader('Officer Desk')}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">ST Scheme Coverage &amp; Gap Analytics</text>
    <text x="0" y="44" class="subtitle">District-level tribal saturation: Comparing enrolled ST scholars vs active scholarship beneficiaries</text>

    <!-- Top KPI Cards -->
    <rect x="0" y="65" width="350" height="110" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="25" y="95" font-size="12" font-weight="700" fill="#A8A29E">TOTAL ENROLLED ST SCHOLARS</text>
    <text x="25" y="132" font-size="28" font-weight="800" fill="#1C1917">14,280</text>
    <text x="25" y="155" font-size="11" fill="#047857">District Census Baseline 2026</text>

    <rect x="380" y="65" width="350" height="110" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="405" y="95" font-size="12" font-weight="700" fill="#A8A29E">ACTIVE SCHOLARSHIP BENEFICIARIES</text>
    <text x="405" y="132" font-size="28" font-weight="800" fill="#047857">11,424</text>
    <text x="405" y="155" font-size="11" fill="#047857">80.0% Saturation Rate</text>

    <rect x="760" y="65" width="360" height="110" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="785" y="95" font-size="12" font-weight="700" fill="#A8A29E">IDENTIFIED COVERAGE GAP</text>
    <text x="785" y="132" font-size="28" font-weight="800" fill="#D97706">2,856 Scholars</text>
    <text x="785" y="155" font-size="11" fill="#D97706">Special Outreach Required</text>

    <!-- Saturation Breakdown Chart -->
    <rect x="0" y="200" width="1120" height="380" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    <text x="35" y="235" font-size="16" font-weight="800" fill="#1C1917">District Saturation Breakdown (Jharkhand)</text>
    
    <!-- Bar 1: Ranchi -->
    <text x="35" y="280" font-size="13" font-weight="700" fill="#1C1917">Ranchi District (88% Saturation)</text>
    <rect x="35" y="295" width="900" height="24" rx="6" fill="#F5F5F4" />
    <rect x="35" y="295" width="792" height="24" rx="6" fill="url(#brandGrad)" />
    <text x="950" y="312" font-size="12" font-weight="700" fill="#047857">4,400 / 5,000</text>

    <!-- Bar 2: Khunti -->
    <text x="35" y="350" font-size="13" font-weight="700" fill="#1C1917">Khunti District (72% Saturation)</text>
    <rect x="35" y="365" width="900" height="24" rx="6" fill="#F5F5F4" />
    <rect x="35" y="365" width="648" height="24" rx="6" fill="url(#brandGrad)" />
    <text x="950" y="382" font-size="12" font-weight="700" fill="#047857">2,160 / 3,000</text>

    <!-- Bar 3: Gumla -->
    <text x="35" y="420" font-size="13" font-weight="700" fill="#1C1917">Gumla District (64% Saturation - PVTG Priority)</text>
    <rect x="35" y="435" width="900" height="24" rx="6" fill="#F5F5F4" />
    <rect x="35" y="435" width="576" height="24" rx="6" fill="url(#amberGrad)" />
    <text x="950" y="452" font-size="12" font-weight="700" fill="#D97706">1,920 / 3,000</text>

    <!-- Bar 4: Simdega -->
    <text x="35" y="490" font-size="13" font-weight="700" fill="#1C1917">Simdega District (91% Saturation)</text>
    <rect x="35" y="505" width="900" height="24" rx="6" fill="#F5F5F4" />
    <rect x="35" y="505" width="819" height="24" rx="6" fill="url(#brandGrad)" />
    <text x="950" y="522" font-size="12" font-weight="700" fill="#047857">2,944 / 3,280</text>
  </g>
</svg>`;
}

// 19: Forensic Audit Log
function makeForensicAudit() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}
  ${renderSidebar('audit', 'officer')}
  ${renderHeader('Officer Desk')}

  <g transform="translate(280, 80)">
    <text x="0" y="24" class="title">Forensic Audit Log &amp; Cryptographic History</text>
    <text x="0" y="44" class="subtitle">Immutable ledger of officer decisions, document updates, and payment disbursements</text>

    <!-- Audit Log Table -->
    <rect x="0" y="65" width="1120" height="520" rx="16" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <text x="35" y="105" font-size="12" font-weight="700" fill="#A8A29E">TIMESTAMP</text>
    <text x="210" y="105" font-size="12" font-weight="700" fill="#A8A29E">EVENT TYPE</text>
    <text x="380" y="105" font-size="12" font-weight="700" fill="#A8A29E">ACTOR &amp; ROLE</text>
    <text x="610" y="105" font-size="12" font-weight="700" fill="#A8A29E">TARGET DETAILS</text>
    <text x="920" y="105" font-size="12" font-weight="700" fill="#A8A29E">CRYPTOGRAPHIC DIGEST</text>
    <line x1="35" y1="120" x2="1085" y2="120" stroke="#E7E5E4" />

    <!-- Row 1 -->
    <text x="35" y="155" font-size="12" font-weight="600" fill="#1C1917">2026-10-18 19:42:10</text>
    <rect x="210" y="140" width="130" height="22" rx="4" fill="#D1FAE5" />
    <text x="275" y="155" font-size="10" font-weight="800" fill="#065F46" text-anchor="middle">DECISION_SANCTION</text>
    <text x="380" y="155" font-size="12" font-weight="700" fill="#1C1917">Sh. A.K. Verma (Nodal)</text>
    <text x="610" y="155" font-size="12" fill="#57534E">App #TS-84920 (₹32,000)</text>
    <text x="920" y="155" font-size="11" font-family="monospace" fill="#047857">SHA-256 7f83b165...</text>
    <line x1="35" y1="175" x2="1085" y2="175" stroke="#F5F5F4" />

    <!-- Row 2 -->
    <text x="35" y="210" font-size="12" font-weight="600" fill="#1C1917">2026-10-18 18:15:02</text>
    <rect x="210" y="195" width="130" height="22" rx="4" fill="#EFF6FF" />
    <text x="275" y="210" font-size="10" font-weight="800" fill="#1D4ED8" text-anchor="middle">DOC_VERSIONED</text>
    <text x="380" y="210" font-size="12" font-weight="700" fill="#1C1917">Asha Kiran Ekka (Student)</text>
    <text x="610" y="210" font-size="12" fill="#57534E">Doc #102 v2 replaces v1</text>
    <text x="920" y="210" font-size="11" font-family="monospace" fill="#2563EB">SHA-256 e8f1491a...</text>
    <line x1="35" y1="230" x2="1085" y2="230" stroke="#F5F5F4" />

    <!-- Row 3 -->
    <text x="35" y="265" font-size="12" font-weight="600" fill="#1C1917">2026-10-18 16:30:45</text>
    <rect x="210" y="250" width="130" height="22" rx="4" fill="#FEF3C7" />
    <text x="275" y="265" font-size="10" font-weight="800" fill="#B45309" text-anchor="middle">DEFICIENCY_RAISED</text>
    <text x="380" y="265" font-size="12" font-weight="700" fill="#1C1917">Dr. S. Munda (Institute)</text>
    <text x="610" y="265" font-size="12" fill="#57534E">App #TS-71204 (Income Cert)</text>
    <text x="920" y="265" font-size="11" font-family="monospace" fill="#78716C">SHA-256 a1930fd2...</text>
  </g>
</svg>`;
}

// =============================================================
// SYSTEM & AUTH SCREENS (3 Screens)
// =============================================================

// 20: Pilot Sign-in Portal
function makePilotSignIn() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}

  <!-- Top Simple Bar -->
  <rect x="0" y="4" width="1440" height="56" fill="#FFFFFF" stroke="#E7E5E4" />
  <circle cx="50" cy="32" r="14" fill="#047857" />
  <text x="50" y="37" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>
  <text x="75" y="37" font-size="16" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
  <text x="200" y="37" font-size="12" fill="#78716C">Production Pilot Shell · Ministry of Tribal Affairs</text>
  <text x="1350" y="37" font-size="12" font-weight="700" fill="#047857">हिन्दी / EN</text>

  <!-- Login Card Center -->
  <g transform="translate(470, 140)">
    <rect x="0" y="0" width="500" height="660" rx="20" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <circle cx="250" cy="55" r="26" fill="#F0FDF4" stroke="#047857" stroke-width="2" />
    <text x="250" y="62" font-size="16" font-weight="900" fill="#047857" text-anchor="middle">TS</text>
    
    <text x="250" y="110" font-size="20" font-weight="800" fill="#1C1917" text-anchor="middle">Tribe Saarthi · Working Pilot</text>
    <text x="250" y="132" font-size="12" fill="#57534E" text-anchor="middle">Invite-only authentication for verified students and officials</text>

    <!-- Email Field -->
    <text x="40" y="175" font-size="12" font-weight="700" fill="#1C1917">Official Email Address</text>
    <rect x="40" y="185" width="420" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="55" y="211" font-size="13" fill="#1C1917">asha.ekka@student.bitmesra.ac.in</text>

    <!-- Password Field -->
    <text x="40" y="250" font-size="12" font-weight="700" fill="#1C1917">Password</text>
    <rect x="40" y="260" width="420" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="55" y="286" font-size="13" fill="#78716C">••••••••••••</text>

    <text x="350" y="320" font-size="11" font-weight="700" fill="#047857">Forgot Password?</text>

    <!-- Sign In Button -->
    <rect x="40" y="340" width="420" height="44" rx="10" fill="url(#brandGrad)" />
    <text x="250" y="367" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Sign In to Workspace →</text>

    <line x1="40" y1="415" x2="460" y2="415" stroke="#E7E5E4" />
    <text x="250" y="440" font-size="11" font-weight="700" fill="#A8A29E" text-anchor="middle">QUICK 1-CLICK PERSONA LOGIN (PILOT TESTING)</text>

    <!-- Quick Switcher Buttons -->
    <rect x="40" y="460" width="200" height="40" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="140" y="485" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">🎓 ST Student</text>

    <rect x="260" y="460" width="200" height="40" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="360" y="485" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">🏛 Institute Officer</text>

    <rect x="40" y="515" width="200" height="40" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="140" y="540" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">⚖ District Nodal</text>

    <rect x="260" y="515" width="200" height="40" rx="8" fill="#F5F5F4" stroke="#E7E5E4" />
    <text x="360" y="540" font-size="11" font-weight="700" fill="#1C1917" text-anchor="middle">👪 Family Account</text>

    <text x="250" y="600" font-size="11" fill="#78716C" text-anchor="middle">DigiLocker · PFMS Direct Benefit Transfer · UIDAI Masked</text>
  </g>
</svg>`;
}

// 21: Password Recovery Flow
function makePasswordRecovery() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}

  <!-- Top Simple Bar -->
  <rect x="0" y="4" width="1440" height="56" fill="#FFFFFF" stroke="#E7E5E4" />
  <circle cx="50" cy="32" r="14" fill="#047857" />
  <text x="50" y="37" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>
  <text x="75" y="37" font-size="16" font-weight="800" fill="#1C1917">Tribe Saarthi</text>
  <text x="200" y="37" font-size="12" fill="#78716C">Account Recovery · Ministry of Tribal Affairs</text>

  <!-- Recovery Card Center -->
  <g transform="translate(470, 200)">
    <rect x="0" y="0" width="500" height="450" rx="20" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <circle cx="250" cy="55" r="26" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2" />
    <text x="250" y="62" font-size="18" font-weight="900" fill="#B45309" text-anchor="middle">🔑</text>
    
    <text x="250" y="110" font-size="20" font-weight="800" fill="#1C1917" text-anchor="middle">Reset your account password</text>
    <text x="250" y="132" font-size="12" fill="#57534E" text-anchor="middle">Enter your verified email to receive an official recovery link</text>

    <!-- Email Field -->
    <text x="40" y="180" font-size="12" font-weight="700" fill="#1C1917">Registered Email Address</text>
    <rect x="40" y="195" width="420" height="42" rx="8" fill="#FBF9F5" stroke="#D6D3D1" />
    <text x="55" y="221" font-size="13" fill="#1C1917">asha.ekka@student.bitmesra.ac.in</text>

    <!-- Send Link Button -->
    <rect x="40" y="260" width="420" height="44" rx="10" fill="url(#brandGrad)" />
    <text x="250" y="287" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Send Password Reset Link →</text>

    <line x1="40" y1="335" x2="460" y2="335" stroke="#E7E5E4" />
    <text x="250" y="370" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">← Return to Sign In</text>

    <text x="250" y="410" font-size="11" fill="#78716C" text-anchor="middle">Need assistance? Call Ministry Toll-Free: 1800-11-2026</text>
  </g>
</svg>`;
}

// 22: Public Receipt Verification
function makePublicReceipt() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${commonStyles}
  <rect width="1440" height="960" fill="#FAF7F2" />
  ${renderTopAccent()}

  <!-- Public Verification Container -->
  <g transform="translate(390, 80)">
    <rect x="0" y="0" width="660" height="780" rx="20" fill="#FFFFFF" stroke="#E7E5E4" filter="url(#shadow)" />
    
    <!-- Top Green Verified Shield Header -->
    <rect x="0" y="0" width="660" height="110" rx="20" fill="url(#brandGrad)" />
    <circle cx="330" cy="45" r="24" fill="#FFFFFF" />
    <text x="330" y="53" font-size="18" font-weight="900" fill="#047857" text-anchor="middle">✓</text>
    <text x="330" y="92" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">OFFICIALLY VERIFIED SCHOLARSHIP RECEIPT</text>

    <text x="330" y="145" font-size="13" font-weight="700" fill="#78350F" text-anchor="middle">MINISTRY OF TRIBAL AFFAIRS · GOVERNMENT OF INDIA</text>
    <text x="330" y="165" font-size="11" fill="#78716C" text-anchor="middle">Direct Verification Record via QR Code / URL</text>

    <!-- Details Box -->
    <rect x="40" y="185" width="580" height="340" rx="14" fill="#F8FAFC" stroke="#E2E8F0" />
    
    <text x="65" y="220" font-size="11" font-weight="700" fill="#64748B">RECEIPT REFERENCE</text>
    <text x="65" y="240" font-size="14" font-weight="800" fill="#0F172A">TS-REC-2026-JH-8812</text>

    <text x="350" y="220" font-size="11" font-weight="700" fill="#64748B">DATE ISSUED</text>
    <text x="350" y="240" font-size="14" font-weight="800" fill="#0F172A">18 October 2026 19:42 IST</text>

    <line x1="65" y1="260" x2="595" y2="260" stroke="#E2E8F0" />

    <text x="65" y="290" font-size="11" font-weight="700" fill="#64748B">BENEFICIARY SCHOLAR</text>
    <text x="65" y="310" font-size="14" font-weight="800" fill="#0F172A">Asha Kiran Ekka (ST · Santhal Tribe)</text>
    <text x="65" y="328" font-size="12" fill="#64748B">APAAR ID: 9482-1049-5821 · BIT Mesra</text>

    <line x1="65" y1="350" x2="595" y2="350" stroke="#E2E8F0" />

    <text x="65" y="380" font-size="11" font-weight="700" fill="#64748B">SANCTIONED SCHEME</text>
    <text x="65" y="400" font-size="14" font-weight="800" fill="#0F172A">Post-Matric Scholarship Scheme for ST Students</text>

    <text x="350" y="380" font-size="11" font-weight="700" fill="#64748B">SANCTION AMOUNT</text>
    <text x="350" y="405" font-size="20" font-weight="900" fill="#047857">₹ 32,000</text>

    <line x1="65" y1="430" x2="595" y2="430" stroke="#E2E8F0" />

    <text x="65" y="460" font-size="11" font-weight="700" fill="#64748B">DECISION DIGEST (SHA-256)</text>
    <text x="65" y="480" font-size="11" font-family="monospace" fill="#047857">7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</text>
    <text x="65" y="500" font-size="10" fill="#64748B">Cryptographically authenticated by District Welfare Office, Ranchi.</text>

    <!-- Simulated QR Graphic -->
    <rect x="255" y="545" width="150" height="150" rx="10" fill="#FFFFFF" stroke="#047857" stroke-width="2" />
    <rect x="270" y="560" width="35" height="35" fill="#047857" />
    <rect x="277" y="567" width="21" height="21" fill="#FFFFFF" />
    <rect x="282" y="572" width="11" height="11" fill="#047857" />

    <rect x="355" y="560" width="35" height="35" fill="#047857" />
    <rect x="362" y="567" width="21" height="21" fill="#FFFFFF" />
    <rect x="367" y="572" width="11" height="11" fill="#047857" />

    <rect x="270" y="645" width="35" height="35" fill="#047857" />
    <rect x="277" y="652" width="21" height="21" fill="#FFFFFF" />
    <rect x="282" y="657" width="11" height="11" fill="#047857" />

    <rect x="320" y="575" width="15" height="15" fill="#047857" />
    <rect x="345" y="610" width="20" height="10" fill="#047857" />
    <rect x="320" y="630" width="25" height="25" fill="#047857" />
    <rect x="360" y="645" width="15" height="15" fill="#047857" />

    <text x="330" y="720" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Scan to Verify Authority Signature</text>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// Generation & Write Execution
// -------------------------------------------------------------
const catalog = [
  // Scholar Portal
  { dir: scholarDir, name: '01-scholar-dashboard-desktop.svg', fn: makeStudentHome },
  { dir: scholarDir, name: '02-scholar-dashboard-mobile.svg', fn: makeStudentMobile },
  { dir: scholarDir, name: '03-scholarship-discovery.svg', fn: makeScholarships },
  { dir: scholarDir, name: '04-application-flow-step1-profile.svg', fn: makeAppStep1 },
  { dir: scholarDir, name: '05-application-flow-step2-documents.svg', fn: makeAppStep2 },
  { dir: scholarDir, name: '06-application-flow-step3-check-answers.svg', fn: makeAppStep3 },
  { dir: scholarDir, name: '07-application-lifecycle-tracker.svg', fn: makeAppTracker },
  { dir: scholarDir, name: '08-digilocker-document-wallet.svg', fn: makeDocumentWallet },
  { dir: scholarDir, name: '09-help-and-saarthi-assistant.svg', fn: makeHelpAssistant },
  { dir: scholarDir, name: '10-student-profile-and-pvtg.svg', fn: makeStudentProfile },
  { dir: scholarDir, name: '11-family-access-consent.svg', fn: makeFamilyConsent },
  { dir: scholarDir, name: '12-offline-sync-queue.svg', fn: makeOfflineQueue },

  // Officer Portal
  { dir: officerDir, name: '13-officer-review-queue.svg', fn: makeOfficerQueue },
  { dir: officerDir, name: '14-officer-case-detail-inspection.svg', fn: makeCaseInspection },
  { dir: officerDir, name: '15-deficiency-notice-modal.svg', fn: makeDeficiencyModal },
  { dir: officerDir, name: '16-digital-sanction-signing.svg', fn: makeDigitalSanction },
  { dir: officerDir, name: '17-sabotage-switchboard.svg', fn: makeSabotageSwitchboard },
  { dir: officerDir, name: '18-coverage-gap-analytics.svg', fn: makeCoverageGap },
  { dir: officerDir, name: '19-forensic-audit-log.svg', fn: makeForensicAudit },

  // System & Auth
  { dir: systemDir, name: '20-pilot-signin-portal.svg', fn: makePilotSignIn },
  { dir: systemDir, name: '21-password-recovery-flow.svg', fn: makePasswordRecovery },
  { dir: systemDir, name: '22-public-receipt-verification.svg', fn: makePublicReceipt },
];

console.log('Generating complete set of 22 SVGs in folders...');
for (const item of catalog) {
  const filePath = path.join(item.dir, item.name);
  fs.writeFileSync(filePath, item.fn(), 'utf8');
  console.log(`Generated: ${filePath}`);
}

// Generate interactive HTML index gallery for instant browser preview
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tribe Saarthi · Complete UI SVG Mockup Gallery</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF7F2; margin: 0; padding: 40px; color: #1C1917; }
    h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; color: #047857; }
    p.lead { font-size: 15px; color: #57534E; margin-bottom: 32px; }
    h2 { font-size: 20px; font-weight: 800; border-bottom: 2px solid #E7E5E4; padding-bottom: 8px; margin-top: 40px; color: #1C1917; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; margin-top: 20px; }
    .card { background: #FFFFFF; border-radius: 12px; border: 1px solid #E7E5E4; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    .preview { background: #F5F5F4; border-bottom: 1px solid #E7E5E4; height: 220px; display: flex; align-items: center; justify-content: center; padding: 12px; }
    .preview img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 2px 4px rgba(0,0,0,0.08); border-radius: 4px; }
    .content { padding: 16px; }
    .content h3 { margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
    .content a { display: inline-block; margin-top: 8px; font-size: 12px; font-weight: 700; color: #047857; text-decoration: none; }
    .content a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Tribe Saarthi · Complete UI SVG Mockup Gallery</h1>
  <p class="lead">All 22 vector mockups generated for the Ministry of Tribal Affairs portal simplification research. Click any card to open the raw vector SVG.</p>

  <h2>1. Scholar Portal (12 Screens)</h2>
  <div class="grid">
    ${catalog.filter(c => c.dir === scholarDir).map(c => `
      <div class="card">
        <div class="preview"><img src="01-scholar-portal/${c.name}" alt="${c.name}" /></div>
        <div class="content">
          <h3>${c.name.replace('.svg', '').replace(/^[0-9]+-/, '')}</h3>
          <a href="01-scholar-portal/${c.name}" target="_blank">Open Vector SVG ↗</a>
        </div>
      </div>
    `).join('')}
  </div>

  <h2>2. Officer Portal &amp; Verification (7 Screens)</h2>
  <div class="grid">
    ${catalog.filter(c => c.dir === officerDir).map(c => `
      <div class="card">
        <div class="preview"><img src="02-officer-portal/${c.name}" alt="${c.name}" /></div>
        <div class="content">
          <h3>${c.name.replace('.svg', '').replace(/^[0-9]+-/, '')}</h3>
          <a href="02-officer-portal/${c.name}" target="_blank">Open Vector SVG ↗</a>
        </div>
      </div>
    `).join('')}
  </div>

  <h2>3. System, Authentication &amp; Public Receipts (3 Screens)</h2>
  <div class="grid">
    ${catalog.filter(c => c.dir === systemDir).map(c => `
      <div class="card">
        <div class="preview"><img src="03-system-auth/${c.name}" alt="${c.name}" /></div>
        <div class="content">
          <h3>${c.name.replace('.svg', '').replace(/^[0-9]+-/, '')}</h3>
          <a href="03-system-auth/${c.name}" target="_blank">Open Vector SVG ↗</a>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(baseOutDir, 'index.html'), html, 'utf8');
console.log('Generated visual catalog: docs/ui-mockups/index.html');
