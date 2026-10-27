$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $taskRoot
$ErrorActionPreference='Continue'
node scripts/pull-operations-backups.mjs *> '.staging/scheduled-backup-pull.log'
$taskExit=$LASTEXITCODE
exit $taskExit
