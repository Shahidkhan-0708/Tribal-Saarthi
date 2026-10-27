# What still needs the owner

The unblocked implementation, frontend connections, staging deployment, encrypted backup automation, local encrypted copy, job monitoring/failure recovery and current regression tests are complete. Credentials are **not the only remaining acceptance step**. The items below need an account holder, an authorized decision, an approved external API or a physical device; they cannot honestly be checked off by simulated tests.

## 1. Enter Brevo credentials locally

| File | Values to enter | Apply |
|---|---|---|
| `.staging/smtp.json` | Brevo SMTP login in `user`, SMTP key in `password`; confirm the verified sender | `powershell -NoProfile -File scripts/configure-staging-smtp.ps1` |
| `.staging/email-provider.env` | Separate `BREVO_API_KEY`; confirm `PILOT_EMAIL_SENDER` | `npm run setup:email-provider` |

Do not use the Brevo account password as the SMTP key. The SMTP and API keys serve different integrations. Keep all keys out of chat, screenshots, `VITE_*` variables and committed files. The API apply command rejects missing credentials, duplicate/unexpected fields and the wrong deployment target. Existing Supabase/Vercel login is reused; automatic operation keys are already generated and need no typing.

Verify the Brevo account/sender yourself, then accept real controlled student/officer invitation links and check recovery plus a critical-event email. Entering a key or seeing a provider acknowledgement does not prove inbox delivery or invitation acceptance. The five-minute email worker is already enabled and will pick up due work after configuration. Missing configuration does not exhaust its retry allowance. Detailed steps: `brevo-staging.md`.

This closes the credential-dependent portions of B1/B5/C5 only after actual delivered/accepted journeys pass.

## 2. Obtain approved government access

Provide approved DigiLocker sandbox application access, the applicable API contract/issuer details, redirect requirements and credentials through a private configuration channel. Authorized OAuth, issuer fetch/signature/status and revocation still need implementation/verification against that approved contract. A key alone does **not** turn the existing simulated adapter into a live government connection.

Later Aadhaar/state-certificate/income/AISHE/NSP/PFMS/APAAR integrations require their own organizational approvals and contracts. They follow DigiLocker acceptance, as specified by Track D. Real payments and certified e-Sign require authorized providers. Those systems remain explicitly simulated/unconnected; no production transaction is enabled by this work.

## 3. Perform checks that require your devices

- On a real Android/iPhone: install/open the PWA, sign in, capture a test document with the camera, submit, view status and receive the in-app notice. Browser emulation does not prove the OS camera/install journey.
- Run the critical journey with an actual screen reader/mobile assistive technology. Existing keyboard, semantics, focus, contrast, 320px and zoom checks pass; full accessibility certification is not claimed.

Record the device/OS, result and any issue. These are the E1 and remaining assistive-technology acceptance steps.

## 4. Make participant-release decisions

- Approve a private malware scanner deployment, or explicitly document a limited synthetic/participant risk scope, safeguards and expiry. No scanning or risk acceptance is fabricated. Do not enroll real participants before this is decided.
- Approve retention/legal holds and actual erasure handling, designate incident/on-call and backup ownership, and decide leaked-password protection/other production security controls. Existing privacy UI records reviews; it does not make legal decisions for you.
- Confirm expected pilot population/concurrency and service budgets. The latest ten-client staging run passes every provisional target; larger production capacity has not been promised.
- Keep the registered backup-copy computer signed in/online, or approve an always-on protected runner and independent outage-alert destination. Store recovery keys safely outside the source project. Hosted daily backups run independently, but the local off-provider copy catches up only when this computer is available.

These are acceptance/operating responsibilities. The underlying implementation and preparation that can be completed without those inputs are recorded in `operations-automation.md`; B4/E4 parent acceptance remains open only where these decisions are required. No paid plan, provider contract or new third-party disclosure was accepted on the owner's behalf.
