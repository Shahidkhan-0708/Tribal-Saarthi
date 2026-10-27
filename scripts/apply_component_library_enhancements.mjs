import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const filePath = path.resolve('scripts/recreate_all_22_svgs.mjs');
let code = fs.readFileSync(filePath, 'utf8');

// -------------------------------------------------------------
// Helper to replace whole function bodies cleanly
// -------------------------------------------------------------
function replaceFunction(source, fnName, newFnCode) {
  const pattern = new RegExp(`function ${fnName}\\(\\)[\\s\\S]*?\\n(?=function |const allGenerators|\\/\\/ ---)`);
  if (!pattern.test(source)) {
    throw new Error(`Could not find function ${fnName} in source.`);
  }
  return source.replace(pattern, newFnCode.trim() + '\n\n');
}

// =============================================================
// 1. SCREEN 18: Coverage Gap Analytics
// =============================================================
const newScreen18 = `function make18CoverageGapAnalytics() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('officer/analytics', 'Tribe Saarthi · Coverage Gap Analytics')}
  \${renderSidebar('analytics', 'officer')}
  \${renderHeader('Coverage Gap &amp; Saturation Analytics', 'District-level saturation tracking for Scheduled Tribe &amp; PVTG students in Jharkhand', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- 4 KPI Metrics -->
    <g>
      <!-- KPI 1: Visual Anchor from GStack -->
      <g filter="url(#cardShadow)">
        <rect width="268" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">VERIFIED ST ENROLLMENTS</text>
          <text x="0" y="44" font-size="28" font-weight="900" fill="#0F172A" class="stat-anchor">81,373</text>
          <text x="0" y="62" font-size="10" font-weight="700" fill="#B45309">Enrollment counts ≠ unpaid students</text>
        </g>
      </g>

      <!-- KPI 2 -->
      <g transform="translate(292, 0)" filter="url(#cardShadow)">
        <rect width="268" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">ENROLLED SCHOLARS</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#047857">62,310 <tspan font-size="13" font-weight="700">(74%)</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#059669">↑ +14% vs last academic year</text>
        </g>
      </g>

      <!-- KPI 3 -->
      <g transform="translate(584, 0)" filter="url(#cardShadow)">
        <rect width="268" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#EF4444" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">PVTG PRIORITY COVERAGE</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#DC2626">48% <tspan font-size="13" font-weight="700">(Target: 80%)</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="700" fill="#DC2626">⚠ Critical saturation gap</text>
        </g>
      </g>

      <!-- KPI 4 -->
      <g transform="translate(876, 0)" filter="url(#cardShadow)">
        <rect width="266" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="266" height="4" rx="2" fill="#D97706" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">FUNDS DISBURSED VIA DBT</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#0F172A">₹82.2 Cr</text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#047857">100% Aadhaar Seeded PFMS</text>
        </g>
      </g>
    </g>

    <!-- Main Analytics Content: District Saturation Chart (720px) & Action Alert (400px) -->
    <g transform="translate(0, 120)">
      
      <!-- Left: District Saturation Breakdown -->
      <g filter="url(#heroShadow)">
        <rect width="720" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(28, 24)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">District Saturation Percentage (ST Beneficiaries)</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Comparison of enrolled students against verified ST population per district</text>

          <!-- Bar Chart -->
          <g transform="translate(0, 60)">
            <!-- Ranchi -->
            <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Ranchi District</text>
            <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
            <rect x="140" y="8" width="404" height="24" rx="6" fill="url(#brandGrad)" />
            <text x="550" y="24" font-size="12" font-weight="800" fill="#047857">88%</text>

            <!-- Khunti -->
            <g transform="translate(0, 50)">
              <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Khunti District</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
              <rect x="140" y="8" width="363" height="24" rx="6" fill="url(#brandGrad)" />
              <text x="510" y="24" font-size="12" font-weight="800" fill="#047857">79%</text>
            </g>

            <!-- Gumla -->
            <g transform="translate(0, 100)">
              <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Gumla District</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
              <rect x="140" y="8" width="294" height="24" rx="6" fill="#F59E0B" />
              <text x="442" y="24" font-size="12" font-weight="800" fill="#B45309">64%</text>
            </g>

            <!-- Latehar (Critical PVTG Gap) -->
            <g transform="translate(0, 150)">
              <text x="0" y="24" font-size="12" font-weight="800" fill="#DC2626">Latehar District ★</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#FEE2E2" />
              <rect x="140" y="8" width="239" height="24" rx="6" fill="#EF4444" />
              <text x="388" y="24" font-size="12" font-weight="900" fill="#DC2626">52% (GAP)</text>
            </g>

            <!-- Simdega -->
            <g transform="translate(0, 200)">
              <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Simdega District</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
              <rect x="140" y="8" width="266" height="24" rx="6" fill="#F59E0B" />
              <text x="414" y="24" font-size="12" font-weight="800" fill="#B45309">58%</text>
            </g>
          </g>

          <!-- Legend -->
          <g transform="translate(0, 360)">
            <rect x="0" y="0" width="14" height="14" rx="3" fill="#047857" />
            <text x="22" y="11" font-size="11" fill="#64748B">&gt;75% High Saturation</text>

            <rect x="180" y="0" width="14" height="14" rx="3" fill="#F59E0B" />
            <text x="202" y="11" font-size="11" fill="#64748B">55–74% Moderate Gap</text>

            <rect x="370" y="0" width="14" height="14" rx="3" fill="#EF4444" />
            <text x="392" y="11" font-size="11" font-weight="700" fill="#DC2626">&lt;55% Critical Saturation Deficit</text>
          </g>
        </g>
      </g>

      <!-- Right: Actionable Mobile Outreach Campaign Card with Component Library Donut & Stepper -->
      <g transform="translate(742, 0)">
        <g filter="url(#cardShadow)">
          <rect width="400" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(24, 20)">
            <rect x="0" y="0" width="140" height="24" rx="12" fill="#FEE2E2" />
            <text x="70" y="16" font-size="9.5" font-weight="800" fill="#DC2626" class="badge">ACTION REQUIRED</text>

            <text x="0" y="46" font-size="15" font-weight="800" fill="#0F172A">Latehar PVTG Outreach Saturation</text>
            <text x="0" y="62" font-size="11" fill="#64748B">Targeting 3,400 unenrolled Birhor &amp; Korwa youths</text>

            <!-- 1. Component Library: Donut Chart for Demographic Distribution -->
            <g transform="translate(0, 76)">
              <rect width="352" height="136" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              <text x="14" y="20" font-size="10.5" font-weight="800" fill="#0F172A">TRIBAL SATURATION DEFICIT</text>
              \${renderDonutChartComponent({
                cx: 60,
                cy: 78,
                rOut: 46,
                rIn: 28,
                segments: [
                  { label: 'Santhal', percent: 38, color: '#047857' },
                  { label: 'Oraon', percent: 28, color: '#10B981' },
                  { label: 'Munda', percent: 20, color: '#2563EB' },
                  { label: 'Birhor (PVTG)', percent: 14, color: '#EF4444' }
                ],
                centerValue: '52%',
                centerSub: 'Coverage',
                legendX: 130,
                legendY: 34,
                legendWidth: 206,
                itemHeight: 22
              })}
            </g>

            <!-- 2. Component Library: Rapid Outreach Pipeline Flow Diagram -->
            <g transform="translate(0, 224)">
              <rect width="352" height="126" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
              <text x="14" y="20" font-size="10.5" font-weight="800" fill="#92400E">RAPID INTERVENTION PIPELINE</text>
              \${renderStepperPipelineComponent({
                x: 10,
                y: 34,
                width: 332,
                steps: [
                  { title: 'Gap Alert', sub: '&lt;55% Deficit', status: 'done', badge: 'RESOLVED' },
                  { title: 'DC MoTA', sub: 'Dispatched', status: 'done', badge: 'SENT ✓' },
                  { title: 'Mobile Van', sub: 'En Route', status: 'active', badge: 'ACTIVE ★' },
                  { title: 'CSC Camps', sub: '3.4K Target', status: 'upcoming', badge: 'SCHEDULED' }
                ]
              })}
            </g>

            <!-- Action Buttons -->
            <g transform="translate(0, 366)">
              <rect x="0" y="0" width="352" height="42" rx="8" fill="url(#brandGrad)" />
              <text x="176" y="26" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Deploy Mobile Registration Van →</text>

              <rect x="0" y="52" width="352" height="40" rx="8" fill="#F1F5F9" stroke="#E2E8F0" />
              <text x="176" y="77" font-size="11.5" font-weight="700" fill="#047857" text-anchor="middle">Export Block Gap Report (CSV)</text>
            </g>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 2. SCREEN 07: Application Lifecycle Tracker
// =============================================================
const newScreen07 = `function make07ApplicationLifecycleTracker() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('scholar/applications/JH-ST-2026-89412', 'Tribe Saarthi · Application Lifecycle Tracker')}
  \${renderSidebar('apps', 'student')}
  \${renderHeader('Application Lifecycle Tracker', 'Detailed decision timeline and cryptographic milestone records for Application #JH-ST-2026-89412', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Top Summary Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="96" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 20)">
        <text x="0" y="16" font-size="16" font-weight="800" fill="#0F172A">Post-Matric Scholarship for ST Students (2026-27)</text>
        <text x="0" y="36" font-size="11" fill="#64748B">Beneficiary: <tspan font-weight="700" fill="#0F172A">Mohan Birhor</tspan> · Scheme Code: <tspan class="mono">MOTA-PMS-ST-2026</tspan> · Submitted: 12 Oct 2026, 02:22 PM</text>

        <rect x="740" y="6" width="180" height="32" rx="16" fill="#FFFBEB" stroke="#FDE68A" />
        <circle cx="754" cy="22" r="4" fill="#D97706" />
        <text x="764" y="26" font-size="10.5" font-weight="800" fill="#B45309">STAGE 2: COLLEGE REVIEW</text>

        <rect x="940" y="4" width="160" height="36" rx="8" fill="url(#brandGrad)" />
        \${I.download(952, 13, '#FFFFFF', 18)}
        <text x="1030" y="27" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Receipt PDF</text>
      </g>
    </g>

    <!-- Split Content: Vertical Stepper (720px) & Summary Cards (400px) -->
    <g transform="translate(0, 116)">
      <!-- Left Panel: Detailed Vertical Decision Timeline -->
      <g filter="url(#cardShadow)">
        <rect width="720" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        
        <g transform="translate(32, 28)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Application Decision Milestones</text>
          <text x="0" y="34" font-size="11" fill="#64748B">Immutable record of statutory verifications and government actions</text>

          <!-- Vertical Timeline Track -->
          <line x1="20" y1="74" x2="20" y2="520" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
          <line x1="20" y1="74" x2="20" y2="240" stroke="#059669" stroke-width="3" stroke-linecap="round" />

          <!-- Milestone 1: Done -->
          <g transform="translate(0, 70)">
            <circle cx="20" cy="14" r="14" fill="#047857" />
            \${I.check(13, 7, '#FFFFFF', 14)}
            <text x="48" y="14" font-size="13" font-weight="800" fill="#0F172A">Application Submitted &amp; Digitally Sealed</text>
            <text x="48" y="30" font-size="11" fill="#64748B">Online submission authenticated via Aadhaar OTP. Form payload sealed with SHA-256 hash.</text>
            <text x="48" y="46" font-size="10" font-weight="600" fill="#059669" class="mono">12 Oct 2026 · 02:22 PM · Digest: e3b0c44298fc...</text>
          </g>

          <!-- Milestone 2: Done -->
          <g transform="translate(0, 154)">
            <circle cx="20" cy="14" r="14" fill="#047857" />
            \${I.check(13, 7, '#FFFFFF', 14)}
            <text x="48" y="14" font-size="13" font-weight="800" fill="#0F172A">Automated Multi-Registry Cross-Checks Passed</text>
            <text x="48" y="30" font-size="11" fill="#64748B">UIDAI demographic vault, State e-District ST database, and Revenue Income certified.</text>
            <text x="48" y="46" font-size="10" font-weight="600" fill="#059669" class="mono">12 Oct 2026 · 02:23 PM · 3/3 Automated Registries Cleared ✓</text>
          </g>

          <!-- Milestone 3: Active (College Nodal Review) -->
          <g transform="translate(0, 238)">
            <circle cx="20" cy="14" r="16" fill="url(#amberGrad)" />
            <circle cx="20" cy="14" r="22" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3" />
            \${I.clock(11, 5, '#FFFFFF', 18)}
            <text x="52" y="14" font-size="13" font-weight="800" fill="#B45309">Institute Nodal Officer Verification (Current Stage)</text>
            <text x="52" y="30" font-size="11" fill="#0F172A">Assigned Reviewer: <tspan font-weight="700">Dr. K. Soren</tspan> (BIT Mesra Nodal Desk)</text>
            <text x="52" y="46" font-size="11" fill="#64748B">Verifying academic roll #2024-CSE-104 and hostel fee schedule. SLA target: 48h.</text>
            <rect x="52" y="56" width="130" height="22" rx="11" fill="#FEF3C7" />
            <text x="117" y="71" font-size="9" font-weight="800" fill="#B45309" class="badge">ACTIVE REVIEW</text>
          </g>

          <!-- Milestone 4: Upcoming -->
          <g transform="translate(0, 344)">
            <circle cx="20" cy="14" r="13" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
            <text x="20" y="18" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">4</text>
            <text x="48" y="14" font-size="13" font-weight="700" fill="#64748B">District Welfare Officer Sanction Endorsement</text>
            <text x="48" y="30" font-size="11" fill="#94A3B8">Latehar District Welfare Office · Statutory expenditure concurrence.</text>
            <text x="48" y="44" font-size="10" fill="#94A3B8">Estimated Date: 20 Oct 2026</text>
          </g>

          <!-- Milestone 5: Upcoming -->
          <g transform="translate(0, 424)">
            <circle cx="20" cy="14" r="13" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
            <text x="20" y="18" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">5</text>
            <text x="48" y="14" font-size="13" font-weight="700" fill="#64748B">MoTA Central Sanction &amp; PFMS Direct Bank Transfer</text>
            <text x="48" y="30" font-size="11" fill="#94A3B8">Direct credit of ₹132,000 into Bank of India Aadhaar-seeded savings account.</text>
            <text x="48" y="44" font-size="10" fill="#94A3B8">Aadhaar Reference: •••• •••• 4921</text>
          </g>
        </g>
      </g>

      <!-- Right Panel: Application Context & Action Support (400px) -->
      <g transform="translate(742, 0)">
        <!-- Card 1: Scheme Sanction Summary with Component Library Donut & Stepper -->
        <g filter="url(#cardShadow)">
          <rect width="400" height="340" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Sanction Financial Breakdown</text>
            <line x1="0" y1="30" x2="352" y2="30" stroke="#F1F5F9" />

            <!-- Donut Chart Component -->
            <g transform="translate(0, 40)">
              \${renderDonutChartComponent({
                cx: 64,
                cy: 54,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'Tuition Fees', percent: 74, color: '#047857', amount: '₹98K' },
                  { label: 'Maintenance', percent: 18, color: '#2563EB', amount: '₹24K' },
                  { label: 'PVTG Book Grant', percent: 8, color: '#F59E0B', amount: '₹10K' }
                ],
                centerValue: '₹132K',
                centerSub: '100% Grant',
                legendX: 136,
                legendY: 18,
                legendWidth: 216,
                itemHeight: 26
              })}
            </g>

            <!-- DBT Disbursement Pathway Component -->
            <g transform="translate(0, 168)">
              <rect width="352" height="110" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              <text x="14" y="20" font-size="10.5" font-weight="800" fill="#047857">DBT DISBURSEMENT PIPELINE</text>
              \${renderStepperPipelineComponent({
                x: 10,
                y: 30,
                width: 332,
                steps: [
                  { title: 'College Desk', sub: 'Verified ✓', status: 'done', badge: 'PASSED' },
                  { title: 'Dist Treasury', sub: 'Concurred ✓', status: 'done', badge: 'PASSED' },
                  { title: 'PFMS DBT', sub: 'Queue Active', status: 'active', badge: 'PENDING' }
                ]
              })}
            </g>

            <!-- Target Bank -->
            <g transform="translate(0, 288)">
              <rect width="352" height="34" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
              <text x="12" y="22" font-size="11" font-weight="600" fill="#065F46">Target Account: <tspan font-weight="800" fill="#047857">Bank of India · ••••••••9012 (Aadhaar Seeded)</tspan></text>
            </g>
          </g>
        </g>

        <!-- Card 2: Officer Contact & Grievance Support -->
        <g transform="translate(0, 360)" filter="url(#cardShadow)">
          <rect width="400" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Assigned Nodal Desk</text>
            <line x1="0" y1="30" x2="352" y2="30" stroke="#F1F5F9" />

            <g transform="translate(0, 44)">
              <circle cx="20" cy="20" r="20" fill="url(#brandGrad)" />
              <text x="20" y="24" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">KS</text>
              <text x="50" y="16" font-size="13" font-weight="800" fill="#0F172A">Dr. K. Soren</text>
              <text x="50" y="32" font-size="11" fill="#64748B">Associate Professor &amp; ST Welfare Officer · BIT Mesra</text>

              <rect x="0" y="60" width="352" height="54" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
              <text x="12" y="82" font-size="11" font-weight="700" fill="#047857">Physical Verification Desk Open</text>
              <text x="12" y="98" font-size="10" fill="#475569">Administrative Block, Room 104 · Mon–Fri, 10:00 AM – 4:00 PM</text>

              <rect x="0" y="128" width="352" height="38" rx="8" fill="#F1F5F9" />
              <text x="176" y="152" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Raise Query with Nodal Officer →</text>
            </g>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 3. SCREEN 13: Officer Review Queue
// =============================================================
const newScreen13 = `function make13OfficerReviewQueue() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('officer/review', 'Tribe Saarthi · Officer Review Queue')}
  \${renderSidebar('queue', 'officer')}
  \${renderHeader('Officer Review Queue', 'Dr. K. Soren · BIT Mesra Nodal Verification Desk · Ranchi, Jharkhand', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Top 4 KPI Metrics Row -->
    <g>
      <!-- Metric 1: Pending Review -->
      <g filter="url(#cardShadow)">
        <rect width="268" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#D97706" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">PENDING DESK REVIEW</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#0F172A">14 <tspan font-size="11" font-weight="600" fill="#B45309">Cases</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="700" fill="#D97706">⚠ 2 Cases near 24h SLA</text>
        </g>
      </g>

      <!-- Metric 2: Approved & Forwarded -->
      <g transform="translate(292, 0)" filter="url(#cardShadow)">
        <rect width="268" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">VERIFIED &amp; APPROVED</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#047857">128 <tspan font-size="11" font-weight="600" fill="#64748B">Scholars</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#059669">✓ 100% Forwarded to District</text>
        </g>
      </g>

      <!-- Metric 3: Deficiencies Issued -->
      <g transform="translate(584, 0)" filter="url(#cardShadow)">
        <rect width="268" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#F59E0B" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">DEFICIENCY NOTICES</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#B45309">3 <tspan font-size="11" font-weight="600" fill="#64748B">Awaiting Fix</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#64748B">15-day cure window active</text>
        </g>
      </g>

      <!-- Metric 4: PVTG Priority Cases -->
      <g transform="translate(876, 0)" filter="url(#cardShadow)">
        <rect width="266" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="266" height="4" rx="2" fill="#2563EB" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">PVTG TIER-1 PRIORITY</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#2563EB">1 <tspan font-size="11" font-weight="600" fill="#64748B">Mohan Birhor</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="700" fill="#047857">★ Instant Review Priority</text>
        </g>
      </g>
    </g>

    <!-- Search & Filter Bar -->
    <g transform="translate(0, 110)">
      <rect width="640" height="42" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
      \${I.search(16, 12, '#64748B', 18)}
      <text x="44" y="26" font-size="12" fill="#94A3B8">Filter queue by Scholar Name, Application ID, or Roll Number...</text>

      <g transform="translate(660, 0)">
        <rect x="0" y="5" width="110" height="32" rx="16" fill="url(#brandGrad)" />
        <text x="55" y="25" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Pending (14)</text>

        <rect x="120" y="5" width="130" height="32" rx="16" fill="#FEF3C7" stroke="#FDE68A" />
        <circle cx="134" cy="21" r="3.5" fill="#D97706" />
        <text x="185" y="25" font-size="11" font-weight="800" fill="#92400E" text-anchor="middle">PVTG Priority (1)</text>

        <rect x="260" y="5" width="100" height="32" rx="16" fill="#F1F5F9" />
        <text x="310" y="25" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Deficient (3)</text>

        <rect x="370" y="5" width="110" height="32" rx="16" fill="#F1F5F9" />
        <text x="425" y="25" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Approved (128)</text>
      </g>
    </g>

    <!-- Queue Applications Table Card with Component Library Caseload Donut & Pipeline -->
    <g transform="translate(0, 168)" filter="url(#heroShadow)">
      <rect width="1142" height="600" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <!-- Table Header -->
      <g transform="translate(24, 20)">
        <rect width="1094" height="36" rx="6" fill="#F8FAFC" />
        <text x="16" y="22" font-size="10.5" font-weight="800" fill="#64748B">APP ID</text>
        <text x="130" y="22" font-size="10.5" font-weight="800" fill="#64748B">SCHOLAR NAME</text>
        <text x="290" y="22" font-size="10.5" font-weight="800" fill="#64748B">COMMUNITY</text>
        <text x="450" y="22" font-size="10.5" font-weight="800" fill="#64748B">SCHEME</text>
        <text x="640" y="22" font-size="10.5" font-weight="800" fill="#64748B">VERIFICATION</text>
        <text x="790" y="22" font-size="10.5" font-weight="800" fill="#64748B">SLA TIMER</text>
        <text x="960" y="22" font-size="10.5" font-weight="800" fill="#64748B" text-anchor="middle">ACTION</text>
      </g>

      <!-- Row 1: Mohan Birhor (PVTG - Highlighted) -->
      <g transform="translate(24, 68)">
        <rect width="1094" height="68" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
        <text x="16" y="28" font-size="12" font-weight="800" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
        <text x="16" y="46" font-size="10" fill="#64748B">12 Oct · 02:22 PM</text>

        <text x="130" y="28" font-size="13" font-weight="800" fill="#0F172A">Mohan Birhor</text>
        <text x="130" y="46" font-size="11" fill="#64748B">Roll: 2024-CSE-104 (B.Tech)</text>

        <rect x="290" y="16" width="130" height="22" rx="11" fill="#FEF3C7" />
        <text x="355" y="31" font-size="9" font-weight="800" fill="#92400E" class="badge">BIRHOR (PVTG) ★</text>

        <text x="450" y="28" font-size="12" font-weight="700" fill="#0F172A">Post-Matric ST</text>
        <text x="450" y="46" font-size="11" fill="#047857" font-weight="700">₹132,000 Sanction</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#ECFDF5" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#047857" class="badge">4/4 VERIFIED ✓</text>

        <text x="790" y="30" font-size="12" font-weight="800" fill="#B45309">18h remaining</text>
        <text x="790" y="46" font-size="9.5" fill="#D97706">Target: 20 Oct 14:00</text>

        <!-- Workbench Button -->
        <rect x="900" y="14" width="180" height="38" rx="8" fill="url(#brandGrad)" />
        <text x="990" y="38" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Open Inspection Workbench →</text>
      </g>

      <!-- Row 2: Anita Munda -->
      <g transform="translate(24, 146)">
        <rect width="1094" height="64" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="16" y="28" font-size="12" font-weight="700" fill="#0F172A" class="mono">JH-ST-2026-89415</text>
        <text x="16" y="44" font-size="10" fill="#64748B">13 Oct · 10:14 AM</text>

        <text x="130" y="28" font-size="13" font-weight="700" fill="#0F172A">Anita Munda</text>
        <text x="130" y="44" font-size="11" fill="#64748B">Roll: 2024-ECE-042 (B.Tech)</text>

        <text x="290" y="28" font-size="12" font-weight="600" fill="#0F172A">Munda ST</text>
        <text x="290" y="44" font-size="10.5" fill="#64748B">Khunti Domicile</text>

        <text x="450" y="28" font-size="12" font-weight="600" fill="#0F172A">Post-Matric ST</text>
        <text x="450" y="44" font-size="11" fill="#047857">₹124,000</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#ECFDF5" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#047857" class="badge">3/4 VERIFIED ✓</text>

        <text x="790" y="30" font-size="12" font-weight="600" fill="#475569">26h remaining</text>

        <rect x="920" y="15" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="1000" y="36" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Inspect Case →</text>
      </g>

      <!-- Row 3: Sunil Oraon -->
      <g transform="translate(24, 218)">
        <rect width="1094" height="64" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="16" y="28" font-size="12" font-weight="700" fill="#0F172A" class="mono">JH-ST-2026-89390</text>
        <text x="16" y="44" font-size="10" fill="#64748B">11 Oct · 04:30 PM</text>

        <text x="130" y="28" font-size="13" font-weight="700" fill="#0F172A">Sunil Oraon</text>
        <text x="130" y="44" font-size="11" fill="#64748B">Roll: 2023-ME-089 (3rd Year)</text>

        <text x="290" y="28" font-size="12" font-weight="600" fill="#0F172A">Oraon ST</text>
        <text x="290" y="44" font-size="10.5" fill="#64748B">Ranchi Domicile</text>

        <text x="450" y="28" font-size="12" font-weight="600" fill="#0F172A">Top Class Education</text>
        <text x="450" y="44" font-size="11" fill="#047857">₹150,000</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#ECFDF5" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#047857" class="badge">4/4 VERIFIED ✓</text>

        <text x="790" y="30" font-size="12" font-weight="600" fill="#475569">30h remaining</text>

        <rect x="920" y="15" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="1000" y="36" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Inspect Case →</text>
      </g>

      <!-- Row 4: Birsa Santhal (Deficient) -->
      <g transform="translate(24, 290)">
        <rect width="1094" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="28" font-size="12" font-weight="700" fill="#64748B" class="mono">JH-ST-2026-89381</text>
        <text x="16" y="44" font-size="10" fill="#94A3B8">09 Oct · 11:15 AM</text>

        <text x="130" y="28" font-size="13" font-weight="700" fill="#475569">Birsa Santhal</text>
        <text x="130" y="44" font-size="11" fill="#94A3B8">Roll: 2024-CIV-012</text>

        <text x="290" y="28" font-size="12" font-weight="600" fill="#64748B">Santhal ST</text>

        <text x="450" y="28" font-size="12" font-weight="600" fill="#64748B">Post-Matric ST</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#FEF3C7" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#B45309" class="badge">DEFICIENT NOTICE</text>

        <text x="790" y="30" font-size="11" font-weight="700" fill="#B45309">11 Days Left to Fix</text>

        <rect x="920" y="15" width="160" height="34" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
        <text x="1000" y="36" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">View Cure Status</text>
      </g>

      <!-- Bottom Panel: Caseload Donut Chart & 5-Stage Verification Pipeline Diagram -->
      <g transform="translate(24, 370)">
        <line x1="0" y1="0" x2="1094" y2="0" stroke="#E2E8F0" />
        
        <!-- Sub-panel Header -->
        <text x="0" y="24" font-size="13" font-weight="800" fill="#0F172A">CASELOAD DISTRIBUTION &amp; STATUTORY APPROVAL PIPELINE</text>
        <text x="0" y="40" font-size="10.5" fill="#64748B">Real-time status across BIT Mesra queue and subsequent disbursement gateways</text>

        <!-- Left: Donut Chart Component -->
        <g transform="translate(0, 56)">
          <rect width="360" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          \${renderDonutChartComponent({
            cx: 60,
            cy: 75,
            rOut: 46,
            rIn: 28,
            segments: [
              { label: 'Approved', percent: 88, color: '#047857', amount: '128' },
              { label: 'In Review', percent: 10, color: '#D97706', amount: '14' },
              { label: 'Deficient', percent: 2, color: '#EF4444', amount: '3' }
            ],
            centerValue: '145',
            centerSub: 'Total Cases',
            legendX: 130,
            legendY: 28,
            legendWidth: 216,
            itemHeight: 26
          })}
        </g>

        <!-- Right: 5-Stage Pipeline Diagram Component -->
        <g transform="translate(378, 56)">
          <rect width="716" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="16" y="22" font-size="11" font-weight="800" fill="#047857">STATUTORY MULTI-LEVEL VERIFICATION PIPELINE</text>
          \${renderStepperPipelineComponent({
            x: 16,
            y: 44,
            width: 684,
            steps: [
              { title: 'UIDAI Vault', sub: 'Demographic Match', status: 'done', badge: '100% CLEAR' },
              { title: 'e-District ST', sub: 'SDO Latehar Cert', status: 'done', badge: 'SEALED ✓' },
              { title: 'Institute Desk', sub: 'BIT Mesra (Dr. Soren)', status: 'active', badge: 'ACTIVE DESK' },
              { title: 'District Concurrence', sub: 'Latehar Welfare Off', status: 'upcoming', badge: 'EST 20 OCT' },
              { title: 'PFMS DBT', sub: 'Aadhaar Disburse', status: 'upcoming', badge: 'CENTRAL PFMS' }
            ]
          })}
        </g>
      </g>

    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 4. SCREEN 16: Digital Sanction Signing
// =============================================================
const newScreen16 = `function make16DigitalSanctionSigning() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('officer/sanction/JH-ST-2026-89412', 'Tribe Saarthi · Digital Sanction Order Signing')}

  <!-- Dimmed Background Portal -->
  <g opacity="0.25">
    \${renderSidebar('sanction', 'officer')}
    \${renderHeader('Digital Sanction Workbench', 'Dr. K. Soren · Approval Desk', 'officer')}
  </g>

  <!-- Dark Backdrop Overlay -->
  <rect x="0" y="41" width="1440" height="919" fill="#0F172A" fill-opacity="0.65" />

  <!-- Centered Modal Window (760px x 680px) -->
  <g transform="translate(340, 130)" filter="url(#modalShadow)">
    <rect width="760" height="680" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
    <rect width="760" height="6" rx="3" fill="url(#brandGrad)" />

    <g transform="translate(36, 28)">
      <!-- Header -->
      <circle cx="20" cy="20" r="20" fill="#ECFDF5" />
      \${I.shield(10, 10, '#047857', 20)}

      <text x="52" y="18" font-size="18" font-weight="800" fill="#0F172A">Digital Sanction Order Generation &amp; DSC Signing</text>
      <text x="52" y="36" font-size="12" fill="#64748B">Ministry of Tribal Affairs · Post-Matric Scholarship for Scheduled Tribe Students</text>

      <line x1="0" y1="56" x2="688" y2="56" stroke="#F1F5F9" />

      <!-- Sanction Order Summary with Component Library Allocation Donut -->
      <g transform="translate(0, 70)">
        <rect width="688" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        
        <!-- Left details -->
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">BENEFICIARY SCHOLAR</text>
          <text x="0" y="34" font-size="13" font-weight="800" fill="#0F172A">Mohan Birhor</text>
          <text x="0" y="50" font-size="11" fill="#64748B">BIT Mesra · B.Tech (2024-CSE-104)</text>
          
          <rect x="0" y="64" width="130" height="22" rx="11" fill="#FEF3C7" />
          <text x="65" y="79" font-size="9" font-weight="800" fill="#92400E" class="badge">BIRHOR (PVTG TIER-1)</text>

          <text x="0" y="108" font-size="10.5" font-weight="700" fill="#047857">TOTAL APPROVED BENEFIT</text>
          <text x="0" y="126" font-size="18" font-weight="900" fill="#047857">₹132,000.00</text>
        </g>

        <!-- Right: Donut Chart for Grant Breakdown -->
        <g transform="translate(280, 12)">
          <text x="0" y="16" font-size="10.5" font-weight="800" fill="#0F172A">STATUTORY GRANT ALLOCATION</text>
          \${renderDonutChartComponent({
            cx: 50,
            cy: 70,
            rOut: 42,
            rIn: 26,
            segments: [
              { label: 'Tuition Fees', percent: 74, color: '#047857', amount: '₹98,000' },
              { label: 'Maintenance', percent: 26, color: '#2563EB', amount: '₹34,000' }
            ],
            centerValue: '₹132K',
            centerSub: 'Full Grant',
            legendX: 110,
            legendY: 34,
            legendWidth: 260,
            itemHeight: 28
          })}
        </g>
      </g>

      <!-- Multi-Party Sign-Off Chain Pipeline Diagram -->
      <g transform="translate(0, 234)">
        <rect width="688" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="20" font-size="10.5" font-weight="800" fill="#047857">STATUTORY SIGN-OFF CHAIN</text>
        \${renderStepperPipelineComponent({
          x: 10,
          y: 28,
          width: 668,
          steps: [
            { title: 'Student Claim', sub: 'Aadhaar OTP', status: 'done', badge: 'SEALED ✓' },
            { title: 'Institute DSC', sub: 'Dr. K. Soren', status: 'active', badge: 'SIGNING NOW' },
            { title: 'Dist Concurrence', sub: 'Latehar Welfare', status: 'upcoming', badge: 'NEXT' },
            { title: 'MoTA PFMS', sub: 'Treasury Disburse', status: 'upcoming', badge: 'PFMS DBT' }
          ]
        })}
      </g>

      <!-- Cryptographic Hash Box -->
      <g transform="translate(0, 342)">
        <rect width="688" height="50" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
        <text x="16" y="20" font-size="10.5" font-weight="700" fill="#047857">SHA-256 ORDER DIGEST</text>
        <text x="16" y="38" font-size="10.5" font-weight="600" fill="#065F46" class="mono">9f83b2c174092bfa77e204918e3c881023a9f029148bc7210e4a77912bc0a104</text>
      </g>

      <!-- Signing Method Options -->
      <g transform="translate(0, 404)">
        <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">SELECT AUTHENTICATION METHOD</text>

        <!-- Method 1: DSC USB Token -->
        <rect x="0" y="24" width="330" height="60" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
        <circle cx="24" cy="54" r="8" fill="#D97706" />
        <circle cx="24" cy="54" r="3.5" fill="#FFFFFF" />
        <text x="44" y="46" font-size="12" font-weight="800" fill="#0F172A">Class-3 DSC Token</text>
        <text x="44" y="64" font-size="10.5" fill="#B45309">Inserted: eMudhra USB Token (Dr. K. Soren)</text>

        <!-- Method 2: Aadhaar e-Sign -->
        <g transform="translate(358, 0)">
          <rect x="0" y="24" width="330" height="60" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <circle cx="24" cy="54" r="8" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="44" y="46" font-size="12" font-weight="700" fill="#475569">Aadhaar e-Sign OTP</text>
          <text x="44" y="64" font-size="10.5" fill="#64748B">OTP sent to officer registered mobile</text>
        </g>
      </g>

      <!-- Statutory Officer Declaration -->
      <g transform="translate(0, 498)">
        <rect width="688" height="48" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
        <rect x="16" y="15" width="18" height="18" rx="4" fill="#047857" />
        \${I.check(18, 17, '#FFFFFF', 14)}
        <text x="44" y="28" font-size="11" font-weight="700" fill="#0F172A">Statutory Certification under MoTA Guidelines</text>
        <text x="44" y="42" font-size="10" fill="#475569">I certify that all criteria under MoTA Financial Rules 2026 are fulfilled and records verified.</text>
      </g>

      <!-- Action Buttons -->
      <g transform="translate(0, 564)">
        <line x1="0" y1="0" x2="688" y2="0" stroke="#F1F5F9" />

        <rect x="0" y="16" width="140" height="42" rx="8" fill="#F1F5F9" />
        <text x="70" y="42" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Cancel</text>

        <rect x="368" y="16" width="320" height="42" rx="8" fill="url(#brandGrad)" filter="url(#cardShadow)" />
        \${I.key(384, 27, '#FDE68A', 20)}
        <text x="540" y="42" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Affix Digital Signature (DSC) →</text>
      </g>
    </g>
  </g>
</svg>\`;
}`;

// =============================================================
// 5. SCREEN 17: Sabotage Switchboard
// =============================================================
const newScreen17 = `function make17SabotageSwitchboard() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('officer/sabotage', 'Tribe Saarthi · QA Sabotage Switchboard')}
  \${renderSidebar('switchboard', 'officer')}
  \${renderHeader('QA Resilience &amp; Chaos Testing Switchboard', 'Simulate government gateway outages to verify graceful degradation and offline fallbacks', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Top Warning & Status Row -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="74" rx="14" fill="#0F172A" />
      <g transform="translate(24, 18)">
        <circle cx="20" cy="20" r="18" fill="#EF4444" />
        \${I.alert(11, 11, '#FFFFFF', 18)}
        <text x="52" y="18" font-size="14" font-weight="800" fill="#FFFFFF">Engineering Chaos Simulation Cockpit</text>
        <text x="52" y="34" font-size="11" fill="#94A3B8">Inject network latency, HTTP 503 gateway outages, and duplicate records in staging to verify non-blocking UX.</text>
      </g>
    </g>

    <!-- Visual System Resilience Topology Diagram Component -->
    <g transform="translate(0, 94)">
      <g filter="url(#cardShadow)">
        <rect width="1142" height="260" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">SYSTEM ARCHITECTURE FAULT-TOLERANCE TOPOLOGY</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Live routing visualization showing non-blocking fallback paths during simulated external gateway outages</text>

          <!-- Component Library Topology Diagram -->
          <g transform="translate(0, 48)">
            <!-- Client Box -->
            <rect x="0" y="24" width="170" height="90" rx="10" fill="#F8FAFC" stroke="#047857" stroke-width="2" />
            <text x="16" y="22" font-size="11" font-weight="800" fill="#047857">TRIBAL PWA CLIENT</text>
            <text x="16" y="42" font-size="12" font-weight="700" fill="#0F172A">Scholar Portal</text>
            <rect x="16" y="54" width="110" height="20" rx="10" fill="#ECFDF5" />
            <text x="71" y="67" font-size="8.5" font-weight="800" fill="#047857" class="badge">ACTIVE BROWSER</text>

            <!-- Connector Lines -->
            <path d="M 170 54 L 280 54 L 280 30 L 360 30" stroke="#EF4444" stroke-width="2" fill="none" stroke-dasharray="4 3" />
            <path d="M 170 70 L 360 70" stroke="#F59E0B" stroke-width="2" fill="none" />
            <path d="M 170 86 L 280 86 L 280 110 L 360 110" stroke="#047857" stroke-width="2" fill="none" />

            <!-- Middle Gateway Gate Nodes -->
            <!-- DigiLocker (503 FAULT) -->
            <g transform="translate(360, 8)">
              <rect width="270" height="44" rx="8" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#DC2626">DigiLocker Gateway</text>
              <rect x="174" y="10" width="84" height="18" rx="9" fill="#EF4444" />
              <text x="216" y="22" font-size="8" font-weight="900" fill="#FFFFFF" class="badge">503 OUTAGE</text>
              <text x="12" y="34" font-size="9" fill="#991B1B">Circuit Tripped ➔ Fallback Active</text>
            </g>

            <!-- Aadhaar (429 RATE LIMIT) -->
            <g transform="translate(360, 56)">
              <rect width="270" height="44" rx="8" fill="#FFFBEB" stroke="#F59E0B" stroke-width="1.5" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#B45309">UIDAI Aadhaar Vault</text>
              <rect x="174" y="10" width="84" height="18" rx="9" fill="#F59E0B" />
              <text x="216" y="22" font-size="8" font-weight="900" fill="#FFFFFF" class="badge">429 LIMIT</text>
              <text x="12" y="34" font-size="9" fill="#78350F">Backoff jitter queue: 2s ➔ 4s ➔ 8s</text>
            </g>

            <!-- Offline Storage -->
            <g transform="translate(360, 104)">
              <rect width="270" height="44" rx="8" fill="#ECFDF5" stroke="#059669" stroke-width="1.5" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">IndexedDB Sandbox</text>
              <rect x="174" y="10" width="84" height="18" rx="9" fill="#047857" />
              <text x="216" y="22" font-size="8" font-weight="900" fill="#FFFFFF" class="badge">OFFLINE OK</text>
              <text x="12" y="34" font-size="9" fill="#065F46">2 mutations queued for sync</text>
            </g>

            <!-- Destination Arrows & Fallback Containers -->
            <path d="M 630 30 L 720 30" stroke="#047857" stroke-width="2" fill="none" />
            <polygon points="720,30 714,26 714,34" fill="#047857" />
            <g transform="translate(724, 8)">
              <rect width="360" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">Encrypted Local OCR &amp; Human Quarantine Desk</text>
              <text x="12" y="34" font-size="9" fill="#15803D">PDF preserved with SHA-256 seal · Zero student blocking</text>
            </g>

            <path d="M 630 78 L 720 78" stroke="#047857" stroke-width="2" fill="none" />
            <polygon points="720,78 714,74 714,82" fill="#047857" />
            <g transform="translate(724, 56)">
              <rect width="360" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">Exponential Jitter Circuit Breaker Handler</text>
              <text x="12" y="34" font-size="9" fill="#15803D">Auto-recovers when UIDAI gateway normalizes</text>
            </g>

            <path d="M 630 126 L 720 126" stroke="#047857" stroke-width="2" fill="none" />
            <polygon points="720,126 714,122 714,130" fill="#047857" />
            <g transform="translate(724, 104)">
              <rect width="360" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">Background Sync ServiceWorker Worker</text>
              <text x="12" y="34" font-size="9" fill="#15803D">Flushes when connectivity restores · Guaranteed LWW</text>
            </g>
          </g>
        </g>
      </g>
    </g>

    <!-- Chaos Controls Grid: Left Donut (380px) & Right Interactive Toggles (742px) -->
    <g transform="translate(0, 370)">
      
      <!-- Left: Chaos Testing Status Donut -->
      <g filter="url(#cardShadow)">
        <rect width="380" height="260" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="13" font-weight="800" fill="#0F172A">CHAOS SIMULATION STATUS</text>
          <text x="0" y="32" font-size="10.5" fill="#64748B">Active fault injection distribution</text>

          <g transform="translate(0, 48)">
            \${renderDonutChartComponent({
              cx: 60,
              cy: 70,
              rOut: 48,
              rIn: 30,
              segments: [
                { label: 'Active Chaos', percent: 40, color: '#EF4444', amount: '2 Faults' },
                { label: 'Nominal Health', percent: 60, color: '#047857', amount: '3 Routes' }
              ],
              centerValue: '40%',
              centerSub: 'Chaos Load',
              legendX: 130,
              legendY: 34,
              legendWidth: 200,
              itemHeight: 28
            })}
          </g>

          <rect x="0" y="196" width="332" height="36" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
          <text x="12" y="218" font-size="10.5" font-weight="700" fill="#047857">✓ 100% Graceful Degradation Guaranteed</text>
        </g>
      </g>

      <!-- Right: Toggle Controls -->
      <g transform="translate(400, 0)" filter="url(#cardShadow)">
        <rect width="742" height="260" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="13" font-weight="800" fill="#0F172A">ACTIVE CHAOS INJECTION TOGGLES</text>

          <!-- Toggle 1: DigiLocker -->
          <g transform="translate(0, 36)">
            <rect width="694" height="52" rx="8" fill="#FEF2F2" stroke="#FCA5A5" />
            <text x="16" y="22" font-size="12" font-weight="800" fill="#991B1B">Simulate DigiLocker Gateway Outage (HTTP 503)</text>
            <text x="16" y="38" font-size="10.5" fill="#7F1D1D">Falls back to manual PDF upload with automated quarantine desk ✓</text>
            <rect x="626" y="12" width="52" height="28" rx="14" fill="#047857" />
            <circle cx="662" cy="26" r="11" fill="#FFFFFF" />
          </g>

          <!-- Toggle 2: PFMS Timeout -->
          <g transform="translate(0, 96)">
            <rect width="694" height="52" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="22" font-size="12" font-weight="700" fill="#0F172A">Simulate PFMS Payment Gateway Delay / Timeout (30s drop)</text>
            <text x="16" y="38" font-size="10.5" fill="#64748B">Queues sanction orders in durable DBT outbox rather than failing</text>
            <rect x="626" y="12" width="52" height="28" rx="14" fill="#CBD5E1" />
            <circle cx="640" cy="26" r="11" fill="#FFFFFF" />
          </g>

          <!-- Toggle 3: Forced Offline Mode -->
          <g transform="translate(0, 156)">
            <rect width="694" height="52" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
            <text x="16" y="22" font-size="12" font-weight="800" fill="#065F46">Forced Remote Tribal Disconnect (Simulated Forest Lack of Signal)</text>
            <text x="16" y="38" font-size="10.5" fill="#047857">Forces browser into ServiceWorker offline sandbox; routes to IndexedDB ✓</text>
            <rect x="626" y="12" width="52" height="28" rx="14" fill="#047857" />
            <circle cx="662" cy="26" r="11" fill="#FFFFFF" />
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 6. SCREEN 19: Forensic Audit Log
// =============================================================
const newScreen19 = `function make19ForensicAuditLog() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('officer/audit', 'Tribe Saarthi · Forensic Cryptographic Audit Trail')}
  \${renderSidebar('audit', 'officer')}
  \${renderHeader('Cryptographic Audit Trail', 'Immutable append-only system ledger recording all statutory approvals, decisions, and disbursements', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Top Verification Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="80" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 18)">
        <circle cx="22" cy="22" r="22" fill="#ECFDF5" />
        \${I.shield(12, 12, '#047857', 20)}
        <text x="56" y="18" font-size="15" font-weight="800" fill="#0F172A">Audit Ledger Integrity Verified (Merkle Tree Height: 24)</text>
        <text x="56" y="36" font-size="11" fill="#64748B">Root Digest: <tspan class="mono">#77ab42f8...9910c</tspan> · Synced with National Informatics Centre (NIC) Timestamp Authority</text>

        <rect x="940" y="6" width="160" height="36" rx="8" fill="url(#brandGrad)" />
        <text x="1020" y="29" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Verify Chain Hashes ✓</text>
      </g>
    </g>

    <!-- Table Card with Merkle Hash Chain & Event Donut Component -->
    <g transform="translate(0, 102)" filter="url(#cardShadow)">
      <rect width="1142" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">System Activity &amp; Decision Ledger</text>
        <text x="0" y="32" font-size="11" fill="#64748B">Every event is signed with the actor's cryptographic token and recorded permanently</text>

        <!-- Table Header -->
        <g transform="translate(0, 52)">
          <rect width="1086" height="34" rx="6" fill="#F8FAFC" />
          <text x="16" y="21" font-size="10.5" font-weight="800" fill="#64748B">EVENT #</text>
          <text x="100" y="21" font-size="10.5" font-weight="800" fill="#64748B">ACTION NAME</text>
          <text x="310" y="21" font-size="10.5" font-weight="800" fill="#64748B">ACTOR</text>
          <text x="490" y="21" font-size="10.5" font-weight="800" fill="#64748B">TARGET RECORD</text>
          <text x="680" y="21" font-size="10.5" font-weight="800" fill="#64748B">TIMESTAMP</text>
          <text x="860" y="21" font-size="10.5" font-weight="800" fill="#64748B">SHA-256 HASH</text>
          <text x="1010" y="21" font-size="10.5" font-weight="800" fill="#64748B">STATUS</text>
        </g>

        <!-- Row 1 -->
        <g transform="translate(0, 96)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9824</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#047857">SANCTION_ORDER_SIGNED</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">Dr. K. Soren (BIT Desk)</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 15:45:00 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">4f12de90...81</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Row 2 -->
        <g transform="translate(0, 138)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9823</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#B45309">OFFICER_REVIEW_START</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">Dr. K. Soren (BIT Desk)</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 15:40:12 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">9921bc10...14</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Row 3 -->
        <g transform="translate(0, 180)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9822</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#2563EB">DIGILOCKER_SEAL_PASS</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">MoTA Gateway Daemon</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">Caste Cert #4910</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 14:22:05 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">a78f21bb...02</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Row 4 -->
        <g transform="translate(0, 222)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9821</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#0F172A">APPLICATION_SUBMITTED</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">Scholar: Mohan Birhor</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 14:22:01 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">e3b0c442...99</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Bottom Forensic Intelligence Section -->
        <g transform="translate(0, 280)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#E2E8F0" />

          <!-- Left: Merkle Hash-Chain Cryptographic Diagram -->
          <g transform="translate(0, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#047857">IMMUTABLE MERKLE HASH-CHAIN LINKAGE</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">Each block payload contains the SHA-256 header hash of the preceding statutory event</text>
            
            <g transform="translate(0, 44)">
              \${renderMerkleChainComponent({
                x: 0,
                y: 0,
                width: 720,
                blocks: [
                  { id: '9821', action: 'APP_SUBMITTED', hash: 'e3b0...99', color: '#64748B' },
                  { id: '9822', action: 'DIGILOCKER_PASS', hash: 'a78f...02', color: '#2563EB' },
                  { id: '9823', action: 'NODAL_REVIEW', hash: '9921...14', color: '#F59E0B' },
                  { id: '9824', action: 'SANCTION_SIGNED', hash: '4f12...81', color: '#047857' }
                ]
              })}
            </g>

            <rect x="0" y="140" width="720" height="42" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
            <text x="16" y="165" font-size="11" font-weight="700" fill="#047857">✓ Merkle Tree Proof Root: 77ab42f8...9910c (NIC Timestamp Authority Verified)</text>
          </g>

          <!-- Right: Audit Event Distribution Donut Chart -->
          <g transform="translate(760, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#0F172A">EVENT TYPE BREAKDOWN</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">Historical audit ledger distribution</text>

            <g transform="translate(0, 44)">
              <rect width="326" height="138" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              \${renderDonutChartComponent({
                cx: 56,
                cy: 69,
                rOut: 44,
                rIn: 28,
                segments: [
                  { label: 'Sanction DSC', percent: 35, color: '#047857', amount: '3,438' },
                  { label: 'Vault Seals', percent: 25, color: '#2563EB', amount: '2,456' },
                  { label: 'Officer Review', percent: 25, color: '#F59E0B', amount: '2,456' },
                  { label: 'Ingestions', percent: 15, color: '#64748B', amount: '1,474' }
                ],
                centerValue: '9.8K',
                centerSub: 'Audit Logs',
                legendX: 118,
                legendY: 20,
                legendWidth: 198,
                itemHeight: 26
              })}
            </g>
          </g>

        </g>
      </g>
    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 7. SCREEN 22: Public Receipt Verification
// =============================================================
const newScreen22 = `function make22PublicReceiptVerification() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('verify?receipt=JH-ST-2026-89412', 'Tribe Saarthi · Public Scholarship Verification')}

  <!-- Canvas -->
  <g transform="translate(0, 41)">
    
    <!-- Top Government Masthead -->
    <rect width="1440" height="74" fill="#FFFFFF" stroke="#E2E8F0" />
    <g transform="translate(60, 16)">
      <circle cx="20" cy="20" r="20" fill="url(#brandGrad)" />
      <text x="20" y="26" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>

      <text x="52" y="18" font-size="15" font-weight="900" fill="#0F172A">Ministry of Tribal Affairs · Government of India</text>
      <text x="52" y="34" font-size="11" font-weight="700" fill="#B45309">PUBLIC DIGITAL SANCTION VERIFICATION PORTAL</text>
    </g>

    <!-- Centered Tamper-Evident Receipt Certificate Card (780px x 720px) -->
    <g transform="translate(330, 100)" filter="url(#heroShadow)">
      <rect width="780" height="740" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
      <rect width="780" height="6" rx="3" fill="url(#brandGrad)" />

      <g transform="translate(48, 28)">
        
        <!-- Official Verified Stamp Banner -->
        <g transform="translate(0, 0)">
          <rect width="684" height="60" rx="10" fill="#ECFDF5" stroke="#A7F3D0" />
          <circle cx="36" cy="30" r="18" fill="#047857" />
          \${I.shield(26, 20, '#FFFFFF', 20)}

          <text x="68" y="25" font-size="14" font-weight="800" fill="#047857">OFFICIAL MoTA VERIFIED SANCTION RECEIPT</text>
          <text x="68" y="42" font-size="11" fill="#065F46">Statutory scholarship sanction verified against Ministry Public Key Ledger</text>
        </g>

        <!-- Receipt Metadata Table -->
        <g transform="translate(0, 76)">
          <!-- Row 1 -->
          <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">BENEFICIARY SCHOLAR</text>
          <text x="360" y="14" font-size="11" font-weight="700" fill="#64748B">APPLICATION REFERENCE ID</text>
          
          <text x="0" y="36" font-size="15" font-weight="800" fill="#0F172A">Mohan Birhor</text>
          <text x="0" y="52" font-size="11" fill="#64748B">S/o Somra Birhor · Latehar, Jharkhand</text>

          <text x="360" y="36" font-size="15" font-weight="800" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="360" y="52" font-size="11" fill="#64748B">Sanction Order: <tspan class="mono">MOTA/2026/SCH/89412</tspan></text>

          <line x1="0" y1="68" x2="684" y2="68" stroke="#F1F5F9" />

          <!-- Row 2 -->
          <g transform="translate(0, 78)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">ENROLLED INSTITUTION &amp; COURSE</text>
            <text x="360" y="14" font-size="11" font-weight="700" fill="#64748B">TRIBAL COMMUNITY CLASSIFICATION</text>

            <text x="0" y="34" font-size="13" font-weight="700" fill="#0F172A">Birla Institute of Technology (BIT Mesra)</text>
            <text x="0" y="50" font-size="11" fill="#64748B">B.Tech Computer Science &amp; Engg. (Roll: 2024-CSE-104)</text>

            <text x="360" y="34" font-size="13" font-weight="800" fill="#B45309">Birhor (PVTG Tier-1 Priority)</text>
            <text x="360" y="50" font-size="11" fill="#059669">100% Tuition + Maintenance Grant</text>
          </g>

          <line x1="0" y1="146" x2="684" y2="146" stroke="#F1F5F9" />

          <!-- Row 3: Amount Disbursed -->
          <g transform="translate(0, 156)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">TOTAL SANCTIONED AMOUNT</text>
            <text x="360" y="14" font-size="11" font-weight="700" fill="#64748B">PFMS DBT CHANNEL</text>

            <text x="0" y="42" font-size="24" font-weight="900" fill="#047857">₹132,000.00</text>
            <text x="0" y="58" font-size="10.5" fill="#64748B">Full Grant: Tuition ₹98K + Maintenance ₹34K</text>

            <text x="360" y="36" font-size="13" font-weight="800" fill="#0F172A">Bank of India (Aadhaar Seeded)</text>
            <text x="360" y="52" font-size="11" fill="#64748B">Account: <tspan class="mono">••••••••9012</tspan> · NPCI Status: Active</text>
          </g>
        </g>

        <!-- Cryptographic Proof Box & QR Code -->
        <g transform="translate(0, 320)">
          <rect width="684" height="136" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          
          <g transform="translate(20, 18)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">CRYPTOGRAPHIC RECEIPT SHA-256 DIGEST</text>
            <text x="0" y="34" font-size="10" font-weight="700" fill="#065F46" class="mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</text>

            <text x="0" y="60" font-size="10.5" fill="#475569">Certified by Digital Signature: <tspan font-weight="700">Dr. K. Soren, Associate Professor, BIT Mesra</tspan></text>
            <text x="0" y="76" font-size="10.5" fill="#475569">Ministry Public Key ID: <tspan class="mono">MOTA-ROOT-CA-2026</tspan> · Timestamp: 18 Oct 2026, 15:45:00 IST</text>
          </g>

          <!-- Vector QR Code Graphic -->
          <g transform="translate(566, 18)">
            <rect width="90" height="90" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
            <rect x="8" y="8" width="24" height="24" fill="#0F172A" />
            <rect x="58" y="8" width="24" height="24" fill="#0F172A" />
            <rect x="8" y="58" width="24" height="24" fill="#0F172A" />
            <rect x="38" y="38" width="14" height="14" fill="#0F172A" />
            <text x="45" y="104" font-size="7.5" font-weight="700" fill="#64748B" text-anchor="middle" class="mono">PUBLIC QR</text>
          </g>
        </g>

        <!-- Component Library: End-to-End Cryptographic Trust Pathway Diagram -->
        <g transform="translate(0, 474)">
          <rect width="684" height="106" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="16" y="20" font-size="10.5" font-weight="800" fill="#047857">END-TO-END CRYPTOGRAPHIC TRUST PATHWAY</text>
          \${renderStepperPipelineComponent({
            x: 10,
            y: 28,
            width: 664,
            steps: [
              { title: 'Biometrics', sub: 'UIDAI Match', status: 'done', badge: 'VERIFIED' },
              { title: 'DigiLocker', sub: 'SDO Seal', status: 'done', badge: 'SEALED ✓' },
              { title: 'Officer DSC', sub: 'Class-3 Token', status: 'done', badge: 'SIGNED ✓' },
              { title: 'Merkle Anchor', sub: 'NIC Timestamp', status: 'done', badge: 'ROOT #77ab' },
              { title: 'PFMS DBT', sub: 'Bank of India', status: 'done', badge: 'SETTLED ✓' }
            ]
          })}
        </g>

        <!-- Actions -->
        <g transform="translate(0, 604)">
          <rect width="684" height="46" rx="8" fill="url(#brandGrad)" />
          \${I.download(240, 14, '#FFFFFF', 18)}
          <text x="352" y="28" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Download Signed PDF Certificate (Tamper-Sealed) →</text>
        </g>

      </g>
    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 8. SCREEN 10: Student Profile & PVTG
// =============================================================
const newScreen10 = `function make10StudentProfileAndPvtg() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('scholar/profile', 'Tribe Saarthi · Scholar Profile &amp; PVTG Identity')}
  \${renderSidebar('profile', 'student')}
  \${renderHeader('Scholar Demographic Profile', 'Verified identity, tribal community classification, and banking integration', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Top Hero Scholar Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="110" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 20)">
        <circle cx="35" cy="35" r="35" fill="url(#brandGrad)" />
        <text x="35" y="42" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">MB</text>

        <text x="86" y="26" font-size="18" font-weight="800" fill="#0F172A">Mohan Birhor</text>
        <text x="86" y="46" font-size="12" fill="#64748B">Birla Institute of Technology (BIT Mesra) · B.Tech Computer Science (2nd Year)</text>
        <text x="86" y="64" font-size="11" fill="#059669" font-weight="600">Enrolled Roll #2024-CSE-104 · Domicile: Latehar District, Jharkhand</text>

        <rect x="940" y="16" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="1020" y="37" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Request Data Update</text>
      </g>
    </g>

    <!-- Two-Column Profile Details (556px each) -->
    <g transform="translate(0, 130)">
      
      <!-- Left Column: Verified Tribal Demographics with PVTG Grant Allocation Donut -->
      <g filter="url(#cardShadow)">
        <rect width="556" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Verified Tribal Demographics</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Certified by Government of Jharkhand &amp; SDO Latehar</text>

          <g transform="translate(0, 48)">
            <!-- Item 1 -->
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">TRIBAL COMMUNITY CLASSIFICATION</text>
            <text x="0" y="34" font-size="14" font-weight="800" fill="#0F172A">Birhor Scheduled Tribe</text>
            <rect x="360" y="18" width="140" height="22" rx="11" fill="#FEF3C7" stroke="#FDE68A" />
            <text x="430" y="33" font-size="9" font-weight="800" fill="#92400E" class="badge">PVTG TIER-1 PRIORITY</text>
            <line x1="0" y1="48" x2="508" y2="48" stroke="#F1F5F9" />

            <!-- Item 2 -->
            <text x="0" y="68" font-size="11" font-weight="700" fill="#64748B">DOMICILE RESIDENCE</text>
            <text x="0" y="86" font-size="12.5" font-weight="700" fill="#0F172A">Village: Belta, Block: Mahuadanr, Latehar District, Jharkhand</text>
            <line x1="0" y1="100" x2="508" y2="100" stroke="#F1F5F9" />

            <!-- Item 3 -->
            <text x="0" y="120" font-size="11" font-weight="700" fill="#64748B">FAMILY &amp; GUARDIAN</text>
            <text x="0" y="138" font-size="12.5" font-weight="700" fill="#0F172A">Somra Birhor (Father) · Mobile: +91 94311 •••••</text>
            <line x1="0" y1="152" x2="508" y2="152" stroke="#F1F5F9" />

            <!-- Item 4: Statutory PVTG Entitlements Donut & Component Chips -->
            <g transform="translate(0, 168)">
              <rect width="508" height="240" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
              <g transform="translate(18, 16)">
                <text x="0" y="14" font-size="12" font-weight="800" fill="#92400E">STATUTORY PVTG TIER-1 ENTITLEMENT BREAKDOWN</text>
                <text x="0" y="30" font-size="10.5" fill="#78350F">MoTA Order No. MOTA/PVTG/2026/410 · 100% Comprehensive State Coverage</text>

                <!-- Component Library Donut -->
                <g transform="translate(0, 42)">
                  \${renderDonutChartComponent({
                    cx: 52,
                    cy: 50,
                    rOut: 44,
                    rIn: 26,
                    segments: [
                      { label: 'Full Tuition Grant', percent: 74, color: '#047857', amount: '₹98K' },
                      { label: 'Monthly Maintenance', percent: 18, color: '#2563EB', amount: '₹24K' },
                      { label: 'Special Book Grant', percent: 8, color: '#D97706', amount: '₹10K' }
                    ],
                    centerValue: '100%',
                    centerSub: 'Covered',
                    legendX: 114,
                    legendY: 14,
                    legendWidth: 260,
                    itemHeight: 25
                  })}
                </g>

                <!-- Entitlement Feature Badges -->
                <g transform="translate(0, 162)">
                  <rect x="0" y="0" width="150" height="28" rx="14" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="75" y="18" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">Zero Parent Contribution</text>

                  <rect x="158" y="0" width="150" height="28" rx="14" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="233" y="18" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">Monthly Stipend ₹2,000</text>

                  <rect x="316" y="0" width="154" height="28" rx="14" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="393" y="18" font-size="9.5" font-weight="800" fill="#047857" text-anchor="middle">Direct Aadhaar DBT Credit</text>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      <!-- Right Column: Identity Numbers & Bank DBT Seeding -->
      <g transform="translate(586, 0)" filter="url(#cardShadow)">
        <rect width="556" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 22)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">National Identity &amp; Banking</text>
          <text x="0" y="32" font-size="11" fill="#64748B">UIDAI Token Vault and Aadhaar-seeded PFMS disbursement</text>

          <g transform="translate(0, 52)">
            <!-- Item 1: Aadhaar -->
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">AADHAAR IDENTIFICATION (MASKED)</text>
            <text x="0" y="34" font-size="14" font-weight="800" fill="#0F172A" class="mono">•••• •••• 4921</text>
            <rect x="360" y="18" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="33" font-size="9" font-weight="800" fill="#047857" class="badge">UIDAI VERIFIED ✓</text>
            <line x1="0" y1="50" x2="508" y2="50" stroke="#F1F5F9" />

            <!-- Item 2: APAAR -->
            <text x="0" y="74" font-size="11" font-weight="700" fill="#64748B">ACADEMIC APAAR / ABC ID</text>
            <text x="0" y="94" font-size="14" font-weight="800" fill="#0F172A" class="mono">9482-1049-5821</text>
            <rect x="360" y="78" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="93" font-size="9" font-weight="800" fill="#047857" class="badge">ABC VAULT SYNC ✓</text>
            <line x1="0" y1="110" x2="508" y2="110" stroke="#F1F5F9" />

            <!-- Item 3: Bank Account -->
            <text x="0" y="134" font-size="11" font-weight="700" fill="#64748B">PRIMARY DBT BANK ACCOUNT</text>
            <text x="0" y="154" font-size="14" font-weight="800" fill="#0F172A">Bank of India (Mesra Branch, Ranchi)</text>
            <text x="0" y="172" font-size="11" fill="#64748B">A/C: <tspan class="mono">••••••••9012</tspan> · IFSC: <tspan class="mono">BKID0004910</tspan></text>
            <rect x="360" y="138" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="153" font-size="9" font-weight="800" fill="#047857" class="badge">NPCI SEEDED ✓</text>
            <line x1="0" y1="190" x2="508" y2="190" stroke="#F1F5F9" />

            <!-- Item 4: DigiLocker Link -->
            <text x="0" y="214" font-size="11" font-weight="700" fill="#64748B">DIGILOCKER CONSENT STATUS</text>
            <text x="0" y="234" font-size="13" font-weight="700" fill="#0F172A">Tokenized Direct Read Access</text>
            <text x="0" y="250" font-size="11" fill="#047857">4 of 4 statutory certificates mapped to vault</text>
            <rect x="360" y="218" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="233" font-size="9" font-weight="800" fill="#047857" class="badge">CONSENT ACTIVE ✓</text>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 9. SCREEN 12: Offline Sync Queue
// =============================================================
const newScreen12 = `function make12OfflineSyncQueue() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('scholar/offline', 'Tribe Saarthi · Offline Operations Queue')}
  \${renderSidebar('offline', 'student')}
  \${renderHeader('Offline Operations Queue', 'Transactions captured in remote areas are stored in local IndexedDB and synced upon reconnection', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Network State Card -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="88" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 20)">
        <circle cx="24" cy="24" r="24" fill="#FEF3C7" />
        \${I.sync(14, 14, '#D97706', 20)}
        <text x="60" y="20" font-size="15" font-weight="800" fill="#0F172A">Simulated Remote Tribal Area · Offline Mode Active</text>
        <text x="60" y="38" font-size="11" fill="#B45309">2 operations queued in browser IndexedDB vault · Auto-sync triggers when network connects</text>

        <rect x="760" y="8" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="840" y="29" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Export Encrypted Backup</text>

        <rect x="936" y="8" width="160" height="34" rx="8" fill="url(#brandGrad)" />
        <text x="1016" y="29" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Force Sync Queue</text>
      </g>
    </g>

    <!-- Queue Table Card with CRDT Pipeline & Queue Status Donut -->
    <g transform="translate(0, 110)" filter="url(#cardShadow)">
      <rect width="1142" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Queued Operations Ledger</text>
        <text x="0" y="32" font-size="11" fill="#64748B">IndexedDB storage partition: <tspan class="mono">ts_offline_journal_v2</tspan> · AES-256 local encryption</text>

        <!-- Table Header -->
        <g transform="translate(0, 54)">
          <rect width="1086" height="36" rx="6" fill="#F8FAFC" />
          <text x="16" y="22" font-size="10.5" font-weight="800" fill="#64748B">OP ID</text>
          <text x="110" y="22" font-size="10.5" font-weight="800" fill="#64748B">ACTION TYPE</text>
          <text x="280" y="22" font-size="10.5" font-weight="800" fill="#64748B">PAYLOAD SUMMARY</text>
          <text x="620" y="22" font-size="10.5" font-weight="800" fill="#64748B">LOCAL TIMESTAMP</text>
          <text x="810" y="22" font-size="10.5" font-weight="800" fill="#64748B">STATUS</text>
          <text x="960" y="22" font-size="10.5" font-weight="800" fill="#64748B">INTEGRITY</text>
        </g>

        <!-- Row 1: OP-104 -->
        <g transform="translate(0, 102)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">OP-104</text>
          <text x="110" y="24" font-size="12" font-weight="700" fill="#0F172A">Address Update</text>
          <text x="280" y="24" font-size="11.5" fill="#475569">Updated domicile hamlet: Belta, Mahuadanr, Latehar</text>
          <text x="620" y="24" font-size="11" fill="#64748B" class="mono">14:12:05 IST</text>
          
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#FEF3C7" />
          <text x="865" y="25" font-size="9" font-weight="800" fill="#B45309" class="badge">QUEUED LOCALLY</text>
          
          <text x="960" y="24" font-size="10" fill="#64748B" class="mono">SHA: a89f3b...</text>
        </g>

        <!-- Row 2: OP-105 -->
        <g transform="translate(0, 154)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">OP-105</text>
          <text x="110" y="24" font-size="12" font-weight="700" fill="#0F172A">Upload Document</text>
          <text x="280" y="24" font-size="11.5" fill="#475569">File: bit_mesra_fee_receipt.pdf (1.2 MB)</text>
          <text x="620" y="24" font-size="11" fill="#64748B" class="mono">14:15:30 IST</text>
          
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#FEF3C7" />
          <text x="865" y="25" font-size="9" font-weight="800" fill="#B45309" class="badge">QUEUED LOCALLY</text>
          
          <text x="960" y="24" font-size="10" fill="#64748B" class="mono">SHA: c7219e...</text>
        </g>

        <!-- Row 3: OP-103 (Synced) -->
        <g transform="translate(0, 206)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#64748B" class="mono">OP-103</text>
          <text x="110" y="24" font-size="12" font-weight="600" fill="#64748B">Draft Step 2</text>
          <text x="280" y="24" font-size="11.5" fill="#64748B">Document slot confirmations &amp; seals</text>
          <text x="620" y="24" font-size="11" fill="#94A3B8" class="mono">10:02:11 IST</text>
          
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#ECFDF5" />
          <text x="865" y="25" font-size="9" font-weight="800" fill="#047857" class="badge">SYNCED &amp; ACKED</text>
          
          <text x="960" y="24" font-size="10" fill="#047857" class="mono">ACK: #9921 ✓</text>
        </g>

        <!-- Lower Intelligence Section: CRDT Pipeline & Queue Status Donut -->
        <g transform="translate(0, 280)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#E2E8F0" />

          <!-- Left: CRDT Conflict-Free Synchronization Pipeline Diagram -->
          <g transform="translate(0, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#047857">DETERMINISTIC LAST-WRITE-WINS (LWW) SYNC PIPELINE</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">Mathematical CRDT rules ensure zero data loss and eliminate overwrites between offline client and officer decisions</text>
            
            <g transform="translate(0, 44)">
              <rect width="720" height="120" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              \${renderStepperPipelineComponent({
                x: 12,
                y: 20,
                width: 696,
                steps: [
                  { title: 'Local Journal', sub: 'IndexedDB AES-256', status: 'done', badge: 'STORED ✓' },
                  { title: 'Network Probe', sub: 'Connectivity Hook', status: 'active', badge: 'WAITING NET' },
                  { title: 'LWW Arbiter', sub: 'Timestamp Check', status: 'upcoming', badge: 'CRDT MERGE' },
                  { title: 'MoTA Ledger', sub: 'Immutable Sync', status: 'upcoming', badge: 'NIC SEAL' }
                ]
              })}
            </g>
          </g>

          <!-- Right: Queue Status Donut Chart -->
          <g transform="translate(760, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#0F172A">QUEUE SYNC STATUS</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">IndexedDB partition distribution</text>

            <g transform="translate(0, 44)">
              <rect width="326" height="120" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              \${renderDonutChartComponent({
                cx: 56,
                cy: 60,
                rOut: 40,
                rIn: 25,
                segments: [
                  { label: 'Queued Locally', percent: 67, color: '#D97706', amount: '2 Ops' },
                  { label: 'Synced &amp; Acked', percent: 33, color: '#047857', amount: '1 Op' }
                ],
                centerValue: '3 Ops',
                centerSub: 'Vault',
                legendX: 116,
                legendY: 26,
                legendWidth: 196,
                itemHeight: 28
              })}
            </g>
          </g>

        </g>
      </g>
    </g>

  </g>
</svg>\`;
}`;

// =============================================================
// 10. SCREEN 01: Scholar Dashboard Desktop
// =============================================================
const newScreen01 = `function make01ScholarDashboardDesktop() {
  return \`<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  \${makeDefs()}
  \${renderDesktopChrome('scholar/dashboard', 'Tribe Saarthi · Scholar Dashboard')}
  \${renderSidebar('home', 'student')}
  \${renderHeader('Scholar Dashboard', 'Welcome back, Mohan Birhor · BIT Mesra · Domicile: Ranchi, Jharkhand', 'student')}

  <!-- Main Viewport Content -->
  <g transform="translate(274, 120)">
    
    <!-- 1. Immediate Task-First Application Tracker Hero Card (Above the Fold) -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="156" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <rect width="1142" height="4" rx="2" fill="url(#brandGrad)" />
      
      <!-- Card Header Row -->
      <g transform="translate(24, 20)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Post-Matric Scholarship for ST Students (2026-27)</text>
        <text x="0" y="34" font-size="11" font-weight="500" fill="#64748B">Application ID: <tspan font-family="JetBrains Mono" font-weight="600" fill="#0F172A">JH-ST-2026-89412</tspan> · Submitted on 12 Oct 2026</text>
        
        <!-- Sanction Amount Badge -->
        <rect x="760" y="0" width="180" height="34" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
        <text x="772" y="22" font-size="12" font-weight="800" fill="#047857">₹132,000 Sanctioned</text>
        <text x="898" y="22" font-size="9" font-weight="700" fill="#059669">DBT PENDING</text>

        <!-- Action Button -->
        <rect x="954" y="0" width="140" height="34" rx="8" fill="url(#goldButtonGrad)" />
        <text x="1024" y="21" font-size="11" font-weight="800" fill="#78350F" text-anchor="middle">View Sanction Slip →</text>
      </g>

      <!-- 4-Stage Horizontal Stepper (MUI AlternativeLabel Pattern) -->
      <g transform="translate(60, 84)">
        <!-- Connecting Track -->
        <line x1="30" y1="16" x2="980" y2="16" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" />
        <line x1="30" y1="16" x2="340" y2="16" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        
        <!-- Stage 1: Done -->
        <circle cx="30" cy="16" r="16" fill="#047857" />
        \${I.check(21, 7, '#FFFFFF', 18)}
        <text x="30" y="46" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">Applied &amp; Sealed</text>
        <text x="30" y="58" font-size="9.5" fill="#64748B" text-anchor="middle">12 Oct · Verified ✓</text>

        <!-- Stage 2: Active (College Desk) -->
        <circle cx="340" cy="16" r="16" fill="url(#amberGrad)" filter="url(#cardShadow)" />
        <circle cx="340" cy="16" r="22" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3" />
        \${I.clock(331, 7, '#FFFFFF', 18)}
        <text x="340" y="46" font-size="11" font-weight="800" fill="#B45309" text-anchor="middle">College Nodal Review</text>
        <text x="340" y="58" font-size="9.5" font-weight="600" fill="#D97706" text-anchor="middle">Active at BIT Mesra Desk</text>

        <!-- Stage 3: Upcoming -->
        <circle cx="670" cy="16" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="670" y="20" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">3</text>
        <text x="670" y="46" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Ministry Sanction</text>
        <text x="670" y="58" font-size="9.5" fill="#94A3B8" text-anchor="middle">State Welfare Level</text>

        <!-- Stage 4: Upcoming -->
        <circle cx="980" cy="16" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="980" y="20" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">4</text>
        <text x="980" y="46" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Direct Bank Transfer</text>
        <text x="980" y="58" font-size="9.5" fill="#94A3B8" text-anchor="middle">Aadhaar Seeded DBT</text>
      </g>
    </g>

    <!-- 2. Three Metric Cards Row -->
    <g transform="translate(0, 176)">
      <!-- Card 1: Sanctioned Benefit -->
      <g filter="url(#cardShadow)">
        <rect width="364" height="116" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="364" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 20)">
          <circle cx="20" cy="20" r="20" fill="#ECFDF5" />
          \${I.shield(10, 10, '#047857', 20)}
          <text x="52" y="16" font-size="11" font-weight="700" fill="#64748B">SANCTIONED BENEFIT</text>
          <text x="52" y="38" font-size="20" font-weight="800" fill="#0F172A">₹132,000 <tspan font-size="12" font-weight="500" fill="#64748B">/ year</tspan></text>
          <text x="0" y="72" font-size="11" fill="#059669" font-weight="600">✓ Full Tuition (₹98K) + Maintenance (₹34K)</text>
        </g>
      </g>

      <!-- Card 2: Reusable Documents -->
      <g transform="translate(388, 0)" filter="url(#cardShadow)">
        <rect width="364" height="116" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="364" height="4" rx="2" fill="#2563EB" />
        <g transform="translate(20, 20)">
          <circle cx="20" cy="20" r="20" fill="#EFF6FF" />
          \${I.docCheck(10, 10, '#2563EB', 20)}
          <text x="52" y="16" font-size="11" font-weight="700" fill="#64748B">DIGILOCKER VAULT</text>
          <text x="52" y="38" font-size="20" font-weight="800" fill="#0F172A">4 / 4 Verified</text>
          <text x="0" y="72" font-size="11" fill="#2563EB" font-weight="600">✓ Caste, Income, Marksheet &amp; Bonafide</text>
        </g>
      </g>

      <!-- Card 3: Scholar Identity -->
      <g transform="translate(778, 0)" filter="url(#cardShadow)">
        <rect width="364" height="116" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="364" height="4" rx="2" fill="#D97706" />
        <g transform="translate(20, 20)">
          <circle cx="20" cy="20" r="20" fill="#FEF3C7" />
          \${I.user(10, 10, '#D97706', 20)}
          <text x="52" y="16" font-size="11" font-weight="700" fill="#64748B">SCHOLAR IDENTITY</text>
          <text x="52" y="36" font-size="13" font-weight="700" fill="#0F172A">APAAR: <tspan class="mono" font-weight="600">9482-1049-5821</tspan></text>
          <text x="52" y="52" font-size="11" font-weight="600" fill="#64748B">Aadhaar: •••• •••• 4921</text>
          <text x="0" y="72" font-size="11" fill="#D97706" font-weight="600">✓ Birhor Community · Latehar, Jharkhand</text>
        </g>
      </g>
    </g>

    <!-- 3. Bottom Grid: Multi-Registry Verification with Radial Progress & Saarthi Assistant -->
    <g transform="translate(0, 312)">
      <!-- Left Panel (700px): Government Registry Verification Transparency -->
      <g filter="url(#cardShadow)">
        <rect width="700" height="480" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        
        <!-- Header with Radial Meter Component -->
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Government Registry Cross-Verification</text>
          <text x="0" y="34" font-size="11" fill="#64748B">Automated verification status across central and state government registries</text>
          
          <!-- Radial Progress Ring Component -->
          <g transform="translate(560, 2)">
            \${renderDonutChartComponent({
              cx: 30,
              cy: 20,
              rOut: 20,
              rIn: 13,
              segments: [
                { label: 'Cleared', percent: 75, color: '#047857' },
                { label: 'Pending', percent: 25, color: '#D97706' }
              ],
              centerValue: '75%',
              centerSub: ''
            })}
            <rect x="58" y="10" width="76" height="20" rx="10" fill="#ECFDF5" />
            <text x="96" y="23" font-size="8.5" font-weight="800" fill="#047857" class="badge">3/4 CLEAR</text>
          </g>
        </g>
        <line x1="24" y1="74" x2="676" y2="74" stroke="#F1F5F9" stroke-width="1" />

        <!-- Registry Row 1: UIDAI -->
        <g transform="translate(24, 90)">
          <rect width="652" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="34" cy="34" r="16" fill="#ECFDF5" />
          \${I.checkCircle(25, 25, '#10B981', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">UIDAI Aadhaar Vault &amp; Demographic Match</text>
          <text x="64" y="46" font-size="11" fill="#64748B">Biometric token authenticated · DOB &amp; Name 100% matched with Aadhaar registry</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#ECFDF5" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Registry Row 2: State e-District ST Certificate -->
        <g transform="translate(24, 168)">
          <rect width="652" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="34" cy="34" r="16" fill="#ECFDF5" />
          \${I.checkCircle(25, 25, '#10B981', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">Jharkhand State e-District ST Registry</text>
          <text x="64" y="46" font-size="11" fill="#64748B">Certificate #JH/ST/2022/4910 · Issued by SDO Latehar · Birhor PVTG Validated</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#ECFDF5" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Registry Row 3: Revenue Income Registry -->
        <g transform="translate(24, 246)">
          <rect width="652" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="34" cy="34" r="16" fill="#ECFDF5" />
          \${I.checkCircle(25, 25, '#10B981', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">Revenue Department Income Certificate</text>
          <text x="64" y="46" font-size="11" fill="#64748B">Annual Family Income: ₹1,20,000 · Valid till 31 March 2027 · Non-creamy layer</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#ECFDF5" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Registry Row 4: AISHE College Enrollment -->
        <g transform="translate(24, 324)">
          <rect width="652" height="68" rx="10" fill="#FFFBEB" stroke="#FDE68A" />
          <circle cx="34" cy="34" r="16" fill="#FEF3C7" />
          \${I.clock(25, 25, '#D97706', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">AISHE College Enrollment &amp; Attendance</text>
          <text x="64" y="46" font-size="11" fill="#B45309">BIT Mesra · B.Tech CSE (Roll: 2024-CSE-104) · Awaiting Nodal Officer Approval</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#FEF3C7" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#B45309" class="badge">IN REVIEW</text>
        </g>

        <!-- Honest Verification Guarantee Box -->
        <g transform="translate(24, 404)">
          <rect width="652" height="54" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
          \${I.shield(36, 417, '#047857', 20)}
          <text x="68" y="425" font-size="11" font-weight="700" fill="#047857">MoTA Honest Verification Guarantee</text>
          <text x="68" y="442" font-size="10" fill="#475569">If automated registry sync is unavailable, your application routes automatically to human review without cancellation.</text>
        </g>
      </g>

      <!-- Right Panel (422px): Milestone Notices & Saarthi AI Prompt -->
      <g transform="translate(720, 0)">
        <!-- Milestone Updates Card -->
        <g filter="url(#cardShadow)">
          <rect width="422" height="250" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(20, 20)">
            <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Official Milestone Notices</text>
            <text x="0" y="32" font-size="11" fill="#64748B">Authoritative updates from Ministry and Institution</text>
          </g>
          <line x1="20" y1="62" x2="402" y2="62" stroke="#F1F5F9" />

          <!-- Update 1 -->
          <g transform="translate(20, 76)">
            <circle cx="8" cy="12" r="4" fill="#10B981" />
            <text x="20" y="14" font-size="12" font-weight="700" fill="#0F172A">BIT Mesra Desk Verification Begun</text>
            <text x="20" y="30" font-size="10.5" fill="#64748B">Dr. K. Soren opened your case file for bonafide verification.</text>
            <text x="20" y="44" font-size="9.5" fill="#94A3B8" class="mono">14 Oct 2026 · 11:42 AM</text>
          </g>

          <!-- Update 2 -->
          <g transform="translate(20, 140)">
            <circle cx="8" cy="12" r="4" fill="#059669" />
            <text x="20" y="14" font-size="12" font-weight="700" fill="#0F172A">DigiLocker Cryptographic Seal Passed</text>
            <text x="20" y="30" font-size="10.5" fill="#64748B">Caste certificate SHA-256 matches Jharkhand state vault.</text>
            <text x="20" y="44" font-size="9.5" fill="#94A3B8" class="mono">12 Oct 2026 · 02:22 PM</text>
          </g>

          <!-- View all updates link -->
          <text x="20" y="228" font-size="11" font-weight="700" fill="#047857">View Complete Activity History (5 events) →</text>
        </g>

        <!-- Saarthi Conversational Assistant Card -->
        <g transform="translate(0, 268)" filter="url(#cardShadow)">
          <rect width="422" height="212" rx="14" fill="url(#brandCardGrad)" />
          
          <g transform="translate(24, 24)">
            <circle cx="18" cy="18" r="18" fill="#FFFFFF" fill-opacity="0.12" />
            \${I.help(9, 9, '#FDE68A', 18)}
            <text x="46" y="15" font-size="14" font-weight="800" fill="#FFFFFF">Saarthi Tribal Assistant</text>
            <text x="46" y="30" font-size="10" font-weight="600" fill="#A7F3D0">Available in Santhali, Hindi &amp; Odia</text>

            <rect x="0" y="48" width="374" height="64" rx="8" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.16" />
            <text x="14" y="70" font-size="11" font-weight="600" fill="#F8FAFC">"When will my ₹132,000 scholarship be credited?"</text>
            <text x="14" y="92" font-size="10" fill="#D1FAE5">College review takes ~2 days, followed by direct PFMS bank transfer.</text>

            <rect x="0" y="126" width="374" height="34" rx="8" fill="#FFFFFF" />
            <text x="187" y="147" font-size="11" font-weight="800" fill="#065F46" text-anchor="middle">Chat with Saarthi in Your Language →</text>
          </g>
        </g>
      </g>
    </g>

  </g>
</svg>\`;
}`;

// Execute the replacements
console.log('Replacing screen generator functions...');
code = replaceFunction(code, 'make18CoverageGapAnalytics', newScreen18);
code = replaceFunction(code, 'make07ApplicationLifecycleTracker', newScreen07);
code = replaceFunction(code, 'make13OfficerReviewQueue', newScreen13);
code = replaceFunction(code, 'make16DigitalSanctionSigning', newScreen16);
code = replaceFunction(code, 'make17SabotageSwitchboard', newScreen17);
code = replaceFunction(code, 'make19ForensicAuditLog', newScreen19);
code = replaceFunction(code, 'make22PublicReceiptVerification', newScreen22);
code = replaceFunction(code, 'make10StudentProfileAndPvtg', newScreen10);
code = replaceFunction(code, 'make12OfflineSyncQueue', newScreen12);
code = replaceFunction(code, 'make01ScholarDashboardDesktop', newScreen01);

fs.writeFileSync(filePath, code, 'utf8');
console.log('✓ Successfully updated scripts/recreate_all_22_svgs.mjs with component library charts and diagrams.');
