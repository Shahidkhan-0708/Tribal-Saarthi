import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import QRCode from 'qrcode';
import { staging, value, evidence } from './staging-helpers.mjs';

const { config, admin } = await staging();
const actors = JSON.parse(await readFile('.staging/actors.json', 'utf8'));
const student = JSON.parse(await readFile('.staging/restore-student.json', 'utf8'));
const app = value(await admin.from('pilot_applications').select('data').eq('id', student.applicationId).single(), 'Expected hosted application');
const receipt = value(await admin.rpc('pilot_receipt',{token:app.data.receiptToken}),'Current decision receipt');
await mkdir('artifacts/track-b/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  for (const [name, actor] of Object.entries(actors)) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(config.frontendUrl);
    await page.getByLabel('Email', { exact: true }).fill(actor.email);
    await page.getByLabel('Password', { exact: true }).fill(actor.password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.getByRole('heading', { name: 'Your pilot workspace', exact: true }).waitFor();
    await page.screenshot({ path: `artifacts/track-b/screenshots/${name}.png` });
    if (name === 'student') {
      await page.getByRole('navigation', { name: 'Pilot sections' }).getByRole('button', { name: 'applications', exact: true }).click();
      await page.getByRole('button', { name: 'Show receipt QR', exact: true }).first().click();
      const qr = page.getByRole('img', { name: 'QR code linking to receipt verification', exact: true });
      await qr.waitFor();
      const url = new URL(config.frontendUrl); url.searchParams.set('receipt', app.data.receiptToken);
      const expected = QRCode.create(url.href);
      const bits = await qr.evaluate(async (img, size) => {
        await img.decode();
        const canvas = document.createElement('canvas'); canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const scale = canvas.width / (size + 8);
        return Array.from({ length: size * size }, (_, i) => {
          const x = Math.floor((i % size + 4.5) * scale), y = Math.floor((Math.floor(i / size) + 4.5) * scale);
          return pixels[(y * canvas.width + x) * 4] < 128 ? 1 : 0;
        });
      }, expected.modules.size);
      assert.ok(bits.every((bit, i) => bit === expected.modules.data[i]), 'Rendered QR modules must encode the actual public verification URL');
      await page.screenshot({ path: 'artifacts/track-b/screenshots/receipt-qr.png' });
      const anonymous = await browser.newContext();
      const publicPage = await anonymous.newPage();
      await publicPage.goto(url.href);
      await publicPage.getByText(`Reference: ${student.applicationId}`, { exact: true }).waitFor();
      const text = await publicPage.locator('main').innerText();
      assert.ok(text.includes(receipt.hash));
      assert.ok(!text.includes(actors.student.email) && !text.includes('Synthetic student'), 'Public receipt must not show student details');
      await publicPage.screenshot({ path: 'artifacts/track-b/screenshots/public-receipt.png' });
      await anonymous.close();
    }
    await context.close();
  }
  assert.deepEqual(errors, [], 'Hosted role screens must not raise uncaught browser errors');
  await evidence('hosted-browser', { at: new Date().toISOString(), projectRef: config.projectRef, frontendUrl: config.frontendUrl, passed: true, roles: Object.keys(actors), actualQrVerified: true, anonymousReceiptVerified: true, syntheticAccounts: true });
  console.log('PASS seven hosted role logins, actual rendered QR and anonymous receipt; real hosted APIs, no mocks');
} finally { await browser.close(); }
