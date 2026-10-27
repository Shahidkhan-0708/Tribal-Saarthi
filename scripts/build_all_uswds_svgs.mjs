// =============================================================
// Tribe Saarthi SVG mockup builder
// Generates and validates all 22 screens and their distribution copies.
// =============================================================

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import * as scholar from './uswds_scholar_screens.mjs';
import * as officer from './uswds_officer_screens.mjs';
import * as system from './uswds_system_screens.mjs';
import { sanitizeXml } from './uswds_svg_library.mjs';

const ROOT_DIR = process.cwd();
const MOCKUPS_DIR = path.join(ROOT_DIR, 'docs', 'ui-mockups');
const DESIGN_PLANS_DIR = path.join(ROOT_DIR, 'design-plans');

const SCREENS = [
  // 1. Scholar Portal (01 - 12)
  {
    num: '01',
    name: '01-scholar-dashboard-desktop.svg',
    subpath: '01-scholar-portal/01-scholar-dashboard-desktop.svg',
    alias: '01-student-home.svg',
    title: 'Scholar dashboard',
    category: 'Scholar Portal',
    fn: scholar.make01ScholarDashboardDesktop,
    desc: 'College review status, the next action, a document checklist, and recent application updates.'
  },
  {
    num: '02',
    name: '02-scholar-dashboard-mobile.svg',
    subpath: '01-scholar-portal/02-scholar-dashboard-mobile.svg',
    alias: '02-student-mobile.svg',
    title: 'Scholar dashboard on mobile',
    category: 'Scholar Portal',
    fn: scholar.make02ScholarDashboardMobile,
    desc: 'A 375px scholar dashboard with application progress, documents, help, and bottom navigation.'
  },
  {
    num: '03',
    name: '03-scholarship-discovery.svg',
    subpath: '01-scholar-portal/03-scholarship-discovery.svg',
    alias: '03-scholarships.svg',
    title: 'Find a scholarship',
    category: 'Scholar Portal',
    fn: scholar.make03ScholarshipDiscovery,
    desc: 'Compare schemes, filter requirements, and check the information needed before applying.'
  },
  {
    num: '04',
    name: '04-application-flow-step1-profile.svg',
    subpath: '01-scholar-portal/04-application-flow-step1-profile.svg',
    title: 'Application: your profile',
    category: 'Scholar Portal',
    fn: scholar.make04ApplicationFlowStep1Profile,
    desc: 'Step 1 of 3. Review personal details, community information, and college enrolment.'
  },
  {
    num: '05',
    name: '05-application-flow-step2-documents.svg',
    subpath: '01-scholar-portal/05-application-flow-step2-documents.svg',
    title: 'Application: your documents',
    category: 'Scholar Portal',
    fn: scholar.make05ApplicationFlowStep2Documents,
    desc: 'Step 2 of 3. Check required documents and see which still need attention.'
  },
  {
    num: '06',
    name: '06-application-flow-step3-check-answers.svg',
    subpath: '01-scholar-portal/06-application-flow-step3-check-answers.svg',
    title: 'Application: check your answers',
    category: 'Scholar Portal',
    fn: scholar.make06ApplicationFlowStep3CheckAnswers,
    desc: 'Step 3 of 3. Review the application and declaration before submitting.'
  },
  {
    num: '07',
    name: '07-application-lifecycle-tracker.svg',
    subpath: '01-scholar-portal/07-application-lifecycle-tracker.svg',
    alias: '04-applications-tracker.svg',
    title: 'Follow your application',
    category: 'Scholar Portal',
    fn: scholar.make07ApplicationLifecycleTracker,
    desc: 'Follow college review, approval, and payment, with a breakdown of scholarship support.'
  },
  {
    num: '08',
    name: '08-digilocker-document-wallet.svg',
    subpath: '01-scholar-portal/08-digilocker-document-wallet.svg',
    alias: '06-document-wallet.svg',
    title: 'My documents',
    category: 'Scholar Portal',
    fn: scholar.make08DigiLockerDocumentWallet,
    desc: 'Keep certificates together and inspect document checks before reusing them.'
  },
  {
    num: '09',
    name: '09-help-and-saarthi-assistant.svg',
    subpath: '01-scholar-portal/09-help-and-saarthi-assistant.svg',
    alias: '07-help-grievances.svg',
    title: 'Help and Saarthi',
    category: 'Scholar Portal',
    fn: scholar.make09HelpAndSaarthiAssistant,
    desc: 'Ask about an application, contact support, or follow a help request.'
  },
  {
    num: '10',
    name: '10-student-profile-and-pvtg.svg',
    subpath: '01-scholar-portal/10-student-profile-and-pvtg.svg',
    title: 'My profile and community details',
    category: 'Scholar Portal',
    fn: scholar.make10StudentProfileAndPvtg,
    desc: 'Review masked identity details, community information, college, and bank status.'
  },
  {
    num: '11',
    name: '11-family-access-consent.svg',
    subpath: '01-scholar-portal/11-family-access-consent.svg',
    title: 'Family access',
    category: 'Scholar Portal',
    fn: scholar.make11FamilyAccessConsent,
    desc: 'Choose what a family member can view and revoke their access when needed.'
  },
  {
    num: '12',
    name: '12-offline-sync-queue.svg',
    subpath: '01-scholar-portal/12-offline-sync-queue.svg',
    title: 'Saved changes',
    category: 'Scholar Portal',
    fn: scholar.make12OfflineSyncQueue,
    desc: 'Review changes saved on this device and resolve updates that need attention.'
  },

  // 2. Officer Portal (13 - 19)
  {
    num: '13',
    name: '13-officer-review-queue.svg',
    subpath: '02-officer-portal/13-officer-review-queue.svg',
    alias: '05-officer-review-queue.svg',
    title: 'Officer review queue',
    category: 'Officer Portal',
    fn: officer.make13OfficerReviewQueue,
    desc: 'Prioritise applications, find pending evidence, and open a case for inspection.'
  },
  {
    num: '14',
    name: '14-officer-case-detail-inspection.svg',
    subpath: '02-officer-portal/14-officer-case-detail-inspection.svg',
    title: 'Inspect an application',
    category: 'Officer Portal',
    fn: officer.make14OfficerCaseDetailInspection,
    desc: 'Compare a document with the declared information and record the review decision.'
  },
  {
    num: '15',
    name: '15-deficiency-notice-modal.svg',
    subpath: '02-officer-portal/15-deficiency-notice-modal.svg',
    title: 'Request a correction',
    category: 'Officer Portal',
    fn: officer.make15DeficiencyNoticeModal,
    desc: 'Explain which document needs correcting and give the scholar a clear deadline.'
  },
  {
    num: '16',
    name: '16-digital-sanction-signing.svg',
    subpath: '02-officer-portal/16-digital-sanction-signing.svg',
    title: 'Approve a scholarship',
    category: 'Officer Portal',
    fn: officer.make16DigitalSanctionSigning,
    desc: 'Review the proposed scholarship amount and record an approval. Signing and payment are illustrative.'
  },
  {
    num: '17',
    name: '17-sabotage-switchboard.svg',
    subpath: '02-officer-portal/17-sabotage-switchboard.svg',
    title: 'Service testing',
    category: 'Officer Portal',
    fn: officer.make17SabotageSwitchboard,
    desc: 'Illustrative testing controls for upstream service failures and review fallbacks.'
  },
  {
    num: '18',
    name: '18-coverage-gap-analytics.svg',
    subpath: '02-officer-portal/18-coverage-gap-analytics.svg',
    title: 'Coverage gaps',
    category: 'Officer Portal',
    fn: officer.make18CoverageGapAnalytics,
    desc: 'Compare sample district coverage and identify where more students need support.'
  },
  {
    num: '19',
    name: '19-forensic-audit-log.svg',
    subpath: '02-officer-portal/19-forensic-audit-log.svg',
    title: 'Decision history',
    category: 'Officer Portal',
    fn: officer.make19ForensicAuditLog,
    desc: 'Inspect sample review events, document references, and the person responsible.'
  },

  // 3. System & Auth (20 - 22)
  {
    num: '20',
    name: '20-pilot-signin-portal.svg',
    subpath: '03-system-auth/20-pilot-signin-portal.svg',
    alias: '08-pilot-signin.svg',
    title: 'Sign in',
    category: 'System & Auth',
    fn: system.make20PilotSigninPortal,
    desc: 'Invitation-based email and password sign-in for the pilot.'
  },
  {
    num: '21',
    name: '21-password-recovery-flow.svg',
    subpath: '03-system-auth/21-password-recovery-flow.svg',
    title: 'Recover account access',
    category: 'System & Auth',
    fn: system.make21PasswordRecoveryFlow,
    desc: 'An illustrative account-recovery sequence with clear next steps.'
  },
  {
    num: '22',
    name: '22-public-receipt-verification.svg',
    subpath: '03-system-auth/22-public-receipt-verification.svg',
    title: 'Check a receipt',
    category: 'System & Auth',
    fn: system.make22PublicReceiptVerification,
    desc: 'An illustrative public receipt lookup using sample application and verification details.'
  }
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function buildAll() {
  console.log('Building the 22 Tribe Saarthi SVG mockups...\n');

  // Ensure directories exist
  const dirs = [
    path.join(MOCKUPS_DIR, '01-scholar-portal'),
    path.join(MOCKUPS_DIR, '02-officer-portal'),
    path.join(MOCKUPS_DIR, '03-system-auth'),
    path.join(MOCKUPS_DIR, 'v2'),
    DESIGN_PLANS_DIR
  ];
  for (const dir of dirs) ensureDir(dir);

  let successCount = 0;

  for (const screen of SCREENS) {
    const rawXml = screen.fn();
    const sanitizedXml = sanitizeXml(rawXml).replace(/<svg\b([^>]*)>/, (_, attributes) =>
      `<svg${attributes} role="img" aria-labelledby="screen-title screen-description"><title id="screen-title">${sanitizeXml(screen.title)}</title><desc id="screen-description">${sanitizeXml(screen.desc)}</desc>`);

    // 1. Destination in categorized folder
    const targetPath = path.join(MOCKUPS_DIR, screen.subpath);
    fs.writeFileSync(targetPath, sanitizedXml, 'utf-8');

    // 2. Destination in v2/
    const v2Path = path.join(MOCKUPS_DIR, 'v2', screen.name);
    fs.writeFileSync(v2Path, sanitizedXml, 'utf-8');

    // 3. Destination in design-plans/
    const designPlanPath = path.join(DESIGN_PLANS_DIR, screen.name);
    fs.writeFileSync(designPlanPath, sanitizedXml, 'utf-8');
    if (screen.num === '01') {
      const lifecyclePath = path.join(DESIGN_PLANS_DIR, 'scholarship-lifecycle.svg');
      fs.writeFileSync(lifecyclePath, sanitizedXml, 'utf-8');
      fs.writeFileSync(path.join(DESIGN_PLANS_DIR, 'scholar-dashboard-redesign.svg'), sanitizedXml, 'utf-8');
    }

    // 4. Destination in root of docs/ui-mockups/ if alias exists
    if (screen.alias) {
      const aliasPath = path.join(MOCKUPS_DIR, screen.alias);
      fs.writeFileSync(aliasPath, sanitizedXml, 'utf-8');
    }

    successCount++;
    console.log(`  ✓ [${screen.num}/22] Generated: ${screen.name} (${Buffer.byteLength(sanitizedXml, 'utf-8')} bytes)`);
  }

  console.log(`\n✅ Generated all ${successCount} SVGs across all output targets.\n`);

  // Build index.html gallery
  buildIndexHtml();

  // Validate XML, rendering, copies, and gallery interactions in Chromium.
  validateAllXml();

  // Refresh zip archives
  rebuildZipArchives();

  console.log('\n🎉 ALL BUILD STEPS COMPLETED SUCCESSFULLY!\n');
}

function buildIndexHtml() {
  const gallery = (prefix = '') => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tribe Saarthi · Screen library</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; color: #152E35; background: #EEF3F3; font: 16px/1.5 'Trebuchet MS', 'Nirmala UI', Arial, sans-serif; }
    .container { max-width: 1440px; margin: auto; padding: 32px; }
    header { background: #FFFFFF; border-top: 6px solid #075A46; border-bottom: 1px solid #CFDADD; }
    header .container { padding-block: 40px; }
    .brand { margin: 0 0 12px; font-size: 19px; font-weight: 700; color: #075A46; }
    h1 { margin: 0; font-size: clamp(28px, 4vw, 42px); line-height: 1.2; letter-spacing: -.025em; }
    header p:last-child { max-width: 65ch; margin-bottom: 0; color: #52666D; }
    .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
    button, .btn { font: inherit; font-size: 14px; border-radius: 4px; min-height: 44px; padding: 10px 16px; border: 1px solid #52666D; background: #FFFFFF; color: #152E35; cursor: pointer; }
    button[aria-pressed="true"], .btn-primary { color: #FFFFFF; background: #075A46; border-color: #075A46; }
    :focus-visible { outline: 3px solid #8A4F13; outline-offset: 4px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr)); gap: 24px; }
    .card { display: flex; flex-direction: column; background: #FFFFFF; border: 1px solid #CFDADD; border-radius: 8px; overflow: hidden; min-width: 0; }
    .card[hidden] { display: none; }
    .preview-box { height: 280px; padding: 12px; background: #DEE7E7; border-bottom: 1px solid #CFDADD; }
    .preview-box img { width: 100%; height: 100%; object-fit: contain; }
    .card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
    .category { margin: 0 0 8px; font-size: 12px; color: #52666D; }
    h2 { margin: 0 0 8px; font-size: 20px; line-height: 1.3; }
    .card-desc { margin: 0 0 20px; font-size: 14px; color: #52666D; flex: 1; max-width: 65ch; }
    .card-footer { display: flex; flex-wrap: wrap; gap: 8px; }
    .btn { display: inline-flex; align-items: center; text-decoration: none; }
    .note { color: #52666D; font-size: 14px; max-width: 75ch; margin: 32px 0 0; }
    @media (max-width: 600px) { .container { padding: 20px 16px; } header .container { padding-block: 28px; } .preview-box { height: 220px; } }
  </style>
</head>
<body>
  <header><div class="container">
    <p class="brand">Tribe Saarthi</p>
    <h1>A clearer path to a scholarship.</h1>
    <p>22 screens for scholars, families, and officers. Open any screen to inspect the full vector design or download its SVG.</p>
  </div></header>
  <main class="container">
    <nav class="filters" aria-label="Filter screens">
      <button type="button" aria-pressed="true" onclick="filterCategory('all', this)">All screens (22)</button>
      <button type="button" aria-pressed="false" onclick="filterCategory('Scholar Portal', this)">Scholar portal (12)</button>
      <button type="button" aria-pressed="false" onclick="filterCategory('Officer Portal', this)">Officer portal (7)</button>
      <button type="button" aria-pressed="false" onclick="filterCategory('System &amp; Auth', this)">Sign-in and receipts (3)</button>
    </nav>
    <div class="grid" id="screensGrid">
      ${SCREENS.map(s => `<article class="card" data-category="${s.category}">
        <div class="preview-box"><img src="${prefix}${s.subpath}" alt="Preview: ${s.title}" loading="lazy" width="${s.num === '02' ? 375 : 1440}" height="${s.num === '02' ? 812 : 960}"></div>
        <div class="card-body">
          <p class="category">${s.category.replace('System & Auth', 'Sign-in and receipts')} · Screen ${s.num}</p>
          <h2>${s.title}</h2><p class="card-desc">${s.desc}</p>
          <div class="card-footer">
            <a class="btn btn-primary" href="${prefix}${s.subpath}" target="_blank" rel="noopener" aria-label="Open ${s.title} in a new tab">Open screen</a>
            <a class="btn" href="${prefix}${s.subpath}" download aria-label="Download ${s.title} SVG">Download SVG</a>
          </div>
        </div>
      </article>`).join('')}
    </div>
    <p class="note">Design previews with sample records. These SVGs show proposed screens; integrations, signing, payments, and recovery steps are illustrative.</p>
    <p id="filter-status" class="note" role="status" aria-live="polite">Showing 22 screens</p>
  </main>
  <script>
    function filterCategory(category, button) {
      document.querySelectorAll('.filters button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      document.querySelectorAll('.card').forEach(card => {
        card.hidden = category !== 'all' && card.dataset.category !== category;
        if (!card.hidden) count++;
      });
      document.getElementById('filter-status').textContent = 'Showing ' + count + ' screens';
    }
  </script>
</body>
</html>`;
  fs.writeFileSync(path.join(MOCKUPS_DIR, 'index.html'), gallery(), 'utf8');
  fs.writeFileSync(path.join(MOCKUPS_DIR, 'v2', 'index.html'), gallery('../'), 'utf8');
}

function validateAllXml() {
  execFileSync(process.execPath, ['scripts/test-svg-mockups.mjs'], { stdio: 'inherit' });
}

function rebuildZipArchives() {
  const zip1 = path.join(ROOT_DIR, 'docs', 'Tribe-Saarthi-Complete-22-SVGs.zip');
  const zip2 = path.join(ROOT_DIR, 'Tribe-Saarthi-Complete-22-SVGs (2).zip');
  execFileSync('powershell.exe', ['-NoProfile', '-Command', "Compress-Archive -Path 'docs/ui-mockups/*' -DestinationPath 'docs/Tribe-Saarthi-Complete-22-SVGs.zip' -Force -ErrorAction Stop"], { stdio: 'inherit' });
  fs.copyFileSync(zip1, zip2);
  console.log('Updated both SVG distribution ZIPs.');
}

buildAll().catch(err => {
  console.error('Fatal Build Error:', err);
  process.exit(1);
});
