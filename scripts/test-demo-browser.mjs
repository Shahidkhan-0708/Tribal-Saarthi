import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
const origin = server.resolvedUrls.local[0];
const evidence = 'artifacts/track-a';
await mkdir(evidence, { recursive: true });
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin);
  const persona = page.getByLabel('Demo persona');
  for (const [id, path] of [['usr_asha', '/student'], ['usr_mohan', '/student'], ['usr_sunita', '/student'], ['usr_nagesh', '/officer'], ['usr_verma', '/officer'], ['usr_admin', '/officer']]) {
    await persona.selectOption(id);
    await page.waitForURL(`**${path}`);
    assert.equal(await persona.inputValue(), id);
  }
  await page.getByRole('button', { name: 'Tour', exact: true }).click();
  const targets = ['student-profile', 'eligibility-audit', 'document-wallet', 'sabotage-switchboard', 'coverage-gap'];
  for (const [index, target] of targets.entries()) {
    const highlighted = page.locator(`[data-demo="${target}"].demo-tour-target`);
    await highlighted.waitFor();
    assert.equal(await highlighted.evaluate((node) => getComputedStyle(node).outlineStyle), 'solid');
    await page.screenshot({ path: `${evidence}/tour-${index + 1}.png` });
    if (index < 4) await page.getByRole('button', { name: 'Next demo beat' }).click();
  }
  await page.getByRole('button', { name: 'Close demo tour' }).click();
  assert.equal(await page.locator('.demo-tour-target').count(), 0);

  await persona.selectOption('usr_verma');
  await page.goto(new URL('/officer', origin).href);
  const cards = page.getByRole('button', { name: /Inspect & Review/ });
  await cards.first().waitFor();
  assert.ok(await cards.count() >= 3);
  await page.goto(new URL('/officer/testing', origin).href);
  await page.getByRole('button', { name: 'Kill Income API', exact: true }).click();
  await page.goto(new URL('/officer/inspection?application=app_asha_tc_2026', origin).href);
  await page.getByRole('button', { name: 'Re-run verification', exact: true }).click();
  await page.getByText(/State e-District income source unreachable/).waitFor();
  await page.screenshot({ path: `${evidence}/source-pending.png` });
  await page.goto(new URL('/officer/testing', origin).href);
  await page.getByRole('button', { name: 'Restore All Sources' }).click();
  await page.goto(new URL('/officer/inspection?application=app_asha_tc_2026', origin).href);
  await page.getByRole('button', { name: 'Re-run verification', exact: true }).click();
  await page.getByRole('button', { name: 'Approve Department Stage', exact:true }).waitFor();
  await page.getByRole('button', { name: 'Issue notice', exact:true }).click();
  await page.getByLabel('Document needing correction').selectOption('income_certificate');
  await page.getByLabel('Correction deadline').fill('2099-01-01');
  await page.getByLabel('Deficiency reason').fill('Please provide a readable income document.');
  await page.getByRole('button', { name: 'Confirm Deficiency Notice' }).click();

  await persona.selectOption('usr_asha');
  await page.getByRole('link', { name: 'My documents', exact: true }).click();
  await page.getByRole('button', { name: 'Upload document',exact:true }).click();
  await page.getByRole('button', { name: 'Income Certificate', exact: true }).click();
  await page.getByRole('link', { name: 'Applications', exact: true }).click();
  await page.getByText('Verification details and corrections',{exact:true}).click();
  const corrections = page.getByLabel('Corrected document version');
  await corrections.locator('option').filter({ hasText: 'unverified' }).first().waitFor({ state: 'attached' });
  const correctionOptions = await corrections.locator('option').evaluateAll((options) => options.map((o) => ({ value: o.value, text: o.textContent })));
  const correction = correctionOptions.find((o) => o.text.includes('unverified'));
  assert.ok(correction, 'Uploaded correction must be offered for the income deficiency');
  await corrections.selectOption(correction.value);
  await page.getByRole('button', { name: 'Send correction for review' }).click();
  await page.getByText('Manual Review', { exact: true }).first().waitFor();
  await page.reload();
  await page.getByText('Verification details and corrections',{exact:true}).click();
  assert.equal(await page.getByLabel('Attached income_certificate').inputValue(), correction.value);

  await persona.selectOption('usr_verma');
  await page.goto(new URL('/officer/inspection?application=app_asha_tc_2026', origin).href);
  await page.getByRole('button', { name: 'Approve evidence', exact: true }).first().click();
  await page.getByRole('button', { name: 'Approve Department Stage',exact:true }).click();
  await page.getByRole('button', { name: 'Sign demo sanction' }).first().click();
  await page.getByRole('button', { name: 'Typed acknowledgement' }).click();
  await page.getByRole('button', { name: 'Save acknowledgement & sanction' }).click();
  await page.getByRole('button', { name: 'Simulate PFMS disbursement' }).first().waitFor();
  await page.goto(new URL('/officer/sanction?application=app_asha_tc_2026', origin).href);
  const signature = page.getByRole('img', { name: /Demo signature of/ }).first();
  assert.match(await signature.getAttribute('src'), /^data:image\/png;base64,/);
  await page.reload();
  await signature.waitFor();
  await page.screenshot({ path: `${evidence}/sanctioned.png` });
  await page.getByRole('button', { name: 'Simulate PFMS disbursement' }).first().click();
  await persona.selectOption('usr_asha');
  await page.getByRole('link', { name: 'Applications', exact: true }).click();
  await page.getByText('Verification details and corrections',{exact:true}).click();
  await page.getByRole('button', { name: 'View Acknowledgement Slip', exact: true }).first().click();
  await page.getByText('Local demo receipt · no digital seal or public verification').waitFor();
  await page.screenshot({ path: `${evidence}/demo-receipt.png` });
  await page.getByRole('button', { name: 'Close', exact: true }).first().click();

  await persona.selectOption('usr_verma');
  await page.goto(new URL('/officer/broadcasts', origin).href);
  await page.getByRole('button', { name: /Pending Deficiencies/ }).click();
  await page.getByText('1 students', { exact: true }).waitFor();
  await page.getByLabel('Notice title').fill('Correction camp');
  await page.getByLabel('Message content').fill('Please bring a readable document.');
  await page.getByRole('button', { name: 'Send in-app broadcast' }).click();
  await page.getByText('Created 1 in-app notices. SMS and IVR are not sent in this demo.').waitFor();

  await persona.selectOption('usr_asha');
  await page.goto(new URL('/student/grievance', origin).href);
  await page.getByLabel('Subject',{exact:true}).fill('Frontend-connected demo grievance');
  await page.getByLabel('How can we help?',{exact:true}).fill('Synthetic ticket for officer resolution');
  await page.getByRole('button',{name:'Submit grievance & get reference ID',exact:true}).click();
  await persona.selectOption('usr_verma');
  await page.goto(new URL('/officer/grievances', origin).href);
  await page.waitForURL('**/officer/grievances');
  const ticket=page.locator('.case-help-ticket').filter({hasText:'Frontend-connected demo grievance'});
  await ticket.getByRole('button',{name:'Mark resolved',exact:true}).click();
  await ticket.getByText('resolved',{exact:true}).waitFor();
  await page.screenshot({path:`${evidence}/grievance-resolved.png`});
  await persona.selectOption('usr_asha');
  await page.goto(new URL('/student/grievance', origin).href);
  await page.getByText('resolved',{exact:true}).waitFor();
  await page.getByRole('button', { name: 'हिंदी (Hindi)', exact: true }).click();
  await page.getByRole('button', { name: 'मेरी स्कॉलरशिप कहां रुकी है?', exact: true }).click();
  await page.getByText(/नमस्ते Asha/).waitFor();
  assert.equal(await page.getByRole('button', { name: /Santhali/ }).count(), 0);
  await page.screenshot({ path: `${evidence}/hindi-assistant.png` });
  assert.deepEqual(errors, [], 'The complete demo must run without uncaught browser errors');
  console.log('PASS: personas, all tour targets, source outage/recovery, typed deficiency correction, persistent attachments/signature, sanction/payment, honest receipt, targeted broadcast, officer grievance resolution and Hindi assistant.');
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
