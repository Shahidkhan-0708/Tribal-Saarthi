# Untouched Tracks D/E: implementation and acceptance

Date: 18 October 2026. Dedicated staging: https://tribe-saarthi-staging.vercel.app. Government access and provider email credentials remain deferred. No production government connection, legal certification, physical-device proof or production capacity claim is made.

## Implemented

**D1:** Shared typed adapter contract, explicit client/server mode configuration, body-inclusive timeouts, bounded/sanitized responses, safe error states, source/reference audit metadata and idempotent persistence. Human review retains original provider mode and references. Staging explicitly uses simulation. Hosted checks prove a browser cannot select live mode and cannot call the service-only writer. Details and the next approved-provider gate: `docs/government-adapters.md`.

**E1:** Pilot-only manifest, 192/512 icons and Apple icon, real browser install event handling with dismissal/completion states, platform install guidance, compiled-asset offline shell and existing mobile file/camera inputs. A background install event survives the transition from login to the workspace. Default demo has no manifest link or pilot service worker. Push is not enabled; notifications are in-app on refresh. Native wrapper work is conditional on delivery requirements and has not been started.

**E2:** Single primary heading, skip link, main focus after navigation, autocomplete, native modal dialogs/inert background, keyboard signatures and focus return. A hosted check found focus was lost because asynchronous file loading disabled the opener before the modal remembered it; the opener is now captured before the request. Translated headings/labels declare Hindi; untranslated content declares English. Mobile reflow, keyboard reachability, stable routine announcements and control contrast are checked below.

**E3:** Owner-scoped, versioned document/family consent registry with append-only change events; immediate family revocation; erasure request and reason/due-date review; reviewed retention periods; admin access reviews; and a minimized processing-record export. Legacy family consent is labelled as migrated rather than newly granted. Privacy writes use the shared atomic quota and operation ledger. No automatic deletion runs, no arbitrary retention default is invented, and recording a review does not change account access. Organization approval and an erasure execution rehearsal remain separate operating work. `docs/data-protection.md` records the processing, retention, access and incident-response procedures.

**E4:** Server search and 50-record pages, 25-account invitation pages, bounded grievance history and family summaries, bounded current-action/document context, full-cohort scoped server analytics and broadcast counts, query indexes and 60-second catalogue TTL. Workflow actions, logout and explicit refresh invalidate catalogue cache. A single RLS-invoker snapshot RPC batches requested pages and excludes fresh catalogue pages. It does not bypass each table's policies. The browser no longer walks complete tables. Deep offset pagination is a documented small-pilot limit; group exports explicitly disclose the 1,000-group cap. Legacy JSON-null grievance history is covered by a regression test.

## Verification

- `npm run typecheck` and `npx tsc -p tsconfig.node.json --noEmit` pass.
- 86 Vitest tests pass, including adapter failures/body timeouts, real install-event state handling, page selection, catalogue expiry/invalidation and unchanged demo workflows.
- 114 PostgreSQL assertions and the deficiency suite pass, including RLS, consent revocation/history, retention/erasure review, privacy export, sandbox metadata, human-review provenance, batch paging and nullable history.
- 58 Edge/provider boundary assertions and four release-tool checks pass.
- Pilot build, default build/demo browser and offline/conflict browser tests pass. Default demo bundle remains `DemoApp-Xt4-YtSU.js`.
- `artifacts/track-de/hosted.json`: ten real-service privacy/adapter/isolation checks and ten-client performance samples. Ten hosted keyboard/mobile/PWA checks and five Track C browser regression groups pass; results: `artifacts/track-de/browser.json` and `artifacts/track-c/browser.json`.
- A fresh private pre-migration backup contains 48 database/Auth/private tables and ten private file objects in `.staging/backups/track-de-before`. A post-release private backup also contains all 51 database/Auth/private tables and 15 private objects, with a matching database SHA-256. The logical exporter now supports more than 50 tables. Earlier accepted restore evidence is preserved; a new restore drill was not repeated.

The initial multi-request snapshot measured 6,092 ms p95 with ten simultaneous clients. After batching, one run measured snapshot 1,561 ms and workflow 1,451 ms. The latest preserved run in `hosted.json` measured login 557 ms, snapshot 1,758 ms, preview 814 ms and workflow 6,011 ms. The last workflow observation exceeds the provisional 5,000 ms budget. Snapshot reads are bounded and substantially faster; stable workflow tail latency is not established.

Provisional budgets are login/snapshot/workflow 5,000 ms and preview 3,000 ms. These are ten warm-service observations using one synthetic administrator and the small current staging cohort. Workflow requests add notes concurrently to the same application, exercising a contended record. No causal attribution for the tail observation is claimed. The artifact's `passed` flag describes functional checks; each performance result has its own `withinProvisionalBudget` flag. Expected cohort/concurrency, workload distribution and service targets still need owner agreement; E4 scale acceptance remains open.

## Accessibility evidence and exceptions

Measured contrast: success text 7.74:1, error text 7.14:1, button text 7.44:1, input borders 4.68:1, focus on white 3.50:1 and on the dark header 3.40:1. Status always has text, not only colour. Automated/browser checks cover one `h1`, explicit language, 320-pixel reflow, 200% zoom, native dialog focus containment/Escape/return, install semantics and keyboard controls. Hosted critical-journey results are recorded in the browser artifact.

The critical checklist covers student login, private upload controls, immutable attachments, draft/submission/status, consent, officer approvals, typed sanction, private preview and analytics export. File selection is injected by the headless driver; actual camera/OS picker operation is not claimed. Broader administration/grievance/recovery form combinations have existing validation coverage but have not all been retested by keyboard.

Actual NVDA/JAWS/VoiceOver and mobile assistive technology have not been exercised. Headless keyboard/semantic checks do not establish full WCAG conformance. Physical Android/iOS installation, real camera capture and the complete device notification journey remain E1 acceptance. No approved government sandbox exists, so D2 and every later government integration remain open and are not simulated as completion.

Offline follow-up: queue entries now receive a durable sequence in one IndexedDB write transaction, preventing timestamp ties from replaying dependent changes out of order. Legacy entries retain timestamp order. New-draft conflicts use an owner/scheme/year server lookup rather than the currently visible application page. Both cases have regression tests.

## Reproduce

Run local checks above. With the existing private staging credentials, run `npm run test:track-de-staging` and `npm run test:track-de-browser`. Hosted tests create explicitly synthetic workflow/configuration records and never send email or execute real payments. The browser test exercises the actual student attachment/submission and officer approval/sanction controls; API setup supplies explicitly simulated human source reviews. Regenerate icons with `node scripts/generate-pwa-icons.mjs`.

Track B B1/B4/B5 and Track C C5 stay open for deferred mail/operational gates. Security findings and device/policy exceptions must remain visible before real enrollment.

Security advisor review: no ERROR findings. WARN findings are explicit authenticated definer boundaries for minimal family summaries, exact scoped broadcast counts, validated privacy writes and the administrator-only processing record; these functions derive the active caller and validate scope/role. Leaked-password protection remains disabled and is an existing hosted release limitation. The report is `artifacts/track-de/security-advisors.json`.

Final code checks:86unit/UI tests,114SQL assertions,58Edge/provider assertions,4release-tool checks; pilot build and offline/conflict browser pass after FIFO/paginated-conflict follow-ups. Physical devices, actual screen readers, provider credentials and the E4tail-latency acceptance gate remain open.

Final frontend deployment: `dpl_DCu1cKLfpwCMWD7k9JBwPpCt8rDh` at the canonical staging URL; seven D/E migrations and the workflow/accounts endpoints are deployed.

Final deployment regression: five hosted Track C browser groups pass against the final frontend, including account/configuration controls, audit exports, grievance/lifecycle view, scoped analytics/broadcast controls and public receipt revocation.


## Phase14 performance/operations follow-up

Current ten-client p95ms:login651,snapshot1850,preview581,workflow1352; every provisional budget passes. Before/after samples are preserved separately in artifacts/operations/. Earlier6,011ms observations above are historical, not the latest result. Append-only notes now share an application lock; exclusive decision locks, role/scope and version checks remain. Production workload/volume/targets still need owner agreement; no capacity extrapolation is claimed. Current102unit/UI tests,154DB assertions,79Edge/provider/operations assertions and deployed operations evidence are in operations-automation.md. Device/screen-reader/provider/policy acceptance gates remain manual.
