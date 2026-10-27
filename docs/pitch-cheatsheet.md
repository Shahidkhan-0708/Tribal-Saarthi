# Evaluator Cheatsheet — PS 26238 (Memorize Before Pitching)

## The landscape (know it cold)

| System | What it is | Our relationship to it |
|---|---|---|
| **NSP** (scholarships.gov.in) | Main portal, OTR, PFMS-tracked DBT for 100+ schemes | One of the 3 fragmented systems we orchestrate — NOT broken, just siloed |
| **SFMP** (Canara Bank) | Fellowship/disbursement portal (incl. NFST) | Second fragmented system |
| **NOS portal** | Standalone National Overseas Scholarship portal | Third fragmented system |
| **JAGO** (MoTA) | Live AI assistant for welfare-scheme info, expanding to tribal languages | We integrate/extend — we do NOT rebuild scheme FAQs |
| **myScheme** | Discovery + eligibility matching, 2500+ schemes, no application processing | Indirect — we go deeper into application/verification/DBT |
| **Buddy4Study** | Private discovery platform | Discovery only — no government verification layer |
| **Odisha / Karnataka unified portals** | State precedents of unify + auto-verify | Proof the architecture works at scale; ours is MoTA/ST-specific with gap analytics |
| **~13 SIH teams** | Building similar features for this exact PS | Our edge: honest verification-failure handling, real (cited) gap data, offline-first |

## Our one-line differentiation

> "Others are building the unified app. We built the **orchestration layer with honest failure handling** — a source going down parks an application instead of silently passing it, and our coverage-gap math is grounded in citable public data."

## The hardest questions — ready answers

1. **"NSP/SFMP/NOS exist. Why you?"** → "We don't replace them; we unify them with one verified student view, reusable documents, a cross-system lifecycle and coverage analytics none of them provide alone."
2. **"Odisha/Karnataka already did this."** → "At state level, yes — strong precedent that the architecture works. Our target is the MoTA/ST-specific ecosystem plus beneficiary-gap analytics, which those portals don't include."
3. **"Other SIH teams are building the same thing."** → "Three things we do that most don't: (a) route verification exceptions to named humans instead of silently passing/rejecting, (b) ground gap analytics in cited public data, (c) offline-first design."
4. **"Is DigiLocker real?"** → "Clearly labeled simulated; real integration needs a bilateral data-sharing MoU. Adapter pattern ready."
5. **"Where does the gap number come from?"** → "Census 2011 + UDISE+ 2021-22 public aggregates, cited on screen; individual demo records are synthetic."
6. **"What if a source is down?"** → "State machine distinguishes verified / mismatch / source-down. Source-down ⇒ PENDING + routed to review. Never silent pass, never silent reject."
7. **"Is the AI real?"** → "Eligibility is a deterministic rules engine — deliberately so, and we call it that. OCR field extraction + cross-checking and coverage analytics are the data-intelligent parts, both explainable."
8. **"Poor connectivity?"** → "Offline-first: cached state, sync queue that flushes on reconnect, SMS-channel notifications, 6 languages including Santali/Ho, voice input."
9. **"Real applicant data?"** → "No. All person records are synthetic and labeled. Method and rules are what's real."
10. **"Scale to millions?"** → "The engines are pure functions over indexed relational data; verification is batch-queueable per source; same state machine at any volume. Next step would be Postgres + job queues."
11. **"Cost to MoTA to deploy?"** → "Honest split: infra modest; the real cost is integration MoUs (DigiLocker/UIDAI/UDISE+/APAAR) and a security audit. That's exactly what the adapter layer isolates."
12. **"How do you secure caste/income/disability data?"** → "Role-based access per portal, append-only audit log of every access/action, data minimization (Aadhaar last-4 only in the UI), controlled document access, retention policy hooks."
13. **"Accuracy measured?"** → "For the rules engine: determinism, so accuracy is auditable rule-by-rule. For OCR cross-check: discrepancy precision demonstrated on seeded docs; would need labeled data to report real metrics — we're honest that it's not yet measured."
14. **"What if you wrongly say a student is ineligible?"** → "Explainable evidence trail for every rule + manual review/appeal path; the engine never has final say on disputed cases."
15. **"Why not just extend NSP itself?"** → "NSP is run by the Dept. of Higher Education and serves many categories; a MoTA-specific layer can integrate ST-ecosystem sources (state ST registries, tribal-language support) and run cross-scheme analytics without touching a national shared system — the same argument for connecting, not rebuilding."

## Known demo risks

- Browser Speech Recognition needs Chrome (fallback message exists).
- If the demo resets mid-pitch, use "Reset demo" and reload — seeded state restores exactly.
- Never claim "live integration" verbally; the UI already says SIMULATED everywhere.

## 16-module coverage map (how our 5 deep features cover all 16 asks)

| PS module | Where it lives |
|---|---|
| 1 Login & Profile | Login personas + student profile |
| 2 Unified Dashboard | Student Dashboard |
| 3 Discovery | Discovery + eligibility engine |
| 4 Document Wallet | Wallet (DigiLocker simulated) |
| 5 Unified Application | Discovery → pre-filled apply |
| 6 Unified Verification | Verification engine + connectors |
| 7 Verification Tracker | Application tracker + stepper |
| 8 Deficiency Management | Deficiency card + resubmit loop |
| 9 Payment & DBT | PFMS-simulated payment panel + history |
| 10 Notifications | Notification engine (in-app + SMS channels) |
| 11 JAGO Integration | Saarthi (contextual layer over JAGO's role) |
| 12 History | Scholarship History table |
| 13 Family View | Parent persona + consent flags |
| 14 Unreached Beneficiary | Coverage Gap analytics |
| 15 Help & Grievance | Grievance module with reference IDs |
| 16 Accessibility | Language selector, voice, offline mode, simple language |
