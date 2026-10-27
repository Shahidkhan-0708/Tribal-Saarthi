# अ Adimool — Unified Scholarship Platform for Tribal Students

**SIH 2026 · PS 26238** · Ministry of Tribal Affairs
*"One verified layer over NSP · SFMP · NOS — with explainable eligibility, reusable documents, honest verification failure handling, and coverage-gap analytics grounded in public data."*

## Working pilot

The existing demo is preserved. The persistent pilot uses invite-only Supabase Auth, scoped PostgreSQL workflows, private files, human verification, simulated payment attempts, family consent and real offline draft replay.

`npm run dev` starts the persistent Supabase app on http://localhost:5173. Configure the public Supabase URL/key in `.env.pilot.local` (already configured on this computer). Build with `npm run build:pilot`. Without credentials, pilot mode shows setup instructions and never falls back to demo accounts. Use `npm run dev:demo` for the password-free local demo on port 5174.

For your own local database, start Docker Desktop and run `npm run backend:setup`, then `npm run backend:serve` and `npm run dev:local` in separate terminals. Setup applies the existing database logic for every feature, seeds configuration, and creates a local administrator without resetting data. Full function-to-table map and login details: [backend setup](supabase/README.md).

See [pilot operations](docs/pilot-operations.md) and [backend setup](supabase/README.md) for migrations, first-admin provisioning, Edge Functions, staging gates, reminders, deployment and backup/restore.

Validation: `npm test`, `npm run test:db`, `npm run test:edge`, `npm run build`, `npm run build:pilot`, `npm run test:browser`, and `npm run test:demo-browser`. Browser checks use synthetic API fixtures with a real browser/IndexedDB/service worker; database tests execute real PostgreSQL against Auth/Storage schema fixtures. Hosted integration is a separate staging gate. Use Node.js 20.19 or newer.

## Quick start

```bash
npm install
npm run dev      # Persistent app → http://localhost:5173
npm run dev:demo # Password-free demo → http://localhost:5174
npm run build    # typecheck + production build
npm run typecheck
```

On `npm run dev:demo`, pick a demo login (all synthetic):

- **Asha Kiran Ekka** (ST, B.Tech) — flagship flow: doc reuse + live pipeline + DBT done
- **Mohan Ram Rojat** (PVTG Baiga) — certificate OCR mismatch → manual review → deficiency flow
- **Sunita Murmu** (Santal, Class 11) — first application, income cert pending verification
- **Dr. R. Nagesh** (institution officer) — institute verification queue
- **Sh. A.K. Verma** (state nodal) — reviews + sanction/DBT + "kill a source" switchboard
- **Smt. J. Barla** (admin) — everything + coverage-gap analytics + audit log

## What's real vs simulated

| REAL (working logic) | SIMULATED (clearly badged) |
|---|---|
| Explainable eligibility rules engine & per-rule audit trail | DigiLocker fetch adapter |
| Multi-level verification state machine (mismatch→review, source-down→pending) | Aadhaar e-KYC, state ST cert DB, e-District income, AISHE, PFMS/DBT |
| Document wallet with persisted attachment links, derived reuse counts and sample OCR cross-check | OCR extraction (seeded text pipeline) |
| Deficiency → resubmit → re-verify loop | NSP/SFMP/NOS connectors |
| Gated officer review, stored demo acknowledgement, separate simulated payment | |
| Audit log, RBAC, notifications, grievances | |
| Coverage-gap calculations over explicitly pattern-fit demo baselines | individual student-record values (synthetic) |
| Pilot-only durable offline queue (separate build) | No offline-sync claim in the demo |

## Architecture (30 seconds)

```
React 18 + Vite + TS + Tailwind ── React Router (role-gated portals)
        │
   Zustand stores ──── engines/ (pure, testable TS)
        │                 ├── eligibility.ts   rules engine + evidence trail
        │                 ├── verification.ts  5-source pipeline + exception routing
        │                 ├── ocr.ts           extract → cross-check → flag (never reject)
        │                 ├── coverage.ts      enrolled − availing = unreached
        │                 └── saarthi.ts       template NLG over live app state
        │
   Demo: lib/db.ts (localStorage)
   Persistent app: pilot/api.ts → Supabase Auth + PostgreSQL/RLS + Edge Functions + private Storage
```

Deep-dive docs:

- [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md) — full prototype blueprint
- [`docs/demo-script.md`](./docs/demo-script.md) — the exact 5-minute pitch script
- [`docs/pitch-cheatsheet.md`](./docs/pitch-cheatsheet.md) — landscape + 15 evaluator questions

Track A evidence and limitations: [verification record](docs/track-a-verification.md). The demo receipt is a printable local summary; it has no cryptographic seal, public QR verifier or certified e-Sign.


Current staging operations, encrypted recovery and verification are documented in [operations automation](docs/operations-automation.md). Remaining credential/access/device/approval steps are listed in [owner actions](docs/owner-actions.md); real government integrations and participant release are not represented as complete.

To run the frontend against the existing hosted staging backend on this computer:

```powershell
npm run dev
```

Open http://localhost:5173. The ignored `.env.pilot.local` contains the staging URL and public frontend key; backend credentials stay out of frontend settings. The hosted backend, daily encrypted backup and scheduled monitoring run independently of Vite. Localhost is an explicitly allowed Edge Function origin. For a disposable local database instead, follow [pilot operations](docs/pilot-operations.md).

For the password-free demonstration alongside it:

```powershell
npm run dev:demo
```

Open http://localhost:5174. A fresh demo opens as Asha Kiran Ekka; use **Demo persona** to switch to Dr. R. Nagesh (institution), Sh. A.K. Verma (nodal), or Smt. J. Barla (admin). After signing out, the demo login screen offers one-click launch buttons. The authenticated pilot on port 5173 uses the locally saved synthetic account email/password pairs in ignored `.staging/actors.json`; the owner's administrator access is in `.staging/admin-access.json`. These credentials are separate from the one-click demonstration.

Offline service-worker installation runs in production pilot builds, not Vite development. A browser that blocks production installation receives an explanation that online sign-in remains available.
