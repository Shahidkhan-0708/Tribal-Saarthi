create extension if not exists pgcrypto with schema extensions;
create schema if not exists pilot_private;
revoke all on schema pilot_private from public, anon, authenticated;
create table public.pilot_accounts(id uuid primary key references auth.users(id),email text not null,name text not null,role text not null check(role in ('student','institution','nodal','admin','family')),institution_id text,state text,active boolean not null default true);
create unique index pilot_account_email on public.pilot_accounts(lower(email));
create table pilot_private.operations(actor_id uuid not null, operation_id text not null, digest text not null,result jsonb,primary key(actor_id,operation_id));
create function pilot_private.account() returns public.pilot_accounts language sql stable security definer set search_path='' as $$ select a from public.pilot_accounts a where id=auth.uid() and active $$;
create function pilot_private.scope(student text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.pilot_accounts a join public.pilot_accounts s on s.id::text=student where a.id=auth.uid() and a.active and (a.role='admin' or (a.role='student' and a.id=s.id) or (a.role='institution' and a.institution_id=s.institution_id) or (a.role='nodal' and a.state=s.state))) $$;
do $$ declare t text; begin
 foreach t in array array['students','schemes','institutions','documents','applications','deficiencies','verifications','grievances','notifications','family_grants','payments','baselines','audit','notes'] loop
 execute format('create table public.pilot_%I(id text primary key,version integer not null default 1 check(version>0),data jsonb not null check(jsonb_typeof(data)=''object''))',t);
 execute format('alter table public.pilot_%I enable row level security',t);
 execute format('grant select on public.pilot_%I to authenticated',t);
 execute format('revoke insert,update,delete on public.pilot_%I from anon,authenticated',t);
 end loop;
end $$;
alter table public.pilot_accounts enable row level security;
grant select on public.pilot_accounts to authenticated;
revoke insert,update,delete on public.pilot_accounts from anon,authenticated;
create policy account_read on public.pilot_accounts for select to authenticated using(id=auth.uid() or (pilot_private.account()).role='admin');
create policy student_read on public.pilot_students for select to authenticated using(pilot_private.scope(id));
create policy document_read on public.pilot_documents for select to authenticated using(pilot_private.scope(data->>'studentId'));
create policy application_read on public.pilot_applications for select to authenticated using(pilot_private.scope(data->>'studentId'));
create policy grievance_read on public.pilot_grievances for select to authenticated using(pilot_private.scope(data->>'studentId'));
create policy notification_read on public.pilot_notifications for select to authenticated using((pilot_private.account()).active and data->>'userId'=auth.uid()::text);
create policy grant_read on public.pilot_family_grants for select to authenticated using((pilot_private.account()).active and (data->>'studentId'=auth.uid()::text or data->>'familyUserId'=auth.uid()::text));
do $$ declare t text;begin
 foreach t in array array['schemes','institutions'] loop execute format('create policy catalogue_read on public.pilot_%I for select to authenticated using ((pilot_private.account()).active)',t);end loop;
 foreach t in array array['deficiencies','verifications','payments','notes'] loop execute format('create policy scoped_read on public.pilot_%I for select to authenticated using (exists(select 1 from public.pilot_applications a where a.id=pilot_%I.data->>''applicationId'' and pilot_private.scope(a.data->>''studentId'')))',t,t);end loop;
end $$;
create policy baseline_read on public.pilot_baselines for select to authenticated using((pilot_private.account()).role='admin' or ((pilot_private.account()).role='nodal' and data->>'state'=(pilot_private.account()).state));
create policy audit_read on public.pilot_audit for select to authenticated using((pilot_private.account()).role='admin');
create index on public.pilot_documents((data->>'studentId'));
create index on public.pilot_applications((data->>'studentId'));
create unique index application_year on public.pilot_applications((data->>'studentId'),(data->>'schemeId'),(data->>'academicYear'));
create index on public.pilot_deficiencies((data->>'applicationId'));
create index on public.pilot_verifications((data->>'applicationId'));
create index on public.pilot_payments((data->>'applicationId'));
create index on public.pilot_notifications((data->>'userId'));
create unique index storage_document_path on public.pilot_documents((data->>'objectPath'));
create function pilot_private.put(tab text, rid text, value jsonb) returns jsonb language plpgsql set search_path='' as $$ declare r jsonb;begin
 execute format('insert into public.pilot_%I(id,data) values($1,$2) on conflict(id) do update set data=excluded.data,version=pilot_%I.version+1 returning to_jsonb(pilot_%I.*)',tab,tab,tab) into r using rid,value;return r;end $$;
create function pilot_private.notice(uid text,title text,body text,category text) returns void language plpgsql set search_path='' as $$ begin perform pilot_private.put('notifications',extensions.gen_random_uuid()::text,jsonb_build_object('userId',uid,'title',title,'body',body,'category',category,'createdAt',now()));end $$;
create function public.family_summary() returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('applications',coalesce((select jsonb_agg(jsonb_build_object('id',a.id,'version',a.version,'data',jsonb_build_object('studentId',a.data->>'studentId','schemeId',a.data->>'schemeId','academicYear',a.data->>'academicYear','status',a.data->>'status','submittedAt',a.data->>'submittedAt','sanctionedAmount',a.data->'sanctionedAmount','disbursedAmount',a.data->'disbursedAmount','dbtStatus',a.data->>'dbtStatus'))) from public.pilot_applications a where exists(select 1 from public.pilot_family_grants g where g.data->>'familyUserId'=auth.uid()::text and g.data->>'studentId'=a.data->>'studentId' and g.data->>'active'='true') and (pilot_private.account()).role='family'),'[]'::jsonb),'payments',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'version',p.version,'data',p.data-'reason'-'transactionId')) from public.pilot_payments p join public.pilot_applications a on a.id=p.data->>'applicationId' where exists(select 1 from public.pilot_family_grants g where g.data->>'familyUserId'=auth.uid()::text and g.data->>'studentId'=a.data->>'studentId' and g.data->>'active'='true') and (pilot_private.account()).role='family'),'[]'::jsonb)) $$;
revoke all on function public.family_summary() from public,anon;
grant execute on function public.family_summary() to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('pilot-documents','pilot-documents',false,10485760,array['application/pdf','image/jpeg','image/png']),('pilot-signatures','pilot-signatures',false,10485760,array['application/pdf','image/jpeg','image/png']);
create policy immutable_upload on storage.objects for insert to authenticated with check(bucket_id in ('pilot-documents','pilot-signatures') and (storage.foldername(name))[1]=auth.uid()::text and ((bucket_id='pilot-documents' and (pilot_private.account()).role='student') or (bucket_id='pilot-signatures' and (pilot_private.account()).role in ('admin','nodal'))));
create policy scoped_download on storage.objects for select to authenticated using((pilot_private.account()).active and bucket_id in ('pilot-documents','pilot-signatures') and ((storage.foldername(name))[1]=auth.uid()::text or (bucket_id='pilot-documents' and exists(select 1 from public.pilot_documents d where d.data->>'objectPath'=name and pilot_private.scope(d.data->>'studentId'))) or (bucket_id='pilot-signatures' and exists(select 1 from public.pilot_applications a where a.data->>'signaturePath'=name and pilot_private.scope(a.data->>'studentId')))));
create function public.pilot_command(actor uuid, action text,payload jsonb,target jsonb,operation_id text) returns jsonb language plpgsql security definer set search_path='' as $$
<<command_block>>
declare ac public.pilot_accounts; t text; rid text; old jsonb; d jsonb; result jsonb; app jsonb; aid text; student text; scheme jsonb; profile jsonb; doc jsonb; x record; rule jsonb; val text; pass boolean; evidence jsonb; digest text; previous pilot_private.operations; status text; source text; count_sent int:=0; required text; receipt text;
begin
 select * into ac from public.pilot_accounts where id=actor and active for share;
 if not found then raise exception 'forbidden: inactive account';end if;
 if operation_id is null or length(operation_id)<8 or length(operation_id)>160 or jsonb_typeof(payload)<>'object' then raise exception 'validation: invalid command';end if;
 for required in select unnest(case action
 when 'save_profile' then array['name','gender','dob','tribe','isPVTG','familyIncome','domicileState','domicileDistrict','courseLevel','course','institutionId','year']
 when 'register_document' then array['type','title','objectPath','checksum','size','mimeType']
 when 'review_document' then array['status','reason']
 when 'save_draft' then array['schemeId','academicYear','documentIds']
 when 'run_verification' then array['source']
 when 'review_verification' then array['state','reason']
 when 'raise_deficiency' then array['documentType','reason','deadline']
 when 'correct_deficiency' then array['documentId']
 when 'sanction' then array['signaturePath']
 when 'payment_result' then array['status']
 when 'reject_application' then array['reason']
 when 'create_grievance' then array['category','subject','body']
 when 'grant_family' then array[]::text[]
 when 'add_note' then array['body']
 when 'broadcast' then array['audience','title','body']
 when 'import_baselines' then array['rows']
 else array[]::text[] end) loop
 if not payload ? required or payload->required='null'::jsonb then raise exception 'validation: required field %',required;end if;
 end loop;
 digest:=encode(extensions.digest(jsonb_build_object('action',action,'payload',payload,'target',target)::text,'sha256'),'hex');
 insert into pilot_private.operations values(actor,operation_id,digest,null) on conflict do nothing;
 select * into previous from pilot_private.operations where actor_id=actor and pilot_private.operations.operation_id=pilot_command.operation_id for update;
 if previous.digest<>digest then raise exception 'conflict: operation key reused';end if;
 if previous.result is not null then return previous.result;end if;
 t:=case when action='save_profile' then 'students' when action in ('register_document','review_document') then 'documents' when action='correct_deficiency' then 'deficiencies' when action='review_verification' then 'verifications' when action='payment_result' then 'payments' when action in ('create_grievance','update_grievance') then 'grievances' when action='mark_notification_read' then 'notifications' when action in ('grant_family','revoke_family') then 'family_grants' when action='save_scheme' then 'schemes' when action='save_institution' then 'institutions' else 'applications' end;
 rid:=target->>'id';
 if rid is not null then
 execute format('select data,version from public.pilot_%I where id=$1 for update',t) into x using rid;
 if x.data is null then raise exception 'validation: record missing';end if;
 if x.version<>(target->>'version')::int then raise exception 'conflict: version changed';end if;
 old:=x.data;
 end if;
 if action in ('save_profile','register_document','save_draft','submit_application','correct_deficiency','create_grievance','grant_family','revoke_family') and ac.role<>'student' then raise exception 'forbidden: student action';end if;
 if action in ('save_scheme','save_institution','import_baselines') and ac.role<>'admin' then raise exception 'forbidden: admin action';end if;
 if action in ('review_document','run_verification','review_verification','raise_deficiency','approve_institute','approve_department','reject_application','sanction','request_payment','payment_result','add_note') and ac.role not in ('institution','nodal','admin') then raise exception 'forbidden: officer action';end if;
 if action in ('save_scheme','save_institution') then
 payload:=payload||jsonb_build_object('id',coalesce(rid,payload->>'id',extensions.gen_random_uuid()::text));
 if coalesce(trim(payload->>'name'),'')='' then raise exception 'validation: configuration name required';end if;
 if rid is null then
 execute format('select exists(select 1 from public.pilot_%I where id=$1)',t) into pass using payload->>'id';
 if pass then raise exception 'conflict: configuration version required';end if;end if;
 if action='save_scheme' and (jsonb_typeof(payload->'rules') is distinct from 'array' or jsonb_typeof(payload->'requiredDocs') is distinct from 'array' or jsonb_typeof(payload->'sanctionAmount') is distinct from 'number' or coalesce((payload->>'sanctionAmount')::numeric,0)<=0 or jsonb_typeof(payload->'active') is distinct from 'boolean' or coalesce(payload->>'academicYear','') !~ '^\d{4}-\d{2}$' or coalesce(payload->>'deadline','') !~ '^\d{4}-\d{2}-\d{2}$') then raise exception 'validation: invalid scheme';end if;
 if action='save_scheme' then
 for rule in select value from jsonb_array_elements(payload->'rules') loop
 if coalesce(rule->>'field','') not in ('category','tribe','isPVTG','familyIncome','courseLevel','course','institutionId','domicileState','marks','attendance','admission','noOtherFellowship') or coalesce(rule->>'op','') not in ('min','max','eq','in') or coalesce(rule->>'id','')='' or (rule->>'op' in ('min','max') and jsonb_typeof(rule->'threshold') is distinct from 'number') or (rule->>'op' in ('eq','in') and jsonb_typeof(rule->'allowedValues') is distinct from 'array') then raise exception 'validation: invalid eligibility rule';end if;end loop;
 end if;
 if action='save_institution' and (coalesce(payload->>'state','')='' or coalesce(payload->>'district','')='' or jsonb_typeof(payload->'inSchemeBasket') is distinct from 'boolean') then raise exception 'validation: institution state/district/basket required';end if;
 result:=pilot_private.put(t,coalesce(rid,payload->>'id'),payload);
 elsif action='save_profile' then
 if rid is not null and rid<>actor::text then raise exception 'forbidden: profile owner';end if;
 if exists(select 1 from jsonb_object_keys(payload) k where k not in ('name','gender','dob','aadhaarLast4','tribe','isPVTG','category','familyIncome','fatherName','domicileState','domicileDistrict','homeVillage','language','courseLevel','course','institutionId','year','apaarId','abcCredits','familyViewConsent','id')) then raise exception 'validation: unknown profile field';end if;
 d:=coalesce(old,'{}')||payload||jsonb_build_object('id',actor,'category','ST','familyViewConsent',false);
 if jsonb_typeof(d->'isPVTG') is distinct from 'boolean' or jsonb_typeof(d->'familyIncome') is distinct from 'number' or (d->>'familyIncome')::numeric>100000000 or d->>'dob' !~ '^\d{4}-\d{2}-\d{2}$' or (d->>'dob')::date>current_date then raise exception 'validation: invalid income, birth date or PVTG flag';end if;
 if coalesce(d->>'name','')='' or d->>'gender' not in ('F','M') or d->>'courseLevel' not in ('post-matric','undergrad','postgrad','research') or coalesce(d->>'domicileState','')='' or (d->>'familyIncome')::numeric<0 or (coalesce(d->>'aadhaarLast4','')<>'' and d->>'aadhaarLast4' !~ '^\d{4}$') or not exists(select 1 from public.pilot_institutions where id=d->>'institutionId') then raise exception 'validation: incomplete profile';end if;
 if rid is null and exists(select 1 from public.pilot_students where id=actor::text) then raise exception 'conflict: profile version required';end if;
 update public.pilot_accounts set institution_id=d->>'institutionId',state=d->>'domicileState' where id=actor;
 result:=pilot_private.put('students',actor::text,d);
 elsif action='register_document' then
 if jsonb_typeof(payload->'size') is distinct from 'number' or payload->>'size' !~ '^\d+$' then raise exception 'validation: document size must be an integer';end if;
 if rid is not null or payload->>'objectPath' not like actor::text||'/%' or payload->>'checksum' !~ '^[0-9a-f]{64}$' or (payload->>'size')::int not between 1 and 10485760 or payload->>'mimeType' not in ('application/pdf','image/png','image/jpeg') or payload->>'type' not in ('st_certificate','income_certificate','domicile','marksheet','admission_proof','bank_passbook','aadhaar','research_proposal') then raise exception 'validation: invalid document';end if;
 if payload->>'previousVersionId' is not null and not exists(select 1 from public.pilot_documents where id=payload->>'previousVersionId' and data->>'studentId'=actor::text and data->>'type'=payload->>'type') then raise exception 'validation: previous document';end if;
 result:=pilot_private.put('documents',extensions.gen_random_uuid()::text,(payload-'fields'-'reviewReason'-'reviewerId')||jsonb_build_object('studentId',actor,'status','unverified','uploadedAt',now()));
 elsif action='save_draft' then
 if rid is null and exists(select 1 from public.pilot_applications where data->>'studentId'=actor::text and data->>'schemeId'=payload->>'schemeId' and data->>'academicYear'=payload->>'academicYear') then raise exception 'conflict: application already exists for this scheme and year';end if;
 if payload ? 'evidence' and jsonb_typeof(payload->'evidence') is distinct from 'object' then raise exception 'validation: evidence object required';end if;
 if jsonb_array_length(payload->'documentIds')>20 then raise exception 'validation: too many attachments';end if;
 for required in select unnest(array['marks','attendance']) loop
 if payload->'evidence' ? required and (jsonb_typeof(payload->'evidence'->required) is distinct from 'number' or (payload->'evidence'->>required)::numeric not between 0 and 100) then raise exception 'validation: evidence percentage invalid';end if;end loop;
 for required in select unnest(array['admission','noOtherFellowship']) loop
 if payload->'evidence' ? required and (payload->'evidence'->>required) not in ('yes','no') then raise exception 'validation: evidence declaration invalid';end if;end loop;
 if old is not null and (old->>'studentId'<>actor::text or old->>'status'<>'draft') then raise exception 'forbidden: draft owner or stage';end if;
 if not exists(select 1 from public.pilot_schemes where id=payload->>'schemeId' and data->>'active'='true') or jsonb_typeof(payload->'documentIds')<>'array' or coalesce(payload->>'academicYear','')='' then raise exception 'validation: invalid draft';end if;
 for required in select jsonb_array_elements_text(payload->'documentIds') loop if not exists(select 1 from public.pilot_documents where id=required and data->>'studentId'=actor::text) then raise exception 'forbidden: document owner';end if;end loop;
 result:=pilot_private.put('applications',coalesce(rid,extensions.gen_random_uuid()::text),jsonb_build_object('studentId',actor,'schemeId',payload->>'schemeId','academicYear',payload->>'academicYear','status','draft','documentIds',payload->'documentIds','evidence',coalesce(payload->'evidence','{}')));
 elsif action='create_grievance' then
 if coalesce(payload->>'subject','')='' or coalesce(payload->>'body','')='' then raise exception 'validation: grievance body required';end if;
 result:=pilot_private.put('grievances',extensions.gen_random_uuid()::text,jsonb_build_object('studentId',actor,'category',payload->>'category','subject',payload->>'subject','body',payload->>'body','status','open','messages','[]'::jsonb,'createdAt',now()));
 elsif action in ('grant_family','revoke_family') then
 if action='grant_family' then
 if payload ? 'familyEmail' then
 if jsonb_typeof(payload->'familyEmail') is distinct from 'string' or trim(payload->>'familyEmail') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'validation: invited family email required';end if;
 select id::text,email into rid,required from public.pilot_accounts where lower(email)=lower(trim(payload->>'familyEmail')) and role='family' and active;
 if rid is null then raise exception 'validation: active invited family account required';end if;
 payload:=payload||jsonb_build_object('familyUserId',rid,'familyEmail',lower(trim(required)));
 end if;
 if not exists(select 1 from public.pilot_accounts where id::text=payload->>'familyUserId' and role='family' and active) then raise exception 'validation: invited family account required';end if;
 rid:=actor::text||':'||(payload->>'familyUserId'); d:=jsonb_build_object('studentId',actor,'familyUserId',payload->>'familyUserId','familyEmail',payload->>'familyEmail','active',true,'grantedAt',now());
 else if old->>'studentId'<>actor::text then raise exception 'forbidden: grant owner';end if;d:=old||jsonb_build_object('active',false);end if;
 result:=pilot_private.put('family_grants',rid,d);
 elsif action='mark_notification_read' then
 if old->>'userId'<>actor::text then raise exception 'forbidden: notification owner';end if;
 result:=pilot_private.put(t,rid,old||jsonb_build_object('readAt',now()));
 elsif action='import_baselines' then
 if jsonb_typeof(payload->'rows')<>'array' then raise exception 'validation: rows required';end if;
 if jsonb_array_length(payload->'rows') not between 1 and 1000 then raise exception 'validation: import between 1 and 1000 rows';end if;
 for d in select value from jsonb_array_elements(payload->'rows') loop
 if jsonb_typeof(d) is distinct from 'object' or d->>'academicYear' !~ '^\d{4}-\d{2}$' or coalesce(d->>'sourceUrl','') !~ '^https://' or coalesce(d->>'enrolled','') !~ '^\d+$' or (d->>'enrolled')::numeric>1000000000 or (d ? 'beneficiaries' and (coalesce(d->>'beneficiaries','') !~ '^\d+$' or (d->>'beneficiaries')::numeric>(d->>'enrolled')::numeric)) then raise exception 'validation: invalid comparable baseline';end if;
 if coalesce(d->>'state','')='' or coalesce(d->>'district','')='' or coalesce(d->>'academicYear','')='' or coalesce(d->>'population','')='' or d->>'sourceUrl' !~ '^https?://' or (d->>'enrolled')::numeric<0 then raise exception 'validation: baseline source/cohort required';end if;
 perform pilot_private.put('baselines',extensions.gen_random_uuid()::text,d||jsonb_build_object('importedAt',now(),'synthetic',false));count_sent:=count_sent+1;end loop;result:=jsonb_build_object('count',count_sent);
 elsif action='broadcast' then
 if coalesce(payload->>'title','')='' or coalesce(payload->>'body','')='' or payload->>'audience' not in ('all','students','institution','state','district','deficiency') or ac.role not in ('admin','institution','nodal') then raise exception 'validation: audience required';end if;
 for x in select id from public.pilot_accounts where active and role='student' and (ac.role='admin' or (ac.role='institution' and institution_id=ac.institution_id) or (ac.role='nodal' and state=ac.state)) and (payload->>'audience'='all' or (payload->>'audience'='students' and role='student') or (payload->>'audience'='institution' and institution_id=payload->>'institutionId') or (payload->>'audience'='state' and state=payload->>'state') or (payload->>'audience'='district' and exists(select 1 from public.pilot_students s where s.id=pilot_accounts.id::text and s.data->>'domicileDistrict'=payload->>'district')) or (payload->>'audience'='deficiency' and exists(select 1 from public.pilot_applications a where a.data->>'studentId'=pilot_accounts.id::text and a.data->>'status'='deficiency'))) loop perform pilot_private.notice(x.id::text,payload->>'title',payload->>'body','info');count_sent:=count_sent+1;end loop;result:=jsonb_build_object('count',count_sent);
 else
 if old is null then raise exception 'validation: target required';end if;
 if t='applications' then aid:=rid;app:=old;elsif old->>'applicationId' is not null then aid:=old->>'applicationId';select data into app from public.pilot_applications where id=aid for update;end if;
 if t='documents' then
 select a.id,a.data into aid,app from public.pilot_applications a where a.data->>'status'<>'draft' and pilot_private.document_in_application(rid,a.id,a.data) and (ac.role='admin' or (ac.role='institution' and ac.institution_id=a.data->'profileSnapshot'->>'institutionId') or (ac.role='nodal' and ac.state=a.data->'profileSnapshot'->>'domicileState')) order by a.id limit 1;
 if app is null and exists(select 1 from public.pilot_applications a where a.data->>'status'<>'draft' and pilot_private.document_in_application(rid,a.id,a.data)) then raise exception 'forbidden: submitted document scope';end if;
 end if;
 student:=coalesce(app->>'studentId',old->>'studentId');
 if student is null or not exists(select 1 from public.pilot_accounts s where s.id::text=student and (ac.role='admin' or (ac.role='student' and student=actor::text) or (ac.role='institution' and ac.institution_id=coalesce(app->'profileSnapshot'->>'institutionId',s.institution_id)) or (ac.role='nodal' and ac.state=coalesce(app->'profileSnapshot'->>'domicileState',s.state)))) then raise exception 'forbidden: record scope';end if;
 status:=app->>'status';
 if action='submit_application' then
 if status<>'draft' then raise exception 'validation: draft stage required';end if;
 select data into profile from public.pilot_students where id=student for share;
 select data into scheme from public.pilot_schemes where id=app->>'schemeId' for share;
 if profile is null or scheme->>'active'<>'true' or scheme->>'academicYear'<>app->>'academicYear' or (scheme->>'deadline')::date<current_date then raise exception 'validation: profile or open scheme required';end if;
 evidence:='{}';
 for required in select jsonb_array_elements_text(scheme->'requiredDocs') loop
 select data into doc from public.pilot_documents where id in (select jsonb_array_elements_text(app->'documentIds')) and data->>'type'=required and data->>'studentId'=student order by data->>'uploadedAt' desc limit 1;
 if doc is null then raise exception 'validation: required document missing: %',required;end if;
 evidence:=evidence||coalesce(doc->'fields','{}');
 end loop;
 -- shortcut: attestations are self-declared in the pilot, use signed evidence integration before production.
 evidence:=coalesce(app->'evidence','{}')||evidence;
 d:='[]';
 for rule in select value from jsonb_array_elements(scheme->'rules') loop
 val:=case when rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
 pass:=false;
 if val is not null then
 if rule->>'op'='max' then pass:=val::numeric<=(rule->>'threshold')::numeric;elsif rule->>'op'='min' then pass:=val::numeric>=(rule->>'threshold')::numeric;else pass:=coalesce(rule->'allowedValues' ? val,false);end if;
 end if;
 d:=d||jsonb_build_array(jsonb_build_object('ruleId',rule->>'id','passed',pass,'actual',val));
 if not pass then raise exception 'validation: eligibility failed: %',rule->>'id';end if;end loop;
 receipt:=encode(extensions.gen_random_bytes(24),'hex');
 result:=pilot_private.put('applications',aid,app||jsonb_build_object('status','institute_stage','submittedAt',now(),'profileSnapshot',profile,'documentSnapshot',(select jsonb_agg(jsonb_build_object('id',z.id,'data',z.data)) from public.pilot_documents z where z.id in(select jsonb_array_elements_text(app->'documentIds'))),'ruleSnapshot',scheme,'eligibility',jsonb_build_object('eligible',true,'rules',d),'receiptToken',receipt,'receiptHash',encode(extensions.digest(jsonb_build_object('applicationId',aid,'profile',profile,'scheme',scheme,'documents',app->'documentIds')::text,'sha256'),'hex')));
 elsif action='review_document' then
 if old->>'status' is distinct from 'unverified' then raise exception 'validation: reviewed documents are immutable; upload a new version';end if;
 if payload ? 'fields' then
 if jsonb_typeof(payload->'fields') is distinct from 'object' then raise exception 'validation: reviewed fields object required';end if;
 for required in select jsonb_object_keys(payload->'fields') loop
 if required <> 'name' and not required=any(case old->>'type'
 when 'st_certificate' then array['dob','tribe','certificateNo','issueDate']
 when 'income_certificate' then array['income','familyIncome','certificateNo','issueDate']
 when 'domicile' then array['state','district','certificateNo','issueDate']
 when 'marksheet' then array['marks','attendance','institution','issueDate']
 when 'admission_proof' then array['admission','institution','issueDate']
 when 'research_proposal' then array['institution','noOtherFellowship']
 when 'bank_passbook' then array['accountLast4','ifsc']
 when 'aadhaar' then array['dob','aadhaarLast4'] else array[]::text[] end) then raise exception 'validation: field not allowed for this document: %',required;end if;
 if jsonb_typeof(payload->'fields'->required) not in ('string','number') then raise exception 'validation: reviewed field must be text or number';end if;
 if required in ('marks','attendance','income','familyIncome') and (jsonb_typeof(payload->'fields'->required) is distinct from 'number' or (payload->'fields'->>required)::numeric<0 or (required in ('marks','attendance') and (payload->'fields'->>required)::numeric>100)) then raise exception 'validation: reviewed numeric field outside range';end if;
 if required in ('admission','noOtherFellowship') and payload->'fields'->>required not in ('yes','no') then raise exception 'validation: reviewed declaration must be yes/no';end if;
 if required in ('dob','issueDate') and payload->'fields'->>required !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'validation: reviewed date must be ISO';end if;
 end loop;
 end if;
 if old->>'type' in ('marksheet','admission_proof','research_proposal') and ac.role not in ('institution','admin') or old->>'type' not in ('marksheet','admission_proof','research_proposal') and ac.role not in ('nodal','admin') then raise exception 'forbidden: document review role';end if;
 if payload->>'status' not in ('verified','mismatch') or coalesce(payload->>'reason','')='' then raise exception 'validation: review status and reason';end if;
 result:=pilot_private.put(t,rid,old||jsonb_build_object('status',payload->>'status','reviewReason',payload->>'reason','reviewerId',actor,'fields',coalesce(payload->'fields',old->'fields','{}')));
 elsif action in ('run_verification','review_verification') then
 if status not in ('institute_stage','department_stage','deficiency') then raise exception 'validation: active human review stage required';end if;
 source:=coalesce(payload->>'source',old->>'source');
 if source not in ('identity','st_certificate','income','institution','academic') or (source in ('institution','academic') and ac.role not in ('institution','admin')) or (source in ('identity','st_certificate','income') and ac.role not in ('nodal','admin')) then raise exception 'forbidden: verification source role';end if;
 if action='review_verification' and (payload->>'state' not in ('verified','mismatch') or coalesce(payload->>'reason','')='') then raise exception 'validation: explicit review required';end if;
 result:=pilot_private.put('verifications',extensions.gen_random_uuid()::text,jsonb_build_object('applicationId',aid,'source',source,'state',case when action='run_verification' then case when payload->>'sourceDown'='true' then 'source_down' else 'manual_review' end else payload->>'state' end,'reason',case when action='run_verification' then 'SIMULATED connector: human review required' else payload->>'reason' end,'runId',coalesce(old->>'runId',extensions.gen_random_uuid()::text),'createdAt',clock_timestamp(),'reviewerId',case when action='review_verification' then actor end,'simulated',true));
 elsif action='raise_deficiency' then
 if (payload->>'documentType' in ('marksheet','admission_proof','research_proposal') and ac.role not in ('institution','admin')) or (payload->>'documentType' not in ('marksheet','admission_proof','research_proposal') and ac.role not in ('nodal','admin')) then raise exception 'forbidden: deficiency review role';end if;
 if status not in ('institute_stage','department_stage','deficiency') or coalesce(payload->>'reason','')='' or (payload->>'deadline')::date<current_date or not exists(select 1 from public.pilot_documents where id in(select jsonb_array_elements_text(app->'documentIds')) and data->>'type'=payload->>'documentType') then raise exception 'validation: deficiency document/stage/deadline';end if;
 result:=pilot_private.put('deficiencies',extensions.gen_random_uuid()::text,jsonb_build_object('applicationId',aid,'documentType',payload->>'documentType','reason',payload->>'reason','deadline',payload->>'deadline','raisedBy',actor,'status','open'));
 perform pilot_private.put('applications',aid,app||jsonb_build_object('status','deficiency','returnStage',coalesce(app->>'returnStage',status)));
 elsif action='correct_deficiency' then
 if old->>'status'<>'open' or status<>'deficiency' then raise exception 'validation: open deficiency required';end if;
 select data into doc from public.pilot_documents where id=payload->>'documentId';
 if doc is null or doc->>'studentId'<>actor::text or doc->>'type'<>old->>'documentType' or doc->>'status'<>'unverified' then raise exception 'validation: new unverified correction required';end if;
 result:=pilot_private.put('deficiencies',rid,old||jsonb_build_object('status','corrected','correctionDocumentId',payload->>'documentId'));
 source:=case old->>'documentType' when 'marksheet' then 'academic' when 'admission_proof' then 'institution' when 'research_proposal' then 'academic' when 'aadhaar' then 'identity' when 'income_certificate' then 'income' else 'st_certificate' end;
 perform pilot_private.put('verifications',extensions.gen_random_uuid()::text,jsonb_build_object('applicationId',aid,'source',source,'state','pending','reason','Correction changed evidence; new human review required','runId',extensions.gen_random_uuid()::text,'createdAt',clock_timestamp(),'simulated',true));
 elsif action in ('approve_institute','approve_department','sanction') then
 if exists(select 1 from public.pilot_deficiencies f where f.data->>'applicationId'=aid and (f.data->>'status'='open' or (f.data->>'status'='corrected' and not exists(select 1 from public.pilot_documents z where z.id=f.data->>'correctionDocumentId' and z.data->>'status'='verified')))) then raise exception 'validation: unresolved deficiencies';end if;
 for x in select * from public.pilot_deficiencies where data->>'applicationId'=aid and data->>'status'='corrected' loop
 perform pilot_private.put('deficiencies',x.id,x.data||jsonb_build_object('status','resolved'));
 app:=jsonb_set(app,'{documentIds}',(select jsonb_agg(v) from (select v from jsonb_array_elements_text(app->'documentIds') v where not exists(select 1 from public.pilot_documents z where z.id=v and z.data->>'type'=x.data->>'documentType') union select x.data->>'correctionDocumentId') q));
 end loop;
 status:=case when status='deficiency' then app->>'returnStage' else status end;
 if action='approve_institute' then
 if ac.role not in ('institution','admin') or status<>'institute_stage' then raise exception 'forbidden: institute stage';end if;
 required:='academic,institution';
 elsif action='approve_department' then
 if ac.role not in ('nodal','admin') or status<>'department_stage' then raise exception 'forbidden: department stage';end if;required:='academic,institution,identity,st_certificate,income';
 else if ac.role not in ('nodal','admin') or status<>'department_stage' or app->>'departmentApproved' is distinct from 'true' then raise exception 'forbidden: approved department stage';end if;required:='academic,institution,identity,st_certificate,income';end if;
 for source in select unnest(string_to_array(required,',')) loop
 if source<>'' and (select v.data->>'state' from public.pilot_verifications v where v.data->>'applicationId'=aid and v.data->>'source'=source order by v.data->>'createdAt' desc,v.id desc limit 1) is distinct from 'verified' then raise exception 'validation: human verification required: %',source;end if;end loop;
 for doc in select z.data from public.pilot_documents z where z.id in(select jsonb_array_elements_text(app->'documentIds')) loop
 if (action='sanction' or (action='approve_institute' and doc->>'type' in ('marksheet','admission_proof','research_proposal')) or (action='approve_department' and doc->>'type' not in ('marksheet','admission_proof','research_proposal'))) and doc->>'status' is distinct from 'verified' then raise exception 'validation: human document review required: %',doc->>'type';end if;
 end loop;
 if action in ('approve_department','sanction') then
 -- shortcut: missing reviewed fields retain human-approved declarations; require certified extraction before production.
 evidence:=coalesce(app->'evidence','{}');
 for doc in select z.data from public.pilot_documents z where z.id in(select jsonb_array_elements_text(app->'documentIds')) and z.data->>'status'='verified' order by z.data->>'uploadedAt' loop
 evidence:=evidence||coalesce(doc->'fields','{}');
 if doc->>'type'='income_certificate' and doc->'fields' ? 'income' then evidence:=evidence||jsonb_build_object('familyIncome',doc->'fields'->'income');end if;
 end loop;
 profile:=app->'profileSnapshot';scheme:=app->'ruleSnapshot';
 for rule in select value from jsonb_array_elements(scheme->'rules') loop
 val:=case when evidence ? (rule->>'field') or rule->>'field' in ('marks','attendance','admission','noOtherFellowship') then evidence->>(rule->>'field') when rule->>'field'='isPVTG' then case when profile->>'isPVTG'='true' then 'yes' else 'no' end else profile->>(rule->>'field') end;
 pass:=false;
 if val is not null then if rule->>'op'='max' then pass:=val::numeric<=(rule->>'threshold')::numeric;elsif rule->>'op'='min' then pass:=val::numeric>=(rule->>'threshold')::numeric;else pass:=coalesce(rule->'allowedValues' ? val,false);end if;end if;
 if not pass then raise exception 'validation: reviewed eligibility failed: %',rule->>'id';end if;
 end loop;
 end if;
 if action='approve_institute' then d:=app||jsonb_build_object('status','department_stage');elsif action='approve_department' then d:=app||jsonb_build_object('status','department_stage','departmentApproved',true);else
 if payload->>'signaturePath' not like actor::text||'/%' or not exists(select 1 from storage.objects where bucket_id='pilot-signatures' and name=payload->>'signaturePath') then raise exception 'validation: signature upload required';end if;
 d:=app||jsonb_build_object('status','sanctioned','signaturePath',payload->>'signaturePath','sanctionedAmount',app->'ruleSnapshot'->'sanctionAmount');end if;
 result:=pilot_private.put('applications',aid,d-'returnStage');
 elsif action='reject_application' then
 if (ac.role='institution' and coalesce(app->>'returnStage',status)<>'institute_stage') or (ac.role='nodal' and coalesce(app->>'returnStage',status)<>'department_stage') then raise exception 'forbidden: rejection stage role';end if;
 if status not in ('institute_stage','department_stage','deficiency') or coalesce(payload->>'reason','')='' then raise exception 'validation: review stage and rejection reason required';end if;
 result:=pilot_private.put('applications',aid,app||jsonb_build_object('status','rejected','rejectionReason',payload->>'reason'));
 elsif action='request_payment' then
 if ac.role not in ('nodal','admin') or status<>'sanctioned' or coalesce(app->>'dbtStatus','') in ('pending','successful') then raise exception 'validation: payable sanctioned application required';end if;
 result:=pilot_private.put('payments',extensions.gen_random_uuid()::text,jsonb_build_object('applicationId',aid,'amount',app->'sanctionedAmount','status','pending','simulated',true,'createdAt',now()));perform pilot_private.put('applications',aid,app||jsonb_build_object('dbtStatus','pending'));
 elsif action='payment_result' then
 if ac.role not in ('nodal','admin') or old->>'status' is distinct from 'pending' or status<>'sanctioned' or app->>'dbtStatus' is distinct from 'pending' or payload->>'status' not in ('successful','failed') then raise exception 'validation: pending simulated payment required';end if;
 result:=pilot_private.put('payments',rid,old||jsonb_build_object('status',payload->>'status','transactionId','SIMULATED-'||rid,'reason',coalesce(payload->>'reason','SIMULATED payment result')));
 d:=app||jsonb_build_object('dbtStatus',payload->>'status');if payload->>'status'='successful' then d:=d||jsonb_build_object('status','disbursed','disbursedAmount',old->'amount');end if;perform pilot_private.put('applications',aid,d);
 elsif action='update_grievance' then
 if ac.role='student' and payload ? 'status' or ac.role not in ('student','nodal','admin','institution') then raise exception 'forbidden: grievance update';end if;
 d:=old;
 if payload ? 'assignedTo' then if ac.role not in ('admin','nodal') or not exists(select 1 from public.pilot_accounts where id::text=payload->>'assignedTo' and active and (role='admin' or (role='institution' and institution_id=(select s.institution_id from public.pilot_accounts s where s.id::text=student)) or (role='nodal' and state=(select s.state from public.pilot_accounts s where s.id::text=student)))) then raise exception 'forbidden: grievance assignment';end if;d:=d||jsonb_build_object('assignedTo',payload->>'assignedTo');end if;
 if payload ? 'status' then if payload->>'status' not in ('in_review','resolved') or (payload->>'status'='resolved' and coalesce(payload->>'resolutionReason','')='') then raise exception 'validation: resolution reason';end if;d:=d||jsonb_build_object('status',payload->>'status','resolutionReason',payload->>'resolutionReason');end if;
 if coalesce(payload->>'body','')<>'' then d:=d||jsonb_build_object('messages',coalesce(old->'messages','[]')||jsonb_build_array(jsonb_build_object('actorId',actor,'body',payload->>'body','createdAt',now())));end if;result:=pilot_private.put(t,rid,d);
 elsif action='add_note' then
 if coalesce(payload->>'body','')='' then raise exception 'validation: note body';end if;result:=pilot_private.put('notes',extensions.gen_random_uuid()::text,jsonb_build_object('applicationId',aid,'actorId',actor,'body',payload->>'body','createdAt',now()));
 else raise exception 'validation: unknown action';end if;
 if student is not null then perform pilot_private.notice(student,'Application update',replace(action,'_',' '),'info');end if;
 end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',coalesce(result->>'id',rid,actor::text),'studentId',coalesce(student,case when ac.role='student' then actor::text end),'applicationId',aid,'scopeSnapshot',jsonb_build_object('institutionId',app->'profileSnapshot'->>'institutionId','domicileState',app->'profileSnapshot'->>'domicileState'),'createdAt',now()));
 update pilot_private.operations set result=command_block.result where actor_id=actor and pilot_private.operations.operation_id=pilot_command.operation_id;
 return result;
end $$;
revoke all on all functions in schema pilot_private from public,anon,authenticated;
grant usage on schema pilot_private to authenticated;
grant execute on function pilot_private.account(),pilot_private.scope(text) to authenticated;
revoke all on function public.pilot_command(uuid,text,jsonb,jsonb,text) from public,anon,authenticated;
grant execute on function public.pilot_command(uuid,text,jsonb,jsonb,text) to service_role;
create function pilot_private.application_scope(d jsonb) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.pilot_accounts a where a.id=auth.uid() and a.active and (a.role='admin' or (a.role='student' and a.id::text=d->>'studentId') or (a.role='institution' and a.institution_id=coalesce(d->'profileSnapshot'->>'institutionId',(select s.institution_id from public.pilot_accounts s where s.id::text=d->>'studentId'))) or (a.role='nodal' and a.state=coalesce(d->'profileSnapshot'->>'domicileState',(select s.state from public.pilot_accounts s where s.id::text=d->>'studentId'))))) $$;
revoke all on function pilot_private.application_scope(jsonb) from public,anon;
grant execute on function pilot_private.application_scope(jsonb) to authenticated;
create function pilot_private.document_in_application(rid text,aid text,d jsonb) returns boolean language sql stable security definer set search_path='' as $$ select coalesce(d->'documentIds' ? rid,false) or coalesce(d->'documentSnapshot' @> jsonb_build_array(jsonb_build_object('id',rid)),false) or exists(select 1 from public.pilot_deficiencies f where f.data->>'applicationId'=aid and f.data->>'correctionDocumentId'=rid) $$;
revoke all on function pilot_private.document_in_application(text,text,jsonb) from public,anon,authenticated;
create function pilot_private.document_scope(rid text,d jsonb) returns boolean language sql stable security definer set search_path='' as $$
 select ((pilot_private.account()).role='student' and d->>'studentId'=auth.uid()::text) or exists(select 1 from public.pilot_applications a where a.data->>'status'<>'draft' and pilot_private.document_in_application(rid,a.id,a.data) and pilot_private.application_scope(a.data)) or (not exists(select 1 from public.pilot_applications a where a.data->>'status'<>'draft' and pilot_private.document_in_application(rid,a.id,a.data)) and pilot_private.scope(d->>'studentId')) $$;
revoke all on function pilot_private.document_scope(text,jsonb) from public,anon;
grant execute on function pilot_private.document_scope(text,jsonb) to authenticated;
drop policy document_read on public.pilot_documents;
create policy document_read on public.pilot_documents for select to authenticated using(pilot_private.document_scope(id,data));
drop policy scoped_download on storage.objects;
create policy scoped_download on storage.objects for select to authenticated using((pilot_private.account()).active and bucket_id in ('pilot-documents','pilot-signatures') and ((storage.foldername(name))[1]=auth.uid()::text or (bucket_id='pilot-documents' and exists(select 1 from public.pilot_documents d where d.data->>'objectPath'=name and pilot_private.document_scope(d.id,d.data))) or (bucket_id='pilot-signatures' and exists(select 1 from public.pilot_applications a where a.data->>'signaturePath'=name and pilot_private.application_scope(a.data)))));
drop policy application_read on public.pilot_applications;
create policy application_read on public.pilot_applications for select to authenticated using(pilot_private.application_scope(data));
do $$ declare t text;begin foreach t in array array['deficiencies','verifications','payments','notes'] loop
 execute format('drop policy scoped_read on public.pilot_%I',t);
 execute format('create policy scoped_read on public.pilot_%I for select to authenticated using (exists(select 1 from public.pilot_applications a where a.id=pilot_%I.data->>''applicationId'' and pilot_private.application_scope(a.data)))',t,t);
end loop;end $$;
create function public.pilot_reminders() returns integer language plpgsql security definer set search_path='' as $$ declare x record; rid text; n integer:=0;begin
 for x in select f.id,a.data->>'studentId' student from public.pilot_deficiencies f join public.pilot_applications a on a.id=f.data->>'applicationId' where f.data->>'status'='open' and (f.data->>'deadline')::date between current_date and current_date+3 loop
 rid:='reminder:'||x.id||':'||current_date;
 insert into public.pilot_notifications(id,data) values(rid,jsonb_build_object('userId',x.student,'title','Deficiency deadline reminder','body','An open deficiency is due within three days.','category','deadline','createdAt',now())) on conflict do nothing;
 if found then n:=n+1;end if;end loop;return n;end $$;
revoke all on function public.pilot_reminders() from public,anon,authenticated;
grant execute on function public.pilot_reminders() to service_role;
grant all on all tables in schema public to service_role;
create function public.pilot_provision(actor uuid,account_id uuid,account_email text,account_name text,account_role text,institution text,domicile text) returns public.pilot_accounts language plpgsql security definer set search_path='' as $$ declare result public.pilot_accounts;begin
 if not exists(select 1 from public.pilot_accounts where id=actor and active and role='admin') then raise exception 'forbidden: active admin required';end if;
 if account_role not in ('student','institution','nodal','admin','family') or account_email is null or coalesce(account_name,'')='' or (account_role='institution' and not exists(select 1 from public.pilot_institutions where id=institution)) or (account_role='nodal' and coalesce(domicile,'')='') then raise exception 'validation: invalid invitation scope';end if;
 insert into public.pilot_accounts(id,email,name,role,institution_id,state) values(account_id,account_email,account_name,account_role,case when account_role='institution' then institution end,case when account_role='nodal' then domicile end) returning * into result;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action','invite_account','entityId',account_id,'createdAt',now()));return result;end $$;
revoke all on function public.pilot_provision(uuid,uuid,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.pilot_provision(uuid,uuid,text,text,text,text,text) to service_role;





drop policy audit_read on public.pilot_audit;
create policy audit_read on public.pilot_audit for select to authenticated using((pilot_private.account()).role='admin' or ((pilot_private.account()).role in ('institution','nodal') and pilot_private.application_scope(jsonb_build_object('studentId',data->>'studentId','profileSnapshot',data->'scopeSnapshot'))));
do $$ begin
 if exists(select 1 from pg_extension where extname='pg_cron') then
 execute 'select cron.schedule(''pilot-deficiency-reminders'',''0 3 * * *'',''select public.pilot_reminders();'')';
 else raise notice 'Pilot reminders not scheduled: enable pg_cron, then run supabase/schedule-reminders.sql';
 end if;
end $$;










