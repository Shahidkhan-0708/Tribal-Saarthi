param([ValidatePattern('^[a-z0-9][a-z0-9-]{2,80}$')][string]$SnapshotName='track-b-release')
$ErrorActionPreference='Stop'
$taskSnapshotDirectory=Join-Path '.staging/backups' $SnapshotName
$taskDatabaseFile=Join-Path $taskSnapshotDirectory 'database.json'
$taskHashFile=Join-Path $taskSnapshotDirectory 'database.sha256'
. './scripts/supabase-management.ps1'
foreach($taskPath in @('.staging/restore.json',$taskDatabaseFile,$taskHashFile)){
  if(-not(Test-Path -LiteralPath $taskPath)){throw "Missing $taskPath"}
}
$taskExpectedHash=(Get-Content -LiteralPath $taskHashFile -Raw).Trim()
if((Get-FileHash -LiteralPath $taskDatabaseFile -Algorithm SHA256).Hash -ne $taskExpectedHash){throw 'Database snapshot checksum mismatch'}
$taskTarget=Get-Content -LiteralPath '.staging/restore.json' -Raw | ConvertFrom-Json
$taskSnapshot=Get-Content -LiteralPath $taskDatabaseFile -Raw | ConvertFrom-Json
if($taskTarget.name -ne 'tribe-saarthi-restore' -or $taskTarget.projectRef -eq $taskSnapshot.sourceRef){throw 'Separate restore target required'}
$taskProject=Invoke-TaskSupabaseApi -Method GET -Path "/v1/projects/$($taskTarget.projectRef)"
if($taskProject.name -ne $taskTarget.name -or $taskProject.organization_id -ne $taskTarget.organizationId){throw 'Provider restore target mismatch'}
$taskForeignKeys=Invoke-TaskSupabaseApi -Method POST -Path "/v1/projects/$($taskTarget.projectRef)/database/query" -Body @{query="select n.nspname||'.'||t.relname as child,rn.nspname||'.'||r.relname as parent from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace join pg_class r on r.oid=c.confrelid join pg_namespace rn on rn.oid=r.relnamespace where c.contype='f' and n.nspname in ('auth','public','pilot_private')"}
$taskColumnsMetadata=if($taskSnapshot.columns.value){$taskSnapshot.columns.value}else{$taskSnapshot.columns}
$taskGroups=@($taskColumnsMetadata | Where-Object {$_.table_name -ne 'schema_migrations'} | Group-Object table_schema,table_name)
$taskRemaining=New-Object 'System.Collections.Generic.List[object]'
$taskOrdered=New-Object 'System.Collections.Generic.List[object]'
foreach($taskGroup in $taskGroups){
  $taskName=$taskGroup.Group[0].table_schema+'.'+$taskGroup.Group[0].table_name
  if(@($taskSnapshot.data.$taskName).Count){$taskRemaining.Add($taskGroup)}
}
# Restore through normal constraints; hosted postgres cannot disable replication triggers.
while($taskRemaining.Count){
  $taskProgress=$false
  foreach($taskGroup in @($taskRemaining.ToArray())){
    $taskName=$taskGroup.Group[0].table_schema+'.'+$taskGroup.Group[0].table_name
    $taskPendingNames=@($taskRemaining | ForEach-Object {$_.Group[0].table_schema+'.'+$_.Group[0].table_name})
    $taskDependencies=@($taskForeignKeys | Where-Object {$_.child -eq $taskName -and $_.parent -ne $taskName -and $_.parent -in $taskPendingNames})
    if(-not $taskDependencies.Count){$taskOrdered.Add($taskGroup); $taskRemaining.Remove($taskGroup) | Out-Null; $taskProgress=$true}
  }
  if(-not $taskProgress){throw 'Cyclic populated tables require a reviewed native restore; no SQL was applied'}
}
$taskSql=@('do $staging_restore$ declare x record; begin')
foreach($taskGroup in $taskOrdered){
  $taskSchema=$taskGroup.Group[0].table_schema; $taskTable=$taskGroup.Group[0].table_name
  if($taskSchema -notmatch '^[a-z_]+$' -or $taskTable -notmatch '^[a-z_]+$'){throw "Invalid table identifier ($taskSchema.$taskTable)"}
  $taskColumns=@($taskGroup.Group | Where-Object {$_.is_generated -eq 'NEVER'} | ForEach-Object {if($_.column_name -notmatch '^[a-z_0-9]+$'){throw 'Invalid column identifier'}; '"'+$_.column_name+'"'}) -join ','
  $taskRows=@($taskSnapshot.data."$taskSchema.$taskTable")
  $taskJson=ConvertTo-Json -InputObject $taskRows -Depth 100 -Compress
  $taskEncoded=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($taskJson))
  $taskOverride=if(@($taskGroup.Group | Where-Object {$_.is_identity -eq 'YES'}).Count){' overriding system value'}else{''}
  $taskSql+="insert into $taskSchema.$taskTable($taskColumns)$taskOverride select $taskColumns from jsonb_populate_recordset(null::$taskSchema.$taskTable,convert_from(decode('$taskEncoded','base64'),'UTF8')::jsonb);"
}
$taskSql+=@'
 for x in select table_schema,table_name,column_name,pg_get_serial_sequence(format('%I.%I',table_schema,table_name),column_name) seq from information_schema.columns where table_schema in ('auth','public','pilot_private') and (is_identity='YES' or column_default like 'nextval(%') loop
  if x.seq is not null then execute format('select setval(%L::regclass,coalesce((select max(%I) from %I.%I),0)+1,false)',x.seq,x.column_name,x.table_schema,x.table_name);end if;
 end loop;
end $staging_restore$;
'@
[IO.File]::WriteAllText((Join-Path (Get-Location) (Join-Path $taskSnapshotDirectory 'database-restore.sql')),($taskSql -join "`n"),(New-Object System.Text.UTF8Encoding($false)))
Write-Output "Prepared atomic SQL for $($taskOrdered.Count) populated staging tables in foreign-key order. No database writes performed."
