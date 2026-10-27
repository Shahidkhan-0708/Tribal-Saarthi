// =============================================================
// USWDS 3.0 Officer Portal Mockups (Screens 13 - 19)
// Full Self-Contained Generators
// =============================================================

import {
  I,
  makeDefs,
  renderUsaBanner,
  renderGovHeader,
  renderGovSidebar,
  renderDonutChartComponent,
  renderStepperPipelineComponent,
  renderMerkleChainComponent
} from './uswds_svg_library.mjs';

// -------------------------------------------------------------
// SCREEN 13: Officer Review Queue
// -------------------------------------------------------------
export function make13OfficerReviewQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('queue', 'officer')}
  ${renderGovSidebar('queue', 'officer')}

  <g transform="translate(268, 126)">
    <!-- Top Hero KPI & Caseload Donut -->
    <g>
      <rect width="1144" height="150" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <rect width="1144" height="4" rx="2" fill="url(#govPrimaryGrad)" />

      <!-- Left KPI Stats -->
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-size="16" font-weight="700" fill="#152E35">Applications to review · Latehar</text>
        <text x="0" y="34" font-size="11.5" fill="#52666D">Supervising Officer: <tspan font-weight="700" fill="#075A46">Dr. K. Soren, DWO Latehar</tspan> · Review target: 48 hours</text>

        <g transform="translate(0, 52)">
          <!-- Stat 1 -->
          <g transform="translate(0, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#52666D">Active caseload</text>
            <text x="0" y="38" font-size="26" font-weight="700" fill="#152E35" class="mono">145</text>
            <text x="0" y="54" font-size="10.5" fill="#075A46" font-weight="600">84 Verified / Approved</text>
          </g>

          <!-- Stat 2 -->
          <g transform="translate(180, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#8A4F13">SLA at risk (&lt;24h)</text>
            <text x="0" y="38" font-size="26" font-weight="700" fill="#8A4F13" class="mono">12</text>
            <text x="0" y="54" font-size="10.5" fill="#8A4F13" font-weight="600">Expedited Action Needed</text>
          </g>

          <!-- Stat 3 -->
          <g transform="translate(370, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#DC2626">Discrepancies</text>
            <text x="0" y="38" font-size="26" font-weight="700" fill="#DC2626" class="mono">14</text>
            <text x="0" y="54" font-size="10.5" fill="#DC2626" font-weight="600">Notice Dispatched</text>
          </g>

          <!-- Stat 4 -->
          <g transform="translate(540, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#075A46">Sanction pipeline</text>
            <text x="0" y="38" font-size="26" font-weight="700" fill="#075A46" class="mono">₹1.92 Cr</text>
            <text x="0" y="54" font-size="10.5" fill="#52666D">PFMS Ready</text>
          </g>
        </g>
      </g>

      <!-- Right Donut: Caseload Distribution -->
      <g transform="translate(730, 16)">
        <rect width="390" height="118" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
        <g transform="translate(10, 10)">
          ${renderDonutChartComponent({
            cx: 48,
            cy: 48,
            rOut: 42,
            rIn: 26,
            segments: [
              { label: 'Approved', percent: 58, color: '#075A46', amount: '84' },
              { label: 'Under Review', percent: 24, color: '#225F81', amount: '35' },
              { label: 'Discrepancy', percent: 10, color: '#8A4F13', amount: '14' },
              { label: 'SLA Escalated', percent: 8, color: '#DC2626', amount: '12' }
            ],
            centerValue: '145',
            centerSub: 'Cases',
            legendX: 106,
            legendY: 10,
            legendWidth: 260,
            itemHeight: 22
          })}
        </g>
      </g>
    </g>

    <!-- Filter Bar -->
    <g transform="translate(0, 164)">
      <rect width="1144" height="48" rx="10" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(16, 8)">
        <!-- Search -->
        <rect x="0" y="0" width="300" height="32" rx="6" fill="#EEF3F3" stroke="#CBD5E1" />
        <text x="12" y="21" font-size="11.5" fill="#52666D">Search by Scholar Name, Roll # or App ID...</text>

        <!-- Filters -->
        <g transform="translate(320, 0)">
          <rect x="0" y="0" width="140" height="32" rx="6" fill="#FEF3C7" stroke="#FDE68A" />
          <text x="70" y="21" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">★ PVTG Priority (18)</text>

          <rect x="150" y="0" width="130" height="32" rx="6" fill="#EEF3F3" />
          <text x="215" y="21" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">SLA Risk &lt;24h (12)</text>

          <rect x="290" y="0" width="150" height="32" rx="6" fill="#EEF3F3" />
          <text x="365" y="21" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">BIT Mesra (42)</text>

          <rect x="450" y="0" width="140" height="32" rx="6" fill="#EEF3F3" />
          <text x="520" y="21" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">Ranchi Univ (68)</text>
        </g>

        <!-- Export -->
        <rect x="990" y="0" width="120" height="32" rx="6" fill="#075A46" />
        <text x="1050" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Export CSV ⤓</text>
      </g>
    </g>

    <!-- Caseload Table -->
    <g transform="translate(0, 224)">
      <rect width="1144" height="570" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 20)">
        <!-- Table Header -->
        <rect width="1096" height="38" rx="6" fill="#EEF3F3" />
        <text x="16" y="24" font-size="10.5" font-weight="700" fill="#52666D">Appl ID &amp; scholar</text>
        <text x="240" y="24" font-size="10.5" font-weight="700" fill="#52666D">Community &amp; category</text>
        <text x="440" y="24" font-size="10.5" font-weight="700" fill="#52666D">Institution &amp; course</text>
        <text x="660" y="24" font-size="10.5" font-weight="700" fill="#52666D">Est. grant</text>
        <text x="770" y="24" font-size="10.5" font-weight="700" fill="#52666D">SLA timer</text>
        <text x="890" y="24" font-size="10.5" font-weight="700" fill="#52666D">DigiLocker</text>
        <text x="1010" y="24" font-size="10.5" font-weight="700" fill="#52666D">Action</text>

        <!-- Row 1: Mohan Birhor (PVTG - Focus Case) -->
        <g transform="translate(0, 48)">
          <rect width="1096" height="74" rx="8" fill="#FEF3C7" opacity="0.25" />
          <line x1="0" y1="74" x2="1096" y2="74" stroke="#FDE68A" />
          
          <text x="16" y="26" font-size="13" font-weight="700" fill="#152E35">Mohan Birhor</text>
          <text x="16" y="44" font-size="11" fill="#52666D" class="mono">#TS-2026-88194</text>
          <rect x="16" y="50" width="84" height="18" rx="9" fill="#FEF3C7" />
          <text x="58" y="62" font-size="8" font-weight="700" fill="#92400E" text-anchor="middle">PVTG tier-1</text>

          <text x="240" y="26" font-size="12" font-weight="700" fill="#152E35">Birhor Scheduled Tribe</text>
          <text x="240" y="44" font-size="11" fill="#52666D">Mahuadanr, Latehar</text>

          <text x="440" y="26" font-size="12" font-weight="700" fill="#152E35">BIT Mesra, Ranchi</text>
          <text x="440" y="44" font-size="11" fill="#52666D">B.Tech Computer Science (2nd Yr)</text>

          <text x="660" y="32" font-size="15" font-weight="700" fill="#075A46" class="mono">₹132,000</text>
          <text x="660" y="48" font-size="10" fill="#52666D">100% Grant</text>

          <rect x="770" y="18" width="94" height="24" rx="8" fill="#FEF3C7" />
          <text x="817" y="34" font-size="9" font-weight="700" fill="#92400E" text-anchor="middle">⏱ 24H left</text>

          <rect x="890" y="18" width="90" height="24" rx="8" fill="#E8F2EE" />
          <text x="935" y="34" font-size="9" font-weight="700" fill="#075A46" text-anchor="middle">4/4 Verified ✓</text>

          <rect x="1000" y="14" width="86" height="34" rx="6" fill="url(#govPrimaryGrad)" />
          <text x="1043" y="35" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Inspect Case</text>
        </g>

        <!-- Row 2: Anita Oraon -->
        <g transform="translate(0, 126)">
          <line x1="0" y1="74" x2="1096" y2="74" stroke="#EEF3F3" />
          
          <text x="16" y="26" font-size="13" font-weight="700" fill="#152E35">Anita Oraon</text>
          <text x="16" y="44" font-size="11" fill="#52666D" class="mono">#TS-2026-88201</text>

          <text x="240" y="26" font-size="12" font-weight="700" fill="#152E35">Oraon Scheduled Tribe</text>
          <text x="240" y="44" font-size="11" fill="#52666D">Mandar, Ranchi</text>

          <text x="440" y="26" font-size="12" font-weight="700" fill="#152E35">Ranchi University</text>
          <text x="440" y="44" font-size="11" fill="#52666D">M.Sc Botany (1st Yr)</text>

          <text x="660" y="32" font-size="15" font-weight="700" fill="#152E35" class="mono">₹68,000</text>
          <text x="660" y="48" font-size="10" fill="#52666D">Tuition + Maint</text>

          <rect x="770" y="18" width="94" height="24" rx="8" fill="#EFF6FF" />
          <text x="817" y="34" font-size="9" font-weight="700" fill="#225F81" text-anchor="middle">⏱ 72H left</text>

          <rect x="890" y="18" width="90" height="24" rx="8" fill="#E8F2EE" />
          <text x="935" y="34" font-size="9" font-weight="700" fill="#075A46" text-anchor="middle">3/3 Verified ✓</text>

          <rect x="1000" y="14" width="86" height="34" rx="6" fill="#EEF3F3" />
          <text x="1043" y="35" font-size="11" font-weight="700" fill="#075A46" text-anchor="middle">Review</text>
        </g>

        <!-- Row 3: Ramesh Munda (Discrepancy) -->
        <g transform="translate(0, 204)">
          <line x1="0" y1="74" x2="1096" y2="74" stroke="#EEF3F3" />
          
          <text x="16" y="26" font-size="13" font-weight="700" fill="#152E35">Ramesh Munda</text>
          <text x="16" y="44" font-size="11" fill="#52666D" class="mono">#TS-2026-88210</text>

          <text x="240" y="26" font-size="12" font-weight="700" fill="#152E35">Munda Scheduled Tribe</text>
          <text x="240" y="44" font-size="11" fill="#52666D">Murhu, Khunti</text>

          <text x="440" y="26" font-size="12" font-weight="700" fill="#152E35">St. Xavier&apos;s College, Ranchi</text>
          <text x="440" y="44" font-size="11" fill="#52666D">B.Com Honors (3rd Yr)</text>

          <text x="660" y="32" font-size="15" font-weight="700" fill="#152E35" class="mono">₹45,000</text>
          <text x="660" y="48" font-size="10" fill="#52666D">Tuition Only</text>

          <rect x="770" y="18" width="94" height="24" rx="8" fill="#FEE2E2" />
          <text x="817" y="34" font-size="9" font-weight="700" fill="#DC2626" text-anchor="middle">⚠ 14H SLA risk</text>

          <rect x="890" y="18" width="90" height="24" rx="8" fill="#FEF3C7" />
          <text x="935" y="34" font-size="9" font-weight="700" fill="#8A4F13" text-anchor="middle">Doc mismatch</text>

          <rect x="1000" y="14" width="86" height="34" rx="6" fill="#FEF3C7" stroke="#FDE68A" />
          <text x="1043" y="35" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">Notice Req</text>
        </g>

        <!-- Row 4: Sunita Kharia -->
        <g transform="translate(0, 282)">
          <line x1="0" y1="74" x2="1096" y2="74" stroke="#EEF3F3" />
          
          <text x="16" y="26" font-size="13" font-weight="700" fill="#152E35">Sunita Kharia</text>
          <text x="16" y="44" font-size="11" fill="#52666D" class="mono">#TS-2026-88215</text>
          <rect x="16" y="50" width="84" height="18" rx="9" fill="#FEF3C7" />
          <text x="58" y="62" font-size="8" font-weight="700" fill="#92400E" text-anchor="middle">PVTG tier-1</text>

          <text x="240" y="26" font-size="12" font-weight="700" fill="#152E35">Kharia Scheduled Tribe</text>
          <text x="240" y="44" font-size="11" fill="#52666D">Simdega District</text>

          <text x="440" y="26" font-size="12" font-weight="700" fill="#152E35">Central University Jharkhand</text>
          <text x="440" y="44" font-size="11" fill="#52666D">M.A. Tribal Folklore (1st Yr)</text>

          <text x="660" y="32" font-size="15" font-weight="700" fill="#075A46" class="mono">₹84,000</text>
          <text x="660" y="48" font-size="10" fill="#52666D">100% Grant</text>

          <rect x="770" y="18" width="94" height="24" rx="8" fill="#EFF6FF" />
          <text x="817" y="34" font-size="9" font-weight="700" fill="#225F81" text-anchor="middle">⏱ 48H left</text>

          <rect x="890" y="18" width="90" height="24" rx="8" fill="#E8F2EE" />
          <text x="935" y="34" font-size="9" font-weight="700" fill="#075A46" text-anchor="middle">4/4 Verified ✓</text>

          <rect x="1000" y="14" width="86" height="34" rx="6" fill="#EEF3F3" />
          <text x="1043" y="35" font-size="11" font-weight="700" fill="#075A46" text-anchor="middle">Review</text>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 14: Officer Case Detail Inspection
// -------------------------------------------------------------
export function make14OfficerCaseDetailInspection() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('queue', 'officer')}
  ${renderGovSidebar('queue', 'officer')}

  <g transform="translate(268, 126)">
    <!-- Top Action Banner -->
    <g>
      <rect width="1144" height="88" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 18)">
        <circle cx="24" cy="24" r="24" fill="url(#govPrimaryGrad)" />
        <text x="24" y="30" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">MB</text>

        <text x="64" y="20" font-size="16" font-weight="700" fill="#152E35">Review Mohan Birhor’s application</text>
        <text x="64" y="38" font-size="11.5" fill="#52666D">Case ID: <tspan class="mono" font-weight="700">#TS-2026-88194</tspan> · BIT Mesra · Birhor (PVTG Tier-1) · SLA Clock: <tspan font-weight="700" fill="#8A4F13">24h Remaining</tspan></text>

        <!-- Quick Action Buttons -->
        <rect x="760" y="8" width="160" height="36" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
        <text x="840" y="30" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">Issue Notice ⚠</text>

        <rect x="936" y="8" width="180" height="36" rx="8" fill="url(#govPrimaryGrad)" />
        <text x="1026" y="30" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Approve with DSC ✓</text>
      </g>
    </g>

    <!-- Main Split Columns -->
    <g transform="translate(0, 108)">
      <!-- Left Column: Cross-Verification Workbench -->
      <g>
        <rect width="680" height="690" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">DigiLocker vs Stated Data Cross-Examination</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Automated verification against Government of Jharkhand State Repositories</text>
          <line x1="0" y1="44" x2="632" y2="44" stroke="#EEF3F3" />

          <!-- Field 1: ST Community -->
          <g transform="translate(0, 56)">
            <rect width="632" height="106" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(16, 14)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">1. Tribal community &amp; PVTG classification</text>
              <rect x="470" y="0" width="130" height="22" rx="11" fill="#E8F2EE" />
              <text x="535" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">Perfect match ✓</text>

              <text x="0" y="38" font-size="11" fill="#52666D">Candidate Claim: <tspan font-weight="700" fill="#152E35">Birhor Scheduled Tribe (PVTG Tier-1)</tspan></text>
              <text x="0" y="56" font-size="11" fill="#075A46">DigiLocker Record: <tspan font-weight="700">Birhor · Cert #JH/ST/2023/88194 (SDO Mahuadanr)</tspan></text>
              <text x="0" y="74" font-size="10" fill="#52666D" class="mono">SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4...</text>
            </g>
          </g>

          <!-- Field 2: Annual Income -->
          <g transform="translate(0, 174)">
            <rect width="632" height="106" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(16, 14)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">2. Annual family gross income</text>
              <rect x="470" y="0" width="130" height="22" rx="11" fill="#E8F2EE" />
              <text x="535" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">Statutory pass ✓</text>

              <text x="0" y="38" font-size="11" fill="#52666D">Candidate Claim: <tspan font-weight="700" fill="#152E35">₹48,000 / year</tspan></text>
              <text x="0" y="56" font-size="11" fill="#075A46">DigiLocker Record: <tspan font-weight="700">₹48,000 (Revenue Circle Latehar · Valid till Mar 2027)</tspan></text>
              <text x="0" y="74" font-size="10" fill="#52666D">Ceiling Limit: ₹2,50,000/yr (Candidate qualifies for 100% full grant coverage)</text>
            </g>
          </g>

          <!-- Field 3: Academic APAAR -->
          <g transform="translate(0, 292)">
            <rect width="632" height="106" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(16, 14)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">3. Academic enrollment &amp; standing</text>
              <rect x="470" y="0" width="130" height="22" rx="11" fill="#E8F2EE" />
              <text x="535" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">Nkn verified ✓</text>

              <text x="0" y="38" font-size="11" fill="#52666D">College Desk Attestation: <tspan font-weight="700" fill="#152E35">BIT Mesra · Roll #2024-CSE-104 (B.Tech CSE)</tspan></text>
              <text x="0" y="56" font-size="11" fill="#075A46">APAAR ID: <tspan font-weight="700" class="mono">9482-1049-5821</tspan> · Current CGPA: 8.84 · Clean Standing</text>
              <text x="0" y="74" font-size="10" fill="#52666D">Attested by: Dr. K. Soren (BIT Mesra Nodal ST Desk on 14 Oct 2026)</text>
            </g>
          </g>

          <!-- Field 4: Bank Account & NPCI -->
          <g transform="translate(0, 410)">
            <rect width="632" height="106" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(16, 14)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">4. Aadhaar-seeded PFMS DBT bank account</text>
              <rect x="470" y="0" width="130" height="22" rx="11" fill="#E8F2EE" />
              <text x="535" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">NPCI active ✓</text>

              <text x="0" y="38" font-size="11" fill="#52666D">Target Account: <tspan font-weight="700" fill="#152E35">Bank of India · ••••••••9012 (Mesra Branch)</tspan></text>
              <text x="0" y="56" font-size="11" fill="#075A46">NPCI Mapper Status: <tspan font-weight="700">Aadhaar Linked &amp; Active for Direct Benefit Transfer</tspan></text>
              <text x="0" y="74" font-size="10" fill="#52666D">Zero-Rejection Guarantee: Account verified via penny-drop validation</text>
            </g>
          </g>

          <!-- Stepper Pipeline -->
          <g transform="translate(0, 540)">
            <rect width="632" height="110" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(12, 16)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#075A46">Application multi-tier concurrence pipeline</text>
              <g transform="translate(0, 24)">
                ${renderStepperPipelineComponent({
                  x: 0,
                  y: 0,
                  width: 608,
                  steps: [
                    { title: 'College Desk', sub: 'Dr. K. Soren', status: 'done', badge: 'PASSED' },
                    { title: 'District Concurrence', sub: 'Latehar Office', status: 'active', badge: 'IN REVIEW' },
                    { title: 'Central Sanction', sub: 'MoTA Treasury', status: 'upcoming', badge: 'PENDING' }
                  ]
                })}
              </g>
            </g>
          </g>
        </g>
      </g>

      <!-- Right Column: Gauge & Grant Breakdown -->
      <g transform="translate(704, 0)">
        <!-- Eligibility Gauge Card -->
        <g>
          <rect width="440" height="330" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Algorithmic Eligibility Score</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Confidence evaluation against MoTA regulations</text>
            <line x1="0" y1="44" x2="392" y2="44" stroke="#EEF3F3" />

            <g transform="translate(0, 56)">
              ${renderDonutChartComponent({
                cx: 60,
                cy: 56,
                rOut: 48,
                rIn: 32,
                segments: [
                  { label: 'Identity Confidence', percent: 25, color: '#075A46', amount: '100%' },
                  { label: 'Income Criteria', percent: 25, color: '#075A46', amount: '100%' },
                  { label: 'Academic Standing', percent: 24, color: '#075A46', amount: '96%' },
                  { label: 'Domicile Validation', percent: 24, color: '#34D399', amount: '98%' }
                ],
                centerValue: '98%',
                centerSub: 'Score',
                legendX: 130,
                legendY: 16,
                legendWidth: 260,
                itemHeight: 24
              })}
            </g>

            <g transform="translate(0, 180)">
              <rect width="392" height="110" rx="10" fill="#E8F2EE" stroke="#A7F3D0" />
              <g transform="translate(14, 14)">
                <text x="0" y="14" font-size="11.5" font-weight="700" fill="#075A46">Document checks complete</text>
                <text x="0" y="38" font-size="12" fill="#075A46"><tspan x="0">All four document checks are complete.</tspan><tspan x="0" dy="20">Review the evidence before approving.</tspan></text>
              </g>
            </g>
          </g>
        </g>

        <!-- Grant Breakdown Donut Card -->
        <g transform="translate(0, 350)">
          <rect width="440" height="340" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Sanction Expenditure Allocation</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Full statutory grant calculation for FY 2026-27</text>
            <line x1="0" y1="44" x2="392" y2="44" stroke="#EEF3F3" />

            <g transform="translate(0, 56)">
              ${renderDonutChartComponent({
                cx: 60,
                cy: 56,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'Tuition Fees (BIT Mesra)', percent: 74, color: '#075A46', amount: '₹98,000' },
                  { label: 'Living Maintenance', percent: 18, color: '#225F81', amount: '₹24,000' },
                  { label: 'PVTG Book Allowance', percent: 8, color: '#8A4F13', amount: '₹10,000' }
                ],
                centerValue: '₹132K',
                centerSub: 'Sanction',
                legendX: 130,
                legendY: 18,
                legendWidth: 260,
                itemHeight: 26
              })}
            </g>

            <!-- Final Decision CTAs -->
            <g transform="translate(0, 194)">
              <rect x="0" y="0" width="392" height="44" rx="8" fill="url(#govPrimaryGrad)" />
              <text x="196" y="27" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Digitally Sign &amp; Endorse with DSC</text>

              <rect x="0" y="52" width="190" height="36" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
              <text x="95" y="75" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">Issue Notice (Deficiency)</text>

              <rect x="202" y="52" width="190" height="36" rx="8" fill="#EEF3F3" />
              <text x="297" y="75" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">Escalate to Collector</text>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 15: Deficiency Notice Modal
// -------------------------------------------------------------
export function make15DeficiencyNoticeModal() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('queue', 'officer')}
  ${renderGovSidebar('queue', 'officer')}

  <!-- Background Dim Overlay -->
  <rect x="0" y="0" width="1440" height="960" fill="#152E35" opacity="0.6" />

  <!-- Center Modal Box (USWDS Single Column Complex Form) -->
  <g transform="translate(280, 100)" filter="url(#modalShadow)">
    <rect width="880" height="760" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
    <rect width="880" height="6" rx="3" fill="#8A4F13" />

    <!-- Modal Header -->
    <g transform="translate(36, 32)">
      <circle cx="20" cy="20" r="20" fill="#FEF3C7" />
      ${I.alert(10, 10, '#8A4F13', 20)}
      <text x="52" y="18" font-size="18" font-weight="700" fill="#152E35">Request a document correction</text>
      <text x="52" y="36" font-size="12" fill="#8A4F13">Application: <tspan class="mono" font-weight="700">#TS-2026-88194</tspan> (Mohan Birhor)</text>

      <line x1="0" y1="52" x2="808" y2="52" stroke="#CFDADD" />
    </g>

    <!-- Modal Body: Single-Column Form Structure -->
    <g transform="translate(36, 108)">
      <!-- Section 1: Discrepancy Reasons -->
      <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">1. Which document needs a correction?</text>
      <text x="0" y="30" font-size="11" fill="#52666D">Choose a document, then explain what the scholar needs to change.</text>

      <g transform="translate(0, 44)">
        <!-- Option 1 (Selected) -->
        <rect x="0" y="0" width="808" height="42" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
        <rect x="14" y="12" width="18" height="18" rx="4" fill="#8A4F13" />
        <text x="23" y="25" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓</text>
        <text x="44" y="26" font-size="12" font-weight="700" fill="#92400E">Income Certificate Expiry / Renewal Required (Within 30 days of sanction date)</text>

        <!-- Option 2 -->
        <rect x="0" y="50" width="808" height="42" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
        <rect x="14" y="62" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
        <text x="44" y="76" font-size="12" font-weight="600" fill="#152E35">Aadhaar Name / DOB Discrepancy with Senior Secondary Marksheet</text>

        <!-- Option 3 (Selected) -->
        <rect x="0" y="100" width="808" height="42" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
        <rect x="14" y="112" width="18" height="18" rx="4" fill="#8A4F13" />
        <text x="23" y="125" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓</text>
        <text x="44" y="126" font-size="12" font-weight="700" fill="#92400E">Academic Fee Receipt Breakup Missing Hostel / Maintenance Breakdown</text>
      </g>

      <!-- Section 2: Cure Window & SLA Clock -->
      <g transform="translate(0, 206)">
        <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">2. When is the correction due?</text>
        <g transform="translate(0, 26)">
          <rect x="0" y="0" width="240" height="42" rx="8" fill="#E8F2EE" stroke="#A7F3D0" />
          <text x="14" y="26" font-size="12" font-weight="700" fill="#075A46">● 7 Working Days (Standard)</text>

          <rect x="256" y="0" width="240" height="42" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
          <text x="270" y="26" font-size="12" font-weight="600" fill="#52666D">14 Working Days (Remote Belt)</text>

          <rect x="512" y="0" width="296" height="42" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
          <text x="526" y="26" font-size="12" font-weight="600" fill="#52666D">21 Days (PVTG Special Dispensation)</text>
        </g>
      </g>

      <!-- Section 3: Layman Plain Language Instructions -->
      <g transform="translate(0, 298)">
        <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">3. Explain what needs to change</text>
        <rect x="0" y="26" width="808" height="110" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
        <text x="16" y="52" font-size="12" fill="#152E35" leading="1.4">Dear Mohan Birhor,</text>
        <text x="16" y="74" font-size="13" fill="#152E35"><tspan x="16">Your fee receipt shows ₹98,000 but does not include hostel charges.</tspan><tspan x="16" dy="22">Upload a hostel receipt, or ask your warden to confirm your residence.</tspan></text>
      </g>

      <!-- Section 4: Resolution Stepper Pipeline -->
      <g transform="translate(0, 460)">
        <text x="0" y="14" font-size="12" font-weight="700" fill="#075A46">Cure &amp; resolution workflow pipeline</text>
        <g transform="translate(0, 24)">
          <rect width="808" height="96" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
          <g transform="translate(16, 16)">
            ${renderStepperPipelineComponent({
              x: 0,
              y: 0,
              width: 776,
              steps: [
                { title: 'Notice Transmitted', sub: 'SMS + App Audio', status: 'done', badge: 'DISPATCHED' },
                { title: 'Scholar Cures', sub: '7-Day Window', status: 'active', badge: 'AWAITING' },
                { title: 'Auto-Recheck', sub: 'DigiLocker Webhook', status: 'upcoming', badge: 'ALGO PASS' },
                { title: 'Sanction Release', sub: 'PFMS DBT', status: 'upcoming', badge: 'CREDIT' }
              ]
            })}
          </g>
        </g>
      </g>
    </g>

    <!-- Modal Footer Actions -->
    <g transform="translate(36, 686)">
      <line x1="0" y1="0" x2="808" y2="0" stroke="#CFDADD" />
      <g transform="translate(0, 16)">
        <rect x="0" y="0" width="180" height="44" rx="8" fill="#EEF3F3" />
        <text x="90" y="27" font-size="12" font-weight="700" fill="#52666D" text-anchor="middle">Cancel / Return</text>

        <rect x="528" y="0" width="280" height="44" rx="8" fill="#8A4F13" />
        <text x="668" y="27" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Transmit Statutory Notice with DSC</text>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 16: Digital Sanction Signing
// -------------------------------------------------------------
export function make16DigitalSanctionSigning() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('queue', 'officer')}
  ${renderGovSidebar('queue', 'officer')}

  <g transform="translate(268, 126)">
    <!-- Top Hero Header -->
    <g>
      <rect width="1144" height="92" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 20)">
        <circle cx="26" cy="26" r="26" fill="#E8F2EE" />
        ${I.key(14, 14, '#075A46', 24)}
        <text x="64" y="22" font-size="16" font-weight="700" fill="#152E35">Statutory Digital Sanction Signing Desk</text>
        <text x="64" y="42" font-size="12" fill="#075A46" font-weight="600">Information Technology Act 2000 Section 3 Digital Signature Certificate (DSC) Execution</text>

        <rect x="944" y="10" width="160" height="36" rx="8" fill="#EEF3F3" />
        <text x="1024" y="32" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">Download Draft PDF ⤓</text>
      </g>
    </g>

    <!-- Main View -->
    <g transform="translate(0, 114)">
      <!-- Left Column: Sanction Order Preview & Breakdown -->
      <g>
        <rect width="680" height="670" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 22)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Sanction Order Manifest</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Order Ref: <tspan class="mono" font-weight="700">MOTA/SANCT/2026/JH-88194</tspan> · Latehar District Treasury</text>
          <line x1="0" y1="44" x2="632" y2="44" stroke="#EEF3F3" />

          <!-- Grant Breakdown Donut -->
          <g transform="translate(0, 56)">
            <rect width="632" height="180" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(16, 16)">
              <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">Expenditure commitment (annual scholarship)</text>
              <g transform="translate(0, 24)">
                ${renderDonutChartComponent({
                  cx: 64,
                  cy: 50,
                  rOut: 44,
                  rIn: 28,
                  segments: [
                    { label: 'BIT Mesra Tuition Fee', percent: 74, color: '#075A46', amount: '₹98,000' },
                    { label: 'Monthly Maintenance &amp; Mess', percent: 18, color: '#225F81', amount: '₹24,000' },
                    { label: 'PVTG Equipment / Book Grant', percent: 8, color: '#8A4F13', amount: '₹10,000' }
                  ],
                  centerValue: '₹132K',
                  centerSub: 'Total',
                  legendX: 136,
                  legendY: 10,
                  legendWidth: 440,
                  itemHeight: 26
                })}
              </g>
            </g>
          </g>

          <!-- Beneficiary Details -->
          <g transform="translate(0, 256)">
            <text x="0" y="14" font-size="12" font-weight="700" fill="#52666D">Beneficiary disbursement route</text>
            <rect x="0" y="24" width="632" height="140" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(16, 16)">
              <text x="0" y="14" font-size="13" font-weight="700" fill="#152E35">Mohan Birhor (Son of Somra Birhor)</text>
              <text x="0" y="32" font-size="11" fill="#52666D">Village Belta, Block Mahuadanr, District Latehar, Jharkhand · PVTG Tier-1</text>

              <line x1="0" y1="46" x2="600" y2="46" stroke="#CFDADD" />
              <text x="0" y="64" font-size="11.5" font-weight="700" fill="#075A46">Target DBT Account: Bank of India · A/C ••••••••9012 (IFSC: BKID0004910)</text>
              <text x="0" y="82" font-size="10.5" fill="#52666D">Aadhaar Vault Ref: •••• •••• 4921 · NPCI Mandate ID: <tspan class="mono">NPCI-MOTA-2026-991204</tspan></text>
              <text x="0" y="100" font-size="10.5" fill="#075A46" font-weight="600">Zero Intermediary Deduction: Direct central treasury release to scholar account.</text>
            </g>
          </g>

          <!-- PFMS Direct DBT Stepper -->
          <g transform="translate(0, 440)">
            <rect width="632" height="110" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(14, 16)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#075A46">PFMS treasury direct-benefit-transfer pipeline</text>
              <g transform="translate(0, 24)">
                ${renderStepperPipelineComponent({
                  x: 0,
                  y: 0,
                  width: 604,
                  steps: [
                    { title: 'DWO Concurrence', sub: 'Dr. K. Soren', status: 'done', badge: 'SIGNED' },
                    { title: 'DSC Token Sign', sub: 'Hardware FIPS', status: 'active', badge: 'PIN AUTH' },
                    { title: 'PFMS XML Push', sub: 'Direct SFTP', status: 'upcoming', badge: 'TREASURY' },
                    { title: 'RBI NEFT/DBT', sub: 'Bank of India', status: 'upcoming', badge: 'CREDIT' }
                  ]
                })}
              </g>
            </g>
          </g>
        </g>
      </g>

      <!-- Right Column: Hardware DSC / e-Sign Authentication -->
      <g transform="translate(704, 0)">
        <g>
          <rect width="440" height="670" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 22)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Confirm your approval</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Illustrative signing step · Not a live certificate</text>
            <line x1="0" y1="44" x2="392" y2="44" stroke="#EEF3F3" />

            <!-- USB Token State -->
            <g transform="translate(0, 56)">
              <rect width="392" height="110" rx="10" fill="#E8F2EE" stroke="#A7F3D0" />
              <g transform="translate(16, 16)">
                <text x="0" y="14" font-size="12" font-weight="700" fill="#075A46">Hardware crypto token detected</text>
                <text x="0" y="34" font-size="11" fill="#075A46">Token: <tspan font-weight="700">eMudhra Class 3 DSC (Officer Token)</tspan></text>
                <text x="0" y="52" font-size="10.5" fill="#52666D">Owner: Dr. K. Soren (District Welfare Officer Latehar)</text>
                <text x="0" y="70" font-size="10" fill="#52666D" class="mono">Serial: 0x7F82A091 · Valid till: 14 Dec 2027</text>
              </g>
            </g>

            <!-- PIN Challenge Form -->
            <g transform="translate(0, 186)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">Enter 6-digit token security pin</text>
              <rect x="0" y="24" width="392" height="44" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
              <text x="16" y="52" font-size="20" font-weight="700" fill="#152E35" class="mono">••••••</text>

              <!-- Statutory Disclaimer Checkbox -->
              <g transform="translate(0, 84)">
                <rect x="0" y="0" width="20" height="20" rx="4" fill="#075A46" />
                <text x="10" y="15" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓</text>
                <text x="30" y="14" font-size="12" fill="#152E35"><tspan x="30">I have checked the evidence and confirmed</tspan><tspan x="30" dy="20">that this application meets the requirements.</tspan></text>
              </g>

              <!-- Action Buttons -->
              <rect x="0" y="160" width="392" height="48" rx="8" fill="url(#govPrimaryGrad)" />
              <text x="196" y="190" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Record approval</text>

              <rect x="0" y="220" width="392" height="40" rx="8" fill="#EEF3F3" />
              <text x="196" y="245" font-size="11.5" font-weight="700" fill="#52666D" text-anchor="middle">Save draft</text>
            </g>

            <!-- Audit Trail Seal -->
            <g transform="translate(0, 480)">
              <rect width="392" height="120" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(14, 14)">
                <text x="0" y="14" font-size="10.5" font-weight="700" fill="#152E35">Immutable blockchain hash</text>
                <text x="0" y="34" font-size="12" fill="#52666D"><tspan x="0">Your decision is recorded in the audit history.</tspan><tspan x="0" dy="20">Signing and payment are simulated here.</tspan></text>
                <text x="0" y="56" font-size="9.5" fill="#075A46" class="mono">Prev Hash: 0x3f11e9a40821049281a049182904812a...</text>
                <text x="0" y="74" font-size="9.5" fill="#075A46" class="mono">Signer Cert: CN=Dr. K. Soren, O=MoTA, C=IN</text>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 17: Sabotage Switchboard
// -------------------------------------------------------------
export function make17SabotageSwitchboard() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('sabotage', 'officer')}
  ${renderGovSidebar('sabotage', 'officer')}

  <g transform="translate(268, 126)">
    <!-- Top Alert Banner -->
    <g>
      <rect width="1144" height="88" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 18)">
        <circle cx="24" cy="24" r="24" fill="#FEF3C7" />
        ${I.alert(14, 14, '#8A4F13', 20)}
        <text x="64" y="20" font-size="16" font-weight="700" fill="#152E35">Tribal Belt Chaos Engineering &amp; Fault Injection Switchboard</text>
        <text x="64" y="38" font-size="11.5" fill="#8A4F13">Non-Production Sandbox · Validates graceful offline degradation during remote network blackouts</text>

        <rect x="944" y="8" width="160" height="36" rx="8" fill="#DC2626" />
        <text x="1024" y="30" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Emergency Reset ↻</text>
      </g>
    </g>

    <!-- Main Columns -->
    <g transform="translate(0, 108)">
      <!-- Left: Fault Injector Toggles -->
      <g>
        <rect width="660" height="690" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Chaos Fault Injection Matrix</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Simulate upstream database latency, timeout and satellite packet drops</text>
          <line x1="0" y1="44" x2="612" y2="44" stroke="#EEF3F3" />

          <!-- Switch 1: UIDAI Gateway -->
          <g transform="translate(0, 56)">
            <rect width="612" height="96" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
            <g transform="translate(18, 14)">
              <text x="0" y="16" font-size="13.5" font-weight="700" fill="#92400E">1. UIDAI Aadhaar Vault Timeout Simulation</text>
              <text x="0" y="34" font-size="11" fill="#8A4F13">Inject HTTP 504 Gateway Timeout on biometric handshake</text>
              <text x="0" y="52" font-size="10.5" fill="#78350F">Fallback Behavior: Activates cached UID token with deferred sync</text>

              <!-- Toggle Button ON -->
              <rect x="490" y="12" width="76" height="34" rx="17" fill="#8A4F13" />
              <circle cx="548" cy="29" r="13" fill="#FFFFFF" />
              <text x="516" y="33" font-size="10" font-weight="700" fill="#FFFFFF">ON</text>
            </g>
          </g>

          <!-- Switch 2: DigiLocker Intermittent Drop -->
          <g transform="translate(0, 168)">
            <rect width="612" height="96" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
            <g transform="translate(18, 14)">
              <text x="0" y="16" font-size="13.5" font-weight="700" fill="#92400E">2. DigiLocker Satellite Packet Loss (40%)</text>
              <text x="0" y="34" font-size="11" fill="#8A4F13">Simulate 40% connection drop in remote hilly terrain</text>
              <text x="0" y="52" font-size="10.5" fill="#78350F">Fallback Behavior: Local IndexedDB certificate vault serves signed copies</text>

              <rect x="490" y="12" width="76" height="34" rx="17" fill="#8A4F13" />
              <circle cx="548" cy="29" r="13" fill="#FFFFFF" />
              <text x="516" y="33" font-size="10" font-weight="700" fill="#FFFFFF">ON</text>
            </g>
          </g>

          <!-- Switch 3: Remote 2G Fallback -->
          <g transform="translate(0, 280)">
            <rect width="612" height="96" rx="10" fill="#E8F2EE" stroke="#A7F3D0" />
            <g transform="translate(18, 14)">
              <text x="0" y="16" font-size="13.5" font-weight="700" fill="#075A46">3. Force 2G / Zero-Bandwidth Mode</text>
              <text x="0" y="34" font-size="11" fill="#075A46">Throttle throughput to 64 kbps to test low-spec devices</text>
              <text x="0" y="52" font-size="10.5" fill="#075A46">Fallback Behavior: Vector SVGs load under 30KB without external blocking fonts</text>

              <rect x="490" y="12" width="76" height="34" rx="17" fill="#075A46" />
              <circle cx="548" cy="29" r="13" fill="#FFFFFF" />
              <text x="516" y="33" font-size="10" font-weight="700" fill="#FFFFFF">ON</text>
            </g>
          </g>

          <!-- Switch 4: PFMS Circuit Breaker -->
          <g transform="translate(0, 392)">
            <rect width="612" height="96" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(18, 14)">
              <text x="0" y="16" font-size="13.5" font-weight="700" fill="#152E35">4. PFMS Treasury Circuit Breaker</text>
              <text x="0" y="34" font-size="11" fill="#52666D">Trip circuit breaker on treasury server high latency</text>
              <text x="0" y="52" font-size="10.5" fill="#52666D">Fallback Behavior: Queues sanction payload in signed local journal</text>

              <!-- Toggle Button OFF -->
              <rect x="490" y="12" width="76" height="34" rx="17" fill="#CBD5E1" />
              <circle cx="508" cy="29" r="13" fill="#FFFFFF" />
              <text x="532" y="33" font-size="10" font-weight="700" fill="#52666D">OFF</text>
            </g>
          </g>

          <!-- Slider: Chaos Intensity -->
          <g transform="translate(0, 520)">
            <text x="0" y="14" font-size="12" font-weight="700" fill="#52666D">CHAOS LOAD INTENSITY: <tspan font-weight="700" fill="#8A4F13">40% FAILURE RATE</tspan></text>
            <rect x="0" y="26" width="612" height="12" rx="6" fill="#EEF3F3" />
            <rect x="0" y="26" width="245" height="12" rx="6" fill="#8A4F13" />
            <circle cx="245" cy="32" r="12" fill="#FFFFFF" stroke="#8A4F13" stroke-width="3" />
            <text x="0" y="58" font-size="10.5" fill="#52666D">0% (Clean Network)</text>
            <text x="520" y="58" font-size="10.5" fill="#52666D">100% (Full Outage)</text>
          </g>
        </g>
      </g>

      <!-- Right: Topology Flow & Donut Health -->
      <g transform="translate(684, 0)">
        <!-- Resilience Score Donut -->
        <g>
          <rect width="460" height="330" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">System Resilience Health</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Real-time traffic route under 40% chaos injection</text>
            <line x1="0" y1="44" x2="412" y2="44" stroke="#EEF3F3" />

            <g transform="translate(0, 56)">
              ${renderDonutChartComponent({
                cx: 60,
                cy: 56,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'Healthy Direct Route', percent: 60, color: '#075A46', amount: '60%' },
                  { label: 'Local IndexedDB Cache', percent: 25, color: '#225F81', amount: '25%' },
                  { label: 'Queued / Degraded', percent: 15, color: '#8A4F13', amount: '15%' }
                ],
                centerValue: '85%',
                centerSub: 'Health',
                legendX: 130,
                legendY: 18,
                legendWidth: 280,
                itemHeight: 26
              })}
            </g>

            <g transform="translate(0, 180)">
              <rect width="412" height="110" rx="10" fill="#E8F2EE" stroke="#A7F3D0" />
              <g transform="translate(14, 14)">
                <text x="0" y="14" font-size="11.5" font-weight="700" fill="#075A46">Data loss: 0.00% · mttr: 1.2 seconds</text>
                <text x="0" y="38" font-size="12" fill="#075A46"><tspan x="0">Changes stay on this device while offline.</tspan><tspan x="0" dy="20">Reconnect to send them for review.</tspan></text>
              </g>
            </g>
          </g>
        </g>

        <!-- Resilience Circuit Topology Diagram -->
        <g transform="translate(0, 350)">
          <rect width="460" height="340" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Self-Healing Circuit Topology</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Automatic failover to tribal offline edge</text>
            <line x1="0" y1="44" x2="412" y2="44" stroke="#EEF3F3" />

            <!-- Topology Graphic -->
            <g transform="translate(10, 60)">
              <!-- Node 1: Scholar Client -->
              <rect x="0" y="20" width="100" height="60" rx="8" fill="#E8F2EE" stroke="#075A46" />
              <text x="50" y="44" font-size="11" font-weight="700" fill="#075A46" text-anchor="middle">Scholar App</text>
              <text x="50" y="60" font-size="9" fill="#075A46" text-anchor="middle">Offline Mode</text>

              <!-- Arrow 1 -->
              <line x1="100" y1="50" x2="140" y2="50" stroke="#075A46" stroke-width="2" stroke-dasharray="3 3" />
              <polygon points="140,47 146,50 140,53" fill="#075A46" />

              <!-- Node 2: IndexedDB CRDT Cache -->
              <rect x="146" y="20" width="110" height="60" rx="8" fill="#FEF3C7" stroke="#8A4F13" />
              <text x="201" y="44" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">IndexedDB</text>
              <text x="201" y="60" font-size="9" fill="#8A4F13" text-anchor="middle">Saved on device</text>

              <!-- Arrow 2 -->
              <line x1="256" y1="50" x2="296" y2="50" stroke="#8A4F13" stroke-width="2" />
              <polygon points="296,47 302,50 296,53" fill="#8A4F13" />

              <!-- Node 3: MoTA Central Hub -->
              <rect x="302" y="20" width="100" height="60" rx="8" fill="#EFF6FF" stroke="#225F81" />
              <text x="352" y="44" font-size="11" font-weight="700" fill="#1E40AF" text-anchor="middle">MoTA Hub</text>
              <text x="352" y="60" font-size="9" fill="#225F81" text-anchor="middle">NIC Vault</text>

              <!-- Live Circuit Telemetry -->
              <g transform="translate(0, 110)">
                <rect width="402" height="110" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
                <g transform="translate(14, 14)">
                  <text x="0" y="14" font-size="10.5" font-weight="700" fill="#152E35">Telemetry indicators</text>
                  <text x="0" y="34" font-size="10.5" fill="#52666D">• Edge Cache Hit Ratio: <tspan font-weight="700" fill="#075A46">94.2%</tspan></text>
                  <text x="0" y="52" font-size="10.5" fill="#52666D">• Queued Sync Operations: <tspan font-weight="700" fill="#8A4F13">42 mutations</tspan></text>
                  <text x="0" y="70" font-size="10.5" fill="#52666D">• Retry Backoff Policy: Exponential (1s, 2s, 4s, 8s)</text>
                  <text x="0" y="88" font-size="10.5" fill="#075A46" font-weight="700">• Zero Unhandled Exceptions</text>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 18: Coverage Gap Analytics
// -------------------------------------------------------------
export function make18CoverageGapAnalytics() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('analytics', 'officer')}
  ${renderGovSidebar('analytics', 'officer')}

  <g transform="translate(268, 126)">
    <!-- Top Hero KPI Banner -->
    <g>
      <rect width="1144" height="140" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <rect width="1144" height="4" rx="2" fill="url(#govPrimaryGrad)" />

      <!-- Left Hero Stats -->
      <g transform="translate(28, 22)">
        <text x="0" y="16" font-size="16" font-weight="700" fill="#152E35">Geospatial Tribal Saturation &amp; Coverage Gap Analytics</text>
        <text x="0" y="34" font-size="11.5" fill="#52666D">Jharkhand State Tribal Welfare Directorate · Targeted PVTG Saturation Campaign 2026</text>

        <g transform="translate(0, 50)">
          <!-- KPI 1 -->
          <g transform="translate(0, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#52666D">Total target ST scholars</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#152E35" class="mono">86,450</text>
            <text x="0" y="52" font-size="10.5" fill="#52666D">Census Mapped</text>
          </g>

          <!-- KPI 2 -->
          <g transform="translate(200, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#075A46">Enrolled beneficiaries</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#075A46" class="mono">53,820</text>
            <text x="0" y="52" font-size="10.5" fill="#075A46" font-weight="700">62.2% Saturation</text>
          </g>

          <!-- KPI 3 -->
          <g transform="translate(400, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#8A4F13">PVTG birhor coverage</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#8A4F13" class="mono">78.0%</text>
            <text x="0" y="52" font-size="10.5" fill="#8A4F13" font-weight="700">Tier-1 Intensive</text>
          </g>

          <!-- KPI 4 -->
          <g transform="translate(580, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#DC2626">Unreached gap</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#DC2626" class="mono">8,410</text>
            <text x="0" y="52" font-size="10.5" fill="#DC2626" font-weight="700">Mobile CSC Action</text>
          </g>
        </g>
      </g>

      <!-- Right Donut: Overall State Saturation -->
      <g transform="translate(760, 16)">
        <rect width="360" height="108" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
        <g transform="translate(10, 8)">
          ${renderDonutChartComponent({
            cx: 46,
            cy: 46,
            rOut: 40,
            rIn: 25,
            segments: [
              { label: 'Enrolled &amp; Paid', percent: 62, color: '#075A46', amount: '53.8K' },
              { label: 'Eligible Unapplied', percent: 28, color: '#8A4F13', amount: '24.2K' },
              { label: 'Doc Deficient', percent: 10, color: '#DC2626', amount: '8.4K' }
            ],
            centerValue: '62%',
            centerSub: 'Saturated',
            legendX: 102,
            legendY: 8,
            legendWidth: 240,
            itemHeight: 24
          })}
        </g>
      </g>
    </g>

    <!-- Main Section Split -->
    <g transform="translate(0, 156)">
      <!-- Left: District Saturation Breakdown Table -->
      <g>
        <rect width="680" height="640" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">District Saturation Index</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Prioritized deployment of Mobile CSC Enrollment Vans</text>

          <g transform="translate(0, 52)">
            <rect width="632" height="36" rx="6" fill="#EEF3F3" />
            <text x="16" y="22" font-size="10.5" font-weight="700" fill="#52666D">District</text>
            <text x="140" y="22" font-size="10.5" font-weight="700" fill="#52666D">Target ST</text>
            <text x="240" y="22" font-size="10.5" font-weight="700" fill="#52666D">Enrolled</text>
            <text x="340" y="22" font-size="10.5" font-weight="700" fill="#52666D">Saturation</text>
            <text x="460" y="22" font-size="10.5" font-weight="700" fill="#52666D">Gap status</text>
            <text x="560" y="22" font-size="10.5" font-weight="700" fill="#52666D">Action</text>
          </g>

          <!-- District 1: Latehar -->
          <g transform="translate(0, 96)">
            <line x1="0" y1="54" x2="632" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="13" font-weight="700" fill="#152E35">Latehar</text>
            <text x="16" y="40" font-size="10.5" fill="#52666D">PVTG Focus: Birhor</text>

            <text x="140" y="28" font-size="12" font-weight="700" fill="#152E35" class="mono">24,000</text>
            <text x="240" y="28" font-size="12" font-weight="700" fill="#075A46" class="mono">18,720</text>
            <text x="340" y="28" font-size="12" font-weight="700" fill="#075A46">78.0%</text>

            <rect x="460" y="14" width="80" height="22" rx="11" fill="#E8F2EE" />
            <text x="500" y="29" font-size="8.5" font-weight="700" fill="#075A46" text-anchor="middle">High sat</text>

            <rect x="555" y="12" width="70" height="26" rx="6" fill="#EEF3F3" />
            <text x="590" y="29" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">View Map</text>
          </g>

          <!-- District 2: Gumla -->
          <g transform="translate(0, 160)">
            <line x1="0" y1="54" x2="632" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="13" font-weight="700" fill="#152E35">Gumla</text>
            <text x="16" y="40" font-size="10.5" fill="#52666D">PVTG: Asur, Birhor</text>

            <text x="140" y="28" font-size="12" font-weight="700" fill="#152E35" class="mono">28,000</text>
            <text x="240" y="28" font-size="12" font-weight="700" fill="#225F81" class="mono">16,800</text>
            <text x="340" y="28" font-size="12" font-weight="700" fill="#225F81">60.0%</text>

            <rect x="460" y="14" width="80" height="22" rx="11" fill="#FEF3C7" />
            <text x="500" y="29" font-size="8.5" font-weight="700" fill="#92400E" text-anchor="middle">Moderate</text>

            <rect x="555" y="12" width="70" height="26" rx="6" fill="#EEF3F3" />
            <text x="590" y="29" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">Deploy Van</text>
          </g>

          <!-- District 3: Khunti -->
          <g transform="translate(0, 224)">
            <line x1="0" y1="54" x2="632" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="13" font-weight="700" fill="#152E35">Khunti</text>
            <text x="16" y="40" font-size="10.5" fill="#52666D">Tribal Focus: Munda</text>

            <text x="140" y="28" font-size="12" font-weight="700" fill="#152E35" class="mono">18,500</text>
            <text x="240" y="28" font-size="12" font-weight="700" fill="#225F81" class="mono">11,100</text>
            <text x="340" y="28" font-size="12" font-weight="700" fill="#225F81">60.0%</text>

            <rect x="460" y="14" width="80" height="22" rx="11" fill="#FEF3C7" />
            <text x="500" y="29" font-size="8.5" font-weight="700" fill="#92400E" text-anchor="middle">Moderate</text>

            <rect x="555" y="12" width="70" height="26" rx="6" fill="#EEF3F3" />
            <text x="590" y="29" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">Deploy Van</text>
          </g>

          <!-- District 4: Simdega (Critical Gap) -->
          <g transform="translate(0, 288)">
            <line x1="0" y1="54" x2="632" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="13" font-weight="700" fill="#152E35">Simdega</text>
            <text x="16" y="40" font-size="10.5" fill="#DC2626" font-weight="600">Critical Gap: Kharia</text>

            <text x="140" y="28" font-size="12" font-weight="700" fill="#152E35" class="mono">15,950</text>
            <text x="240" y="28" font-size="12" font-weight="700" fill="#DC2626" class="mono">7,200</text>
            <text x="340" y="28" font-size="12" font-weight="700" fill="#DC2626">45.1%</text>

            <rect x="460" y="14" width="80" height="22" rx="11" fill="#FEE2E2" />
            <text x="500" y="29" font-size="8.5" font-weight="700" fill="#DC2626" text-anchor="middle">Critical</text>

            <rect x="555" y="12" width="70" height="26" rx="6" fill="#FEE2E2" />
            <text x="590" y="29" font-size="10" font-weight="700" fill="#DC2626" text-anchor="middle">Camp Now</text>
          </g>

          <!-- Rapid Outreach Stepper -->
          <g transform="translate(0, 360)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#075A46">Rapid outreach camp protocol</text>
            <g transform="translate(0, 26)">
              <rect width="632" height="110" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(14, 16)">
                ${renderStepperPipelineComponent({
                  x: 0,
                  y: 0,
                  width: 604,
                  steps: [
                    { title: 'Gap Pinpointed', sub: 'Census AI', status: 'done', badge: 'MAPPED' },
                    { title: 'Mobile CSC Van', sub: 'Simdega Bolba', status: 'active', badge: 'DISPATCH' },
                    { title: 'Aadhaar e-KYC', sub: 'Iris Scanner', status: 'upcoming', badge: 'BIOMETRIC' },
                    { title: 'Spot Sanction', sub: 'Treasury Push', status: 'upcoming', badge: 'DBT ONBOARD' }
                  ]
                })}
              </g>
            </g>
          </g>
        </g>
      </g>

      <!-- Right: Saturation Donut & Geospatial Priorities -->
      <g transform="translate(704, 0)">
        <g>
          <rect width="440" height="640" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Latehar vs State Saturation</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Detailed breakdown of Latehar District</text>
            <line x1="0" y1="44" x2="392" y2="44" stroke="#EEF3F3" />

            <g transform="translate(0, 56)">
              ${renderDonutChartComponent({
                cx: 60,
                cy: 56,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'Birhor PVTG (Covered)', percent: 78, color: '#075A46', amount: '18.7K' },
                  { label: 'Unreached Hamlets', percent: 22, color: '#8A4F13', amount: '5.2K' }
                ],
                centerValue: '78%',
                centerSub: 'Latehar',
                legendX: 130,
                legendY: 20,
                legendWidth: 260,
                itemHeight: 28
              })}
            </g>

            <!-- Priority Hamlets Card -->
            <g transform="translate(0, 190)">
              <rect width="392" height="190" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(16, 16)">
                <text x="0" y="14" font-size="11" font-weight="700" fill="#152E35">Target remote hamlets (no mobile tower)</text>
                
                <text x="0" y="38" font-size="11" font-weight="700" fill="#8A4F13">• Hamlet Belta (Block Mahuadanr):</text>
                <text x="12" y="54" font-size="10.5" fill="#52666D">42 eligible Birhor scholars · Offline sync van arriving 22 Oct.</text>

                <text x="0" y="78" font-size="11" font-weight="700" fill="#8A4F13">• Hamlet Netarhat Foothills:</text>
                <text x="12" y="94" font-size="10.5" fill="#52666D">18 Asur scholars · Biometric iris scanner camp operational.</text>

                <text x="0" y="118" font-size="11" font-weight="700" fill="#075A46">• Hamlet Chandwa North:</text>
                <text x="12" y="134" font-size="10.5" fill="#075A46">100% Saturation achieved on 12 Oct 2026 ✓</text>
              </g>
            </g>

            <rect x="0" y="400" width="392" height="44" rx="8" fill="url(#govPrimaryGrad)" />
            <text x="196" y="427" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Dispatch Mobile Outreach Van +</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 19: Forensic Audit Log
// -------------------------------------------------------------
export function make19ForensicAuditLog() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('audit', 'officer')}
  ${renderGovSidebar('audit', 'officer')}

  <g transform="translate(268, 126)">
    <!-- Top Hero Header -->
    <g>
      <rect width="1144" height="150" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <rect width="1144" height="4" rx="2" fill="url(#govPrimaryGrad)" />

      <!-- Left Hero Stats -->
      <g transform="translate(28, 22)">
        <text x="0" y="16" font-size="16" font-weight="700" fill="#152E35">Decision history</text>
        <text x="0" y="34" font-size="12" fill="#52666D">Review decisions, document checks, and the officer responsible · Sample events</text>

        <g transform="translate(0, 50)">
          <!-- Stat 1 -->
          <g transform="translate(0, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#52666D">Total audited blocks</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#152E35" class="mono">1,842</text>
            <text x="0" y="52" font-size="10.5" fill="#075A46" font-weight="700">All Blocks Validated ✓</text>
          </g>

          <!-- Stat 2 -->
          <g transform="translate(200, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#075A46">Cryptographic events</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#075A46" class="mono">14,921</text>
            <text x="0" y="52" font-size="10.5" fill="#52666D">Tamper-Proof SHA-256</text>
          </g>

          <!-- Stat 3 -->
          <g transform="translate(410, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#225F81">Active validator nodes</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#225F81" class="mono">4 / 4</text>
            <text x="0" y="52" font-size="10.5" fill="#225F81" font-weight="700">NIC, MoTA, PFMS, UIDAI</text>
          </g>

          <!-- Stat 4 -->
          <g transform="translate(600, 0)">
            <text x="0" y="12" font-size="10" font-weight="700" fill="#075A46">Record type</text>
            <text x="0" y="38" font-size="24" font-weight="700" fill="#075A46">Sample</text>
            <text x="0" y="52" font-size="10.5" fill="#075A46">Illustrative audit history</text>
          </g>
        </g>
      </g>

      <!-- Right Donut: Event Distribution -->
      <g transform="translate(760, 16)">
        <rect width="360" height="118" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
        <g transform="translate(10, 10)">
          ${renderDonutChartComponent({
            cx: 46,
            cy: 48,
            rOut: 40,
            rIn: 25,
            segments: [
              { label: 'Sanction Endorsements', percent: 52, color: '#075A46', amount: '7.8K' },
              { label: 'DigiLocker Seals', percent: 28, color: '#225F81', amount: '4.2K' },
              { label: 'PFMS Disbursals', percent: 14, color: '#075A46', amount: '2.1K' },
              { label: 'Discrepancy Notices', percent: 6, color: '#DC2626', amount: '0.8K' }
            ],
            centerValue: '14.9K',
            centerSub: 'Events',
            legendX: 104,
            legendY: 8,
            legendWidth: 240,
            itemHeight: 22
          })}
        </g>
      </g>
    </g>

    <!-- Main Content Split -->
    <g transform="translate(0, 166)">
      <!-- Left: Visual Merkle Chain DAG -->
      <g>
        <rect width="1144" height="160" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 18)">
          <text x="0" y="16" font-size="18" font-weight="700" fill="#152E35">Linked review events</text>
          <text x="0" y="36" font-size="12" fill="#52666D">Follow the application from submission through document checks to approval.</text>

          <g transform="translate(0, 48)">
            ${renderMerkleChainComponent({
              x: 0,
              y: 0,
              width: 1096,
              blocks: [
                {
                  id: '1840',
                  hash: '0x8a92...11ef',
                  time: '12 Oct 09:12',
                  op: 'Application submitted',
                  valid: true
                },
                {
                  id: '1841',
                  hash: '0x3f11...99bc',
                  time: '14 Oct 11:15',
                  op: 'Documents checked',
                  valid: true
                },
                {
                  id: '1842',
                  hash: '0x7c49...a420',
                  time: '14 Oct 14:32',
                  op: 'Approval recorded',
                  valid: true
                }
              ]
            })}
          </g>
        </g>
      </g>

      <!-- Lower: Forensic Event Table -->
      <g transform="translate(0, 176)">
        <rect width="1144" height="470" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Review and approval events</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Cryptographically authenticated records linked to DSC public keys</text>

          <!-- Table Header -->
          <g transform="translate(0, 48)">
            <rect width="1096" height="36" rx="6" fill="#EEF3F3" />
            <text x="16" y="22" font-size="10.5" font-weight="700" fill="#52666D">Timestamp</text>
            <text x="160" y="22" font-size="10.5" font-weight="700" fill="#52666D">Event type</text>
            <text x="360" y="22" font-size="10.5" font-weight="700" fill="#52666D">Actor &amp; credential</text>
            <text x="600" y="22" font-size="10.5" font-weight="700" fill="#52666D">Target entity</text>
            <text x="810" y="22" font-size="10.5" font-weight="700" fill="#52666D">Block SHA-256 hash</text>
            <text x="990" y="22" font-size="10.5" font-weight="700" fill="#52666D">Verify</text>
          </g>

          <!-- Row 1: DSC Sanction -->
          <g transform="translate(0, 92)">
            <line x1="0" y1="54" x2="1096" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="11.5" font-weight="700" fill="#152E35" class="mono">14 Oct 14:32:10</text>
            <text x="16" y="40" font-size="10" fill="#52666D">IST (+05:30)</text>

            <rect x="160" y="12" width="170" height="24" rx="8" fill="#E8F2EE" />
            <text x="245" y="28" font-size="9" font-weight="700" fill="#075A46" class="badge">Dsc sanction endorsed ✓</text>

            <text x="360" y="24" font-size="12" font-weight="700" fill="#152E35">Dr. K. Soren (DWO Latehar)</text>
            <text x="360" y="40" font-size="10.5" fill="#52666D">DSC Serial: <tspan class="mono">0x7F82A091</tspan></text>

            <text x="600" y="24" font-size="12" font-weight="700" fill="#152E35">Case #TS-2026-88194</text>
            <text x="600" y="40" font-size="10.5" fill="#52666D">Mohan Birhor (₹132,000)</text>

            <text x="810" y="28" font-size="10.5" fill="#075A46" class="mono">0x7c49...a420 ✓</text>

            <rect x="990" y="12" width="90" height="28" rx="6" fill="#EEF3F3" />
            <text x="1035" y="30" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">Verify DAG</text>
          </g>

          <!-- Row 2: DigiLocker Caste Verified -->
          <g transform="translate(0, 154)">
            <line x1="0" y1="54" x2="1096" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="11.5" font-weight="700" fill="#152E35" class="mono">14 Oct 11:15:44</text>
            <text x="16" y="40" font-size="10" fill="#52666D">IST (+05:30)</text>

            <rect x="160" y="12" width="170" height="24" rx="8" fill="#EFF6FF" />
            <text x="245" y="28" font-size="9" font-weight="700" fill="#225F81" class="badge">DigiLocker caste seal ✓</text>

            <text x="360" y="24" font-size="12" font-weight="700" fill="#152E35">SDO Mahuadanr, Latehar</text>
            <text x="360" y="40" font-size="10.5" fill="#52666D">e-Sign Cert: <tspan class="mono">0x1049AB12</tspan></text>

            <text x="600" y="24" font-size="12" font-weight="700" fill="#152E35">Cert #JH/ST/2023/88194</text>
            <text x="600" y="40" font-size="10.5" fill="#52666D">Birhor Scheduled Tribe</text>

            <text x="810" y="28" font-size="10.5" fill="#225F81" class="mono">0x3f11...99bc ✓</text>

            <rect x="990" y="12" width="90" height="28" rx="6" fill="#EEF3F3" />
            <text x="1035" y="30" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">Verify DAG</text>
          </g>

          <!-- Row 3: Application Submission -->
          <g transform="translate(0, 218)">
            <line x1="0" y1="54" x2="1096" y2="54" stroke="#EEF3F3" />
            <text x="16" y="24" font-size="11.5" font-weight="700" fill="#152E35" class="mono">12 Oct 09:12:08</text>
            <text x="16" y="40" font-size="10" fill="#52666D">IST (+05:30)</text>

            <rect x="160" y="12" width="170" height="24" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
            <text x="245" y="28" font-size="9" font-weight="700" fill="#52666D" class="badge">Application submitted</text>

            <text x="360" y="24" font-size="12" font-weight="700" fill="#152E35">Mohan Birhor (Scholar)</text>
            <text x="360" y="40" font-size="10.5" fill="#52666D">Aadhaar Vault: <tspan class="mono">•••• •••• 4921</tspan></text>

            <text x="600" y="24" font-size="12" font-weight="700" fill="#152E35">BIT Mesra Scholarship</text>
            <text x="600" y="40" font-size="10.5" fill="#52666D">B.Tech CSE Year 2</text>

            <text x="810" y="28" font-size="10.5" fill="#52666D" class="mono">0x8a92...11ef ✓</text>

            <rect x="990" y="12" width="90" height="28" rx="6" fill="#EEF3F3" />
            <text x="1035" y="30" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">Verify DAG</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}
