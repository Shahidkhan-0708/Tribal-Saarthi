import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';

// Real PostgreSQL/pgcrypto with minimal Auth/Storage schema fixtures; remote HTTP services are tested separately.
const db = new PGlite({ extensions: { pgcrypto } });
let checks = 0;
const ids = Object.fromEntries(['admin','student','other','institute','otherInstitute','nodal','family'].map((name,i) => [name, `00000000-0000-4000-8000-${String(i + 1).padStart(12,'0')}`]));
async function scalar(sql, values = []) { return (await db.query(sql, values)).rows[0]?.value; }
async function record(table, id) { return (await db.query(`select id,version,data from public.pilot_${table} where id=$1`, [id])).rows[0]; }
async function command(actor, action, payload = {}, target, operationId = randomUUID()) {
  return scalar('select public.pilot_command($1::uuid,$2,$3::jsonb,$4::jsonb,$5) value', [ids[actor], action, JSON.stringify(payload), target ? JSON.stringify({id:target.id,version:target.version}) : null, operationId]);
}
async function denied(work, pattern = /validation|forbidden|conflict|permission/i) {
  await assert.rejects(work, pattern); checks++;
}
async function asUser(name, work) {
  await db.exec('set role authenticated');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [ids[name]]);
  try { return await work(); } finally { await db.exec('reset role'); }
}
function ok(condition, message) { assert.ok(condition, message); checks++; }

try {
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage; create schema extensions;
    create table auth.users(id uuid primary key,email text); create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id));
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema auth,storage to authenticated,anon,service_role;
    grant execute on function auth.uid() to public;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text,metadata jsonb default '{}',unique(bucket_id,name));
    create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name,'/') $$;
    alter table storage.objects enable row level security;
    grant select,insert on storage.objects to authenticated;
  `);
  const migrations = (await readdir(new URL('../supabase/migrations/', import.meta.url))).filter(f => f.endsWith('.sql')).sort();
  for (const file of migrations) await db.exec(await readFile(new URL(`../supabase/migrations/${file}`, import.meta.url),'utf8'));
  console.log('PASS migration executes on PostgreSQL with real pgcrypto'); checks++;
  await db.exec('set role authenticated');
  await denied(() => db.query("select public.pilot_rate_limit('invite',$1)", [ids.admin]));
  await db.exec('reset role');
  await db.exec('set role service_role');
  const quota = () => scalar("select public.pilot_rate_limit('invite',$1) value", [ids.admin]);
  const attempts = await Promise.all(Array.from({length:12}, quota));
  ok(attempts.filter(x => x.allowed).length===10,'atomic shared quota admits only its budget');
  ok(attempts.filter(x => !x.allowed).every(x => x.retryAfter>0),'quota denial has retry interval');
  await db.exec('reset role');
  await db.exec("update pilot_private.rate_limits set window_started=now()-interval '2 hours'");
  ok((await quota()).allowed,'expired quota window resets');
  await denied(() => scalar("select public.pilot_rate_limit('unlimited','public') value"));
  for (const [name,id] of Object.entries(ids)) {
    await db.query('insert into auth.users values($1,$2)',[id,`${name}@example.org`]);
    const role = name === 'other' ? 'student' : name === 'institute' || name === 'otherInstitute' ? 'institution' : name;
    await db.query('insert into pilot_accounts(id,email,name,role,institution_id,state) values($1,$2,$3,$4,$5,$6)',[id,`${name}@example.org`,name,role,name === 'otherInstitute' || name === 'other' ? 'college2' : 'college1',name === 'otherInstitute' || name === 'other' ? 'Odisha' : 'Jharkhand']);
  }
  await command('admin','save_institution',{id:'college1',name:'College One',state:'Jharkhand',district:'Ranchi',inSchemeBasket:true});
  await command('admin','save_institution',{id:'college2',name:'College Two',state:'Odisha',district:'Khordha',inSchemeBasket:false});
  const profile = {name:'Pilot Student',gender:'F',dob:'2004-01-01',aadhaarLast4:'1234',tribe:'Oraon',isPVTG:false,category:'ST',familyIncome:100000,fatherName:'Guardian',domicileState:'Jharkhand',domicileDistrict:'Ranchi',homeVillage:'Village',language:'en',courseLevel:'undergrad',course:'BA',institutionId:'college1',year:'1'};
  await denied(() => command('student','save_profile',{name:'Incomplete'}));
  let student = await command('student','save_profile',profile);
  await command('other','save_profile',{...profile,name:'Other Student',institutionId:'college2',domicileState:'Odisha',domicileDistrict:'Khordha'});
  await denied(() => command('student','save_profile',{...profile,id:ids.other}, {id:ids.other,version:1}));
  await denied(() => command('student','save_profile',{...profile,role:'admin'},student));
  const deadline = new Date(Date.now()+30*86400000).toISOString().slice(0,10);
  const scheme = {id:'pilot',name:'Pilot scholarship',shortName:'Pilot',portal:'NSP',ministry:'Pilot',courseLevels:['undergrad'],amount:'1000',benefits:['Pilot'],deadline,requiredDocs:['st_certificate','income_certificate','marksheet','admission_proof'],rules:[{id:'income',label:'Income',field:'familyIncome',param:'≤250000',op:'max',threshold:250000}],notes:'Pilot configured rules',academicYear:'2026-27',active:true,sanctionAmount:1000};
  await command('admin','save_scheme',scheme);
  await denied(() => command('student','save_scheme',scheme));
  await denied(() => command('student','save_draft',{schemeId:'pilot',academicYear:'2026-27',documentIds:['not-owned']}));
  const docs = [];
  for (const type of scheme.requiredDocs) {
    const objectPath = `${ids.student}/${randomUUID()}.pdf`;
    await db.query("insert into storage.objects(bucket_id,name) values('pilot-documents',$1)",[objectPath]);
    docs.push(await command('student','register_document',{type,title:type,objectPath,checksum:'a'.repeat(64),size:100,mimeType:'application/pdf'}));
  }
  let app = await command('student','save_draft',{schemeId:'pilot',academicYear:'2026-27',documentIds:docs.map(d=>d.id),evidence:{attendance:90,marks:80,admission:'yes',noOtherFellowship:'yes'}});
  await denied(() => command('other','submit_application',{},app));
  await denied(() => command('student','submit_application',{}, {id:app.id,version:app.version+10}));
  const operationId = randomUUID();
  app = await command('student','submit_application',{},app,operationId);
  const internalNote=await command('institute','add_note',{body:'Internal officer test'},app);
  for(const role of ['admin','institute','nodal','student','other','otherInstitute','family']){
    await asUser(role,async()=>ok(Number(await scalar('select count(*) value from public.pilot_notes where id=$1',[internalNote.id]))===(['admin','institute','nodal'].includes(role)?1:0),`internal note visibility for ${role}`));
  }
  await asUser('student',async()=>ok(Number(await scalar("select jsonb_array_length(public.pilot_snapshot($1::jsonb)->'pages'->'notes'->'items') value",[JSON.stringify({applications:{page:0,search:''},notes:{page:0,search:''}})]))===0,'student snapshot excludes internal officer notes'));
  await db.query('update public.pilot_accounts set active=false where id=$1',[ids.institute]);
  await asUser('institute',async()=>ok(Number(await scalar('select count(*) value from public.pilot_notes'))===0,'inactive officer cannot read internal notes'));
  await db.query('update public.pilot_accounts set active=true where id=$1',[ids.institute]);

  const replay = await command('student','submit_application',{}, {id:app.id,version:1},operationId);
  ok(replay.id === app.id && replay.version === app.version,'lost acknowledgement replay returns original result');
  await denied(() => command('student','submit_application',{tamper:true},{id:app.id,version:1},operationId));
  ok(/^[a-f0-9]{64}$/.test(app.data.receiptHash),'real SHA256 receipt');
  const receiptHash = app.data.receiptHash;
  await denied(() => command('student','save_draft',{schemeId:'pilot',academicYear:'2026-27',documentIds:[]}));
  await denied(() => command('otherInstitute','approve_institute',{},app));
  await denied(() => command('institute','approve_institute',{},app));
  await denied(() => command('student','approve_institute',{},app));
  for (let i=0;i<docs.length;i++) docs[i] = await command(i<2?'nodal':'institute','review_document',{status:'verified',reason:'Human inspected original',fields:i===2?{marks:80,attendance:90}:{}},docs[i]);
  for (const source of ['academic','institution','identity','st_certificate','income']) {
    const actor = ['academic','institution'].includes(source)?'institute':'nodal';
    const verification = await command(actor,'run_verification',{source},app);
    await command(actor,'review_verification',{state:'verified',reason:'Human reviewed pilot evidence'},verification);
  }
  // Frontend parity: an officer can record a simulated connector outage once per deployment.
  await denied(() => command('student','set_source_health',{source:'identity',up:false}));
  const healthOperation = randomUUID();
  const health = await command('admin','set_source_health',{source:'identity',up:false},undefined,healthOperation);
  ok(health.data.up === false && health.data.simulated === true, 'admin records a simulated connector outage');
  const replayedHealth = await command('admin','set_source_health',{source:'identity',up:false},undefined,healthOperation);
  ok(replayedHealth.version === health.version, 'connector setting replay is idempotent');
  await asUser('admin', async () => ok(Number(await scalar('select count(*)::int value from pilot_source_health')) === 1, 'officer reads connector status'));
  await asUser('student', async () => ok(Number(await scalar('select count(*)::int value from pilot_source_health')) === 0, 'student cannot read connector status'));
  await db.exec('set role service_role');
  const outageOperation = randomUUID();
  const adapter = {source:'identity',mode:'simulated',timestamp:new Date().toISOString(),requestId:outageOperation,reference:null,rawStatus:'simulated_human_review_required',state:'manual_review'};
  const current = await record('applications',app.id);
  const outage = await scalar('select public.pilot_verify($1,$2::jsonb,$3::jsonb,$4,$5::jsonb) value',[ids.nodal,JSON.stringify({source:'identity'}),JSON.stringify({id:current.id,version:current.version}),outageOperation,JSON.stringify(adapter)]);
  await db.exec('reset role');
  ok(outage.data.state === 'source_down' && outage.data.adapter.rawStatus === 'configured_source_down', 'stored outage overrides the adapter result');
  ok(/operator/.test(outage.data.reason), 'outage reason stays explicit');
  await command('admin','set_source_health',{source:'identity',up:true});
  const restored = await command('nodal','run_verification',{source:'identity'},await record('applications',app.id));
  await command('nodal','review_verification',{state:'verified',reason:'Outage cleared; human review recorded'},restored);
  app = await record('applications',app.id);
  app = await command('institute','approve_institute',{},app);
  const sig = `${ids.nodal}/signature.png`;
  await db.query("insert into storage.objects(bucket_id,name) values('pilot-signatures',$1)",[sig]);
  await denied(() => command('nodal','sanction',{signaturePath:sig},app));
  app = await command('nodal','approve_department',{},app);
  app = await command('nodal','sanction',{signaturePath:sig},app);
  ok(app.data.status==='sanctioned' && app.data.disbursedAmount===undefined,'sanction does not disburse');
  let payment = await command('nodal','request_payment',{},app);
  await command('nodal','payment_result',{status:'failed',reason:'SIMULATED outage'},payment);
  app = await record('applications',app.id);
  ok(app.data.status==='sanctioned' && app.data.dbtStatus==='failed','failed transfer remains sanctioned');
  payment = await command('nodal','request_payment',{},app);
  await command('nodal','payment_result',{status:'successful'},payment);
  app = await record('applications',app.id);
  ok(app.data.status==='disbursed' && app.data.disbursedAmount===1000 && app.data.receiptHash===receiptHash,'payment changes status without mutating immutable receipt');
  await denied(() => command('nodal','payment_result',{status:'failed'},payment));
  await denied(() => command('institute','raise_deficiency',{documentType:'marksheet',reason:'Too late',deadline},app));
  await denied(() => command('student','save_draft',{schemeId:'pilot',academicYear:'2026-27',documentIds:[]}));
  const grant = await command('student','grant_family',{familyUserId:ids.family});
  await asUser('family',async()=>{
    const summary = await scalar('select public.family_summary() value');
    ok(summary.applications.length===1 && !('profileSnapshot' in summary.applications[0].data) && !('documentIds' in summary.applications[0].data),'family summaries exclude private evidence');
    ok(Number(await scalar('select count(*)::int value from pilot_documents'))===0,'family cannot read document metadata');
  });
  await command('student','revoke_family',{},grant);
  await asUser('family',async()=>ok((await scalar('select public.family_summary() value')).applications.length===0,'family revocation immediate'));
  await asUser('other',async()=>{
    ok(Number(await scalar('select count(*)::int value from pilot_applications'))===0,'other student cannot read application');
    await denied(()=>db.exec("update pilot_applications set data='{}'"));
    await denied(()=>db.query('select pilot_command($1,$2,$3,$4,$5)',[ids.other,'broadcast','{}',null,randomUUID()]));
  });
  await asUser('otherInstitute',async()=>ok(Number(await scalar('select count(*)::int value from pilot_applications'))===0,'other institution isolated'));
  const grievance = await command('student','create_grievance',{category:'Help',subject:'Review question',body:'Please explain'});
  await denied(()=>command('other','update_grievance',{body:'Hijack'},grievance));
  await denied(()=>command('institute','update_grievance',{status:'resolved'},grievance));
  const replied = await command('nodal','update_grievance',{status:'in_review',body:'Reviewing'},grievance);
  ok(replied.data.messages.length===1,'grievance reply persisted');
  const notificationCount = Number(await scalar('select count(*)::int value from pilot_notifications'));
  const broadcastId = randomUUID();
  const broadcast = await command('nodal','broadcast',{title:'Scoped notice',body:'Pilot message',audience:'district',district:'Ranchi'},undefined,broadcastId);
  await command('nodal','broadcast',{title:'Scoped notice',body:'Pilot message',audience:'district',district:'Ranchi'},undefined,broadcastId);
  ok(broadcast.count===1 && Number(await scalar('select count(*)::int value from pilot_notifications'))===notificationCount+1,'broadcast targets actual scoped students and deduplicates replay');
  await denied(()=>command('admin','import_baselines',{rows:[{state:'Jharkhand',district:'Ranchi',academicYear:'2026-27',population:'pilot',enrolled:1,beneficiaries:2,sourceUrl:'https://example.org'}]}));
  await db.query('update pilot_accounts set active=false where id=$1',[ids.other]);
  await denied(()=>command('other','create_grievance',{subject:'Inactive',body:'No'}));
  await asUser('other',async()=>ok(Number(await scalar('select count(*)::int value from pilot_students'))===0,'inactive account RLS denies reads'));
  // Every action the pilot frontend can send must have a database handler.
  const actionSource = await readFile(new URL('../src/pilot/types.ts', import.meta.url), 'utf8');
  const actionLine = actionSource.split('\n').find(line => line.includes('export type PilotAction'));
  const actions = [...(actionLine ?? '').matchAll(/'([a-z_]+)'/g)].map(match => match[1]);
  ok(actions.length >= 30, 'frontend action list was read');
  for (const action of actions) {
    let failure = '';
    try { await command('admin', action, {}, undefined); } catch (error) { failure = error.message; }
    ok(!/unknown action/.test(failure), `backend handles frontend action ${action}`);
  }
  await (await import('../supabase/tests/track-de.mjs')).verifyTrackDE({db,command,record,scalar,ids,asUser,denied,ok,app});
  await (await import('../supabase/tests/track-c.mjs')).verifyTrackC({db,command,record,scalar,ids,asUser,denied,ok,app,docs,scheme});
  await (await import('../supabase/tests/operations.mjs')).verifyOperations({db,scalar,asUser,denied,ok,command,record,app});
  console.log(`PASS ${checks} PostgreSQL workflow/security assertions including Track C (Auth/Storage schema fixtures; no remote service claims)`);
} catch (error) {
  console.error('FAIL PostgreSQL pilot validation:', error.message);
  if (error.where) console.error(error.where);
  if (error.internalQuery) console.error(error.internalQuery);
  process.exitCode = 1;
} finally { await db.close(); }

if (!process.exitCode) await import('../supabase/tests/deficiencies.mjs');
