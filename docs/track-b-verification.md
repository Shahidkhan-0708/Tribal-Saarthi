# Track B verification — 18 October 2026

Track A passed its local exit gate. Track B is **in progress and not fully accepted**. B2 authorization and B3 separate-project restore have passed hosted checks. B1/B4/B5 remain open for invitation delivery and operational acceptance.

| Task | Actual result | Remaining evidence |
|---|---|---|
| B1: staging | Owner-selected `ahhjlqarkalaffqmnywu` paused with explicit approval, freeing capacity. Dedicated staging `axegexiaofxdmmizilri` and Vercel deployment exist. Both migrations/seed, three functions, Auth lockdown, redirects and CORS applied. Owner admin manually provisioned; actual login and idempotent bootstrap pass. Brevo config/apply tooling prepared; owner deferred credentials. | Email delivery and accepted controlled invitations. Brevo is not activated without credentials. |
| B2: hosted authorization | **PASS:** 76 hosted matrix assertions, five genuine-expiry/signup/CORS/inactive checks, seven browser role logins and request-ID/screenshot evidence. Private byte access, cross-student/institution/state reads, all pilot-table writes, forged RPC/path, family no-grant/revoke and expired access are denied. | No B2 acceptance item pending. This is a staged scoped matrix, not a broader penetration/load audit. |
| B3: bytes and restore | **PASS:** real PDF/JPEG/PNG upload/preview/replacement and SHA-256; six objects plus a 43-table DB/Auth snapshot restored into distinct `feoqfkznfiirrsmlqgfk`. Exact pilot counts/seven Auth UUIDs match; same password/UUID logs in and its private preview checksum matches. Constraints remained enabled during restore. | Automatic protected/off-device backups belong to B4; one-off restore proof does not configure them. The restore project is paused after the exercise to return capacity to staging. |
| B4: operations | Atomic service-only quotas, safe request IDs/logs and durable 429 retry handling implemented. Real workflow/invite/receipt routes enforce 429 with retry interval and request IDs; test counters cleared afterward. Daily Cron reminder configured at 03:00 UTC; manual run succeeds. Health detects the deliberate outage and recovery. | Scheduled protected backups, failed-job drill/alert delivery, malware scanner or explicit owner risk decision. No running alert or risk acceptance is claimed. |
| B5: release smoke | **Hosted workflow PASS:** documents → application → human reviews → income correction → sanction → failed/retried simulated payment → minimal receipt → safe family grant/revoke. Browser verified actual rendered QR modules and anonymous receipt. | Delivered/accepted admin invitations await Brevo credentials. Synthetic confirmed Auth accounts do not replace mail acceptance. |

Staging frontend: `https://tribe-saarthi-staging.vercel.app`. Restore project: `tribe-saarthi-restore`. All uploaded profiles/files in this exercise are synthetic. Backups, password hashes, test credentials, signed links and SMTP inputs stay in ignored `.staging/`; Vercel upload review confirmed no private configuration bytes were included.

Staging is `ACTIVE_HEALTHY` again; restore exercise target is paused. The manually bootstrapped owner account was created after the seven-user restore snapshot. Its private local access file is `.staging/admin-access.json`; mailbox delivery has not been verified. Brevo host/port/sender settings are ready in `.staging/smtp.json`, with login/key intentionally blank. Read-only CLI preview confirms only explicitly declared SMTP fields will change; missing credentials fail before any hosted update.

## Hosted evidence

- `artifacts/track-b/hosted-matrix.json`: 76 assertions and redacted method/path/status/request IDs.
- `hosted-expiry.json`: a genuine 60-second issued JWT later denied by Edge/PostgREST; signup, foreign origin and inactive-owned preview checks. Staging JWT lifetime restored to 900 seconds afterward.
- `hosted-browser.json` and `screenshots/`: seven actual hosted logins, rendered QR and minimal anonymous receipt. QR comparison checks image modules because browser and Node PNG compression differ.
- `storage-restore.json` and `restore-login.json`: separate-project object checksums, exact pilot counts, seven Auth UUIDs and same-UUID/password login/preview.
- `reminder-schedule.json`: named daily hosted Cron job. `health-during-restore.json`: expected nonzero health detection during the deliberate outage; final `health.json` records recovery.
- `deployment-file-review.json`: private files excluded; empty ignored-directory placeholders contain no data.
- `hosted-quotas.json`: all three actual routes return 429 with retry intervals/request IDs; no invitation email sent by this test.
- `security-advisors.json`: no ERROR findings. The private rate-limit table intentionally has no read policy; the authenticated `family_summary` definer is intentional and covered by grant/revoke/safe-field tests. Leaked-password screening is not enabled and remains part of the security release review.

## Local checks

Logs are in `artifacts/track-b/logs/`.

| Command | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm test -- --maxWorkers=2` | PASS — 73 tests, 14 files |
| `npm run test:db` | PASS — 41 PostgreSQL assertions plus deficiency/review/frozen-scope/eligibility/family suite; Auth/Storage schema fixtures |
| `npm run test:edge` | PASS — 23 Request/Response assertions; synthetic Auth/Storage transport |
| `npm run test:release-tools` | PASS — 4 target-guard, evidence-redaction, safe-error and denial-classification checks |
| `npm run build:pilot` | PASS |
| `npm run test:demo-browser` | Demo build PASS; browser runner PASS on that build after fixing the route-read wait |
| `npm run test:browser` | PASS — built pilot with real browser/IndexedDB/service worker and synthetic API transport |
| `node --check` on all new staging scripts | PASS — syntax only, not hosted execution |

The first unconstrained parallel test run timed out on two UI tests at the default five-second limit while builds/database checks were competing for resources (71/73 passed). The unchanged suite passed all 73 with two workers. The initial failure log is retained as `tests-first-attempt.log`; no assertion was removed or timeout increased.

The first demo browser run queried correction options before the target route rendered. The runner now waits for the expected unverified option before reading the list; the complete journey passed against the unchanged demo build. Application code was unchanged. The initial failure is retained as `browser-demo-first-attempt.log`. The default `dist/` contains the demo build.

## Implemented limits and boundaries

- Workflow: 120/minute/account. Invitation: 10/hour/admin. Receipt: 120/minute shared public budget. The latter needs gateway/IP protection for a larger public rollout.
- Counters are atomic in PostgreSQL, protected by RLS/private schema and exposed only through a service-role RPC. Invalid buckets are denied; database unavailability fails closed with `503`.
- Every function response includes a request ID; errors log only request ID, status and safe code. Unexpected errors return a redacted `500`.
- Offline replay honors `Retry-After`, keeps its operation ID and retains uploaded bytes on `429`. Existing idempotent retries remain unchanged.
- Upload validation checks declared MIME/signature/size and checksum. It does not scan for malware. No scanner or owner risk decision exists yet.
- A successful one-off backup or health command does not configure automatic protected backups or delivered alerts.
- Hosted results listed above were run against actual Supabase/Vercel services, with no HTTP fixture substitutions. Mail acceptance, automatic backups and delivered alerts remain unproved.

Deployment/restore/operator instructions: [staging-release.md](staging-release.md). Historical Track A evidence: [track-a-verification.md](track-a-verification.md).
