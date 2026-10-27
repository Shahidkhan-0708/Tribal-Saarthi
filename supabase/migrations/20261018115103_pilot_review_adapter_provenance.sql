create function public.pilot_review(actor uuid,payload jsonb,target jsonb,operation_id text) returns jsonb language plpgsql security definer set search_path='' as $$
<<review>>
declare original jsonb; result jsonb;begin
 select data->'adapter' into original from public.pilot_verifications where id=target->>'id';
 result:=public.pilot_command(actor,'review_verification',payload,target,operation_id);
 if original is not null and not result->'data' ? 'adapter' then
  result:=pilot_private.put('verifications',result->>'id',(result->'data')||jsonb_build_object('adapter',original,'simulated',original->>'mode'='simulated'));
  update pilot_private.operations set result=review.result where actor_id=actor and pilot_private.operations.operation_id=pilot_review.operation_id;
 end if;
 return result;
end $$;
revoke all on function public.pilot_review(uuid,jsonb,jsonb,text) from public,anon,authenticated;
grant execute on function public.pilot_review(uuid,jsonb,jsonb,text) to service_role;
