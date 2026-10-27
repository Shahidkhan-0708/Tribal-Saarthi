# Track A verification — 18 October 2026

Scope: `FEATURE_COMPLETION_PLAN.md` A1–A12 only. This is local demo evidence, not a hosted pilot release or government integration certification.

## Completed tasks

| Task | Result | Proof |
|---|---|---|
| A1 | Seeded persona IDs/names; invalid IDs no longer fall back to a student; canonical session restore | Persona component test and Chromium switches through all six main personas |
| A2 | Required/attached document type, reason, valid deadline and owned corrected-version selection | ST/income/marksheet tests; foreign, wrong-type, unchanged and invalid-date denial; browser income correction |
| A3 | Persisted `documentIds`; distinct relation counts; replace/remove and ownership checks | Two-scheme reuse test, duplicate/removal/replacement assertions and browser reload of selected attachment |
| A4 | Source-down → pending; exceptions → manual review; recovery resumes the human stage; terminal states protected | Pipeline/store tests and browser outage/recovery |
| A5 | One source/document readiness predicate in UI and store; no stage skips | Five missing-source cases, unresolved-state cases, missing required document and allowed institute path |
| A6 | Department approval → acknowledged sanction → separate simulated payment; signer/PNG/time/amount persist | State/persistence/idempotency tests; browser signature and audit survive reload before payment |
| A7 | Chosen removal option: fake hash/QR/seal and integrity claims removed | Receipt component test, browser receipt and screenshot review |
| A8 | Actual all/district/open-deficiency recipients; exact preview count; in-app only; audit | Three UI audience tests and browser deficiency broadcast |
| A9 | Lowest coverage worst, highest best; handles unordered/empty/single input | Coverage unit tests and coverage tour screenshot |
| A10 | Chosen removal option: demo connectivity/queue controls removed | Layout assertion and visible “Local demo - no offline sync”; pilot queue unchanged |
| A11 | Five target highlights, scroll, persona changes and cleanup; closed tour does not redirect | Tour component test and Chromium screenshots of all five beats |
| A12 | English/Hindi templates; Santali answer option removed; navigation-only language label; four seeded schemes; honest simulation labels | Hindi/scoping tests, browser Hindi answer, copy inspection and reviewed screenshots |

## Commands

| Command | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm test` | PASS — 70 tests in 14 files |
| `npm run build` | PASS — also run by the demo browser command |
| `npm run test:demo-browser` | PASS — real Chromium over the built demo |
| `npm run test:db` | PASS — 36 PostgreSQL workflow/security assertions |
| `npm run test:edge` | PASS — 17 request/response assertions |
| `npm run build:pilot` | PASS — existing mixed static/dynamic offline-module import warning only |
| `npm run test:browser` | PASS — pilot login, offline reload, durable replay, logout and mobile layout with mocked Supabase transport |

Per-task type checks and full suites were run during implementation; final suite includes the additional denial and persistence cases. Earlier PowerShell missing-path search messages were not compiler failures. The new receipt test's initial query/type mismatch and UI-query timeouts were corrected before the passing suite. Browser exploration also identified and fixed the missing existing-document upload option and nonpersistent audit history.

Screenshots and final command logs are saved under `artifacts/track-a/`. The browser journey follows the five-minute script through student, wallet, officer, payment, receipt, broadcast and assistant interfaces. Sanction and Hindi screenshots were visually reviewed. No human-operated or hardware-device test is claimed.

## Product limits and operation

- Demo data lives in editable localStorage. This is not a server authorization boundary, encrypted vault, immutable audit log or official government receipt. The pilot's existing server workflow is separate.
- Government connectors, sample OCR/camera text and payments remain simulated. No Aadhaar OTP, SMS, IVR or actual money is sent. No certified e-Sign or public demo QR verifier is provided.
- Upload correction: use Document Wallet → Upload Document to add the required sample type/new version, then select it in Application & Tracker and send for review. Wrong-type, foreign and unchanged corrections are rejected. The old dashboard auto-clear shortcut was removed.
- On a source outage, restore the switchboard source and rerun verification. Outstanding sources/documents block stage actions; review the attachment and resolve the source check before proceeding. A re-run clears prior department approval so it must be recorded again.
- Demo document text edits may update a version in place; immutable file storage/version history belongs to the pilot. Reset demo intentionally discards local demo changes. There is no background demo replay or offline-sync guarantee.
- Browser speech depends on local support; no real microphone/audio-device or translation-review certification was performed. Full-page accessibility/mobile/translation work belongs to later tracks.
- No staging deployment, hosted RLS/Auth/Storage test, live connector, backup/restore rehearsal or operations certification was attempted. Track B remains the next release gate.

To reproduce: `npm install`, `npm run typecheck`, `npm test`, then `npm run test:demo-browser`. Use the documented pilot commands separately for pilot regression checks. No new package dependency was introduced.
