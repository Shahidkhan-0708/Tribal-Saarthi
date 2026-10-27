# Government adapter boundary

`src/integrations/adapters.ts` defines the shared request/result contract. Modes are `simulated`, `sandbox`, and `live`; absence is explicitly `unconfigured`. Pilot UI requires `VITE_PILOT_ADAPTER_MODE`, and the Edge function independently requires `PILOT_ADAPTER_MODE`. A browser cannot choose the server mode. Staging uses explicitly configured simulation. The demo is independent of provider credentials.

Each result carries source, timestamp, opaque request/provider reference, mode and sanitized raw status. Timeouts include response-body reads; body size is limited to 16 KB. HTTP 4xx/malformed replies require review; throttles, 5xx and transport/timeout failures become source-down. No failure becomes a pass. Even an injected matching provider response retains the pilot's human review gate. The SQL writer allowlists metadata and reuses the existing idempotency ledger.

There is no live government transport in this release. `live` or `sandbox` without an approved transport returns unavailable, never simulated success. The injectable transport is a tested contract boundary, not a DigiLocker connection.

## Next integration: DigiLocker

Obtain approved requester onboarding and the current contract from [DigiLocker API Setu](https://apisetu.gov.in/digilocker). Validate the authorized partner's OAuth/consent contract, redirect allowlist, token handling, issuer signature/status validation and revocation semantics. Do not guess endpoint paths or collect account passwords/OTP in chat.

The consent registry records the optional scholarship document-fetch purpose. An actual provider implementation must check active consent at authorization and fetch time, bind OAuth state/PKCE to the signed-in student, keep tokens on the server, and stop subsequent access when consent is revoked. Consent recorded now does not assert a completed OAuth journey.

Acceptance remains open until approved sandbox credentials support a staging consent → fetch → issuer validation → decision journey, plus mismatch, timeout, 4xx/5xx, malformed payload and revocation proofs. On source outage, keep the application pending, inspect sanitized references, use authorized manual review and retry only idempotent fetches. Do not start Aadhaar or subsequent integrations until this proof and its provider-specific failure runbook pass.
