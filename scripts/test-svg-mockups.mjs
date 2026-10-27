import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = path.resolve('docs/ui-mockups');
const evidence = path.resolve('artifacts/svg-review');
await fs.mkdir(evidence, { recursive: true });
const folders = ['01-scholar-portal', '02-officer-portal', '03-system-auth'];
const files = [];
for (const folder of folders) {
  for (const name of (await fs.readdir(path.join(root, folder))).filter(name => name.endsWith('.svg')).sort()) {
    files.push({ name, file: path.join(root, folder, name) });
  }
}
assert.equal(files.length, 22, 'Expected the complete 22-screen suite');
const browser = await chromium.launch({ headless: true });
const findings = [];
try {
  const page = await browser.newPage();
  await page.route(/^https?:/, route => route.abort());
  for (const { name, file } of files) {
    const xml = await fs.readFile(file, 'utf8');
    assert.ok(!/\b(?:undefined|NaN)\b/.test(xml), `${name}: missing content or invalid geometry`);
    assert.ok(!xml.includes('@import') && !/<image[^>]+https?:/i.test(xml), `${name}: external dependency`);
    for (const mirror of [path.join(root, 'v2', name), path.resolve('design-plans', name)]) {
      assert.equal(await fs.readFile(mirror, 'utf8'), xml, `${mirror}: stale mirror`);
    }
    const width = name.startsWith('02-') ? 375 : 1440;
    const height = width === 375 ? 812 : 960;
    await page.setViewportSize({ width, height });
    await page.goto(pathToFileURL(file).href);
    const result = await page.evaluate(() => {
      const svg = document.documentElement;
      if (svg.localName !== 'svg' || document.querySelector('parsererror')) return { error: 'Invalid SVG XML' };
      if (svg.getAttribute('role') !== 'img' || !document.getElementById('screen-title')?.textContent || !document.getElementById('screen-description')?.textContent) return { error: 'Missing accessible description' };
      const missing = [...svg.querySelectorAll('*')].flatMap(node => [...node.attributes].flatMap(attr => [...attr.value.matchAll(/url\(#([^)]*)\)/g)].map(match => match[1]))).filter(id => !document.getElementById(id));
      const viewport = svg.getBoundingClientRect();
      const clipped = [...svg.querySelectorAll('text')].filter(node => !node.closest('defs')).flatMap(node => {
        const r = node.getBoundingClientRect();
        return r.left < viewport.left - 1 || r.top < viewport.top - 1 || r.right > viewport.right + 1 || r.bottom > viewport.bottom + 1
          ? [{ text: node.textContent.trim(), x: Math.round(r.x), y: Math.round(r.y), right: Math.round(r.right), bottom: Math.round(r.bottom) }] : [];
      });
      return { missing, clipped };
    });
    assert.ok(!result.error, `${name}: ${result.error}`);
    assert.deepEqual(result.missing, [], `${name}: unresolved SVG reference`);
    if (result.clipped.length) findings.push({ name, clipped: result.clipped });
    await page.screenshot({ path: path.join(evidence, name.replace('.svg', '.png')) });
  }
  const aliases = {
    '01-student-home.svg': '01-scholar-dashboard-desktop.svg',
    '02-student-mobile.svg': '02-scholar-dashboard-mobile.svg',
    '03-scholarships.svg': '03-scholarship-discovery.svg',
    '04-applications-tracker.svg': '07-application-lifecycle-tracker.svg',
    '05-officer-review-queue.svg': '13-officer-review-queue.svg',
    '06-document-wallet.svg': '08-digilocker-document-wallet.svg',
    '07-help-grievances.svg': '09-help-and-saarthi-assistant.svg',
    '08-pilot-signin.svg': '20-pilot-signin-portal.svg',
  };
  for (const [alias, name] of Object.entries(aliases)) {
    assert.equal(await fs.readFile(path.join(root, alias), 'utf8'), await fs.readFile(path.join(root, 'v2', name), 'utf8'));
  }
  for (const alias of ['scholarship-lifecycle.svg', 'scholar-dashboard-redesign.svg']) {
    assert.equal(await fs.readFile(path.resolve('design-plans', alias), 'utf8'), await fs.readFile(path.join(root, 'v2', '01-scholar-dashboard-desktop.svg'), 'utf8'));
  }

  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const gallery of ['index.html', 'v2/index.html']) {
    await page.goto(pathToFileURL(path.join(root, gallery)).href);
    for (const [label, count] of [['Officer portal (7)', 7], ['Sign-in and receipts (3)', 3], ['Scholar portal (12)', 12], ['All screens (22)', 22]]) {
      const button = page.getByRole('button', { name: label, exact: true });
      await button.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.card:visible').count(), count);
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('[aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('#filter-status').textContent(), `Showing ${count} screens`);
    }
    // Decode each preview, including lazy images below the fold.
    const previews = await page.locator('.preview-box img').evaluateAll(async images => Promise.all(images.map(async img => {
      try { await img.decode(); return img.naturalWidth > 0; } catch { return false; }
    })));
    assert.ok(previews.every(Boolean), `${gallery}: broken preview`);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${gallery}: overflow at ${width}px`);
      await page.screenshot({ path: path.join(evidence, `${gallery.startsWith('v2') ? 'gallery-v2' : 'gallery'}-${width}.png`), fullPage: false });
    }
  }
  assert.deepEqual(errors, [], 'Gallery JavaScript errors');
  await fs.writeFile(path.join(evidence, 'viewport-findings.json'), JSON.stringify(findings, null, 2));
  assert.deepEqual(findings, [], 'Text extends beyond a screen: see artifacts/svg-review/viewport-findings.json');
  console.log(`Validated all 22 SVGs, 76 synchronized outputs, both galleries, keyboard filters, and 320/768/1440px layouts.`);
} finally {
  await browser.close();
}
