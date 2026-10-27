# Operations automation — 18 October 2026

The remaining operations implementation is deployed on the existing synthetic staging project. This does not authorize participant enrollment or claim real email/government delivery.

## Running jobs

| Job | Schedule | Result and failure handling |
|---|---|---|
| Encrypted database/Auth/private-file backup | Daily 02:15 UTC | Immutable encrypted objects in private `pilot-backups`; an encrypted manifest is written only after database and every private file pass checksum checks. |
| Frontend/database/job/payment health monitor | Every five minutes | Detects failed jobs, overdue backups, failed reminders and unresolved simulated payments. Failures and recovery create administrator in-app notices. |
| Critical email processor | Every five minutes | Processes up to ten due attempts. Missing API credentials do not consume send retries. Provider acknowledgement and inbox delivery remain distinct. |
| Deficiency reminders | Daily 03:00 UTC | Existing idempotent reminder job retained. |
| Encrypted copy outside Supabase | Daily 08:00 local time | Windows task `TribeSaarthiEncryptedBackupPull`; missed-run catch-up while the owner is signed in and network is available. Actual run result is zero. |

The administrator Configuration screen has an Operations panel with the latest ten runs per job, safe error codes, backup counts and recovery references. Notifications also contain failure/recovery messages. A mail processor waiting for configuration is explicitly labeled accordingly.

The hosted schedules follow Supabase's documented [Cron/pg_net function scheduling](https://supabase.com/docs/guides/functions/schedule-functions) and [Vault storage for the invocation token](https://supabase.com/docs/guides/database/vault). Jobs require an independent random server token. Browser JWTs cannot start jobs or export database/Auth backups. Status is administrator-only. The private backup bucket has no browser read policy, including for authenticated administrators.

## Protection and recovery

Each object uses AES-256-GCM with a fresh random nonce, authenticated project/path context and SHA-256 checks. The database snapshot includes table/column metadata and password-only Auth rows; immutable private file bytes are captured from the same snapshot's object inventory. Document checksums must match the database before a manifest is accepted. Overlapping backups and duplicate successful daily keys are rejected; a failed daily job can retry without erasing its history. No accepted backup is overwritten or automatically deleted.

The encryption key and worker token are generated once in ignored `.staging/operations.json`, stored as server secrets, and protected locally for the owner/SYSTEM/administrators. The invocation token is also in Vault. Vault keys themselves are excluded from database exports. Keep recovery keys outside the source project and preserve old keys before any deliberate rotation. Never paste them into chat or publish them with the app.

`npm run backup:pull` copies completed encrypted backups to ignored `.staging/protected-backups`, authenticates every file and rechecks existing copies for corruption. Partial copies can resume without overwriting different bytes. The scheduled task invokes the same command. Plaintext is not written by this copy job.

From the recovery reference displayed in Configuration:

```text
npm run backup:recover -- YYYY-MM-DD/UUID
npm run backup:recover -- YYYY-MM-DD/UUID --local
```

The second command recovers exclusively from the encrypted off-provider copy. Both refuse an existing recovery directory and verify database/Auth metadata plus every object checksum. Decrypted files remain under ignored `.staging/backups/automatic-...` or `automatic-local-...`. Recovery makes no writes to the hosted database. To prepare a separate-project restore, the existing procedure now accepts `-SnapshotName automatic-...`; its default `track-b-release` remains compatible. Apply matching migrations to a separately approved empty restore target first. Do not overwrite a live project to rehearse.

Configuration is reproducible with `scripts/configure-operations.ps1` and `scripts/schedule-backup-pull.ps1`. Existing keys are preserved, target name/ref/organization is checked, and setup does not touch another application. To stop the local copy, disable the named Windows task; re-run its setup script to re-enable it.

## Actual evidence

- A natural Cron invocation completed a backup of **52 database/Auth/private tables and 15 real private objects**, 1,399,514 bytes before encryption.
- A deliberately nonexistent backup bucket caused a real `503`/`backup_upload_failed` job and persisted administrator alert. A `finally` block restored the bucket setting. The subsequent scheduled backup and healthy monitor produced recovery notices.
- Recovery from cloud ciphertext and from the independent local encrypted copy both verified all database/Auth metadata and all 15 object checksums.
- The local scheduled copy ran successfully (`LastTaskResult=0`). Its daily 08:00 local schedule and conditional catch-up are recorded.
- Five hosted operations groups, 21 new Edge assertions, three hosted operations UI groups and inspected desktop/320px screenshots pass. Existing 58 Edge assertions, 102 unit/UI tests, 154 PostgreSQL assertions plus deficiency suite, four release-tool checks, type checks, both builds and demo/offline browser regressions pass.
- Security advisors report zero ERROR findings. Six authenticated definer boundaries are deliberately role/scope checked, including the new administrator-only status endpoint; leaked-password protection remains disabled and needs a production security decision.
- Performance before/after samples are preserved separately. Latest ten-client p95 milliseconds: login **651**, snapshot **1,850**, preview **581**, workflow **1,352**, all within the existing provisional budgets. The note append path now uses a shared application lock while preserving version/scope checks; decision writes retain exclusive locks. The measurements do not establish causation or production capacity.

Evidence: `artifacts/operations/{hosted,recovery,cron,latest-jobs,off-provider-schedule,browser,performance-before,performance-after,security-advisors}.json` and screenshots. Frontend: `dpl_6a3x2ZofzEiyHNgsbJNcNRa4sdfC`, READY at the canonical staging URL. Migration: `20261018133306_pilot_operational_jobs.sql`. A fresh private 51-table snapshot was saved before the migration; earlier accepted backups remain intact.

## Operating limits that require owner acceptance

The independent local copy requires the owner's computer, workspace, sign-in and network. Hosted jobs continue when that computer is off, but the newest off-provider copy will wait. Choose an always-on protected runner before promising an unattended disaster-recovery service. Backend Cron cannot independently notify during a complete provider/database outage; an external alert destination/monitor requires owner approval/configuration. External email alert delivery is not claimed.

Whole snapshots currently stop at 20 MB per object and 100 MB total rather than truncating or silently accepting an incomplete backup. This is sufficient for the exercised synthetic cohort; larger participant volumes need managed/streamed backups and agreed retention/capacity. MFA/OAuth encryption, platform secrets and a fresh hosted full-system restore are not newly certified by ciphertext recovery; preserve separate native platform backup procedures when those features are enabled. The existing B3 hosted password/UUID/private-byte restore proof is retained.

Real participant uploads remain gated by a private malware scanner or an explicit owner risk decision. Do not infer that approval from this implementation task. Current testing uses synthetic records. Government integration approval, physical-device/assistive-tech acceptance, retention/legal/on-call decisions and agreed production volumes remain owner input; see `owner-actions.md`.
