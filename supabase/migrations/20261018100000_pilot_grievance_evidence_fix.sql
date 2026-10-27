do $migration$ declare source text;begin
 source:=pg_get_functiondef('pilot_private.grievance_command(uuid,text,jsonb,jsonb)'::regprocedure);
 execute replace(source,$before$coalesce(d->'evidenceIds','[]')||payload->'evidenceIds'$before$,$after$coalesce(d->'evidenceIds','[]')||(payload->'evidenceIds')$after$);
end $migration$;
