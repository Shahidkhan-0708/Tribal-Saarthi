do $$ declare policy record;begin
 for policy in select policyname,tablename,qual from pg_policies where schemaname='public' and policyname in ('account_read','delivery_read','notification_read','grant_read') loop
  execute format('alter policy %I on public.%I using (%s)',policy.policyname,policy.tablename,replace(replace(policy.qual,'auth.uid()','(select auth.uid())'),'pilot_private.account()','(select pilot_private.account())'));
 end loop;
end $$;
