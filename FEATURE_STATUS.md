# Feature Status & Gap Audit — Tribe Saarthi / Adimool

**Project:** SIH 2026 · PS 26238 — Unified Scholarship Platform for Tribal Students  
**Audit date:** 18 October 2026  
**Scope:** Current repository (`demo` build + `pilot` build)

**Latest frontend audit:** Connections and officer-note privacy fixes verified; see `docs/frontend-connections.md` and the final update below.

---

## 0. Read this first

This repository contains **two separate products**:

| Build | Entry point | Data layer | What it is |
|---|---|---|---|
| **Demo** | `npm run dev` (default mode) | `localStorage` + seeded data | A polished, evaluator-facing prototype. Most features work locally against realistic seeded records. |
| **Pilot** | `npm run dev -- --mode pilot` / `npm run build:pilot` | Supabase Auth + PostgreSQL + private Storage | Deployed to dedicated staging. Hosted authorization, real bytes and separate-project restore are verified; invitation delivery and operations release gates remain open. |

**Bottom line**

- Track A hardens the local demo: government integrations, OCR and payment remain explicitly simulated; unsupported integrity, offline-sync and language claims are removed.
- The pilot is deployed to staging with hosted RLS/Auth/Storage and restore evidence. It has no real government connector, OCR, SMS/IVR, PFMS/DBT or certified e-Sign; full release still requires invitation delivery and operational checks.
- Historical task-checklist completion does not establish production readiness. Current Track A test/build evidence is recorded in `docs/track-a-verification.md`; the original 39-test count was the pre-Track A baseline.
- No feature involving an external government system is production-complete.
- Track B B2/B3 are verified. Dedicated Supabase/Vercel staging is deployed. Brevo settings/apply tooling are prepared; the owner will supply SMTP credentials later. B1/B4/B5 remain open; see `docs/track-b-verification.md`.

**Phase-level reality check (`TASKS.md`)**

| Phase | Checkbox status | Actual stage |
|---|---|---|
| 1. Core models, seed, eligibility engine | All checked | ✅ Working demo core; 4 schemes, not 5 |
| 2. Application state machine & verification | All checked | Track A stage/source/document gates verified; pilot checks run on the server |
| 3. Document wallet & cross-scheme reuse | All checked | Demo attachment links/reuse counts persist; pilot stores real private bytes and immutable versions |
| 4. Officer portal & coverage analytics | All checked | Demo uses illustrative constants; pilot uses scoped cohort metrics and explicitly comparable imported baselines |
| 5. Broadcasts, deficiency resolver, audit CSV | All checked | Scoped targets, typed deficiencies/deadlines and audit export work; no tamper-evident audit claim |
| 6. QR slip, PVTG matrix, voice, offline queue, E2E tests | All checked | Unsupported demo QR/hash/offline claims removed; pilot has receipt lookup and durable queue; Santali voice not implemented |
| 7. History, kill-a-source, badges, languages, tour | All checked | Tour navigation/highlights and source outage routing work; translations remain partial and history payments are simulated |
| 8. APAAR/ABC, Aadhaar OTP, e-Sign | All checked | APAAR/OTP remain demo mocks; drawn/typed acknowledgement is persisted and viewable, not certified e-Sign |

**Status legend**

| Mark | Meaning |
|---|---|
| ✅ | Working within its stated environment; main flow verified by tests or direct code inspection |
| 🟡 | Partial — main path works, but specific required behaviour is missing or broken |
| 🔶 | Simulated — UI/flow exists, but the underlying service is fake |
| ❌ | Not implemented |

**Stage legend**

| Stage | Meaning |
|---|---|
| **Demo only** | Runs against `localStorage` and seeded records; no server |
| **UI mock** | Screen exists, but the action is cosmetic or hard-coded |
| **Simulated adapter** | A deterministic local substitute for a real external service |
| **Pilot backend (local)** | Real Supabase/Postgres code and local tests; never deployed |
| **Deployment pending** | Hosted configuration, credentials or external access still required |
| **Not started** | No meaningful implementation |

**Verification run for this audit**

| Check | Result |
|---|---|
| `npm run typecheck` | ✅ 0 errors |
| `npm test` | ✅ 7 files, 39 tests passed |
| `npm run build` | ✅ passed |
| `npm run build:pilot` | ✅ passed |
| `npm run test:db` | ✅ PostgreSQL migration + 36 workflow/security assertions (fixtures, not hosted) |
| `npm run test:edge` | ✅ 17 Edge Request/Response assertions (synthetic transport) |
| `npm run test:browser` | ✅ built pilot login, offline reload, durable draft replay, logout, mobile layout (synthetic Supabase API) |

The DB, Edge and browser checks are **local validation with fixtures**. They do not prove that hosted Supabase Auth, RLS, Storage bytes, email delivery or Cron are configured correctly.

---


- Track C C1-C4/C6-C9 are implemented and verified in dedicated staging: account lifecycle, filtered audit exports, reviewed offline conflicts, grievance evidence/SLA, analytics charts/exports, decision receipts, application lifecycle and versioned configuration. C5 remains open for deferred Brevo credentials and real delivery. See `docs/track-c-verification.md`.

## 1. What is actually working completely

### 1.1 Demo build

Track A implementation is complete; final verification evidence is recorded in `docs/track-a-verification.md`. Completion here means a local demonstration, not production authorization or a hosted release.

| Feature | Status | Evidence / notes |
|---|---|---|
| Persona switching | ✅ demo | Header options come from `USERS`; every student/officer/admin switches correctly. |
| Deficiency correction | ✅ demo | Real document type, validated date, owned corrected-version selection and review. |
| Document reuse | ✅ demo | Persisted `documentIds`; counts derived from distinct application links; replace/remove supported. |
| Verification routing and stage gates | ✅ demo | Source-down → `pending_verification`; exceptions → `manual_review`; all sources and required documents gate advancement. |
| Sanction and payment | ✅ demo | Department approval, stored acknowledgement, `sanctioned`, separate simulated disbursement. |
| Receipt and audit integrity claims | ✅ removed | Printable demo summary only; fake hash/QR/seal removed. Local audit explicitly has no integrity guarantee. |
| Broadcast targeting | ✅ demo | All/district/deficiency audiences; actual counts; in-app only. |
| Coverage labels | ✅ demo | Lowest/highest coverage chosen from a sorted copy; empty/single inputs tested. |
| Offline sync claims | ✅ removed | Toggle/queue indicator removed; no demo offline-replay promise. Pilot queue unchanged. |
| Guided tour | ✅ demo | Five real targets, persona switch, scroll/highlight and cleanup. |
| Saarthi and language claims | ✅ demo | English/Hindi template answers and browser voice preview; no Santali answer option. UI language selector explicitly covers navigation labels only. |

### 1.2 Pilot build

Current hosted/local evidence is recorded in `docs/track-b-verification.md` and `docs/track-c-verification.md`:

| Feature | Status | Evidence / notes |
|---|---|---|
| Invite-only email/password Auth, session restore, password recovery | Hosted; mail pending | Auth/redirects/session checks and lifecycle controls pass; invitation/recovery delivery awaits deferred SMTP. |
| Role-scoped reads and server-only writes | Hosted verified | RLS and service-only commands; hosted cross-account/role/session denials pass. |
| Transactional workflow state machine | C verified | Base and extended versioned commands; 80 PostgreSQL assertions plus the separate deficiency suite. |
| Operation idempotency and optimistic concurrency | ✅ local | `pilot_private.operations` keyed by actor + operation ID + payload digest; target version checks return 409. |
| Private document upload, checksum, immutable review and versions | Hosted verified | Actual byte/MIME/SHA-256 checks; authenticated private-byte previews; Storage/restore proof from B3. |
| Authoritative submit validation | ✅ local | Server re-checks profile, scheme, deadline, required documents, ownership and rules; browser-side eligibility is advisory only. |
| Deficiency → correction → re-verification | ✅ local | Multiple deficiencies, per-document correction, stage return, unresolved-deficiency guard before approval. |
| Institution → department → sanction gates | ✅ local | Role/stage checks, required human verification states, verified-document checks, immutable rule snapshot. |
| Simulated payment attempts and results | 🔶 | `request_payment` + `payment_result`; no PFMS/DBT/bank integration. UI and server clearly label it simulated. |
| Immutable receipt + public QR verification | C7 verified | Canonical decision hash, stable opaque QR, optional expiry/revocation; minimal reference/issuedAt/hash/valid response. |
| Family consent grant/revoke + minimal online summary | ✅ local | Invited family account lookup server-side; `family_summary()` exposes safe application/payment fields only. |
| In-app notifications and targeted broadcasts | C5 in progress | In-app and grievance notices work; critical email queue/adapter/attempt history prepared; real Brevo delivery pending. |
| Grievances: create, reply, assign, resolve | C4 verified | Private evidence, categories/SLA, owner notices, priority, escalation, resolution appeals and timeline. |
| Pilot analytics + strict CSV baseline import | C6 verified | Scoped exports/charts include source/cohort/comparability; manual import remains; no district-wide inference. |
| Offline snapshot + durable action queue | C3 verified | Durable queue plus explicit local/server draft comparison and new-ID reviewed retry; browser conflict check passes. |
| Scoped audit trail | C2 verified | Atomic append-only writes; RLS-scoped server filters, 50-row pages, details and CSV/JSON exports. |
| Admin configuration: invites, scheme/institution edits, baseline import | C1/C9 verified | Account controls; scheme draft/diff/dry-run/publish/history/rollback; institution activation. Mail delivery/bulk invite remain open. |
| Contextual Saarthi (English/Hindi) + optional browser voice | ✅ local | `PilotAssistant.tsx`; 3 tests verify open corrections, source-down messaging, no cross-student leakage. No LLM and no Santali/Odia/Telugu. |

---

## 2. Feature-by-feature status: demo build

Updated after Track A (A1–A12), 18 October 2026. The prototype remains local, synthetic and editable in browser storage.

### D1. Demo login, role switching and access control

**Status:** ✅ Persona switching · 🟡 Demo access control

- Seeded IDs and names drive every header option and login label; student and officer navigation changes with the session.
- Demo authentication is not a server security boundary. Institution/state data scoping and a true family portal remain pilot concerns.

### D2. Student dashboard, APAAR/ABC card and quick deficiency fix

**Status:** ✅ Honest demo card and scoped correction

- APAAR/ABC values are labelled synthetic; missing data says “Not provided”; institution name comes from the selected student's institution.
- Fake credential QR removed. No verified-beneficiary, certified credential or live DigiLocker claim.
- Dashboard correction buttons open the actual correction workflow. The wallet allows corrected versions for existing types; unchanged/wrong-type/foreign selections are rejected and unrelated deficiencies stay open.
- Demo versions edit text in place. Immutable file versions, real identity/credits and issuer checks are outside this build.

### D3. Explainable eligibility engine

**Status:** ✅ Core engine · 🟡 Demo evidence

- Four seeded schemes, deterministic rule results and rule-by-rule explanations. Counts and copy agree.
- Attendance and some admission evidence remain demo assumptions; no official eligibility decision, live scheme feed or rule editor.

### D4. Discovery, apply and application state machine

**Status:** ✅ Track A demo workflow

- Submission links current owned documents; the tracker lets students replace/remove attachments and re-run verification.
- Explicit pending/review statuses, required-source/document gates and terminal-state protection.
- Department approval stays at `department_stage`; signed sanction produces `sanctioned`; payment is a distinct action.
- No production server authorization or full draft/renewal/appeal workflow in this demo.

### D5. Document wallet, DigiLocker and OCR

**Status:** ✅ Demo attachment/reuse · 🔶 Simulated document sources

- Application links persist. Reuse counts are recalculated from distinct links, including replacement/removal; foreign documents are rejected.
- Corrected documents are unverified/mismatched until reviewed. Simulated DigiLocker samples persist via store actions.
- Uploads/camera/OCR are generated sample text, explicitly labelled. No file bytes, camera stream, QR decoding, UIDAI or DigiLocker integration.

### D6. Verification pipeline and exception routing

**Status:** ✅ Demo engine and store integration · 🔶 Simulated sources

- Five checks; source-down parks the application; mismatch/unverified documents go to human review. A source outage cannot be manually converted into a pass.
- Review completion checks every source and returns to the appropriate human stage. Required document checks run in both store and UI.
- No real registry/issuer lookup or cryptographic certificate validation.

### D7. Officer review, deficiency, acknowledgement and DBT

**Status:** ✅ Track A demo workflow

- Officers choose the required/attached document type, reason and a valid correction deadline. Wrong-type, foreign and unchanged corrections are rejected.
- Stored signer, PNG acknowledgement, timestamp and sanctioned amount survive reload. A separate PFMS simulation records payment exactly once.
- Drawn and typed acknowledgements are explicitly not certified e-Sign. No PKI, timestamp authority, bank transfer or official sanction is asserted.
- Receipt is a printable local summary; fabricated SHA-256/QR/seal removed (the removal option in A7).

### D8. Notifications and officer broadcasts

**Status:** ✅ Targeted local in-app delivery · ❌ External channels

- All/district/open-deficiency audiences use actual loaded students, deduplicated per student. Preview count equals created notices; action is audited.
- SMS/IVR are marked not connected. No external delivery, retry/provider acknowledgement or real-time push.

### D9. Grievances

**Status:** 🟡 Existing demo only (unchanged by Track A)

- Student ticket creation/status works locally. No officer grievance route, replies, evidence, SLA, escalation or resolution notes.

### D10. Coverage-gap and PVTG analytics

**Status:** ✅ Calculation/labels · 🔶 Demo baseline

- Lowest coverage is worst, highest is best, independent of input order. Empty and single-district inputs are tested.
- Pattern-fit demo baselines and three synthetic student records do not establish district-wide coverage. No real ingestion, CSV export or time series.

### D11. Audit log

**Status:** ✅ Local event history · ❌ Integrity guarantee

- Actor/action/entity/timestamp, search, actor filter and CSV export remain available.
- Labels now say local demo history with no cryptographic chain. Browser storage can be edited/reset; no server retention or immutable ledger.

### D12. Saarthi assistant

**Status:** ✅ English/Hindi templates · 🔶 Browser voice preview

- Answers are scoped to the selected student; Hindi prompts receive Hindi template answers. Persona changes reset the chat.
- Santali answer option removed. No LLM, reviewed Santali translation, action execution, multi-turn reasoning or server speech fallback.

### D13. Multilingual UI

**Status:** 🟡 Navigation labels only, explicitly labelled

- Six navigation language choices remain; most page/forms/error content is English. Full-page translation and translation review remain unimplemented.

### D14. Offline / low-connectivity

**Status:** ✅ Unsupported claim removed

- Header states “Local demo - no offline sync”; toggle and queue indicator removed. The unused legacy demo network module is not a working replay engine.
- The pilot's IndexedDB queue/service worker is unchanged and verified separately.

### D15. Guided tour

**Status:** ✅ Five-target local demo

- Correct persona and route for each beat, visible highlight and scroll, keyboard/buttons, auto-play and cleanup.
- Closed tour no longer redirects the app. No tooltip anchoring or automatic pause on interaction is promised.

---

## 3. Feature-by-feature status: pilot build

### P1. Authentication, invitations and account lifecycle

**Status:** Implemented and hosted-verified; invitation email delivery pending.

- Administrator list, pending-invitation filter and resend; versioned deactivate/reactivate and role/state/institution changes.
- Deactivation denies existing JWT reads/Storage/Edge, revokes refresh sessions and bans Auth. Reactivation needs a fresh sign-in. Role changes use current database authorization immediately.
- Self-service erasure request with administrator-visible reason; retention review is required and audit history is preserved.
- Supabase redirects, signup lockdown and owner admin login are configured. Brevo credentials and actual invitation/recovery delivery remain deferred; no mail delivery claim.


### P2. Server workflow, RLS and audit transactionality

**Status:** ✅ Code-complete · **Stage:** Pilot backend (local), deployment pending

**Works**
- `pilot_command` is the single write path; only `service_role` can execute it.
- Actor must be active; role/stage/scope checks are server-side.
- Versioned commands cover the base and Track C pilot lifecycle.
- `pilot_private.operations` provides idempotency; target version mismatch returns 409.
- Audit and in-app notifications are written in the same transaction as the action.
- RLS limits browser reads: own student/family records, institution-scoped students, state-scoped nodal, admin all.
- 41 PostgreSQL assertions cover workflow, security and atomic quotas; hosted authorization evidence includes 76 matrix assertions and five expiry/signup/CORS/inactive checks.
- Hosted cross-account/role denials and seven browser role logins pass; request IDs and screenshots are retained.

**Not done**
- Broader penetration/load tests and gateway/IP abuse protection remain open. Shared Edge quotas are implemented; local DB tests still use schema fixtures alongside separate hosted checks.
- No field-level encryption or at-rest encryption beyond the database/storage provider defaults.
- No record retention/erasure policy.
- Audit rows are append-only from the app's perspective but have no cryptographic chain or external timestamp.
- General snapshots still load scoped operational tables in pages; audit uses separate filtered 50-row queries. Large-cohort loading remains a Track E concern.

### P3. Student profile and APAAR/ABC

**Status:** 🟡 Partial · **Stage:** Pilot backend (local)

**Works**
- Profile fields: name, DOB, father/guardian, tribe, income, PVTG, gender, course level/course/year, institution, state/district/village, masked Aadhaar.
- Server validates income, DOB, PVTG flag, Aadhaar last-4, institution existence and allowed fields.
- `apaarId` and `abcCredits` are accepted server-side.

**Not done**
- No UI for APAAR ID or ABC credits.
- No APAAR/ABC API integration; no verification of the 12-digit ID or credits.
- No profile photo, bank account, disability, hostel/day-scholar or other scheme-specific fields.
- No profile change history/version diff UI.

### P4. Scheme rules and eligibility

**Status:** 🟡 Partial · **Stage:** Pilot backend (local)

**Works**
- Four schemes seeded from `src/data/schemes.ts` with server-validated rule objects.
- Eligibility is advisory in the browser and authoritative on submit.
- Rules are re-evaluated at department approval/sanction using verified document facts where present.
- Admin can edit scheme JSON with version checks.

**Not done**
- Only four schemes; no NSP/SFMP/NOS live catalogue.
- Rules support only `max`, `min`, `eq`, `in`; no OR groups, scheme-specific document matrices, domicile exceptions, renewal rules, age limits or course-approved-list checks.
- Institution basket is data-driven, but there is no official basket import.
- The seeded rules/rates include “PILOT CONFIGURATION: confirm official rules/rates before live use”; they are not confirmed against current MoTA notifications.
- No rule simulation/dry-run UI before publishing a scheme.

### P5. Application drafting and submission

**Status:** ✅ Code-complete · **Stage:** Pilot backend (local)

**Works**
- Draft saves with declared evidence and immutable document IDs.
- Browser shows advisory eligibility; server re-evaluates on submit.
- Server checks active scheme, academic year, deadline, required documents, document ownership, duplicate application/year and evidence ranges.
- Submission stores profile/scheme/document snapshots and a receipt token/hash.
- Application statuses: draft → institute_stage → department_stage → sanctioned → disbursed, plus deficiency/rejected.

**Not done**
- No application edit after submission (except deficiency correction).
- One application per student/scheme/year; next-year renewal creates a linked draft with reused documents and a server eligibility delta.
- No bulk apply; draft save/resume and reasoned pre-decision withdrawal are supported.
- Rejection appeal, authorized fresh review and reasoned pre-decision withdrawal are available.
- No deadline extension or grace-period configuration.

### P6. Document vault and review

**Status:** ✅ Code-complete · **Stage:** Pilot backend (local), hosted Storage unverified

**Works**
- Real PDF/JPEG/PNG upload, max 10 MB.
- Server validates byte signature, MIME, size and SHA-256; file paths are owner-scoped.
- Immutable versions; corrections reference a previous version.
- Human review records status/reason/fields; reviewed documents cannot be edited.
- Private previews fetch authenticated bytes under current RLS; existing signed URLs retain their original short lifetime.
- File bytes are validated again by the Edge Function before registration.

**Not done**
- No real OCR or certified extraction; reviewed fields are human-entered.
- No malware/virus scan, content disarm, image-quality check or duplicate-document detection.
- No DigiLocker fetch or issuer verification.
- No document deletion/retention workflow.
- Hosted Storage byte transfer and restore have not been exercised.
- No bulk document review.

### P7. Multi-source verification and human review

**Status:** 🔶 Simulated · **Stage:** Pilot backend (local)

**Works**
- `run_verification` creates a simulated check for identity, ST certificate, income, institution or academic.
- `sourceDown` creates `source_down`; never auto-passes.
- Human `review_verification` records verified/mismatch with a reason and reviewer.
- Stage approval requires the latest relevant sources to be verified.
- Role limits: institution can run/review institution/academic; nodal can run/review identity/ST/income; admin all.

**Not done**
- No real Aadhaar e-KYC, state ST certificate DB, e-District income, AISHE or institution SSO integration.
- A normal `run_verification` always produces `manual_review`, not an automated result; it is a human-review stub.
- No source latency/retry/circuit-breaker/observability.
- No evidence payload from a government source; reviewers see only a status/reason.
- No four-eyes or conflict-of-interest check.

### P8. Sanction, e-Sign and payments

**Status:** 🟡 Partial · **Stage:** Pilot backend (local)

**Works**
- Department approval then separate sanction action.
- Signature upload is required and path-owned; amount comes from the immutable scheme snapshot.
- Payment request and result are separate; failed payment can be retried.
- Successful result marks application `disbursed` and records `disbursedAmount`.
- UI clearly labels payment as simulated.

**Not done**
- Signature is a drawn PNG or typed-name canvas, not a certified digital signature; no PKI/DSC/IT Act e-Sign.
- No PFMS/DBT, bank account verification, NPCI mapping, payment reconciliation or transaction status feed.
- No sanction order PDF generation or official seal.
- No batch sanction or delegated approval limits.
- No audit of signer identity beyond the logged-in officer account.

### P9. Receipts and public verification

**Status:** C7 verified locally and in hosted/browser checks.

- Stable opaque QR token with minimal public `{reference,issuedAt,hash,valid}` response and the existing public request quota.
- Canonical SHA-256 chain covers later audit decisions and application snapshot digests. Existing receipts begin from a migration checkpoint; submission hashes remain preserved internally.
- Authorized nodal/admin revocation and optional policy expiry require reasons and are audited. Public verification remains usable after status changes and shows invalidity after revocation/expiry.
- This is not a certified signature or external timestamp. The shared global lookup quota needs gateway/IP throttling before a larger rollout.


### P10. Family consent and family view

**Status:** ✅ Code-complete · **Stage:** Pilot backend (local)

**Works**
- Student grants access by invited family email (case-insensitive, server lookup).
- Revocation is versioned and immediate.
- Family sees only safe application/payment fields through `family_summary()`.
- Family data is online-only; no offline cache.
- Cross-family data is not exposed.

**Not done**
- Hosted email invitation/delivery is not configured.
- No separate family onboarding/consent explanation screen.
- Family cannot download receipts or documents.
- No guardian relationship verification beyond the invited account.
- No audit of family views.
- Demo build has no family portal at all.

### P11. Notifications, broadcasts and reminders

**Status:** In-app and reminder Cron verified; C5 provider acceptance pending.

- Existing scoped broadcasts and in-app notices remain authoritative. Grievance create/assign/escalate/update notify the owner and student.
- Deficiency, sanction and payment-result notices atomically enqueue an email attempt. Brevo acceptance requires a provider message ID; attempts, failures, backoff and missing-credential blocked states are visible.
- Administrator processes due attempts from Notifications. Unknown sends require provider reconciliation. Real provider delivery and automatic scheduling await deferred credentials.
- SMTP invitation/recovery and transactional API email use separate Brevo credentials. SMS/IVR, push, preferences, bounce/delivery webhooks and scheduling are not enabled.


### P12. Grievances

**Status:** C4 verified in PostgreSQL, hosted APIs and browser.

- Private immutable wallet evidence, configurable categories/SLA, priority, visible owner/due date and assignment/update notifications.
- Scoped replies, assignment, resolution notes, overdue escalation to administrator, reopen/appeal and append-only change/message timeline.
- Open/overdue/resolved metrics and authorized private-byte preview. Real email/SMS acknowledgement remains pending C5.


### P13. Analytics and baseline import

**Status:** C6 verified; live scoped data with manual baseline import.

- Scoped counts, current-stage funnel, PVTG cohort, coverage table and accessible meter charts.
- CSV exports use the displayed computed snapshot and include source URL/year/population, cohort counts and comparability flags/reason. Nodal export is scoped to its state.
- Explicit pilot-only banner. A coverage rate requires matching year, population and cohort size; no district-wide denominator is invented.
- Strict manual CSV import remains. No UDISE+/Census feed, scheduled refresh or trend/time-series is claimed.


### P14. Audit trail

**Status:** C2 verified locally and through a real hosted CSV download.

- Append-only command audits with actor/action/entity/time and existing institution/state RLS scope.
- Server-filtered actor/action/entity/date queries, 50-record pages, details and filtered CSV/JSON exports. Spreadsheet formula cells are neutralized.
- Snapshot loading no longer fetches the entire audit table; exports page through the selected frozen time range.
- General audit storage has no external immutable archive or timestamp; the C7 decision chain applies to receipts. Read/export auditing and retention archival remain future work.


### P15. Offline mode

**Status:** C3 verified with unit and built browser/IndexedDB/service-worker checks.

- Non-family scoped snapshots; only draft/upload/grievance/officer-note operations queue. Server acknowledgement is required before removal; transient failures and 429 respect backoff.
- Conflicted drafts show local changes and current server data. Explicit reviewed retry re-reads the version and uses a new operation ID. A second change requires another review; unrelated queued work remains. Discard is available.
- Final submission, decisions, payments and family access require connectivity. There is no automatic overwrite, closed-app background sync or IndexedDB encryption claim.
- Sign-out warns before clearing unsynced local work. Already downloaded/device-cached bytes cannot be remotely revoked.


### P16. Saarthi in pilot

**Status:** 🟡 Partial · **Stage:** Template NLG + browser speech

**Works**
- Answers from authorized application/document/payment/verification state.
- English/Hindi templates.
- Explains deficiencies, source-down checks and simulated payments.
- Optional browser speech recognition and synthesis with text fallback.
- Tests ensure no cross-student leakage.

**Not done**
- No LLM; intent detection is regex over a few keywords.
- No Santali, Odia, Telugu or Ho; only English/Hindi.
- Voice recognition depends on browser support; no server speech fallback.
- No multi-turn memory or follow-up context beyond the last answer.
- No ability to perform an action (upload, submit, pay) from chat.
- No ticket creation/escalation.

### P17. Admin configuration

**Status:** C9 verified in database, hosted APIs and browser.

- Separate unpublished scheme drafts with diff, shared submission/dry-run rule evaluator, explicit publish and optimistic published-base checks.
- Published version history and rollback as a new version; submitted rule/profile snapshots remain unchanged.
- Versioned institution configuration with activation controls; inactive institutions block new profile/draft/submission work. Manual baseline import remains.
- Account lifecycle is covered by C1. Bulk invitations/CSV onboarding, approval quorum and certified government catalogue synchronization are not implemented.


### P18. Deployment, operations and security hardening

**Status:** 🟡 In progress · **Stage:** Deployed staging; B2/B3 verified, release gate incomplete

**Implemented/prepared (Track B)**
- Dedicated `tribe-saarthi-staging` Supabase/Vercel deployment at `https://tribe-saarthi-staging.vercel.app`; both migrations, configuration seed and three Edge Functions deployed.
- Service-only atomic Edge quotas, `Retry-After`, request IDs and redacted error logs; offline uploads retain bytes/operation IDs on throttling. Local tests pass.
- All three hosted workflow/invite/receipt quota routes return 429 with retry intervals; synthetic test counters were cleared afterward. Security advisors report no ERROR findings; remaining warnings are documented in release evidence.
- Hosted matrix (76 assertions), expiry/signup/CORS/inactive checks (5), seven browser role logins, QR/anonymous receipt and health pass with real hosted services.
- Six private files, pilot record counts and seven Auth UUIDs restored to a separate project; the same student password/UUID logs in and downloads its checksum-matching preview.
- Daily deficiency reminder Cron configured at 03:00 UTC; manual invocation succeeds. Brevo connection settings and guarded apply script prepared; credentials deferred by owner.
- Reproducible staging/operator instructions: `docs/staging-release.md`; evidence and open gates: `docs/track-b-verification.md`.

**Not done**
- Owner administrator email delivery and accepted student/officer invitations still need Brevo credentials; Auth redirects/signup lockdown are verified.
- Scheduled protected/off-device backups, failure alert delivery and a Cron failed-run exercise remain open; one-off restore proof does not enable an automatic backup policy.
- Gateway/WAF protection, aggregate upload-byte quotas, anomaly detection and malware scanning or an owner-approved risk decision remain open.
- Ten-client small-cohort snapshot p95 is 1,758 ms; the latest workflow p95 is 6,011 ms, exceeding the provisional 5,000 ms budget. Expected pilot volume and service targets are not yet agreed.
- Seven development-only styling-tool advisories remain (Tailwind/transitive); production dependency audit is clean.
- A pilot PWA manifest/install flow now exists; the real-device acceptance gate remains open for the “mobile application” requirement; physical installation/camera/notification proof is still needed.

---

## 4. Known defects that undercut current claims

Original audit findings below: demo findings 1–15 are resolved or their claims removed by Track A. Hosted proof finding 16 is resolved by Track B B2/B3; pilot findings 17–20 remain open.

| # | Defect | Where | Impact |
|---|---|---|---|
| 1 | ✅ Resolved/claim removed — Demo persona dropdown uses non-existent user IDs| `components/layout/index.tsx` | Selecting institution/nodal personas silently logs in as the default student. |
| 2 | ✅ Resolved/claim removed — Demo deficiency uses `docKey: 'caste'`| `store/data.ts` | `caste` is not a `DocKey`; the student correction lookup finds no document. |
| 3 | ✅ Resolved/claim removed — Demo `reuseCount` is never incremented| `store/data.ts` | “Cross-scheme reuse” is a static seeded number, not a working feature. |
| 4 | ✅ Resolved/claim removed — Demo `attachDocsToApplication` only audits| `store/data.ts` | Attaching documents to an application does nothing. |
| 5 | ✅ Resolved/claim removed — Demo application status ignores `source_down`| `store/data.ts` | App stays `submitted` while UI claims pending; no pending status exists. |
| 6 | ✅ Resolved/claim removed — Demo institution/dept approvals do not check all checks| `store/data.ts` | Stages can be advanced with outstanding exceptions. |
| 7 | ✅ Resolved/claim removed — Demo sanction jumps to disbursed and ignores signature| `store/data.ts`, `ReviewQueue.tsx` | No separate sanction record; e-Sign is not evidence. |
| 8 | ✅ Resolved/claim removed — Demo acknowledgement “SHA-256” is a 32-bit hash in a fake prefix| `pages/Student/Application.tsx` | The slip is not cryptographically sealed or tamper-evident. |
| 9 | ✅ Resolved/claim removed — Demo broadcast ignores target audience| `pages/Officer/NotificationsAdmin.tsx` | District/deficiency selection still notifies every student. |
| 10 | ✅ Resolved/claim removed — Demo coverage “worst/best” both point to the last district| `engines/coverage.ts` | Misleading intervention labels. |
| 11 | ✅ Resolved/claim removed — Demo tour selectors are never used| `components/demo/DemoTour.tsx` | No actual highlight/spotlight; the “guided” part is only a banner. |
| 12 | ✅ Resolved/claim removed — Demo offline queue has no callers| `store/network.ts` | Offline toggle never queues anything; replay is cosmetic. |
| 13 | ✅ Resolved/claim removed — Demo Santali Saarthi has no Santali intents/answers| `components/saarthi/index.tsx`, `engines/saarthi.ts` | Language option is cosmetic; TTS falls back to Hindi. |
| 14 | ✅ Resolved/claim removed — Login/dashboard copy says “5 schemes”; seed has 4| `pages/Auth/Login.tsx`, `pages/Student/Dashboard.tsx`, `data/schemes.ts` | Inconsistent product claim. |
| 15 | ✅ Resolved/claim removed — Demo seed names differ from login labels| `data/coverage.ts` vs `Login.tsx` | Confusing demo personas. |
| 16 | ✅ Resolved — hosted RLS/Auth/Storage, expiry and separate-project restore proved | `artifacts/track-b/*` | Seven scoped accounts, real file bytes, same-UUID login and preview checks passed. |
| 17 | Resolved C4: grievance assignment notices | `pilot_command` | Create/update/escalate notify the owner and student. |
| 18 | Resolved C2: scoped filters, pages, details and CSV/JSON | `pilot/PilotApp.tsx` | Actual hosted filtered export passes. |
| 19 | Resolved C3: reviewed retry and discard | `pilot/PilotApp.tsx` | Built browser stale-draft comparison/retry passes. |
| 20 | Resolved C7: decision-aware receipt chain | `pilot_command` | Later decisions and revocation extend the canonical digest. |

---


## 5. Remaining capabilities and acceptance gates

| Missing capability | Stage | Specific missing piece |
|---|---|---|
| **DigiLocker** | D1 contract/consent registry; provider gate open | No authorized OAuth/issuer connection, document fetch, signature validation or provider revocation proof. Demo inserts a fake verified document. |
| **UIDAI Aadhaar e-KYC** | Simulated adapter only (demo) | Any 6-digit OTP succeeds; no UIDAI AUA/ASA, OTP dispatch, demographic match or consent artefact. |
| **State ST/PVTG certificate registry** | Simulated adapter only | No state API; verification is a local status/log entry. |
| **State e-District income certificate** | Simulated adapter only | No issuer integration; income is declared/human-reviewed, not source-certified. |
| **AISHE / institution registry** | Simulated adapter only | Institution list is seeded; no AISHE lookup or recognition status. |
| **NSP / SFMP / NOS connectors** | Simulated adapter only | No application submission, status pull, acknowledgement or scheme catalogue sync. |
| **PFMS / DBT** | Simulated adapter only | No payment file, bank validation, UTR/reconciliation or failure reason from PFMS. |
| **APAAR / Academic Bank of Credits** | Not started / UI mock | No API, no verified 12-digit ID, no credits fetch. Demo card uses hard-coded defaults. |
| **UDISE+ / Census data ingestion** | Not started | Demo uses “pattern-fit” constants; pilot accepts manual CSV only. No API/ETL, source versioning or provenance beyond a URL string. |
| **Real OCR / document AI** | Simulated | Regex over seeded text in demo; no image/PDF extraction in pilot. |
| **Real LLM/NLU assistant** | Simulated | Keyword/template engine; no model, embeddings, multilingual NLU or action execution. |
| **Santali/Odia/Telugu/Ho assistant** | UI labels only | No Santali answer templates, intents or voices; the demo assistant no longer offers this language. |
| **SMS / email / IVR delivery** | C5 in progress | Real in-app plus email queue/adapter/attempts; Brevo credentials/delivery deferred. SMS/IVR disabled. |
| **Certified e-Sign / DSC** | Not implemented | Drawn PNG/typed canvas only; no PKI, timestamp authority or IT Act compliance. |
| **Real-time notifications** | Not implemented | No websocket/push; refresh required. |
| **Native mobile app / installable PWA** | PWA implemented; device acceptance open | Pilot-only manifest, icons, real install prompt/guidance, offline assets and camera input; physical-device journey not verified. |
| **Hosted deployment** | Staging deployed | Dedicated Supabase/Vercel, migrations/functions and Auth lockdown applied; Brevo delivery pending. |
| **Hosted security verification** | B2 verified | Hosted scoped denials, genuine expiry and seven browser role logins pass; broader penetration/load tests remain. |
| **Backups and restore** | B3 verified | Private bytes, database/Auth and same-UUID student login/preview restored separately; daily encrypted backup/recovery and a scheduled encrypted off-provider copy now pass; production runner/retention acceptance remains owner work. |
| **Monitoring/alerting** | Scheduled/in-app verified; external channel gate open | Five-minute health/email jobs, actual failed-backup alert and scheduled recovery verified. Independent outage channel and actual email delivery require owner configuration/acceptance. |
| **Account lifecycle** | C1 verified | Admin access controls and erasure request; actual erasure still needs retention review. |
| **Application renewal / bulk / appeal** | C8 verified | Linked renewal, withdrawal, rejection appeal and per-record bulk sanction. |
| **Grievance evidence/SLA/escalation** | C4 verified | Private evidence, owner/due date, timeline, escalation/appeal and metrics. |
| **Audit tamper-evidence** | Not implemented | No hash chain, signing, external timestamp or immutable storage. |
| **DPDP/data retention controls** | E3 controls verified; policy/execution gates remain | Consent history/revoke, retention/erasure review, minimized processing record and access/incident runbook. No automatic deletion or legal-compliance assertion. |
| **Accessibility certification** | Critical browser checklist passed; certification unverified | Keyboard student/officer flow, native modal focus, semantics, contrast, 320px and 200% zoom pass; actual screen-reader/mobile assistive-tech checks remain. |
| **Malware/content scanning** | Not implemented | Uploads are MIME/byte/checksum validated, but not scanned for malware or malicious PDFs. |
| **Rate limiting/abuse controls** | Partial | Atomic workflow/invite/receipt quotas and 429 retry handling exist; gateway/IP controls and anomaly detection remain. |

---

## 6. Recommended closure order

If the goal is a credible pilot rather than a broader demo:

1. **Deploy the pilot to a disposable staging Supabase + Vercel project** and run the documented cross-account journeys (student, institution, nodal, admin, family). Do not call it live until this passes.
2. **Configure hosted Auth email/redirects, disable public signup, provision the first admin**, and verify invite/recovery links.
3. **Exercise hosted RLS and Storage byte transfer**, including cross-institution and cross-student denial, signed preview URLs and restore-from-backup.
4. **Fix the demo defects that are visible in a pitch**: persona IDs, `caste` deficiency key, reuse counter, audit hash, coverage worst/best, broadcast audience, tour highlights.
5. **Decide the product boundary for “simulated”**: either label every connector as simulated in the UI (already mostly done) or build one real integration to prove the adapter contract.
6. **Add operational basics before real participants**: backups/restore, monitoring, rate limiting, malware scanning, retention/erasure policy and a security review.
7. **Only then** replace simulated connectors, OCR, e-Sign and PFMS with production integrations and confirm current MoTA scheme rules/rates.

---

### Current product boundary

Track A closes the demo defects through working local workflows or removal of unsupported claims. Dedicated pilot staging now has hosted Auth/RLS/Storage and separate-project restore proof. Invitation delivery, automatic protected backups, alerts/malware decision and real government integrations remain unfinished.


## Track D/E update - 18 October 2026

D1 adapter boundary, E2 critical browser accessibility and E3 privacy controls are verified. E1 PWA and E4 bounded loading/performance implementation are deployed; physical-device acceptance and agreement on expected cohort/concurrency/latency remain open. DigiLocker D2 is not connected; later government integrations wait for its authorized staging proof. The server independently selects adapter mode; absent/live-without-transport returns unavailable. Human review preserves original provider metadata.

Pilot reads use bounded server pages/search and a batched RLS snapshot, complete scoped analytics/broadcast counts, indexed context queries and a 60-second invalidated catalogue cache. Initial snapshot p95 6,092 ms improved to 1,758 ms in the latest ten-client run; workflow p95 6,011 ms exceeds the provisional 5,000 ms target, so E4 acceptance stays open. This is a small-cohort warm-service observation against provisional budgets, not production capacity evidence.

Privacy includes purpose-specific consent/history, immediate family revocation, erasure/retention review, access review and a processing-record export. Organizational policy approval, actual erasure rehearsal and breach/on-call ownership remain operating gates. No full identity values or raw provider payloads are used in adapter audit metadata. Evidence and current limits: docs/track-de-verification.md; operations: docs/data-protection.md and docs/government-adapters.md. B1/B4/B5/C5 remain open.


## Frontend connection audit - 18 October 2026

The implemented product actions now have documented frontend entry points (`docs/frontend-connections.md`). Repaired gaps: officer note targets/persistence and officer-only reads, minimal command targets, reasoned institution deactivation/reactivation/history, recorded signature previews, shared account/privacy version refresh, paged supporting-record/baseline views with parent application navigation, truthful family paging and demo officer grievance resolution.

Validation: 98 unit/UI tests; 123 PostgreSQL workflow/security assertions plus deficiency suite; 58 Edge/provider assertions; application/config type checks; demo/pilot builds; demo/offline browser regressions; seven new real hosted frontend groups and 16 note-access assertions. Screenshots inspected at desktop and 320 CSS pixels. Existing roles and version checks remain server-enforced. No real email/government/payment provider or physical-device acceptance is implied. This is a targeted connection audit using prior acceptance evidence, not an exhaustive new test of every form/role combination.

Current frontend: `dpl_3Gz8TBi3QidPFc8EtQanhTCenCKU` READY on the existing staging deployment. Internal-note read policy is deployed; a fresh 51-table private logical snapshot was preserved before that migration. Provider/operations/device/performance gates above remain unchanged.


## Remaining autonomous work update - 18 October 2026

Phase14 implementation and targeted acceptance are complete: daily AES256-GCM database/Auth/private-byte snapshots; verified encrypted copies outside Supabase on a registered daily Windows task; cloud/local recovery; five-minute health/email processors; persisted failure/recovery alerts; administrator operation history; protected retry/idempotency behavior; private Brevo API setup guard. Natural Cron backup52tables/15objects and its recovery pass. Note appends share a read lock while version/scope and exclusive decision checks remain enforced.

Latest ten-client p95:login651ms,snapshot1850ms,preview581ms,workflow1352ms,all provisional targets pass. This supersedes the earlier latest6,011ms sample without claiming causation or larger production capacity.102unit/UI tests,154DB assertions plus deficiency suite,79Edge/provider/operations assertions,4release-tool checks,typechecks,bothbuilds,demo/offline browser,5newhosted operations groups,3operations UIgroups,16note-access assertions and staginghealth pass. Security advisors:0ERROR;6intentional authenticated definer boundaries and disabled leaked-password protection WARN remain documented.

Final frontend dpl_6a3x2ZofzEiyHNgsbJNcNRa4sdfC READY at canonical staging. Schedules and recovery evidence:docs/operations-automation.md. Only owner-dependent credential/provider-access/device/policy/workload acceptance gates remain unchecked; docs/owner-actions.md lists exact actions. Approved government transports still require implementation/verification once the external contract/access is supplied. Do not describe this as a fully live government/financial service or a credentials-only release gap.

## Local login and offline-permission follow-up - 18 October 2026

TASK-15.2 complete locally: password-free demo runs at http://localhost:5174, opens seeded Asha automatically and supports student/institution/nodal/admin switching plus one-click login after logout. Authenticated pilot remains at http://localhost:5173 with its private saved accounts. Development no longer installs the production service worker; denied production installation shows an online-sign-in explanation without a raw exception. Typecheck,105unit/UI tests,production offline/conflict/denied-permission browser coverage and real local student sign-in under denied policy pass. Evidence: artifacts/startup/demo-access.json. Hosted deployment remains the prior verified version; existing owner/provider/device acceptance gates are unchanged.

## Interface simplification research - 18 October 2026

Phase16 research is complete; no redesign is implemented. Context7/library research and eight current-screen captures support a sourced MUI Core + existing Lucide recommendation. Verified current problems include missing demo mobile navigation,390px overflow,eleven pilot student destinations and unread updates mislabelled pending action. Component mapping, compatibility, migration and acceptance checks: docs/ui-simplification-research.md. TASK-17.1 is an unstarted implementation handoff. Existing feature/backend/deployment status is unchanged.
