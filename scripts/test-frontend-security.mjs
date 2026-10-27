import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {staging,value,deniedResult} from './staging-helpers.mjs';

const {admin,client}=await staging();
const actors=JSON.parse(await readFile('.staging/actors.json','utf8'));
const fixture=JSON.parse(await readFile('.staging/track-c-fixture.json','utf8'));
const checks=[];
try{
 const app=value(await admin.from('pilot_applications').select('id,data').eq('id',fixture.applicationId).single(),'Synthetic note application');
 assert.equal(app.data.studentId,actors.student.id,'Test must include the owning student');
 const note=value(await admin.from('pilot_notes').select('id').eq('data->>applicationId',app.id).limit(1).single(),'Synthetic officer note');
 for(const role of ['admin','student','other','institute','otherInstitute','nodal','family']){
  const sdk=client(),actor=actors[role];value(await sdk.auth.signInWithPassword({email:actor.email,password:actor.password}),'Synthetic role login');
  const expected=['admin','institute','nodal'].includes(role)?1:0;
  const rows=value(await sdk.from('pilot_notes').select('id').eq('id',note.id),'Scoped note query');assert.equal(rows.length,expected,`${role} direct read`);
  const snapshot=value(await sdk.rpc('pilot_snapshot',{requests:{applications:{page:0,search:app.id},notes:{page:0,search:note.id}}}),'Scoped note snapshot');assert.equal(snapshot.pages.notes.items.length,expected,`${role} snapshot read`);
  checks.push({role,direct:rows.length,snapshot:snapshot.pages.notes.items.length,expected});
  await sdk.auth.signOut();
 }
 const anonymous=await client().from('pilot_notes').select('id').eq('id',note.id);
 if(anonymous.error)deniedResult(anonymous,'Anonymous note access');else assert.deepEqual(anonymous.data,[],'Anonymous cannot read internal notes');
 console.log('PASS 16 hosted internal-note access assertions; owning student, family, anonymous and unrelated scope denied');
}catch(error){console.error('FAIL hosted note access:',error.message.split('\n')[0]);process.exitCode=1;}
finally{await mkdir('artifacts/frontend-connections',{recursive:true});await writeFile('artifacts/frontend-connections/note-access.json',JSON.stringify({at:new Date().toISOString(),passed:!process.exitCode,assertions:checks.length*2+2,checks},null,2));}
