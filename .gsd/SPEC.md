# Tribe Saarthi working pilot

Status: FINALIZED

Approved by user: implement the six-phase plan from this conversation.

Preserve the existing React demo. Add explicit `VITE_APP_MODE=pilot` mode using Supabase Auth, PostgreSQL, private storage, authenticated commands and durable offline drafts. Invite-only email/password accounts; students complete profiles, upload PDF/JPEG/PNG (10 MB), draft/submit eligible applications with versioned attachments, correct specific deficiencies, and track human reviews and simulated payments. Officer access is scoped by institution/state; admin provisions invites and configuration. Family access is revocable, online-only, read-only summaries/history. In-app delivery is real; government/OCR/DBT/SMS/IVR remain simulated. Receipts use real SHA-256 and QR with minimal public verification. Preserve verification attempts, append-only audit, transactionally consistent writes, idempotent operations, optimistic versions and actionable errors. Offline operations: student drafts/files/grievances and officer notes only; final decisions/submission/payment require online. Analytics distinguish imported comparable aggregates from pilot counts. Deployable migrations, functions, frontend, tests, staging/pilot deployment and restore instructions are required; actual deployment needs credentials.

Architecture: RLS reads through Supabase; workflow Edge Function validates user and dispatches a single transactional SQL command. No direct client writes to workflow tables. Existing domain engines reused where compatible. No secret keys in frontend.

Acceptance: authenticated cross-device student/officer journey, isolated records, immutable document versions, relevant deficiency corrections, no stage skipping, sanction/payment separation, real acknowledged offline replay, consent revocation, real audience targeting, accurate metrics, tested build/typecheck/unit/security scenarios.
