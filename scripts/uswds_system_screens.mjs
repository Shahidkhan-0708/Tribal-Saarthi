// =============================================================
// USWDS 3.0 System & Auth Mockups (Screens 20 - 22)
// Full Self-Contained Generators
// =============================================================

import {
  I,
  makeDefs,
  renderUsaBanner,
  renderGovHeader,
  renderStepperPipelineComponent,
  renderDonutChartComponent
} from './uswds_svg_library.mjs';

// -------------------------------------------------------------
// SCREEN 20: Pilot Sign-In Portal
// -------------------------------------------------------------
export function make20PilotSigninPortal() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  <rect y="32" width="1440" height="82" fill="#FFFFFF" stroke="#CFDADD" />
  <circle cx="68" cy="73" r="22" fill="#075A46" />
  <text x="68" y="79" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">TS</text>
  <text x="104" y="72" font-size="24" font-weight="700" fill="#152E35">Tribe Saarthi</text>
  <text x="104" y="94" font-size="12" fill="#52666D">Scholarship support for tribal students</text>
  <text x="1376" y="80" text-anchor="end" font-size="14" fill="#075A46">English / हिंदी</text>
  <g transform="translate(100, 218)">
    <text x="0" y="40" font-size="38" font-weight="700" fill="#152E35">A clearer path to</text>
    <text x="0" y="90" font-size="38" font-weight="700" fill="#152E35">your scholarship.</text>
    <text x="0" y="134" font-size="17" fill="#52666D">Apply, keep your documents together, and follow</text>
    <text x="0" y="162" font-size="17" fill="#52666D">each decision from your college to your bank.</text>
    <line x1="20" y1="226" x2="20" y2="450" stroke="#CFDADD" stroke-width="2" />
    ${[
      ['Find the right scheme', 'Understand the requirements before you apply.'],
      ['Use your documents again', 'Keep them ready for your next application.'],
      ['Know what happens next', 'See who is reviewing your application.']
    ].map(([title, detail], i) => `
      <g transform="translate(0, ${216 + i * 104})">
        <circle cx="20" cy="16" r="20" fill="#E8F2EE" />
        ${[I.book, I.doc, I.checkCircle][i](10, 6, '#075A46', 20)}
        <text x="60" y="19" font-size="19" font-weight="700" fill="#152E35">${title}</text>
        <text x="60" y="47" font-size="14" fill="#52666D">${detail}</text>
      </g>`).join('')}
  </g>
  <g transform="translate(820, 182)">
    <rect width="520" height="618" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
    <path d="M0 8Q0 0 8 0H512Q520 0 520 8" stroke="#075A46" stroke-width="4" />
    <text x="36" y="58" font-size="28" font-weight="700" fill="#152E35">Sign in to your account</text>
    <text x="36" y="89" font-size="14" fill="#52666D">Use the email on your pilot invitation.</text>
    <text x="36" y="145" font-size="14" font-weight="700" fill="#152E35">Email address</text>
    <rect x="36" y="158" width="448" height="52" rx="4" fill="#FFFFFF" stroke="#52666D" />
    <text x="52" y="190" font-size="16" fill="#152E35">mohan@example.test</text>
    <text x="36" y="251" font-size="14" font-weight="700" fill="#152E35">Password</text>
    <rect x="36" y="264" width="448" height="52" rx="4" fill="#FFFFFF" stroke="#52666D" />
    <text x="52" y="296" font-size="18" fill="#152E35">••••••••••••</text>
    <text x="484" y="346" text-anchor="end" font-size="14" font-weight="700" fill="#075A46">Forgot password?</text>
    <rect x="36" y="374" width="448" height="52" rx="4" fill="#075A46" />
    <text x="260" y="407" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">Sign in</text>
    <line x1="36" y1="458" x2="484" y2="458" stroke="#CFDADD" />
    <text x="36" y="492" font-size="16" font-weight="700" fill="#152E35">Don't have an invitation?</text>
    <text x="36" y="520" font-size="14" fill="#52666D">Ask your institution's scholarship officer.</text>
    <text x="36" y="558" font-size="14" font-weight="700" fill="#075A46">Get help signing in</text>
  </g>
  <text x="100" y="894" font-size="13" fill="#52666D">Invite-only pilot · Sample account shown</text>
  <text x="1340" y="894" text-anchor="end" font-size="13" fill="#075A46">Privacy and support</text>
</svg>`;
}

export function make21PasswordRecoveryFlow() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  <rect y="32" width="1440" height="82" fill="#FFFFFF" stroke="#CFDADD" />
  <circle cx="68" cy="73" r="22" fill="#075A46" />
  <text x="68" y="79" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">TS</text>
  <text x="104" y="72" font-size="24" font-weight="700" fill="#152E35">Tribe Saarthi</text>
  <text x="104" y="94" font-size="12" fill="#52666D">Scholarship support for tribal students</text>
  <text x="1376" y="80" text-anchor="end" font-size="14" fill="#075A46">English / हिंदी</text>
  <g transform="translate(420, 192)">
    <rect width="600" height="558" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
    <path d="M0 8Q0 0 8 0H592Q600 0 600 8" stroke="#075A46" stroke-width="4" />
    <text x="36" y="60" font-size="28" font-weight="700" fill="#152E35">Reset your password</text>
    <text x="36" y="96" font-size="15" fill="#52666D">Enter the email you use to sign in.</text>
    <text x="36" y="122" font-size="15" fill="#52666D">We'll send you a link to choose a new password.</text>
    <text x="36" y="181" font-size="14" font-weight="700" fill="#152E35">Email address</text>
    <rect x="36" y="196" width="528" height="52" rx="4" fill="#FFFFFF" stroke="#52666D" />
    <text x="52" y="228" font-size="16" fill="#152E35">mohan@example.test</text>
    <rect x="36" y="276" width="528" height="52" rx="4" fill="#075A46" />
    <text x="300" y="309" text-anchor="middle" font-size="16" font-weight="700" fill="#FFFFFF">Send reset link</text>
    <text x="36" y="367" font-size="14" font-weight="700" fill="#075A46">Back to sign in</text>
    <line x1="36" y1="398" x2="564" y2="398" stroke="#CFDADD" />
    <text x="36" y="434" font-size="16" font-weight="700" fill="#152E35">Can't access your email?</text>
    <text x="36" y="462" font-size="14" fill="#52666D">Ask your institution's scholarship officer for help.</text>
    <text x="36" y="504" font-size="13" fill="#52666D">If an account uses this email, a reset link will be sent.</text>
  </g>
</svg>`;
}

export function make22PublicReceiptVerification() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}

  <!-- Brand Header -->
  <g transform="translate(0, 36)">
    <rect width="1440" height="70" fill="#FFFFFF" stroke="#CFDADD" />
    <g transform="translate(48, 16)">
      <circle cx="20" cy="20" r="18" fill="url(#govPrimaryGrad)" />
      <text x="20" y="25" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">TS</text>

      <text x="48" y="16" font-size="16" font-weight="700" fill="#152E35">Tribe Saarthi</text>
      <text x="48" y="32" font-size="10" font-weight="700" fill="#8A4F13">Public statutory scholarship receipt verification portal</text>

      <g transform="translate(1080, 4)">
        <rect width="280" height="32" rx="8" fill="#E8F2EE" stroke="#A7F3D0" />
        <text x="140" y="20" font-size="12" fill="#075A46" text-anchor="middle">Sample receipt verification</text>
      </g>
    </g>
  </g>

  <!-- Main View -->
  <rect x="0" y="106" width="1440" height="854" fill="#EEF3F3" />

  <g transform="translate(180, 130)">
    <!-- Search Query Bar -->
    <g>
      <rect width="1080" height="76" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
      <g transform="translate(20, 16)">
        <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">Enter sanction receipt ID or scan QR code to verify authenticity</text>
        <rect x="0" y="20" width="800" height="42" rx="8" fill="#EEF3F3" stroke="#075A46" stroke-width="1.5" />
        <text x="16" y="47" font-size="14" font-weight="700" fill="#152E35" class="mono">TS-2026-88194</text>
        <rect x="680" y="26" width="108" height="30" rx="6" fill="#E8F2EE" />
        <text x="734" y="46" font-size="9.5" font-weight="700" fill="#075A46" text-anchor="middle">Valid hash ✓</text>

        <rect x="820" y="20" width="240" height="42" rx="8" fill="url(#govPrimaryGrad)" />
        <text x="940" y="47" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Verify Public Integrity Seal</text>
      </g>
    </g>

    <!-- Certificate / Receipt Manifest Card -->
    <g transform="translate(0, 96)" filter="url(#modalShadow)">
      <rect width="1080" height="690" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
      <rect width="1080" height="6" rx="3" fill="#075A46" />

      <!-- Official Emblem & Header -->
      <g transform="translate(36, 26)">
        <circle cx="28" cy="28" r="28" fill="url(#govPrimaryGrad)" />
        <text x="28" y="34" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle">NIC</text>

        <text x="70" y="22" font-size="18" font-weight="700" fill="#152E35">Scholarship approval receipt</text>
        <text x="70" y="40" font-size="12" fill="#075A46" font-weight="700">Sample receipt · Reference MOTA/2026/88194</text>

        <rect x="860" y="10" width="180" height="36" rx="8" fill="#E8F2EE" stroke="#A7F3D0" />
        <text x="950" y="33" font-size="11" font-weight="700" fill="#075A46" text-anchor="middle">Authentic &amp; sealed ✓</text>

        <line x1="0" y1="62" x2="1008" y2="62" stroke="#CFDADD" />
      </g>

      <!-- Trust Pathway Stepper Component -->
      <g transform="translate(36, 110)">
        <text x="0" y="14" font-size="12" font-weight="700" fill="#075A46">End-to-end cryptographic trust pathway</text>
        <text x="0" y="30" font-size="11" fill="#52666D">Real-time status confirmed across College, District, State and PFMS Central Treasury</text>

        <g transform="translate(0, 44)">
          <rect width="1008" height="110" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
          <g transform="translate(18, 16)">
            ${renderStepperPipelineComponent({
              x: 0,
              y: 0,
              width: 972,
              steps: [
                { title: 'College Verified', sub: 'BIT Mesra Nodal Desk', status: 'done', badge: 'PASSED' },
                { title: 'District Concurrence', sub: 'Latehar DWO (DSC Sign)', status: 'done', badge: 'PASSED' },
                { title: 'Central Sanction Order', sub: 'MoTA Treasury Seal', status: 'done', badge: 'ISSUED' },
                { title: 'PFMS Direct Credit', sub: 'Bank of India ••••9012', status: 'active', badge: 'IN PROGRESS' }
              ]
            })}
          </g>
        </g>
      </g>

      <!-- Details Split Row -->
      <g transform="translate(36, 300)">
        <!-- Left: Beneficiary & Grant Summary -->
        <g>
          <rect width="600" height="260" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
          <g transform="translate(20, 18)">
            <text x="0" y="14" font-size="13" font-weight="700" fill="#152E35">Scholar and scholarship details</text>

            <text x="0" y="42" font-size="11" font-weight="700" fill="#52666D">Scholar name:</text>
            <text x="140" y="42" font-size="12" font-weight="700" fill="#152E35">Mohan Birhor (PVTG Tier-1 Birhor Tribe)</text>

            <text x="0" y="66" font-size="11" font-weight="700" fill="#52666D">Domicile residence:</text>
            <text x="140" y="66" font-size="12" fill="#152E35">Village Belta, Block Mahuadanr, District Latehar, Jharkhand</text>

            <text x="0" y="90" font-size="11" font-weight="700" fill="#52666D">Institution &amp; roll:</text>
            <text x="140" y="90" font-size="12" fill="#152E35">BIT Mesra, Ranchi · Roll #2024-CSE-104 (B.Tech CSE)</text>

            <line x1="0" y1="108" x2="560" y2="108" stroke="#CFDADD" />

            <text x="0" y="132" font-size="11" font-weight="700" fill="#52666D">Total sanction sum:</text>
            <text x="140" y="132" font-size="15" font-weight="700" fill="#075A46" class="mono">₹132,000 (One Hundred &amp; Thirty-Two Thousand Rupees)</text>

            <text x="0" y="156" font-size="11" font-weight="700" fill="#52666D">Grant component:</text>
            <text x="140" y="156" font-size="11.5" fill="#52666D">Tuition: ₹98,000 | Maintenance: ₹24,000 | Book Allowance: ₹10,000</text>

            <text x="0" y="180" font-size="11" font-weight="700" fill="#52666D">Target DBT account:</text>
            <text x="140" y="180" font-size="11.5" fill="#152E35">Bank of India · ••••••••9012 (Aadhaar Seeded &amp; NPCI Validated)</text>

            <text x="0" y="204" font-size="11" font-weight="700" fill="#52666D">Signing authority:</text>
            <text x="140" y="204" font-size="11.5" fill="#075A46" font-weight="700">Dr. K. Soren, DWO Latehar (DSC Serial: 0x7F82A091)</text>
          </g>
        </g>

        <!-- Right: QR Code & Merkle Anchor Box -->
        <g transform="translate(624, 0)">
          <rect width="384" height="260" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
          <g transform="translate(20, 18)">
            <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">Receipt reference</text>

            <!-- Simulated QR Code Visual -->
            <g transform="translate(0, 30)">
              <rect width="110" height="110" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
              <!-- QR Finder Patterns -->
              <rect x="8" y="8" width="28" height="28" fill="#152E35" />
              <rect x="12" y="12" width="20" height="20" fill="#FFFFFF" />
              <rect x="16" y="16" width="12" height="12" fill="#152E35" />

              <rect x="74" y="8" width="28" height="28" fill="#152E35" />
              <rect x="78" y="12" width="20" height="20" fill="#FFFFFF" />
              <rect x="82" y="16" width="12" height="12" fill="#152E35" />

              <rect x="8" y="74" width="28" height="28" fill="#152E35" />
              <rect x="12" y="78" width="20" height="20" fill="#FFFFFF" />
              <rect x="16" y="82" width="12" height="12" fill="#152E35" />

              <!-- Data Matrix Dots -->
              <rect x="42" y="12" width="6" height="6" fill="#075A46" />
              <rect x="54" y="24" width="8" height="8" fill="#152E35" />
              <rect x="42" y="44" width="24" height="24" rx="4" fill="url(#govPrimaryGrad)" />
              <text x="54" y="60" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">TS</text>
              <rect x="76" y="50" width="8" height="8" fill="#152E35" />
              <rect x="44" y="78" width="10" height="10" fill="#152E35" />
              <rect x="62" y="86" width="8" height="8" fill="#075A46" />
            </g>

            <!-- Technical Hash Meta -->
            <g transform="translate(126, 30)">
              <text x="0" y="14" font-size="10.5" font-weight="700" fill="#075A46">Block #1842 verified</text>
              <text x="0" y="32" font-size="10" fill="#52666D">Timestamp: 14 Oct 2026, 14:32 IST</text>
              <text x="0" y="48" font-size="10" fill="#52666D">Algorithm: SHA-256 Merkle</text>
              <text x="0" y="70" font-size="9" fill="#075A46" class="mono">Hash: 0x7c49...a420</text>
              <text x="0" y="86" font-size="9" fill="#52666D" class="mono">Root: 0x19a0...33bd</text>
            </g>

            <rect x="0" y="160" width="344" height="64" rx="6" fill="#E8F2EE" stroke="#A7F3D0" />
            <text x="12" y="182" font-size="10.5" font-weight="700" fill="#075A46">Public evidence guarantee</text>
            <text x="12" y="200" font-size="9.5" fill="#075A46">Scan this QR code with any smartphone to open the live NIC validator ledger.</text>
          </g>
        </g>
      </g>

      <!-- Download Button -->
      <g transform="translate(36, 590)">
        <rect width="1008" height="48" rx="8" fill="url(#govPrimaryGrad)" />
        <text x="504" y="30" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">Download receipt (PDF)</text>
      </g>
    </g>
  </g>
</svg>`;
}
