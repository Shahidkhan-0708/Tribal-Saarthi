import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
import {randomUUID} from 'node:crypto';
import {staging,value} from './staging-helpers.mjs';
const {config,admin,client}=await staging(),actors=JSON.parse(await readFile('.staging/actors.json','utf8')),student=JSON.parse(await readFile('.staging/track-c-actor.json','utf8'));
const checks=[],errors=[],browser=await chromium.launch({headless:true});
await mkdir('artifacts/track-de/screenshots',{recursive:true});
const keyboardTo=async(page,target)=>{for(let n=0;n<180;n++){if(await target.evaluate(el=>el===document.activeElement))return;await page.keyboard.press('Tab');}throw new Error('Control unreachable by keyboard');};
const login=async actor=>{const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(config.frontendUrl);await keyboardTo(page,page.getByLabel('Email',{exact:true}));await page.keyboard.type(actor.email);await page.keyboard.press('Tab');await page.keyboard.type(actor.password);await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Your pilot workspace',exact:true}).waitFor();return {context,page};};
const section=async(page,name)=>{await keyboardTo(page,page.getByRole('navigation').getByRole('button',{name,exact:true}));await page.keyboard.press('Enter');};
try{
 const operator=client();value(await operator.auth.signInWithPassword({email:actors.admin.email,password:actors.admin.password}),'Synthetic operator login');
 const prior=JSON.parse(await readFile('.staging/track-c-fixture.json','utf8')),base=value(await admin.from('pilot_schemes').select('data').eq('id',prior.schemeId).single(),'Source scheme');
 assert.ok(base.data.requiredDocs.length>0,'Synthetic journey must exercise attachments');
 const schemeId=randomUUID(),schemeName=`Keyboard journey ${schemeId.slice(0,8)}`;
 const command=async(action,payload,target)=>value(await operator.functions.invoke('pilot-workflow',{body:{action,payload,target:target?{id:target.id,version:target.version}:undefined,operationId:randomUUID()}}),action);
 const draft=await command('draft_scheme',{schemeId,config:{...base.data,id:schemeId,name:schemeName,rules:[],active:true,deadline:'2099-12-31',notes:'Synthetic keyboard journey only',sanctionAmount:1000}});await command('publish_scheme',{},draft);
 let {context,page}=await login(student);assert.equal(await page.locator('h1').count(),1);checks.push('Keyboard-only login and a single primary heading');
 await section(page,'documents');
 for(const type of base.data.requiredDocs){
  const upload=page.locator('form').filter({has:page.locator('input[type="file"]')}),select=upload.locator('select[name="type"]');await keyboardTo(page,select);
  const options=await select.locator('option').evaluateAll(elements=>elements.map(el=>el.value)),index=options.indexOf(type);assert.ok(index>=0);await page.keyboard.press('Home');for(let n=0;n<index;n++)await page.keyboard.press('ArrowDown');
  const title=`Synthetic keyboard ${schemeId.slice(0,8)} ${type}`;await keyboardTo(page,upload.getByLabel('Title',{exact:true}));await page.keyboard.press('ControlOrMeta+A');await page.keyboard.type(title);
  const file=upload.locator('input[type="file"]');await keyboardTo(page,file);await file.setInputFiles('public/pilot-icon-192.png');await keyboardTo(page,upload.getByRole('button',{name:'Upload document',exact:true}));await page.keyboard.press('Enter');await page.getByText('Saved on server.',{exact:true}).waitFor();
  const evidence=value(await admin.from('pilot_documents').select('id,version').eq('data->>studentId',student.id).eq('data->>title',title).single(),'Uploaded keyboard evidence');await command('review_document',{status:'verified',reason:'Explicitly synthetic evidence for keyboard testing'},evidence);
 }
 await page.reload();await page.getByRole('heading',{name:'Your pilot workspace',exact:true}).waitFor();checks.push('Private upload controls reached by keyboard and real files stored; file selection supplied by the headless driver');
 await section(page,'schemes');const schemePanel=page.getByRole('heading',{name:schemeName,exact:true}).locator('..');await schemePanel.waitFor();
 for(const type of base.data.requiredDocs){const select=schemePanel.getByLabel(`Attach ${type.replaceAll('_',' ')}`);await keyboardTo(page,select);const labels=await select.locator('option').allTextContents(),index=labels.findIndex(t=>/\bverified\b/.test(t));assert.ok(index>0,'Previously reviewed synthetic document exists');await page.keyboard.press('Home');for(let n=0;n<index;n++)await page.keyboard.press('ArrowDown');}
 await keyboardTo(page,schemePanel.getByRole('button',{name:'Save draft',exact:true}));await page.keyboard.press('Enter');await page.getByText('Saved on server.',{exact:true}).waitFor();
 await section(page,'applications');let applicationPanel=page.getByRole('heading',{name:schemeName,exact:true}).locator('..');await keyboardTo(page,applicationPanel.getByRole('button',{name:'Submit application',exact:true}));await page.keyboard.press('Enter');await applicationPanel.getByRole('button',{name:'Show receipt QR',exact:true}).waitFor();
 const application=value(await admin.from('pilot_applications').select('id,version,data').eq('data->>schemeId',schemeId).single(),'Keyboard application');assert.equal(application.data.status,'institute_stage');checks.push('Student attaches immutable versions, saves, submits and sees server status using keyboard');
 for(const source of ['identity','st_certificate','income','institution','academic']){const v=await command('run_verification',{source},application);await command('review_verification',{state:'verified',reason:'Synthetic authorized human review for keyboard journey'},v);}
 await section(page,'account');await page.getByRole('heading',{name:'Privacy and consent',exact:true}).waitFor();
 const consent=page.getByRole('button',{name:'Allow DigiLocker document fetch for scholarship assessment',exact:true});await keyboardTo(page,consent);await page.keyboard.press('Enter');await page.getByText('Privacy choice recorded.',{exact:true}).waitFor();
 const revoke=page.getByRole('button',{name:'Revoke document_fetch',exact:true});await keyboardTo(page,revoke);await page.keyboard.press('Enter');await revoke.waitFor({state:'detached'});checks.push('Keyboard consent grant/revoke with an announced acknowledgement');
 await page.setViewportSize({width:320,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'artifacts/track-de/screenshots/student-320.png',fullPage:true});
 await page.setViewportSize({width:640,height:900});await page.evaluate(()=>document.body.style.zoom='2');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.evaluate(()=>document.body.style.zoom='1');checks.push('Student account at 320 CSS pixels and 200 percent zoom');
 await page.getByRole('combobox',{name:'Language',exact:true}).selectOption('hi');assert.equal(await page.locator('.pilot-app').getAttribute('lang'),'hi');checks.push('Translated pilot content has a Hindi language attribute');await context.close();
 ({context,page}=await login(actors.admin));await section(page,'applications');applicationPanel=page.getByRole('heading',{name:schemeName,exact:true}).locator('..');
 for(const name of ['Approve institution stage','Approve department stage']){const button=applicationPanel.getByRole('button',{name,exact:true});await button.waitFor();await keyboardTo(page,button);await page.keyboard.press('Enter');}
 const sanction=applicationPanel.getByRole('button',{name:'Sign pilot sanction',exact:true});await sanction.waitFor();await keyboardTo(page,sanction);await page.keyboard.press('Enter');
 const signature=page.getByRole('dialog',{name:'Pilot sanction signature',exact:true});await signature.waitFor();await keyboardTo(page,signature.getByLabel('Or type your name (keyboard signature)',{exact:true}));await page.keyboard.type('Synthetic keyboard officer');await keyboardTo(page,signature.getByRole('button',{name:'Sign and record sanction',exact:true}));await page.keyboard.press('Enter');await signature.waitFor({state:'detached'});
 assert.equal(value(await admin.from('pilot_applications').select('data').eq('id',application.id).single(),'Recorded sanction').data.status,'sanctioned');checks.push('Officer institution/department approvals and typed pilot sanction work by keyboard');
 await section(page,'documents');
 const preview=page.getByRole('button',{name:'View private file',exact:true}).first();await preview.waitFor();await keyboardTo(page,preview);await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Private file preview'});await dialog.waitFor();
 assert.ok(await dialog.evaluate(el=>el instanceof HTMLDialogElement && el.open));
 for(let i=0;i<5;i++){await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)));}
 await page.keyboard.press('Escape');await dialog.waitFor({state:'detached'});assert.ok(await preview.evaluate(el=>el===document.activeElement));checks.push('Officer private-file dialog contains focus, closes with Escape and returns focus');
 await section(page,'analytics');await page.getByRole('heading',{name:'Pilot coverage',exact:true}).waitFor();const exportButton=page.getByRole('button',{name:'Export scoped coverage CSV',exact:true});await keyboardTo(page,exportButton);const download=page.waitForEvent('download');await page.keyboard.press('Enter');assert.equal((await download).suggestedFilename(),'pilot-coverage.csv');checks.push('Officer analytics export is keyboard reachable');
 const manifest=await page.request.get(`${config.frontendUrl}/pilot.webmanifest`);assert.ok(manifest.ok());assert.match(manifest.headers()['content-type'],/json/);const m=await manifest.json();assert.equal(m.display,'standalone');for(const size of [192,512])assert.equal(await page.evaluate(async size=>{const i=new Image();i.src=`/pilot-icon-${size}.png`;await i.decode();return i.naturalWidth;},size),size);checks.push('Hosted manifest, standalone display and correctly sized icons');
 await context.close();assert.deepEqual(errors,[]);console.log(`PASS ${checks.length} hosted keyboard/mobile/PWA checks; real browser and services`);
}catch(error){console.error('FAIL hosted Track E browser:',error.message);process.exitCode=1;}
finally{await browser.close();await writeFile('artifacts/track-de/browser.json',JSON.stringify({at:new Date().toISOString(),passed:!process.exitCode,checks,errors},null,2));}
