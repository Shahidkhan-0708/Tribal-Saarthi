# Frontend connection audit — 18 October 2026

Scope: connect implemented product features in both builds. Demo actions use the local store; pilot actions use authenticated APIs/RLS and private Storage. Existing provider and operating acceptance gates are retained.

## Repaired connections

| Gap | Result |
|---|---|
| Whole records were serialized as version targets | Workflow/account/privacy/bulk requests and durable queue entries now carry only target ID/version; application/profile copies are not repeated in targets. |
| Internal notes were readable through the student Data API | A new scoped officer-only RLS policy protects both direct reads and batched snapshots. Student/family/anonymous/unrelated reads are denied; no notes were deleted. |
| Officer notes omitted the application target/version | The form passes `{body}` and the current application target through the same online/offline command. Online acknowledgement selects the saved note so it is visible even beyond the first 50 notes. |
| Institution deactivation command was unreachable | Configuration has a reasoned, versioned Deactivate action. Saving metadata preserves inactive status; reactivation requires its explicit checkbox. |
| Institution configuration history was stored but invisible | Each institution exposes its loaded history; the record browser can load older history pages or a specific history reference. |
| Stored sanction signature had no reader | Application history opens actual authenticated PNG bytes from the private signature bucket in the existing accessible preview dialog. Family summaries expose no private signature control/path. |
| Account access changes left privacy review versions stale | Account saves/resends refresh the shared snapshot before subsequent privacy actions. |
| Paged supporting records had no visible list/context | Record browser renders the selected page, uses readable labels, and opens the parent application for notes/checks/corrections/payments, even outside the current application page. Student profiles, imported baselines/provenance and configuration history have read views. Context rows are excluded from page results. |
| Family search was offered although its endpoint supports paging only | Family view exposes summary paging and omits unsupported search/catalogue controls. |
| Demo officer grievance resolution had no route | All officer navigation menus link to the queue; officers see all local tickets and can persist resolution. Students retain their own create/status view. Student sessions cannot enter officer routes. |

## Pilot feature-to-interface map

| Implemented feature/actions | Frontend entry | Backend boundary |
|---|---|---|
| Sign-in, recovery, sign-out, invited password setup | Login / Account | Supabase Auth; account active/role checks |
| `save_profile` | Profile | Versioned owner-only command |
| Published scheme discovery, advisory eligibility, `save_draft`, `submit_application` | Schemes / Applications | Server eligibility, document ownership and submission checks |
| `register_document`, immutable corrections, `review_document`, private byte preview | Documents / Applications | Private Storage and checked-object workflow |
| `run_verification`, `review_verification` | Applications | Server-selected adapter mode; authorized human review |
| `raise_deficiency`, `correct_deficiency`, `reject_application` | Applications | Stage, scope and version checks |
| `approve_institute`, `approve_department`, `sanction`, signature preview | Applications | Server document/source/approval gates; private signature bucket |
| `bulk_sanction` | Applications → Bulk pilot sanction | Per-record server validation/results |
| `request_payment`, `payment_result` | Applications | Explicit simulated payment state machine |
| Receipt QR/public verification, `revoke_receipt`, `expire_receipt` | Applications / Receipt policy controls | Minimal public receipt endpoint; audited controls |
| `withdraw_application`, `renew_application`, `appeal_application`, `resolve_appeal` | Applications | Versioned lifecycle checks |
| `add_note` | Applications / Record browser | Versioned officer command, officer-only RLS; durable queue when offline |
| `create_grievance`, evidence, `update_grievance`, complete history | Grievances | Scoped evidence, timeline, owner/SLA/escalation/appeal validation |
| `save_grievance_category` | Configuration | Administrator-only category/SLA command |
| `broadcast`, audience preview, `mark_notification_read` | Notifications | Full scoped server recipient count and persisted notices |
| Due email processing / delivery attempt history | Notifications | Administrator processor endpoint; unconfigured provider remains blocked |
| `grant_family`, `revoke_family` | Family access / Account consent | Immediate consent checks; minimal online family summary |
| Queue, replay, failure display, discard, reviewed draft conflict retry | Offline queue | IndexedDB durability; server remains authoritative |
| Scoped charts, funnel/coverage CSV, baseline comparability | Analytics / Record browser | Complete scoped metrics RPC |
| Scoped audit filters/pages/details and CSV/JSON | Audit | RLS query; bounded pages, complete filtered export |
| Invitation, pending/resend, role/scope/active account management | Configuration → Account lifecycle / Invite | Dedicated account/invite endpoints; mail gate remains open |
| Erasure request, retention/erasure/access reviews, consent/history/revoke, processing export | Account | Account endpoint and privacy RPC; no automatic deletion |
| `draft_scheme`, `dry_run_scheme`, `publish_scheme`, `rollback_scheme`, history | Configuration → Scheme controls | Administrator-only versioned configuration |
| `save_institution`, `deactivate_institution`, reactivation/history | Configuration → Institutions | Administrator-only versioned configuration |
| `import_baselines`, baseline read/provenance | Configuration / Record browser / Analytics | Validated CSV import; comparability checked separately |
| Bounded/searchable pages, referenced application context, catalogue refresh | Record browser | Batched RLS snapshot; 50 rows per page |
| Install prompt/guidance, offline reload, camera file input | Installation guidance / Documents | Pilot-only PWA assets and native browser capabilities |
| Read-only scholarship assistant | Assistant | Existing deterministic answer engine; no unconnected action buttons |

`save_scheme` and `record_invite_resend` are internal operations behind published-scheme/account endpoints, deliberately not direct browser commands. Backup/restore, health probes, provider secrets, uncertain email reconciliation and scheduled operations remain operator tools. They must not expose privileged credentials through the frontend.

## Demo map

Student dashboard/discovery, document upload/review/correction/reuse, application verification/deficiency/stage checks, signed pilot acknowledgement, simulated DBT/history, read notifications, grievance creation/status, local receipt, deterministic assistant, persona/language/theme/reset and guided tour have UI callers. Officer review, source-health controls, manual review, approvals, deficiency/rejection, signature/payment, coverage, broadcasts, audit/export and grievance resolution have routes/controls. `pushNotification` is a store helper; product notices are created by workflows and the existing broadcast UI.

## Remaining external/acceptance gates

Government/issuer transports, real PFMS payments, certified e-Sign, OCR/model services and SMS/IVR are not implemented integrations. Brevo credentials/delivery are deferred. Their frontend labels retain the actual simulated/unconfigured state; this audit does not turn them into connected services. Physical-device camera/install, assistive-technology acceptance, protected scheduled backups/alert delivery and E4 latency acceptance remain open in the completion plan.

## Verification

Evidence is recorded in `artifacts/frontend-connections/browser.json`, its screenshots, `.gsd/JOURNAL.md`, and the final Phase 13 task entries. Hosted browser tests use synthetic staging records and actual Auth/REST/Storage. Existing SQL/Edge and demo/offline regressions remain part of the release check.

Upgrade note: existing unsynced operations are retained. A pre-upgrade operation whose acknowledgement was lost can require explicit conflict review because the target representation is now minimal; no queue entry is silently discarded.

Current evidence: 98 unit/UI tests in 19 files; 123 PostgreSQL workflow/security assertions plus the deficiency suite; 58 Edge/provider assertions; application and Vite-config type checks; demo/pilot builds; demo grievance and pilot offline/conflict browser regressions; seven focused hosted frontend groups and 16 hosted note-access assertions. Screenshots for institution history, private signature dialog, baseline records, family paging and 320px layout were inspected.

This audit combines current caller/contract inspection, previous Track A/B/C/D/E acceptance evidence and targeted regressions. It is not a new exhaustive test of every form/role combination or a production-capacity/certification claim. The latest focused results are `browser.json` and `note-access.json` under `artifacts/frontend-connections/`.

Frontend deployment: `dpl_3Gz8TBi3QidPFc8EtQanhTCenCKU`, READY at https://tribe-saarthi-staging.vercel.app. Migration `20261018124722_pilot_internal_notes_read_scope.sql` was tested locally and applied to the same dedicated staging project after a fresh 51-table logical snapshot at `.staging/backups/frontend-connections-before`. No Storage objects changed and no earlier backup evidence was replaced.


## Phase14 follow-up

Administrator Configuration now includes server operation status, encrypted backup counts/recovery references and failure/recovery notices. Scheduled jobs and private-key/provider setup remain privileged operator tools; no credentials are exposed in the frontend. Final frontend dpl_6a3x2ZofzEiyHNgsbJNcNRa4sdfC; current evidence and remaining owner-only gates: operations-automation.md and owner-actions.md.
