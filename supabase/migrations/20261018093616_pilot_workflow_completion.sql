-- Preserve the tested workflow; new commands share its idempotency ledger.
do $$ begin
 execute replace(replace(pg_get_functiondef('public.pilot_command(uuid,text,jsonb,jsonb,text)'::regprocedure),
 'public.pilot_command(', 'pilot_private.command_base('), 'pilot_command.operation_id', 'command_base.operation_id');
end $$;
revoke all on function pilot_private.command_base(uuid,text,jsonb,jsonb,text) from public,anon,authenticated;

alter table public.pilot_accounts add column version integer not null default 1;
alter table public.pilot_accounts add column lifecycle jsonb not null default '{}';
create or replace function pilot_private.account() returns public.pilot_accounts language sql stable security definer set search_path='' as $$
 select a from public.pilot_accounts a where id=auth.uid() and active and (not lifecycle ? 'sessionsRevokedAfter' or coalesce((nullif(current_setting('request.jwt.claims',true),'')::jsonb->>'iat')::bigint,0)>(lifecycle->>'sessionsRevokedAfter')::bigint)
$$;
do $$ declare fn regprocedure; source text;begin
 foreach fn in array array['pilot_private.scope(text)'::regprocedure,'pilot_private.application_scope(jsonb)'::regprocedure] loop
  source:=pg_get_functiondef(fn);execute replace(source,'a.id=auth.uid() and a.active','a.id=(pilot_private.account()).id and a.active');
 end loop;
end $$;
drop policy account_read on public.pilot_accounts;
create policy account_read on public.pilot_accounts for select to authenticated using
 ((pilot_private.account()).active and (id=auth.uid() or (pilot_private.account()).role='admin'));

create function pilot_private.account_command(actor uuid,action text,payload jsonb,target jsonb) returns jsonb
language plpgsql set search_path='' as $$
declare ac public.pilot_accounts; old public.pilot_accounts; result jsonb;begin
 select * into ac from public.pilot_accounts where id=actor and active;
 if action='request_erasure' then
  if length(trim(coalesce(payload->>'reason','')))<5 then raise exception 'validation: explain the erasure request';end if;
  update public.pilot_accounts set lifecycle=lifecycle||jsonb_build_object('erasureRequestedAt',now(),'erasureReason',payload->>'reason','erasureStatus','requested'),version=version+1 where id=actor returning to_jsonb(pilot_accounts.*) into result;
 else
  if ac.role<>'admin' then raise exception 'forbidden: administrator required';end if;
  select * into old from public.pilot_accounts where id=(target->>'id')::uuid for update;
  if not found or old.version is distinct from (target->>'version')::int then raise exception 'conflict: account version changed';end if;
  if old.id=actor then raise exception 'validation: another administrator must change your access';end if;
  if action='manage_account' then
   if jsonb_typeof(payload->'active') is distinct from 'boolean' or payload->>'role' not in ('student','institution','nodal','admin','family') then raise exception 'validation: valid role and active flag required';end if;
   if payload->>'role'='institution' and not exists(select 1 from public.pilot_institutions where id=payload->>'institutionId' and coalesce(data->>'active','true')='true') or payload->>'role'='nodal' and trim(coalesce(payload->>'state',''))='' then raise exception 'validation: officer scope required';end if;
   update public.pilot_accounts set active=(payload->>'active')::boolean,role=payload->>'role',institution_id=case when payload->>'role'='institution' then payload->>'institutionId' when payload->>'role'='student' then old.institution_id end,state=case when payload->>'role'='nodal' then payload->>'state' when payload->>'role'='student' then old.state end,version=version+1,lifecycle=lifecycle||jsonb_build_object('changedAt',now(),'changedBy',actor)||case when payload->>'active'='false' then jsonb_build_object('sessionsRevokedAfter',floor(extract(epoch from clock_timestamp()))) else '{}'::jsonb end where id=old.id returning to_jsonb(pilot_accounts.*) into result;
   if payload->>'active'='false' then delete from auth.sessions where user_id=old.id;end if;
  elsif action='record_invite_resend' then
   update public.pilot_accounts set lifecycle=lifecycle||jsonb_build_object('inviteSentAt',now()),version=version+1 where id=old.id returning to_jsonb(pilot_accounts.*) into result;
  else raise exception 'validation: unknown account action';end if;
 end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',result->>'id','createdAt',now(),'detail',jsonb_build_object('previousRole',old.role,'role',result->>'role','active',result->'active')));
 return result;
end $$;
revoke all on function pilot_private.account_command(uuid,text,jsonb,jsonb) from public,anon,authenticated;

create or replace function public.pilot_command(actor uuid,action text,payload jsonb,target jsonb,operation_id text) returns jsonb
language plpgsql security definer set search_path='' as $$
<<extended>>
declare previous pilot_private.operations; digest text; result jsonb;begin
 if not exists(select 1 from public.pilot_accounts where id=actor and active) then raise exception 'forbidden: inactive account';end if;
 perform set_config('pilot.actor',actor::text,true);
 if action in ('save_profile','save_draft','submit_application') and exists(select 1 from public.pilot_institutions i where i.id=coalesce(payload->>'institutionId',(select institution_id from public.pilot_accounts where id=actor)) and i.data->>'active'='false') then raise exception 'validation: institution is inactive';end if;
 if action not in ('manage_account','record_invite_resend','request_erasure','create_grievance','update_grievance','save_grievance_category','revoke_receipt','expire_receipt','renew_application','withdraw_application','appeal_application','resolve_appeal','draft_scheme','publish_scheme','rollback_scheme','dry_run_scheme','deactivate_institution') then
  return pilot_private.command_base(actor,action,payload,target,operation_id);
 end if;
 if operation_id is null or length(operation_id) not between 8 and 160 or jsonb_typeof(payload) is distinct from 'object' then raise exception 'validation: invalid command';end if;
 digest:=encode(extensions.digest(jsonb_build_object('action',action,'payload',payload,'target',target)::text,'sha256'),'hex');
 insert into pilot_private.operations values(actor,operation_id,digest,null) on conflict do nothing;
 select * into previous from pilot_private.operations where actor_id=actor and pilot_private.operations.operation_id=pilot_command.operation_id for update;
 if previous.digest<>digest then raise exception 'conflict: operation key reused';end if;
 if previous.result is not null then return previous.result;end if;
 if action in ('create_grievance','update_grievance','save_grievance_category') then
  result:=pilot_private.grievance_command(actor,action,payload,target);
 elsif action in ('revoke_receipt','expire_receipt') then result:=pilot_private.receipt_command(actor,action,payload,target);
 elsif action in ('renew_application','withdraw_application','appeal_application','resolve_appeal') then result:=pilot_private.application_command(actor,action,payload,target);
 elsif action in ('draft_scheme','publish_scheme','rollback_scheme','dry_run_scheme','deactivate_institution') then result:=pilot_private.configuration_command(actor,action,payload,target);
 else result:=pilot_private.account_command(actor,action,payload,target);end if;
 update pilot_private.operations set result=extended.result where actor_id=actor and pilot_private.operations.operation_id=pilot_command.operation_id;
 return result;
end $$;

create index pilot_audit_date on public.pilot_audit((data->>'createdAt'),id);
create table public.pilot_grievance_categories(id text primary key,version integer not null default 1,data jsonb not null);
alter table public.pilot_grievance_categories enable row level security;
grant select on public.pilot_grievance_categories to authenticated;
grant all on public.pilot_grievance_categories to service_role;
create policy category_read on public.pilot_grievance_categories for select to authenticated using((pilot_private.account()).active);
insert into public.pilot_grievance_categories(id,data) values
 ('Help','{"name":"Help","active":true,"slaDays":7}'),('Documents','{"name":"Documents","active":true,"slaDays":5}'),('Payment','{"name":"Payment","active":true,"slaDays":3}');

create function pilot_private.grievance_command(actor uuid,action text,payload jsonb,target jsonb) returns jsonb
language plpgsql set search_path='' as $$
declare ac public.pilot_accounts; s public.pilot_accounts; row public.pilot_grievances; cat jsonb; d jsonb; result jsonb; owner text; evidence text; kind text:=coalesce(payload->>'event','reply');begin
 select * into ac from public.pilot_accounts where id=actor and active;
 if action='save_grievance_category' then
  if ac.role<>'admin' then raise exception 'forbidden: administrator required';end if;
  if trim(coalesce(payload->>'name',''))='' or jsonb_typeof(payload->'active') is distinct from 'boolean' or coalesce(payload->>'slaDays','') !~ '^\d+$' or (payload->>'slaDays')::int not between 1 and 90 then raise exception 'validation: category name, active flag and SLA 1-90 days required';end if;
  if target is not null then
   perform 1 from public.pilot_grievance_categories where id=target->>'id' and version=(target->>'version')::int for update;
   if not found then raise exception 'conflict: category changed';end if;
  elsif exists(select 1 from public.pilot_grievance_categories where id=payload->>'name') then raise exception 'conflict: category version required';end if;
  result:=pilot_private.put('grievance_categories',coalesce(target->>'id',payload->>'name'),payload);
 else
  if action='create_grievance' then
   if ac.role<>'student' then raise exception 'forbidden: student grievance required';end if;
   if trim(coalesce(payload->>'subject',''))='' or trim(coalesce(payload->>'body',''))='' then raise exception 'validation: subject and description required';end if;
   select data into cat from public.pilot_grievance_categories where id=payload->>'category' and data->>'active'='true';
   if cat is null then raise exception 'validation: active grievance category required';end if;
   s:=ac;
   select id::text into owner from public.pilot_accounts where active and (role='admin' or role='nodal' and state=s.state) order by (role='nodal') desc,id limit 1;
   if owner is null then raise exception 'validation: no responsible officer configured';end if;
   d:=jsonb_build_object('studentId',actor,'category',payload->>'category','subject',payload->>'subject','body',payload->>'body','status','open','priority',coalesce(payload->>'priority','normal'),'dueAt',now()+make_interval(days=>(cat->>'slaDays')::int),'assignedTo',owner,'messages','[]'::jsonb,'events',jsonb_build_array(jsonb_build_object('event','created','actorId',actor,'body','Grievance created and assigned','createdAt',now())),'createdAt',now());
  else
   select * into row from public.pilot_grievances where id=target->>'id' for update;
   if not found or row.version is distinct from (target->>'version')::int then raise exception 'conflict: grievance changed';end if;
   d:=row.data;
   select * into s from public.pilot_accounts where id::text=d->>'studentId';
   if not (ac.role='admin' or ac.role='student' and ac.id=s.id or ac.role='nodal' and ac.state=s.state or ac.role='institution' and ac.institution_id=s.institution_id) then raise exception 'forbidden: grievance scope';end if;
   if ac.role='student' and (payload ? 'status' or payload ? 'assignedTo' or payload ? 'priority' or payload ? 'dueAt') then raise exception 'forbidden: officer controls required';end if;
   if kind in ('reopen','appeal') then
    if d->>'status'<>'resolved' or length(trim(coalesce(payload->>'body','')))<5 then raise exception 'validation: resolved grievance and appeal reason required';end if;
    d:=d-'resolutionReason'||jsonb_build_object('status','open','dueAt',now()+interval '7 days');
   elsif kind='escalate' then
    if d->>'status'='resolved' or (d->>'dueAt')::timestamptz>now() then raise exception 'validation: only overdue unresolved grievances can escalate';end if;
    select id::text into owner from public.pilot_accounts where active and role='admin' order by id limit 1;
    d:=d||jsonb_build_object('assignedTo',owner,'priority','high','dueAt',now()+interval '2 days','escalatedAt',now());
   elsif kind<>'reply' then raise exception 'validation: unknown grievance event';end if;
   if payload ? 'assignedTo' then
    if ac.role not in ('admin','nodal') or not exists(select 1 from public.pilot_accounts where id::text=payload->>'assignedTo' and active and (role='admin' or role='nodal' and state=s.state or role='institution' and institution_id=s.institution_id)) then raise exception 'forbidden: assignment scope';end if;
    d:=d||jsonb_build_object('assignedTo',payload->>'assignedTo');
   end if;
   if payload ? 'status' then
    if payload->>'status' not in ('in_review','resolved') or payload->>'status'='resolved' and length(trim(coalesce(payload->>'resolutionReason','')))<5 then raise exception 'validation: resolution notes required';end if;
    d:=d||jsonb_build_object('status',payload->>'status','resolutionReason',payload->>'resolutionReason');
   end if;
   if payload ? 'dueAt' then
    if (payload->>'dueAt')::timestamptz<=now() or (payload->>'dueAt')::timestamptz>now()+interval '90 days' then raise exception 'validation: future SLA within 90 days required';end if;
    d:=d||jsonb_build_object('dueAt',(payload->>'dueAt')::timestamptz);
   end if;
   if payload ? 'priority' then d:=d||jsonb_build_object('priority',payload->>'priority');end if;
   if trim(coalesce(payload->>'body',''))<>'' then d:=d||jsonb_build_object('messages',coalesce(d->'messages','[]')||jsonb_build_array(jsonb_build_object('actorId',actor,'body',payload->>'body','createdAt',now())));end if;
   d:=d||jsonb_build_object('events',coalesce(d->'events','[]')||jsonb_build_array(jsonb_build_object('event',kind,'actorId',actor,'body',coalesce(payload->>'body',payload->>'resolutionReason','Grievance updated'),'changes',payload-'body'-'evidenceIds','createdAt',now())));
  end if;
  if d->>'priority' not in ('low','normal','high') then raise exception 'validation: invalid priority';end if;
  if payload ? 'evidenceIds' then
   if ac.role<>'student' or jsonb_typeof(payload->'evidenceIds') is distinct from 'array' or jsonb_array_length(payload->'evidenceIds')>10 then raise exception 'validation: up to 10 owned evidence documents required';end if;
   for evidence in select jsonb_array_elements_text(payload->'evidenceIds') loop
    if not exists(select 1 from public.pilot_documents where id=evidence and data->>'studentId'=s.id::text) then raise exception 'forbidden: evidence owner';end if;
   end loop;
   d:=d||jsonb_build_object('evidenceIds',coalesce(d->'evidenceIds','[]')||payload->'evidenceIds');
  end if;
  result:=pilot_private.put('grievances',coalesce(row.id,extensions.gen_random_uuid()::text),d);
  perform pilot_private.notice(d->>'assignedTo','Grievance assignment / update','Open the grievance workspace to review its SLA and timeline.','grievance');
  perform pilot_private.notice(s.id::text,'Grievance update','Your grievance has been recorded or updated.','grievance');
 end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',result->>'id','studentId',s.id,'createdAt',now()));
 return result;
end $$;
revoke all on function pilot_private.grievance_command(uuid,text,jsonb,jsonb) from public,anon,authenticated;

create table pilot_private.receipt_events(application_id text not null references public.pilot_applications(id),sequence integer not null,event jsonb not null,hash text not null,primary key(application_id,sequence));
alter table pilot_private.receipt_events enable row level security;
create function pilot_private.chain_receipt() returns trigger language plpgsql set search_path='' as $$
declare app public.pilot_applications; previous record; event jsonb; seq integer;begin
 select * into app from public.pilot_applications where id=coalesce(new.data->>'applicationId',new.data->>'entityId') and data ? 'receiptToken' for update;
 if not found then return new;end if;
 select * into previous from pilot_private.receipt_events where application_id=app.id order by sequence desc limit 1;
 seq:=coalesce(previous.sequence,0)+1;
 event:=jsonb_build_object('applicationId',app.id,'sequence',seq,'previousHash',previous.hash,'audit',new.data,'snapshotHash',encode(extensions.digest((app.data-'receiptToken')::text,'sha256'),'hex'));
 insert into pilot_private.receipt_events values(app.id,seq,event,encode(extensions.digest(event::text,'sha256'),'hex'));
 return new;
end $$;
revoke all on function pilot_private.chain_receipt() from public,anon,authenticated;
create trigger receipt_decisions after insert on public.pilot_audit for each row execute function pilot_private.chain_receipt();
-- Existing receipts keep their submission digest as the first canonical checkpoint.
insert into pilot_private.receipt_events(application_id,sequence,event,hash)
 select id,1,jsonb_build_object('applicationId',id,'submissionHash',data->>'receiptHash','checkpoint',data-'receiptToken'),encode(extensions.digest(jsonb_build_object('applicationId',id,'submissionHash',data->>'receiptHash','checkpoint',data-'receiptToken')::text,'sha256'),'hex') from public.pilot_applications where data ? 'receiptToken';

create function pilot_private.receipt_command(actor uuid,action text,payload jsonb,target jsonb) returns jsonb language plpgsql set search_path='' as $$
declare ac public.pilot_accounts; row public.pilot_applications; result jsonb;begin
 select * into ac from public.pilot_accounts where id=actor and active;
 select * into row from public.pilot_applications where id=target->>'id' for update;
 if not found or row.version is distinct from (target->>'version')::int then raise exception 'conflict: application changed';end if;
 if ac.role<>'admin' and not(ac.role='nodal' and ac.state=coalesce(row.data->'profileSnapshot'->>'domicileState',(select state from public.pilot_accounts where id::text=row.data->>'studentId'))) then raise exception 'forbidden: receipt administration scope';end if;
 if not row.data ? 'receiptToken' or length(trim(coalesce(payload->>'reason','')))<5 then raise exception 'validation: issued receipt and policy reason required';end if;
 if action='expire_receipt' and ((payload->>'expiresAt') is null or (payload->>'expiresAt')::timestamptz<=now()) then raise exception 'validation: future expiry required';end if;
 result:=pilot_private.put('applications',row.id,row.data||case when action='revoke_receipt' then jsonb_build_object('receiptRevokedAt',now(),'receiptRevocationReason',payload->>'reason') else jsonb_build_object('receiptExpiresAt',(payload->>'expiresAt')::timestamptz) end);
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',row.id,'applicationId',row.id,'studentId',row.data->>'studentId','detail',payload,'createdAt',now()));
 return result;
end $$;
revoke all on function pilot_private.receipt_command(uuid,text,jsonb,jsonb) from public,anon,authenticated;
create function public.pilot_receipt(token text) returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('reference',a.id,'issuedAt',a.data->>'submittedAt','hash',coalesce((select hash from pilot_private.receipt_events where application_id=a.id order by sequence desc limit 1),a.data->>'receiptHash'),'valid',not(a.data ? 'receiptRevokedAt') and (not(a.data ? 'receiptExpiresAt') or (a.data->>'receiptExpiresAt')::timestamptz>now())) from public.pilot_applications a where a.data->>'receiptToken'=token
$$;
revoke all on function public.pilot_receipt(text) from public,anon,authenticated;
grant execute on function public.pilot_receipt(text) to service_role;

create function pilot_private.evaluate(profile jsonb,scheme jsonb,evidence jsonb) returns jsonb language plpgsql immutable set search_path='' as $$
declare rule jsonb; val text; pass boolean; rules jsonb:='[]'; eligible boolean:=true;begin
 for rule in select value from jsonb_array_elements(scheme->'rules') loop
  val:=case when evidence ? (rule->>'field') or rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
  pass:=false;
  if val is not null then
   if rule->>'op' in ('max','min') then
    if val ~ '^-?\d+(\.\d+)?$' then pass:=case when rule->>'op'='max' then val::numeric<=(rule->>'threshold')::numeric else val::numeric>=(rule->>'threshold')::numeric end;end if;
   else pass:=coalesce(rule->'allowedValues' ? val,false);end if;
  end if;
  rules:=rules||jsonb_build_array(jsonb_build_object('ruleId',rule->>'id','passed',pass,'actual',val));eligible:=eligible and pass;
 end loop;
 return jsonb_build_object('eligible',eligible,'rules',rules);
end $$;
revoke all on function pilot_private.evaluate(jsonb,jsonb,jsonb) from public,anon,authenticated;

create function pilot_private.application_command(actor uuid,action text,payload jsonb,target jsonb) returns jsonb language plpgsql set search_path='' as $$
declare ac public.pilot_accounts; row public.pilot_applications; profile jsonb; scheme jsonb; d jsonb; doc jsonb; evidence jsonb:='{}'; result jsonb; source text;begin
 select * into ac from public.pilot_accounts where id=actor and active;
 select * into row from public.pilot_applications where id=target->>'id' for update;
 if not found or row.version is distinct from (target->>'version')::int then raise exception 'conflict: application changed';end if;
 if action='resolve_appeal' then
  if ac.role<>'admin' and not(ac.role='nodal' and ac.state=row.data->'profileSnapshot'->>'domicileState') then raise exception 'forbidden: appeal review scope';end if;
  if row.data->>'status'<>'appealed' or payload->>'decision' not in ('reopen','uphold') then raise exception 'validation: appeal and explicit decision required';end if;
 else
  if ac.role<>'student' or row.data->>'studentId'<>actor::text then raise exception 'forbidden: application owner required';end if;
 end if;
 if action='renew_application' then
  if row.data->>'status' not in ('sanctioned','disbursed','rejected','withdrawn') then raise exception 'validation: previous academic-year outcome required';end if;
  select data into scheme from public.pilot_schemes where id=row.data->>'schemeId' and data->>'active'='true';
  if coalesce(payload->>'academicYear','') !~ '^\d{4}-\d{2}$' or scheme->>'academicYear' is distinct from payload->>'academicYear' or substring(payload->>'academicYear',1,4)::int<>substring(row.data->>'academicYear',1,4)::int+1 or right(payload->>'academicYear',2)::int<>(substring(payload->>'academicYear',1,4)::int+1)%100 then raise exception 'validation: next academic year must be published';end if;
  if exists(select 1 from public.pilot_applications where data->>'studentId'=actor::text and data->>'schemeId'=row.data->>'schemeId' and data->>'academicYear'=payload->>'academicYear') then raise exception 'conflict: renewal already exists';end if;
  select data into profile from public.pilot_students where id=actor::text;
  if profile is null then raise exception 'validation: current profile required';end if;
  evidence:=coalesce(row.data->'evidence','{}');
  for doc in select data from public.pilot_documents where id in(select jsonb_array_elements_text(row.data->'documentIds')) and data->>'studentId'=actor::text order by data->>'uploadedAt' loop evidence:=evidence||coalesce(doc->'fields','{}');end loop;
  d:=jsonb_build_object('studentId',actor,'schemeId',row.data->>'schemeId','academicYear',payload->>'academicYear','status','draft','documentIds',row.data->'documentIds','evidence',evidence,'previousApplicationId',row.id,'eligibilityDelta',jsonb_build_object('previous',row.data->'eligibility','current',pilot_private.evaluate(profile,scheme,evidence)));
  result:=pilot_private.put('applications',extensions.gen_random_uuid()::text,d);
 else
  if length(trim(coalesce(payload->>'reason','')))<5 then raise exception 'validation: a reason of at least five characters is required';end if;
  d:=row.data;
  if action='withdraw_application' then
   if row.data->>'status' not in ('draft','institute_stage','department_stage','deficiency') or row.data->>'departmentApproved'='true' then raise exception 'validation: withdrawal is allowed before a decision';end if;
   d:=d||jsonb_build_object('status','withdrawn','withdrawalReason',payload->>'reason','withdrawnAt',now());
  elsif action='appeal_application' then
   if row.data->>'status'<>'rejected' then raise exception 'validation: rejected application required';end if;
   d:=d||jsonb_build_object('status','appealed','appealReason',payload->>'reason','appealedAt',now());
  else
   d:=d-'departmentApproved'-'returnStage'||jsonb_build_object('status',case when payload->>'decision'='reopen' then 'institute_stage' else 'rejected' end,'appealDecision',payload);
   if payload->>'decision'='reopen' then
    for source in select unnest(array['academic','institution','identity','st_certificate','income']) loop
     perform pilot_private.put('verifications',extensions.gen_random_uuid()::text,jsonb_build_object('applicationId',row.id,'source',source,'state','pending','reason','Appeal reopened: fresh human checks required','runId',extensions.gen_random_uuid()::text,'createdAt',clock_timestamp(),'simulated',true));
    end loop;
   end if;
  end if;
  result:=pilot_private.put('applications',row.id,d);
 end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',result->>'id','applicationId',result->>'id','studentId',row.data->>'studentId','detail',payload,'createdAt',now()));
 perform pilot_private.notice(row.data->>'studentId','Application lifecycle update',replace(action,'_',' '),'info');
 return result;
end $$;
revoke all on function pilot_private.application_command(uuid,text,jsonb,jsonb) from public,anon,authenticated;
create function pilot_private.keep_renewal_link() returns trigger language plpgsql set search_path='' as $$ begin
 if old.data ? 'previousApplicationId' then new.data:=new.data||jsonb_build_object('previousApplicationId',old.data->'previousApplicationId','eligibilityDelta',old.data->'eligibilityDelta');end if;return new;
end $$;
revoke all on function pilot_private.keep_renewal_link() from public,anon,authenticated;
create trigger keep_renewal_link before update on public.pilot_applications for each row execute function pilot_private.keep_renewal_link();

create table public.pilot_deliveries(id text primary key,version integer not null default 1,data jsonb not null);
alter table public.pilot_deliveries enable row level security;
grant select on public.pilot_deliveries to authenticated;
grant all on public.pilot_deliveries to service_role;
create policy delivery_read on public.pilot_deliveries for select to authenticated using((pilot_private.account()).active and ((pilot_private.account()).role='admin' or data->>'userId'=auth.uid()::text));
create index delivery_retry on public.pilot_deliveries((data->>'status'),(data->>'retryAt'));
create function pilot_private.queue_critical_email() returns trigger language plpgsql set search_path='' as $$ begin
 if new.data->>'body' in ('raise deficiency','sanction','payment result') then
  perform pilot_private.put('deliveries',extensions.gen_random_uuid()::text,jsonb_build_object('notificationId',new.id,'userId',new.data->>'userId','channel','email','status','queued','event',new.data->>'body','createdAt',now(),'retryAt',now(),'attempts','[]'::jsonb));
 end if;return new;
end $$;
revoke all on function pilot_private.queue_critical_email() from public,anon,authenticated;
create trigger queue_critical_email after insert on public.pilot_notifications for each row execute function pilot_private.queue_critical_email();
create function public.pilot_claim_email() returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.pilot_deliveries; result jsonb;begin
 select * into row from public.pilot_deliveries where data->>'status' in ('queued','failed','blocked') and (data->>'retryAt')::timestamptz<=now() and jsonb_array_length(data->'attempts')<5 order by data->>'createdAt',id for update skip locked limit 1;
 if not found then return null;end if;
 result:=pilot_private.put('deliveries',row.id,row.data||jsonb_build_object('status','processing','claimedAt',now()));return result;
end $$;
create function public.pilot_finish_email(job text,expected_version integer,outcome jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare row public.pilot_deliveries; result jsonb;begin
 select * into row from public.pilot_deliveries where id=job for update;
 if not found or row.version<>expected_version or row.data->>'status'<>'processing' then raise exception 'conflict: delivery claim changed';end if;
 if outcome->>'status' not in ('accepted','failed','blocked','unknown') or (outcome->>'status'='accepted' and trim(coalesce(outcome->>'providerId',''))='') then raise exception 'validation: provider acknowledgement required';end if;
 result:=pilot_private.put('deliveries',job,row.data||outcome||jsonb_build_object('attempts',(row.data->'attempts')||jsonb_build_array(outcome||jsonb_build_object('at',now())),'retryAt',now()+make_interval(mins=>least(60,5*(2^jsonb_array_length(row.data->'attempts'))::int))));return result;
end $$;
revoke all on function public.pilot_claim_email(),public.pilot_finish_email(text,integer,jsonb) from public,anon,authenticated;
grant execute on function public.pilot_claim_email(),public.pilot_finish_email(text,integer,jsonb) to service_role;

create table public.pilot_scheme_drafts(id text primary key,version integer not null default 1,data jsonb not null);
create table public.pilot_configuration_history(id text primary key,version integer not null default 1,data jsonb not null);
alter table public.pilot_scheme_drafts enable row level security;
alter table public.pilot_configuration_history enable row level security;
grant select on public.pilot_scheme_drafts,public.pilot_configuration_history to authenticated;
grant all on public.pilot_scheme_drafts,public.pilot_configuration_history to service_role;
create policy draft_read on public.pilot_scheme_drafts for select to authenticated using((pilot_private.account()).role='admin');
create policy config_history_read on public.pilot_configuration_history for select to authenticated using((pilot_private.account()).role='admin');
create unique index configuration_version on public.pilot_configuration_history((data->>'kind'),(data->>'entityId'),(data->>'configurationVersion'));
create function pilot_private.configuration_history() returns trigger language plpgsql set search_path='' as $$ begin
 perform pilot_private.put('configuration_history',extensions.gen_random_uuid()::text,jsonb_build_object('kind',tg_argv[0],'entityId',new.id,'configurationVersion',new.version,'config',new.data,'actorId',nullif(current_setting('pilot.actor',true),''),'createdAt',now()));return new;
end $$;
revoke all on function pilot_private.configuration_history() from public,anon,authenticated;
create trigger scheme_history after insert or update on public.pilot_schemes for each row execute function pilot_private.configuration_history('schemes');
create trigger institution_history after insert or update on public.pilot_institutions for each row execute function pilot_private.configuration_history('institutions');
insert into public.pilot_configuration_history(id,data) select extensions.gen_random_uuid()::text,jsonb_build_object('kind','schemes','entityId',id,'configurationVersion',version,'config',data,'createdAt',now()) from public.pilot_schemes;
insert into public.pilot_configuration_history(id,data) select extensions.gen_random_uuid()::text,jsonb_build_object('kind','institutions','entityId',id,'configurationVersion',version,'config',data,'createdAt',now()) from public.pilot_institutions;

create function pilot_private.configuration_command(actor uuid,action text,payload jsonb,target jsonb) returns jsonb language plpgsql set search_path='' as $$
declare draft public.pilot_scheme_drafts; published public.pilot_schemes; inst public.pilot_institutions; cfg jsonb; result jsonb; cohort jsonb:='[]'; s record; evidence jsonb; doc jsonb; required text; missing jsonb;begin
 if not exists(select 1 from public.pilot_accounts where id=actor and active and role='admin') then raise exception 'forbidden: configuration administrator required';end if;
 if action='deactivate_institution' then
  select * into inst from public.pilot_institutions where id=target->>'id' for update;
  if not found or inst.version is distinct from (target->>'version')::int then raise exception 'conflict: institution changed';end if;
  if length(trim(coalesce(payload->>'reason','')))<5 then raise exception 'validation: deactivation reason required';end if;
  result:=pilot_private.command_base(actor,'save_institution',inst.data||jsonb_build_object('active',false,'deactivationReason',payload->>'reason'),target,extensions.gen_random_uuid()::text);
 elsif action='draft_scheme' then
  cfg:=payload->'config';
  if jsonb_typeof(cfg) is distinct from 'object' or trim(coalesce(cfg->>'name',''))='' or jsonb_typeof(cfg->'rules') is distinct from 'array' then raise exception 'validation: named scheme configuration and rules required';end if;
  select * into published from public.pilot_schemes where id=payload->>'schemeId' for share;
  select * into draft from public.pilot_scheme_drafts where id=coalesce(published.id,target->>'id',payload->>'schemeId') for update;
  if draft.id is not null and (target is null or draft.version is distinct from (target->>'version')::int) then raise exception 'conflict: scheme draft changed';end if;
  result:=pilot_private.put('scheme_drafts',coalesce(published.id,draft.id,payload->>'schemeId',extensions.gen_random_uuid()::text),jsonb_build_object('config',cfg,'baseVersion',coalesce(published.version,0),'savedAt',now(),'savedBy',actor));
 elsif action='rollback_scheme' then
  select * into published from public.pilot_schemes where id=target->>'id' for update;
  if not found or published.version is distinct from (target->>'version')::int then raise exception 'conflict: scheme changed';end if;
  select data->'config' into cfg from public.pilot_configuration_history where id=payload->>'historyId' and data->>'entityId'=published.id and data->>'kind'='schemes';
  if cfg is null then raise exception 'validation: matching historical scheme required';end if;
  result:=pilot_private.command_base(actor,'save_scheme',cfg,target,extensions.gen_random_uuid()::text);
 else
  select * into draft from public.pilot_scheme_drafts where id=target->>'id' for update;
  if not found or draft.version is distinct from (target->>'version')::int then raise exception 'conflict: scheme draft changed';end if;
  cfg:=draft.data->'config';
  if action='dry_run_scheme' then
   for s in select * from public.pilot_students order by id loop
    select coalesce(data->'evidence','{}') into evidence from public.pilot_applications where data->>'studentId'=s.id and data->>'schemeId'=draft.id order by version desc,id limit 1;
    evidence:=coalesce(evidence,'{}');missing:='[]';
    for doc in select data from public.pilot_documents where data->>'studentId'=s.id order by data->>'uploadedAt',id loop evidence:=evidence||coalesce(doc->'fields','{}');end loop;
    for required in select jsonb_array_elements_text(cfg->'requiredDocs') loop if not exists(select 1 from public.pilot_documents where data->>'studentId'=s.id and data->>'type'=required) then missing:=missing||jsonb_build_array(required);end if;end loop;
    cohort:=cohort||jsonb_build_array(jsonb_build_object('studentId',s.id,'eligibility',pilot_private.evaluate(s.data,cfg,evidence),'missingDocumentTypes',missing));
   end loop;result:=jsonb_build_object('cohort',cohort,'draftVersion',draft.version);
  else
   if draft.data ? 'publishedAt' then raise exception 'validation: save a new draft before publishing again';end if;
   select * into published from public.pilot_schemes where id=draft.id for update;
   if coalesce(published.version,0)<>(draft.data->>'baseVersion')::int then raise exception 'conflict: published scheme changed; save and review a fresh draft';end if;
   result:=pilot_private.command_base(actor,'save_scheme',cfg||jsonb_build_object('id',draft.id),case when published.id is not null then jsonb_build_object('id',published.id,'version',published.version) end,extensions.gen_random_uuid()::text);
   perform pilot_private.put('scheme_drafts',draft.id,draft.data||jsonb_build_object('publishedAt',now(),'baseVersion',result->'version'));
  end if;
 end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',coalesce(result->>'id',draft.id),'detail',payload-'config','createdAt',now()));return result;
end $$;
revoke all on function pilot_private.configuration_command(uuid,text,jsonb,jsonb) from public,anon,authenticated;

-- Submission, final review and dry-run use one evaluator.
do $migration$ declare source text;begin
 source:=replace(pg_get_functiondef('pilot_private.command_base(uuid,text,jsonb,jsonb,text)'::regprocedure),chr(13),'');
 if position($before$ d:='[]';
 for rule in select value from jsonb_array_elements(scheme->'rules') loop
 val:=case when rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
 pass:=false;
 if val is not null then
 if rule->>'op'='max' then pass:=val::numeric<=(rule->>'threshold')::numeric;elsif rule->>'op'='min' then pass:=val::numeric>=(rule->>'threshold')::numeric;else pass:=coalesce(rule->'allowedValues' ? val,false);end if;
 end if;
 d:=d||jsonb_build_array(jsonb_build_object('ruleId',rule->>'id','passed',pass,'actual',val));
 if not pass then raise exception 'validation: eligibility failed: %',rule->>'id';end if;end loop;
$before$ in source)=0 then raise exception 'Workflow evaluator source changed: review migration';end if;
 execute replace(source,$before$ d:='[]';
 for rule in select value from jsonb_array_elements(scheme->'rules') loop
 val:=case when rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
 pass:=false;
 if val is not null then
 if rule->>'op'='max' then pass:=val::numeric<=(rule->>'threshold')::numeric;elsif rule->>'op'='min' then pass:=val::numeric>=(rule->>'threshold')::numeric;else pass:=coalesce(rule->'allowedValues' ? val,false);end if;
 end if;
 d:=d||jsonb_build_array(jsonb_build_object('ruleId',rule->>'id','passed',pass,'actual',val));
 if not pass then raise exception 'validation: eligibility failed: %',rule->>'id';end if;end loop;
$before$,$after$ d:=pilot_private.evaluate(profile,scheme,evidence);
 if d->>'eligible'<>'true' then raise exception 'validation: eligibility failed';end if;
 d:=d->'rules';
$after$);
end $migration$;

-- Submission, final review and dry-run use one evaluator.
do $migration$ declare source text;begin
 source:=replace(pg_get_functiondef('pilot_private.command_base(uuid,text,jsonb,jsonb,text)'::regprocedure),chr(13),'');
 if position($before$ for rule in select value from jsonb_array_elements(scheme->'rules') loop
 val:=case when evidence ? (rule->>'field') or rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
 pass:=false;
 if val is not null then if rule->>'op'='max' then pass:=val::numeric<=(rule->>'threshold')::numeric;elsif rule->>'op'='min' then pass:=val::numeric>=(rule->>'threshold')::numeric;else pass:=coalesce(rule->'allowedValues' ? val,false);end if;end if;
 if not pass then raise exception 'validation: reviewed eligibility failed: %',rule->>'id';end if;
 end loop;
$before$ in source)=0 then raise exception 'Workflow evaluator source changed: review migration';end if;
 execute replace(source,$before$ for rule in select value from jsonb_array_elements(scheme->'rules') loop
 val:=case when evidence ? (rule->>'field') or rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
 pass:=false;
 if val is not null then if rule->>'op'='max' then pass:=val::numeric<=(rule->>'threshold')::numeric;elsif rule->>'op'='min' then pass:=val::numeric>=(rule->>'threshold')::numeric;else pass:=coalesce(rule->'allowedValues' ? val,false);end if;end if;
 if not pass then raise exception 'validation: reviewed eligibility failed: %',rule->>'id';end if;
 end loop;
$before$,$after$ if pilot_private.evaluate(profile,scheme,evidence)->>'eligible'<>'true' then raise exception 'validation: reviewed eligibility failed';end if;
$after$);
end $migration$;
