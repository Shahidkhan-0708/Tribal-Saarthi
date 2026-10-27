# Brevo for staging invitation emails

The dedicated Supabase backend is `axegexiaofxdmmizilri`. A private `.staging/smtp.json` has been prepared on the owner's computer. Its host is `smtp-relay.brevo.com`, port is `587`, and sender email is the owner-provided address. No SMTP key is configured yet.

The owner explicitly deferred supplying credentials. Setup script parsing, the missing-credential guard and read-only provider configuration preview pass. Only declared SMTP fields are eligible for application; existing signup/redirect settings are preserved. No Brevo account, sender verification or delivery has been claimed as complete.

1. Sign in or create the owner's account at [Brevo](https://app.brevo.com). Complete email/account verification and any required account details yourself. No connected browser is available to this agent; it cannot complete that account flow here.
2. In Brevo, verify the sender under **Senders, Domains & Dedicated IPs**. A Gmail address cannot supply DNS authentication for `gmail.com`; follow Brevo's verified-sender instructions and use an authenticated owned domain for a wider pilot.
3. Open **SMTP & API → SMTP**. Copy the **SMTP login** and generate an **SMTP key**. The account password and API key are not the SMTP password. Follow [Brevo's SMTP instructions](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP).
4. Enter the SMTP login into `user` and SMTP key into `password` in `.staging/smtp.json` locally. Keep the JSON valid. Do not paste credentials into chat or screenshots.
5. Run `powershell -NoProfile -File scripts/configure-staging-smtp.ps1` from the project directory. It checks the actual provider project name/ref/organization, then applies only the SMTP section through the CLI. Private logs/configuration stay in `.staging/`; the deployment excludes that directory.
6. In the hosted admin portal send controlled student/officer invitations, accept the delivered links, and save redacted delivery/acceptance evidence. Until this passes, email delivery and B1/B5 remain open.

Brevo may require account activation before transactional sending. A successful settings update alone is not proof of delivery. [Supabase SMTP guidance](https://supabase.com/docs/guides/auth/auth-smtp) describes its custom SMTP configuration and default-service limitations.

Track C also prepares transactional critical-event emails. That adapter needs a separate server-only `BREVO_API_KEY` and verified `PILOT_EMAIL_SENDER`; SMTP credentials do not authorize Brevo's HTTP API. Keep those secrets in Supabase's secrets interface or an ignored local env file. The five-minute processor is enabled; the queue remains unconfigured and no real delivery is claimed. Enter the separate API key and sender in private `.staging/email-provider.env`, then run `npm run setup:email-provider`. Its missing-credential guard is verified; SMTP settings still use the separate script above. See [Track C operations](track-c-operations.md) for attempts, retries and reconciliation.
