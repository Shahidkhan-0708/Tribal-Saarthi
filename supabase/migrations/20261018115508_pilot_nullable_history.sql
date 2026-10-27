-- Older records can contain JSON null instead of absent/array history fields.
do $$ declare fn regprocedure; source text;begin
 foreach fn in array array['public.pilot_page(text,int,text)'::regprocedure,'public.pilot_grievance_history(text,text,int)'::regprocedure,'public.pilot_snapshot(jsonb)'::regprocedure] loop
  source:=pg_get_functiondef(fn);
  source:=replace(source,$find$jsonb_array_elements(data->''messages'')$find$,$safe$jsonb_array_elements(case when jsonb_typeof(data->''messages'')=''array'' then data->''messages'' else ''[]''::jsonb end)$safe$);
  source:=replace(source,$find$jsonb_array_elements(data->''events'')$find$,$safe$jsonb_array_elements(case when jsonb_typeof(data->''events'')=''array'' then data->''events'' else ''[]''::jsonb end)$safe$);
  source:=replace(source,'jsonb_array_elements(data->''messages'')','jsonb_array_elements(case when jsonb_typeof(data->''messages'')=''array'' then data->''messages'' else ''[]''::jsonb end)');
  source:=replace(source,'jsonb_array_elements(data->''events'')','jsonb_array_elements(case when jsonb_typeof(data->''events'')=''array'' then data->''events'' else ''[]''::jsonb end)');
  source:=replace(source,'jsonb_array_elements(d->kind)','jsonb_array_elements(case when jsonb_typeof(d->kind)=''array'' then d->kind else ''[]''::jsonb end)');
  source:=replace(source,'jsonb_array_length(d->kind)','jsonb_array_length(case when jsonb_typeof(d->kind)=''array'' then d->kind else ''[]''::jsonb end)');
  source:=replace(source,'jsonb_array_elements_text(g->''data''->''evidenceIds'')','jsonb_array_elements_text(case when jsonb_typeof(g->''data''->''evidenceIds'')=''array'' then g->''data''->''evidenceIds'' else ''[]''::jsonb end)');
  execute source;
 end loop;
end $$;
