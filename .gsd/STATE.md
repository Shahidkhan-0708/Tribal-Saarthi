# Working pilot implementation state

## Outcome

Pilot implementation is present and locally validated. Live release is pending external authentication, project selection and staging verification. The existing demo remains available and is isolated from pilot records.

## Delivered

- Explicit pilot build/mode; invite-only email/password Auth; scoped accounts; session restoration/recovery; local private-data purge including offline logout.
- PostgreSQL RLS reads and server-only transactional commands with current actor authorization, idempotent operation keys, optimistic versions, atomic audit and in-app notices.
- Private real document/signature uploads, server byte/mime/size/checksum validation, immutable versions/reviews, persisted application attachments and submission snapshots.
- Authoritative eligibility, human verification attempts, source-down simulation, multiple deficiencies with specific corrections, reviewed income overriding declarations, and guarded institution/department/sanction stages.
- Separate simulated payment attempts/results; immutable SHA-256 receipts with a real QR and minimal public verification.
- Scoped grievances/replies/assignment/resolution, targeted student broadcasts, revocable email-based family consent with online-only safe summaries, contextual English/Hindi Saarthi and optional browser voice with text fallback.
- IndexedDB snapshots/drafts/files/grievances/notes, restart-safe queue, actual acknowledged replay, conflicts, service-worker shell/asset caching, mobile/keyboard support.
- Live pilot analytics, strict CSV import, reporting-population compatibility checks, deployable configuration/migrations/functions/seed, reminder scheduling helper, backup/restore and staging instructions.

## Evidence

- `npm test -- --reporter=dot`: 39 tests, seven files, all passed on Vitest 4.1.11.
- `npm run test:db`: migration executes in PostgreSQL with real pgcrypto; 36 workflow/security assertions plus the deficiency/immutable-review/frozen-scope/reviewed-income/family-email suite passed. Auth/Storage schemas are fixture substitutes, not hosted services.
- `npm run test:edge`: 17 Request/Response boundary assertions passed, including unauthorized/inactive accounts, origin restrictions, malformed inputs, foreign object paths, invalid bytes and server-derived SHA-256. Auth/Storage transport is synthetic.
- `npm run test:browser`: built pilot login, cached offline reload, durable draft replay, logout and mobile layout passed in Chromium. Uses synthetic Supabase API responses; real browser, IndexedDB and service worker.
- `npm run typecheck`, `npm run build`, `npm run build:pilot`: passed.
- `npm audit --omit=dev`: zero findings. Compatible Vite/Vitest/React Router patches applied; normal lockfile resolution works.
- Screenshots: `.gsd/evidence/pilot-desktop.png` and `pilot-mobile.png`.

## Remaining release work

- Supabase saved CLI login works when the invalid SUPABASE_ACCESS_TOKEN override is removed from the individual command process. User selected Supabase; no Tribe Saarthi project exists, so a deployment-target question is pending (recommended separate project in Learning). Persistent environment/credentials were not changed. No live migrations, invitations or publication were performed yet.
- Vercel saved login also works (shahidkhan07191-9917); existing related projects are tribal-saarthi and tribal-aarthi. No frontend project was linked or overwritten. Supabase local Auth redirects now match localhost/127.0.0.1 port 5173. Hosted project selection is the remaining prerequisite to deployment; authentication itself is no longer blocked.
- Configure hosted Auth email/redirects/signup restrictions, provision the first administrator, deploy functions/migrations, confirm scoped Storage transfer, schedule/verify Cron, and run staged cross-account journeys.
- Review official pilot scheme rules/rates and baseline sources before real enrollment. Government checks, OCR, payment, SMS and IVR remain simulated as agreed.
- Configure database and private Storage backups and prove restoration in staging. No hosted restore was claimed.
- Seven development-only styling-tool advisories remain (two moderate, five high). A Tailwind/tooling migration is outside this implementation; keep development servers private.
- No Git repository exists in this workspace; no commits or PR were created.

## Entry points

`docs/pilot-operations.md` explains local/staging release gates; `supabase/README.md` contains backend command contracts and bootstrap/deployment instructions. Use `npm run dev -- --mode pilot` or `npm run build:pilot` with public Supabase URL/key in `.env.local`. Pilot mode without credentials displays setup instructions rather than demo data.

## Track B update - 18 October 2026

The owner selected Shahidkhan-0708's Org. Dedicated tribe-saarthi-staging Vercel project is created/linked. Supabase creation is blocked by the account Free-project quota; the owner will free capacity. No SMTP provider is configured. Shared Edge quotas/retry handling are locally validated; hosted matrix/Storage/restore/health scripts and docs/staging-release.md are prepared. B1-B5 remain open; use docs/track-b-verification.md for current release evidence. Earlier target-selection and unlinked-Vercel notes above are historical.


## Current Track B state - 18 October 2026

Staging https://tribe-saarthi-staging.vercel.app is deployed and ACTIVE_HEALTHY (Supabase axegexiaofxdmmizilri). Owner explicitly selected ahhjlqarkalaffqmnywu to pause; it remains paused. B2 hosted authorization PASS (76 + five expiry/signup/CORS/inactive checks; seven browser role logins/QR/public receipt). B3 separate database/Auth/private-byte restore PASS (feoqfkznfiirrsmlqgfk now paused); source staging resumed and health passes. Owner admin login verified, credentials private in .staging/admin-access.json. Brevo host/port/sender/private-config/apply script prepared and read-only diff validated; owner will supply credentials later. B1/B4/B5 stay open for invitation delivery, automatic protected backups, delivered alerts/failed-job drill and malware decision. Current evidence: docs/track-b-verification.md and artifacts/track-b/. Local typecheck and 73 tests pass; no app code changed by this deployment work.


## Track C update - 18 October 2026

Owner requested the next phase despite deferred mail/operations gates. C1-C4 and C6-C9 are checked in FEATURE_COMPLETION_PLAN.md / TASKS Phase 11. C5 stays open: Brevo SMTP/API credentials and real delivery/scheduling are not configured. Three migrations, five Edge endpoints and pilot frontend are deployed on the existing dedicated staging project. New workflows include lifecycle/session revocation, audit filters/exports, reviewed offline conflict retry, grievance evidence/SLA/timeline, scoped analytics CSV/charts, canonical decision receipts, renewal/withdrawal/appeal/bulk sanction, and versioned configuration dry-run/publish/rollback.

Validation: 76 Vitest tests, 80 SQL assertions plus deficiency suite, 49 Edge/provider assertions, four release-tool checks; demo/pilot builds, demo/offline-conflict browser checks, 23 real hosted assertions and five hosted UI checks pass. Fresh private pre-deploy snapshot: .staging/backups/track-c-before. No separate restore repeated for this phase; original B3 evidence remains. Public artifacts exclude credentials and mask owner email in account screenshot. B1/B4/B5 still open. Authoritative new evidence/runbook: docs/track-c-verification.md and docs/track-c-operations.md. Do not start Track D or claim real email/government/payment integration without new scope and credentials.


## Track D/E update - 18 October 2026

Owner authorized previously untouched Tracks D/E. D1 contract and failure/mode/audit boundary, E2 critical browser checklist and E3 privacy controls are verified. Pilot PWA and E4 bounded/paged/batched reads, full scoped metrics, TTL/indexes and concurrent measurement are deployed. All government transports remain unconnected; staging mode is explicitly simulated. Human review retains provider provenance. Consent revocation, family cutoff, erasure/retention/admin review and processing export are implemented; no silent/automatic deletion or legal compliance certification.

Checks:83 Vitest,114 SQL plus deficiency suite,58 Edge/provider,4 release tools; demo/pilot builds and demo/offline-conflict browser pass. Ten real hosted functional checks, ten critical keyboard/mobile/PWA checks and five Track C UI regression groups pass. Latest p95 ms at10simultaneous synthetic-admin clients:login557,snapshot1758,preview814,workflow6011. Last workflow sample exceeds provisional5000ms; do not mark E4 complete. Expected volume/workload/targets need agreement. E1 physical-device/camera/notification, actual screen-reader/mobile-assistive checks and D2 approved DigiLocker OAuth/fetch/revocation remain pending; do not start later integrations. B/C provider and operating gates remain open.

Source of truth:FEATURE_COMPLETION_PLAN.md, TASKS Phase12, docs/track-de-verification.md. Deployment dpl_CxwziLgyW6396nX2ABUTWrCM6ViY on existing staging axegexiaofxdmmizilri. New pre-release private backup48tables+10objects; post-release export51tables and current private-object manifest. Logical exporter fixed for >50tables. Credentials remain in .staging; no approved backup replaced; no new restore drill or production integration asserted. Remaining task IDs:12.2(D2),12.3(E1physical),12.6(E4acceptance). Previous instruction not to start D was superseded by the owner's latest scope.

Phase12 final follow-up: offline operations receive persisted FIFO sequence numbers atomically across tabs; new-draft conflicts query the owned scheme/year directly rather than a visible snapshot page. Three regressions add to the previous83 tests (current86). Logical snapshot hash verifies51tables including all privacy tables; private manifest15objects. Last E4workflowp95 remains6011ms, not accepted. Tasks12.7/export and12.8/offline fixes included.

Final deployed frontend: dpl_DCu1cKLfpwCMWD7k9JBwPpCt8rDh READY at https://tribe-saarthi-staging.vercel.app. Supersedes earlier phase frontend IDs; includes FIFO and paginated conflict lookup fixes. Final local86tests/typecheck/pilot build/offline browser/release tools pass.


## Frontend connection validation in progress - 18 October 2026

First focused hosted run stopped at an exact-label selector for the wrapped record-list select; an explicit accessible name was added. The next run caught whole-record target serialization; API/queue targets now contain only id/version and contract coverage passes. No task was checked off from those failed runs. Latest local typecheck and 98 tests pass; final hosted replay is in progress.


## Context Health: Frontend verification state snapshot

Triggered: 18 October 2026. Phase 13, TASK-13.2. Three independent focused checks exposed different issues; no repeated attempt on the same unresolved cause. First: exact wrapped-select label; fixed explicit accessible name. Second: whole-record target payload; fixed minimal target serialization and added API/queue assertions. Third: baseline fixture query expected a record in an empty table (confirmed count=0, HTTP200); next step is real UI CSV import before testing its read view. Four hosted browser groups already pass (notes, signatures, institutions/history, account-to-privacy refresh), with screenshots in artifacts/frontend-connections. Latest 98 unit/UI tests and type checks pass; DB114 plus deficiency suite and Edge58 pass. Final deployment dpl_3Gz8TBi3QidPFc8EtQanhTCenCKU READY.

No application/provider outage observed; no three failed fixes for one issue. Continue the authorized audit using the verified causes above. Outstanding: complete hosted baseline/mobile/family checks, inspect screenshots, rerun offline browser after target normalization, document final evidence and mark Phase13 tasks. No secrets belong in artifacts; owner email must be masked in account views.


## 18 October 2026 - Phase 13 frontend connection audit complete

[TASK-13.1] Implemented note application/version targets, officer-only RLS (direct + snapshot), minimal target serialization/queue persistence, institution lifecycle/history, private signature previews, shared account-to-privacy refresh, paged supporting-record/profile/baseline views, truthful family controls and demo officer grievance route/resolution.

[TASK-13.2] Actual final verification output:
- npm run typecheck: exit 0. Vite config typecheck: exit 0.
- npm test -- --maxWorkers=1: Test Files 19 passed (19); Tests 98 passed (98).
- npm run test:db: PASS 123 PostgreSQL workflow/security assertions; PASS multiple deficiencies, immutable reviews, fresh human checks, frozen scope, reviewed income eligibility and invited-family email consent.
- npm run test:edge: PASS 32 boundary assertions + PASS 26 Track C/provider assertions.
- npm run build and npm run build:pilot: exit 0. Known nonfatal offline static/dynamic import notice retained.
- npm run test:demo-browser: PASS complete demo including officer grievance resolution and student status.
- npm run test:browser: PASS built login, cached offline reload, durable replay, reviewed stale-draft conflict, logout and mobile layout after target minimization.
- npm run test:frontend-browser: PASS 7 real hosted frontend groups; no uncaught browser errors.
- npm run test:frontend-security: PASS 16 hosted internal-note access assertions; owning student, family, anonymous and unrelated officers denied.
- Public evidence scan: 6 files, 0 credential/owner-email matches.

Screenshots inspected: artifacts/frontend-connections/screenshots/{institution-lifecycle,signature-preview,baseline-record,records-320,family-pages}.png and artifacts/track-a/grievance-resolved.png. Hosted browser initial failures and their verified fixes are retained in STATE.md; an empty baseline fixture was replaced by actual UI CSV import, not a fake success.

Runtime frontend dpl_3Gz8TBi3QidPFc8EtQanhTCenCKU READY at https://tribe-saarthi-staging.vercel.app. Migration 20261018124722_pilot_internal_notes_read_scope.sql applied after fresh private 51-table snapshot frontend-connections-before. No existing backup was overwritten; no Storage objects changed. Feature map/status/checklists updated. Existing provider, operations, physical-device and E4 performance acceptance gates remain open. No production integration, full certification, fresh restore drill or exhaustive rerun of all form/role combinations is claimed.


## Phase 14 current state - operations closure

User asked to complete all autonomous work and leave owner-only input. TASK14.1-14.3 added; none checked yet. Supabase migration 20261018133306_pilot_operational_jobs.sql applied. New pilot-operations and refactored pilot-notifications deployed. Current frontend dpl_ZUEaiqmXhEQVNAfU6p7V9dQx5j5a READY canonical staging. Crypto keys/token generated privately in .staging/operations.json/env; restrictive ACL verified for owner/SYSTEM/admins. Never print these. Cron daily backup 02:15UTC, monitor/email every5m, reminder03UTC all active. Temporary minute backup schedule was restored to final daily schedule.

Actual natural Cron backup succeeded at13:51UTC:52tables,15privateobjects,1,399,514plaintext bytes encrypted with AES256GCM. CLI decrypt+allchecksums/Auth/table metadata PASS; artifacts/operations/recovery.json. Real missing-bucket backup fault returned503 and persisted admin in-app failure alert; bucket restored in finally. Recovery alert observed. Five hosted operations groups PASS; allAPI access guards tested. Background monitor first failed backup_overdue before first successful backup; expected natural recovery next five-minute run (checkjobhistory).

Local102unit/UI,154DB plus deficiency suite,58existingEdge plus19newoperationsEdge assertions/typecheck/pilotbuild pass. Latest10-client baselinebeforelockchange p95login762,snapshot1962,preview745,workflow1539. New followup test running session8777, saveperformance-after.json whencomplete. NewnoteFOR SHARE lock retains version/scope gates; decisionlocks unchanged.

Encrypted off-provider pull script downloaded/verified1backup to .staging/protected-backups (plaintextnotwritten); recover-operations-backup.mjs --local added but nottested yet. Windows scheduler registration attempt failed UserId parameter, and old script falsely printed success; fix explicitErrorActionStop + verify registered task. Inspect current actual accountname instead ofSID; ifactualOSprivilegeblocksregistration recordownermanualrunner setuphonestly. Do not retryblindly. Scripts:pull-operations-backups.mjs,run-backup-pull.ps1,schedule-backup-pull.ps1. Need test local recovery, finalOpsbrowserUI screenshot+privatealerts, default/demo/offline regressions, setup missingBrevoAPI file+guard, owner-onlychecklist, completiondocs. Malware scanning/participant riskapproval remainsOWNER decision (do not accept automatically). Govtproviderapprovals/DigiLockerfirst, realdevice/screenscreenreader/policy/workloadsignoff and realemailacceptance aremanualgates. No gov/financialintegration or paidinfrastructureauthorized.


## 18 October 2026 - Phase 14 autonomous closure complete

TASK14.1: Append-only officer notes use a shared application lock, preserving role/scope/version checks and exclusive decision locks. Preserved before/after10-client samples:latestp95ms login651,snapshot1850,preview581,workflow1352; all existing provisional budgets pass. No causation/capacity forecast claimed; production workload acceptance remains owner input.

TASK14.2: Applied migration20261018133306_pilot_operational_jobs.sql; deployed pilot-operations and refactored pilot-notifications. Natural Cron backup at13:51UTC exported52database/Auth/private tables +15immutableprivateobjects (1,399,514bytes before encryption), all protected using AES256-GCM/AAD/nonce/checksums. Daily02:15UTC backup,5-minute monitor/email and original03UTC reminders active. Temporary minute test schedule restored. Provider configuration never consumes send retries. Admin Operations UI and failure/recovery notices deployed.

Actual failed-job drill: non-existent backup bucket returned503 backup_upload_failed, persisted failedhistory and adminin-app alert. Bucket restored in finally. Natural backup and later natural healthy monitor succeeded and sent recovery notices. Five hosted operations groups PASS.

TASK14.3: Cloudciphertext and independent-local-ciphertext recovery both PASS52tables/15objects +Auth metadata/allSHA256. Existingbackupsevidencepreserved; no live DBrestore/reset or Storage source-object replacement. Daily Windows task TribeSaarthiEncryptedBackupPull registered using actual accountname (SIDregistration rejected); verifiedactual LastTaskResult0, daily08local,missed-run catch-upwhileowner signedin/networkavailable. Encrypted off-provider copies re-authenticate every file and never writeplaintext/overwrite differingbytes. Existing strict ACLs validated for recovery files; setup avoids unnecessary privilegedSACL writes.

Final verification outputs:
- typecheck +Viteconfigtypecheck exit0;102unit/UI tests in20files PASS.
-154PostgreSQLworkflow/security assertions +deficiencysuite PASS.
-58existingEdge/provider +21newoperationsEdge assertions PASS.
-4release-tool checks PASS. Defaultbuild/demo and pilotbuild/offline/conflictbrowser PASS.
-5hostedoperationsgroups,3hostedOperationsUIgroups,16hostedinternal-noteaccessassertions andstaginghealth PASS.
-Screenshotsinspected:operator-jobs,operator-jobs-320,operator-recovery-alert.
-Securityadvisors0ERROR;6intentional authenticated definer WARN and existing disabledleaked-passwordprotection WARN documented.
-Finalpublicevidence scan16files,0credential/owner-emailmatches. Allprovisionalbudgetflags true, dailyCronrestored andscheduledcopyresult0 verified.
-PrivateBrevoAPI template .staging/email-provider.env +guardedapplycommandprepared; absent-keyguardPASS,noprovidercredentialsettingschanged. SMTPfieldsstillblank. Noemailssent.

Finalfrontend dpl_6a3x2ZofzEiyHNgsbJNcNRa4sdfC READY https://tribe-saarthi-staging.vercel.app. Task14.1-.3checked, FEATURE_COMPLETION_PLAN/FEATURE_STATUS andoperations/privacy/Brevorunbookssynced. Exactmanualrequirements:docs/owner-actions.md. RemaininguncheckedIDs10.1,10.4,10.5,11.5,12.2,12.3,12.6 arecredential/access/device/owner-acceptancegates. D2needsapprovedcontractandfollow-uprealimplementation/testing; no claimthattypingakeyalonefinishesgovernmentintegration. Malware/participantrisk,always-onproductionrunner/retention,independentoutagechannel,privacy/device/workloadsignoffremainownerwork. No billingupgrade/newprocessor/realgovernmentpayment/nativecertification accepted.

2026-10-18 TASK-15.1 completed: Started Vite pilot frontend at http://localhost:5173 (loopback only). Created ignored .env.pilot.local using only the existing staging URL/public key. Preserved canonical hosted CORS origin and added exact http://localhost:5173; synchronized private function-secrets.env. Backend axegexiaofxdmmizilri ACTIVE_HEALTHY. All four scheduled jobs active; pilot_job_health returned failedJobs=0, backupFresh=true, reminderFailed=false. Windows encrypted-copy task Ready, LastTaskResult=0, next run 2026-10-19 08:00 local. Browser proof: actual synthetic admin sign-in, database workspace, authenticated Edge account read and operations refresh; zero runtime errors/failed requests. Evidence artifacts/startup/session.json; private operations screenshot inspected. npm run typecheck exit 0; npm test exit 0, 20 files/102 tests passed. Frontend HTTP 200 confirmed after checks; Vite left running. No local database reset, paid infrastructure or email sent. Brevo credentials and previously documented owner gates remain pending. Restart command recorded in README.md.

2026-10-18 TASK-15.2 completed: Inspected workspace image.png: the reported NotSupportedError is denied service-worker installation, not an authentication failure. Limited service-worker registration to production pilot builds, and replaced raw production exceptions with an explanation that online sign-in remains available. Added three registration regression tests and a built-browser permission-denial fallback case. npm run typecheck exit0; npm test PASS20files/105tests. npm run test:browser PASS real production service worker, cached offline reload, durable replay, reviewed conflict, logout/mobile layout and denied-registration fallback. Actual local pilot student sign-in passes with denied service-worker policy, zero development registration attempts and no browser errors. Demo server http://localhost:5174 left running alongside pilot5173. Initial demo probe assumed a login screen; a fresh demo actually opens seeded Asha automatically. Corrected verification proves all four role routes, sign-out and one-click student login. Evidence artifacts/startup/demo-access.json; inspected clean local login and denied-production fallback screenshots. Existing synthetic/owner credentials remain in their private local files; no passwords printed, changed or created. Hosted frontend deployment unchanged; no new database migration or owner acceptance gate closed. Restart/access instructions and feature status synchronized.

2026-10-18 TASK-16.1-.3 research complete: Used actual Context7 resolve/query tools for MUI, shadcn/ui and Lucide, official MUI/USWDS/GOV.UK documentation and npm package metadata. Captured eight existing demo/pilot desktop/mobile screens with DOM metrics under .gsd/evidence/ui-research/. Verified demo390px missing all6navigationlinks/document395px, pilot11student destinations, decorative content before application status, and informational unread notices incorrectly labelled pending action. Inspected desktop/mobile screenshots. Recommendation: packaged MUI Core plus existing Lucide, five student destinations, task-first overview, short application sections, expandable secondary detail and separate demo tools. React18.3.1 requires matching react-is override; Tailwind3 CSS baseline/injection integration documented. Wrote docs/ui-simplification-research.md with component mapping, source evidence, migration order and acceptance checks. No UI components/mockups generated, dependencies installed, application source changed or deployment performed. No new test result claimed; research-only change. TASK-17.1 is the explicit unstarted implementation handoff, outside the completed research phase.
