import { mkdir } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
const origin = server.resolvedUrls.local[0];
const brainEvidence = 'C:/Users/HP/.gemini/antigravity-cli/brain/8533af35-d70a-4a87-aabc-eb9aa982d2d9';
await mkdir(brainEvidence, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  // 1. Desktop Dashboard
  const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  pageDesktop.on('pageerror', (err) => console.error('Page error:', err));
  pageDesktop.on('console', (msg) => console.log('Browser log:', msg.text()));

  await pageDesktop.goto(`${origin}/student`);
  await pageDesktop.waitForSelector('.page-title');
  await pageDesktop.screenshot({ path: `${brainEvidence}/student-dashboard-desktop.png` });
  console.log('Saved student-dashboard-desktop.png');

  // 2. Mobile Dashboard (iPhone 14 standard: 390x844)
  const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMobile.goto(`${origin}/student`);
  await pageMobile.waitForSelector('.page-title');
  await pageMobile.screenshot({ path: `${brainEvidence}/student-dashboard-mobile.png` });
  console.log('Saved student-dashboard-mobile.png');

  // 3. Digital Passbook Wallet
  console.log('Navigating to wallet via link...');
  await pageDesktop.getByRole('link', { name: 'My documents' }).first().click();
  await pageDesktop.waitForURL('**/student/wallet');
  await pageDesktop.waitForSelector('[data-od-id="document-wallet-title"]');
  console.log('Current URL:', pageDesktop.url());
  const h1Text = await pageDesktop.locator('h1').allInnerTexts();
  console.log('H1 elements:', h1Text);
  await pageDesktop.screenshot({ path: `${brainEvidence}/student-wallet-passbook.png` });
  console.log('Saved student-wallet-passbook.png');

  // 4. Sanction Slip Modal
  await pageDesktop.getByRole('link', { name: 'Dashboard' }).first().click();
  await pageDesktop.waitForURL('**/student');
  const viewSlipBtn = pageDesktop.getByRole('button', { name: 'Print Official Slip (Hostel / College)' });
  await viewSlipBtn.waitFor({ state: 'visible' });
  await viewSlipBtn.click();
  await pageDesktop.waitForTimeout(500);
  await pageDesktop.screenshot({ path: `${brainEvidence}/student-sanction-slip.png` });
  console.log('Saved student-sanction-slip.png');

} finally {
  await browser.close();
  await server.close();
}
