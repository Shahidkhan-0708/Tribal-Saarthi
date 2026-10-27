-- Append-only notes can share an application lock; decisions still require an exclusive lock.
do $$ declare source text; needle text;begin
 source:=pg_get_functiondef('pilot_private.command_base(uuid,text,jsonb,jsonb,text)'::regprocedure);
 needle:='execute format(''select data,version from public.pilot_%I where id=$1 for update'',t) into x using rid;';
 if position(needle in source)=0 then raise exception 'Command lock source mismatch';end if;
 source:=replace(source,needle,'if action=''add_note'' then execute format(''select data,version from public.pilot_%I where id=$1 for share'',t) into x using rid;else '||needle||'end if;');
 execute source;
end $$;

create table pilot_private.job_runs(
 id uuid primary key default extensions.gen_random_uuid(),kind text not null check(kind in ('backup','monitor','emails')),
 run_key text not null,status text not null check(status in ('running','succeeded','failed')),
 started_at timestamptz not null default now(),finished_at timestamptz,detail jsonb not null default '{}'
);
alter table pilot_private.job_runs enable row level security;
revoke all on pilot_private.job_runs from public,anon,authenticated;
create index job_runs_recent on pilot_private.job_runs(kind,started_at desc);
create unique index job_runs_once on pilot_private.job_runs(kind,run_key) where status<>'failed';

create function public.pilot_job_claim(p_kind text,p_key text) returns jsonb language plpgsql security definer set search_path='' as $$
declare r pilot_private.job_runs;begin
 if p_kind not in ('backup','monitor','emails') or p_key is null or p_key !~ '^[a-zA-Z0-9:T._-]{1,100}$' then raise exception 'validation: job kind/key';end if;
 if not pg_try_advisory_xact_lock(hashtext('pilot-job-'||p_kind)) then return null;end if;
 update pilot_private.job_runs set status='failed',finished_at=now(),detail='{"code":"worker_timeout"}' where kind=p_kind and status='running' and started_at<now()-interval '10 minutes';
 if exists(select 1 from pilot_private.job_runs where kind=p_kind and status='running') then return null;end if;
 insert into pilot_private.job_runs(kind,run_key,status) values(p_kind,p_key,'running') on conflict do nothing returning * into r;
 if r.id is null then return null;end if;
 return jsonb_build_object('id',r.id,'startedAt',r.started_at);
end $$;

create function public.pilot_job_finish(p_id uuid,p_status text,p_detail jsonb) returns void language plpgsql security definer set search_path='' as $$
declare r pilot_private.job_runs; previous pilot_private.job_runs; a record;begin
 if p_status not in ('succeeded','failed') or jsonb_typeof(p_detail) is distinct from 'object' or coalesce(p_detail->>'code','') !~ '^[a-z0-9_]{1,80}$' or exists(select 1 from jsonb_object_keys(p_detail)k where k not in ('code','objects','tables','bytes','backupPrefix','processed')) then raise exception 'validation: safe job outcome';end if;
 select * into r from pilot_private.job_runs where id=p_id and status='running' for update;
 if not found then raise exception 'conflict: job already finished';end if;
 select * into previous from pilot_private.job_runs where kind=r.kind and id<>r.id and finished_at is not null order by finished_at desc limit 1;
 update pilot_private.job_runs set status=p_status,detail=p_detail,finished_at=now() where id=p_id;
 if (p_status='failed' and (previous.status is distinct from 'failed' or previous.detail->>'code' is distinct from p_detail->>'code')) or (p_status='succeeded' and previous.status='failed') or (r.kind='backup' and p_status='succeeded') then
  for a in select id from public.pilot_accounts where active and role='admin' loop
   perform pilot_private.notice(a.id::text,case when p_status='failed' then 'Pilot operations need attention' else 'Pilot operations recovered / backup saved' end,r.kind||': '||p_status||' ('||(p_detail->>'code')||'). Review Configuration > Operations.','operations');
  end loop;
 end if;
end $$;

create function public.pilot_operations_status() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;begin
 if (pilot_private.account()).role is distinct from 'admin' then raise exception 'forbidden: operations administrator required';end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'kind',kind,'status',status,'startedAt',started_at,'finishedAt',finished_at,'detail',detail) order by started_at desc),'[]') into result from (select *,row_number() over(partition by kind order by started_at desc) n from pilot_private.job_runs)r where n<=10;
 return result;
end $$;

create function public.pilot_job_health() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare reminder_failed boolean:=false;begin
 if to_regclass('cron.job_run_details') is not null then
  execute 'select exists(select 1 from cron.job j cross join lateral(select status from cron.job_run_details d where d.jobid=j.jobid order by runid desc limit 1)r where j.active and j.jobname like ''%reminder%'' and r.status=''failed'')' into reminder_failed;
 end if;
 return jsonb_build_object('backupFresh',exists(select 1 from pilot_private.job_runs where kind='backup' and status='succeeded' and finished_at>now()-interval '36 hours'),'failedJobs',(select count(*) from(select distinct on(kind) status from pilot_private.job_runs where kind<>'monitor' order by kind,started_at desc)r where status='failed'),'reminderFailed',reminder_failed);
end $$;

create function public.pilot_backup_snapshot() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare r record; tables jsonb:='{}'; rows jsonb; columns jsonb;begin
 -- shortcut: whole snapshots suit synthetic staging; move to managed streaming backups before the 20 MB snapshot limit.
 for r in select t.table_schema,t.table_name from information_schema.tables t where t.table_type='BASE TABLE' and t.table_schema in ('auth','pilot_private','public') and (t.table_schema<>'public' or t.table_name like 'pilot_%') and t.table_name<>'schema_migrations' order by 1,2 loop
  execute format('select coalesce(jsonb_agg(to_jsonb(t)),''[]''::jsonb) from %I.%I t',r.table_schema,r.table_name) into rows;
  tables:=tables||jsonb_build_object(r.table_schema||'.'||r.table_name,rows);
 end loop;
 select jsonb_agg(jsonb_build_object('table_schema',c.table_schema,'table_name',c.table_name,'column_name',c.column_name,'is_generated',c.is_generated,'is_identity',c.is_identity) order by c.table_schema,c.table_name,c.ordinal_position) into columns from information_schema.columns c where tables ? (c.table_schema||'.'||c.table_name);
 return jsonb_build_object('at',now(),'data',tables,'columns',columns,'objects',coalesce((select jsonb_agg(jsonb_build_object('bucket',bucket_id,'path',name)) from storage.objects where bucket_id in ('pilot-documents','pilot-signatures')),'[]'::jsonb));
end $$;

revoke all on function public.pilot_job_claim(text,text),public.pilot_job_finish(uuid,text,jsonb),public.pilot_backup_snapshot(),public.pilot_job_health() from public,anon,authenticated;
grant execute on function public.pilot_job_claim(text,text),public.pilot_job_finish(uuid,text,jsonb),public.pilot_backup_snapshot(),public.pilot_job_health() to service_role;
revoke all on function public.pilot_operations_status() from public,anon;
grant execute on function public.pilot_operations_status() to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('pilot-backups','pilot-backups',false,22000000,array['application/octet-stream']);

-- Missing provider configuration must not consume the five real-send retry attempts.
do $$ declare source text;begin
 source:=pg_get_functiondef('public.pilot_claim_email()'::regprocedure);
 if position('jsonb_array_length(data->''attempts'')<5' in source)=0 then raise exception 'Email claim source mismatch';end if;
 source:=replace(source,'jsonb_array_length(data->''attempts'')<5','(select count(*) from jsonb_array_elements(data->''attempts'') a where a->>''code'' is distinct from ''provider_not_configured'')<5');
 execute source;
end $$;
