# Tribe Saarthi — five-minute local demo

Run `npm run dev`, reset the demo, and launch Asha Kiran Ekka. Use one window and the persona selector so local state stays in sync. All students are synthetic; government sources and payments are simulated. The tour highlights five surfaces and switches personas automatically.

## 0:00–0:30 — Student profile

Show Asha's seeded profile. Explain that this prototype demonstrates one view of four scholarship schemes. The APAAR/ABC-style card is a synthetic preview, not a verified credential.

## 0:30–1:15 — Explainable discovery

Open Scholarship Discovery. Expand the rule audit for Top-Class and compare NOS. Explain that rules run locally on demo profile/sample evidence. They do not make an official eligibility decision or submit to a government portal.

## 1:15–2:00 — Real local document reuse

Open Document Wallet. Counters come from persisted application-document links. In Application & Tracker, change a required document selection and save attachments; repeat to show the same application/document pair is not counted twice. Removing/replacing a selection recalculates usage. Uploads and the sample OCR preview generate text; no camera, file extraction or QR decoding occurs.

For a correction demonstration, an officer can flag the actual document type, give a reason and choose a future deadline. The student uploads a new sample in the wallet and selects that correction in Application & Tracker. It goes back for review, not straight to approval.

## 2:00–3:00 — Source failure and recovery

Switch to Sh. A.K. Verma. Click Kill Income API, then Re-run verification on Asha's application. Show Pending Verification and the source-down log. Approval is blocked; no auto-pass/rejection occurs. Restore All Sources and rerun. The application returns to the department stage.

## 3:00–3:45 — Sanction and payment are separate

Complete department verification. Click Sign demo sanction, draw or choose Typed acknowledgement, and save. Show the stored officer acknowledgement, time and sanctioned amount. Reload to demonstrate persistence. It is not certified e-Sign.

Click Simulate PFMS disbursement as a separate action. No money moves. The audit records the distinct local actions; browser storage is editable, so this is not an immutable or cryptographically sealed ledger. The printable acknowledgement is a demo summary without a fake hash or QR verifier.

## 3:45–4:15 — English/Hindi Saarthi

Switch to Asha and open Saarthi. Ask about status or payment, then choose Hindi and use a suggested Hindi prompt. Answers use the selected student's current demo state. This is a template assistant with browser voice preview, not an LLM. Santali answers are not implemented; the separate UI language selector covers navigation labels only.

## 4:15–5:00 — Coverage and honest close

Switch to the officer coverage page. Show the lowest-coverage district marked worst and the highest marked best. Inputs are pattern-fit demo baselines, not an official district-wide dataset or live UDISE+ feed.

If showing broadcasts, choose an audience and point to the exact loaded-student count. Sending creates only that many in-app notices; SMS/IVR are not connected.

Close by stating the next gate: Track B must prove hosted Auth, RLS, Storage, restore and operations before inviting real pilot users. The demo makes no offline-replay, live integration, certified signature or external-message delivery promise.
