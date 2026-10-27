-- Service-only, atomic counters shared by all Edge instances.
create table pilot_private.rate_limits (
  bucket text not null,
  subject text not null,
  window_started timestamptz not null,
  requests integer not null check (requests > 0),
  primary key (bucket, subject)
);
alter table pilot_private.rate_limits enable row level security;
revoke all on pilot_private.rate_limits from public, anon, authenticated;

create function public.pilot_rate_limit(p_bucket text, p_subject text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  cap integer;
  seconds integer;
  started timestamptz := clock_timestamp();
  stamp timestamptz;
  total integer;
begin
  cap := case p_bucket when 'workflow' then 120 when 'invite' then 10 when 'receipt' then 120 end;
  seconds := case p_bucket when 'invite' then 3600 else 60 end;
  if cap is null or p_subject is null or
     (p_bucket = 'receipt' and p_subject <> 'public') or
     (p_bucket <> 'receipt' and p_subject !~ '^[0-9a-f-]{36}$') then
    raise exception 'validation: invalid rate-limit bucket or subject';
  end if;
  insert into pilot_private.rate_limits as counters(bucket, subject, window_started, requests)
  values (p_bucket, p_subject, started, 1)
  on conflict (bucket, subject) do update set
    requests = case when counters.window_started <= started - make_interval(secs => seconds)
      then 1 else least(counters.requests + 1, cap + 1) end,
    window_started = case when counters.window_started <= started - make_interval(secs => seconds)
      then started else counters.window_started end
  returning window_started, requests into stamp, total;
  return jsonb_build_object('allowed', total <= cap, 'remaining', greatest(cap - total, 0),
    'retryAfter', greatest(1, ceil(extract(epoch from stamp + make_interval(secs => seconds) - started))::integer));
end;
$$;
revoke all on function public.pilot_rate_limit(text, text) from public, anon, authenticated;
grant execute on function public.pilot_rate_limit(text, text) to service_role;
