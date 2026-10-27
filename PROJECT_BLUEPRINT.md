# Adimool — Prototype Implementation Blueprint
### SIH 2026 · PS 26238 — "Unified Scholarship Mobile Application for Tribal Students" (Ministry of Tribal Affairs)

> One-line description:
> *"A unified scholarship orchestration and verification platform for tribal students that connects NSP, SFMP and NOS into one student experience, reuses verified documents via a DigiLocker-backed wallet, tracks the complete application-to-DBT lifecycle, routes every verification exception to human review — never silently passing or silently rejecting a tribal student — and grounds coverage-gap analytics in real public UDISE+/Census data."*

---

## 1. Hackathon MVP Scope & Demo Narrative

### 1.1 The 5 features judges MUST see in the 5-minute pitch

Research conclusion (from `Pasted markdown(20260928-095245) (1).md`): at least **13 student teams** are building near-identical feature sets for this PS. The only defensible differentiation is **execution depth on the 3 open areas** — real eligibility/coverage-gap logic, honest verification-failure handling, low-connectivity design — plus a unified document-reuse workflow. Our MVP is scoped accordingly:

| # | Feature | Why it wins | Depth level |
|---|---------|-------------|-------------|
| 1 | **Explainable Eligibility Engine** | Every matched/unmatched scheme shows a *rule-by-rule audit trail* (✓ ST status matched, ✕ income below threshold,…), sourced from a configurable rules JSON — not hardcoded if-else. Judges can inspect the rules file live. | **REAL engine** |
| 2 | **DigiLocker-Style Document Wallet with cross-scheme reuse** | Upload once → verify once → reuse across all 4 scheme applications + rule-based OCR discrepancy flagging vs. the student profile. | **REAL UI + SIMULATED DigiLocker / OCR adapter** |
| 3 | **Real-time Multi-level Verification Pipeline** (the kill-a-source demo) | Every application runs through Identity → ST/PVTG → Income → Institute → Dept. verification. Each source can be *sabotaged live in the demo*; system NEVER auto-passes or auto-rejects: MISMATCH → human_review, SOURCE_DOWN → review pending. Full audit trail on each check. | **REAL state machine + SIMULATED source adapters** |
| 4 | **Beneficiary Gap Analytics (Government Portal)** | Coverage-gap panel calculating "Enrolled ST students − availing students = unreached", powered by public UDISE+ / Census ST-enrollment aggregates (shown on-screen with source citation) — not invented numbers. | **REAL analytics over semi-real seeded data** |
| 5 | **Saarthi Multilingual / Voice Assistant** | NOT a JAGO clone. Answers *contextually from the student's live application state*: "Why is my scholarship pending?" → pulls real verification-stage data, tells the student exactly which doc to fix and by when. Regional language + Voice toggle. | **REAL contextual engine over app state + SIMULATED LLM/NLU** |

### 1.2 What to build REAL vs SIMULATED — explicit contract

| Component | Status | Notes |
|-----------|--------|-------|
| Auth & Role-based Access (student/institution/nodal/admin) | ✅ REAL | RBAC enforced per user; demo-only session store |
| Student Profile (ST/PVTG-specific fields) | ✅ REAL | Tribe, PVTG flag, Aadhaar-last-4, caste-cert ID, family income |
| Scholarship Schemes (Post-Matric, Top-Class, NFST, NOS) | ✅ REAL | 4 schemes seeded from real MoTA rules |
| Eligibility Rules Engine | ✅ REAL | Configurable JSON rules, explainable output, audit trail |
| Application State Machine | ✅ REAL | Submitted → Institute → Dept → Sanctioned → DBT |
| Document Wallet (upload/verify/reuse) | ✅ REAL UI | Local mock blob; versioned; per-application reuse map |
| Verification Pipeline & Exception Router | ✅ REAL | MISMATCH → review; SOURCE_DOWN → pending; never silent |
| Deficiency Management | ✅ REAL | Detect → explain → notify → correct → resubmit → reverify |
| Notifications Engine | ✅ REAL | In-app + toast, simulating SMS/email reminders |
| Officer / Nodal / Admin Dashboards | ✅ REAL | Review queue, approve/reject with reason, gap analytics |
| Coverage-Gap Analytics | ✅ REAL math | Uses PUBLIC UDISE+/Census figures cited on screen; individual demo records labeled SYNTHETIC |
| Audit Log | ✅ REAL | Who did what, when, on which entity — inspectable in UI |
| Saarthi Assistant | ✅ REAL context | Voice input via Web Speech API; intent matching over live app state |
| Offline / Low-bandwidth Simulation | ✅ REAL | Service worker + localStorage cache; "Go offline" toggle; queued sync |
| DigiLocker / UIDAI / UDISE+ / APAAR / NSP / PFMS / DBT connectors | 🔶 SIMULATED | Clearly badged "SIMULATED GOVERNMENT INTEGRATION"; adapter pattern so real APIs can replace them |
| Peerless LLM-generated prose | 🔶 SIMULATED | Saarthi uses template-based NL generation over real app state (no external LLM key needed for demo) |

### 1.3 Demo Narrative — "One Student's Journey" (Asha)

Script beats (see `docs/demo-script.md` for full 5-min version):

```
1. (30s) Asha logs in → profile pre-loaded (ST, PVTG?, family income, Aadhaar …)
2. (45s) Scholarship Discovery → REAL engine evaluates 4 MoTA schemes
         → 3 eligible, 1 not — with a rule-by-rule "Why?" audit trail
3. (45s) Document Wallet → docs already uploaded & verified last cycle
         → reused across NSP/SFMP/NOS equivalents; one-click attach
         → OCR simulation flags a DOB mismatch on one cert → MANUAL REVIEW (never auto-reject)
4. (60s) Application submitted →Verification Pipeline runs Identity→ST→Income→Institute→Dept
         → DEMO MOMENT: judge asks to "kill the income source" →
            system honesty: verification "PENDING (source unavailable)", app NOT rejected,
            case routed → Nodal Officer review queue
5. (45s) Switch to Officer Portal → approve → Sanction → DBT status turns "Successful" (PFMS simulated)
6. (45s) Saarthi Assistant → student asks "Why is my scholarship pending?" in Hindi/Voice
         → answers from LIVE application state, not canned FAQ
7. (30s) Government Coverage Dashboard → District-level gap analytics
         → "Enrolled ST students vs. availing" sourced from public UDISE+ figures
8. (20s) Show offline mode toggle + SIMULATED badges → close with the honest-integration pitch
```

---

## 2. Tech Stack & Architecture

| Layer | Choice | Why |
|-------|--------|-----|
| Build | **Vite + React 18 + TypeScript** | Fastest DX, instant HMR for a hackathon-quality prototype; `npm run build` works offline |
| Styling | **Tailwind CSS v3** | Uncertain-design-speed; consistent tokens for accessible colors/typography |
| Routing | `react-router-dom` v6 | Three portals (student/institution/government) as lazy routes |
| State | **Zustand** + React Context for theme/lang | Simple, no provider hell, works well with the state machines we need |
| Persistence | **localStorage-backed mock DB** (`src/lib/db.ts`) + a small IndexedDB layer for doc blobs | Zero-config, survives refresh; a real Supabase/Postgres can be swapped later via the same interface |
| Icons | `lucide-react` | Clean, light, no icon-font loading cost |
| Forms | Native React state + `zod`-like manual validation (keep it light) | Hackathon speed |
| Charts | `recharts` | For coverage-gap bar/donut charts |
| Voice | Web Speech API (`webkitSpeechRecognition`) | Zero-dependency voice input for Saarthi |
| Offline | Custom `beforeunload`-safe service-lite cache + localStorage | Simulation of offline/low-bandwidth, no heavy PWA scaffolding |

### 2.1 Component / State Architecture

```
App Shell (ThemeProvider, LanguageProvider, SessionProvider)
   ├── StudentPortal (lazy route)
   │     ├── Dashboard (notices, active application card, action items)
   │     ├── DiscoveryPage (scheme cards + eligibility engine audit trail)
   │     ├── DocumentWalletPage (upload/verify/reuse across schemes)
   │     ├── ApplicationPage (pre-filled form, verification pipeline live view)
   │     ├── HistoryPage (longitudinal scholarship history)
   │     └── SaarthiAssistant (floating contextual chat + voice)
   ├── OfficerPortal/NodalPortal/AdminPortal (lazy routes, role-gated)
   │     ├── ReviewQueuePage (multi-level verification workflow)
   │     ├── ApplicationDetailPage (full audit trail, deficiency creation)
   │     ├── CoverageGapPage (UDISE+ analytics + charts)
   │     └── NotificationsAdminPage (broadcast, SMS/email simulation)
   └── Shared
         ├── ui/ (Button, Badge, Card, Modal, Stepper, Tabs, Tooltip, VoiceButton)
         ├── layout/ (Sidebar, Topbar, LanguageSelector, ThemeToggle, OfflineIndicator)
         └── engines/ (rules/verification/ocr/coverage/audit — pure TS, UI-agnostic)
```

State slices (Zustand):
- `session` — current user + role
- `schemes` — static scheme rules
- `students` — demo records
- `applications` — full state machine per application
- `documents` — wallet contents + verification results
- `notifications` — per-user actionables
- `audit` — append-only log
- `network` — online/offline toggle + sync queue

---

## 3. Complete Project Directory & File Tree

```
adimool/   (this repo)
├── PROJECT_BLUEPRINT.md            ← this file
├── README.md                       ← quick start + landscape cheat sheet for the pitch
├── package.json
├── tsconfig.json / tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── index.html
├── docs/
│   ├── demo-script.md              ← the exact 5-min pitch script
│   └── pitch-cheatsheet.md         ← NSP/SFMP/NOS/JAGO/Odisha/Karnataka one-liners + Q&A to the 15 evaluator questions
├── public/
│   ├── favicon.svg
│   └── mock-certs/                 ← synthetic PDF-page-style certificate images / .txt stubs for OCR demo
├── src/
│   ├── main.tsx
│   ├── App.tsx                     ← route table, lazy splits, auth gating
│   ├── index.css                   ← Tailwind + design tokens
│   ├── types/
│   │   └── index.ts                ← all domain types (Student, Scheme, Application, Document, Verification …)
│   ├── lib/
│   │   ├── db.ts                   ← localStorage mock DB + Zustand store hydration
│   │   ├── seed.ts                 ← seed data loader (runs once per session; "Reset demo" button)
│   │   ├── format.ts               ← ₹ formatting, date, status-color helpers
│   │   └── audit.ts                ← append-only audit logger used by all engines
│   ├── data/
│   │   ├── schemes.ts              ← 4 MoTA schemes with REAL rule structures
│   │   ├── students.ts             ← 3 seeded tribal students (ST / PVTG / low-connectivity)
│   │   ├── institutions.ts        ← 3 seeded institutions (IIT / State Univ / Govt. College)
│   │   ├── documents.ts            ← pre-uploaded wallet items per student
│   │   ├── applications.ts         ← mid-flight & completed applications for demo states
│   │   └── coverage.ts             ← public UDISE+/Census ST-enrollment aggregates per district
│   ├── engines/
│   │   ├── eligibility.ts          ← rules engine w/ per-rule PASS/FAIL evidence trail
│   │   ├── verification.ts         ← multi-source pipeline + exception routing state machine
│   │   ├── ocr.ts                  ← simulated OCR: seeded text → profile → mismatch detection
│   │   ├── coverage.ts             ← district coverage-gap computation
│   │   └── saarthi.ts              ← contextual intent parsing → templates over live app state
│   ├── store/
│   │   ├── session.ts              ← current user/role
│   │   ├── applications.ts         ← application state machine + actions
│   │   ├── documents.ts            ← wallet actions (upload/verify/attach/resubmit)
│   │   ├── notifications.ts        ← push/dismiss/mark-read + simulated SMS/email
│   │   ├── network.ts              ← online/offline toggle + sync queue
│   │   └── ui.ts                   ← modal/breadcrumb/locale/theme
│   ├── pages/
│   │   ├── Student/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Discovery.tsx
│   │   │   ├── Wallet.tsx
│   │   │   ├── Application.tsx
│   │   │   ├── History.tsx
│   │   │   └── Saarthi.tsx
│   │   ├── Officer/
│   │   │   ├── ReviewQueue.tsx
│   │   │   ├── ApplicationReview.tsx
│   │   │   ├── CoverageGap.tsx
│   │   │   └── Broadcast.tsx
│   │   └── Auth/
│   │       └── Login.tsx
│   ├── components/
│   │   ├── ui/                     ← Button, Card, Badge, Modal, Stepper, Tabs, Tooltip, EmptyState, VoiceButton
│   │   ├── layout/                 ← Sidebar, Topbar, LanguageSelector, ThemeToggle, OfflineIndicator, SimulatedBadge
│   │   ├── discovery/              ← SchemeCard, EligibilityAuditTable, RuleRow
│   │   ├── wallet/                 ← DocumentCard, UploadModal, ReuseMap, VerificationBadge
│   │   ├── application/            ← ApplicationForm, VerificationPipeline, DeficiencyCard
│   │   ├── review/                 ← ReviewCard, DeficiencyForm, AuditTrailTable
│   │   ├── analytics/              ← GapBarChart, DistrictTable, DataSourceBadge
│   │   └── saarthi/                ← ChatWindow, MessageBubble, VoiceInput, SuggestionChips
│   └── i18n/                       ← en / hi / or / te / bh / sant / ho locale strings for key UI + Saarthi templates
```

---

## 4. Core Data Models & Seed Data

### 4.1 Types (abridged — full definitions in `src/types/index.ts`)

```ts
Student { id, name, gender, dob, aadhaarLast4, tribe, isPVTG, category: 'ST',
          familyIncome, domicileState, domicileDistrict, homeVillage, family,
          language, class: 'post-matric'|'undergrad'|'postgrad'|'overseas',
          course, institutionId, year, parentId?, consentFamilyView }
Scheme { id, name, portal: 'NSP'|'SFMP'|'NOS', minClass, maxIncome,
         minMarks, minAttendance, requiredDocs: DocKey[],
         courseLevelFilter, domicileFilter, deadline, amount, notes }
Application { id, studentId, schemeId, status, rejectionReason?, deficiency?, stage }
Document { id, studentId, type, version, uploadedAt, verified?, ocrFields, mismatch?, reuseCount }
VerificationLog { id, applicationId, source: 'identity'|'st'|'income'|'institution'|'academic',
                  state: 'verified'|'mismatch'|'source_down'|'manual_review'|'pending',
                  reason, reviewer?, resolvedAt }
CoverageSnapshot { district, stPopulation, stEnrolled, availing, source, year }
```

### 4.2 Seed Students (3 diverse ST profiles)

1. **Asha Kiran Ekka** — Oraon tribe, Jharkhand (ST), B.Tech CSE at BIT Mesra. Family income ₹1.8L. Seeded wallet fully verified; one scheme application mid-flight at Department stage (perfect for the demo moment).
2. **Mohan Ram Rojat** — Baiga (a **PVTG**), Madhya Pradesh. B.A. at Govt. PG College, income ₹92k. Has a DOB mismatch on his ST certificate → shows MISMATCH → MANUAL REVIEW flow with deficiency notification.
3. **Sunita Murmu** — Santal, Odisha, Class 12 (post-matric) at a Government Junior College, income ₹1.2L. Family View consented for her father; intermediate wallet verification states, low-connectivity persona for the offline demo.

### 4.3 Schemes (4 real MoTA schemes, real rules)

| Scheme | Portal | Level | Income cap | Key rules |
|--------|--------|-------|-----------|-----------|
| Post-Matric Scholarship (PMS-ST) | NSP | Post-matric (Class 11 → PhD) | ₹2.5L | ST + income ≤ 2.5L + ≥ 50% attendance + course in approved list |
| National Top-Class ST Scholarship | NSP | UG/PG at notified premier institutes | ₹2.5L / 6.0L (as notified) | ST + top institute list + income ≤ 2.5L→6L family cap + marks ≥ 50%/60% |
| National Fellowship (NFST) | SFMP | M.Phil/Ph.D | ₹6.0L | ST + admitted to a recognized university + no other fellowship |
| National Overseas Scholarship (NOS) | NOS | PG/PhD abroad | ₹6.8L | ST + ≥ 60% marks PG/55% UG + income ≤ 6.8L + unconditional-admit case |

*Full rule tables with per-parameter fields and explainable rule IDs in `src/data/schemes.ts`.*

### 4.4 Coverage snapshot districts (real public data, cited)

Public aggregates from UDISE+ 2021-22 & Census 2011 (cited on screen as `udiseplus.gov.in` / `censusindia.gov.in`) for 4 demo districts — Mathura-like synthetic district names are NOT used; we use real ST-dense districts with public figures in `src/data/coverage.ts`.

---

## 5. Implementation Roadmap

| Phase | Deliverable | Files |
|-------|------------|-------|
| **1** | Project init, tokens/UI, mock DB, seed | scaffolding + `lib/db.ts`, `data/*.ts`, `components/ui/*` |
| **2** | Student Portal: Discovery + Eligibility Engine + Wallet + Application | `engines/eligibility.ts`, `pages/Student/*` |
| **3** | Officer Portal: Review Queue + audit trail + Coverage Gap | `engines/verification.ts`, `engines/coverage.ts`, `pages/Officer/*` |
| **4** | Saarthi + offline simulation | `engines/saarthi.ts`, `store/network.ts`, `components/saarthi/*` |
| **5** | Demo script + `npm run build` green + Q&A cheatsheet | `docs/demo-script.md`, `docs/pitch-cheatsheet.md` |

**Definition of Done:** `npm run build` exits 0 with TypeScript strict mode; every simulated connector is visibly badged SIMULATED; the 5-min demo runs from the seeded state without manual DB fiddling ("Reset demo" gives one-button reproducibility).
