-- Frontend parity: the officer service-testing screen can mark a simulated
-- connector unavailable for the whole pilot, and verification records that
-- outage instead of a result. Demo source health stays localStorage-only.
create table public.pilot_source_health(
  id text primary key,
  version integer not null default 1 check(version>0),
  data jsonb not null check(jsonb_typeof(data)='object')
);
alter table public.pilot_source_health enable row level security;
grant select on public.pilot_source_health to authenticated;
grant all on public.pilot_source_health to service_role;
create policy source_health_read on public.pilot_source_health for select to authenticated
  using((select (pilot_private.account()).active) and (select (pilot_private.account()).role) in ('institution','nodal','admin'));

create function pilot_private.parity_command(actor uuid,action text,payload jsonb,target jsonb) returns jsonb
language plpgsql set search_path='' as $$
declare ac public.pilot_accounts; app public.pilot_applications; result jsonb; ids jsonb; doc text; source text;
begin
 select * into ac from public.pilot_accounts where id=actor and active;
 if not found then raise exception 'forbidden: inactive account';end if;
 if action='set_source_health' then
  if ac.role<>'admin' then raise exception 'forbidden: administrator required';end if;
  source:=payload->>'source';
  if source is null or source not in ('identity','st_certificate','income','institution','academic') or jsonb_typeof(payload->'up') is distinct from 'boolean' then raise exception 'validation: verification source and up flag required';end if;
  result:=pilot_private.put('source_health',source,jsonb_build_object('source',source,'up',(payload->>'up')::boolean,'simulated',true,'changedAt',now(),'changedBy',actor));
 else raise exception 'validation: unknown action';end if;
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action',action,'entityId',result->>'id','detail',payload,'createdAt',now()));
 return result;
end $$;
revoke all on function pilot_private.parity_command(uuid,text,jsonb,jsonb) from public,anon,authenticated;

-- Keep the tested dispatcher intact; the parity actions are added in front of it.
do $$ begin
 execute replace(replace(pg_get_functiondef('public.pilot_command(uuid,text,jsonb,jsonb,text)'::regprocedure),
  'public.pilot_command(', 'pilot_private.command_extended('),
  'pilot_command.operation_id', 'command_extended.operation_id');
end $$;
revoke all on function pilot_private.command_extended(uuid,text,jsonb,jsonb,text) from public,anon,authenticated;

create or replace function public.pilot_command(actor uuid,action text,payload jsonb,target jsonb,operation_id text) returns jsonb
language plpgsql security definer set search_path='' as $$
<<parity>>
declare previous pilot_private.operations; digest text; result jsonb;begin
 if action not in ('set_source_health') then
  return pilot_private.command_extended(actor,action,payload,target,operation_id);
 end if;
 if not exists(select 1 from public.pilot_accounts where id=actor and active) then raise exception 'forbidden: inactive account';end if;
 if operation_id is null or length(operation_id) not between 8 and 160 or jsonb_typeof(payload) is distinct from 'object' then raise exception 'validation: invalid command';end if;
 digest:=encode(extensions.digest(jsonb_build_object('action',action,'payload',payload,'target',target)::text,'sha256'),'hex');
 insert into pilot_private.operations values(actor,operation_id,digest,null) on conflict do nothing;
 select * into previous from pilot_private.operations where actor_id=actor and pilot_private.operations.operation_id=pilot_command.operation_id for update;
 if previous.digest<>digest then raise exception 'conflict: operation key reused';end if;
 if previous.result is not null then return previous.result;end if;
 result:=pilot_private.parity_command(actor,action,payload,target);
 update pilot_private.operations set result=parity.result where actor_id=actor and pilot_private.operations.operation_id=pilot_command.operation_id;
 return result;
end $$;

-- A connector the operator marked unavailable must never produce a verification result.
create or replace function public.pilot_verify(actor uuid,payload jsonb,target jsonb,operation_id text,adapter_result jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
<<verification>>
declare result jsonb; meta jsonb;begin
 if adapter_result->>'timestamp' is null or not isfinite((adapter_result->>'timestamp')::timestamptz) or coalesce(adapter_result->>'mode','') not in ('simulated','sandbox','live','unconfigured') or coalesce(adapter_result->>'state','') not in ('verified','mismatch','manual_review','source_down') or adapter_result->>'source' is distinct from payload->>'source' or adapter_result->>'requestId' is distinct from operation_id or coalesce(adapter_result->>'rawStatus','') !~ '^[a-z0-9_]{2,80}$' or (adapter_result->>'reference' is not null and (adapter_result->>'reference' !~ '^[a-zA-Z0-9_-]{8,100}$' or adapter_result->>'reference' ~ '^\d{10,}$')) then raise exception 'validation: invalid adapter metadata';end if;
 if exists(select 1 from public.pilot_source_health h where h.id=adapter_result->>'source' and h.data->>'up'='false') then
  adapter_result:=adapter_result||jsonb_build_object('state','source_down','rawStatus','configured_source_down');
 end if;
 meta:=jsonb_build_object('source',adapter_result->>'source','mode',adapter_result->>'mode','timestamp',(adapter_result->>'timestamp')::timestamptz,'requestId',operation_id,'reference',adapter_result->>'reference','rawStatus',adapter_result->>'rawStatus');
 result:=public.pilot_command(actor,'run_verification',payload,target,operation_id);
 if result->'data' ? 'adapter' then return result;end if;
 -- Matching a provider response does not replace the pilot's human approval step.
 result:=pilot_private.put('verifications',result->>'id',(result->'data')||jsonb_build_object('adapter',meta,'state',case when adapter_result->>'state'='verified' then 'manual_review' else adapter_result->>'state' end,'simulated',adapter_result->>'mode'='simulated','reason',case when adapter_result->>'state'='source_down' then 'Source marked unavailable by the pilot operator; review remains pending' when adapter_result->>'mode'='simulated' then 'SIMULATED connector: human review required' else 'Provider response requires authorized human review' end));
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action','adapter_result','entityId',result->>'id','applicationId',result->'data'->>'applicationId','studentId',(select data->>'studentId' from public.pilot_applications where id=result->'data'->>'applicationId'),'detail',meta,'createdAt',now()));
 update pilot_private.operations set result=verification.result where actor_id=actor and pilot_private.operations.operation_id=pilot_verify.operation_id;
 return result;
end $$;
revoke all on function public.pilot_verify(uuid,jsonb,jsonb,text,jsonb) from public,anon,authenticated;
grant execute on function public.pilot_verify(uuid,jsonb,jsonb,text,jsonb) to service_role;
