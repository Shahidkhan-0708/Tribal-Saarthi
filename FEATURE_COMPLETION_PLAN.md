# Feature Completion Plan — Tribe Saarthi / Adimool

**Purpose:** Turn the current prototype/pilot codebase into a coherent, defensible product by completing features in the right order, with clear acceptance criteria.

**Companion document:** `FEATURE_STATUS.md` (current feature-by-feature audit and known defects).

**Audit date:** 18 October 2026

---

## 1. Current baseline

| Area | Current state |
|---|---|
| Demo | Feature-rich, local-only prototype. Rules engine and verification logic are real code; government services, OCR, payments, SMS and cryptographic claims are simulated or incomplete. |
| Pilot | Dedicated staging deployed. B2 hosted authorization and B3 real bytes/restore pass; invitation delivery and complete operations acceptance remain open. |
| Tests | Current: 102 unit/UI tests, 154 DB assertions plus deficiency suite, 79 Edge/provider/operations assertions; demo/offline and hosted critical keyboard journeys pass. See `docs/operations-automation.md`. |
| Biggest gap | Hosted authorization and restore now pass. Brevo invitation delivery, scheduled protected backups, alert delivery and the malware decision remain open (Track B). |

The completion plan therefore starts with **credibility and correctness**, then **pilot deployment**, then **missing product workflows**, and only then **real external integrations**.

---

## 2. Completion principles

1. **Do not mix demo completeness with production readiness.** A feature is complete only when its real environment, authorization, failure paths, audit and tests are complete.
2. **Label every simulation at the point of use.** A disabled or simulated connector must say so in the UI and in the API response. Never silently fall back from real to fake data.
3. **Complete vertical slices, not screens.** A feature is done when:
   - the UI exists,
   - the server enforces authorization and validation,
   - empty/error/offline states work,
   - the action is audited,
   - a test proves the allowed and denied path,
   - operations (logs/retries/backups) are covered.
4. **One source of truth per fact.** Eligibility, application status, document status and payment status should be computed/owned server-side; the browser may show advisory previews only.
5. **Prefer deletion over fake completion.** If a feature cannot be completed honestly in the current phase, remove the claim or mark it “Preview / simulated” instead of adding decorative UI.
6. **Sequence by dependency.** Authentication → scoped data → document/application lifecycle → human decisions → payment/receipt → notifications → analytics/integrations.
7. **Protect the demo.** Keep the demo build separate and stable for presentations; do not let pilot schema/workflow changes break the seeded demo.

---

## 3. Recommended completion order

There are three tracks. Run **Track A** first because it is cheap and protects credibility. Run **Track B** before inviting real users. Run **Track C** only after the pilot is stable.

| Order | Track | Goal | Rough effort |
|---|---|---|---|
| 1 | **A. Demo and claim hardening** | Remove false/incomplete claims; fix visible demo defects; make the pitch honest | 3–5 dev-days |
| 2 | **B. Pilot release gate** | Deploy to staging; prove Auth, RLS, Storage, backups and operations | 5–10 dev-days |
| 3 | **C. Pilot workflow completion** | Close the missing product workflows real users will need | 10–15 dev-days |
| 4 | **D. Real integrations** | Replace simulated adapters one at a time, starting with identity/documents | 3–6+ weeks per integration |
| 5 | **E. Mobile, accessibility and scale** | Meet the “mobile application” requirement and production hardening | 2–4 weeks |

Estimates assume one or two full-time developers and available external sandbox access. Government integration approvals usually dominate the calendar, not coding.

---

## 4. Track A — Demo and claim hardening

**Goal:** Make the demo trustworthy in front of judges and remove defects that are easy to expose.

**Status (18 October 2026):** A1–A12 implemented and locally exercised. A7 uses the permitted removal of unsupported integrity/QR claims; A10 removes the offline-sync controls. Evidence: `docs/track-a-verification.md`. Track B is in progress.

### [x] A1. Fix the persona switcher

- **Problem:** The header dropdown uses non-existent IDs (`usr_inst_1`, `usr_nodal_jh`); selecting those silently falls back to the student account.
- **How:** Replace option values with real `USERS` IDs (`usr_nagesh`, `usr_verma`, `usr_admin`); render labels from `USERS` rather than hard-coded strings.
- **Done when:** Selecting every persona changes the session user, role, navigation and visible records.
- **Test:** Component/integration test that switches student → institution → nodal → admin and asserts the visible name/role.

### [x] A2. Make deficiency correction use the real document type

- **Problem:** `raiseDeficiency` hard-codes `docKey: 'caste'`, which is not a `DocKey` and has no wallet document.
- **How:** Change the action to accept a `DocKey` from the officer form; validate it against the application's attached/required documents. Replace the hard-coded deadline with a configurable deadline.
- **Done when:** The student sees the correct document type and can select a corrected version for it.
- **Test:** Raise deficiencies for `st_certificate`, `income_certificate` and `marksheet`; assert the student lookup and resubmit path.

### [x] A3. Make cross-scheme reuse real

- **Problem:** `reuseCount` is seeded but never updated; `attachDocsToApplication` only writes an audit row.
- **How:** When an application is created or a document is attached, persist the document IDs on the application and increment the document's reuse count. Prevent duplicate counts for the same application/document pair. Display “used in N applications” from that relation, not a counter that only goes up.
- **Done when:** Applying to a second scheme with the same verified document increments reuse once, and removing/replacing an attachment decrements or recalculates it.
- **Test:** Apply to two schemes; assert the document is linked to both and reuse count is 2; repeat the same attachment and assert it stays 2.

### [x] A4. Fix application status routing

- **Problem:** `runVerification` leaves source-down applications as `submitted`, and exceptions jump to `institute_stage`; the UI claims “pending” without a pending state.
- **How:** Add an explicit `pending_verification`/`source_pending` status (or a derived verification state + clear UI label) and map pipeline outcomes deterministically:
  - all verified → next stage,
  - mismatch/manual review → review queue,
  - source down → pending, not advanced.
- **Done when:** Application status, verification log state and UI label always agree; no automatic pass or reject.
- **Test:** Existing pipeline tests plus store-level tests for each outcome.

### [x] A5. Stop stage approvals from skipping checks

- **Problem:** Institution and department completion actions advance the application without checking all required verification logs and documents.
- **How:** Gate each stage action on required sources being verified and required documents being reviewed. Reuse the same predicate in UI and store.
- **Done when:** An application with an outstanding mismatch/source-down cannot be advanced; the button explains why.
- **Test:** Attempt approval with each missing source; assert blocked with a reason.

### [x] A6. Separate sanction from disbursement and store the signature

- **Problem:** `sanctionApplication` immediately marks the application disbursed and ignores the signature URL.
- **How:** Add a `sanctioned` action that stores signer, signature artifact and sanctioned amount, then a separate `disbursed` action for the PFMS simulation. Keep the “simulated” label.
- **Done when:** Status flow is `department_stage → sanctioned → disbursed`; the signature is stored and visible on the sanction record.
- **Test:** Sanction and disbursement are separate actions; cannot disburse before sanction; signature artifact survives refresh.

### [x] A7. Replace the fake acknowledgement hash and QR

- **Problem:** `generateHash` is a small non-cryptographic hash embedded in a hard-coded `sha256:` string; the “QR” is an icon.
- **How:** Use `crypto.subtle.digest('SHA-256', ...)` over a canonical snapshot; generate a real QR with the existing `qrcode` package; add a public verification route/function that returns only reference/issue time/hash. Either implement this or remove the “cryptographically sealed” claim.
- **Done when:** Changing any covered field changes the hash; the QR resolves to a verification page; no personal data is exposed.
- **Test:** Hash stability and change tests; QR URL resolution; tamper simulation.

### [x] A8. Fix broadcast targeting

- **Problem:** The broadcast form ignores the selected audience and notifies every student; audience counts use invented multipliers.
- **How:** Filter recipients by audience (all / district / open deficiency), compute the actual count from the store, and show the recipient count before sending. For the demo, make clear that SMS/IVR are not sent.
- **Done when:** Selecting a district or deficiency audience only creates notices for those students; displayed count equals created notices.
- **Test:** Three audiences; assert recipient IDs and counts.

### [x] A9. Fix coverage worst/best labels

- **Problem:** `summarizeGaps` sets both `worstDistrict` and `bestDistrict` to the last element after ascending sort.
- **How:** `worst = sorted[0]`, `best = sorted[length - 1]`; add a unit test.
- **Done when:** The district with the lowest coverage is labelled worst, highest is best.

### [x] A10. Either implement or remove the demo offline queue

- **Problem:** No UI calls `enqueue`; replay only changes queue status, not data; there is no demo service worker.
- **How (preferred):** For the demo, hide/remove the “Offline Mode” toggle and queue claims, or relabel it “Connectivity preview — no offline writes”. For the pilot, keep the real IndexedDB queue.
- **Done when:** The demo makes no offline-sync claim it cannot demonstrate. If implemented instead, actions must queue and replay into real data.

### [x] A11. Make the guided tour actually guide

- **Problem:** `highlightSelector` is never used; no `data-demo` attributes exist.
- **How:** Add `data-demo` attributes to the five target sections and implement a simple highlight overlay/scroll-into-view. Alternatively remove the selector fields and present the tour as a text walkthrough.
- **Done when:** Each beat visibly highlights the intended area and scrolls it into view.

### [x] A12. Correct multilingual and Saarthi claims

- **Problem:** Santali answers remain English; only navigation labels are translated; “5 schemes” copy conflicts with 4 seeded schemes.
- **How:** Either:
  - implement full answer templates/intents for Santali (requires translation review), or
  - label the assistant “English/Hindi (voice preview)” and remove Santali from the answer-language selector.
  Add the missing fifth scheme or change the copy to four. Translate page-level strings only after a review workflow exists.
- **Done when:** Language claims match what the product actually answers/renders.

### Track A exit criteria

- All demo defects in `FEATURE_STATUS.md` §4 are fixed or the related claim is removed.
- `npm test`, `npm run typecheck`, `npm run build` pass.
- A manual 5-minute demo runs without a visible broken action.
- No screen claims a real government service, cryptographic seal, certified e-Sign or SMS delivery that is simulated.

---

## 5. Track B — Pilot release gate

**Goal:** Prove the pilot can safely hold real pilot data before inviting users.

**Status (18 October 2026):** In progress. Dedicated staging is live at `https://tribe-saarthi-staging.vercel.app`. Migrations, seed, functions, Auth lockdown, redirects/CORS and owner admin login are verified. B2 passed 76 hosted matrix assertions, five expiry/signup/CORS/inactive checks and seven browser role logins/QR verification. B3 separate-project database/Auth/private-byte restore and same-student login/preview pass; staging is healthy again. All three live quota routes return 429/Retry-After. Brevo configuration is prepared; the owner will provide credentials later. B1/B4/B5 remain open for mail and complete operations acceptance. See `docs/track-b-verification.md` and `docs/staging-release.md`.

### B1. Create and configure staging

- Create a dedicated staging Supabase project and a staging Vercel project.
- Apply migrations and seed only through the documented flow; never point a development checkout at production.
- Configure Auth Site URL, redirect allow-list, email delivery, public-signup disablement and the first admin.
- Deploy `pilot-workflow`, `pilot-invite`, `pilot-receipt`.
- **Done when:** A fresh environment can be built from the repository and documentation by someone other than the author.

### [x] B2. Prove hosted authorization

Run a staging test matrix with at least:

- two students,
- two institutions,
- one nodal officer,
- one admin,
- one family account.

Test:

| Case | Expected |
|---|---|
| Student A reads Student B's records | Denied/empty |
| Institution A reads Institution B's student | Denied |
| Nodal A reads another state | Denied |
| Family reads without grant | Denied/empty |
| Family reads after revoke | Denied/empty |
| Direct table insert/update/delete | Denied |
| Forged/foreign Storage path | Denied |
| Expired/inactive account | Denied |
| Cross-account document preview | Denied |

**Done when:** Results are recorded with request IDs and screenshots/logs; not just “tests pass locally”.

### [x] B3. Prove Storage bytes and restore

- Upload real PDF/JPEG/PNG files, preview them, replace with a new version, and verify SHA-256.
- Back up the database and private bucket; restore into a separate staging project; confirm record counts, checksums, previews and Auth UUIDs.
- **Done when:** A restored student can log in, preview the restored file and its checksum matches.

### B4. Prove operational basics

- Enable database and Storage backups before real data.
- Configure function logs and failed-job review.
- Verify the deficiency reminder job or document manual scheduling.
- Add rate limits/quotas to Edge Functions; add upload malware scanning (or document the accepted risk).
- Add a simple uptime/error alert.
- **Done when:** A failed reminder/payment/function is visible to an operator and has a documented response.

### B5. Add a release smoke test

Automate one end-to-end staging journey:

1. Admin invites student and officer.
2. Student uploads documents.
3. Student submits an application.
4. Institution reviews documents and approves.
5. Nodal reviews sources, raises a deficiency.
6. Student corrects; officer re-verifies.
7. Nodal sanctions; payment is recorded as simulated.
8. Receipt QR resolves with no personal data.
9. Family grant shows only safe fields.

**Done when:** The journey passes against hosted staging, not fixtures.

### Track B exit criteria

- Staging deployment reproducible from docs.
- Hosted RLS/Storage/Auth checks recorded.
- Backup/restore proven.
- Monitoring/rate limiting/malware decision recorded.
- End-to-end staging journey passes.

---

## 6. Track C — Pilot workflow completion

The owner requested Track C after the hosted B2/B3 proofs, while explicitly deferring SMTP credentials. C1-C4 and C6-C9 are verified in synthetic staging; C5 and the remaining Track B release gates stay open. Evidence: `docs/track-c-verification.md`.

### [x] C1. Account lifecycle

**Add:** account list, deactivate/reactivate, role change, resend invite, pending-invite list, self-service deletion/erasure request.

**Approach:** Extend `pilot_accounts` with lifecycle metadata; add admin-only commands; never delete audit history silently. Deactivation must invalidate active sessions and Storage access.

**Done when:** A deactivated account cannot sign in or read records; role changes are audited and take effect immediately.

### [x] C2. Audit usability

**Add:** filter by actor/action/entity/date, pagination, CSV/JSON export, detail view.

**Approach:** Add server-side query parameters or an RPC; enforce the same scope as the audit RLS policy. Keep raw append-only storage; export is read-only.

**Done when:** Admin can export a filtered range; institution/nodal cannot see other scopes.

### [x] C3. Conflict-resolution UI

**Add:** for a queued offline operation in conflict, show local vs server record, allow “refresh and retry” or “discard”; never auto-overwrite.

**Approach:** Store a safe snapshot/diff in the queue item; resolve by re-reading the server version and reissuing with a new operation ID. “Overwrite” must be an explicit, audited action only where the workflow permits it.

**Done when:** A stale draft conflict can be resolved without discarding unrelated queued work.

### [x] C4. Grievance completion

**Add:** attachments/evidence, category configuration, priority, due date/SLA, assignment notification, escalation, resolution notes, reopen/appeal, basic metrics.

**Approach:** Reuse the existing private-document pattern for evidence; add a `grievance_events` table or append-only messages for history; create notifications on create/assign/escalate.

**Done when:** A grievance has a visible owner, due date and full timeline; the assigned officer is notified.

### C5. Notification channels

**In progress:** queue/adapter/attempt history and operator retries are deployed. Five-minute automatic processing is enabled and missing configuration does not consume send retries. Real Brevo acknowledgement/delivery awaits owner credentials and controlled mailbox acceptance; C5 remains unchecked.

**Add:** at minimum, real email for critical events (deficiency, sanction, payment result) and optional SMS through an approved provider. Keep in-app as the default.

**Approach:** Create a notification adapter with `in_app`, `email`, `sms` drivers. Store delivery attempts and provider IDs. Never claim delivery without a provider acknowledgement. For IVR, either implement a provider integration or remove the claim.

**Done when:** A deficiency creates an in-app notice and a queued email/SMS attempt with visible delivery status; failures are retried and visible to operators.

### [x] C6. Analytics completion

**Add:** CSV export, a small chart set (funnel, district coverage when comparable), and a clear “not district-wide” banner. Keep baseline import manual until a UDISE+/Census feed exists.

**Approach:** Export the same computed snapshot the UI shows; include source URL/year and comparability flags. Do not invent a district-wide denominator.

**Done when:** A nodal officer can export their scoped table and explain why a coverage rate is or is not comparable.

### [x] C7. Receipt hardening

**Add:** receipt revocation/expiry if policy requires, a signed receipt or a hash that covers the decision history, and rate limiting on public lookup.

**Approach:** Keep the public response minimal. If the receipt is meant to prove later approval, hash a canonical event chain, not only the submission snapshot.

**Done when:** A receipt can be verified after status changes; revocation is auditable; no personal data leaks.

### [x] C8. Application lifecycle

**Add:** renewal/carry-forward for the next academic year, withdrawal before a decision, appeal after rejection, and bulk sanction for officers.

**Approach:** Model renewal as a new application linked to the prior one, with document reuse and a server-calculated eligibility delta. Bulk sanction must still validate each application and produce per-record audit entries.

**Done when:** Renewal creates a linked draft; withdrawal/appeal have defined states and reasons; bulk sanction reports per-record success/failure.

### [x] C9. Admin configuration safety

**Add:** scheme draft/publish/rollback, rule dry-run against a student cohort, institution deactivate, configuration diff/history.

**Approach:** Version configuration records; never edit in place without a new version. Dry-run must use the same evaluator as submission.

**Done when:** An admin can preview a rule change, publish it, and roll back with an audit trail.

### Track C exit criteria

- Every workflow a real student/officer/family needs has a complete, authorized, audited path.
- Failure and empty states are designed, not just happy paths.
- The UI no longer contains placeholder actions.

---

## 7. Track D — Real integrations

Do these **one at a time**, behind the same adapter interface, with contract tests and a visible mode switch.

Current D/E evidence: `docs/track-de-verification.md` (18 October 2026).

- [x] D1: Shared contract, explicit modes, safe failure states, sanitized/idempotent metadata and hosted role checks. No connected government transport is claimed.
- [ ] D2: Approved DigiLocker sandbox and actual OAuth/fetch/issuer/revocation proof; later integrations wait for that proof.
- [ ] E1: PWA implemented and browser-tested; physical Android/iOS install, camera and notification journey still required.
- [x] E2: Critical student/officer browser accessibility checklist passes; assistive-technology and broader-form exceptions are documented. This is not WCAG certification.
- [x] E3: Consent/revocation, retention and erasure review, processing-record export and access/incident procedures implemented and tested. Organizational policy approval and actual erasure execution remain operator work.
- [ ] E4: Bounded pages/search, full scoped metrics, TTL/indexes and ten-client measurements implemented. Latest ten-client p95 login651/snapshot1850/preview581/workflow1352 ms meets every provisional budget; owner agreement on production workload/volume/targets remains open.

### D1. Define the adapter contract first

Create a single interface for external services:

```ts
type AdapterMode = 'simulated' | 'sandbox' | 'live';

interface GovernmentAdapter<TRequest, TResponse> {
  id: string;
  mode: AdapterMode;
  verify(request: TRequest): Promise<TResponse>;
  health(): Promise<'up' | 'down' | 'degraded'>;
  // Every response must carry source, timestamp, reference and raw status.
}
```

Requirements:

- The UI shows `mode` and the source system.
- A live failure must become `source_down`/`manual_review`, never a fake pass.
- A simulated adapter can run in demo, but a pilot build must require explicit `VITE_*` configuration and must not silently fall back.
- Store request/response references and a sanitized audit trail; never store secrets or full identity numbers.

### D2. Integration order

| Order | Integration | Why first | Minimum acceptance |
|---|---|---|---|
| 1 | **DigiLocker / issuer document fetch** | Removes the most obvious fake and proves consent/document handling | OAuth/consent, fetch, issuer signature/status, revocation, explicit failure state |
| 2 | **Aadhaar e-KYC** | Identity is a prerequisite for matching | Real OTP flow via an authorized provider, demographic match, consent artefact, no OTP storage |
| 3 | **State ST/PVTG certificate** | Core eligibility evidence | Signed response/reference, mismatch → human review, source-down → pending |
| 4 | **State e-District income** | Income rules and reviewed income | Same failure semantics; no “verified” without a source reference |
| 5 | **AISHE / institution registry** | Institution validation | Recognition status, institution ID mapping, cache/TTL |
| 6 | **NSP / SFMP / NOS** | Actual scheme application | Submit, acknowledge, status pull, idempotency, reconciliation |
| 7 | **PFMS / DBT** | Money movement | Bank validation, payment file, UTR, reconciliation, failure reason, retry |
| 8 | **APAAR / ABC** | Student identity/credits | Verified ID/credits, consent, no hard-coded fallback |
| 9 | **UDISE+ / Census** | Coverage denominator | Versioned ingestion, source URL/year, comparability rules |

### D3. Never do this during integration

- Do not label a sandbox response as “verified” without saying “sandbox”.
- Do not auto-pass when a live source is down.
- Do not retry non-idempotent government submissions without an operation key.
- Do not store full Aadhaar, OTPs, bank credentials or raw government payloads in logs.
- Do not make the demo depend on live credentials.

### D4. Integration acceptance template

For each integration, require:

- documented API contract and sandbox credentials,
- adapter implementation + simulated fallback,
- happy path, mismatch, timeout, 4xx, 5xx and malformed response tests,
- role/field-level data minimisation,
- audit reference and operator runbook,
- a UI label showing the mode and source,
- a staging journey that proves the real/sandbox response changes the decision.

**Do not start the next integration until the previous one has a staging proof and a failure runbook.**

---

## 8. Track E — Mobile, accessibility and scale

### E1. Mobile application

The PS asks for a mobile application; the current product is a responsive web app.

Recommended sequence:

1. **PWA first (fast):** add a web manifest, install prompt, icons, offline shell and mobile file/camera capture. This is enough for a pilot demo if the evaluator accepts a web delivery model.
2. **Native wrapper (if required):** Capacitor/React Native shell around the existing web app for Android; keep the same server API. Avoid a second UI codebase unless the timeline allows it.
3. **True native (only if required):** React Native/Flutter, with offline sync and secure storage. This is a larger project; do not start it before the pilot API is stable.

**Done when:** A student can install/open the app, log in, upload a document with the camera, submit, see status and receive a notification on a real device.

### E2. Accessibility

- Keyboard-only pass for every form/dialog.
- Screen-reader labels for icon-only buttons and status changes.
- Contrast audit for success/warning/danger states.
- Focus management in modals; no focus traps.
- Language attributes on translated content.
- Test at 320 px width and with 200% zoom.

**Done when:** The critical student journey and officer decision flow pass an accessibility checklist; known exceptions are documented.

### E3. DPDP and data protection

- Consent registry for document fetch/family sharing.
- Purpose limitation and data minimisation (masked Aadhaar only).
- Retention/deletion schedule and an erasure workflow.
- Data-processing records and breach-response runbook.
- Access review for admin accounts.

**Done when:** A user can see/revoke consent and request erasure; an operator can produce a record of processing.

### E4. Scale and performance

- Paginate/search server-side; stop loading every table row into the browser.
- Add indexes for the actual query patterns.
- Measure p95 for login, snapshot load, document preview and workflow action.
- Add load tests for expected pilot concurrency.
- Add caching/TTL for catalogue data (schemes/institutions) with explicit invalidation.

**Done when:** The pilot meets agreed p95 targets at expected concurrency, and the browser does not load unbounded record sets.

---

## 9. Feature completion matrix

Use this as the working backlog. “Complete” means the acceptance test in the referenced section passes.

| Feature | Current | Target completion | Approach | Priority |
|---|---|---|---|---|
| Demo persona switching | Complete (demo) | Seeded personas and labels | Render `USERS`; reject invalid IDs | P0 (demo) |
| Demo deficiency correction | Complete (demo) | Typed correction + deadline | Owned new versions; valid date; review | P0 (demo) |
| Cross-scheme reuse | Complete (demo) | Persisted links + derived counts | Unique application/document relations | P0 (demo) |
| Application status routing | Complete (demo) | Explicit pending/review states | Deterministic outcomes and stage return | P0 (demo) |
| Stage approvals | Complete (demo) | Gated approvals | Shared source/document predicate | P0 (demo) |
| Sanction/e-Sign/DBT | Complete (demo) | Acknowledged sanction; separate simulated payment | Persist signer/PNG/time; no certified e-Sign claim | P0 (demo) |
| Acknowledgement hash/QR | Unsupported claim removed | Printable local demo summary | Fake hash/QR/seal removed (A7 option) | P0 (demo) |
| Broadcast targeting | Complete (demo) | Exact scoped recipient set | In-app only; actual count and audit | P0 (demo) |
| Coverage worst/best | Complete (demo) | Correct labels | Sort copy; low/high + edge tests | P1 (demo) |
| Demo offline queue | Unsupported claim removed | No demo offline-sync promise | Controls/queue indicator removed | P1 (demo) |
| Guided tour highlights | Complete (demo) | Five targets highlight and scroll | `data-demo`, correct persona and cleanup | P1 (demo) |
| Santali/Saarthi claims | Corrected (demo) | English/Hindi; navigation preview only | Remove Santali answers; four seeded schemes | P1 (demo) |
| Pilot staging | Deployed; SMTP pending | Reproducible staging | Supabase + Vercel + Auth email | P0 (pilot) |
| Hosted RLS/Storage proof | B2 verified | Recorded test matrix | Cross-account staging tests | P0 (pilot) |
| Backups/restore | B3 verified; encrypted automation/recovery verified | Restore rehearsal | DB + bucket backup | P0 (pilot) |
| Monitoring/rate limits | Quotas/health/Cron/backups/in-app failure recovery verified; owner external-alert/risk gate open | Basic operations | Logs, alerts, throttles, malware decision | P0 (pilot) |
| Account lifecycle | C1 verified | Admin lifecycle + erasure | New commands/UI | P1 (pilot) |
| Audit export/filter | C2 verified | Scoped export | RPC + UI | P1 (pilot) |
| Conflict resolution | C3 verified | Refresh/retry/discard | Queue diff + new op ID | P1 (pilot) |
| Grievance SLA/evidence | C4 verified | Attachments, owner, due date, notifications | Reuse document pattern | P1 (pilot) |
| Notification channels | C5 queued/blocked; provider pending | Email/SMS with delivery status | Adapter + provider + attempts | P1 (pilot) |
| Analytics export/charts | C6 verified | Export + comparable charts | Export computed snapshot | P2 (pilot) |
| Receipt hardening | C7 verified | Decision-aware/revocable | Canonical event chain | P2 (pilot) |
| Renewal/appeal/bulk | C8 verified | Linked renewal, appeal, bulk | New states/actions | P2 (pilot) |
| Config dry-run/rollback | C9 verified | Versioned publish flow | Config versions + evaluator | P2 (pilot) |
| DigiLocker | Simulated | One real integration | Adapter + consent | P0 (integration) |
| Aadhaar e-KYC | Simulated | Real provider | Authorized AUA/ASA | P0 (integration) |
| State ST/income/AISHE | Simulated | Real adapters | State-by-state onboarding | P1 (integration) |
| NSP/SFMP/NOS | Simulated | Real submission/status | Portal/API agreements | P2 (integration) |
| PFMS/DBT | Simulated | Real payment/reconciliation | Bank/PFMS onboarding | P2 (integration) |
| APAAR/ABC | UI mock | Real verified IDs/credits | API + consent | P2 (integration) |
| UDISE+/Census | Manual CSV | Versioned ingestion | ETL + provenance | P2 (integration) |
| Mobile app | Installable PWA; physical-device gate open | Real-device journey | Manifest/install/offline/capture | P1 (product) |
| Accessibility | Critical browser checklist passed; assistive-tech exceptions | Device/screen-reader review | Native dialogs, focus, semantics, contrast/reflow | P1 (product) |
| DPDP controls | Consent/review/export controls verified | Approved policy + erasure execution | Registry, retention/erasure review and runbook | P1 (product) |

---

## 10. Suggested delivery sequence

Assuming one small team, use short sprints with a demo/review at the end of each.

### Sprint 1 — Credibility and demo fixes (1 week)

- Fix A1–A9.
- Remove or relabel A10–A12.
- Rerun typecheck/tests/build.
- Manually run the 5-minute demo.
- **Output:** demo that does not overclaim.

### Sprint 2 — Staging foundation (1–2 weeks)

- Create staging Supabase/Vercel.
- Deploy migrations/functions/seed.
- Configure Auth email, redirects, first admin.
- Record hosted RLS/Storage/Auth evidence.
- **Output:** staging environment with documented access.

### Sprint 3 — Operations and release gate (1 week)

- Backups/restore rehearsal.
- Monitoring, rate limits, malware decision.
- End-to-end staging journey.
- **Output:** go/no-go decision for a small pilot.

### Sprint 4–5 — Pilot workflow gaps (2 weeks)

- Account lifecycle, audit export, conflict resolution.
- Grievance SLA/evidence/notifications.
- Notification channels.
- **Output:** pilot usable by real students/officers/family without placeholder actions.

### Sprint 6+ — Integrations

- One integration per sprint/phase, starting with DigiLocker/Aadhaar.
- Do not mix multiple live integrations in one release.
- **Output:** one real end-to-end integration with failure semantics, then the next.

### Parallel track — Mobile/accessibility

- Add PWA manifest/install and mobile capture early.
- Run accessibility checks during Track C, not at the end.

---

## 11. Definition of Done for every feature

A feature is complete only when all of these are true:

- [ ] The user-facing flow works for the intended role.
- [ ] Unauthorized roles and cross-scope access are denied server-side.
- [ ] Loading, empty, error and offline states exist.
- [ ] A live external failure becomes pending/review, never a silent pass.
- [ ] The action is audited with actor, entity, timestamp and result.
- [ ] Sensitive fields are minimized/masked; no secrets in logs.
- [ ] Automated tests cover the allowed path, the denied path and one failure path.
- [ ] The UI labels simulated/sandbox/live mode accurately.
- [ ] The operator runbook covers retries, rollback and support.
- [ ] The final artifact was exercised through the interface a user will use, not only by a unit test.

### Verification commands

```bash
npm run typecheck
npm test
npm run build
npm run build:pilot
npm run test:db
npm run test:edge
npm run test:browser
```

For hosted work, add a recorded staging checklist. Local fixture tests alone are not release evidence.

---

## 12. Risks and trade-offs

| Risk | Why it matters | Mitigation |
|---|---|---|
| Building real integrations before the adapter contract | Each integration becomes bespoke and hard to test | Define adapter mode/contract first; one integration per release |
| Chasing demo features while pilot security is unproven | Demo looks good but real data is unsafe | Track A and B are separate; do not invite users before B |
| Adding a `pending` status without updating all screens | Inconsistent statuses confuse students/officers | Map state transitions in one module; test every transition |
| Real document reuse without ownership checks | Cross-student document leakage | Persist app-document links; enforce server ownership on every attach/reuse |
| Claiming “tamper-evident” without a chain | Legal/credibility risk | Implement a hash chain or remove the claim |
| Calling a drawn signature “e-Sign” | Legal/compliance risk | Label “pilot acknowledgement”; integrate certified e-Sign only with a provider |
| Treating sandbox responses as live | False verification of eligibility | Show mode; store source reference; never convert sandbox to “verified” |
| Offline sync conflicts overwriting decisions | Data loss/incorrect approvals | No auto-overwrite; explicit resolution; audit every conflict path |
| External approvals taking longer than coding | Timeline slips silently | Start MoU/API access in parallel; ship simulated mode with honest labels |

---

## 13. Original immediate next 10 actions

Actions 1–8 are closed by Track A, including the permitted claim-removal options. Actions 9–10 belong to the pending Track B release gate.

1. Fix the demo persona IDs and labels (`src/components/layout/index.tsx`).
2. Change deficiency creation to accept a real `DocKey` and configurable deadline.
3. Persist application-document links and increment/decrement `reuseCount` correctly.
4. Add explicit pending/source-down routing and gate stage approvals on all checks.
5. Replace the fake acknowledgement hash with real SHA-256 + QR, or remove the claim.
6. Separate sanction from disbursement and store the signature artifact.
7. Fix broadcast audience filtering and the coverage worst/best bug.
8. Remove/relabel the demo offline queue and Santali assistant claims until implemented.
9. Create staging Supabase/Vercel projects and deploy the pilot migration/functions.
10. Run the hosted cross-account RLS/Storage test matrix and record evidence.

---

## 14. Final recommendation

Do **not** try to complete every feature at once. The best sequence is:

1. **Make the current claims true** (demo fixes and honest labels).
2. **Make the pilot safe to use** (staging, hosted authorization, backups, operations).
3. **Complete the workflows real users need** (accounts, audit export, grievances, notifications, conflicts).
4. **Replace simulations one integration at a time**, starting with identity and documents.
5. **Add mobile/accessibility/DPDP** as product requirements, not as a last-minute wrapper.

This order protects credibility, avoids rework, and ensures that every “completed” feature is actually usable, authorized, auditable and testable.


## 15. Frontend connections - 18 October 2026

Implemented product actions were audited against their frontend callers, payloads and role-specific views. This closes the connections below; it does not close deferred external-provider or operating acceptance gates. Map and evidence: `docs/frontend-connections.md`.

- [x] Correct officer note application/version targets, visible server acknowledgement and durable offline replay.
- [x] Minimize workflow/account/privacy/bulk and offline queue targets to ID/version.
- [x] Enforce internal note visibility for scoped officers in the database, including batched snapshots.
- [x] Connect reasoned institution deactivation, explicit reactivation and configuration history.
- [x] Connect stored private sanction signatures to the application preview dialog.
- [x] Refresh shared account versions before subsequent privacy reviews.
- [x] Render selected pages for supporting records, profiles, baseline provenance and configuration history; open related applications outside the current page.
- [x] Remove unsupported family search and retain authorized summary pagination.
- [x] Connect demo officer grievance navigation, queue and persistent resolution; keep student routes role-gated.

Verification: 98 unit/UI tests, 123 PostgreSQL assertions plus deficiency suite, 58 Edge/provider assertions, type checks, both builds, demo/offline browser regressions, seven focused hosted browser groups and 16 hosted note-access assertions. Existing B1/B4/B5/C5/D2/E1/E4 acceptance gates remain open. Frontend deployed to the existing staging URL; the note policy migration was applied separately after a fresh private logical snapshot.


## 16. Remaining autonomous work closed - 18 October 2026

- [x] Preserve version/scope checks while allowing concurrent append-only officer notes with shared application locks.
- [x] Verify all existing provisional budgets at ten clients; preserve before/after samples without claiming production capacity.
- [x] Schedule daily encrypted database/Auth/private-byte backups, duplicate/overlap protection and failure-safe manifests.
- [x] Generate/restrict private recovery keys and configure Cron invocation secrets in Vault; no keys exposed in the frontend.
- [x] Verify both cloud and independent local encrypted-copy recovery:52tables/15objects and every checksum.
- [x] Register and actually run the daily Windows encrypted-copy task; verify LastTaskResult0 and missed-run settings.
- [x] Enable five-minute monitoring and email processing; missing provider configuration preserves send retries.
- [x] Exercise a real failed backup, persisted administrator alert, naturally scheduled recovery and healthy monitor recovery.
- [x] Connect administrator Operations status and recovery notices; verify desktop/320px interface.
- [x] Prepare private Brevo API credential file and guarded apply command; retain SMTP setup guard.
- [x] Run regressions and deploy final frontend/backend.

All remaining unchecked parent items are owner-dependent acceptance gates, not silently completed features. The exact credential/access/device/decision checklist is `docs/owner-actions.md`. D2 still requires an approved provider contract before its real transport can be implemented and verified; a key alone does not complete it. B4 retains owner malware/risk, production runner/retention and external-alert decisions. E4 retains workload/target agreement. Current evidence and operating limits: `docs/operations-automation.md`.

## 17. Local demo access and reported offline-permission warning

- [x] Run password-free demo alongside the authenticated pilot; verify all four roles and logout/one-click student login.
- [x] Skip production service-worker installation during development and explain online access when production installation is denied.
- [x] Verify typecheck,105 unit/UI tests,production offline/conflict/fallback browser tests and real local student sign-in with service-worker permission denied.

Local evidence: artifacts/startup/demo-access.json. No hosted redeployment or change to existing owner acceptance gates is claimed.

## 18. Interface simplification research

- [x] Inspect eight representative current demo/pilot desktop/mobile screens and record concrete clutter/navigation/writing problems.
- [x] Use Context7 plus official component and service-design sources; recommend packaged MUI Core and existing Lucide without generating UI components.
- [x] Document compatible foundation, exact component mapping, information structure, migration order and verification criteria in docs/ui-simplification-research.md.

Research is complete. UI implementation remains unstarted as TASK-17.1; no new interface, dependency installation or deployment is claimed.
