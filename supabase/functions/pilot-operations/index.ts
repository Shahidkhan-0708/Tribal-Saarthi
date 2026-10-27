import {admin,body,serve} from '../_shared/http.ts';
import {backupHash,backupKey,sealBackup} from '../_shared/backup.ts';
import {processEmailQueue} from '../_shared/email-queue.ts';

async function checked<T>(request:PromiseLike<{data:T;error:unknown}>,code:string):Promise<T>{const result=await request;if(result.error)throw new Error(code);return result.data;}
async function backup(prefix:string){
 const key=await backupKey(Deno.env.get('PILOT_BACKUP_KEY') ?? '');
 const bucket=Deno.env.get('PILOT_BACKUP_BUCKET') ?? 'pilot-backups';
 if(!/^pilot-backups(-drill)?$/.test(bucket))throw new Error('backup_bucket_invalid');
 const project=new URL(Deno.env.get('SUPABASE_URL')!).hostname.split('.')[0];
 const snapshot=await checked(admin.rpc('pilot_backup_snapshot'),'backup_snapshot_failed');
 const database={sourceRef:project,at:snapshot.at,columns:snapshot.columns,data:snapshot.data};
 let total=0;
 const save=async(name:string,bytes:Uint8Array)=>{
  if(bytes.length>20_000_000)throw new Error('backup_size_limit');
  total+=bytes.length;if(total>100_000_000)throw new Error('backup_size_limit');
  const path=`${prefix}/${name}`;const encrypted=await sealBackup(bytes,key,`${project}/${path}`);
  await checked(admin.storage.from(bucket).upload(path,encrypted,{contentType:'application/octet-stream',upsert:false}),'backup_upload_failed');
  return {path,checksum:await backupHash(bytes),size:bytes.length};
 };
 const db=await save('database.bin',new TextEncoder().encode(JSON.stringify(database)));
 const objects=[];
 for(const object of snapshot.objects){
  if(!['pilot-documents','pilot-signatures'].includes(object.bucket) || typeof object.path!=='string' || object.path.includes('..'))throw new Error('backup_object_invalid');
  const blob=await checked(admin.storage.from(object.bucket).download(object.path),'backup_download_failed');
  const bytes=new Uint8Array(await blob.arrayBuffer()),file=await backupHash(new TextEncoder().encode(`${object.bucket}/${object.path}`))+'.bin';
  const saved=await save(file,bytes);objects.push({...object,file,mimeType:blob.type,...saved,objectPath:object.path});
 }
 for(const document of database.data['public.pilot_documents'] ?? []){
  const stored=objects.find(o=>o.bucket==='pilot-documents' && o.objectPath===document.data.objectPath);
  if(stored?.checksum!==document.data.checksum)throw new Error('backup_checksum_mismatch');
 }
 const manifest={projectRef:project,createdAt:snapshot.at,database:db,objects,counts:Object.fromEntries(Object.entries(database.data).filter(([name])=>name.startsWith('public.pilot_')).map(([name,rows])=>[name.slice(13),(rows as unknown[]).length])),authIds:(database.data['auth.users'] ?? []).map((a:{id:string})=>a.id)};
 await save('manifest.bin',new TextEncoder().encode(JSON.stringify(manifest)));
 return {code:'backup_verified',backupPrefix:prefix,objects:objects.length,tables:Object.keys(database.data).length,bytes:total};
}
async function monitor(){
 const url=Deno.env.get('PILOT_MONITOR_URL') ?? Deno.env.get('PILOT_INVITE_REDIRECT_URL');
 if(!url || !/^https:\/\/tribe-saarthi-staging[^/]*\.vercel\.app\/?$/.test(url))throw new Error('monitor_url_invalid');
 const page=await fetch(url,{signal:AbortSignal.timeout(15000),redirect:'error'});
 if(!page.ok || !(await page.text()).includes('id="root"'))throw new Error('frontend_unavailable');
 await checked(admin.from('pilot_schemes').select('id').limit(1),'database_unavailable');
 const health=await checked(admin.rpc('pilot_job_health'),'job_health_unavailable');
 if(!health.backupFresh)throw new Error('backup_overdue');
 if(health.failedJobs || health.reminderFailed)throw new Error('scheduled_job_needs_review');
 const failures=await checked(admin.from('pilot_applications').select('id').eq('data->>dbtStatus','failed').limit(1),'payment_review_failed');
 if(failures.length)throw new Error('simulated_payment_needs_review');
 return {code:'health_ok'};
}
serve(async req=>{
 const expected=Deno.env.get('PILOT_OPERATIONS_TOKEN'),received=req.headers.get('x-pilot-operations-token');
 if(!expected || !received || await backupHash(new TextEncoder().encode(received))!==await backupHash(new TextEncoder().encode(expected)))throw new Error('unauthorized: scheduled operator token required');
 const input=await body(req),job=input.job;
 if(!['backup','monitor','emails'].includes(job))throw new Error('validation: supported operations job required');
 const now=new Date(),key=job==='backup'?now.toISOString().slice(0,10):String(Math.floor(now.getTime()/300000));
 const claim=await checked(admin.rpc('pilot_job_claim',{p_kind:job,p_key:input.runKey ?? key}),'job_claim_failed');
 if(!claim)return {status:'already_claimed'};
 try{
  let detail;
  if(job==='backup')detail=await backup(`${now.toISOString().slice(0,10)}/${claim.id}`);
  else if(job==='monitor')detail=await monitor();
  else {const email=await processEmailQueue();detail={code:email.configured?'email_batch_processed':'email_provider_not_configured',processed:email.processed};}
  await checked(admin.rpc('pilot_job_finish',{p_id:claim.id,p_status:'succeeded',p_detail:detail}),'job_result_failed');
  return {status:'succeeded',id:claim.id,...detail};
 }catch(error){
  const message=error instanceof Error?error.message:'job_failed',code=/^[a-z_]{1,80}$/.test(message)?message:'job_failed';
  await checked(admin.rpc('pilot_job_finish',{p_id:claim.id,p_status:'failed',p_detail:{code}}),'job_result_failed');
  throw new Error(`unavailable: ${code}`);
 }
});
