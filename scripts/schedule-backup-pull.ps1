$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskName='TribeSaarthiEncryptedBackupPull'
$taskExisting=Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if($taskExisting -and $taskExisting.Actions.WorkingDirectory -ne $taskRoot){throw 'Scheduled task name belongs to another workspace'}
$taskScript=Join-Path $PSScriptRoot 'run-backup-pull.ps1'
if(-not(Test-Path -LiteralPath $taskScript)){throw 'Backup pull wrapper missing'}
$taskAction=New-ScheduledTaskAction -Execute (Join-Path $PSHOME 'powershell.exe') -Argument ('-NoProfile -NonInteractive -WindowStyle Hidden -File "'+$taskScript+'"') -WorkingDirectory $taskRoot
$taskTrigger=New-ScheduledTaskTrigger -Daily -At '08:00'
$taskPrincipal=New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$taskSettings=New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 20)
Register-ScheduledTask -TaskName $taskName -Action $taskAction -Trigger $taskTrigger -Principal $taskPrincipal -Settings $taskSettings -Description 'Copy verified encrypted Tribe Saarthi staging backups off-provider while the owner is signed in; never erase or overwrite prior backups.' -Force -ErrorAction Stop | Out-Null
$taskRegistered=Get-ScheduledTask -TaskName $taskName -ErrorAction Stop
if($taskRegistered.Actions.WorkingDirectory -ne $taskRoot){throw 'Registered backup task does not match this workspace'}
Start-ScheduledTask -TaskName $taskName -ErrorAction Stop
Write-Output 'Scheduled encrypted off-provider copy daily at 08:00 local time, with missed-run catch-up when the owner is signed in and network is available.'
