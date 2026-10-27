$ErrorActionPreference='Stop'
. './scripts/supabase-management.ps1'
foreach($taskFile in @('.staging/config.json','.staging/email-provider.env')){if(-not(Test-Path -LiteralPath $taskFile)){throw 'Private email setup files are missing'}}
$taskConfig=Get-Content -LiteralPath '.staging/config.json' -Raw | ConvertFrom-Json
if($taskConfig.name -ne 'tribe-saarthi-staging' -or $taskConfig.projectRef -notmatch '^[a-z]{20}$'){throw 'Dedicated staging project required'}
$taskValues=@{}
foreach($taskLine in Get-Content -LiteralPath '.staging/email-provider.env'){
 if(-not $taskLine.Trim() -or $taskLine.Trim().StartsWith('#')){continue}
 if($taskLine -notmatch '^(BREVO_API_KEY|PILOT_EMAIL_SENDER)=(.*)$' -or $taskValues.ContainsKey($Matches[1])){throw 'Only one BREVO_API_KEY and PILOT_EMAIL_SENDER are allowed'}
 $taskValues[$Matches[1]]=$Matches[2].Trim()
}
if(-not $taskValues.BREVO_API_KEY -or $taskValues.BREVO_API_KEY.Length -lt 20 -or $taskValues.BREVO_API_KEY -match '[\x00-\x20]'){throw 'Enter the Brevo API key in .staging/email-provider.env locally; never paste it into chat'}
if($taskValues.PILOT_EMAIL_SENDER -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$'){throw 'Enter the verified sender email in the private provider file'}
$taskProject=Invoke-TaskSupabaseApi -Method GET -Path "/v1/projects/$($taskConfig.projectRef)"
if($taskProject.name -ne $taskConfig.name -or $taskProject.organization_id -ne $taskConfig.organizationId){throw 'Provider staging metadata mismatch'}
$taskSavedToken=$env:SUPABASE_ACCESS_TOKEN
try{
 Remove-Item Env:SUPABASE_ACCESS_TOKEN -ErrorAction SilentlyContinue
 $taskProcess=Start-Process -FilePath (Get-Command supabase).Source -ArgumentList @('secrets','set','--project-ref',$taskConfig.projectRef,'--env-file','.staging/email-provider.env') -WindowStyle Hidden -Wait -PassThru -RedirectStandardOutput '.staging/email-provider-apply.log' -RedirectStandardError '.staging/email-provider-error.log'
 if($taskProcess.ExitCode -ne 0){throw 'Email provider configuration failed; inspect private logs'}
}finally{if($null -ne $taskSavedToken){$env:SUPABASE_ACCESS_TOKEN=$taskSavedToken}}
Write-Output 'Critical-email provider settings applied. The five-minute worker will process due attempts; verify actual controlled-mailbox acceptance/delivery before closing the email gate.'
