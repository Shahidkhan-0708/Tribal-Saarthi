# Pilot data protection operations

Notice version: 2026-10-18. These are implemented pilot controls and operating steps, not a claim of legal compliance or an approved retention policy.

Students can inspect/revoke purpose-specific document-fetch and family-summary consent in Account. Every change appends a separate, owner-scoped event. Existing family grants are migrated with a legacy notice marker; migration does not manufacture fresh consent. Revoking family consent immediately removes summary access. DigiLocker remains unconnected; optional consent alone cannot fetch or verify documents.

Store masked Aadhaar last four only. Do not upload full identity numbers, OTPs, banking credentials or unredacted identity evidence. Adapter audit metadata contains source, explicit mode, timestamp, opaque operation/provider references and an allowlisted status. Raw provider payloads are discarded. Human decisions remain mandatory.

## Retention and erasure

The operator records reviewed periods for documents, applications, accounts, consent, audit and local offline records, a policy basis/hold review and a review date within one year. There are deliberately no invented legal retention defaults. The approved organizational policy must determine these values. The UI records operator review, not legal approval. No scheduled deletion runs.

1. A signed-in user requests erasure with a reason in Account. The request and review state are visible to that user and administrators.
2. In Account, an administrator locates the account using Browse and search server records, selects `accounts`, and records `under_review`, `retained`, or `ready_for_erasure`, with a reason and next review date. Ready status requires a current retention review.
3. Review application/appeal obligations, consent, legal holds, audit, delivery records and all processor copies. A ready status is an authorization-preparation record; it does not execute deletion. Export the processing record before execution.
4. Before executing erasure, rehearse an account-specific plan in the restore project. Capture exact row/object identifiers and dependencies. Remove or irreversibly anonymize only the approved data, revoke Auth sessions and family grants, remove private objects and processor copies, and verify other accounts are unaffected. Preserve only explicitly justified records. Record completion evidence and notify the requester through the approved channel.
5. Maintain a private deletion ledger for retained backups so restored data cannot silently reintroduce erased information. Backup expiration and Brevo processor deletion need separate operator action. Never erase shared audit or backups to satisfy one request without a reviewed plan.

Steps 3–5 require organizational policy and an approved execution plan. Automatic erasure and a real erasure rehearsal are not implemented or claimed. Review overdue requests using processing-record counts. Local IndexedDB is removed on sign-out; queued work is never silently deleted by a timer. Include device cleanup instructions in a fulfilled request.

## Processing record and admin access

An administrator can prepare/export `pilot-processing-record.json` in Account. The live record describes purposes, data categories, processors, retention review, consent/request counts and outstanding admin reviews. It excludes student names, emails, identity values and document payloads. Add the organization's controller/contact, contracts, hosting/transfer assessment and policy approvals before real enrollment.

Review administrator access monthly and after personnel changes. Record business need, active role/scope and `retain` or `change_required` in Account. Self reviews are explicitly marked; a second administrator should review privileged access before production. Apply required access changes in Configuration → Account lifecycle; recording a review alone never changes authorization.

## Incident response

The pilot owner must assign a named incident lead and a tested private contact route before real participants enroll. Do not invent an on-call service or notification deadline.

1. Record detection time, affected service and a private incident ID. Restrict access to the incident log. Preserve request IDs and sanitized audit records; do not copy tokens or identity evidence into chat/issues.
2. Contain: deactivate affected accounts, revoke sessions, suspend optional provider delivery or restrict the affected endpoint. Rotate compromised credentials using the provider's secure console. Preserve evidence and avoid deleting logs.
3. Establish affected records, users, processors and time range. Confirm authorization boundaries with the staging cross-account suite. Involve the assigned privacy/legal decision maker to assess reporting and user-notification obligations and timing.
4. Restore from a verified clean backup only after reconciling the deletion ledger; verify RLS, private file access, Auth and workflow gates. Record corrective action and the evidence supporting reopening.
5. Document communications through approved channels, closure, root cause and follow-up access/policy reviews. Rehearse this runbook with the incident lead; actual alert delivery and a hosted failure drill remain Track B gates.


## Backup operating controls update

Staging database/Auth/private bytes are backed up daily using AES-256-GCM and verified SHA-256 manifests; an owner-session Windows task maintains an independent encrypted copy outside Supabase. Recovery keys are restricted locally and excluded from database snapshots; no automatic deletion or key rotation runs. Cloud/local recovery and actual failure/recovery notices pass. This adds no new external data processor. Keep the independent runner available, preserve recovery keys and approve participant retention/scanning/on-call arrangements before enrollment. See operations-automation.md and owner-actions.md.
