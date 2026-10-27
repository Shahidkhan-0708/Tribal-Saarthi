create function public.pilot_snapshot(requests jsonb) returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare dataset text; options jsonb; pages jsonb:='{}'; ids text[]; context jsonb; evidence jsonb;begin
 if jsonb_typeof(requests) is distinct from 'object' or (select count(*) from jsonb_object_keys(requests))>22 or not requests ? 'applications' then raise exception 'validation: bounded snapshot requests required';end if;
 for dataset,options in select * from jsonb_each(requests) loop
  pages:=pages||jsonb_build_object(dataset,public.pilot_page(dataset,coalesce((options->>'page')::int,0),coalesce(options->>'search','')));
 end loop;
 select coalesce(array_agg(r->>'id'),array[]::text[]) into ids from jsonb_array_elements(pages->'applications'->'items')r;
 context:=public.pilot_context(ids);
 select coalesce(jsonb_agg(d),'[]'::jsonb) into evidence from(select * from public.pilot_documents where id in(select jsonb_array_elements_text(g->'data'->'evidenceIds') from jsonb_array_elements(pages->'grievances'->'items')g) order by id limit 500)d;
 context:=jsonb_set(context,'{documents}',(context->'documents')||evidence);
 return jsonb_build_object('pages',pages,'context',context,'metrics',public.pilot_metrics());
end $$;
revoke all on function public.pilot_snapshot(jsonb) from public,anon;
grant execute on function public.pilot_snapshot(jsonb) to authenticated;

do $$ declare source text;needle text;begin
 source:=pg_get_functiondef('public.pilot_context(text[])'::regprocedure);needle:='''verifications'',coalesce((select jsonb_agg(v) from verifications v)';
 if position(needle in source)=0 then raise exception 'Context migration source mismatch';end if;
 source:=replace(source,needle,'''institutions'',coalesce((select jsonb_agg(i) from public.pilot_institutions i where id in(select data->''profileSnapshot''->>''institutionId'' from apps union select data->>''institutionId'' from public.pilot_students where id=(select auth.uid())::text)),''[]''::jsonb),''deficiencies'',coalesce((select jsonb_agg(d) from(select * from public.pilot_deficiencies where data->>''applicationId''=any(application_ids) and data->>''status'' in (''open'',''corrected'') order by id limit 500)d),''[]''::jsonb),''payments'',coalesce((select jsonb_agg(p) from(select distinct on(data->>''applicationId'') * from public.pilot_payments where data->>''applicationId''=any(application_ids) order by data->>''applicationId'',data->>''createdAt'' desc,id desc)p),''[]''::jsonb),''verifications'',coalesce((select jsonb_agg(v) from verifications v)');execute source;
end $$;
