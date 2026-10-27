import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
let handler,uploadError=false,monitorError=false,claims=0,outcomes=[];
const environment={SUPABASE_URL:'https://project.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fixture',PILOT_ALLOWED_ORIGINS:'http://localhost:5173',PILOT_OPERATIONS_TOKEN:'a'.repeat(64),PILOT_BACKUP_KEY:'b'.repeat(64),PILOT_MONITOR_URL:'https://tribe-saarthi-staging.vercel.app'};
const saved=new Map();
globalThis.Deno={env:{get:key=>environment[key]},serve:fn=>{handler=fn;}};
globalThis.fetch=async()=>new Response(monitorError?'Unavailable':'<div id="root"></div>',{status:monitorError?503:200});
globalThis.__operationClient={
 rpc:async(name,args)=>{
  if(name==='pilot_job_claim'){claims++;return {data:{id:crypto.randomUUID()},error:null};}
  if(name==='pilot_job_finish'){outcomes.push(args);return {data:null,error:null};}
  if(name==='pilot_job_health')return {data:{backupFresh:true,failedJobs:0,reminderFailed:false},error:null};
  if(name==='pilot_claim_email')throw new Error('Unconfigured mail must not consume delivery attempts');
  if(name==='pilot_backup_snapshot')return {data:{at:'2026-10-18',columns:[{column_name:'id'}],data:{'auth.users':[{id:'user-1',encrypted_password:'private fixture hash'}],'public.pilot_documents':[]},objects:[]},error:null};
  throw new Error('Unexpected RPC');
 },
 from:()=>{const q={select:()=>q,eq:()=>q,limit:async()=>({data:[],error:null})};return q;},
 storage:{from:()=>({upload:async(path,bytes)=>{if(uploadError)return {data:null,error:{message:'private provider details'}};saved.set(path,bytes);return {data:{path},error:null};}})},
};
let source=(await readFile('supabase/functions/_shared/http.ts','utf8')).replace(/^import .*createClient.*\r?\n/m,'const createClient=()=>globalThis.__operationClient;\n');
for(const file of ['_shared/backup.ts','_shared/notifications.ts','_shared/email-queue.ts','pilot-operations/index.ts'])source+='\n'+(await readFile(`supabase/functions/${file}`,'utf8')).replace(/^import .*\r?\n/gm,'');
await import(`data:text/javascript;base64,${Buffer.from(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText).toString('base64')}`);
const request=(body,token=environment.PILOT_OPERATIONS_TOKEN)=>new Request('https://project.supabase.co/functions/v1/pilot-operations',{method:'POST',headers:{'content-type':'application/json',...(token?{'x-pilot-operations-token':token}:{})},body:JSON.stringify(body)});
let checks=0;
for(const token of [null,'wrong','Bearer valid-user-jwt']){assert.equal((await handler(request({job:'backup'},token))).status,401);checks++;}
assert.equal(claims,0);checks++;
assert.equal((await handler(request({job:'unknown'}))).status,400);checks++;
let response=await handler(request({job:'backup'}));assert.equal(response.status,200);checks++;
const backup=await response.json();assert.equal(backup.tables,2);assert.ok(saved.has(`${backup.backupPrefix}/database.bin`));checks+=2;
assert.ok(!new TextDecoder().decode(saved.get(`${backup.backupPrefix}/database.bin`)).includes('private fixture hash'));checks++;
uploadError=true;response=await handler(request({job:'backup'}));assert.equal(response.status,503);assert.equal(outcomes.at(-1).p_detail.code,'backup_upload_failed');assert.ok(!JSON.stringify(await response.json()).includes('private provider details'));checks+=3;uploadError=false;
monitorError=true;assert.equal((await handler(request({job:'monitor'}))).status,503);assert.equal(outcomes.at(-1).p_status,'failed');checks+=2;
monitorError=false;assert.equal((await handler(request({job:'monitor'}))).status,200);assert.equal(outcomes.at(-1).p_detail.code,'health_ok');checks+=2;
assert.equal((await handler(request({job:'emails'}))).status,200);assert.equal(outcomes.at(-1).p_detail.processed,0);assert.equal(outcomes.at(-1).p_detail.code,'email_provider_not_configured');checks+=3;
environment.BREVO_API_KEY='fixture-key-without-sender';assert.equal((await handler(request({job:'emails'}))).status,200);assert.equal(outcomes.at(-1).p_detail.code,'email_provider_not_configured');checks+=2;
console.log(`PASS ${checks} operations Edge assertions: service authorization, encrypted backup, failure/recovery, safe errors and unconfigured email scheduling`);
