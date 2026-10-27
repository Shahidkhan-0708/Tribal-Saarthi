# Frontend → backend parity

Two frontends share this repository and they have deliberately different persistence:

- `src/pages/**` + `src/store/data.ts` — the password-free demo. Every action writes to `localStorage` through `src/lib/db.ts`; nothing leaves the device.
- `src/pilot/**` — the authenticated pilot. Every action is authorized and recorded in Supabase through `src/pilot/api.ts`.

This page maps each demo store function to its pilot backend entry so a frontend change can be checked against the server without confusing the two modes.

## Store actions (`src/store/data.ts`)

| Frontend function | Pilot backend entry | Database effect |
|---|---|---|
| `submitApplication` | `save_draft` then `submit_application` → `pilot_command` | Creates/updates `pilot_applications`, freezes profile, rule and document snapshots, issues the receipt token |
| `uploadDocument` | `register_document` → `pilot-workflow` | Private Storage object + `pilot_documents` record (server derives MIME type, size and SHA-256) |
| `resubmitDocument` | `register_document` with `previousVersionId` | New immutable `pilot_documents` version; the old version is never mutated |
| `reviewDocument` | `review_document` → `pilot_command` | `pilot_documents` review decision restricted to the document type's officer role |
| `attachDocsToApplication` | `save_draft` (draft) / `correct_deficiency` (deficiency) | Replaces `documentIds` with ownership and one-per-type checks. Re-attaching outside a draft or an open deficiency is intentionally unsupported so a submitted evidence set cannot be swapped silently |
| `runVerification` | `run_verification` → `pilot-workflow` → `pilot_verify` | `pilot_verifications` attempt with adapter provenance; never auto-approves |
| `setSourceHealth` | `set_source_health` → `pilot_command` | `pilot_source_health` row; `pilot_verify` forces `source_down` while a connector is marked unavailable (admin-only) |
| `resolveManualReview` | `review_verification` → `pilot_review` | `pilot_verifications` human decision with reviewer and adapter evidence preserved |
| `completeInstituteVerification` | `approve_institute` → `pilot_command` | Rechecks deficiencies, document review and fresh `academic`/`institution` checks before `department_stage` |
| `completeDeptVerification` | `approve_department` → `pilot_command` | Rechecks all five sources and document review, then sets `departmentApproved` |
| `sanctionApplication` | `sanction` → `pilot-workflow` | Private signature object checked, amount taken from the immutable rule snapshot |
| `pushDbt` | `request_payment` then `payment_result` | `pilot_payments` simulated attempt; application becomes `disbursed` only on success |
| `raiseDeficiency` | `raise_deficiency` → `pilot_command` | `pilot_deficiencies` row, application `deficiency`, in-app notice |
| `correctDeficiency` | `correct_deficiency` → `pilot_command` | New unverified version linked to the deficiency and a fresh `pending` verification |
| `markRead` | `mark_notification_read` | `pilot_notifications.readAt` for the owning account only |
| `broadcast` | `broadcast` → `pilot_command` | Server rescopes recipients and returns the actual count |
| `pushNotification` | `pilot_private.notice` (server-internal) | No browser action: the server raises notices for workflow events |
| `createGrievance` | `create_grievance` → `pilot_command` | `pilot_grievances` with category SLA, assignment, events |
| `resolveGrievance` | `update_grievance` with `status: 'resolved'` and `resolutionReason` | Status, reason, timeline event and notification |
| `resetDemo` | None | Demo-only reset of `localStorage`; the pilot never exposes a server-wide reset |

## Engines and page helpers

| Frontend code | Pilot backend entry |
|---|---|
| `engines/eligibility.ts` | `pilot_private.evaluate` (shared by submission, final review and scheme dry-run) |
| `engines/verification.ts` | `pilot_verify` + `pilot_verifications`; human review is always required |
| `engines/coverage.ts` | `public.pilot_metrics` |
| `engines/ocr.ts` | Client simulation only. Pilot extracts fields through authorized `review_document` values, not browser OCR |
| `engines/saarthi.ts` | Client guidance over the authorized snapshot; no external AI call and no personal-data store |
| `demoSanctionAmount` | `ruleSnapshot.sanctionAmount`; the pilot never trusts a browser-supplied amount |
| `broadcastRecipients` | Server-side audience query; `pilot_broadcast_preview` gives the officer the same count first |
| `Wallet` DigiLocker pull / certificate scan | Demo simulation only; the pilot requires an uploaded private file and human review |
| `Account` demo family grants and `Apply` local drafts | `grant_family`/`revoke_family` and `save_draft` in the pilot; the demo copies are intentionally device-local |

## Keeping the two in step

`npm run test:db` executes every migration and then, for each member of `PilotAction` in `src/pilot/types.ts`, sends that action through `pilot_command` and fails if the database reports `unknown action`. A frontend action added without a server handler therefore breaks the test instead of failing at runtime.
