import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {staging,value} from './staging-helpers.mjs';

const {config,admin}=await staging();
const actors=JSON.parse(await readFile('.staging/actors.json','utf8'));
const fixture=JSON.parse(await readFile('.staging/track-c-fixture.json','utf8'));
const probe=JSON.parse(await readFile('.staging/track-c-actor.json','utf8'));
const directory='artifacts/frontend-connections';
await mkdir(`${directory}/screenshots`,{recursive:true});
const browser=await chromium.launch({headless:true}),checks=[],errors=[];
const section=(page,name)=>page.getByRole('navigation',{name:'Pilot sections'}).getByRole('button',{name,exact:true}).click();
async function login(actor){
 const context=await browser.newContext(),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(config.frontendUrl);await page.getByLabel('Email',{exact:true}).fill(actor.email);await page.getByLabel('Password',{exact:true}).fill(actor.password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.getByRole('heading',{name:'Your pilot workspace',exact:true}).waitFor();return {context,page};
}
const browse=page=>page.locator('details').filter({has:page.locator('summary').filter({hasText:/^Browse and search server records$/})}).first();
async function search(page,key,text){
 const panel=browse(page);if(!await panel.evaluate(el=>el.open))await panel.locator('summary').first().click();
 await panel.getByLabel('Record list',{exact:true}).selectOption(key);await panel.getByLabel('Search records',{exact:true}).fill(text);await panel.getByRole('button',{name:'Search selected list',exact:true}).click();await page.getByText('Page loaded.',{exact:true}).waitFor();return panel;
}
try{
 const application=value(await admin.from('pilot_applications').select('id,version,data').eq('id',fixture.applicationId).single(),'Synthetic application fixture');assert.ok(application.data.signaturePath,'Recorded synthetic pilot signature required');
 let {context,page}=await login(actors.admin);
 await search(page,'applications',application.id);await section(page,'applications');
 const note=`Synthetic frontend note ${new Date().toISOString()}`;
 await page.getByLabel('Internal officer note',{exact:true}).fill(note);
 const noteRequest=page.waitForRequest(r=>r.url().endsWith('/functions/v1/pilot-workflow') && r.postDataJSON()?.action==='add_note');
 await page.getByRole('button',{name:'Save note',exact:true}).click();const sent=(await noteRequest).postDataJSON();assert.deepEqual(sent.payload,{body:note});assert.deepEqual(sent.target,{id:application.id,version:application.version});
 await page.getByText('Saved on server.',{exact:true}).waitFor();await page.getByText(note,{exact:false}).last().waitFor();
 const saved=value(await admin.from('pilot_notes').select('id,data').eq('data->>body',note).single(),'Persisted frontend note');assert.equal(saved.data.applicationId,application.id);
 await page.reload();await page.getByRole('heading',{name:'Your pilot workspace',exact:true}).waitFor();
 let records=await search(page,'notes',saved.id);await records.getByText(note,{exact:true}).waitFor();await records.getByRole('button',{name:'Open related application',exact:true}).click();await page.getByText('Application loaded.',{exact:true}).waitFor();
 checks.push('Versioned officer note persists on the server, survives reload and opens its parent from the paged list');
 const preview=page.getByRole('button',{name:'View recorded pilot signature',exact:true});await preview.click();
 const dialog=page.getByRole('dialog',{name:'Private file preview',exact:true});await dialog.waitFor();
 const url=await dialog.getByRole('link',{name:'Open document in a new tab',exact:true}).getAttribute('href');assert.ok(url.startsWith('blob:'));
 const bytes=await page.evaluate(async url=>Array.from(new Uint8Array(await (await fetch(url)).arrayBuffer()).slice(0,8)),url);assert.deepEqual(bytes,[137,80,78,71,13,10,26,10]);
 await dialog.screenshot({path:`${directory}/screenshots/signature-preview.png`});await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert.ok(await preview.evaluate(el=>el===document.activeElement));checks.push('Recorded private signature downloads actual PNG bytes with modal focus return');
 await section(page,'configuration');await page.getByRole('button',{name:'Refresh accounts',exact:true}).waitFor({state:'visible'});await page.getByRole('button',{name:'Refresh accounts',exact:true}).isEnabled();
 const institutions=page.getByRole('heading',{name:'Institutions',exact:true}).locator('..'),newInstitution=institutions.getByRole('heading',{name:'New institution',exact:true}).locator('..');
 const name=`Synthetic frontend college ${Date.now()}`;
 await newInstitution.getByLabel('Institution name',{exact:true}).fill(name);await newInstitution.getByLabel('State',{exact:true}).fill('Synthetic state');await newInstitution.getByLabel('District',{exact:true}).fill('Synthetic district');await newInstitution.getByRole('button',{name:'Save institution',exact:true}).click();await page.getByText('Saved on server.',{exact:true}).waitFor();
 const college=value(await admin.from('pilot_institutions').select('id,version,data').eq('data->>name',name).single(),'UI-created synthetic institution');
 await search(page,'institutions',college.id);
 let collegePanel=institutions.getByRole('heading',{name,exact:true}).locator('..');
 await collegePanel.getByLabel('Institution deactivation reason',{exact:true}).fill('Synthetic frontend lifecycle verification');await collegePanel.getByRole('button',{name:'Deactivate institution',exact:true}).click();await collegePanel.getByText('Inactive institution',{exact:true}).waitFor();
 let stored=value(await admin.from('pilot_institutions').select('id,version,data').eq('id',college.id).single(),'Deactivated institution');assert.equal(stored.data.active,false);assert.equal(stored.data.deactivationReason,'Synthetic frontend lifecycle verification');
 await collegePanel.getByLabel('Reactivate institution',{exact:true}).check();await collegePanel.getByRole('button',{name:'Save institution',exact:true}).click();await collegePanel.getByText('Active institution',{exact:true}).waitFor();stored=value(await admin.from('pilot_institutions').select('data').eq('id',college.id).single(),'Reactivated institution');assert.equal(stored.data.active,true);
 const history=value(await admin.from('pilot_configuration_history').select('id,data').eq('data->>entityId',college.id).eq('data->>configurationVersion','2').single(),'Institution history');
 await search(page,'configurationHistory',history.id);await collegePanel.getByText('Institution configuration history',{exact:true}).click();await collegePanel.getByText(/Synthetic frontend lifecycle verification/).waitFor();
 await collegePanel.screenshot({path:`${directory}/screenshots/institution-lifecycle.png`});checks.push('UI institution creation, reasoned deactivation, explicit reactivation and persisted configuration history');
 const account=value(await admin.from('pilot_accounts').select('id,version,lifecycle').eq('id',probe.id).single(),'Synthetic account review fixture');
 const accountForm=page.getByRole('heading',{name:'Synthetic Track C student',exact:true}).locator('..');await accountForm.getByRole('button',{name:'Save account access',exact:true}).click();await page.getByText('Saved on server.',{exact:true}).waitFor();
 const updated=value(await admin.from('pilot_accounts').select('version').eq('id',probe.id).single(),'Refreshed account version');assert.ok(updated.version>account.version);
 assert.ok(account.lifecycle?.erasureRequestedAt,'Synthetic erasure review fixture required');
 await section(page,'account');const review=page.getByRole('heading',{name:'Synthetic Track C student',exact:true}).locator('..');await review.getByLabel('Erasure review reason',{exact:true}).fill('Synthetic frontend version refresh verification');await review.getByLabel('Next erasure review',{exact:true}).fill('2026-11-18');
 const reviewRequest=page.waitForRequest(r=>r.url().endsWith('/rest/v1/rpc/pilot_privacy') && r.postDataJSON()?.action==='review_erasure');await review.getByRole('button',{name:'Record erasure review for Synthetic Track C student',exact:true}).click();assert.equal((await reviewRequest).postDataJSON().target.version,updated.version);await page.getByText('Privacy choice recorded.',{exact:true}).waitFor();checks.push('Account save refreshes the shared version before a successful privacy review without a page reload');
 await section(page,'configuration');const population=`synthetic frontend test population ${Date.now()}`;
 const csv='state,district,academicYear,population,enrolled,beneficiaries,sourceUrl\n'+`Synthetic state,Synthetic district,2026-27,${population},42,0,https://example.org/synthetic-frontend-test\n`;
 await page.getByLabel('Baseline CSV',{exact:true}).setInputFiles({name:'synthetic-baseline.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});await page.getByRole('button',{name:'Validate and import baseline',exact:true}).click();await page.getByText('Saved on server.',{exact:true}).waitFor();
 const baseline=value(await admin.from('pilot_baselines').select('id,data').eq('data->>population',population).single(),'UI-imported synthetic baseline');records=await search(page,'baselines',baseline.id);await records.getByText(`enrolled: ${baseline.data.enrolled}`,{exact:true}).waitFor();await records.screenshot({path:`${directory}/screenshots/baseline-record.png`});checks.push('Baseline CSV imports through the UI and its persisted provenance has a paged frontend view');
 await page.setViewportSize({width:320,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await records.screenshot({path:`${directory}/screenshots/records-320.png`});checks.push('Record browser fits 320 CSS pixels');await context.close();
 ({context,page}=await login(actors.family));records=browse(page);await records.locator('summary').first().click();assert.equal(await records.getByLabel('Search records',{exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'View recorded pilot signature',exact:true}).count(),0);await records.screenshot({path:`${directory}/screenshots/family-pages.png`});checks.push('Family interface exposes supported summary paging without fake search or private signature access');await context.close();
 assert.deepEqual(errors,[]);console.log(`PASS ${checks.length} frontend connection browser checks; real Auth/REST/Storage, no mocks`);
}catch(error){console.error('FAIL frontend browser:',error.message.split('\n')[0],error.stack?.split('\n').find(line=>line.includes('test-frontend-browser.mjs')) ?? '');process.exitCode=1;}
finally{await browser.close();await writeFile(`${directory}/browser.json`,JSON.stringify({at:new Date().toISOString(),passed:!process.exitCode,checks,errors},null,2));}
