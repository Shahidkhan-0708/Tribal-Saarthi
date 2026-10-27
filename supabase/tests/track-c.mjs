export async function verifyTrackC({db,command,record,scalar,ids,asUser,denied,ok,app,docs,scheme}) {
  const account=async name=>(await db.query('select * from pilot_accounts where id=$1',[ids[name]])).rows[0];
  const erasure=await command('student','request_erasure',{reason:'Please review retention and erase my account'});
  ok(erasure.lifecycle.erasureStatus==='requested','erasure is a review request, not silent data deletion');
  await denied(()=>command('student','manage_account',{role:'admin',active:true},{id:ids.other,version:1}));
  await denied(()=>command('admin','manage_account',{role:'student',active:false},{id:ids.admin,version:1}));
  await db.query('insert into auth.sessions(id,user_id) values(gen_random_uuid(),$1)',[ids.other]);
  let other=await command('admin','manage_account',{role:'student',active:false},await account('other'));
  ok(Number(await scalar('select count(*)::int value from auth.sessions where user_id=$1',[ids.other]))===0,'deactivation revokes refresh sessions');
  other=await command('admin','manage_account',{role:'nodal',active:true,state:'Jharkhand'},other);
  await asUser('other',async()=>ok(Number(await scalar('select count(*)::int value from pilot_applications'))===0,'reactivation does not revive an old JWT'));
  await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({iat:Math.floor(Date.now()/1000)+2})]);
  await asUser('other',async()=>ok(Number(await scalar('select count(*)::int value from pilot_applications'))>0,'new session immediately uses changed role and scope'));
  other=await command('admin','manage_account',{role:'nodal',active:true,state:'Odisha'},other);
  await asUser('other',async()=>ok(Number(await scalar('select count(*)::int value from pilot_applications'))===0,'role scope changes are immediate'));
  await db.query("select set_config('request.jwt.claims','{}',false)");

  await asUser('otherInstitute',async()=>ok(Number(await scalar("select count(*)::int value from pilot_audit where data->>'studentId'=$1",[ids.student]))===0,'filtered audit export cannot cross institution scope'));
  await asUser('admin',async()=>ok(Number(await scalar("select count(*)::int value from pilot_audit where data->>'action'='manage_account' and data->>'createdAt'>='2026-01-01'"))>=3,'administrator can filter lifecycle audit history'));

  await command('admin','save_grievance_category',{name:'Appeal support',active:true,slaDays:2});
  let grievance=await command('student','create_grievance',{category:'Appeal support',subject:'Need explanation',body:'Review the evidence please',priority:'high',evidenceIds:[docs[0].id]});
  ok(grievance.data.assignedTo===ids.nodal && grievance.data.dueAt && grievance.data.events.length===1 && grievance.data.evidenceIds?.[0]===docs[0].id,'grievance has scoped owner, exact evidence IDs, due date and timeline');
  ok(Number(await scalar("select count(*)::int value from pilot_notifications where data->>'userId'=$1 and data->>'category'='grievance'",[ids.nodal]))>0,'assignment notifies the owner');
  await denied(()=>command('other','create_grievance',{category:'Help',subject:'Wrong owner',body:'Private evidence',evidenceIds:[docs[0].id]}));
  await denied(()=>command('nodal','update_grievance',{assignedTo:ids.otherInstitute},grievance));
  grievance=await command('nodal','update_grievance',{status:'resolved',resolutionReason:'Evidence explained and reviewed',body:'Resolved with explanation'},grievance);
  grievance=await command('student','update_grievance',{event:'appeal',body:'Please review the resolution again'},grievance);
  ok(grievance.data.status==='open' && grievance.data.events.length===3,'student can appeal with full history retained');
  await denied(()=>command('student','update_grievance',{event:'escalate',body:'Please escalate this case'},grievance));
  await db.query("update pilot_grievances set data=data||jsonb_build_object('dueAt',now()-interval '1 day') where id=$1",[grievance.id]);
  grievance=await record('grievances',grievance.id);
  grievance=await command('student','update_grievance',{event:'escalate',body:'This case is overdue'},grievance);
  ok(grievance.data.assignedTo===ids.admin && grievance.data.priority==='high','overdue grievance escalates to administrator');

  let delivery=await scalar('select public.pilot_claim_email() value');
  ok(delivery?.data.status==='processing','critical workflow notices atomically queue an email attempt');
  await denied(()=>scalar('select public.pilot_finish_email($1,$2,$3) value',[delivery.id,delivery.version,JSON.stringify({status:'accepted'})]));
  delivery=await scalar('select public.pilot_finish_email($1,$2,$3) value',[delivery.id,delivery.version,JSON.stringify({status:'failed',code:'provider_http_429'})]);
  ok(delivery.data.attempts.length===1 && Date.parse(delivery.data.retryAt)>Date.now(),'failed email attempt is visible with retry backoff');
  await asUser('student',async()=>{await denied(()=>scalar('select public.pilot_claim_email() value'));ok(Number(await scalar("select count(*)::int value from pilot_deliveries where data->>'userId'<>$1",[ids.student]))===0,'email delivery status is recipient scoped');});

  const receiptBefore=await scalar('select public.pilot_receipt($1) value',[app.data.receiptToken]);
  ok(receiptBefore.valid && receiptBefore.hash!==app.data.receiptHash && Object.keys(receiptBefore).sort().join(',')==='hash,issuedAt,reference,valid','public receipt covers later decisions and exposes only safe fields');
  app=await command('nodal','expire_receipt',{reason:'Pilot receipt retention policy',expiresAt:new Date(Date.now()+86400000).toISOString()},await record('applications',app.id));
  app=await command('nodal','revoke_receipt',{reason:'Decision receipt revoked for policy review'},app);
  const revoked=await scalar('select public.pilot_receipt($1) value',[app.data.receiptToken]);
  ok(!revoked.valid && revoked.hash!==receiptBefore.hash,'receipt revocation is recorded in its canonical chain');
  ok(Number(await scalar("select count(*)::int value from pilot_private.receipt_events where hash<>encode(extensions.digest(event::text,'sha256'),'hex')"))===0,'each receipt chain event has a real SHA-256 digest');

  let draft=await command('student','save_draft',{schemeId:'pilot',academicYear:'2025-26',documentIds:[]});
  draft=await command('student','withdraw_application',{reason:'I no longer need this application'},draft);
  ok(draft.data.status==='withdrawn','withdrawal has an explicit reasoned state');
  await denied(()=>command('student','submit_application',{},draft));
  await denied(()=>command('student','withdraw_application',{reason:'Too late after payment'},app));
  let rejected=await command('student','save_draft',{schemeId:'pilot',academicYear:'2024-25',documentIds:[]});
  await db.query("update pilot_applications set data=data||'{\"status\":\"rejected\",\"profileSnapshot\":{\"domicileState\":\"Jharkhand\"}}'::jsonb where id=$1",[rejected.id]);
  rejected=await command('student','appeal_application',{reason:'Please consider my corrected evidence'},await record('applications',rejected.id));
  await denied(()=>command('institute','resolve_appeal',{decision:'reopen',reason:'Not permitted role'},rejected));
  rejected=await command('nodal','resolve_appeal',{decision:'reopen',reason:'Fresh review is warranted'},rejected);
  ok(rejected.data.status==='institute_stage' && Number(await scalar("select count(*)::int value from pilot_verifications where data->>'applicationId'=$1 and data->>'state'='pending'",[rejected.id]))===5,'appeal reopening requires fresh human source checks');

  let published=await record('schemes','pilot');
  let config=await command('admin','draft_scheme',{schemeId:'pilot',config:{...scheme,academicYear:'2027-28',rules:[{...scheme.rules[0],threshold:0}]}});
  ok((await record('schemes','pilot')).data.academicYear==='2026-27','draft edits do not mutate published configuration');
  const preview=await command('admin','dry_run_scheme',{},config);
  ok(preview.cohort.find(s=>s.studentId===ids.student).eligibility.eligible===false,'dry-run evaluates the real cohort with submission evaluator');
  const history=(await db.query("select id from pilot_configuration_history where data->>'kind'='schemes' and data->>'entityId'='pilot' order by (data->>'configurationVersion')::int desc limit 1")).rows[0];
  published=await command('admin','publish_scheme',{},config);
  await denied(()=>command('admin','publish_scheme',{},config));
  config=await record('scheme_drafts','pilot');
  config=await command('admin','draft_scheme',{schemeId:'pilot',config:{...published.data,rules:[]}},config);
  published=await command('admin','publish_scheme',{},config);
  const renewal=await command('student','renew_application',{academicYear:'2027-28'},app);
  ok(renewal.data.previousApplicationId===app.id && renewal.data.status==='draft' && renewal.data.documentIds.length===app.data.documentIds.length && renewal.data.eligibilityDelta.current.eligible,'renewal reuses documents and computes an eligibility delta');
  await denied(()=>command('student','renew_application',{academicYear:'2027-28'},app));
  const updatedRenewal=await command('student','save_draft',{schemeId:'pilot',academicYear:'2027-28',documentIds:renewal.data.documentIds},renewal);
  ok(updatedRenewal.data.previousApplicationId===app.id,'editing a renewal retains the server-owned prior link');
  const rollback=await command('admin','rollback_scheme',{historyId:history.id},published);
  ok(rollback.version>published.version && rollback.data.academicYear==='2026-27','rollback creates another published version and preserves history');
  await command('admin','deactivate_institution',{reason:'Institution no longer participates'},await record('institutions','college1'));
  await denied(()=>command('student','save_draft',{schemeId:'pilot',academicYear:'2028-29',documentIds:[]}));
  await denied(()=>command('student','draft_scheme',{schemeId:'pilot',config:scheme}));
  await asUser('student',async()=>ok(Number(await scalar('select count(*)::int value from pilot_configuration_history'))===0,'configuration history is administrator-only'));
}
