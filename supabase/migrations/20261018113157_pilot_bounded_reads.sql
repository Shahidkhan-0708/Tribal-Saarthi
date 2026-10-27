create function public.pilot_page(dataset text,page_number int default 0,search_text text default '') returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare expression text; result jsonb;begin
 if dataset not in ('students','schemes','institutions','documents','applications','deficiencies','verifications','grievances','grievance_categories','deliveries','scheme_drafts','configuration_history','notifications','family_grants','payments','baselines','notes','accounts','consents','consent_events','privacy_policies') or page_number not between 0 and 100000 or length(search_text)>100 or search_text is null then raise exception 'validation: invalid page request';end if;
 expression:=case when dataset='accounts' then 'to_jsonb(t)' when dataset='grievances' then 'to_jsonb(t)||jsonb_build_object(''data'',data||jsonb_build_object(''messages'',coalesce((select jsonb_agg(v) from (select value v from jsonb_array_elements(data->''messages'') with ordinality x(value,n) order by n desc limit 50) q),''[]''::jsonb),''events'',coalesce((select jsonb_agg(v) from (select value v from jsonb_array_elements(data->''events'') with ordinality x(value,n) order by n desc limit 50) q),''[]''::jsonb),''historyPaged'',true))' else 'to_jsonb(t)' end;
 -- shortcut: bounded offset pages suit the small pilot; replace with keyset cursors if measured deep-page latency exceeds the budget.
 execute format('select jsonb_build_object(''items'',coalesce(jsonb_agg(row order by n) filter(where n<=50),''[]''::jsonb),''hasMore'',coalesce(bool_or(n>50),false)) from (select %s row,row_number() over() n from (select * from public.pilot_%I where $1='''' or position(lower($1) in lower(id::text||'' ''||%s))>0 order by id limit 51 offset $2) t) p',expression,dataset,case when dataset='accounts' then 'name||'' ''||email' else 'coalesce(data->>''name'',data->>''title'',data->>''subject'',data->>''studentId'',data->>''applicationId'',data->>''purpose'','''')' end) into result using search_text,page_number*50;
 return result||jsonb_build_object('page',page_number,'search',search_text);
end $$;
revoke all on function public.pilot_page(text,int,text) from public,anon;
grant execute on function public.pilot_page(text,int,text) to authenticated;

create function public.pilot_context(application_ids text[]) returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare result jsonb;begin
 if application_ids is null or cardinality(application_ids)>50 then raise exception 'validation: bounded application context required';end if;
 with apps as materialized(select * from public.pilot_applications where id=any(application_ids)),docs as (select * from public.pilot_documents where id in(select jsonb_array_elements_text(data->'documentIds') from apps) union select * from(select distinct on(data->>'type') * from public.pilot_documents where data->>'studentId'=(select auth.uid())::text order by data->>'type',data->>'uploadedAt' desc,id desc) latest),verifications as(select distinct on(data->>'applicationId',data->>'source') * from public.pilot_verifications where data->>'applicationId'=any(application_ids) order by data->>'applicationId',data->>'source',data->>'createdAt' desc,id desc)
 select jsonb_build_object('documents',coalesce((select jsonb_agg(d) from(select * from docs order by id limit 501)d),'[]'::jsonb),'schemes',coalesce((select jsonb_agg(s) from public.pilot_schemes s where id in(select data->>'schemeId' from apps)),'[]'::jsonb),'students',coalesce((select jsonb_agg(s) from public.pilot_students s where id in(select data->>'studentId' from apps) or id=(select auth.uid())::text),'[]'::jsonb),'verifications',coalesce((select jsonb_agg(v) from verifications v),'[]'::jsonb)) into result;
 if jsonb_array_length(result->'documents')>500 then raise exception 'validation: application context too large; narrow the application search';end if;return result;
end $$;
revoke all on function public.pilot_context(text[]) from public,anon;
grant execute on function public.pilot_context(text[]) to authenticated;

create function public.pilot_metrics() returns jsonb language sql stable security invoker set search_path='' as $$
with yr as (select case when count(distinct data->>'academicYear')=1 then min(data->>'academicYear') end y from public.pilot_schemes where data->>'active'='true'),apps as materialized(select * from public.pilot_applications where (select y from yr) is null or data->>'academicYear'=(select y from yr)),beneficiaries as(select distinct data->>'studentId' id from apps where data->>'status'='disbursed'),cohorts as(select data->>'domicileState' state,data->>'domicileDistrict' district,count(*) students,count(*) filter(where data->>'isPVTG'='true') pvtg,count(*) filter(where id in(select id from beneficiaries)) beneficiaries from public.pilot_students group by 1,2),districts as(select c.*,b.data baseline,coalesce((select y from yr) is not null and b.data->>'synthetic'='false' and b.data->>'population'='pilot enrolled ST students' and (b.data->>'enrolled')::numeric=c.students and c.students>0,false) comparable from cohorts c left join lateral(select data from public.pilot_baselines where data->>'state'=c.state and data->>'district'=c.district and data->>'academicYear'=(select y from yr) order by data->>'importedAt' desc,id desc limit 1)b on true),pvtg as(select data->>'tribe' tribe,data->>'domicileDistrict' district,count(*) count from public.pilot_students where data->>'isPVTG'='true' group by 1,2)
select jsonb_build_object('students',(select count(*) from public.pilot_students),'applications',(select count(*) from apps),'allApplications',(select count(*) from public.pilot_applications),'beneficiaries',(select count(*) from beneficiaries),'disbursedAmount',(select coalesce(sum((data->>'disbursedAmount')::numeric),0) from apps where data->>'status'='disbursed'),'openDeficiencies',(select count(*) from public.pilot_deficiencies where data->>'status'='open'),'simulatedPayments',(select coalesce(sum((data->>'amount')::numeric),0) from public.pilot_payments where data->>'status'='successful'),'funnel',(select jsonb_agg(jsonb_build_object('status',status,'count',(select count(*) from apps where data->>'status'=status))) from unnest(array['draft','submitted','institute_stage','department_stage','deficiency','sanctioned','disbursed','rejected','withdrawn','appealed'])status),'districts',coalesce((select jsonb_agg(to_jsonb(d)||jsonb_build_object('academicYear',(select y from yr),'coverageRate',case when comparable then beneficiaries::numeric/students end,'unreached',case when comparable then greatest(0,students-beneficiaries) end)) from(select * from districts order by state,district limit 1000)d),'[]'::jsonb),'pvtg',coalesce((select jsonb_agg(p) from(select * from pvtg order by tribe,district limit 1000)p),'[]'::jsonb),'groupsTruncated',(select count(*)>1000 from districts) or (select count(*)>1000 from pvtg));
$$;
revoke all on function public.pilot_metrics() from public,anon;
grant execute on function public.pilot_metrics() to authenticated;

create function public.pilot_broadcast_preview(audience text,district text default '') returns jsonb language plpgsql stable security definer set search_path='' as $$
declare ac public.pilot_accounts; result jsonb;begin
 ac:=pilot_private.account();if ac.role is null or ac.role not in ('institution','nodal','admin') then raise exception 'forbidden: officer required';end if;
 if audience not in ('all','district','deficiency') or district is null or length(district)>200 then raise exception 'validation: audience required';end if;
 select jsonb_build_object('count',count(*)) into result from public.pilot_students s join public.pilot_accounts a on a.id::text=s.id and a.active where pilot_private.scope(s.id) and (audience='all' or audience='district' and s.data->>'domicileDistrict'=district or audience='deficiency' and exists(select 1 from public.pilot_applications p join public.pilot_deficiencies d on d.data->>'applicationId'=p.id where p.data->>'studentId'=s.id and d.data->>'status'='open'));
 return result;
end $$;
revoke all on function public.pilot_broadcast_preview(text,text) from public,anon;
grant execute on function public.pilot_broadcast_preview(text,text) to authenticated;
create index pilot_verification_latest on public.pilot_verifications((data->>'applicationId'),(data->>'source'),(data->>'createdAt') desc,id desc);
create index pilot_document_latest on public.pilot_documents((data->>'studentId'),(data->>'type'),(data->>'uploadedAt') desc,id desc);
create index pilot_deficiency_application on public.pilot_deficiencies((data->>'applicationId'),(data->>'status'),id);
create index pilot_baseline_latest on public.pilot_baselines((data->>'state'),(data->>'district'),(data->>'academicYear'),(data->>'importedAt') desc,id desc);

create function public.pilot_family_page(page_number int default 0) returns jsonb language plpgsql stable security definer set search_path='' as $$ declare result jsonb;begin
 if page_number not between 0 and 100000 then raise exception 'validation: invalid page';end if;
 with apps as materialized(select * from public.pilot_applications a where (pilot_private.account()).role='family' and exists(select 1 from public.pilot_family_grants g where g.data->>'familyUserId'=auth.uid()::text and g.data->>'studentId'=a.data->>'studentId' and g.data->>'active'='true') order by id limit 51 offset page_number*50),visible as(select * from apps order by id limit 50),payments as(select p.* from public.pilot_payments p join visible a on a.id=p.data->>'applicationId' order by p.id limit 250)
 select jsonb_build_object('page',page_number,'hasMore',(select count(*)>50 from apps),'applications',coalesce((select jsonb_agg(jsonb_build_object('id',id,'version',version,'data',jsonb_build_object('studentId',data->>'studentId','schemeId',data->>'schemeId','academicYear',data->>'academicYear','status',data->>'status','submittedAt',data->>'submittedAt','sanctionedAmount',data->'sanctionedAmount','disbursedAmount',data->'disbursedAmount','dbtStatus',data->>'dbtStatus'))) from visible),'[]'::jsonb),'payments',coalesce((select jsonb_agg(jsonb_build_object('id',id,'version',version,'data',data-'reason'-'transactionId')) from payments),'[]'::jsonb)) into result;return result;
end $$;
revoke all on function public.pilot_family_page(int) from public,anon;
grant execute on function public.pilot_family_page(int) to authenticated;

create function public.pilot_grievance_history(grievance_id text,kind text,page_number int default 0) returns jsonb language plpgsql stable security invoker set search_path='' as $$ declare d jsonb;begin
 if kind not in ('events','messages') or page_number not between 0 and 100000 then raise exception 'validation: invalid history request';end if;
 select data into d from public.pilot_grievances where id=grievance_id;if d is null then raise exception 'forbidden: grievance unavailable';end if;
 return jsonb_build_object('items',coalesce((select jsonb_agg(v) from(select value v from jsonb_array_elements(d->kind) with ordinality x(value,n) order by n desc limit 50 offset page_number*50)q),'[]'::jsonb),'hasMore',coalesce(jsonb_array_length(d->kind),0)>(page_number+1)*50);
end $$;
revoke all on function public.pilot_grievance_history(text,text,int) from public,anon;
grant execute on function public.pilot_grievance_history(text,text,int) to authenticated;

do $$ declare source text;begin
 source:=pg_get_functiondef('pilot_private.configuration_command(uuid,text,jsonb,jsonb)'::regprocedure);
 source:=replace(source,'for s in select * from public.pilot_students order by id loop',
 'if coalesce(payload->>''page'',''0'') !~ ''^[0-9]{1,6}$'' or coalesce((payload->>''page'')::int,0)>100000 then raise exception ''validation: invalid dry-run page'';end if;
 for s in select * from public.pilot_students order by id limit 50 offset coalesce((payload->>''page'')::int,0)*50 loop');
 source:=replace(source,'result:=jsonb_build_object(''cohort'',cohort,''draftVersion'',draft.version);','result:=jsonb_build_object(''cohort'',cohort,''draftVersion'',draft.version,''page'',coalesce((payload->>''page'')::int,0),''hasMore'',(select count(*) from public.pilot_students)>(coalesce((payload->>''page'')::int,0)+1)*50);');
 execute source;
end $$;
