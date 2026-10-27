import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  // 1. Visit Login page
  await page.goto('http://localhost:5173/login');
  await page.waitForSelector('[data-od-id="auth-card"]');
  console.log('Login page loaded.');

  // 2. Select Email & Password tab
  await page.getByRole('button', { name: 'Email & Password' }).click();

  // 3. Click autofill admin button
  await page.getByRole('button', { name: /Autofill Supabase Admin/ }).click();
  console.log('Autofilled credentials.');

  // 4. Click Sign in with Supabase
  await page.getByRole('button', { name: /Sign in with Supabase/ }).click();
  console.log('Submitted Supabase sign-in form. Waiting for portal navigation...');

  // 5. Wait for navigation to /officer
  await page.waitForURL('**/officer', { timeout: 15000 });
  console.log('Navigated to /officer successfully.');

  // 6. Check user name and role badge
  await page.waitForSelector('.userpill');
  const userName = await page.locator('.userpill .nm').innerText();
  console.log('Current user name in header:', userName);
  assert.equal(userName, 'Shahid Khan', 'User name should match Supabase account name');

  // 7. Check sync box in left rail
  const syncStatus = page.locator('[data-od-id="sync-status-box"]');
  await syncStatus.waitFor();
  const syncText = await syncStatus.innerText();
  console.log('Sync status text:', syncText);
  assert.ok(syncText.includes('Supabase live'), 'Left rail should indicate live Supabase connection');

  // 8. Check that review queue has live applications
  const inspectButtons = page.getByRole('button', { name: /Inspect & Review/ });
  await inspectButtons.first().waitFor();
  const count = await inspectButtons.count();
  console.log('Total review queue cases loaded:', count);
  assert.ok(count >= 3, 'Should load applications from Supabase store');

  // 9. Take screenshot of live connected interface
  await page.screenshot({ path: 'artifacts/supabase-connected.png' });
  console.log('Screenshot saved to artifacts/supabase-connected.png');

  // 10. Verify receipt verification with live Supabase token
  await page.goto('http://localhost:5173/receipt');
  await page.waitForSelector('[data-od-id="receipt-verification-main"]');
  await page.getByRole('button', { name: /Try live token/ }).click();
  await page.getByRole('button', { name: /Verify receipt/ }).click();
  await page.waitForSelector('text=Verified live');
  console.log('Verified live receipt cryptographic proof.');
  await page.screenshot({ path: 'artifacts/receipt-live-verified.png' });

  assert.deepEqual(errors, [], 'No unexpected browser console errors');
  console.log('ALL SUPABASE FRONTEND INTEGRATION CHECKS PASSED!');
} finally {
  await browser.close();
}
