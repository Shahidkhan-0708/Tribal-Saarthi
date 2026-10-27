import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { preview } from 'vite';
import { chromium } from '@playwright/test';

const server = await preview({preview:{host:'127.0.0.1',port:0,open:false}});
const browser = await chromium.launch({ headless: true });
const folder = 'artifacts/svg-implementation';
await mkdir(folder, { recursive: true });
const screens = [
  ['01', '/student'], ['02', '/student', 375], ['03', '/student/discovery'],
  ['04', '/student/application/new?step=1'], ['05', '/student/application/new?step=2'], ['06', '/student/application/new?step=3'],
  ['07', '/student/application'], ['08', '/student/wallet'], ['09', '/student/grievance'],
  ['10', '/student/profile'], ['11', '/student/family'], ['12', '/student/offline'],
  ['13', '/officer'], ['14', '/officer/inspection'], ['15', '/officer/inspection?notice=1'],
  ['16', '/officer/sanction'], ['17', '/officer/testing'], ['18', '/officer/coverage'], ['19', '/officer/audit'],
  ['20', '/login'], ['21', '/recover'], ['22', '/receipt'],
];
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', e => {errors.push(e.message);console.error(e.message);});
  await page.goto(new URL('/student', server.resolvedUrls.local[0]).href, {waitUntil:'domcontentloaded'});
  for (const [id, route, width = 1440] of screens) {
    if (id === '13') await page.getByLabel('Demo persona').selectOption('usr_verma');
    if (id === '22') {
      await page.goto(new URL('/student', server.resolvedUrls.local[0]).href, {waitUntil:'domcontentloaded'});
      await page.getByLabel('Demo persona').selectOption('usr_asha');
    }
    await page.setViewportSize({ width, height: width === 375 ? 812 : 960 });
    await page.goto(new URL(route, server.resolvedUrls.local[0]).href, {waitUntil:'domcontentloaded'});
    await page.locator('h1:visible').first().waitFor();
    if (id === '15') await page.getByRole('button', { name: 'Issue notice', exact: true }).click();
    await page.screenshot({ path: `${folder}/${id}.png` });
    assert.equal(await page.locator('img[src$=".svg"]').count(), 0, `${id}: native controls, not an embedded screen`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `${id}: no horizontal page overflow`);
    results.push({ id, route, width, overflow }); console.log(`Screen ${id}: ${route}`);
  }
  await page.goto(new URL('/student', server.resolvedUrls.local[0]).href, {waitUntil:'domcontentloaded'});
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 812 });
    await page.getByLabel('Navigation menu', {exact:true}).click();
    await page.getByRole('navigation', { name: 'Scholar navigation' }).waitFor();
    await page.keyboard.press('Escape');
    for (const route of screens.filter(s=>s[1].startsWith('/student')).map(s=>s[1])) {
      await page.goto(new URL(route, server.resolvedUrls.local[0]).href, {waitUntil:'domcontentloaded'});
      await page.locator('h1:visible').first().waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}: ${route}`);
    }
    await page.getByLabel('Navigation menu', {exact:true}).click();
    await page.getByLabel('Mobile demo persona', {exact:true}).selectOption('usr_verma');
    await page.waitForURL('**/officer');
    await page.keyboard.press('Escape');
    for (const route of ['/officer','/officer/inspection','/officer/sanction','/officer/testing','/officer/coverage','/officer/audit']) {
      console.log(`Mobile ${width}: ${route}`);
      await page.goto(new URL(route, server.resolvedUrls.local[0]).href, {waitUntil:'domcontentloaded'});
      await page.locator('h1:visible').first().waitFor().catch(async e=>{await page.screenshot({path:`${folder}/mobile-failure.png`});console.error((await page.locator('body').innerText()).slice(0,1500));throw e;});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}: ${route}`);
    }
    await page.screenshot({path:`${folder}/officer-${width}.png`});
    await page.getByLabel('Navigation menu', {exact:true}).click();
    await page.getByLabel('Mobile demo persona', {exact:true}).selectOption('usr_asha');
    await page.waitForURL('**/student');
    await page.keyboard.press('Escape');
  }
  assert.deepEqual(errors, []);
  await writeFile(`${folder}/results.json`, JSON.stringify({ screens: results, mobileWidths: [375,320], errors }, null, 2));
  console.log(`PASS ${results.length} native SVG screen states, scholar/officer routes at 375/320px, drawer and zero uncaught errors.`);
} finally {
  await browser.close();
  await new Promise(resolve=>server.httpServer.close(resolve));
}
