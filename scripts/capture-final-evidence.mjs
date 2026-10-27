import { chromium } from '@playwright/test';
import path from 'path';

const artifactDir = 'C:/Users/HP/.gemini/antigravity-cli/brain/8533af35-d70a-4a87-aabc-eb9aa982d2d9';
const origin = 'http://localhost:5173';

const browser = await chromium.launch({ headless: true });

try {
  // Desktop view
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await page.goto(origin);
  await page.waitForLoadState('networkidle');

  // Select Asha
  const persona = page.getByLabel('Demo persona');
  await persona.selectOption('usr_asha');
  await page.waitForURL('**/student');
  await page.waitForTimeout(500);

  // 1. Dashboard Desktop
  await page.screenshot({ path: path.join(artifactDir, 'final-student-dashboard-desktop.png') });

  // 2. Click Official Slip
  const slipBtn = page.getByRole('button', { name: /Print Official Slip/i });
  if (await slipBtn.count() > 0) {
    await slipBtn.first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, 'final-sanction-slip.png') });
    await page.getByRole('button', { name: /Close|बंद करें/i }).first().click();
    await page.waitForTimeout(300);
  }

  // 3. Document Wallet
  await page.getByRole('link', { name: 'My documents', exact: true }).click();
  await page.waitForURL('**/student/wallet');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactDir, 'final-student-wallet.png') });

  // 4. Scholarship Discovery
  await page.getByRole('link', { name: 'Scholarships', exact: true }).click();
  await page.waitForURL('**/student/discovery');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactDir, 'final-scholarship-discovery.png') });

  // 5. Help & Saarthi
  await page.getByRole('link', { name: /Help/i }).first().click();
  await page.waitForURL('**/student/grievance');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactDir, 'final-help-saarthi.png') });

  // Mobile view
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobilePage.goto(origin);
  const mobilePersona = mobilePage.getByLabel('Demo persona');
  await mobilePersona.selectOption('usr_asha');
  await mobilePage.waitForURL('**/student');
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(artifactDir, 'final-student-dashboard-mobile.png') });

  console.log('Final evidence screenshots saved successfully!');
} catch (e) {
  console.error('Error capturing evidence:', e);
} finally {
  await browser.close();
}
