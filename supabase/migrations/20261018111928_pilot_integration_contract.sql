create function public.pilot_verify(actor uuid,payload jsonb,target jsonb,operation_id text,adapter_result jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
<<verification>>
declare result jsonb; meta jsonb;begin
 if adapter_result->>'timestamp' is null or not isfinite((adapter_result->>'timestamp')::timestamptz) or coalesce(adapter_result->>'mode','') not in ('simulated','sandbox','live','unconfigured') or coalesce(adapter_result->>'state','') not in ('verified','mismatch','manual_review','source_down') or adapter_result->>'source' is distinct from payload->>'source' or adapter_result->>'requestId' is distinct from operation_id or coalesce(adapter_result->>'rawStatus','') !~ '^[a-z0-9_]{2,80}$' or (adapter_result->>'reference' is not null and (adapter_result->>'reference' !~ '^[a-zA-Z0-9_-]{8,100}$' or adapter_result->>'reference' ~ '^\d{10,}$')) then raise exception 'validation: invalid adapter metadata';end if;
 meta:=jsonb_build_object('source',adapter_result->>'source','mode',adapter_result->>'mode','timestamp',(adapter_result->>'timestamp')::timestamptz,'requestId',operation_id,'reference',adapter_result->>'reference','rawStatus',adapter_result->>'rawStatus');
 result:=public.pilot_command(actor,'run_verification',payload,target,operation_id);
 if result->'data' ? 'adapter' then return result;end if;
 -- Matching a provider response does not replace the pilot's human approval step.
 result:=pilot_private.put('verifications',result->>'id',(result->'data')||jsonb_build_object('adapter',meta,'state',case when adapter_result->>'state'='verified' then 'manual_review' else adapter_result->>'state' end,'simulated',adapter_result->>'mode'='simulated','reason',case when adapter_result->>'mode'='simulated' then 'SIMULATED connector: human review required' when adapter_result->>'state'='source_down' then 'Provider unavailable or not configured; review remains pending' else 'Provider response requires authorized human review' end));
 perform pilot_private.put('audit',extensions.gen_random_uuid()::text,jsonb_build_object('actorId',actor,'action','adapter_result','entityId',result->>'id','applicationId',result->'data'->>'applicationId','studentId',(select data->>'studentId' from public.pilot_applications where id=result->'data'->>'applicationId'),'detail',meta,'createdAt',now()));
 update pilot_private.operations set result=verification.result where actor_id=actor and pilot_private.operations.operation_id=pilot_verify.operation_id;
 return result;
end $$;
revoke all on function public.pilot_verify(uuid,jsonb,jsonb,text,jsonb) from public,anon,authenticated;
grant execute on function public.pilot_verify(uuid,jsonb,jsonb,text,jsonb) to service_role;
