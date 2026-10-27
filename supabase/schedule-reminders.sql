-- Run once as database owner after enabling Cron in the Supabase Dashboard.
-- The stable job name updates the existing schedule when rerun.
select cron.schedule('pilot-deficiency-reminders','0 3 * * *','select public.pilot_reminders();');
select jobid,jobname,schedule,active from cron.job where jobname='pilot-deficiency-reminders';
