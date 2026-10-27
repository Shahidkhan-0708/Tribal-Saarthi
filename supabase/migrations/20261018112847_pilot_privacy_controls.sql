create table public.pilot_consents(id text primary key,version int not null default 1,data jsonb not null);
create table public.pilot_consent_events(id text primary key,version int not null default 1,data jsonb not null);
create table public.pilot_privacy_policies(id text primary key,version int not null default 1,data jsonb not null);
alter table public.pilot_consents enable row level security;
alter table public.pilot_consent_events enable row level security;
alter table public.pilot_privacy_policies enable row level security;
grant select on public.pilot_consents,public.pilot_consent_events,public.pilot_privacy_policies to authenticated;
grant all on public.pilot_consents,public.pilot_consent_events,public.pilot_privacy_policies to service_role;
create policy consent_read on public.pilot_consents for select to authenticated using((select (pilot_private.account()).active) and (data->>'studentId'=(select auth.uid())::text or (select (pilot_private.account()).role)='admin'));
create policy consent_event_read on public.pilot_consent_events for select to authenticated using((select (pilot_private.account()).active) and (data->>'studentId'=(select auth.uid())::text or (select (pilot_private.account()).role)='admin'));
create policy privacy_policy_read on public.pilot_privacy_policies for select to authenticated using((select (pilot_private.account()).active));

create function pilot_private.consent_event() returns trigger language plpgsql security definer set search_path='' as $$ begin
 perform pilot_private.put('consent_events',extensions.gen_random_uuid()::text,new.data||jsonb_build_object('consentId',new.id,'consentVersion',new.version,'recordedAt',now()));return new;
end $$;
revoke all on function pilot_private.consent_event() from public,anon,authenticated;
create trigger consent_history after insert or update on public.pilot_consents for each row execute function pilot_private.consent_event();
create function pilot_private.family_consent() returns trigger language plpgsql security definer set search_path='' as $$ begin
 perform pilot_private.put('consents','family:'||new.id,jsonb_build_object('studentId',new.data->>'studentId','purpose','family_summary','recipientId',new.data->>'familyUserId','active',new.data->'active','policyVersion','2026-10-18','changedAt',now()));return new;
end $$;
revoke all on function pilot_private.family_consent() from public,anon,authenticated;
create trigger family_consent after insert or update on public.pilot_family_grants for each row execute function pilot_private.family_consent();
insert into public.pilot_consents(id,data) select 'family:'||id,jsonb_build_object('studentId',data->>'studentId','purpose','family_summary','recipientId',data->>'familyUserId','active',data->'active','policyVersion','legacy-recorded','changedAt',data->>'grantedAt','migratedAt',now()) from public.pilot_family_grants;

create function public.pilot_privacy(action text,payload jsonb,target jsonb,operation_id text) returns jsonb language plpgsql security definer set search_path='' as $$
<<privacy>>
declare ac public.pilot_accounts; old jsonb; result jsonb; digest text; previous pilot_private.operations; rid text; category text;begin
 ac:=pilot_private.account();if ac.id is null then raise exception 'forbidden: active account required';end if;
 if action not in ('grant_document_consent','revoke_consent','save_retention','review_erasure','review_admin_access') or jsonb_typeof(payload) is distinct from 'object' or length(operation_id) not between 8 and 160 or operation_id is null then raise exception 'validation: invalid privacy command';end if;
 digest:=encode(extensions.digest(jsonb_build_object('action',action,'payload',payload,'target',target)::text,'sha256'),'hex');
 insert into pilot_private.operations values(ac.id,operation_id,digest,null) on conflict do nothing;
 select * into previous from pilot_private.operations where actor_id=ac.id and pilot_private.operations.operation_id=pilot_privacy.operation_id for update;
 if previous.digest<>digest then raise exception 'conflict: operation key reused';end if;if previous.result is not null then return previous.result;end if;
 if not (public.pilot_rate_limit('workflow',ac.id::text)->>'allowed')::boolean then raise exception 'validation: too many privacy changes; retry after one minute';end if;
 if action='grant_document_consent' then
  if ac.role<>'student' or payload->>'provider' is distinct from 'digilocker' or payload->>'policyVersion' is distinct from '2026-10-18' then raise exception 'validation: student must accept the current document-fetch purpose';end if;
  rid:='digilocker:'||ac.id;select data into old from public.pilot_consents where id=rid for update;
  result:=pilot_private.put('consents',rid,jsonb_build_object('studentId',ac.id,'purpose','document_fetch','provider','digilocker','active',true,'policyVersion','2026-10-18','changedAt',now()));
 elsif action='revoke_consent' then
  select data into old from public.pilot_consents where id=target->>'id' and version=(target->>'version')::int for update;
  if old is null then raise exception 'conflict: consent changed';end if;
  if old->>'studentId'<>ac.id::text then raise exception 'forbidden: consent owner required';end if;
  if old->>'purpose'='family_summary' then
   update public.pilot_family_grants set version=version+1,data=data||jsonb_build_object('active',false,'revokedAt',now()) where id=substring(target->>'id' from 8);
   select to_jsonb(c) into result from public.pilot_consents c where id=target->>'id';
  else result:=pilot_private.put('consents',target->>'id',old||jsonb_build_object('active',false,'changedAt',now()));end if;
 else
  if ac.role<>'admin' then raise exception 'forbidden: administrator required';end if;
  if length(trim(coalesce(payload->>'reason',''))) not between 5 and 2000 then raise exception 'validation: review reason required';end if;
  if action='save_retention' then
   if payload->>'reviewDueAt' is null or (payload->>'reviewDueAt')::date<current_date or (payload->>'reviewDueAt')::date>current_date+366 then raise exception 'validation: policy review must be due within one year';end if;
   if jsonb_typeof(payload->'days') is distinct from 'object' then raise exception 'validation: retention schedule required';end if;
   foreach category in array array['documents','applications','accounts','consents','audit','offline'] loop
    if coalesce(payload->'days'->>category,'') !~ '^[0-9]{1,4}$' or (payload->'days'->>category)::int not between 1 and 3650 then raise exception 'validation: each retention period must be 1-3650 days';end if;
   end loop;
   select data into old from public.pilot_privacy_policies where id='retention' for update;
   if exists(select 1 from public.pilot_privacy_policies where id='retention' and version is distinct from (target->>'version')::int) then raise exception 'conflict: policy changed';end if;
   result:=pilot_private.put('privacy_policies','retention',jsonb_build_object('days',payload->'days','reason',payload->>'reason','reviewDueAt',payload->>'reviewDueAt','reviewedBy',ac.id,'reviewedAt',now(),'status','operator_reviewed','deletion','manual_review_required'));
  else
   select to_jsonb(a) into old from public.pilot_accounts a where id=(target->>'id')::uuid and version=(target->>'version')::int for update;
   if old is null then raise exception 'conflict: account changed';end if;
   if action='review_erasure' then
    if old->'lifecycle'->>'erasureRequestedAt' is null or coalesce(payload->>'status','') not in ('under_review','retained','ready_for_erasure') or payload->>'reviewDueAt' is null or (payload->>'reviewDueAt')::date<current_date or (payload->>'reviewDueAt')::date>current_date+366 then raise exception 'validation: request, review state and next review date required';end if;
    if payload->>'status'='ready_for_erasure' and not exists(select 1 from public.pilot_privacy_policies where id='retention' and (data->>'reviewDueAt')::date>=current_date) then raise exception 'validation: current retention review required';end if;
    update public.pilot_accounts set version=version+1,lifecycle=lifecycle||jsonb_build_object('erasureStatus',payload->>'status','erasureReviewReason',payload->>'reason','erasureReviewDueAt',payload->>'reviewDueAt','erasureReviewedAt',now(),'erasureReviewedBy',ac.id) where id=(target->>'id')::uuid returning to_jsonb(pilot_accounts.*) into result;
   else
    if old->>'role'<>'admin' or coalesce(payload->>'decision','') not in ('retain','change_required') then raise exception 'validation: administrator and access decision required';end if;
    update public.pilot_accounts set version=version+1,lifecycle=lifecycle||jsonb_build_object('accessReview',jsonb_build_object('decision',payload->>'decision','reason',payload->>'reason','reviewedBy',ac.id,'reviewedAt',now(),'selfReview',ac.id=(target->>'id')::uuid)) where id=(target->>'id')::uuid returning to_jsonb(pilot_accounts.*) into result;
   end if;
  end if;
 end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',ac.id,'action',action,'entityId',result->>'id','studentId',case when ac.role='student' then ac.id::text end,'createdAt',now(),'detail',jsonb_build_object('version',result->'version')));
 update pilot_private.operations set result=privacy.result where actor_id=ac.id and pilot_private.operations.operation_id=pilot_privacy.operation_id;return result;
end $$;
revoke all on function public.pilot_privacy(text,jsonb,jsonb,text) from public,anon;
grant execute on function public.pilot_privacy(text,jsonb,jsonb,text) to authenticated;

create function public.pilot_processing_record() returns jsonb language plpgsql stable security definer set search_path='' as $$ begin
 if (pilot_private.account()).role is distinct from 'admin' then raise exception 'forbidden: administrator required';end if;
 return jsonb_build_object('generatedAt',now(),'noticeVersion','2026-10-18','purpose','Scholarship assessment, document review, consented family summaries, grievance handling and audit','categories',jsonb_build_array('Contact and profile','Masked Aadhaar last four only','Private evidence files','Applications and decisions','Consent and access review history'),'processors',jsonb_build_array('Supabase: Auth, database and private Storage','Vercel: pilot web hosting','Brevo: email only when configured; do not include evidence or identity numbers'),'governmentServices','Unconnected; explicit simulation or unavailable mode. Approved provider access required.','retention',coalesce((select data from public.pilot_privacy_policies where id='retention'),'{}'::jsonb),'counts',jsonb_build_object('activeConsents',(select count(*) from public.pilot_consents where data->>'active'='true'),'erasureRequests',(select count(*) from public.pilot_accounts where lifecycle ? 'erasureRequestedAt'),'overdueErasureReviews',(select count(*) from public.pilot_accounts where lifecycle->>'erasureReviewDueAt' is not null and (lifecycle->>'erasureReviewDueAt')::date<current_date),'administrators',(select count(*) from public.pilot_accounts where role='admin' and active),'unreviewedAdministrators',(select count(*) from public.pilot_accounts where role='admin' and active and not lifecycle ? 'accessReview')),'runbook','docs/data-protection.md','legalApproval','Not asserted; operator must confirm applicable policy and obligations');
end $$;
revoke all on function public.pilot_processing_record() from public,anon;
grant execute on function public.pilot_processing_record() to authenticated;
create index pilot_consent_owner on public.pilot_consents((data->>'studentId'),id);
create index pilot_consent_events_owner on public.pilot_consent_events((data->>'studentId'),id);
