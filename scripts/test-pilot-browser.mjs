import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const env = { ...process.env, VITE_APP_MODE:'pilot', VITE_SUPABASE_URL:'https://pilot.test', VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_browser_fixture' };
const build = spawn(process.execPath,['node_modules/vite/bin/vite.js','build','--mode','pilot','--outDir','.pilot-browser-dist'],{env,stdio:['ignore','pipe','pipe']});
let output=''; build.stdout.on('data',chunk=>output+=chunk); build.stderr.on('data',chunk=>output+=chunk);
await new Promise((resolve,reject)=>{ build.on('error',reject); build.on('exit',code=>code===0?resolve():reject(new Error(output))); });
const root = path.resolve('.pilot-browser-dist');
const mime = {'.webmanifest':'application/manifest+json','.json':'application/json','.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'};
const server = createServer(async(req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const filename = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!filename.startsWith(root+path.sep)) { res.writeHead(403).end(); return; }
    const file = await readFile(filename).catch(()=>readFile(path.join(root,'index.html')));
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]??'text/html','Cache-Control':'no-cache'}).end(file);
  } catch { res.writeHead(500).end(); }
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'allow'});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const studentId='00000000-0000-4000-8000-000000000002';
  const account={id:studentId,email:'student@example.org',name:'Pilot Student',role:'student',institution_id:'college',state:'Jharkhand',active:true};
  const data={pilot_students:[{id:studentId,version:1,data:{id:studentId,name:'Pilot Student',gender:'F',dob:'2004-01-01',aadhaarLast4:'1234',tribe:'Oraon',isPVTG:false,category:'ST',familyIncome:100000,fatherName:'Guardian',domicileState:'Jharkhand',domicileDistrict:'Ranchi',homeVillage:'Village',language:'en',courseLevel:'undergrad',course:'BA',institutionId:'college',year:'1',familyViewConsent:false}}],pilot_schemes:[{id:'pilot',version:1,data:{id:'pilot',name:'Pilot scholarship',shortName:'Pilot',portal:'NSP',ministry:'Pilot',courseLevels:['undergrad'],amount:'1000',benefits:['Pilot'],deadline:'2099-12-31',requiredDocs:[],rules:[],notes:'Browser transport fixture',academicYear:'2026-27',active:true,sanctionAmount:1000}}],pilot_institutions:[{id:'college',version:1,data:{name:'College',state:'Jharkhand',district:'Ranchi',inSchemeBasket:true}}],pilot_applications:[]};
  const committed=new Map(); let workflowRequests=0, conflictNext=false, conflictOperation;
  const user={id:studentId,email:account.email,aud:'authenticated',role:'authenticated',email_confirmed_at:new Date().toISOString(),app_metadata:{provider:'email'},user_metadata:{},created_at:new Date().toISOString()};
  const token=`${Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')}.${Buffer.from(JSON.stringify({sub:studentId,exp:Math.floor(Date.now()/1000)+3600,role:'authenticated'})).toString('base64url')}.fixture`;
  await context.route('https://pilot.test/**',async route=>{
    const url=new URL(route.request().url());
    let body;
    if(url.pathname==='/auth/v1/token') body={access_token:token,token_type:'bearer',expires_in:3600,refresh_token:'fixture-refresh',user};
    else if(url.pathname==='/auth/v1/user') body=user;
    else if(url.pathname==='/auth/v1/logout') body={};
    else if(url.pathname==='/rest/v1/rpc/pilot_snapshot'){
      const {requests}=route.request().postDataJSON();
      body={pages:Object.fromEntries(Object.entries(requests).map(([dataset,options])=>{const items=dataset==='accounts'?[account]:data[`pilot_${dataset}`]??[];const matching=items.filter(r=>!options.search || JSON.stringify(r).toLowerCase().includes(options.search.toLowerCase()));return [dataset,{items:matching.slice(options.page*50,options.page*50+50),hasMore:matching.length>(options.page+1)*50,page:options.page,search:options.search}];})),context:{students:data.pilot_students,schemes:data.pilot_schemes,documents:[],verifications:[]},metrics:{students:1,applications:data.pilot_applications.length,allApplications:data.pilot_applications.length,beneficiaries:0,disbursedAmount:0,openDeficiencies:0,simulatedPayments:0,funnel:[],districts:[],pvtg:[]}};
    }
    else if(url.pathname.startsWith('/rest/v1/')) {
      const table=url.pathname.split('/').pop();
      body=table==='pilot_accounts'?(url.searchParams.has('id')?account:[account]):data[table]??[];
      const range=route.request().headers().range;
      if(Array.isArray(body) && range) { const [first,last]=range.split('-').map(Number); body=body.slice(first,last+1); }
      if(Array.isArray(body) && url.searchParams.get('offset')) body=body.slice(Number(url.searchParams.get('offset')));
      if(Array.isArray(body) && route.request().headers().accept?.includes('vnd.pgrst.object')) body=body.find(r=>`eq.${r.id}`===url.searchParams.get('id'));
    } else if(url.pathname==='/functions/v1/pilot-workflow') {
      workflowRequests++; const request=route.request().postDataJSON();
      if(committed.has(request.operationId)) body=committed.get(request.operationId);
      else {
        assert.equal(request.action,'save_draft');
        if(conflictNext){conflictNext=false;conflictOperation=request.operationId;data.pilot_applications[0].version++;await route.fulfill({status:409,json:{code:'conflict'},headers:{'Access-Control-Allow-Origin':origin}});return;}
        const existing=request.target && data.pilot_applications.find(a=>a.id===request.target.id);
        body={id:existing?.id ?? crypto.randomUUID(),version:existing?existing.version+1:1,data:{...request.payload,studentId,status:'draft'}};
        if(existing)Object.assign(existing,body);else data.pilot_applications.push(body);committed.set(request.operationId,body);
      }
    } else { await route.fulfill({status:404,json:{error:'Unexpected browser fixture endpoint'}});return; }
    await route.fulfill({status:200,json:body,headers:{'Access-Control-Allow-Origin':origin}});
  });
  await page.goto(origin);
  await page.getByLabel('Email',{exact:true}).fill(account.email);
  await page.getByLabel('Password',{exact:true}).fill('browser-fixture-password');
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.locator('.case-dashboard').waitFor();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await page.waitForFunction(async()=>{
    const cachesNames=await caches.keys(); const cache=await caches.open(cachesNames.find(n=>n.startsWith('tribe-pilot-shell-')));
    const resources=performance.getEntriesByType('resource').filter(r=>r.name.includes('/assets/') && /\.(js|css)$/.test(new URL(r.name).pathname));
    return resources.length>0 && (await Promise.all(resources.map(r=>cache.match(r.name)))).every(Boolean);
  });
  await mkdir('.gsd/evidence',{recursive:true});
  await page.screenshot({path:'.gsd/evidence/pilot-desktop.png',fullPage:true});
  assert.equal(await page.getByRole('heading',{level:1}).count(),1,'one primary heading');
  const cdp=await context.newCDPSession(page),manifest=await cdp.send('Page.getAppManifest');
  assert.deepEqual(manifest.errors,[],'install manifest parses');assert.equal(JSON.parse(manifest.data).display,'standalone');
  // Extra DevTools sessions interfere with offline emulation across reloads.
  await cdp.detach();
  for(const size of [192,512])assert.equal(await page.evaluate(async size=>{const image=new Image();image.src=`/pilot-icon-${size}.png`;await image.decode();return image.naturalWidth;},size),size);
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(()=>document.activeElement instanceof HTMLElement),'keyboard focus is available');
  await page.getByRole('button',{name:'schemes',exact:true}).click();
  await page.getByRole('button',{name:'Prepare application',exact:true}).click();
  await page.getByRole('button',{name:'Save draft',exact:true}).waitFor();
  await context.setOffline(true);assert.equal(await page.evaluate(()=>navigator.onLine),false,'browser enters offline state');
  await page.getByRole('button',{name:'Save draft',exact:true}).click();
  await page.getByText('Saved locally; pending server acknowledgement.',{exact:true}).waitFor();
  assert.equal(workflowRequests,0,'offline drafts must not call backend');
  await page.reload();
  await page.locator('.case-dashboard').waitFor();
  await page.getByRole('button',{name:'offline',exact:true}).click();
  await page.getByText(/Application draft · Pilot scholarship/).waitFor().catch(async error=>{console.error((await page.locator('main').innerText()).slice(-3000));throw error;});
  await context.setOffline(false);
  await page.waitForFunction(()=>document.body.textContent.includes('Connected; server records refreshed.'));
  await page.getByRole('button',{name:'applications',exact:true}).click();
  await page.getByText('Application actions and complete evidence',{exact:true}).click();
  await page.locator('#pilot-application-actions').getByRole('heading',{name:'Pilot scholarship'}).waitFor();
  assert.equal(committed.size,1,'queued draft must commit exactly once');
  await context.setOffline(true);assert.equal(await page.evaluate(()=>navigator.onLine),false,'browser enters offline state');
  await page.getByRole('button',{name:'Update draft',exact:true}).click();
  await page.getByText('Saved locally; pending server acknowledgement.',{exact:true}).waitFor();
  conflictNext=true;await context.setOffline(false);
  await page.getByRole('button',{name:'offline',exact:true}).click();
  await page.getByRole('button',{name:'Compare with server draft',exact:true}).waitFor();
  await page.getByRole('button',{name:'Compare with server draft',exact:true}).click();
  await page.getByRole('heading',{name:'Current server draft · v2',exact:true}).waitFor();
  await page.getByRole('button',{name:'Refresh and retry reviewed changes',exact:true}).click();
  await page.getByText('Reviewed draft queued with a new operation ID.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Sync pending operations',exact:true}).click();
  await page.getByText('No pending operations.',{exact:true}).waitFor();
  assert.equal(data.pilot_applications[0].version,3,'reviewed conflict retries against the current server version');
  assert.ok(!committed.has(conflictOperation) && committed.size===2,'conflict retry uses a new operation ID');
  await page.getByRole('button',{name:'applications',exact:true}).click();
  await page.setViewportSize({width:320,height:844});
  await page.screenshot({path:'.gsd/evidence/pilot-mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),'mobile layout must not overflow horizontally');
  await page.setViewportSize({width:640,height:900});await page.evaluate(()=>document.body.style.zoom='2');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),'200 percent zoom reflows at 320 CSS pixels');
  await page.evaluate(()=>document.body.style.zoom='1');
  assert.deepEqual(errors,[],'browser runtime must not throw');
  await page.setViewportSize({width:1440,height:960});
  const visualFolder='artifacts/svg-implementation/pilot';await mkdir(visualFolder,{recursive:true});
  for(const section of ['overview','profile','schemes','documents','applications','family','assistant','offline']){
    await page.getByRole('navigation',{name:'Pilot sections'}).getByRole('button',{name:section,exact:true}).click();
    await page.screenshot({path:`${visualFolder}/${section}.png`});
    for(const width of [375,320]){await page.setViewportSize({width,height:812});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${section} reflows at ${width}px`);}
    await page.setViewportSize({width:1440,height:960});
  }
  account.role='nodal';await page.reload();await page.locator('.case-officer').waitFor();
  for(const section of ['overview','applications','documents','analytics','audit','offline']){
    await page.getByRole('navigation',{name:'Pilot sections'}).getByRole('button',{name:section,exact:true}).click();
    await page.screenshot({path:`${visualFolder}/officer-${section}.png`});
    await page.setViewportSize({width:320,height:812});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`officer ${section} reflows at 320px`);await page.setViewportSize({width:1440,height:960});
  }
  await page.getByRole('button',{name:'Sign out',exact:true}).click();
  await page.getByRole('button',{name:'Sign in',exact:true}).waitFor();
  const deniedContext=await browser.newContext();
  await deniedContext.addInitScript(()=>Object.defineProperty(navigator,'serviceWorker',{configurable:true,value:{register:()=>Promise.reject(new DOMException('The user denied permission to use Service Worker.','NotSupportedError'))}}));
  const deniedPage=await deniedContext.newPage();
  deniedPage.on('pageerror',error=>errors.push(error.message));
  await deniedPage.goto(origin);
  await deniedPage.getByText('Offline access is unavailable in this browser. You can still sign in and work online.',{exact:true}).waitFor();
  assert.ok(await deniedPage.getByRole('button',{name:'Sign in',exact:true}).isEnabled(),'offline permission denial must not disable online sign-in');
  assert.equal(await deniedPage.getByText(/NotSupportedError/).count(),0,'raw browser exceptions must not appear in the login form');
  await deniedPage.screenshot({path:'.gsd/evidence/pilot-offline-permission.png',fullPage:true});
  assert.deepEqual(errors,[],'denied service worker registration must be handled');
  await deniedContext.close();
  console.log('PASS built pilot login, cached offline reload, durable draft replay, reviewed stale-draft conflict with new operation ID, logout, mobile layout and denied-offline online-sign-in fallback; mocked Supabase transport, real browser/IndexedDB/service worker');
} catch(error) { console.error('FAIL browser validation:',error.message);process.exitCode=1; }
finally { await browser?.close(); await new Promise(resolve=>server.close(resolve)); }
