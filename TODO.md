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
