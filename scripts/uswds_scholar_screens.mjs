// =============================================================
// USWDS 3.0 Scholar Portal Mockups (Screens 01 - 12)
// Full Self-Contained Generators
// =============================================================

import {
  I,
  makeDefs,
  renderUsaBanner,
  renderGovHeader,
  renderGovSidebar,
  renderDonutChartComponent,
  renderStepperPipelineComponent
} from './uswds_svg_library.mjs';

// -------------------------------------------------------------
// SCREEN 01: Scholar Dashboard (Desktop)
// -------------------------------------------------------------
export function make01ScholarDashboardDesktop() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('home', 'student')}
  ${renderGovSidebar('home', 'student')}
  <g transform="translate(268, 126)">
    <rect width="1144" height="220" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
    <path d="M0 8Q0 0 8 0H1136Q1144 0 1144 8" stroke="#075A46" stroke-width="4" />
    <text x="28" y="32" font-size="14" fill="#52666D">Mohan's application · Post-Matric Scholarship for ST Students, 2026–27</text>
    <text x="28" y="72" font-size="28" font-weight="700" fill="#152E35">College review is in progress</text>
    <text x="28" y="100" font-size="14" fill="#52666D">Your documents are ready. BIT Mesra will check your enrolment next.</text>
    <g transform="translate(40, 142)">
      <line x1="16" y1="14" x2="664" y2="14" stroke="#CFDADD" stroke-width="3" />
      <line x1="16" y1="14" x2="228" y2="14" stroke="#075A46" stroke-width="3" />
      <circle cx="16" cy="14" r="14" fill="#075A46" />
      ${I.check(8, 6, '#FFFFFF', 16)}
      <circle cx="228" cy="14" r="14" fill="#8A4F13" />
      ${I.clock(220, 6, '#FFFFFF', 16)}
      <circle cx="448" cy="14" r="14" fill="#FFFFFF" stroke="#52666D" />
      <text x="448" y="19" text-anchor="middle" font-size="12" fill="#52666D">3</text>
      <circle cx="664" cy="14" r="14" fill="#FFFFFF" stroke="#52666D" />
      <text x="664" y="19" text-anchor="middle" font-size="12" fill="#52666D">4</text>
      <text x="16" y="46" text-anchor="middle" font-size="12" fill="#075A46">Submitted</text>
      <text x="228" y="46" text-anchor="middle" font-size="12" font-weight="700" fill="#8A4F13">College review</text>
      <text x="448" y="46" text-anchor="middle" font-size="12" fill="#52666D">Approval</text>
      <text x="664" y="46" text-anchor="middle" font-size="12" fill="#52666D">Payment</text>
    </g>
    <g transform="translate(790, 20)">
      <rect width="330" height="180" rx="6" fill="#E8F2EE" />
      <text x="20" y="32" font-size="16" font-weight="700" fill="#075A46">Nothing to upload right now</text>
      <text x="20" y="60" font-size="13" fill="#152E35">We'll tell you if the college needs</text>
      <text x="20" y="80" font-size="13" fill="#152E35">a correction or another document.</text>
      <rect x="20" y="108" width="290" height="44" rx="4" fill="#075A46" />
      <text x="165" y="136" font-size="14" font-weight="700" text-anchor="middle" fill="#FFFFFF">View application</text>
    </g>

    <g transform="translate(0, 236)">
      <rect width="1144" height="96" rx="6" fill="#FFFFFF" stroke="#CFDADD" />
      <line x1="382" y1="18" x2="382" y2="78" stroke="#CFDADD" />
      <line x1="764" y1="18" x2="764" y2="78" stroke="#CFDADD" />
      <text x="24" y="30" font-size="12" fill="#52666D">Estimated yearly support</text>
      <text x="24" y="61" font-size="25" font-weight="700" fill="#152E35">₹1,32,000</text>
      <text x="170" y="60" font-size="12" fill="#52666D">Subject to approval</text>
      <text x="406" y="30" font-size="12" fill="#52666D">Documents ready</text>
      <text x="406" y="61" font-size="21" font-weight="700" fill="#075A46">3 of 4 checked</text>
      <text x="788" y="30" font-size="12" fill="#52666D">Application reference</text>
      <text x="788" y="61" font-size="19" font-weight="700" fill="#152E35">JH-ST-2026-89412</text>
    </g>

    <g transform="translate(0, 352)">
      <rect width="720" height="438" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <text x="24" y="36" font-size="20" font-weight="700" fill="#152E35">Your document checklist</text>
      <text x="24" y="62" font-size="13" fill="#52666D">One set of documents, kept with your application.</text>
      <line x1="24" y1="82" x2="696" y2="82" stroke="#CFDADD" />
      ${[
        ['Identity details', 'Aadhaar ending 4921 · Name and date of birth match', 'Checked'],
        ['ST community certificate', 'Birhor community · Issued in Latehar, Jharkhand', 'Checked'],
        ['Income certificate', 'Family income: ₹1,20,000 per year', 'Checked'],
        ['College enrolment', 'BIT Mesra · B.Tech, 2024–28', 'In review']
      ].map(([title, detail, status], i) => `
        <g transform="translate(24, ${100 + i * 68})">
          <circle cx="16" cy="18" r="14" fill="${i === 3 ? '#F8EEDC' : '#E8F2EE'}" />
          ${i === 3 ? I.clock(8, 10, '#8A4F13', 16) : I.check(8, 10, '#075A46', 16)}
          <text x="44" y="17" font-size="14" font-weight="700" fill="#152E35">${title}</text>
          <text x="44" y="39" font-size="12" fill="#52666D">${detail}</text>
          <text x="656" y="22" text-anchor="end" font-size="12" font-weight="700" fill="${i === 3 ? '#8A4F13' : '#075A46'}">${status}</text>
          <line x1="44" y1="54" x2="672" y2="54" stroke="#EEF3F3" />
        </g>`).join('')}
      <text x="24" y="402" font-size="12" fill="#52666D">If a service is unavailable, your application waits for a person to review it.</text>
    </g>
    <g transform="translate(740, 352)">
      <rect width="404" height="254" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <text x="24" y="36" font-size="20" font-weight="700" fill="#152E35">Recent updates</text>
      <circle cx="29" cy="78" r="4" fill="#075A46" />
      <text x="44" y="82" font-size="14" font-weight="700" fill="#152E35">College review started</text>
      <text x="44" y="105" font-size="12" fill="#52666D">Dr. K. Soren opened your application.</text>
      <text x="44" y="127" font-size="12" fill="#52666D">14 Oct 2026, 11:42</text>
      <circle cx="29" cy="166" r="4" fill="#075A46" />
      <text x="44" y="170" font-size="14" font-weight="700" fill="#152E35">Application received</text>
      <text x="44" y="193" font-size="12" fill="#52666D">12 Oct 2026, 14:22</text>
      <text x="24" y="232" font-size="13" font-weight="700" fill="#075A46">View decision history</text>
    </g>
    <g transform="translate(740, 626)">
      <rect width="404" height="164" rx="8" fill="#075A46" />
      <text x="24" y="36" font-size="20" font-weight="700" fill="#FFFFFF">A little help from Saarthi</text>
      <text x="24" y="63" font-size="13" fill="#FFFFFF">Ask about documents, your application,</text>
      <text x="24" y="83" font-size="13" fill="#FFFFFF">or what happens next.</text>
      <rect x="24" y="102" width="356" height="44" rx="4" fill="#FFFFFF" />
      <text x="202" y="130" text-anchor="middle" font-size="14" font-weight="700" fill="#075A46">Ask Saarthi</text>
    </g>
  </g>
</svg>`;
}

export function make02ScholarDashboardMobile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="375" height="812" viewBox="0 0 375 812" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  <rect width="375" height="76" fill="#075A46" />
  <circle cx="32" cy="37" r="18" fill="#FFFFFF" />
  <text x="32" y="42" font-size="13" font-weight="700" fill="#075A46" text-anchor="middle">TS</text>
  <text x="60" y="33" font-size="19" font-weight="700" fill="#FFFFFF">Tribe Saarthi</text>
  <text x="60" y="54" font-size="12" fill="#FFFFFF">Scholarship support</text>
  <rect x="286" y="16" width="73" height="44" rx="4" fill="#FFFFFF" />
  <text x="322" y="43" text-anchor="middle" font-size="12" font-weight="700" fill="#075A46">हिंदी / EN</text>
  <text x="16" y="110" font-size="22" font-weight="700" fill="#152E35">Hello, Mohan.</text>
  <text x="16" y="134" font-size="13" fill="#52666D">Here's where your scholarship stands.</text>
  <g transform="translate(16, 154)">
    <rect width="343" height="260" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
    <rect width="343" height="4" rx="2" fill="#075A46" />
    <text x="16" y="32" font-size="13" fill="#52666D">Post-Matric Scholarship · 2026–27</text>
    <text x="16" y="65" font-size="22" font-weight="700" fill="#152E35">College review in progress</text>
    <text x="16" y="90" font-size="13" fill="#52666D">Nothing to upload right now.</text>
    <g transform="translate(24, 114)">
      <line x1="12" y1="12" x2="277" y2="12" stroke="#CFDADD" stroke-width="3" />
      <line x1="12" y1="12" x2="100" y2="12" stroke="#075A46" stroke-width="3" />
      <circle cx="12" cy="12" r="12" fill="#075A46" />
      ${I.check(5, 5, '#FFFFFF', 14)}
      <circle cx="100" cy="12" r="12" fill="#8A4F13" />
      <text x="100" y="16" text-anchor="middle" font-size="11" fill="#FFFFFF">2</text>
      <circle cx="188" cy="12" r="12" fill="#FFFFFF" stroke="#52666D" />
      <text x="188" y="16" text-anchor="middle" font-size="11" fill="#52666D">3</text>
      <circle cx="277" cy="12" r="12" fill="#FFFFFF" stroke="#52666D" />
      <text x="277" y="16" text-anchor="middle" font-size="11" fill="#52666D">4</text>
      <text x="12" y="43" text-anchor="middle" font-size="11" fill="#075A46">Applied</text>
      <text x="100" y="43" text-anchor="middle" font-size="11" font-weight="700" fill="#8A4F13">Review</text>
      <text x="188" y="43" text-anchor="middle" font-size="11" fill="#52666D">Approval</text>
      <text x="277" y="43" text-anchor="middle" font-size="11" fill="#52666D">Payment</text>
    </g>
    <rect x="16" y="184" width="311" height="48" rx="4" fill="#075A46" />
    <text x="171" y="214" text-anchor="middle" font-size="15" font-weight="700" fill="#FFFFFF">View application</text>
  </g>
  <g transform="translate(16, 430)">
    <rect width="343" height="112" rx="6" fill="#FFFFFF" stroke="#CFDADD" />
    <text x="16" y="28" font-size="14" font-weight="700" fill="#152E35">Your documents</text>
    <text x="327" y="28" text-anchor="end" font-size="13" fill="#075A46">3 of 4 checked</text>
    <line x1="16" y1="45" x2="327" y2="45" stroke="#CFDADD" />
    <text x="16" y="70" font-size="13" fill="#52666D">College enrolment is being reviewed.</text>
    <text x="16" y="96" font-size="13" font-weight="700" fill="#075A46">Open my documents</text>
  </g>
  <g transform="translate(16, 558)">
    <rect width="343" height="128" rx="8" fill="#E8F2EE" />
    <text x="16" y="29" font-size="18" font-weight="700" fill="#075A46">Need a hand?</text>
    <text x="16" y="53" font-size="13" fill="#152E35">Ask Saarthi what happens next.</text>
    <rect x="16" y="68" width="311" height="44" rx="4" fill="#075A46" />
    <text x="171" y="96" text-anchor="middle" font-size="14" font-weight="700" fill="#FFFFFF">Ask Saarthi</text>
  </g>
  <text x="16" y="717" font-size="12" fill="#52666D">Sample application · Updated 18 Oct, 15:45</text>
  <g transform="translate(0, 742)">
    <rect width="375" height="70" fill="#FFFFFF" stroke="#CFDADD" />
    ${[[I.home, 'Home'], [I.book, 'Schemes'], [I.doc, 'Documents'], [I.user, 'Profile']].map(([icon, label], i) => `
      <g transform="translate(${i * 94}, 0)">
        ${i === 0 ? '<rect x="12" y="4" width="70" height="3" rx="1" fill="#075A46" />' : ''}
        ${icon(36, 14, i === 0 ? '#075A46' : '#52666D', 22)}
        <text x="47" y="54" text-anchor="middle" font-size="11" font-weight="${i === 0 ? 700 : 400}" fill="${i === 0 ? '#075A46' : '#52666D'}">${label}</text>
      </g>`).join('')}
  </g>
</svg>`;
}

export function make03ScholarshipDiscovery() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('scholarships', 'student')}
  ${renderGovSidebar('scholarships', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="1144" height="110" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(28, 20)">
        <text x="0" y="16" font-size="16" font-weight="700" fill="#152E35">Eligible Ministry of Tribal Affairs Scholarships</text>
        <text x="0" y="34" font-size="11" fill="#52666D">Pre-matched based on your verified Birhor (PVTG) status and Jharkhand domicile</text>

        <g transform="translate(840, -6)">
          ${renderDonutChartComponent({
            cx: 40,
            cy: 36,
            rOut: 32,
            rIn: 20,
            segments: [
              { label: 'Match', percent: 96, color: '#075A46' },
              { label: 'Unmatched', percent: 4, color: '#CBD5E1' }
            ],
            centerValue: '96%',
            centerSub: ''
          })}
          <rect x="84" y="24" width="180" height="26" rx="13" fill="#E8F2EE" />
          <text x="174" y="41" font-size="10.5" font-weight="700" fill="#075A46" class="badge">96% Profile match ✓</text>
        </g>
      </g>
    </g>

    <g transform="translate(0, 130)">
      <g>
        <rect width="364" height="420" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <rect width="364" height="6" rx="3" fill="#075A46" />
        <g transform="translate(24, 24)">
          <rect x="0" y="0" width="120" height="22" rx="11" fill="#E8F2EE" />
          <text x="60" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">Already applied</text>

          <text x="0" y="52" font-size="15" font-weight="700" fill="#152E35">Post-Matric ST Scholarship</text>
          <text x="0" y="70" font-size="11" fill="#52666D">MoTA Central Sector Scheme</text>

          <rect x="0" y="88" width="316" height="60" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
          <text x="14" y="112" font-size="11" font-weight="700" fill="#52666D">Max annual sanction</text>
          <text x="14" y="134" font-size="18" font-weight="700" fill="#075A46">₹132,000</text>

          <text x="0" y="174" font-size="11" fill="#152E35">• 100% Tuition Fee Reimbursement</text>
          <text x="0" y="194" font-size="11" fill="#152E35">• ₹24,000/yr Student Maintenance</text>
          <text x="0" y="214" font-size="11" fill="#152E35">• Special PVTG Book &amp; Hardware Grant</text>

          <rect x="0" y="250" width="316" height="38" rx="8" fill="#EEF3F3" />
          <text x="158" y="274" font-size="11.5" font-weight="700" fill="#075A46" text-anchor="middle">View Application Status</text>
        </g>
      </g>

      <g transform="translate(390, 0)">
        <rect width="364" height="420" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <rect width="364" height="6" rx="3" fill="#225F81" />
        <g transform="translate(24, 24)">
          <rect x="0" y="0" width="130" height="22" rx="11" fill="#EFF6FF" />
          <text x="65" y="15" font-size="9" font-weight="700" fill="#225F81" class="badge">Premier institute</text>

          <text x="0" y="52" font-size="15" font-weight="700" fill="#152E35">Top Class Education for ST</text>
          <text x="0" y="70" font-size="11" fill="#52666D">Valid at BIT Mesra, IITs &amp; NITs</text>

          <rect x="0" y="88" width="316" height="60" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
          <text x="14" y="112" font-size="11" font-weight="700" fill="#52666D">Full coverage grant</text>
          <text x="14" y="134" font-size="18" font-weight="700" fill="#225F81">Up to ₹2,50,000</text>

          <text x="0" y="174" font-size="11" fill="#152E35">• Full Institute Hostel &amp; Mess Fees</text>
          <text x="0" y="194" font-size="11" fill="#152E35">• One-time Laptop Grant (₹45,000)</text>
          <text x="0" y="214" font-size="11" fill="#152E35">• Annual Book Grant (₹3,000/yr)</text>

          <rect x="0" y="250" width="316" height="38" rx="8" fill="url(#govPrimaryGrad)" />
          <text x="158" y="274" font-size="11.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Apply with 1-Click Sync</text>
        </g>
      </g>

      <g transform="translate(780, 0)">
        <rect width="364" height="420" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <rect width="364" height="6" rx="3" fill="#8A4F13" />
        <g transform="translate(24, 24)">
          <rect x="0" y="0" width="140" height="22" rx="11" fill="#FEF3C7" />
          <text x="70" y="15" font-size="9" font-weight="700" fill="#92400E" class="badge">Overseas fellowship</text>

          <text x="0" y="52" font-size="15" font-weight="700" fill="#152E35">National Overseas Scholarship</text>
          <text x="0" y="70" font-size="11" fill="#52666D">For Higher Studies Abroad</text>

          <rect x="0" y="88" width="316" height="60" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
          <text x="14" y="112" font-size="11" font-weight="700" fill="#52666D">International stipend</text>
          <text x="14" y="134" font-size="18" font-weight="700" fill="#8A4F13">US $15,400 / yr</text>

          <text x="0" y="174" font-size="11" fill="#152E35">• Full International Tuition Fees</text>
          <text x="0" y="194" font-size="11" fill="#152E35">• Return Economy Airfare</text>
          <text x="0" y="214" font-size="11" fill="#152E35">• Mandatory ST &amp; PVTG quota reserve</text>

          <rect x="0" y="250" width="316" height="38" rx="8" fill="#EEF3F3" />
          <text x="158" y="274" font-size="11.5" font-weight="700" fill="#152E35" text-anchor="middle">Check Master's Eligibility</text>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 04: Application Flow - Step 1 Profile
// -------------------------------------------------------------
export function make04ApplicationFlowStep1Profile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('apps', 'student')}
  ${renderGovSidebar('apps', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="840" height="780" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(48, 32)">
        <text x="0" y="16" font-size="18" font-weight="700" fill="#152E35">Step 1 of 3: Your profile</text>
        <text x="0" y="36" font-size="12" fill="#52666D">Post-Matric Scholarship for Scheduled Tribe Students (2026-27)</text>

        <g transform="translate(0, 52)">
          <rect width="744" height="6" rx="3" fill="#CFDADD" />
          <rect width="248" height="6" rx="3" fill="#075A46" />
        </g>

        <g transform="translate(0, 84)">
          <text x="0" y="14" font-size="11.5" font-weight="700" fill="#152E35">Your name, as shown on Aadhaar</text>
          <rect x="0" y="24" width="744" height="44" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
          <text x="16" y="51" font-size="13" font-weight="700" fill="#152E35">Mohan Birhor</text>
          <circle cx="718" cy="46" r="10" fill="#E8F2EE" />
          ${I.check(713, 41, '#075A46', 10)}

          <g transform="translate(0, 88)">
            <text x="0" y="14" font-size="11.5" font-weight="700" fill="#152E35">ST community</text>
            <rect x="0" y="24" width="744" height="44" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
            <text x="16" y="51" font-size="13" font-weight="700" fill="#92400E">Birhor (PVTG Tier-1 Priority Group)</text>
            <rect x="580" y="34" width="144" height="24" rx="8" fill="#FEF3C7" />
            <text x="652" y="50" font-size="9" font-weight="700" fill="#92400E" class="badge">100% Fee waiver ✓</text>
          </g>

          <g transform="translate(0, 176)">
            <text x="0" y="14" font-size="11.5" font-weight="700" fill="#152E35">Your college or institution</text>
            <rect x="0" y="24" width="744" height="44" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
            <text x="16" y="51" font-size="13" font-weight="700" fill="#152E35">Birla Institute of Technology, Mesra · Roll #2024-CSE-104</text>
            <circle cx="718" cy="46" r="10" fill="#E8F2EE" />
            ${I.check(713, 41, '#075A46', 10)}
          </g>

          <g transform="translate(0, 264)">
            <text x="0" y="14" font-size="11.5" font-weight="700" fill="#152E35">Yearly family income</text>
            <rect x="0" y="24" width="744" height="44" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
            <text x="16" y="51" font-size="13" font-weight="700" fill="#152E35">₹1,20,000 / year (Revenue Cert #REV/2026/84920)</text>
            <circle cx="718" cy="46" r="10" fill="#E8F2EE" />
            ${I.check(713, 41, '#075A46', 10)}
          </g>

          <g transform="translate(0, 352)">
            <text x="0" y="14" font-size="11.5" font-weight="700" fill="#52666D">Parent or guardian phone (optional)</text>
            <rect x="0" y="24" width="744" height="44" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="16" y="51" font-size="13" fill="#152E35">+91 94311 02914 (Father: Somra Birhor)</text>
          </g>

          <g transform="translate(0, 460)">
            <line x1="0" y1="0" x2="744" y2="0" stroke="#EEF3F3" />
            <rect x="480" y="24" width="264" height="46" rx="8" fill="url(#govPrimaryGrad)" />
            <text x="612" y="52" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Continue to documents</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 05: Application Flow - Step 2 Documents
// -------------------------------------------------------------
export function make05ApplicationFlowStep2Documents() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('apps', 'student')}
  ${renderGovSidebar('apps', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="840" height="780" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(48, 32)">
        <text x="0" y="16" font-size="18" font-weight="700" fill="#152E35">Step 2 of 3: Your documents</text>
        <text x="0" y="36" font-size="12" fill="#52666D">Instant cryptographic sync via DigiLocker Government Vault</text>

        <g transform="translate(0, 52)">
          <rect width="744" height="6" rx="3" fill="#CFDADD" />
          <rect width="496" height="6" rx="3" fill="#075A46" />
        </g>

        <g transform="translate(0, 84)">
          <rect width="744" height="72" rx="10" fill="#E8F2EE" stroke="#86EFAC" />
          <circle cx="36" cy="36" r="18" fill="#E8F2EE" />
          ${I.shield(26, 26, '#075A46', 20)}
          <text x="68" y="30" font-size="13" font-weight="700" fill="#075A46">Scheduled Tribe Caste Certificate (Birhor PVTG)</text>
          <text x="68" y="48" font-size="10.5" fill="#075A46" class="mono">JH/ST/2022/4910 · DigiLocker SHA-256 Verified ✓</text>
          <rect x="620" y="24" width="100" height="24" rx="8" fill="#E8F2EE" />
          <text x="670" y="40" font-size="9" font-weight="700" fill="#075A46" class="badge">Auto-sealed</text>

          <g transform="translate(0, 84)">
            <rect width="744" height="72" rx="10" fill="#E8F2EE" stroke="#86EFAC" />
            <circle cx="36" cy="36" r="18" fill="#E8F2EE" />
            ${I.docCheck(26, 26, '#075A46', 20)}
            <text x="68" y="30" font-size="13" font-weight="700" fill="#075A46">Income Certificate (₹1,20,000 / year)</text>
            <text x="68" y="48" font-size="10.5" fill="#075A46" class="mono">REV/2026/84920 · Valid till March 2027 ✓</text>
            <rect x="620" y="24" width="100" height="24" rx="8" fill="#E8F2EE" />
            <text x="670" y="40" font-size="9" font-weight="700" fill="#075A46" class="badge">Auto-sealed</text>
          </g>

          <g transform="translate(0, 168)">
            <rect width="744" height="72" rx="10" fill="#E8F2EE" stroke="#86EFAC" />
            <circle cx="36" cy="36" r="18" fill="#E8F2EE" />
            ${I.book(26, 26, '#075A46', 20)}
            <text x="68" y="30" font-size="13" font-weight="700" fill="#075A46">Institution Bonafide &amp; Fee Schedule</text>
            <text x="68" y="48" font-size="10.5" fill="#075A46" class="mono">BIT/ACAD/2026/104 · B.Tech 2nd Year ✓</text>
            <rect x="620" y="24" width="100" height="24" rx="8" fill="#E8F2EE" />
            <text x="670" y="40" font-size="9" font-weight="700" fill="#075A46" class="badge">Auto-sealed</text>
          </g>

          <g transform="translate(0, 252)">
            <rect width="744" height="72" rx="10" fill="#E8F2EE" stroke="#86EFAC" />
            <circle cx="36" cy="36" r="18" fill="#E8F2EE" />
            ${I.docCheck(26, 26, '#075A46', 20)}
            <text x="68" y="30" font-size="13" font-weight="700" fill="#075A46">Previous Year Marksheet (CGPA: 8.42)</text>
            <text x="68" y="48" font-size="10.5" fill="#075A46" class="mono">JAC/DEG/2025/9012 · Clean Record ✓</text>
            <rect x="620" y="24" width="100" height="24" rx="8" fill="#E8F2EE" />
            <text x="670" y="40" font-size="9" font-weight="700" fill="#075A46" class="badge">Auto-sealed</text>
          </g>

          <g transform="translate(0, 360)">
            <rect x="0" y="24" width="160" height="46" rx="8" fill="#EEF3F3" />
            <text x="80" y="52" font-size="12" font-weight="700" fill="#52666D" text-anchor="middle">Back to your profile</text>

            <rect x="480" y="24" width="264" height="46" rx="8" fill="url(#govPrimaryGrad)" />
            <text x="612" y="52" font-size="12.5" font-weight="700" fill="#FFFFFF" text-anchor="middle">Check your answers</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 06: Application Flow - Step 3 Check Answers
// -------------------------------------------------------------
export function make06ApplicationFlowStep3CheckAnswers() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('apps', 'student')}
  ${renderGovSidebar('apps', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="840" height="780" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(48, 32)">
        <text x="0" y="16" font-size="18" font-weight="700" fill="#152E35">Step 3 of 3: Check your answers</text>
        <text x="0" y="36" font-size="12" fill="#52666D">Review your details before final cryptographic submission</text>

        <g transform="translate(0, 52)">
          <rect width="744" height="6" rx="3" fill="#075A46" />
        </g>

        <g transform="translate(0, 84)">
          <rect width="744" height="260" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="12" font-weight="700" fill="#52666D">Scholar</text>
            <text x="240" y="16" font-size="12" font-weight="700" fill="#52666D">Community</text>
            <text x="480" y="16" font-size="12" font-weight="700" fill="#52666D">Institute</text>

            <text x="0" y="38" font-size="14" font-weight="700" fill="#152E35">Mohan Birhor</text>
            <text x="240" y="38" font-size="14" font-weight="700" fill="#92400E">Birhor (PVTG Tier-1)</text>
            <text x="480" y="38" font-size="14" font-weight="700" fill="#152E35">BIT Mesra, Ranchi</text>

            <line x1="0" y1="60" x2="696" y2="60" stroke="#CFDADD" />

            <text x="0" y="86" font-size="12" font-weight="700" fill="#52666D">Annual income</text>
            <text x="240" y="86" font-size="12" font-weight="700" fill="#52666D">Documents</text>
            <text x="480" y="86" font-size="12" font-weight="700" fill="#075A46">Claimed sanction</text>

            <text x="0" y="108" font-size="14" font-weight="700" fill="#152E35">₹1,20,000 / yr</text>
            <text x="240" y="108" font-size="14" font-weight="700" fill="#075A46">4 / 4 DigiLocker Verified</text>
            <text x="480" y="112" font-size="18" font-weight="700" fill="#075A46">₹132,000.00</text>
          </g>

          <g transform="translate(0, 280)">
            <rect width="744" height="64" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
            <rect x="18" y="20" width="24" height="24" rx="4" fill="#075A46" />
            ${I.check(22, 24, '#FFFFFF', 16)}
            <text x="56" y="34" font-size="12" font-weight="700" fill="#92400E">Statutory Tribal Beneficiary Declaration</text>
            <text x="56" y="48" font-size="10.5" fill="#78350F">I declare that all submitted records are authentic under the Scheduled Castes &amp; Scheduled Tribes Act.</text>
          </g>

          <g transform="translate(0, 370)">
            <rect width="744" height="50" rx="8" fill="url(#govPrimaryGrad)" />
            ${I.shield(240, 16, '#FFFFFF', 18)}
            <text x="400" y="32" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">Submit application</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 07: Application Lifecycle Tracker
// -------------------------------------------------------------
export function make07ApplicationLifecycleTracker() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('apps', 'student')}
  ${renderGovSidebar('apps', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="1144" height="96" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(28, 20)">
        <text x="0" y="16" font-size="16" font-weight="700" fill="#152E35">Post-Matric Scholarship for ST Students (2026-27)</text>
        <text x="0" y="36" font-size="11" fill="#52666D">Beneficiary: <tspan font-weight="700" fill="#152E35">Mohan Birhor</tspan> · Scheme Code: <tspan class="mono">MOTA-PMS-ST-2026</tspan> · Submitted: 12 Oct 2026, 02:22 PM</text>

        <rect x="740" y="6" width="180" height="32" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
        <circle cx="754" cy="22" r="4" fill="#8A4F13" />
        <text x="764" y="26" font-size="10.5" font-weight="700" fill="#8A4F13">Stage 2: college review</text>

        <rect x="940" y="4" width="160" height="36" rx="8" fill="url(#govPrimaryGrad)" />
        ${I.download(952, 13, '#FFFFFF', 18)}
        <text x="1030" y="27" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Receipt PDF</text>
      </g>
    </g>

    <g transform="translate(0, 116)">
      <!-- Left Panel: Detailed Vertical Decision Timeline -->
      <g>
        <rect width="720" height="660" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(32, 28)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Application Decision Milestones</text>
          <text x="0" y="34" font-size="11" fill="#52666D">Immutable record of statutory verifications and government actions</text>

          <line x1="20" y1="74" x2="20" y2="520" stroke="#CFDADD" stroke-width="3" stroke-linecap="round" />
          <line x1="20" y1="74" x2="20" y2="240" stroke="#075A46" stroke-width="3" stroke-linecap="round" />

          <!-- Milestone 1 -->
          <g transform="translate(0, 70)">
            <circle cx="20" cy="14" r="14" fill="#075A46" />
            ${I.check(13, 7, '#FFFFFF', 14)}
            <text x="48" y="14" font-size="13" font-weight="700" fill="#152E35">Application Submitted &amp; Digitally Sealed</text>
            <text x="48" y="30" font-size="11" fill="#52666D">Online submission authenticated via Aadhaar OTP. Form payload sealed with SHA-256 hash.</text>
            <text x="48" y="46" font-size="10" font-weight="600" fill="#075A46" class="mono">12 Oct 2026 · 02:22 PM · Digest: e3b0c44298fc...</text>
          </g>

          <!-- Milestone 2 -->
          <g transform="translate(0, 154)">
            <circle cx="20" cy="14" r="14" fill="#075A46" />
            ${I.check(13, 7, '#FFFFFF', 14)}
            <text x="48" y="14" font-size="13" font-weight="700" fill="#152E35">Automated Multi-Registry Cross-Checks Passed</text>
            <text x="48" y="30" font-size="11" fill="#52666D">UIDAI demographic vault, State e-District ST database, and Revenue Income certified.</text>
            <text x="48" y="46" font-size="10" font-weight="600" fill="#075A46" class="mono">12 Oct 2026 · 02:23 PM · 3/3 Automated Registries Cleared ✓</text>
          </g>

          <!-- Milestone 3 -->
          <g transform="translate(0, 238)">
            <circle cx="20" cy="14" r="16" fill="url(#govOchreGrad)" />
            <circle cx="20" cy="14" r="22" fill="none" stroke="#8A4F13" stroke-width="2" stroke-dasharray="3 3" />
            ${I.clock(11, 5, '#FFFFFF', 18)}
            <text x="52" y="14" font-size="13" font-weight="700" fill="#8A4F13">Institute Nodal Officer Verification (Current Stage)</text>
            <text x="52" y="30" font-size="11" fill="#152E35">Assigned Reviewer: <tspan font-weight="700">Dr. K. Soren</tspan> (BIT Mesra Nodal Desk)</text>
            <text x="52" y="46" font-size="11" fill="#52666D">Verifying academic roll #2024-CSE-104 and hostel fee schedule. SLA target: 48h.</text>
            <rect x="52" y="56" width="130" height="22" rx="11" fill="#FEF3C7" />
            <text x="117" y="71" font-size="9" font-weight="700" fill="#8A4F13" class="badge">Active review</text>
          </g>

          <!-- Milestone 4 -->
          <g transform="translate(0, 344)">
            <circle cx="20" cy="14" r="13" fill="#EEF3F3" stroke="#CBD5E1" stroke-width="2" />
            <text x="20" y="18" font-size="10" font-weight="700" fill="#52666D" text-anchor="middle">4</text>
            <text x="48" y="14" font-size="13" font-weight="700" fill="#52666D">District Welfare Officer Sanction Endorsement</text>
            <text x="48" y="30" font-size="11" fill="#52666D">Latehar District Welfare Office · Statutory expenditure concurrence.</text>
            <text x="48" y="44" font-size="10" fill="#52666D">Estimated Date: 20 Oct 2026</text>
          </g>

          <!-- Milestone 5 -->
          <g transform="translate(0, 424)">
            <circle cx="20" cy="14" r="13" fill="#EEF3F3" stroke="#CBD5E1" stroke-width="2" />
            <text x="20" y="18" font-size="10" font-weight="700" fill="#52666D" text-anchor="middle">5</text>
            <text x="48" y="14" font-size="13" font-weight="700" fill="#52666D">MoTA Central Sanction &amp; PFMS Direct Bank Transfer</text>
            <text x="48" y="30" font-size="11" fill="#52666D">Direct credit of ₹132,000 into Bank of India Aadhaar-seeded savings account.</text>
            <text x="48" y="44" font-size="10" fill="#52666D">Aadhaar Reference: •••• •••• 4921</text>
          </g>
        </g>
      </g>

      <!-- Right Panel: Donut Financial Breakdown -->
      <g transform="translate(742, 0)">
        <g>
          <rect width="400" height="340" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Sanction Financial Breakdown</text>
            <line x1="0" y1="30" x2="352" y2="30" stroke="#EEF3F3" />

            <g transform="translate(0, 40)">
              ${renderDonutChartComponent({
                cx: 64,
                cy: 54,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'Tuition Fees', percent: 74, color: '#075A46', amount: '₹98K' },
                  { label: 'Maintenance', percent: 18, color: '#225F81', amount: '₹24K' },
                  { label: 'PVTG Book Grant', percent: 8, color: '#8A4F13', amount: '₹10K' }
                ],
                centerValue: '₹132K',
                centerSub: '100% Grant',
                legendX: 136,
                legendY: 18,
                legendWidth: 216,
                itemHeight: 26
              })}
            </g>

            <g transform="translate(0, 168)">
              <rect width="352" height="110" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <text x="14" y="20" font-size="10.5" font-weight="700" fill="#075A46">DBT disbursement pipeline</text>
              ${renderStepperPipelineComponent({
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

            <g transform="translate(0, 288)">
              <rect width="352" height="34" rx="8" fill="#E8F2EE" stroke="#A7F3D0" />
              <text x="12" y="22" font-size="11" font-weight="600" fill="#075A46">Target Account: <tspan font-weight="700" fill="#075A46">Bank of India · ••••••••9012 (Aadhaar Seeded)</tspan></text>
            </g>
          </g>
        </g>

        <!-- Nodal Desk Contact -->
        <g transform="translate(0, 360)">
          <rect width="400" height="240" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Assigned Nodal Desk</text>
            <line x1="0" y1="30" x2="352" y2="30" stroke="#EEF3F3" />

            <g transform="translate(0, 44)">
              <circle cx="20" cy="20" r="20" fill="url(#govPrimaryGrad)" />
              <text x="20" y="24" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">KS</text>
              <text x="50" y="16" font-size="13" font-weight="700" fill="#152E35">Dr. K. Soren</text>
              <text x="50" y="32" font-size="11" fill="#52666D">Associate Professor &amp; ST Welfare Officer · BIT Mesra</text>

              <rect x="0" y="60" width="352" height="54" rx="8" fill="#E8F2EE" stroke="#BBF7D0" />
              <text x="12" y="82" font-size="11" font-weight="700" fill="#075A46">Physical Verification Desk Open</text>
              <text x="12" y="98" font-size="10" fill="#52666D">Administrative Block, Room 104 · Mon–Fri, 10:00 AM – 4:00 PM</text>

              <rect x="0" y="128" width="352" height="38" rx="8" fill="#EEF3F3" />
              <text x="176" y="152" font-size="11" font-weight="700" fill="#075A46" text-anchor="middle">Raise Query with Nodal Officer</text>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 10: Student Profile & PVTG
// -------------------------------------------------------------
export function make10StudentProfileAndPvtg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('profile', 'student')}
  ${renderGovSidebar('profile', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="1144" height="110" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(28, 20)">
        <circle cx="35" cy="35" r="35" fill="url(#govPrimaryGrad)" />
        <text x="35" y="42" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">MB</text>

        <text x="86" y="26" font-size="18" font-weight="700" fill="#152E35">Mohan Birhor</text>
        <text x="86" y="46" font-size="12" fill="#52666D">Birla Institute of Technology (BIT Mesra) · B.Tech Computer Science (2nd Year)</text>
        <text x="86" y="64" font-size="11" fill="#075A46" font-weight="600">Enrolled Roll #2024-CSE-104 · Domicile: Latehar District, Jharkhand</text>

        <rect x="940" y="16" width="160" height="34" rx="8" fill="#EEF3F3" />
        <text x="1020" y="37" font-size="11" font-weight="700" fill="#075A46" text-anchor="middle">Request Data Update</text>
      </g>
    </g>

    <g transform="translate(0, 130)">
      <g>
        <rect width="556" height="520" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Verified Tribal Demographics</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Certified by Government of Jharkhand &amp; SDO Latehar</text>

          <g transform="translate(0, 48)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">Tribal community classification</text>
            <text x="0" y="34" font-size="14" font-weight="700" fill="#152E35">Birhor Scheduled Tribe</text>
            <rect x="360" y="18" width="140" height="22" rx="11" fill="#FEF3C7" stroke="#FDE68A" />
            <text x="430" y="33" font-size="9" font-weight="700" fill="#92400E" class="badge">PVTG tier-1 priority</text>
            <line x1="0" y1="48" x2="508" y2="48" stroke="#EEF3F3" />

            <text x="0" y="68" font-size="11" font-weight="700" fill="#52666D">Domicile residence</text>
            <text x="0" y="86" font-size="12.5" font-weight="700" fill="#152E35">Village: Belta, Block: Mahuadanr, Latehar District, Jharkhand</text>
            <line x1="0" y1="100" x2="508" y2="100" stroke="#EEF3F3" />

            <text x="0" y="120" font-size="11" font-weight="700" fill="#52666D">Family &amp; guardian</text>
            <text x="0" y="138" font-size="12.5" font-weight="700" fill="#152E35">Somra Birhor (Father) · Mobile: +91 94311 •••••</text>
            <line x1="0" y1="152" x2="508" y2="152" stroke="#EEF3F3" />

            <g transform="translate(0, 168)">
              <rect width="508" height="240" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
              <g transform="translate(18, 16)">
                <text x="0" y="14" font-size="12" font-weight="700" fill="#92400E">Statutory PVTG tier-1 entitlement breakdown</text>
                <text x="0" y="30" font-size="10.5" fill="#78350F">MoTA Order No. MOTA/PVTG/2026/410 · 100% Comprehensive State Coverage</text>

                <g transform="translate(0, 42)">
                  ${renderDonutChartComponent({
                    cx: 52,
                    cy: 50,
                    rOut: 44,
                    rIn: 26,
                    segments: [
                      { label: 'Full Tuition Grant', percent: 74, color: '#075A46', amount: '₹98K' },
                      { label: 'Monthly Maintenance', percent: 18, color: '#225F81', amount: '₹24K' },
                      { label: 'Special Book Grant', percent: 8, color: '#8A4F13', amount: '₹10K' }
                    ],
                    centerValue: '100%',
                    centerSub: 'Covered',
                    legendX: 114,
                    legendY: 14,
                    legendWidth: 260,
                    itemHeight: 25
                  })}
                </g>

                <g transform="translate(0, 162)">
                  <rect x="0" y="0" width="150" height="28" rx="8" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="75" y="18" font-size="9.5" font-weight="700" fill="#92400E" text-anchor="middle">Zero Parent Contribution</text>

                  <rect x="158" y="0" width="150" height="28" rx="8" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="233" y="18" font-size="9.5" font-weight="700" fill="#92400E" text-anchor="middle">Monthly Stipend ₹2,000</text>

                  <rect x="316" y="0" width="154" height="28" rx="8" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="393" y="18" font-size="9.5" font-weight="700" fill="#075A46" text-anchor="middle">Direct Aadhaar DBT Credit</text>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      <g transform="translate(586, 0)">
        <rect width="556" height="520" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 22)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">National Identity &amp; Banking</text>
          <text x="0" y="32" font-size="11" fill="#52666D">UIDAI Token Vault and Aadhaar-seeded PFMS disbursement</text>

          <g transform="translate(0, 52)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">Aadhaar identification (masked)</text>
            <text x="0" y="34" font-size="14" font-weight="700" fill="#152E35" class="mono">•••• •••• 4921</text>
            <rect x="360" y="18" width="140" height="22" rx="11" fill="#E8F2EE" />
            <text x="430" y="33" font-size="9" font-weight="700" fill="#075A46" class="badge">UIDAI verified ✓</text>
            <line x1="0" y1="50" x2="508" y2="50" stroke="#EEF3F3" />

            <text x="0" y="74" font-size="11" font-weight="700" fill="#52666D">Academic APAAR / abc ID</text>
            <text x="0" y="94" font-size="14" font-weight="700" fill="#152E35" class="mono">9482-1049-5821</text>
            <rect x="360" y="78" width="140" height="22" rx="11" fill="#E8F2EE" />
            <text x="430" y="93" font-size="9" font-weight="700" fill="#075A46" class="badge">Abc vault sync ✓</text>
            <line x1="0" y1="110" x2="508" y2="110" stroke="#EEF3F3" />

            <text x="0" y="134" font-size="11" font-weight="700" fill="#52666D">Primary DBT bank account</text>
            <text x="0" y="154" font-size="14" font-weight="700" fill="#152E35">Bank of India (Mesra Branch, Ranchi)</text>
            <text x="0" y="172" font-size="11" fill="#52666D">A/C: <tspan class="mono">••••••••9012</tspan> · IFSC: <tspan class="mono">BKID0004910</tspan></text>
            <rect x="360" y="138" width="140" height="22" rx="11" fill="#E8F2EE" />
            <text x="430" y="153" font-size="9" font-weight="700" fill="#075A46" class="badge">NPCI seeded ✓</text>
            <line x1="0" y1="190" x2="508" y2="190" stroke="#EEF3F3" />

            <text x="0" y="214" font-size="11" font-weight="700" fill="#52666D">DigiLocker consent status</text>
            <text x="0" y="234" font-size="13" font-weight="700" fill="#152E35">Tokenized Direct Read Access</text>
            <text x="0" y="250" font-size="11" fill="#075A46">4 of 4 statutory certificates mapped to vault</text>
            <rect x="360" y="218" width="140" height="22" rx="11" fill="#E8F2EE" />
            <text x="430" y="233" font-size="9" font-weight="700" fill="#075A46" class="badge">Consent active ✓</text>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 12: Offline Sync Queue
// -------------------------------------------------------------
export function make12OfflineSyncQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('offline', 'student')}
  ${renderGovSidebar('offline', 'student')}

  <g transform="translate(268, 126)">
    <g>
      <rect width="1144" height="88" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 20)">
        <circle cx="24" cy="24" r="24" fill="#FEF3C7" />
        ${I.sync(14, 14, '#8A4F13', 20)}
        <text x="60" y="20" font-size="15" font-weight="700" fill="#152E35">You are offline. Your changes are saved.</text>
        <text x="60" y="38" font-size="11" fill="#8A4F13">2 changes are waiting to send. Reconnect to sync them.</text>

        <rect x="760" y="8" width="160" height="34" rx="8" fill="#EEF3F3" />
        <text x="840" y="29" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">Export Encrypted Backup</text>

        <rect x="936" y="8" width="160" height="34" rx="8" fill="url(#govPrimaryGrad)" />
        <text x="1016" y="29" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Force Sync Queue</text>
      </g>
    </g>

    <g transform="translate(0, 110)">
      <rect width="1144" height="660" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Changes waiting to send</text>
        <text x="0" y="32" font-size="11" fill="#52666D">Changes stay on this device until they reach the server.</text>

        <g transform="translate(0, 54)">
          <rect width="1086" height="36" rx="6" fill="#EEF3F3" />
          <text x="16" y="22" font-size="10.5" font-weight="700" fill="#52666D">Op ID</text>
          <text x="110" y="22" font-size="10.5" font-weight="700" fill="#52666D">Action type</text>
          <text x="280" y="22" font-size="10.5" font-weight="700" fill="#52666D">Payload summary</text>
          <text x="620" y="22" font-size="10.5" font-weight="700" fill="#52666D">Local timestamp</text>
          <text x="810" y="22" font-size="10.5" font-weight="700" fill="#52666D">Status</text>
          <text x="960" y="22" font-size="10.5" font-weight="700" fill="#52666D">Integrity</text>
        </g>

        <!-- Rows -->
        <g transform="translate(0, 102)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#EEF3F3" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#152E35" class="mono">OP-104</text>
          <text x="110" y="24" font-size="12" font-weight="700" fill="#152E35">Address Update</text>
          <text x="280" y="24" font-size="11.5" fill="#52666D">Updated domicile hamlet: Belta, Mahuadanr, Latehar</text>
          <text x="620" y="24" font-size="11" fill="#52666D" class="mono">14:12:05 IST</text>
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#FEF3C7" />
          <text x="865" y="25" font-size="9" font-weight="700" fill="#8A4F13" class="badge">Queued locally</text>
          <text x="960" y="24" font-size="10" fill="#52666D" class="mono">SHA: a89f3b...</text>
        </g>

        <g transform="translate(0, 154)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#EEF3F3" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#152E35" class="mono">OP-105</text>
          <text x="110" y="24" font-size="12" font-weight="700" fill="#152E35">Upload Document</text>
          <text x="280" y="24" font-size="11.5" fill="#52666D">File: bit_mesra_fee_receipt.pdf (1.2 MB)</text>
          <text x="620" y="24" font-size="11" fill="#52666D" class="mono">14:15:30 IST</text>
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#FEF3C7" />
          <text x="865" y="25" font-size="9" font-weight="700" fill="#8A4F13" class="badge">Queued locally</text>
          <text x="960" y="24" font-size="10" fill="#52666D" class="mono">SHA: c7219e...</text>
        </g>

        <g transform="translate(0, 206)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#EEF3F3" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#52666D" class="mono">OP-103</text>
          <text x="110" y="24" font-size="12" font-weight="600" fill="#52666D">Draft Step 2</text>
          <text x="280" y="24" font-size="11.5" fill="#52666D">Document slot confirmations &amp; seals</text>
          <text x="620" y="24" font-size="11" fill="#52666D" class="mono">10:02:11 IST</text>
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#E8F2EE" />
          <text x="865" y="25" font-size="9" font-weight="700" fill="#075A46" class="badge">Synced &amp; acked</text>
          <text x="960" y="24" font-size="10" fill="#075A46" class="mono">ACK: #9921 ✓</text>
        </g>

        <!-- Lower Section: CRDT Pipeline & Queue Status Donut -->
        <g transform="translate(0, 280)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#CFDADD" />
          <g transform="translate(0, 24)">
            <text x="0" y="14" font-size="12" font-weight="700" fill="#075A46">Deterministic last-write-wins (lww) sync pipeline</text>
            <text x="0" y="30" font-size="10.5" fill="#52666D">Mathematical CRDT rules ensure zero data loss and eliminate overwrites between offline client and officer decisions</text>
            
            <g transform="translate(0, 44)">
              <rect width="720" height="120" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              ${renderStepperPipelineComponent({
                x: 12,
                y: 20,
                width: 696,
                steps: [
                  { title: 'Saved on device', sub: 'Draft saved', status: 'done', badge: 'STORED ✓' },
                  { title: 'Connection', sub: 'Waiting for internet', status: 'active', badge: 'WAITING NET' },
                  { title: 'Check updates', sub: 'Resolve differences', status: 'upcoming', badge: 'CRDT MERGE' },
                  { title: 'Send changes', sub: 'Server confirmation', status: 'upcoming', badge: 'NIC SEAL' }
                ]
              })}
            </g>
          </g>

          <g transform="translate(760, 24)">
            <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">Queue sync status</text>
            <text x="0" y="30" font-size="10.5" fill="#52666D">Changes on this device</text>

            <g transform="translate(0, 44)">
              <rect width="326" height="120" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              ${renderDonutChartComponent({
                cx: 56,
                cy: 60,
                rOut: 40,
                rIn: 25,
                segments: [
                  { label: 'Queued Locally', percent: 67, color: '#8A4F13', amount: '2 Ops' },
                  { label: 'Synced &amp; Acked', percent: 33, color: '#075A46', amount: '1 Op' }
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
</svg>`;
}

// -------------------------------------------------------------
// SCREEN 08: DigiLocker Document Wallet
// -------------------------------------------------------------
export function make08DigiLockerDocumentWallet() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('documents', 'student')}
  ${renderGovSidebar('documents', 'student')}

  <g transform="translate(268, 126)">
    <!-- Top Hero Banner -->
    <g>
      <rect width="1144" height="92" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 20)">
        <circle cx="26" cy="26" r="26" fill="#E8F2EE" />
        ${I.shield(14, 14, '#075A46', 24)}
        <text x="64" y="22" font-size="16" font-weight="700" fill="#152E35">My documents</text>
        <text x="64" y="42" font-size="12" fill="#075A46" font-weight="600">Keep certificates ready and reuse them when you apply.</text>

        <rect x="944" y="10" width="160" height="36" rx="8" fill="url(#govPrimaryGrad)" />
        <text x="1024" y="32" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Refresh documents</text>
      </g>
    </g>

    <!-- Main Content Split -->
    <g transform="translate(0, 114)">
      <!-- Left Column: Verified Document Cards -->
      <g>
        <rect width="720" height="670" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 22)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Certificates and records</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Check the issuer, details, and review status for each document.</text>

          <!-- Document 1: Caste Certificate -->
          <g transform="translate(0, 52)">
            <rect width="672" height="130" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <rect width="6" height="130" rx="3" fill="#075A46" />
            <g transform="translate(20, 18)">
              <text x="0" y="14" font-size="14" font-weight="700" fill="#152E35">Scheduled Tribe Caste Certificate</text>
              <rect x="490" y="0" width="144" height="22" rx="11" fill="#E8F2EE" />
              <text x="562" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">DigiLocker seal ✓</text>

              <text x="0" y="36" font-size="11.5" fill="#52666D">Issuing Authority: SDO Mahuadanr, Latehar, Jharkhand · Cert #: <tspan class="mono" font-weight="700">JH/ST/2023/88194</tspan></text>
              <text x="0" y="54" font-size="11" fill="#52666D">Community: Birhor (PVTG Tier-1) · Issued Date: 14 Aug 2023 · Validity: Lifetime</text>

              <line x1="0" y1="68" x2="632" y2="68" stroke="#CFDADD" />
              <text x="0" y="86" font-size="10.5" fill="#52666D">SHA-256 Digest: <tspan class="mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</tspan></text>

              <rect x="522" y="74" width="110" height="26" rx="6" fill="#EEF3F3" />
              <text x="577" y="91" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">View NIC Seal</text>
            </g>
          </g>

          <!-- Document 2: Income Certificate -->
          <g transform="translate(0, 200)">
            <rect width="672" height="130" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <rect width="6" height="130" rx="3" fill="#075A46" />
            <g transform="translate(20, 18)">
              <text x="0" y="14" font-size="14" font-weight="700" fill="#152E35">Annual Family Income Certificate</text>
              <rect x="490" y="0" width="144" height="22" rx="11" fill="#E8F2EE" />
              <text x="562" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">DigiLocker seal ✓</text>

              <text x="0" y="36" font-size="11.5" fill="#52666D">Issuing Authority: Revenue Circle Office Latehar · Cert #: <tspan class="mono" font-weight="700">JH/INC/2026/0192</tspan></text>
              <text x="0" y="54" font-size="11" fill="#52666D">Certified Gross Income: ₹48,000 / year (Well within ₹2.50 Lakh Statutory Limit)</text>

              <line x1="0" y1="68" x2="632" y2="68" stroke="#CFDADD" />
              <text x="0" y="86" font-size="10.5" fill="#52666D">SHA-256 Digest: <tspan class="mono">f482a014948a901ba8472910c0194821a810f821ba091482910948210f948201</tspan></text>

              <rect x="522" y="74" width="110" height="26" rx="6" fill="#EEF3F3" />
              <text x="577" y="91" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">View NIC Seal</text>
            </g>
          </g>

          <!-- Document 3: APAAR / ABC ID -->
          <g transform="translate(0, 348)">
            <rect width="672" height="130" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <rect width="6" height="130" rx="3" fill="#075A46" />
            <g transform="translate(20, 18)">
              <text x="0" y="14" font-size="14" font-weight="700" fill="#152E35">APAAR / Academic Bank of Credits ID</text>
              <rect x="490" y="0" width="144" height="22" rx="11" fill="#E8F2EE" />
              <text x="562" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">Abc vault sync ✓</text>

              <text x="0" y="36" font-size="11.5" fill="#52666D">Institution: Birla Institute of Technology, Mesra · APAAR ID: <tspan class="mono" font-weight="700">9482-1049-5821</tspan></text>
              <text x="0" y="54" font-size="11" fill="#52666D">Academic Standing: Enrolled B.Tech CSE (4th Sem) · CGPA: 8.84 · Clean Disciplinary Record</text>

              <line x1="0" y1="68" x2="632" y2="68" stroke="#CFDADD" />
              <text x="0" y="86" font-size="10.5" fill="#52666D">SHA-256 Digest: <tspan class="mono">9c84e1b4028471049281a049182904812a048129048102948120481029481204</tspan></text>

              <rect x="522" y="74" width="110" height="26" rx="6" fill="#EEF3F3" />
              <text x="577" y="91" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">View NIC Seal</text>
            </g>
          </g>

          <!-- Document 4: Senior Secondary Marksheet -->
          <g transform="translate(0, 496)">
            <rect width="672" height="130" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
            <rect width="6" height="130" rx="3" fill="#075A46" />
            <g transform="translate(20, 18)">
              <text x="0" y="14" font-size="14" font-weight="700" fill="#152E35">Senior Secondary (Class 12) Marksheet</text>
              <rect x="490" y="0" width="144" height="22" rx="11" fill="#E8F2EE" />
              <text x="562" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">CBSE document check ✓</text>

              <text x="0" y="36" font-size="11.5" fill="#52666D">Board: Central Board of Secondary Education · Roll #: <tspan class="mono" font-weight="700">1284920</tspan> · Year: 2024</text>
              <text x="0" y="54" font-size="11" fill="#52666D">Aggregate Score: 84.6% · Stream: Science (PCM with Computer Science)</text>

              <line x1="0" y1="68" x2="632" y2="68" stroke="#CFDADD" />
              <text x="0" y="86" font-size="10.5" fill="#52666D">SHA-256 Digest: <tspan class="mono">710daef049281940182904128904182904182094182049182049182049182049</tspan></text>

              <rect x="522" y="74" width="110" height="26" rx="6" fill="#EEF3F3" />
              <text x="577" y="91" font-size="10" font-weight="700" fill="#075A46" text-anchor="middle">View NIC Seal</text>
            </g>
          </g>
        </g>
      </g>

      <!-- Right Column: Vault Donut & Cryptographic Stepper -->
      <g transform="translate(744, 0)">
        <!-- Vault Status Donut Card -->
        <g>
          <rect width="400" height="330" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Document checks</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Sample review status for this application</text>
            <line x1="0" y1="44" x2="352" y2="44" stroke="#EEF3F3" />

            <g transform="translate(0, 56)">
              ${renderDonutChartComponent({
                cx: 64,
                cy: 56,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'DigiLocker Verified', percent: 100, color: '#075A46', amount: '4 Docs' }
                ],
                centerValue: '100%',
                centerSub: 'Vault',
                legendX: 136,
                legendY: 24,
                legendWidth: 216,
                itemHeight: 28
              })}
            </g>

            <g transform="translate(0, 180)">
              <rect width="352" height="110" rx="10" fill="#E8F2EE" stroke="#A7F3D0" />
              <g transform="translate(14, 14)">
                <text x="0" y="14" font-size="11.5" font-weight="700" fill="#075A46">Keep your originals</text>
                <text x="0" y="38" font-size="12" fill="#075A46"><tspan x="0">Keep the original certificates available.</tspan><tspan x="0" dy="20">Your officer may ask to see them.</tspan></text>
              </g>
            </g>
          </g>
        </g>

        <!-- Cryptographic Trust Pipeline Stepper -->
        <g transform="translate(0, 350)">
          <rect width="400" height="320" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">How documents are checked</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Identity, issuer, and document reference</text>
            <line x1="0" y1="44" x2="352" y2="44" stroke="#EEF3F3" />

            <g transform="translate(0, 56)">
              ${renderStepperPipelineComponent({
                x: 0,
                y: 0,
                width: 352,
                steps: [
                  { title: 'UIDAI Token', sub: 'Handshake ✓', status: 'done', badge: 'PASSED' },
                  { title: 'Issuer Key', sub: 'e-Sign Sealed', status: 'done', badge: 'PASSED' },
                  { title: 'Vault Hash', sub: 'SHA-256 Merkle', status: 'done', badge: 'SEALED' }
                ]
              })}
            </g>

            <g transform="translate(0, 150)">
              <rect width="352" height="130" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(16, 16)">
                <text x="0" y="14" font-size="11" font-weight="700" fill="#152E35">Security specifications</text>
                <text x="0" y="34" font-size="10.5" fill="#52666D">• Masked Aadhaar: <tspan class="mono">•••• •••• 4921</tspan> (Raw UID not stored)</text>
                <text x="0" y="52" font-size="10.5" fill="#52666D">• Transport Encryption: TLS 1.3 / AES-256-GCM</text>
                <text x="0" y="70" font-size="10.5" fill="#52666D">• Consent Token: <tspan class="mono">TKN-MOTA-2026-90412</tspan></text>
                <text x="0" y="88" font-size="10.5" fill="#075A46" font-weight="700">• Validated against National Knowledge Network (NKN)</text>
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
// SCREEN 09: Help & Saarthi Assistant
// -------------------------------------------------------------
export function make09HelpAndSaarthiAssistant() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('help', 'student')}
  ${renderGovSidebar('help', 'student')}

  <g transform="translate(268, 126)">
    <!-- Top Bar -->
    <g>
      <rect width="1144" height="74" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 18)">
        <circle cx="20" cy="20" r="20" fill="url(#govPrimaryGrad)" />
        ${I.chat(10, 10, '#FFFFFF', 20)}
        <text x="52" y="18" font-size="16" font-weight="700" fill="#152E35">Saarthi Multilingual Assistance &amp; Grievance Redressal</text>
        <text x="52" y="34" font-size="11" fill="#52666D">24/7 vernacular AI guide for tribal scholars · Section 508 voice-enabled accessible support</text>

        <!-- Vernacular Language Selectors -->
        <g transform="translate(730, 2)">
          <rect x="0" y="0" width="70" height="34" rx="17" fill="#075A46" />
          <text x="35" y="21" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">English</text>

          <rect x="76" y="0" width="68" height="34" rx="17" fill="#EEF3F3" />
          <text x="110" y="21" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">हिन्दी</text>

          <rect x="150" y="0" width="80" height="34" rx="17" fill="#EEF3F3" />
          <text x="190" y="21" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">ᱥᱟᱱᱛᱟᱲᱤ</text>

          <rect x="236" y="0" width="74" height="34" rx="17" fill="#EEF3F3" />
          <text x="273" y="21" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">गोंडी</text>

          <rect x="316" y="0" width="88" height="34" rx="17" fill="#FEF3C7" stroke="#FDE68A" />
          <text x="360" y="21" font-size="10.5" font-weight="700" fill="#92400E" text-anchor="middle">Voice Mode</text>
        </g>
      </g>
    </g>

    <!-- Main Section -->
    <g transform="translate(0, 94)">
      <!-- Left: Interactive Assistant Chat Surface -->
      <g>
        <rect width="690" height="710" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Conversation with Saarthi AI</text>
          <text x="0" y="32" font-size="11" fill="#075A46" font-weight="600">Secure Government AI Agent · Session #SA-2026-8819</text>
          <line x1="0" y1="44" x2="642" y2="44" stroke="#EEF3F3" />

          <!-- Chat Message 1: Scholar -->
          <g transform="translate(180, 60)">
            <rect width="462" height="72" rx="8" fill="#075A46" />
            <text x="18" y="24" font-size="12" font-weight="700" fill="#FFFFFF">Mohan Birhor (Scholar)</text>
            <text x="18" y="44" font-size="12" fill="#E8F2EE" leading="1.4">What is the exact disbursement timeline for my BIT Mesra PVTG special maintenance allowance?</text>
          </g>

          <!-- Chat Message 2: Saarthi AI -->
          <g transform="translate(0, 146)">
            <rect width="642" height="240" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(18, 16)">
              <circle cx="16" cy="16" r="16" fill="url(#govPrimaryGrad)" />
              <text x="16" y="21" font-size="10" font-weight="700" fill="#FFFFFF" text-anchor="middle">SA</text>
              <text x="42" y="15" font-size="13" font-weight="700" fill="#152E35">Saarthi AI Assistant</text>
              <text x="42" y="29" font-size="10" fill="#52666D">Verified against MoTA National Scholarship Regulations 2026</text>

              <text x="0" y="58" font-size="12.5" fill="#152E35" font-weight="600">Johar Mohan! Here is your personalized scholarship timeline:</text>
              <text x="0" y="80" font-size="12" fill="#152E35" leading="1.5">1. <tspan font-weight="700">Verification Status:</tspan> BIT Mesra Nodal Desk approved your application on 14 Oct 2026.</text>
              <text x="0" y="100" font-size="12" fill="#152E35" leading="1.5">2. <tspan font-weight="700">Current Step:</tspan> District Welfare Office Latehar is processing statutory concurrence (SLA: 48h).</text>
              <text x="0" y="120" font-size="12" fill="#152E35" leading="1.5">3. <tspan font-weight="700">Total Sanction Amount:</tspan> ₹132,000 (Tuition ₹98,000 + Maintenance ₹24,000 + Book ₹10,000).</text>
              <text x="0" y="140" font-size="12" fill="#152E35" leading="1.5">4. <tspan font-weight="700">Target Bank Account:</tspan> Bank of India · ••••••••9012 (Aadhaar Seeded &amp; NPCI Validated).</text>

              <rect x="0" y="158" width="606" height="52" rx="8" fill="#E8F2EE" stroke="#A7F3D0" />
              <text x="14" y="178" font-size="11" font-weight="700" fill="#075A46">Official Assurance:</text>
              <text x="14" y="196" font-size="10.5" fill="#075A46">As a recognized PVTG Birhor scholar, your payment receives Tier-1 priority PFMS queue sequencing.</text>
            </g>
          </g>

          <!-- Suggested Quick Prompts -->
          <g transform="translate(0, 404)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">Suggested statutory prompts</text>
            <g transform="translate(0, 24)">
              <rect x="0" y="0" width="200" height="32" rx="8" fill="#EEF3F3" />
              <text x="100" y="20" font-size="10.5" font-weight="700" fill="#075A46" text-anchor="middle">Explain PVTG Entitlement</text>

              <rect x="210" y="0" width="190" height="32" rx="8" fill="#EEF3F3" />
              <text x="305" y="20" font-size="10.5" font-weight="700" fill="#075A46" text-anchor="middle">How DBT Seeding Works?</text>

              <rect x="410" y="0" width="220" height="32" rx="8" fill="#EEF3F3" />
              <text x="520" y="20" font-size="10.5" font-weight="700" fill="#075A46" text-anchor="middle">Connect to Latehar Nodal Officer</text>
            </g>
          </g>

          <!-- Input Box -->
          <g transform="translate(0, 500)">
            <rect width="642" height="150" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
            <text x="20" y="32" font-size="12" fill="#52666D">Ask Saarthi in English, Hindi, Santhali or Gondi (Type or press mic)...</text>
            
            <!-- Voice Bar Simulation -->
            <g transform="translate(20, 56)">
              <line x1="0" y1="10" x2="6" y2="10" stroke="#075A46" stroke-width="3" stroke-linecap="round" />
              <line x1="12" y1="4" x2="18" y2="4" stroke="#075A46" stroke-width="3" stroke-linecap="round" />
              <line x1="24" y1="14" x2="30" y2="14" stroke="#075A46" stroke-width="3" stroke-linecap="round" />
              <line x1="36" y1="2" x2="42" y2="2" stroke="#075A46" stroke-width="3" stroke-linecap="round" />
              <line x1="48" y1="12" x2="54" y2="12" stroke="#075A46" stroke-width="3" stroke-linecap="round" />
              <text x="68" y="14" font-size="10.5" font-weight="700" fill="#075A46">Voice Input: "Click to speak in your native dialect"</text>
            </g>

            <rect x="20" y="96" width="130" height="38" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
            <text x="85" y="120" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">🎙 Hold to Speak</text>

            <rect x="502" y="96" width="120" height="38" rx="8" fill="url(#govPrimaryGrad)" />
            <text x="562" y="120" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Send Query</text>
          </g>
        </g>
      </g>

      <!-- Right: Formal Grievances & Toll-Free Desk -->
      <g transform="translate(714, 0)">
        <!-- Grievance Ticket Card -->
        <g>
          <rect width="430" height="390" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">Formal Grievance Tickets</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Centralized Public Grievance Redress and Monitoring System</text>
            <line x1="0" y1="44" x2="382" y2="44" stroke="#EEF3F3" />

            <!-- Active Ticket Detail -->
            <g transform="translate(0, 56)">
              <rect width="382" height="170" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(16, 16)">
                <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">Ticket #CPGRAMS-2026-9041</text>
                <rect x="260" y="0" width="90" height="20" rx="10" fill="#E8F2EE" />
                <text x="305" y="14" font-size="8.5" font-weight="700" fill="#075A46" class="badge">Resolved ✓</text>

                <text x="0" y="34" font-size="11" fill="#52666D">Subject: DigiLocker Caste Certificate Re-synchronization</text>
                <text x="0" y="50" font-size="10.5" fill="#52666D">Filed: 08 Oct 2026 · Redressed: 09 Oct 2026 (Resolution SLA: 24h)</text>

                <g transform="translate(0, 68)">
                  ${renderStepperPipelineComponent({
                    x: 0,
                    y: 0,
                    width: 350,
                    steps: [
                      { title: 'Filed', sub: 'Portal Ack', status: 'done', badge: 'LOGGED' },
                      { title: 'Officer Assign', sub: 'Latehar Desk', status: 'done', badge: 'ASSIGNED' },
                      { title: 'Redressed', sub: 'Key Re-synced', status: 'done', badge: 'RESOLVED' }
                    ]
                  })}
                </g>
              </g>
            </g>

            <rect x="0" y="246" width="382" height="42" rx="8" fill="url(#govPrimaryGrad)" />
            <text x="191" y="272" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Create a help request</text>

            <g transform="translate(0, 304)">
              ${renderDonutChartComponent({
                cx: 48,
                cy: 36,
                rOut: 32,
                rIn: 20,
                segments: [
                  { label: 'Resolved (Within 48h SLA)', percent: 100, color: '#075A46', amount: '1/1' }
                ],
                centerValue: '100%',
                centerSub: 'SLA',
                legendX: 96,
                legendY: 18,
                legendWidth: 280,
                itemHeight: 26
              })}
            </g>
          </g>
        </g>

        <!-- MoTA Toll-Free Helplines -->
        <g transform="translate(0, 410)">
          <rect width="430" height="300" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="700" fill="#152E35">National MoTA Tribal Helplines</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Toll-free direct telephone support in scheduled tribal languages</text>
            <line x1="0" y1="44" x2="382" y2="44" stroke="#EEF3F3" />

            <!-- Helpline 1 -->
            <g transform="translate(0, 56)">
              <rect width="382" height="88" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(16, 16)">
                <text x="0" y="14" font-size="11" font-weight="700" fill="#075A46">National tribal scholarship cell</text>
                <text x="0" y="38" font-size="18" font-weight="700" fill="#152E35" class="mono">1800-11-7788</text>
                <text x="0" y="56" font-size="10.5" fill="#52666D">Operating: Mon–Sat, 09:00 AM – 06:00 PM IST (Toll-Free)</text>
              </g>
            </g>

            <!-- Helpline 2 -->
            <g transform="translate(0, 160)">
              <rect width="382" height="88" rx="10" fill="#EEF3F3" stroke="#CFDADD" />
              <g transform="translate(16, 16)">
                <text x="0" y="14" font-size="11" font-weight="700" fill="#8A4F13">Jharkhand state welfare direct help</text>
                <text x="0" y="38" font-size="18" font-weight="700" fill="#152E35" class="mono">1800-345-6543</text>
                <text x="0" y="56" font-size="10.5" fill="#52666D">Tribal Welfare Commissionerate, Ranchi Desk</text>
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
// SCREEN 11: Family Access & Consent
// -------------------------------------------------------------
export function make11FamilyAccessConsent() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderUsaBanner(1440)}
  ${renderGovHeader('profile', 'student')}
  ${renderGovSidebar('profile', 'student')}

  <g transform="translate(268, 126)">
    <!-- Top Hero Card -->
    <g>
      <rect width="1144" height="92" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
      <g transform="translate(24, 20)">
        <circle cx="26" cy="26" r="26" fill="#E8F2EE" />
        ${I.users(14, 14, '#075A46', 24)}
        <text x="64" y="22" font-size="16" font-weight="700" fill="#152E35">Family Access &amp; Nominee Consent Guardian Desk</text>
        <text x="64" y="42" font-size="12" fill="#075A46" font-weight="600">Give a family member permission to view your application status.</text>

        <rect x="944" y="10" width="160" height="36" rx="8" fill="url(#govPrimaryGrad)" />
        <text x="1024" y="32" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Grant New Nominee +</text>
      </g>
    </g>

    <!-- Main Columns -->
    <g transform="translate(0, 114)">
      <!-- Left Column: Active Authorized Members -->
      <g>
        <rect width="660" height="660" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
        <g transform="translate(24, 22)">
          <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Active Authorized Family Guardians</text>
          <text x="0" y="32" font-size="11" fill="#52666D">Guardians authorized to receive disbursal status alerts and application progress</text>

          <!-- Guardian Card 1 -->
          <g transform="translate(0, 52)">
            <rect width="612" height="240" rx="8" fill="#EEF3F3" stroke="#CFDADD" />
            <g transform="translate(20, 18)">
              <circle cx="22" cy="22" r="22" fill="#FEF3C7" />
              <text x="22" y="27" font-size="13" font-weight="700" fill="#92400E" text-anchor="middle">SB</text>
              <text x="56" y="18" font-size="15" font-weight="700" fill="#152E35">Somra Birhor</text>
              <text x="56" y="34" font-size="11.5" fill="#52666D">Relationship: Father · Registered Mobile: <tspan class="mono" font-weight="700">+91 94311 •••••</tspan></text>

              <rect x="490" y="0" width="100" height="22" rx="11" fill="#E8F2EE" />
              <text x="540" y="15" font-size="9" font-weight="700" fill="#075A46" class="badge">Active ✓</text>

              <line x1="0" y1="52" x2="572" y2="52" stroke="#CFDADD" />

              <!-- Permissions Matrix -->
              <text x="0" y="74" font-size="11" font-weight="700" fill="#52666D">Guardian permissions matrix</text>
              <g transform="translate(0, 88)">
                <rect x="0" y="0" width="180" height="30" rx="6" fill="#E8F2EE" stroke="#A7F3D0" />
                <text x="10" y="19" font-size="10" font-weight="700" fill="#075A46">✓ View Application SLA</text>

                <rect x="190" y="0" width="180" height="30" rx="6" fill="#E8F2EE" stroke="#A7F3D0" />
                <text x="10" y="19" font-size="10" font-weight="700" fill="#075A46">✓ PFMS Bank DBT SMS</text>

                <rect x="380" y="0" width="192" height="30" rx="6" fill="#FEE2E2" stroke="#FCA5A5" />
                <text x="10" y="19" font-size="10" font-weight="700" fill="#991B1B">✗ Edit Bank Details (Restricted)</text>
              </g>

              <text x="0" y="148" font-size="10.5" fill="#52666D">Consent Granted: 01 Sep 2026 · Authorization Method: <tspan font-weight="700">Aadhaar OTP (+91 94311 •••••)</tspan></text>
              <text x="0" y="166" font-size="10.5" fill="#075A46" font-weight="600">Last SMS Dispatched: "Application forward to Latehar DWO on 14 Oct 2026"</text>

              <rect x="0" y="184" width="140" height="34" rx="6" fill="#FEE2E2" />
              <text x="70" y="206" font-size="11" font-weight="700" fill="#DC2626" text-anchor="middle">Revoke Consent</text>

              <rect x="150" y="184" width="160" height="34" rx="6" fill="#EEF3F3" />
              <text x="230" y="206" font-size="11" font-weight="700" fill="#52666D" text-anchor="middle">Resend SMS Test Alert</text>
            </g>
          </g>

          <!-- Privacy Guarantee Notice -->
          <g transform="translate(0, 320)">
            <rect width="612" height="150" rx="10" fill="#EEF3F3" stroke="#CBD5E1" />
            <g transform="translate(18, 16)">
              <text x="0" y="14" font-size="12" font-weight="700" fill="#152E35">What your family can see</text>
              <text x="0" y="34" font-size="11" fill="#52666D">• Nominees have strictly <tspan font-weight="700">read-only status access</tspan>. They cannot change bank accounts or revoke scholarship terms.</text>
              <text x="0" y="52" font-size="11" fill="#52666D">• All guardian accesses are logged in the immutable MoTA audit ledger with SHA-256 timestamping.</text>
              <text x="0" y="70" font-size="11" fill="#52666D">• Scholars may revoke guardian authorization at any time with instantaneous revocation propagation.</text>
              <text x="0" y="88" font-size="11" fill="#075A46" font-weight="700">• Consent expires automatically after 365 days unless explicitly renewed.</text>
            </g>
          </g>
        </g>
      </g>

      <!-- Right Column: Grant Consent Stepper & Form -->
      <g transform="translate(684, 0)">
        <g>
          <rect width="460" height="660" rx="8" fill="#FFFFFF" stroke="#CFDADD" />
          <g transform="translate(24, 22)">
            <text x="0" y="16" font-size="15" font-weight="700" fill="#152E35">Authorize New Family Nominee</text>
            <text x="0" y="32" font-size="11" fill="#52666D">Authenticate guardian via Aadhaar OTP challenge</text>
            <line x1="0" y1="44" x2="412" y2="44" stroke="#EEF3F3" />

            <!-- Stepper -->
            <g transform="translate(0, 56)">
              ${renderStepperPipelineComponent({
                x: 0,
                y: 0,
                width: 412,
                steps: [
                  { title: 'Nominee Info', sub: 'Aadhaar ID', status: 'done', badge: 'VERIFIED' },
                  { title: 'OTP Challenge', sub: 'SMS Sent', status: 'active', badge: 'PENDING' },
                  { title: 'Grant Token', sub: '365d Pass', status: 'upcoming', badge: 'SEAL' }
                ]
              })}
            </g>

            <!-- Form -->
            <g transform="translate(0, 154)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#52666D">Nominee legal full name</text>
              <rect x="0" y="24" width="412" height="42" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
              <text x="14" y="50" font-size="12" fill="#152E35">Sita Birhor</text>

              <text x="0" y="88" font-size="11" font-weight="700" fill="#52666D">Relationship to scholar</text>
              <rect x="0" y="98" width="412" height="42" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
              <text x="14" y="124" font-size="12" fill="#152E35">Mother</text>

              <text x="0" y="162" font-size="11" font-weight="700" fill="#52666D">Guardian aadhaar number</text>
              <rect x="0" y="172" width="412" height="42" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
              <text x="14" y="198" font-size="12" fill="#152E35" class="mono">•••• •••• 7182</text>

              <text x="0" y="236" font-size="11" font-weight="700" fill="#52666D">Aadhaar-linked mobile for OTP</text>
              <rect x="0" y="246" width="412" height="42" rx="8" fill="#EEF3F3" stroke="#CBD5E1" />
              <text x="14" y="272" font-size="12" fill="#152E35" class="mono">+91 94312 •••••</text>

              <rect x="0" y="316" width="412" height="46" rx="8" fill="url(#govPrimaryGrad)" />
              <text x="206" y="344" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">Dispatch Aadhaar OTP to Nominee</text>
            </g>

            <!-- Donut Authorization Distribution -->
            <g transform="translate(0, 530)">
              <line x1="0" y1="0" x2="412" y2="0" stroke="#EEF3F3" />
              <g transform="translate(0, 16)">
                ${renderDonutChartComponent({
                  cx: 44,
                  cy: 36,
                  rOut: 32,
                  rIn: 20,
                  segments: [
                    { label: 'Active Nominees', percent: 50, color: '#075A46', amount: '1 Active' },
                    { label: 'Max Allowance', percent: 50, color: '#CFDADD', amount: '1 Free Slot' }
                  ],
                  centerValue: '1/2',
                  centerSub: 'Slots',
                  legendX: 92,
                  legendY: 18,
                  legendWidth: 300,
                  itemHeight: 26
                })}
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

