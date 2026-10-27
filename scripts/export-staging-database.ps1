param([ValidatePattern('^[a-z0-9][a-z0-9-]{2,80}$')][string]$SnapshotName='track-b-release')
$ErrorActionPreference='Stop'
. './scripts/supabase-management.ps1'
if(-not(Test-Path -LiteralPath '.staging/config.json')){throw 'Private staging configuration missing'}
$taskConfig=Get-Content -LiteralPath '.staging/config.json' -Raw | ConvertFrom-Json
if($taskConfig.name -ne 'tribe-saarthi-staging' -or $taskConfig.projectRef -notmatch '^[a-z]{20}$'){throw 'Dedicated staging source required'}
$taskProject=Invoke-TaskSupabaseApi -Method GET -Path "/v1/projects/$($taskConfig.projectRef)"
if($taskProject.name -ne $taskConfig.name -or $taskProject.organization_id -ne $taskConfig.organizationId){throw 'Provider staging metadata mismatch'}
$taskDirectory=Join-Path (Join-Path (Get-Location) '.staging/backups') $SnapshotName
if(Test-Path -LiteralPath (Join-Path $taskDirectory 'database.json')){throw 'Snapshot already exists; choose a new name to preserve accepted backup evidence'}
New-Item -Path $taskDirectory -ItemType Directory -Force | Out-Null
$taskColumns=Invoke-TaskSupabaseApi -Method POST -Path "/v1/projects/$($taskConfig.projectRef)/database/query" -Body @{query="select c.table_schema,c.table_name,c.column_name,c.is_generated,c.is_identity from information_schema.columns c join information_schema.tables t on t.table_schema=c.table_schema and t.table_name=c.table_name where t.table_type='BASE TABLE' and c.table_schema in ('auth','pilot_private','public') and (c.table_schema<>'public' or c.table_name like 'pilot_%') order by c.table_schema,c.table_name,c.ordinal_position"}
$taskGroups=@($taskColumns | Where-Object {$_.table_name -ne 'schema_migrations'} | Group-Object table_schema,table_name)
$taskParts=@()
foreach($taskGroup in $taskGroups){
  $taskSchema=$taskGroup.Group[0].table_schema
  $taskTable=$taskGroup.Group[0].table_name
  if($taskSchema -notmatch '^[a-z_]+$' -or $taskTable -notmatch '^[a-z_]+$'){throw 'Unexpected database identifier'}
  $taskParts+="select '$taskSchema.$taskTable' as table_name,coalesce((select jsonb_agg(to_jsonb(t)) from $taskSchema.$taskTable t),'[]'::jsonb) as table_rows"
}
$taskSql='select jsonb_object_agg(table_name,table_rows) as backup from ('+($taskParts -join ' union all ')+') task_export'
$taskResult=Invoke-TaskSupabaseApi -Method POST -Path "/v1/projects/$($taskConfig.projectRef)/database/query" -Body @{query=$taskSql}
$taskData=$taskResult[0].backup
if(-not $taskData){throw 'Database export returned no snapshot'}
$taskCleanColumns=@($taskColumns | ForEach-Object {[pscustomobject]@{table_schema=[string]$_.table_schema;table_name=[string]$_.table_name;column_name=[string]$_.column_name;is_generated=[string]$_.is_generated;is_identity=[string]$_.is_identity}})
$taskSnapshot=@{sourceRef=$taskConfig.projectRef;at=(Get-Date).ToUniversalTime().ToString('o');columns=$taskCleanColumns;data=$taskData}
$taskJson=$taskSnapshot | ConvertTo-Json -Depth 100 -Compress
[IO.File]::WriteAllText((Join-Path $taskDirectory 'database.json'),$taskJson,(New-Object System.Text.UTF8Encoding($false)))
(Get-FileHash -LiteralPath (Join-Path $taskDirectory 'database.json') -Algorithm SHA256).Hash | Set-Content -LiteralPath (Join-Path $taskDirectory 'database.sha256') -Encoding ASCII
Write-Output "Private logical database snapshot saved: $($taskGroups.Count) tables. Auth UUIDs/password hashes retained; no file bytes included."
