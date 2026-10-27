# Tribe Saarthi pilot operations

The demo and pilot are separate builds. An unset `VITE_APP_MODE` preserves the existing demo. A pilot build never falls back to demo accounts or browser-local seed data when configuration is missing.

Track C lifecycle, audit, grievance, conflict, receipt and configuration workflows are deployed to dedicated synthetic staging. See [Track C verification](track-c-verification.md) and [support/retry/rollback procedures](track-c-operations.md). C5 real Brevo delivery and Track B's remaining release gates are still open; do not treat this as participant release approval.

## Local setup

1. Use Node.js 20.19 or newer (validated on 22.23.2) and install dependencies with `npm ci`.
2. For the existing hosted backend, put `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.pilot.local`, then run `npm run dev`. Never place the service-role key in a `VITE_` variable. The password-free demo is `npm run dev:demo`.
3. For a separate local backend, start Docker Desktop and run `npm run backend:setup`. It applies pending migrations and the configuration seed without resetting data, creates a local administrator in ignored `.backend/admin.json`, and writes `.env.backend.local`. See [backend setup](../supabase/README.md) for the function/table map.
4. Run `npm run backend:serve`, then `npm run dev:local` in another terminal. Supabase supplies the local server credentials; generated function settings configure the allowed frontend origins and simulated adapters. Use `supabase db reset` only when intentionally deleting a disposable local database.
5. Provision the first administrator through the backend's bootstrap instructions. Subsequent invitations are issued from the administrator portal. Student and officer invitations require a real mailbox for Auth invitation and recovery links.

Government verification, DigiLocker, OCR extraction and DBT are simulated. Uploaded files, human decisions, application data and in-app notifications are persistent. A drawn signature is pilot approval evidence, not a certified digital signature.

## Server configuration

Supabase functions use `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and the configured allowed frontend origin. Consult `supabase/README.md` for exact function-specific environment names and bootstrap commands. Configure Auth's Site URL and allowed redirects to the frontend origin. Disable public signup and anonymous accounts. Configure Auth email delivery before inviting pilot participants.

Use different projects for staging and pilot. Do not link a development checkout to a production project by default. Review migrations before applying them. Auth accounts/roles and Storage policies must be created together; an Auth login alone does not grant a pilot role.

## Frontend deployment

Import the project into Vercel with the checked-in `vercel.json`. Set the three frontend environment variables above for the intended project, build with `npm run build`, and configure Supabase CORS/Auth redirects for the deployed origin. The public receipt route is served by the SPA rewrite; receipt records are looked up through the public receipt function, not anonymous table reads.

An environment-variable change needs a new frontend build. Never publish a pilot build connected to a staging database containing real participants unless this is intentional and authorized. Keep demo and pilot on separate origins; this also separates service-worker caches.

## Offline behavior

Load the account once online. Student drafts, pending uploads and grievances, plus officer notes, may be saved to IndexedDB. Submission, decisions, sanctions, payments and family access require connectivity. Queued items are synced only after a committed backend acknowledgement. Version conflicts require refresh and manual resolution; there is no forced overwrite.

Signing out or changing accounts removes cached private data and pending operations after the UI warns about unsynced work. Shared devices should always be signed out. IndexedDB is local device storage, not an encrypted vault. Family consent is checked online for each new request. Previously seen information cannot be recalled from another person's memory or screenshots.

## Baseline imports

CSV headers must be exactly:

```csv
state,district,academicYear,population,enrolled,beneficiaries,sourceUrl
```

Use a public HTTPS source URL and consecutive academic year such as `2026-27`. `beneficiaries` may be blank. Numbers must be nonnegative integers, and beneficiaries cannot exceed enrollment. Quoted commas are supported. Formula cells, malformed rows and duplicate cohorts are rejected.

District enrollment and a pilot sample are displayed separately. An operational pilot coverage rate is shown only when the imported cohort explicitly describes `pilot enrolled ST students`, its reporting year matches the single active pilot year, and its denominator equals the scoped pilot cohort. Simulated payment beneficiaries remain labeled simulated. This is not an estimate of district-wide scholarship coverage.

## Validation and release gate

Run `npm test`, `npm run typecheck`, `npm run build`, `npm run build:pilot`, `npm run test:db`, and `npm run test:edge`. Install browser binaries with `npx playwright install chromium`, then run `npm run test:browser`. Database assertions execute PostgreSQL with Auth/Storage schema fixtures; Edge checks execute Request/Response handlers with a synthetic transport; browser checks use synthetic API responses. Run hosted backend tests according to `supabase/README.md` against a disposable staging database. Exercise these scenarios using at least two students, two institutions, a nodal officer, an administrator and a family account:

- Invitation acceptance and recovery; denied public registration; inactive and expired sessions.
- Cross-account and cross-institution access denial, including direct API and Storage requests.
- Real file upload, preview, immutable replacement and attachment reuse.
- Advisory discovery followed by authoritative submit validation, including missing documents, deadlines and duplicates.
- A source outage stays pending; a discrepancy requires a human; correcting one deficiency leaves other deficiencies open.
- Institute/department/sanction gates; failed simulated payment, retry and successful result.
- Repeated operation IDs return one result; stale versions conflict; transaction failures leave no partial audit/notification changes.
- Targeted broadcasts, grievance assignment/replies/resolution, family consent grant/revoke.
- Offline refresh and restart, queued file upload, dropped acknowledgement, expired session and account switching.
- Receipt QR resolves with no personal details; receipt hash stays fixed while the application's current status changes.
- Empty analytics, overlapping beneficiary schemes, distinct reporting periods and incompatible baselines.
- Keyboard-only forms/dialogs, mobile file/camera capture, English/Hindi critical labels and voice text fallback.

Do not treat a passing frontend test suite as evidence that remote RLS and Storage policies are deployed correctly. Save the database/API test output and staging evidence with the release.

## Monitoring, backups and restore

Use Supabase function logs and database job state to inspect failed requests and queued reminders. Log operation IDs and safe error codes, not document bodies, profile payloads, tokens or identity numbers. Review failed jobs and payment attempts daily during the pilot.

Configure managed database backups before collecting pilot data. Database backups do not contain Storage file bytes: back up the private bucket separately, with restricted credentials, along with a manifest of object paths and checksums. Keep migrations, configuration and key-management records outside the restored database. Do not export service keys into frontend artifacts or general logs.

Restore into a separate staging project first. Restore the database and file objects, reconfigure Auth URLs/function secrets, then test login, private preview, record counts/checksums, receipts, revoked family grants and a new workflow action. A backup is considered usable only after this restore exercise succeeds. Never overwrite the pilot database to rehearse restore.

## Current release status

Track B is in progress. Dedicated Supabase/Vercel staging is deployed at `https://tribe-saarthi-staging.vercel.app`. B2 hosted authorization and B3 separate-project database/Auth/private-byte restore pass. Daily reminder Cron is configured. Brevo settings/apply tooling are prepared; the owner will provide credentials later. Invitation acceptance, scheduled protected backups, delivered alerts and malware scanning/risk acceptance remain open. Follow [staging-release.md](staging-release.md) and [track-b-verification.md](track-b-verification.md) for the procedure and evidence.

Implementation and local validation are recorded in `.gsd/STATE.md`. Live deployment, configured mail delivery, managed backups and a remote restore test require authenticated Supabase/Vercel access. Until those checks are complete, this is a deployable pilot implementation, not a verified live release. Production dependency audit has no findings; seven development-only Tailwind/transitive styling findings remain. Resolving them requires a separate styling-tool migration; keep development servers private.


## Current operations automation

Daily encrypted database/Auth/private-byte backups, verified encrypted off-provider copies, five-minute monitoring/email workers and real failure/recovery administrator notices are now enabled. See [operations evidence and limits](operations-automation.md) and [owner-only actions](owner-actions.md). Earlier procedure paragraphs are not a claim that these jobs remain unconfigured. Real email delivery, government access, device checks and participant-release decisions still require owner input.
