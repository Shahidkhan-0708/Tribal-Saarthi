import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {staging,value} from './staging-helpers.mjs';
const {client}=await staging(),actors=JSON.parse(await readFile('.staging/actors.json','utf8')),operator=client();
value(await operator.auth.signInWithPassword({email:actors.admin.email,password:actors.admin.password}),'Operator recovery login');
const started=Date.now();let backup;
while(Date.now()-started<360000){
 const jobs=value(await operator.rpc('pilot_operations_status'),'Scheduled operations status');
 backup=jobs.find(j=>j.kind==='backup' && j.status==='succeeded' && j.detail.backupPrefix);
 if(backup)break;
 await new Promise(resolve=>setTimeout(resolve,5000));
}
assert.ok(backup,'A successful automatically scheduled backup must appear within six minutes');
const child=spawn(process.execPath,['scripts/recover-operations-backup.mjs',backup.detail.backupPrefix],{windowsHide:true,stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',s=>output+=s);child.stderr.on('data',s=>output+=s);
const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});
assert.equal(code,0,'Encrypted backup recovery must verify all bytes');
console.log(output.trim());
const jobs=value(await operator.rpc('pilot_operations_status'),'Recovered operation status');assert.ok(jobs.some(j=>j.kind==='backup' && j.status==='failed'),'Failure history must remain');
const notices=value(await operator.from('pilot_notifications').select('id,data').eq('data->>category','operations'),'Recovery notices');assert.ok(notices.some(n=>n.data.body.includes('backup: succeeded')),'Administrator must receive recovery notice');
await writeFile('artifacts/operations/recovery.json',JSON.stringify({at:new Date().toISOString(),passed:true,backupPrefix:backup.detail.backupPrefix,tables:backup.detail.tables,objects:backup.detail.objects,bytes:backup.detail.bytes,checks:['Scheduled worker completed a real backup','Authenticated AES-GCM recovery verified database/Auth and all private bytes','Failure history retained and successful recovery notified administrator']},null,2));
console.log('PASS automatically scheduled backup, encrypted recovery and administrator recovery alert');
