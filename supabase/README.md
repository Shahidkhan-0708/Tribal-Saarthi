# Pilot backend

`npm run dev` opens the persistent Supabase application on http://localhost:5173 using `.env.pilot.local`. Use `npm run dev:demo` for the password-free local demo on port 5174. The two applications have separate data stores; demo records are not uploaded to Supabase.

## Local database setup

Install the Supabase CLI (2.79 or newer) and start Docker Desktop, then run:

```sh
npm run backend:setup
npm run backend:serve
```

In another terminal run `npm run dev:local`. Setup applies every pending migration, creates the private document/signature buckets through those migrations, inserts the checked-in scholarship/institution configuration, and provisions a local administrator. Its generated login is in ignored `.backend/admin.json`; its public frontend settings are in `.env.backend.local`. Local invitations/recovery emails are captured at http://localhost:54324. Supabase supplies server credentials to the local Edge runtime; the generated frontend file contains only a public key.

Setup can be rerun without resetting the database, changing existing passwords or changing existing account roles. It targets only local Supabase and leaves the hosted `.env.pilot.local` configuration in place. Run `npm run backend:serve` whenever developing against the local database so all six functions receive the local origin, redirect and simulated-adapter settings. Scheduled backup/email monitoring still requires the separately documented operator configuration.

## Function and database coverage

All `pilot_*` workflow tables have scoped row-level security. Browser clients read permitted rows and submit changes through authenticated functions; server transactions validate roles, record versions, state transitions and duplicate operation IDs.

| Feature | Backend entry | Database records |
|---|---|---|
| Sign-in, password recovery, invitation acceptance | Supabase Auth | `auth.users`, `auth.sessions`, `pilot_accounts` |
| Invite users and assign institution/state scope | `pilot-invite` → `pilot_provision` | `pilot_accounts`, `pilot_audit` |
| List/manage accounts, resend invitations, request erasure | `pilot-accounts` → `pilot_command` | `pilot_accounts`, `pilot_audit` |
| Student profile | `pilot-workflow` → `pilot_command` (`save_profile`) | `pilot_students` |
| Document upload/reuse/review/correction | Private Storage + `pilot-workflow` | `pilot_documents`, `pilot_deficiencies`, `pilot_applications` |
| Discovery, eligibility, drafts and submission | Scoped catalog reads + `pilot-workflow` | `pilot_schemes`, `pilot_institutions`, `pilot_applications` |
| Verification and human review | `pilot-workflow` → `pilot_verify`, `pilot_review` | `pilot_verifications`, `pilot_documents`, `pilot_applications` |
| Simulated connector outage (admin) | `pilot-workflow` → `pilot_command` (`set_source_health`) | `pilot_source_health`; `pilot_verify` forces `source_down` while unavailable |
| Institute/department approval, sanction and payment attempts | `pilot-workflow` → `pilot_command` | `pilot_applications`, `pilot_payments`; private signature bucket |
| Renewal, withdrawal, appeal and receipt policy | `pilot-workflow` → `pilot_command` | `pilot_applications`, `pilot_audit` |
| Public receipt verification | `pilot-receipt` → `pilot_receipt` | Minimal projection of `pilot_applications` |
| Grievances, evidence, replies, assignment and resolution | `pilot-workflow`, `pilot_grievance_history` | `pilot_grievances`, `pilot_grievance_categories`, `pilot_documents` |
| Broadcasts and read acknowledgements | `pilot-workflow`, `pilot_broadcast_preview` | `pilot_notifications`, `pilot_deliveries` |
| Deliver queued emails | `pilot-notifications`; scheduled `pilot-operations` | `pilot_deliveries` |
| Family consent and limited summaries | `pilot-workflow`, `pilot_family_page`, `family_summary` | `pilot_family_grants`, safe application/payment projections |
| Officer notes, audit and history | `pilot-workflow`, scoped snapshot/page reads | `pilot_notes`, `pilot_audit`, `pilot_configuration_history` |
| Scheme drafts, publish, rollback, dry-run; institutions | `pilot-workflow` → `pilot_command` | `pilot_schemes`, `pilot_scheme_drafts`, `pilot_institutions`, `pilot_configuration_history` |
| Coverage analytics and baseline imports | `pilot-workflow`, `pilot_snapshot` | `pilot_baselines`, scoped student/application/payment aggregates |
| Privacy choices and retention/erasure review | `pilot_privacy`, `pilot_processing_record` | `pilot_consents`, `pilot_consent_events`, `pilot_privacy_policies`, `pilot_accounts` |
| Encrypted backups, worker health and operator status | `pilot-operations`, `pilot_operations_status` | Private `job_runs`, restricted backup buckets |
| Offline drafts/uploads/grievances and officer notes | Existing IndexedDB queue → same workflow API on reconnect | The same versioned records; no separate offline database on the server |
| Saarthi guidance | Existing contextual assistant | Uses the authorized snapshot; no external AI service or separate personal-data store |

Frontend-to-backend mapping for every demo store action is in `docs/frontend-backend-parity.md`. `npm run test:db` also sends each `PilotAction` through `pilot_command` and fails on `unknown action`, so a new frontend action without a server handler is caught in CI.

Verification: `npm run test:backend-setup`, `npm run test:db`, `npm run test:edge`, `npm run test:operations`, and `npm run check:staging`. The staging health check reads every configured workflow table and checks authentication on all six deployed functions without sending invitations or processing emails.

Checked 20 October 2026: all 14 hosted migrations are applied; all 22 workflow tables have RLS enabled; administrator, student, institution, nodal and family reads pass; all six functions accept the local browser preflight and enforce their authentication/public-validation boundaries. Local checks pass 154 PostgreSQL assertions plus the deficiency suite, 70 workflow/provider assertions, 21 operations assertions, setup tests, TypeScript and the pilot build. Malformed bulk-sanction targets and operation-ID lengths are now rejected before application writes; the updated workflow function is deployed. Hosted role-read and validation evidence is in `artifacts/backend/`. The full UI suite did not complete under memory pressure, and local bootstrap stopped safely because Docker's engine could not start; no local database was reset or hosted configuration overwritten.

## Hosted deployment

Track B release instructions are in `docs/staging-release.md`; evidence is in `docs/track-b-verification.md`. Track C contracts, support and evidence are in `docs/track-c-operations.md` and `docs/track-c-verification.md`. Apply all checked-in migrations before deploying the six current functions. Local tests do not establish hosted acceptance.

The CLI generated the migration. PostgreSQL commands atomically lock target versions, authorize current active accounts, deduplicate actor/operation keys with a payload SHA-256, append audit and deliver in-app updates. Browser tables allow only scoped SELECT. All external verification and payment attempts are explicitly SIMULATED.

For a disposable local test database, run `supabase test db` after local setup. Use `supabase db reset` only when intentionally discarding local data. Deployment: `supabase link --project-ref YOUR_REF`, `supabase db push`, `supabase functions deploy pilot-workflow`, `supabase functions deploy pilot-invite`, `supabase functions deploy pilot-receipt`, `supabase functions deploy pilot-accounts`, `supabase functions deploy pilot-notifications`, `supabase functions deploy pilot-operations`. Configure `PILOT_ALLOWED_ORIGINS` (comma separated exact origins) and `PILOT_INVITE_REDIRECT_URL` with `supabase secrets set`; never put the service role key in Vite variables. Disable Auth public email signup in hosted project settings too; config.toml only controls local Auth. See `docs/operations-automation.md` for the additional secrets and scheduling used by `pilot-operations`.

Embedded PostgreSQL checks run without Docker: `node scripts/test-pilot-db.mjs` and `node supabase/tests/deficiencies.mjs`. These execute the real migration, pgcrypto and workflow/RLS against minimal Auth/Storage schema fixtures; they do not exercise remote Auth, email, Storage byte transfer, Edge HTTP or Cron scheduling. `node supabase/tests/edge-syntax.mjs` parses Edge sources only. Docker/remote Supabase integration still needs the staging gate.

Bootstrap the first admin by creating an Auth user through the dashboard, then inserting its verified UUID/email/name/role='admin' into pilot_accounts through the SQL editor. All subsequent invitations use the admin-only pilot-invite function. Invite email/password accounts, never sample personal records.

Workflow takes `{action,payload,target?:{id,version},operationId}`. Student profile payload is plain fields; document registration takes `{type,title,objectPath,previousVersionId?}` and Edge derives bytes/checksum/mimeType/size. Draft takes `{schemeId,academicYear,documentIds,evidence}`; submit targets draft. Human document review takes `{status,reason,fields}`. Verification run takes `{source}`, review targets an attempt and takes `{state,reason}`. Deficiency targets an application and takes `{documentType,reason,deadline}`, correction targets deficiency and takes `{documentId}`. Stage approvals and request_payment target application; sanction takes `{signaturePath}` and amount comes from immutable scheme snapshot. Payment result targets the pending payment and takes `{status:'successful'|'failed',reason?}`. Grievance update takes `{body?,assignedTo?,status?,resolutionReason?}`. Family grant takes `{familyUserId}`, revoke targets grant. Broadcast takes `{audience:'all'|'district'|'deficiency',district?,title,body}` and returns actual `count`; officers are scoped. Baseline import takes `{rows}` with documented sourceUrl/cohort. Configuration payloads are complete scheme/institution records.

`family_summary()` returns only `{applications,payments}` with explicit safe application fields. `pilot-receipt` accepts `{token}` or GET `?token=...`, and returns only `{reference,issuedAt,hash,valid}`. The hash covers the current canonical decision chain; revocation/expiry are policy controls, not certified signing.

The migration schedules `pilot-deficiency-reminders` daily at 03:00 UTC if pg_cron is already enabled. Otherwise it emits an explicit NOTICE that reminders are not scheduled. Enable Cron in the Dashboard and execute `supabase/schedule-reminders.sql` as database owner; the helper verifies the named job and is safe to rerun. Stable notification IDs make repeated worker runs safe.

Family consent accepts `{familyEmail}` for an active invited family account (case-insensitive, trimmed); `{familyUserId}` remains supported. The lookup stays server-side and exposes no family directory. Revocation targets the returned grant version.

Reviewed fields are restricted to the document type. Marks/attendance are numeric percentages, income is nonnegative, and admission/fellowship attestations are yes/no. Department approval and sanction reevaluate immutable rules with verified document facts overriding declarations; an income certificate's `income` overrides profile `familyIncome`. Missing reviewed fields retain the declaration after explicit human verification in this pilot; certified source extraction is a production prerequisite.

Before inviting users, restore a database backup into staging and copy private Storage objects through the Storage API; database backups do not contain file bytes. Confirm a staged student can download the restored attachment and its SHA-256 matches. Keep Auth UUIDs stable when restoring accounts. Run the SQL tests against staging and exercise the full human-reviewed student journey before opening the pilot.

Track C adds account actions through `pilot-accounts` (`list`, `manage_account`, `resend_invite`, `request_erasure`), versioned scheme draft/publish/rollback/dry-run, grievance evidence/events/SLA, receipt policy and application renewal/withdrawal/appeal actions. `bulk_sanction` takes versioned `payload.targets` plus an owned `signaturePath` and returns per-record outcomes. Direct `save_scheme` through Edge is blocked; publish uses the validated server path. `pilot-notifications` is administrator-only and processes due email jobs; provider secrets remain server-only. See `docs/track-c-operations.md`.
