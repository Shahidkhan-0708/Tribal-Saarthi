$ErrorActionPreference='Stop'
. './scripts/supabase-management.ps1'
if(-not(Test-Path -LiteralPath '.staging/config.json')){throw 'Private staging configuration missing'}
$taskConfig=Get-Content -LiteralPath '.staging/config.json' -Raw | ConvertFrom-Json
if($taskConfig.name -ne 'tribe-saarthi-staging' -or $taskConfig.projectRef -notmatch '^[a-z]{20}$'){throw 'Dedicated staging target required'}
$taskProject=Invoke-TaskSupabaseApi -Method GET -Path "/v1/projects/$($taskConfig.projectRef)"
if($taskProject.name -ne $taskConfig.name -or $taskProject.organization_id -ne $taskConfig.organizationId){throw 'Provider target mismatch'}
if(-not(Test-Path -LiteralPath '.staging/operations.json')){
 $taskCrypto=[Security.Cryptography.RandomNumberGenerator]::Create()
 $taskBytes=New-Object byte[] 64;$taskCrypto.GetBytes($taskBytes);$taskCrypto.Dispose()
 $taskHex=([BitConverter]::ToString($taskBytes)).Replace('-','').ToLowerInvariant()
 $taskKeys=@{projectRef=$taskConfig.projectRef;backupKey=$taskHex.Substring(0,64);token=$taskHex.Substring(64);createdAt=(Get-Date).ToUniversalTime().ToString('o')}
 [IO.File]::WriteAllText((Join-Path (Get-Location) '.staging/operations.json'),($taskKeys|ConvertTo-Json),(New-Object Text.UTF8Encoding($false)))
}
$taskKeys=Get-Content -LiteralPath '.staging/operations.json' -Raw | ConvertFrom-Json
if($taskKeys.projectRef -ne $taskConfig.projectRef -or $taskKeys.backupKey -notmatch '^[0-9a-f]{64}$' -or $taskKeys.token -notmatch '^[0-9a-f]{64}$'){throw 'Invalid existing operations keys; refusing rotation'}
$taskAcl=New-Object Security.AccessControl.FileSecurity;$taskAcl.SetAccessRuleProtection($true,$false)
$taskAllowedSids=@([Security.Principal.WindowsIdentity]::GetCurrent().User.Value,'S-1-5-18','S-1-5-32-544')
foreach($taskSid in $taskAllowedSids){
 $taskRule=New-Object Security.AccessControl.FileSystemAccessRule((New-Object Security.Principal.SecurityIdentifier($taskSid)),'FullControl','Allow');$taskAcl.AddAccessRule($taskRule)
}
$taskEnv="PILOT_OPERATIONS_TOKEN=$($taskKeys.token)`nPILOT_BACKUP_KEY=$($taskKeys.backupKey)`nPILOT_BACKUP_BUCKET=pilot-backups`nPILOT_MONITOR_URL=$($taskConfig.frontendUrl)`n"
[IO.File]::WriteAllText((Join-Path (Get-Location) '.staging/operations.env'),$taskEnv,(New-Object Text.UTF8Encoding($false)))
foreach($taskKeyFile in @('.staging/operations.json','.staging/operations.env')){
 $taskExistingAcl=Get-Acl -LiteralPath $taskKeyFile
 $taskUnexpected=@($taskExistingAcl.Access | Where-Object {$_.AccessControlType -eq 'Allow' -and $_.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value -notin $taskAllowedSids})
 if(-not $taskExistingAcl.AreAccessRulesProtected -or $taskUnexpected.Count){[IO.File]::SetAccessControl((Join-Path (Get-Location) $taskKeyFile),$taskAcl)}
 $taskVerifiedAcl=Get-Acl -LiteralPath $taskKeyFile
 if(-not $taskVerifiedAcl.AreAccessRulesProtected -or @($taskVerifiedAcl.Access | Where-Object {$_.AccessControlType -eq 'Allow' -and $_.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value -notin $taskAllowedSids}).Count){throw 'Operations key file access is not restricted to owner/SYSTEM/administrators'}
}
$taskSavedToken=$env:SUPABASE_ACCESS_TOKEN
try{
 Remove-Item Env:SUPABASE_ACCESS_TOKEN -ErrorAction SilentlyContinue
 $taskProcess=Start-Process -FilePath (Get-Command supabase).Source -ArgumentList @('secrets','set','--project-ref',$taskConfig.projectRef,'--env-file','.staging/operations.env') -WindowStyle Hidden -Wait -PassThru -RedirectStandardOutput '.staging/operations-secrets.log' -RedirectStandardError '.staging/operations-secrets-error.log'
 if($taskProcess.ExitCode -ne 0){throw 'Operations secret configuration failed; inspect private log'}
}finally{if($null -ne $taskSavedToken){$env:SUPABASE_ACCESS_TOKEN=$taskSavedToken}}
$taskSetup=@'
create extension if not exists supabase_vault with schema vault;
do $$ declare secret_id uuid;begin
 select id into secret_id from vault.secrets where name='pilot_operations_url';
 if secret_id is null then perform vault.create_secret('https://__REF__.supabase.co/functions/v1/pilot-operations','pilot_operations_url');else perform vault.update_secret(secret_id,'https://__REF__.supabase.co/functions/v1/pilot-operations');end if;
 select id into secret_id from vault.secrets where name='pilot_operations_token';
 if secret_id is null then perform vault.create_secret('__TOKEN__','pilot_operations_token');else perform vault.update_secret(secret_id,'__TOKEN__');end if;
end $$;
'@
$taskSetup=$taskSetup.Replace('__REF__',$taskConfig.projectRef).Replace('__TOKEN__',$taskKeys.token)
try{Invoke-TaskSupabaseApi -Method POST -Path "/v1/projects/$($taskConfig.projectRef)/database/query" -Body @{query=$taskSetup} | Out-Null}catch{throw 'Private operations Vault setup failed; inspect provider logs'}
if(-not(Test-Path -LiteralPath 'supabase/schedule-operations.sql')){throw 'Operations schedule missing'}
$taskSchedule=[IO.File]::ReadAllText((Join-Path (Get-Location) 'supabase/schedule-operations.sql'))
Invoke-TaskSupabaseApi -Method POST -Path "/v1/projects/$($taskConfig.projectRef)/database/query" -Body @{query=$taskSchedule} | Out-Null
Write-Output 'Configured daily encrypted backups and five-minute monitoring/email Cron. Recovery keys remain only in private staging files and server secrets.'
