# MVP Implementation Plan: Adimool / Tribe Saarthi

> Autonomous Tri-Agent Tracking (Antigravity ↔ Roo Code ↔ Ralph Loop)

---

## Phase 1: Core Data Models & Explainable Eligibility Rules Engine

- [x] **[TASK-1.1]** Define core TypeScript types in `src/types/index.ts` (`Student`, `Scheme`, `Application`, `Document`, `VerificationLog`, `CoverageSnapshot`).
- [x] **[TASK-1.2]** Implement `src/lib/db.ts` for `localStorage`-backed mock DB and store hydration.
- [x] **[TASK-1.3]** Implement `src/lib/seed.ts` for loading and resetting seed data.
- [x] **[TASK-1.4]** Create `src/lib/format.ts` for formatting helpers (currency, dates, badge variants).
- [x] **[TASK-1.5]** Create `src/lib/audit.ts` for an append-only audit logger.
- [x] **[TASK-1.6]** Populate initial seed data in `src/data/schemes.ts`, `src/data/students.ts`, `src/data/institutions.ts`, `src/data/applications.ts`, and `src/data/coverage.ts`.
- [x] **[TASK-1.7]** Develop `src/engines/eligibility.ts` rules engine with per-rule PASS/FAIL evidence trail.
- [x] **[TASK-1.8]** Create UI primitives in `src/components/ui/` (`Button`, `Card`, `Badge`, `Modal`, `Tabs`, `Input`) and layout shell in `src/components/layout/`.

---

## Phase 2: Application State Machine & Verification Pipeline

- [x] **[TASK-2.1]** Implement application state management in `src/store/data.ts` for `Submitted → Institute → Dept → Sanctioned → DBT`.
- [x] **[TASK-2.2]** Develop `src/engines/verification.ts` multi-source pipeline and exception routing state machine (`MISMATCH → review`, `SOURCE_DOWN → pending`).
- [x] **[TASK-2.3]** Create `src/engines/ocr.ts` for simulated OCR and certificate mismatch detection.
- [x] **[TASK-2.4]** Design and implement student pages: `Discovery.tsx`, `Application.tsx`, `Wallet.tsx`, and `Dashboard.tsx`.
- [x] **[TASK-2.5]** Implement document wallet actions in `src/store/data.ts` (upload/verify/attach/resubmit).
- [x] **[TASK-2.6]** Implement notifications in `src/store/data.ts` (in-app, SMS, email mock).

---

## Phase 3: DigiLocker-Style Document Wallet & Cross-Scheme Reuse Store

- [x] **[TASK-3.1]** Refine `src/pages/Student/Wallet.tsx` with full document upload, verification status display, and cross-scheme reuse functionality.
- [x] **[TASK-3.2]** Provide document cards, upload modals, and discrepancy badges in student wallet.
- [x] **[TASK-3.3]** Ensure `src/lib/audit.ts` logs all document-related actions and verification events.
- [x] **[TASK-3.4]** Integrate OCR simulation (`src/engines/ocr.ts`) with document wallet for discrepancy flagging.

---

## Phase 4: Government Officer Portal & Coverage-Gap Analytics

- [x] **[TASK-4.1]** Implement officer-facing review interface in `src/pages/Officer/ReviewQueue.tsx` (multi-level verification workflow).
- [x] **[TASK-4.2]** Implement district coverage analytics in `src/pages/Officer/CoverageGap.tsx`.
- [x] **[TASK-4.3]** Develop `src/engines/coverage.ts` for UDISE+ and Census 2011 district coverage-gap computation.
- [x] **[TASK-4.4]** Create `src/engines/saarthi.ts` for contextual intent parsing and assistance.
- [x] **[TASK-4.5]** Implement `src/store/session.ts` for role switching (Student, BIT Mesra Officer, State Nodal Officer).
- [x] **[TASK-4.6]** Implement `src/store/network.ts` for online/offline toggling and sync state.

---

## Phase 5: Officer Broadcasts, Deficiency Resolver & Exportable Audit Trails

- [x] **[TASK-5.1]** Create `src/pages/Officer/NotificationsAdmin.tsx` (broadcast announcements, simulated SMS/IVR dispatch).
- [x] **[TASK-5.2]** Add interactive **Application Detail & Deficiency Resolution Modal** in `src/pages/Officer/ReviewQueue.tsx`.
- [x] **[TASK-5.3]** Implement `src/pages/Officer/AuditLog.tsx` for inspectable tamper-evident logs and CSV export.
- [x] **[TASK-5.4]** Wire Phase 5 routes in `src/App.tsx` and navigation items in layout.
- [x] **[TASK-5.5]** Verify test suite and type safety across the entire application.

---

## Phase 6: Hackathon-Winning Competitive Edge & Deep Field Hardening

- [x] **[TASK-6.1]** Add printable/exportable Application Acknowledgement Slip with QR Verification and tamper-evident cryptographic hash in `src/pages/Student/Application.tsx`.
- [x] **[TASK-6.2]** Implement PVTG Demographic Saturation Matrix (Baiga, Birhor, Sahariya breakdown) and District Drop-Off Alerts in `src/pages/Officer/CoverageGap.tsx`.
- [x] **[TASK-6.3]** Enhance Saarthi Voice Assistant in `src/components/saarthi/` with Web Speech API audio synthesis and multi-language voice prompts (Hindi, Santhali, English).
- [x] **[TASK-6.4]** Build Field Officer Offline Bulk Queue & Sync Engine in `src/store/network.ts` with packet replay and conflict resolution.
- [x] **[TASK-6.5]** Create automated end-to-end integration test suite in `src/engines/verification.test.ts` covering multi-source pipeline failover and honest degradation.

---

## Phase 7: Evaluator Pitch Readiness & Field Experience Polishing

- [x] **[TASK-7.1]** Implement Longitudinal Scholarship & DBT Disbursement History Timeline in `src/pages/Student/History.tsx` with PFMS transaction identifiers.
- [x] **[TASK-7.2]** Build Interactive Live "Kill-A-Source" Sabotage Switchboard widget in `src/pages/Officer/ReviewQueue.tsx` with live failure router demonstrations.
- [x] **[TASK-7.3]** Implement simulated government integration badges and authenticity certificate inspectors across student and officer portals.
- [x] **[TASK-7.4]** Add UI Language Switcher support for Santhali (Ol Chiki script), Hindi, and English with live locale toggle.
- [x] **[TASK-7.5]** Implement 5-Minute Evaluator Guided Pitch Tour mode with walkthrough markers matching the hackathon demo narrative.

---

## Phase 8: GovStack & IndiaStack Digital Public Infrastructure (DPI) Integration

- [x] **[TASK-8.1]** Integrate APAAR (One Nation, One Student ID) & Academic Bank of Credits (ABC) card in `src/pages/Student/Dashboard.tsx` with NEP 2020 12-digit student registry identifiers.
- [x] **[TASK-8.2]** Implement UIDAI Aadhaar OTP e-KYC Verification Modal in `src/components/common/AadhaarOtpModal.tsx` with 6-box auto-focus progression and wire into `src/pages/Student/Wallet.tsx` DigiLocker pull.
- [x] **[TASK-8.3]** Implement IT Act (2000) compliant Officer Digital e-Signature ("e-Sign") Pad in `src/components/common/SignaturePadModal.tsx` and wire into `src/pages/Officer/ReviewQueue.tsx` for DBT sanction batch authorization.


## Phase 9: Track A - Demo and claim hardening

- [x] [TASK-9.1] A1: Fix persona switcher.
- [x] [TASK-9.2] A2: Correct document deficiency type and deadline.
- [x] [TASK-9.3] A3: Persist application-document reuse links.
- [x] [TASK-9.4] A4: Route verification outcomes deterministically.
- [x] [TASK-9.5] A5: Gate stage approvals on sources and documents.
- [x] [TASK-9.6] A6: Separate signed sanction from simulated disbursement.
- [x] [TASK-9.7] A7: Remove fabricated receipt hash/QR and integrity claims.
- [x] [TASK-9.8] A8: Fix broadcast targeting and exact recipient counts.
- [x] [TASK-9.9] A9: Fix coverage worst/best labels.
- [x] [TASK-9.10] A10: Remove demo offline-sync controls and claims.
- [x] [TASK-9.11] A11: Highlight and navigate all guided-tour targets.
- [x] [TASK-9.12] A12: Correct language, scheme and integration claims.

## Phase 10: Track B - Pilot release gate

Track A passed its local exit gate. Track B is in progress; hosted acceptance is required before checking these tasks.

- [ ] [TASK-10.1] B1: Backend/frontend, Auth lockdown/redirects/CORS and owner admin login verified. Brevo settings and guarded apply command prepared; credentials/email delivery deferred by owner.
- [x] [TASK-10.2] B2: Hosted authorization proved: 76 matrix assertions, five genuine-expiry/signup/CORS/inactive checks, seven browser role logins, QR/public receipt and request-ID/screenshot evidence. Typecheck and 73 tests PASS.
- [x] [TASK-10.3] B3: Real PDF/JPEG/PNG bytes and SHA-256, six private objects, exact pilot counts and seven Auth UUIDs restored separately; same student password/UUID login and private preview PASS. Typecheck and 73 tests PASS.
- [ ] [TASK-10.4] B4: Quotas, daily encrypted backups, off-provider scheduled copy, five-minute monitor/email Cron and real failure/recovery in-app alerts verified. Owner malware/participant-risk decision, production runner/retention and external-alert acceptance remain open.
- [ ] [TASK-10.5] B5: Hosted document-to-payment/receipt/family workflow and browser QR pass. Delivered/accepted admin invitations pending Brevo credentials.

## Phase 11: Track C - Pilot workflow completion

Owner requested this phase while deferring Brevo credentials. Evidence: docs/track-c-verification.md. Track B B1/B4/B5 remain open.

- [x] [TASK-11.1] C1: Account list, pending invitations/resend, deactivation/reactivation, immediate role changes and erasure request; hosted access/session/Storage checks pass.
- [x] [TASK-11.2] C2: Scoped server filters, pagination, details and CSV/JSON audit export; actual filtered browser download passes.
- [x] [TASK-11.3] C3: Explicit local/server draft comparison and reviewed retry with a new operation ID; unrelated work retained; browser conflict resolution passes.
- [x] [TASK-11.4] C4: Private evidence, categories/SLA, priority, assignment notices, timeline, escalation and resolution appeals; hosted and database checks pass.
- [ ] [TASK-11.5] C5: Critical email queue, Brevo adapter, attempt history, retry protection and five-minute processor deployed; real provider acknowledgement/delivery awaits owner credentials and controlled mailbox acceptance.
- [x] [TASK-11.6] C6: Scoped coverage/funnel CSV, charts, source/comparability flags and pilot-only banner; browser export passes.
- [x] [TASK-11.7] C7: Canonical decision receipt chain, audited revocation/optional expiry and minimal rate-limited public response; hosted/browser checks pass.
- [x] [TASK-11.8] C8: Linked renewal/eligibility delta, withdrawal, appeal/review and per-record bulk sanction; hosted allowed/denied paths pass.
- [x] [TASK-11.9] C9: Scheme draft/diff/dry-run/publish/history/rollback and institution activation checks; hosted/database/browser checks pass.

## Phase 12: Untouched Tracks D and E

Owner requested work that has not been touched. Existing mail and operations gates remain open.

- [x] [TASK-12.1] D1: Shared integration contract, explicit modes, safe failure routing, metadata and contract tests; wire pilot verification without claiming a government connection.
- [ ] [TASK-12.2] D2: DigiLocker authorized sandbox connection and real consent/fetch proof; later integrations follow only after its acceptance.
- [ ] [TASK-12.3] E1: PWA/install/icons/offline/capture implemented and browser-tested; physical-device installation/camera/notification acceptance remains open.
- [x] [TASK-12.4] E2: Critical student/officer keyboard, semantics, focus, 320px/zoom and contrast audit; fix verified defects and record exceptions.
- [x] [TASK-12.5] E3: Consent history/revocation, retention/erasure review, processing records and incident/access-review runbook; do not claim legal approval or silently erase audit history.
- [ ] [TASK-12.6] E4: Pages/search, complete scoped metrics, TTL/indexes and ten-client checks verified; latest p95 login651/snapshot1850/preview581/workflow1352 ms meets all provisional targets. Owner agreement on production volume/workload/targets remains open.

Phase 12 evidence: docs/track-de-verification.md; hosted privacy/adapter and critical keyboard/browser journeys pass. D2, E1 and E4 acceptance gates are left unchecked; B/C deferred provider/operations gates remain unchanged.

- [x] [TASK-12.7] Repair logical snapshot export beyond 50 tables after E3 schema additions; actual post-release 51-table database/Auth snapshot saved without replacing earlier evidence.

- [x] [TASK-12.8] Fix same-millisecond offline FIFO with atomic persisted sequence numbers; match conflicting new drafts by owner/scheme/year independently of visible pagination; regression coverage added.

## Phase 13: Frontend feature connections

- [x] [TASK-13.1] Audit implemented user actions and connect missing pilot notes, signatures, institution lifecycle/history, account refresh and paged records; expose demo officer grievances; minimize version targets and enforce officer-only note reads.
- [x] [TASK-13.2] Verify frontend contracts and real browser/server persistence, run regressions and both builds, update feature status and deploy staging.

Phase 13 evidence: docs/frontend-connections.md; 98 unit/UI tests, 123 DB assertions plus deficiency suite, 58 Edge/provider assertions, both builds/type checks, demo/offline browser regressions, seven focused hosted frontend groups and 16 hosted note-access assertions pass. Existing provider/operations/device/performance gates remain open.

## Phase 14: Close remaining work that does not need owner input

- [x] [TASK-14.1] Measure and address workflow contention without weakening authorization/version checks; preserve honest performance evidence.
- [x] [TASK-14.2] Enable protected automatic database/Auth/private-byte backups, scheduled monitoring and email processing; show operator job status and prove failure/recovery.
- [x] [TASK-14.3] Verify encrypted backup recovery/access denial and current app regressions; deploy and separate owner-only acceptance steps from completed implementation.

Phase 14 evidence: docs/operations-automation.md and artifacts/operations/. 102 unit/UI tests,154 DB assertions plus deficiency suite,79 Edge/provider/operations assertions,4 release-tool checks,type checks,both builds,demo/offline browser,5 hosted operations groups,3 operations UI groups,16 note-access assertions and current staging health pass. Natural encrypted backup52tables/15objects; cloud and independent local recovery verify all checksums. Windows scheduled copy LastTaskResult0. All remaining unchecked task IDs require owner credentials/access, devices or acceptance decisions; exact actions: docs/owner-actions.md. No government integration or production release is claimed.

## Phase 15: Start the application stack

- [x] [TASK-15.1] Start the local pilot frontend against the existing hosted staging backend; configure public frontend settings and exact localhost CORS; verify sign-in, data, Edge access, background schedules and regression checks.
- [x] [TASK-15.2] Provide working demo access alongside authenticated pilot accounts; fix the reported browser offline-permission warning in local development and verify production fallback/offline support.

Phase 15 evidence: artifacts/startup/session.json. Frontend HTTP 200 at http://localhost:5173; real administrator sign-in, database workspace, authenticated Edge account read and operations refresh pass with zero browser errors/failed requests. Backend ACTIVE_HEALTHY, all four Cron jobs active, backup fresh and no failed jobs. Windows backup-copy task last result 0. Typecheck and all 102 tests pass. Brevo delivery and existing owner acceptance gates remain open.

TASK-15.2 evidence: artifacts/startup/demo-access.json. Demo http://localhost:5174 opens seeded Asha automatically; student/institution/nodal/admin switching and sign-out/one-click student login pass. Local pilot real student sign-in succeeds with service workers explicitly denied, without registration attempts or the reported raw exception. Production offline install, cached reload, replay/conflict regression and denied-permission online-sign-in fallback pass. Typecheck and 105 tests pass. These changes are verified locally; the previously deployed hosted frontend is unchanged.

## Phase 16: Interface simplification research

- [x] [TASK-16.1] Inspect current demo/pilot screens and source; record representative desktop/mobile clutter, navigation and wording evidence.
- [x] [TASK-16.2] Use Context7 and official component/service-design documentation to select supplied professional components/icons and verify compatibility requirements.
- [x] [TASK-16.3] Write a sourced simplification plan, component-to-feature mapping, migration order and verification criteria without generating UI components.

Evidence: docs/ui-simplification-research.md and .gsd/evidence/ui-research/. Eight current-interface screenshots/DOM measurements; missing demo mobile navigation and 5px overflow at390px; eleven pilot student destinations; unread informational notices incorrectly called pending actions. Recommendation: packaged MUI Core plus existing Lucide, with React18 react-is compatibility and Tailwind3 reset/injection integration. Research only: application source/dependencies/deployment unchanged; this is not a completed redesign.

## Phase 17: Interface simplification implementation

- [x] [TASK-17.1] Integrated the documented professional component foundation and responsive navigation using supplied MUI components:
  - Installed `@mui/material@9.5.0`, `@emotion/react@11.14.0`, `@emotion/styled@11.14.1`, with pinned `react-is@18.3.1` dependency and npm override.
  - Implemented `src/lib/theme.tsx` with `StyledEngineProvider injectFirst` preserving Tailwind v3 resets and palette.
  - Replaced rigid desktop-only sidebar in `src/components/layout/index.tsx` with responsive MUI `Drawer` (permanent on desktop, temporary with accessible `Menu` button on small screens).
  - Streamlined `src/pages/Student/Dashboard.tsx` to put Next Required Action and authoritative application lifecycle first, separated true deficiencies from informational updates, compact greeting, accessible APAAR card summary with modal, and resolved 390px mobile horizontal overflow.
  - Verified with `npm run typecheck` (exit 0), full Vitest suite (20 files, 106 tests passed), `test:demo-browser` (Playwright Chromium PASS), `test:browser` (pilot Chromium PASS), and both production builds (`npm run build` and `npm run build:pilot`).

