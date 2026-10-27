import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {staging} from './staging-helpers.mjs';
const {config}=await staging(),actors=JSON.parse(await readFile('.staging/actors.json','utf8'));
await mkdir('artifacts/operations/screenshots',{recursive:true});const browser=await chromium.launch({headless:true}),errors=[];
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(config.frontendUrl);await page.getByLabel('Email',{exact:true}).fill(actors.admin.email);await page.getByLabel('Password',{exact:true}).fill(actors.admin.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Your pilot workspace',exact:true}).waitFor();
 await page.getByRole('navigation',{name:'Pilot sections'}).getByRole('button',{name:'configuration',exact:true}).click();
 const panel=page.getByRole('heading',{name:'Operations',exact:true}).locator('..');await panel.getByRole('button',{name:'Refresh operation status',exact:true}).click();await page.getByText('Operation status refreshed.',{exact:true}).waitFor();
 assert.ok(await panel.getByText(/backup_verified/).count());assert.ok(await panel.getByText(/backup_upload_failed/).count());assert.ok(await panel.getByText(/email_provider_not_configured/).count());
 await panel.locator('details').filter({hasText:'backup_verified'}).first().locator('summary').click();await panel.screenshot({path:'artifacts/operations/screenshots/operator-jobs.png'});
 await page.setViewportSize({width:320,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await panel.screenshot({path:'artifacts/operations/screenshots/operator-jobs-320.png'});
 await page.getByRole('navigation',{name:'Pilot sections'}).getByRole('button',{name:'notifications',exact:true}).click();await page.getByRole('heading',{name:'Pilot operations recovered / backup saved',exact:true}).first().waitFor();
 await page.screenshot({path:'artifacts/operations/screenshots/operator-recovery-alert.png',fullPage:true});assert.deepEqual(errors,[]);
 await writeFile('artifacts/operations/browser.json',JSON.stringify({at:new Date().toISOString(),passed:true,checks:['Deployed operator job status shows actual failure, encrypted recovery metadata and missing mail provider','Operator panel fits 320 CSS pixels','Administrator can see actual recovery notifications'],errors},null,2));
 console.log('PASS 3 hosted operations browser groups; actual administrator UI and 320px layout');
}catch(error){console.error('FAIL operations browser:',error.message.split('\n')[0]);process.exitCode=1;}
finally{await browser.close();}
