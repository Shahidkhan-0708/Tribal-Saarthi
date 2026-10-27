$ErrorActionPreference = 'Stop'
foreach ($taskFile in @('.staging/config.json', '.staging/smtp.json')) {
  if (-not (Test-Path -LiteralPath $taskFile)) { throw "Missing private configuration: $taskFile" }
}
$taskConfig = Get-Content -LiteralPath '.staging/config.json' -Raw | ConvertFrom-Json
$taskMail = Get-Content -LiteralPath '.staging/smtp.json' -Raw | ConvertFrom-Json
if ($taskConfig.name -ne 'tribe-saarthi-staging' -or $taskConfig.projectRef -notmatch '^[a-z]{20}$') { throw 'Dedicated staging target required' }
if ($taskMail.host -ne 'smtp-relay.brevo.com' -or $taskMail.port -ne 587) { throw 'Expected Brevo SMTP on port 587' }
if (-not $taskMail.user -or -not $taskMail.password -or $taskMail.password.Length -lt 12) {
  throw 'Enter the Brevo SMTP login and SMTP key in .staging/smtp.json locally; never paste them into chat.'
}
if ($taskMail.senderEmail -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$' -or -not $taskMail.senderName) { throw 'Verified sender email/name required' }
$taskTokenOverride = $env:SUPABASE_ACCESS_TOKEN
try {
  # This workstation has a stale override; use its existing CLI login for this operation.
  Remove-Item Env:SUPABASE_ACCESS_TOKEN -ErrorAction SilentlyContinue
  $ErrorActionPreference = 'Continue'
  $taskRaw = supabase projects list 2> '.staging/smtp-project-check.log'
  $taskExit = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
  if ($taskExit -ne 0) { throw 'Cannot verify SMTP deployment target' }
  $taskProjects = ($taskRaw -join "`n") | ConvertFrom-Json
  $taskTarget = @($taskProjects.projects | Where-Object { $_.id -eq $taskConfig.projectRef -and $_.name -eq 'tribe-saarthi-staging' -and $_.organization_id -eq $taskConfig.organizationId })
  if ($taskTarget.Count -ne 1) { throw 'Provider project metadata does not match dedicated staging' }
  $taskDirectory = Join-Path (Get-Location) '.staging/smtp-deploy/supabase'
  New-Item -Path $taskDirectory -ItemType Directory -Force | Out-Null
  $taskLines = @('project_id = "tribe-saarthi-staging"', '[auth.email.smtp]', 'enabled = true', 'port = 587')
  foreach ($taskPair in @(@('host',$taskMail.host), @('user',$taskMail.user), @('pass',$taskMail.password), @('admin_email',$taskMail.senderEmail), @('sender_name',$taskMail.senderName))) {
    $taskLines += $taskPair[0] + ' = ' + (ConvertTo-Json -InputObject ([string]$taskPair[1]) -Compress)
  }
  [IO.File]::WriteAllText((Join-Path $taskDirectory 'config.toml'), ($taskLines -join "`n"), (New-Object System.Text.UTF8Encoding($false)))
  $ErrorActionPreference = 'Continue'
  $taskDiffRaw = supabase config diff --project-ref $taskConfig.projectRef --workdir '.staging/smtp-deploy' 2> '.staging/smtp-diff-stderr.log'
  $taskExit = $LASTEXITCODE
  $taskDiffRaw | Set-Content -LiteralPath '.staging/smtp-diff.json' -Encoding UTF8
  $ErrorActionPreference = 'Stop'
  if ($taskExit -ne 0) { throw 'SMTP configuration preview failed' }
  $taskDiff = ($taskDiffRaw -join "`n") | ConvertFrom-Json
  if ($taskDiff.error -or @($taskDiff.changes | Where-Object { $_.declared -and (($_.path -join '.') -notlike 'auth.email.smtp.*') }).Count) {
    throw 'Refusing SMTP update that includes another declared setting'
  }
  $ErrorActionPreference = 'Continue'
  if ($taskExit -eq 0) {
    supabase config push --project-ref $taskConfig.projectRef --workdir '.staging/smtp-deploy' --yes *> '.staging/smtp-apply.log'
    $taskExit = $LASTEXITCODE
  }
  $ErrorActionPreference = 'Stop'
  if ($taskExit -ne 0) { throw 'SMTP configuration failed; inspect the private .staging/smtp-*.log files' }
  Write-Output 'Brevo SMTP configuration applied to dedicated staging. Verify actual invitation delivery before accepting B1/B5.'
} finally {
  if ($null -ne $taskTokenOverride) { $env:SUPABASE_ACCESS_TOKEN = $taskTokenOverride }
}
