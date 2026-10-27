export async function verifyOperations({db,scalar,asUser,denied,ok,command,record,app}){
 for(const user of ['admin','student','institute','family']){
  await asUser(user,async()=>{
   await denied(()=>db.query("select public.pilot_job_claim('backup','forged')"));
   await denied(()=>db.query('select public.pilot_backup_snapshot()'));
   await denied(()=>db.query('select public.pilot_job_health()'));
  });
 }
 await asUser('student',async()=>{await denied(()=>db.query('select public.pilot_operations_status()'));});
 await db.exec('set role service_role');
 await denied(()=>db.query("select public.pilot_job_claim('unknown','test')"));
 const claim=await scalar("select public.pilot_job_claim('backup','test-one') value");
 ok(!!claim.id,'service worker can claim an operation');
 ok(await scalar("select public.pilot_job_claim('backup','test-one') value")===null,'duplicate job key cannot execute twice');
 ok(await scalar("select public.pilot_job_claim('backup','test-two') value")===null,'overlapping backups cannot run concurrently');
 await denied(()=>db.query("select public.pilot_job_finish($1,'failed','{\"code\":\"safe\",\"secret\":\"forbidden\"}')",[claim.id]));
 await db.query("select public.pilot_job_finish($1,'failed','{\"code\":\"backup_upload_failed\"}')",[claim.id]);
 await denied(()=>db.query("select public.pilot_job_finish($1,'succeeded','{\"code\":\"ok\"}')",[claim.id]));
 const retry=await scalar("select public.pilot_job_claim('backup','test-one') value");
 ok(!!retry.id && retry.id!==claim.id,'failed backup retries the same daily key without deleting failure history');
 await db.query("select public.pilot_job_finish($1,'succeeded','{\"code\":\"backup_verified\",\"tables\":22,\"objects\":1}')",[retry.id]);
 const health=await scalar('select public.pilot_job_health() value');ok(health.backupFresh && Number(health.failedJobs)===0,'recovered job clears the active health warning');
 await db.query('insert into public.pilot_deliveries(id,data) values($1,$2::jsonb)',['provider-deferred',JSON.stringify({userId:'00000000-0000-4000-8000-000000000001',status:'blocked',createdAt:new Date().toISOString(),retryAt:'2026-01-01',attempts:Array.from({length:5},()=>({status:'blocked',code:'provider_not_configured'}))})]);
 ok(!!await scalar('select public.pilot_claim_email() value'),'missing provider attempts do not permanently exhaust delivery retries');
 const snapshot=await scalar('select public.pilot_backup_snapshot() value');
 ok(snapshot.columns.length>0 && snapshot.data['auth.users'].length>0 && snapshot.data['public.pilot_applications'].length>0,'service-only snapshot contains real database/Auth and restore columns');
 ok(Object.keys(snapshot.data).every(k=>!k.startsWith('vault.')),'snapshot excludes Vault secret material');
 await db.exec('reset role');
 await asUser('admin',async()=>{const jobs=await scalar('select public.pilot_operations_status() value');ok(jobs.some(j=>j.status==='failed') && jobs.some(j=>j.status==='succeeded'),'administrator sees failure and successful recovery');});
 ok(Number(await scalar("select count(*) value from public.pilot_notifications where data->>'category'='operations'"))>=2,'failure/recovery delivered as persisted admin in-app alerts');
 await db.query("insert into storage.objects(bucket_id,name) values('pilot-backups','recovery/manifest.bin')");
 for(const role of ['admin','student','institute','family'])await asUser(role,async()=>ok(Number(await scalar("select count(*) value from storage.objects where bucket_id='pilot-backups'"))===0,`${role} cannot download private backup objects`));
 const latest=await record('applications',app.id);await denied(()=>command('institute','add_note',{body:'Must preserve version validation'},{id:app.id,version:latest.version+1}));
}
