drop policy scoped_read on public.pilot_notes;
create policy scoped_read on public.pilot_notes for select to authenticated using (
 (select (pilot_private.account()).role in ('institution','nodal','admin'))
 and exists (
  select 1 from public.pilot_applications a
  where a.id=pilot_notes.data->>'applicationId' and pilot_private.application_scope(a.data)
 )
);
