import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
const db = new PGlite({ extensions: { pgcrypto } });
const student = '00000000-0000-4000-8000-000000000001', officer = '00000000-0000-4000-8000-000000000002';
let sequence = 0;
const cmd = async (actor, action, payload, target) => (await db.query('select public.pilot_command($1,$2,$3,$4,$5) r', [actor, action, JSON.stringify(payload), JSON.stringify(target), `test-operation-${++sequence}`])).rows[0].r;
const get = async (table, id) => (await db.query(`select * from pilot_${table} where id=$1`, [id])).rows[0];
try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create schema extensions;
  create table auth.users(id uuid primary key,email text); create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id));create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
  grant usage on schema auth,storage to authenticated;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
  create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql immutable as $$select string_to_array(name,'/')$$;grant select on storage.objects to authenticated;`);
  for (const file of (await readdir('supabase/migrations')).filter(f => f.endsWith('.sql')).sort()) await db.exec(await readFile(`supabase/migrations/${file}`, 'utf8'));
  await db.query('insert into auth.users values($1,$2),($3,$4)', [student,'student@test.invalid',officer,'officer@test.invalid']);
  await db.query("insert into pilot_accounts(id,email,name,role,institution_id,state) values($1,'student@test.invalid','Student','student','college','Jharkhand'),($2,'officer@test.invalid','Officer','institution','college','Jharkhand')", [student,officer]);
  for (const [id,type] of [['original-marks','marksheet'],['original-admission','admission_proof']]) await db.query('insert into pilot_documents(id,data) values($1,$2)',[id,JSON.stringify({studentId:student,type,status:'verified',uploadedAt:'2026-01-01',objectPath:`${student}/${id}.pdf`,fields:{marks:80}})]);
  await db.query('insert into pilot_applications(id,data) values($1,$2)', ['application',JSON.stringify({studentId:student,status:'institute_stage',documentIds:['original-marks','original-admission'],profileSnapshot:{institutionId:'college',domicileState:'Jharkhand'},ruleSnapshot:{rules:[],sanctionAmount:1000}})]);
  const deadline = new Date(Date.now()+86400000).toISOString().slice(0,10);
  let app = await get('applications','application');
  const first = await cmd(officer,'raise_deficiency',{documentType:'marksheet',reason:'Replace marks',deadline},app);
  app = await get('applications','application');
  const second = await cmd(officer,'raise_deficiency',{documentType:'admission_proof',reason:'Replace admission',deadline},app);
  for (const [id,type] of [['corrected-marks','marksheet'],['corrected-admission','admission_proof']]) await db.query('insert into pilot_documents(id,data) values($1,$2)',[id,JSON.stringify({studentId:student,type,status:'unverified',uploadedAt:'2026-02-01',objectPath:`${student}/${id}.pdf`})]);
  await cmd(student,'correct_deficiency',{documentId:'corrected-marks'},first);
  assert.equal((await get('deficiencies',second.id)).data.status,'open');
  app = await get('applications','application');
  await assert.rejects(() => cmd(officer,'approve_institute',{},app), /unresolved deficiencies/);
  await cmd(student,'correct_deficiency',{documentId:'corrected-admission'},second);
  await assert.rejects(() => cmd(officer,'approve_institute',{},app), /unresolved deficiencies/);
  for (const id of ['corrected-marks','corrected-admission']) {
    const reviewed = await cmd(officer,'review_document',{status:'verified',reason:'Reviewed original',fields:id==='corrected-marks'?{marks:80}:{admission:'yes'}},await get('documents',id));
    await assert.rejects(() => cmd(officer,'review_document',{status:'mismatch',reason:'Mutate'},reviewed), /immutable/);
  }
  await assert.rejects(() => cmd(officer,'approve_institute',{},app), /human verification required/);
  for (const source of ['academic','institution']) {
    const attempt = await cmd(officer,'run_verification',{source},app);
    await cmd(officer,'review_verification',{state:'verified',reason:'Reviewed corrected evidence'},attempt);
  }
  app = await cmd(officer,'approve_institute',{},app);
  assert.equal(app.data.status,'department_stage');
  assert.deepEqual(app.data.documentIds.sort(),['corrected-admission','corrected-marks']);
  assert.equal((await get('deficiencies',first.id)).data.status,'resolved');
  assert.equal((await get('deficiencies',second.id)).data.status,'resolved');
  await db.query("update pilot_accounts set institution_id='other',state='Odisha' where id=$1",[student]);
  await db.exec('set role authenticated');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[officer]);
  assert.equal((await db.query('select count(*)::int n from pilot_applications')).rows[0].n,1);
  assert.equal((await db.query('select count(*)::int n from pilot_documents')).rows[0].n,2);
  await db.exec('reset role');
  const nodal = '00000000-0000-4000-8000-000000000004';
  await db.query('insert into auth.users values($1,$2)',[nodal,'nodal@test.invalid']);
  await db.query("insert into pilot_accounts(id,email,name,role,state) values($1,'nodal@test.invalid','Nodal','nodal','Jharkhand')",[nodal]);
  await db.query('insert into pilot_documents(id,data) values($1,$2)',['income-proof',JSON.stringify({studentId:student,type:'income_certificate',status:'unverified',uploadedAt:'2026-03-01',objectPath:`${student}/income.pdf`})]);
  await db.exec(`update pilot_applications set data=data||'{"documentIds":["corrected-marks","corrected-admission","income-proof"],"profileSnapshot":{"institutionId":"college","domicileState":"Jharkhand","familyIncome":100000},"ruleSnapshot":{"sanctionAmount":1000,"rules":[{"id":"income-cap","field":"familyIncome","op":"max","threshold":250000}]}}'::jsonb where id='application'`);
  let income = await get('documents','income-proof');
  await assert.rejects(() => cmd(nodal,'review_document',{status:'verified',reason:'Invalid income',fields:{income:-1}},income),/outside range/);
  await assert.rejects(() => cmd(nodal,'review_document',{status:'verified',reason:'Wrong field',fields:{marks:80}},income),/not allowed/);
  income = await cmd(nodal,'review_document',{status:'verified',reason:'Actual certificate amount',fields:{income:700000}},income);
  app = await get('applications','application');
  for (const source of ['identity','st_certificate','income']) {
    const attempt = await cmd(nodal,'run_verification',{source},app);
    await cmd(nodal,'review_verification',{state:'verified',reason:'Reviewed evidence'},attempt);
  }
  await assert.rejects(() => cmd(nodal,'approve_department',{},app),/reviewed eligibility failed/);
  await db.exec(`update pilot_applications set data=data||'{"departmentApproved":true}'::jsonb where id='application'`);
  app = await get('applications','application');
  await assert.rejects(() => cmd(nodal,'sanction',{signaturePath:`${nodal}/signature.png`},app),/reviewed eligibility failed/);
  const family = '00000000-0000-4000-8000-000000000003';
  await db.query('insert into auth.users values($1,$2)',[family,'family@test.invalid']);
  await db.query("insert into pilot_accounts(id,email,name,role) values($1,'family@test.invalid','Family','family')",[family]);
  const grant = await cmd(student,'grant_family',{familyEmail:' FAMILY@Test.Invalid '},null);
  assert.equal(grant.data.familyUserId,family);
  assert.equal(grant.data.familyEmail,'family@test.invalid');
  await assert.rejects(() => cmd(student,'grant_family',{familyEmail:'officer@test.invalid'},null),/invited family account required/);
  await cmd(student,'revoke_family',{},grant);
  assert.equal((await get('family_grants',grant.id)).data.active,false);
  const admin = '00000000-0000-4000-8000-000000000005', other = '00000000-0000-4000-8000-000000000006';
  await db.query('insert into auth.users values($1,$2),($3,$4)',[admin,'admin@test.invalid',other,'other@test.invalid']);
  await db.query("insert into pilot_accounts(id,email,name,role,state) values($1,'admin@test.invalid','Admin','admin','Jharkhand'),($2,'other@test.invalid','Other','student','Jharkhand')",[admin,other]);
  const adminBroadcast = await cmd(admin,'broadcast',{title:'All students',body:'Actual recipients',audience:'all'},null);
  assert.equal(adminBroadcast.count,2);
  const nodalBroadcast = await cmd(nodal,'broadcast',{title:'Own state students',body:'Scoped recipients',audience:'all'},null);
  assert.equal(nodalBroadcast.count,1);
  assert.equal((await db.query("select count(*)::int n from pilot_notifications where data->>'title'='All students' and data->>'userId' in ($1,$2,$3,$4)",[officer,nodal,admin,family])).rows[0].n,0);
  console.log('PASS multiple deficiencies, immutable reviews, fresh human checks, frozen scope, reviewed income eligibility and invited-family email consent');
} finally { await db.close(); }
