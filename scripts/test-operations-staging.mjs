import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {staging,value,deniedResult} from './staging-helpers.mjs';
const {config,admin,client}=await staging(),keys=JSON.parse(await readFile('.staging/operations.json','utf8')),actors=JSON.parse(await readFile('.staging/actors.json','utf8'));
assert.equal(keys.projectRef,config.projectRef);
const checks=[];
await mkdir('artifacts/operations',{recursive:true});
async function bucket(name){
 const env={...process.env};delete env.SUPABASE_ACCESS_TOKEN;
 const child=spawn('supabase',['secrets','set',`PILOT_BACKUP_BUCKET=${name}`,'--project-ref',config.projectRef],{env,windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>output+=chunk);
 const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});await writeFile('.staging/operations-drill-cli.log',output);assert.equal(code,0,'Private operations drill configuration');
}
async function invoke(payload,token=keys.token){
 const response=await fetch(`${config.url}/functions/v1/pilot-operations`,{method:'POST',headers:{apikey:config.publishableKey,'content-type':'application/json',...(token?{'x-pilot-operations-token':token}:{})},body:JSON.stringify(payload),signal:AbortSignal.timeout(120000)});
 return {status:response.status,body:await response.json(),requestId:response.headers.get('x-request-id')};
}
try{
 assert.equal((await invoke({job:'backup'},null)).status,401);assert.equal((await invoke({job:'backup'},'invalid')).status,401);checks.push('Unauthenticated/incorrect service tokens cannot run operations');
 const student=client();value(await student.auth.signInWithPassword({email:actors.student.email,password:actors.student.password}),'Synthetic student login');
 deniedResult(await student.rpc('pilot_backup_snapshot'),'Student cannot export Auth/database');deniedResult(await student.rpc('pilot_operations_status'),'Student cannot read operator job history');
 const objectAccess=await student.storage.from('pilot-backups').list();assert.ok(objectAccess.error || objectAccess.data.length===0,'Student cannot list backup files');checks.push('Student cannot export database/Auth, read job status or list backups');
 try{
  await bucket('pilot-backups-drill');
  const result=await invoke({job:'backup',runKey:`failure-drill-${randomUUID()}`});assert.equal(result.status,503,'A nonexistent backup bucket must fail the actual backup job');assert.ok(result.body.error.includes('backup_upload_failed'),'Failure must occur at Storage, not authentication');checks.push('Real missing-bucket backup fails and is recorded without an accepted manifest');
 }finally{await bucket('pilot-backups');}
 const operator=client();value(await operator.auth.signInWithPassword({email:actors.admin.email,password:actors.admin.password}),'Synthetic operator login');
 const jobs=value(await operator.rpc('pilot_operations_status'),'Administrator job status');assert.ok(jobs.some(j=>j.status==='failed' && j.detail.code==='backup_upload_failed'));
 const alerts=value(await operator.from('pilot_notifications').select('id,data').eq('data->>category','operations'),'Persisted administrator alerts');assert.ok(alerts.some(n=>n.data.body.includes('backup: failed')));checks.push('The real failed job and alert are visible to the administrator');
 const mail=await invoke({job:'emails',runKey:`email-schedule-check-${randomUUID()}`});assert.equal(mail.status,200);assert.equal(mail.body.processed,0);assert.equal(mail.body.code,'email_provider_not_configured');checks.push('Scheduled email processing is healthy and truthfully blocked by missing provider credentials');
 console.log(`PASS ${checks.length} hosted operations groups; real failed backup and administrator alert; backup bucket restored`);
}catch(error){console.error('FAIL hosted operations:',error.message.split('\n')[0]);process.exitCode=1;}
finally{await writeFile('artifacts/operations/hosted.json',JSON.stringify({at:new Date().toISOString(),passed:!process.exitCode,checks},null,2));}
