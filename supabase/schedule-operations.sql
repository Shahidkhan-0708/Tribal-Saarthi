create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;
create extension if not exists supabase_vault with schema vault;
do $$ begin
 if not exists(select 1 from vault.decrypted_secrets where name='pilot_operations_url') or not exists(select 1 from vault.decrypted_secrets where name='pilot_operations_token') then raise exception 'Configure private operations Vault secrets first';end if;
end $$;
select cron.schedule('pilot-encrypted-backup','15 2 * * *',$job$
 select net.http_post(url:=(select decrypted_secret from vault.decrypted_secrets where name='pilot_operations_url'),headers:=jsonb_build_object('Content-Type','application/json','x-pilot-operations-token',(select decrypted_secret from vault.decrypted_secrets where name='pilot_operations_token')),body:='{"job":"backup"}'::jsonb,timeout_milliseconds:=120000);
$job$);
select cron.schedule('pilot-health-monitor','*/5 * * * *',$job$
 select net.http_post(url:=(select decrypted_secret from vault.decrypted_secrets where name='pilot_operations_url'),headers:=jsonb_build_object('Content-Type','application/json','x-pilot-operations-token',(select decrypted_secret from vault.decrypted_secrets where name='pilot_operations_token')),body:='{"job":"monitor"}'::jsonb,timeout_milliseconds:=60000);
$job$);
select cron.schedule('pilot-email-processor','*/5 * * * *',$job$
 select net.http_post(url:=(select decrypted_secret from vault.decrypted_secrets where name='pilot_operations_url'),headers:=jsonb_build_object('Content-Type','application/json','x-pilot-operations-token',(select decrypted_secret from vault.decrypted_secrets where name='pilot_operations_token')),body:='{"job":"emails"}'::jsonb,timeout_milliseconds:=120000);
$job$);
