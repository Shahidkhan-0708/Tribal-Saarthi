import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {staging,value} from './staging-helpers.mjs';
const {config,admin}=await staging(),actors=JSON.parse(await readFile('.staging/actors.json','utf8')),probe=JSON.parse(await readFile('.staging/track-c-actor.json','utf8')),fixture=JSON.parse(await readFile('.staging/track-c-fixture.json','utf8'));
await mkdir('artifacts/track-c/screenshots',{recursive:true});
const browser=await chromium.launch({headless:true}),checks=[],errors=[];
const login=async(actor)=>{const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(config.frontendUrl);await page.getByLabel('Email',{exact:true}).fill(actor.email);await page.getByLabel('Password',{exact:true}).fill(actor.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Your pilot workspace',exact:true}).waitFor();return {context,page};};
const section=async(page,name)=>page.getByRole('navigation',{name:'Pilot sections'}).getByRole('button',{name,exact:true}).click();
try{
 let {context,page}=await login(actors.admin);
 await section(page,'configuration');await page.getByRole('heading',{name:'Account lifecycle',exact:true}).waitFor();
 await page.getByRole('heading',{name:'Synthetic Track C student',exact:true}).waitFor();
 await page.getByLabel('Pending invitations only',{exact:true}).check();await page.getByLabel('Pending invitations only',{exact:true}).uncheck();
 await page.getByRole('heading',{name:'Scheme draft, publish and rollback',exact:true}).waitFor();
 const scheme=value(await admin.from('pilot_schemes').select('data').eq('id',fixture.schemeId).single(),'Browser scheme fixture');
 await page.getByRole('heading',{name:scheme.data.name,exact:true}).locator('..').getByRole('button',{name:'Dry-run against pilot cohort',exact:true}).click();
 await page.getByText('Cohort dry-run results',{exact:true}).waitFor();
 await page.screenshot({path:'artifacts/track-c/screenshots/configuration.png',fullPage:true,mask:[page.locator('form.pilot-row').filter({hasText:config.adminEmail})]});checks.push('Administrator lifecycle list, pending filter and versioned scheme controls render');
 await section(page,'audit');await page.getByRole('heading',{name:'Scoped audit trail',exact:true}).waitFor();
 await page.getByRole('button',{name:'Next audit page',exact:true}).click();await page.getByText('Page 2 · 50 records per page',{exact:true}).waitFor();await page.getByRole('button',{name:'Previous audit page',exact:true}).click();
 await page.getByLabel('Action',{exact:true}).fill('draft_scheme');await page.getByRole('button',{name:'Apply audit filters',exact:true}).click();
 const auditDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export filtered CSV',exact:true}).click();const audit=await auditDownload;await audit.saveAs('artifacts/track-c/audit-export.csv');const auditText=await readFile('artifacts/track-c/audit-export.csv','utf8');assert.ok(auditText.includes('"draft_scheme"'));assert.ok(!auditText.includes('@'));checks.push('Filtered administrator audit CSV downloads from real scoped queries');
 await page.screenshot({path:'artifacts/track-c/screenshots/audit.png',fullPage:true});await context.close();
 ({context,page}=await login(actors.nodal));await section(page,'analytics');await page.getByText('Pilot cohort only: not district-wide coverage.',{exact:true}).waitFor();
 const coverageDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Export scoped coverage CSV',exact:true}).click();const coverage=await coverageDownload;await coverage.saveAs('artifacts/track-c/coverage-export.csv');const coverageText=await readFile('artifacts/track-c/coverage-export.csv','utf8');assert.ok(coverageText.includes('comparabilityReason'));assert.ok(!coverageText.includes('Khordha'));assert.ok(await page.locator('meter').count()>0);checks.push('Nodal scoped analytics CSV, comparability explanation and charts render');
 await page.screenshot({path:'artifacts/track-c/screenshots/analytics.png',fullPage:true});await context.close();
 ({context,page}=await login(probe));await section(page,'grievances');await page.getByRole('heading',{name:'Synthetic Track C grievance',exact:true}).first().waitFor();await page.getByRole('button',{name:'Preview evidence: Synthetic grievance evidence',exact:true}).first().click();await page.getByRole('dialog',{name:'Private file preview',exact:true}).waitFor();assert.ok((await page.getByRole('link',{name:'Open document in a new tab',exact:true}).getAttribute('href')).startsWith('blob:'));checks.push('Student grievance timeline and authenticated private-byte evidence preview work');
 await page.screenshot({path:'artifacts/track-c/screenshots/grievance-preview.png',fullPage:true});await context.close();
 const app=value(await admin.from('pilot_applications').select('data').eq('id',fixture.applicationId).single(),'Synthetic receipt fixture');
 context=await browser.newContext();page=await context.newPage();await page.goto(`${config.frontendUrl}/?receipt=${app.data.receiptToken}`);await page.getByText('Revoked or expired receipt',{exact:true}).waitFor();const publicText=await page.locator('main').innerText();assert.ok(!publicText.includes(actors.student.email));checks.push('Anonymous receipt displays revocation and no student email');await page.screenshot({path:'artifacts/track-c/screenshots/receipt-revoked.png'});await context.close();
 assert.deepEqual(errors,[]);console.log(`PASS ${checks.length} hosted Track C browser checks; real Auth/REST/Storage, no mocks`);
}catch(error){console.error(error.message);process.exitCode=1;}
finally{await browser.close();await writeFile('artifacts/track-c/browser.json',JSON.stringify({at:new Date().toISOString(),passed:!process.exitCode,frontendUrl:config.frontendUrl,checks,errors},null,2));}
