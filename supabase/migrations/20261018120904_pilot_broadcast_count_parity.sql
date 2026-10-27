create or replace function public.pilot_broadcast_preview(audience text,district text default '') returns jsonb language plpgsql stable security definer set search_path='' as $$
declare ac public.pilot_accounts; result jsonb;begin
 ac:=pilot_private.account();if ac.role is null or ac.role not in ('institution','nodal','admin') then raise exception 'forbidden: officer required';end if;
 if coalesce(audience,'') not in ('all','district','deficiency') or district is null or length(district)>200 then raise exception 'validation: audience required';end if;
 -- Match the command's recipient predicate, including invited students without a profile.
 select jsonb_build_object('count',count(*)) into result from public.pilot_accounts a where a.active and a.role='student' and (ac.role='admin' or ac.role='institution' and a.institution_id=ac.institution_id or ac.role='nodal' and a.state=ac.state) and (audience='all' or audience='district' and exists(select 1 from public.pilot_students s where s.id=a.id::text and s.data->>'domicileDistrict'=district) or audience='deficiency' and exists(select 1 from public.pilot_applications p where p.data->>'studentId'=a.id::text and p.data->>'status'='deficiency'));
 return result;
end $$;
