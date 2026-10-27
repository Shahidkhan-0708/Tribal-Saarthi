# Track B staging procedure

Deployment, hosted authorization and separate-project restore have been exercised on Supabase/Vercel. Track B acceptance and remaining mail/operations gates are recorded in [track-b-verification.md](track-b-verification.md).

## Target and credentials

Use the dedicated `tribe-saarthi-staging` Supabase project in the owner's selected organization and the dedicated Vercel project of the same name. The existing `tribal-saarthi` and `tribal-aarthi` projects are unrelated deployment targets; do not overwrite them. Create `tribe-saarthi-restore` separately for the restore exercise. Check project names and refs with `supabase projects list` before any write. Do not pause another application to run this procedure.

Prerequisites: Node 22, installed project dependencies, authenticated Supabase/Vercel CLIs, and Docker plus PostgreSQL `psql` for the logical backup exercise. On this workstation a stale `SUPABASE_ACCESS_TOKEN` overrides a valid CLI login; remove that variable only inside the command process and restore it afterward. Do not change stored credentials or print API-key responses.

Keep the following configuration in ignored `.staging/config.json`, using actual values obtained privately from the new project:

```json
{
  "name": "tribe-saarthi-staging",
  "organizationId": "chosen-organization-id",
  "projectRef": "twenty-lowercase-letters",
  "publishableKey": "public-browser-key",
  "serviceRoleKey": "private-server-key",
  "frontendUrl": "https://tribe-saarthi-staging.vercel.app"
}
```

The existing local private file also holds bootstrap email/database credentials. Do not commit it, paste it into chat, put it in artifacts, or expose it through Vite. The scripts validate the dedicated target label/ref; the operator must verify that the ref actually belongs to that project. `.staging/` and `.vercel/` are ignored. Only `VITE_APP_MODE`, `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` belong in frontend configuration.

## B1: fresh staging

1. Create the dedicated Supabase project in the selected organization. If Free-project capacity is unavailable, wait for the owner to free capacity; do not upgrade billing or alter another application.
2. Verify the ref and run `supabase db push --project-ref REF --include-seed --dry-run`, then the same command without `--dry-run`. Supply the private database password through the CLI's supported environment/prompt. Never reset a hosted project. The seed contains configuration only.
3. Deploy `pilot-workflow`, `pilot-invite` and `pilot-receipt` with `supabase functions deploy FUNCTION --project-ref REF --use-api`. Their checked-in `verify_jwt=false` setting is intentional: protected handlers call Auth `getUser` and require an active scoped account; only receipt lookup is public.
4. Set `PILOT_ALLOWED_ORIGINS` and `PILOT_INVITE_REDIRECT_URL` to the exact dedicated frontend origin with `supabase secrets set --env-file PRIVATE_FILE --project-ref REF`. Keep the temporary secrets file inside `.staging/`.
5. In hosted Auth settings disable public email, anonymous and phone registration; set Site URL and the exact invite/recovery redirect to the staging origin. Local `config.toml` does not establish hosted settings. Review `supabase config diff --project-ref REF` before applying configuration; its local localhost redirects must not replace the hosted values.
6. Configure custom SMTP and verify delivery to controlled student/officer mailboxes. [Supabase SMTP guidance](https://supabase.com/docs/guides/auth/auth-smtp) explains default-service recipient restrictions. SMTP is currently absent; synthetic Auth account creation cannot satisfy this step.
7. Bootstrap only the owner's initial admin with `node scripts/bootstrap-staging-admin.mjs`, or use the SQL editor procedure in `supabase/README.md`. The script creates a manually confirmed administrator, verifies its actual login/scope and stores its random password only in ignored `.staging/admin-access.json`. It does not send mail or verify mailbox delivery. Subsequent user invitations must use `pilot-invite`; invitation/recovery delivery must still pass the mail gate. Existing roles/passwords are never silently overwritten by rerunning bootstrap.
8. In dedicated Vercel staging set the three public frontend variables for preview/production; build/deploy with the checked-in `vercel.json`. Confirm its project and scope before deployment. Recheck CORS and Auth redirects against the resulting URL; save a redacted settings checklist and deployment URL in release evidence.

## B2 and B5: hosted tests

Run `npm run test:staging` with the private configuration above. It creates seven synthetic confirmed Auth users, scopes them through `pilot_provision`, and performs real authenticated Edge/PostgREST/Storage requests. It sends no email. Test credentials and a restore-login probe remain inside `.staging/`; request IDs, safe assertion labels and HTTP statuses go to `artifacts/track-b/hosted-matrix.json`. Request queries, signed Storage paths, JWTs, payloads and passwords are excluded from evidence.

The runner checks all pilot tables against direct insert/update/delete, cross-student/institution/state reads, family grant/revoke, inactive access, foreign Storage registration/preview, real PDF/JPEG/PNG bytes, SHA-256, immutable replacement, deficiency correction/review, failed/retried simulated payment and the minimal receipt response. Fixtures remain in disposable staging for the backup exercise; do not run against a participant database.

Complete these additional checks before B2/B5 acceptance:

- Use `pilot-invite` as the owner admin to invite controlled student/officer addresses; accept delivered links and set passwords through the deployed UI. Save delivery/acceptance evidence without tokens.
- Prove an actually expired access token is denied by Edge and direct API requests. An invalid or forged token is insufficient evidence. A temporary short staging JWT lifetime can reduce the wait; restore the intended lifetime afterward.
- Open the deployed UI as the test student/officers, complete the journey and scan/open the generated receipt QR. Verify that anonymous lookup exposes only reference, issue time and hash. Save screenshots without private sample fields.
- Verify hosted public signup is rejected, CORS rejects a foreign origin, and inactive Storage download/preview is denied. Signed URLs already issued remain usable until their short expiry; record that limitation.

## B3: database, Auth and private bytes

Freeze writes for a consistent snapshot. Export bytes with `npm run staging:storage -- backup .staging/backups/track-b-release`. The manifest records every private object checksum/size/MIME type, exact pilot table counts and Auth UUIDs; referenced document checksums must match actual bytes. The manifest and bytes are private, not general release artifacts.

While writes remain stopped, run `powershell -NoProfile -File scripts/export-staging-database.ps1`. This Windows procedure uses the existing saved Supabase CLI credential in memory, reads one consistent SQL snapshot through the Management API, and writes private `database.json` plus SHA-256. It captures pilot/Auth/private tables, including UUIDs/password hashes and identities; provider migration history is excluded. Migrations remain the source of schema/function/policy definitions. Database exports do not contain Storage bytes. This path was used because Docker could not start. When using CLI `db query` or `db advisors` for hosted checks, include `--linked` with `--project-ref`; unlinked commands do not target the remote project.

Create a separate restore project on a compatible platform version. Apply repository migrations **without seed**, so pilot tables are empty and private bucket policies exist. Configure new project Auth URLs/signup restrictions and its own private API keys independently. Do not copy source service keys into the target. With the Free-project limit, the exercised sequence was: snapshot source, pause disposable source, create/verify separate restore target, pause restore target, resume source. Do not alter another app to rehearse restore.

Create private `.staging/restore.json` with name=`tribe-saarthi-restore`, its distinct ref/organization and its own API keys. Run `powershell -NoProfile -File scripts/prepare-staging-restore.ps1`. It verifies the snapshot checksum and provider target, inspects actual foreign keys, and generates one atomic SQL block for the populated tables with constraints enabled. Generated columns are omitted; identity/sequence values are preserved. It refuses cyclic populated dependencies rather than disabling triggers. The source snapshot used 43 tables, with 19 populated tables restored.

Apply the private generated SQL to the verified empty restore target:

```powershell
. ./scripts/supabase-management.ps1
$taskRestoreConfig = Get-Content .staging/restore.json -Raw | ConvertFrom-Json
$taskRestoreSql = [IO.File]::ReadAllText((Join-Path (Get-Location) '.staging/backups/track-b-release/database-restore.sql'))
Invoke-TaskSupabaseApi -Method POST -Path "/v1/projects/$($taskRestoreConfig.projectRef)/database/query" -Body @{query=$taskRestoreSql} | Out-Null
```

The managed `postgres` role cannot set `session_replication_role`; this procedure does not request that privilege. Auth/platform schema changes, cyclic datasets and encrypted OAuth/MFA/Vault data need a reviewed [native backup/restore procedure](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore); these were absent from the exercised password-only staging dataset. Then run:

```text
npm run staging:storage -- restore .staging/backups/track-b-release
npm run staging:storage -- verify .staging/backups/track-b-release
npm run test:restore-login
```

The storage tool verifies the entire manifest before writing, refuses a source-project restore or differing existing bytes, and verifies target checksums, exact record counts and unchanged Auth UUIDs. Storage metadata is recreated by upload, not copied from old `storage.objects`. The login test uses the same synthetic student's credentials/UUID and downloads its restored private preview. All three checks must pass. A local backup copy is not an enabled backup policy: schedule and protect database plus byte exports before collecting participant data, with an off-device encrypted destination, retention policy and recorded owner.

## B4: operator response

Shared quotas are 120 workflow requests/minute/account, 10 invitations/hour/admin, and 120 public receipt requests/minute total. They are atomic across Edge instances; only the service role can call the limiter. `429` includes `Retry-After`; offline operations retain their ID/bytes and retry later. Quota failure returns `503`. The receipt total is a small-pilot shortcut; deploy gateway/IP throttling before opening a larger public rollout. These application quotas do not replace Auth/Storage limits, upload-byte quotas or network abuse controls.

Function errors emit only `{requestId,status,code}`. Correlate the returned `X-Request-ID` with Supabase Function logs. For `401`, renew the session; for `403`, inspect active account/scope; for `409`, refresh before retry; for `429`, wait; for `503`, inspect limiter/database availability; for `500`, investigate before retrying a money/decision action. Preserve the operation ID when retrying a dropped acknowledgement. Never log certificates, profile bodies or tokens.

Enable Cron and run `supabase/schedule-reminders.sql` as owner. Inspect `cron.job` for the named daily job and `cron.job_run_details` for failures. Alternatively document a named operator running `select public.pilot_reminders()` daily at 03:00 UTC; record time/result/failure and retry the same day. Duplicate reminder IDs make retries safe. Inspect overdue deficiencies and in-app notifications after the run. Dedicated staging has the daily reminder job enabled; verify its active schedule after any restore.

Run `npm run check:staging` from a protected runner. It checks frontend/database/Edge availability and unresolved simulated payment failures, writes redacted `health.json`, and exits nonzero on failure. Configure a scheduler and a real alert recipient/channel, then prove one forced failure alerts the operator and recovery clears it. The script alone is **not an enabled alert**. Review failed reminders/functions/payments daily; record incident owner, request/job ID, response and resolution. Payment retries remain explicitly simulated.

MIME signatures, private buckets and file-size limits do **not** scan for malware. No scanner or accepted-risk sign-off is present. Keep participant uploads closed until a scanner is connected or an authorized owner records the limited pilot risk decision, scope, mitigations and expiry. Do not infer acceptance from a request to implement Track B.

Track C adds four public tables and a private receipt chain. New backup manifests include these table counts; old manifests retain their original table set. `scripts/export-staging-database.ps1 -SnapshotName track-c-before` creates a named snapshot and refuses to overwrite an existing database snapshot. Choose a fresh name for each subsequent snapshot. See `track-c-operations.md` for workflow-specific retries and rollback.


## Operations closure update

The existing staging now has scheduled AES-GCM backups, a registered encrypted off-provider copy, actual failure/recovery alert proof and five-minute health/email jobs. Cloud/local ciphertext recovery verifies52tables/15objects. Details, limits and recovery commands: [operations automation](operations-automation.md). The backup-protection/monitoring implementation is complete for the synthetic staging cohort; owner malware/risk, production runner/retention and external-alert acceptance are listed in [owner actions](owner-actions.md). No paid plan or participant-data approval was inferred.
