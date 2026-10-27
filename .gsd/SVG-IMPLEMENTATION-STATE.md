# Active task: implement the SVG designs in BOTH demo and pilot

User: “code the exact design present in svgs .make sure coded perfectly”. Clarified
via async input: **Both demo and pilot**. Continue implementation to completion;
do not stop at a plan or partial styling. Use real semantic React controls, keep
existing store/API actions, validation, role scopes and privacy. Do not embed SVG
screens as the application. Read the SVG files as source of visual measurements.

## Environment and limits

Workspace: `C:/Users/HP/OneDrive/Documents/webd/task/Tribe Saarthi`.
No git repo and no AGENTS.md found. Node shim is broken; run
`C:/Users/HP/AppData/Local/Author Software/nvm/installs/v24.21.0/node.exe` explicitly.
Disk now has ~5GB free (earlier full-disk blocker resolved externally).
Vite/esbuild can't access ancestor directories in sandbox: escalate local browser
and build commands when that failure occurs. TypeScript works sandboxed.
Ponytail full active. Do not spawn agents (only Antigravity invoke_subagent skill
available as a document; callable invoke_subagent is unavailable).

## Existing SVGs / prior task

22 authoritative categorized SVGs in `docs/ui-mockups/01-scholar-portal/`,
`02-officer-portal/`, `03-system-auth/`. Copies in `public/mockups/`, `v2/`,
`design-plans/`. Previous completed turn improved SVG designs and generated 76
copies, galleries and two ZIPs. A later attempted second SVG pass was blocked by
disk full; it never changed screen sources, only appended a plan to
`design-plans/svg-design-direction.md`. Do not redesign the SVGs now.

Measured desktop SVG shell: banner 32px, full-width header 72px (top y32),
sidebar x0 y104 width240, main x268 y126 width1144 at1440viewport.
Fonts Trebuchet MS / Nirmala UI / Arial. Colors #075A46, #152E35, #52666D,
#EEF3F3, #CFDADD, #E8F2EE, #8A4F13. No page gradients or general shadows.
Mobile SVG375x812: header76, main padding16 top20, bottom nav70, dashboard
hero260, document summary112, assistant128.

## Changes already made this active task

- Added `src/components/casefile/Casefile.tsx`: GovernmentBanner, Brand,
  AuthLayout, applicationPresentation, Journey, ScholarOverview and view types.
  Native React markup, no whole-screen SVG embedding. applicationPresentation
  handles real app states instead of claiming all applications are in review.
- Added `src/casefile.css`: exact shell/dashboard/auth responsive measurements,
  pilot overrides, focus indicators, reduced-motion support.
- Replaced `src/components/layout/index.tsx` with matching shell. Desktop nav
 240px, header72, search submits querystring, live persona switcher inside user
 pill, language selector, notification navigation, bottom mobile nav, accessible
 MUI drawer. Preserved Tour, reset and logout in sidebar tools. New nav links for
 profile/family/offline/inspection/sanction/testing need routes/pages below.
- Replaced `src/pages/Student/Dashboard.tsx` using ScholarOverview and actual
 useData user/student/application/documents/notifications. No invented values.
 Original profile/family modal from prior dashboard removed; provide real pages.
- Replaced `src/pages/Auth/Login.tsx` with matching AuthLayout + native demo
 persona select (demo has no passwords). /recover renders matching layout with
 truthful info about demo vs pilot. Added public /recover route to DemoApp.
- Tailwind sans/display now Trebuchet MS + Nirmala UI + Arial; index.html Google
 font links removed. MUI theme palette/font/radius aligned.
- `src/App.tsx` statically imports pilot/pilot.css then casefile.css so final
 shared visual overrides load after pilot base CSS in both modes.
- Added `src/pilot/CaseOverview.tsx`: maps real student snapshot to shared
 ScholarOverview (4 real document checks, primary app, scoped notifications).
- Modified `src/pilot/PilotApp.tsx` using `.staging/update-pilot-case.mjs`:
  imported AuthLayout/Brand/GovernmentBanner/CaseOverview, added recovering
  state BEFORE early returns, replaced login/recovery branch with actual existing
  api.signIn/api.recoverPassword using Field/submit/run unchanged. Replaced green
  header with matching white header/banner + scoped user pill + existing search
  api.selectPage+refresh. Added data-section and case-shell classes. Nav remains
  allowed/active role-based original buttons. Added real online/queue/sign-out
  status card in nav. Student overview uses CaseOverview, other role overview old.
- TypeScript check passed after these changes (both tsc runs exit0).

## Current browser probe

`.staging/inspect-coded.mjs` starts Vite development (forced demo), runs Chromium,
captures desktop1440x960 and mobile375x812 to `artifacts/svg-implementation/`,
prints main geometry/JS errors/overflow and closes both. First sandbox run failed
esbuild access; rerun escalated is running session **81721**. Poll it, inspect
images with view_image. No visual result seen yet. Must correct geometry.

## Important remaining work

1. Exact other demo pages (currently mostly old layouts): Discovery, Wallet,
 Application tracker + 3 step form, Help/Grievance, Officer review/inspection/
 deficiency/signing/testing, CoverageGap and AuditLog. Existing data/store APIs
 must stay connected. SVG gallery already exists and isn't the product.
2. New demo routes/pages profile, family, saved changes, application steps,
 officer inspection/sanction/testing, public receipt as applicable. Role guards.
 Demo has no real offline queue: show honest local-demo state, use actual pilot
 queue in pilot. Family permissions demo currently were static dummy modal;
 don't claim real server family grants in demo. Pilot existing grants must work.
3. Pilot CSS/basic shell only currently. Need arrange sections as SVG workspaces,
 preserving all action forms and server paging tools. Move InstallPilot +
 DataPages from top of main to bottom so dashboard starts at correct y126 but
 keep available/testable (not hidden behind an extra collapsed details).
 Need real nav icons, visual labels while retaining aria-label originals for
 workflow tests (section(page,'applications') expects English lowercase name).
 Pilot header source is one line; use scripted exact marker edits, do not change
 api.ts/backend/security. Profile/schemes/documents/applications/etc old JSX in
 PilotApp on very long lines. New shared UI components can be reused with
 normalized data and existing actions.
4. Pilot application new draft form `DraftForm` exported at bottom. Need inspect
 before changing. Current test DraftForm saves incomplete declared marks/evidence
 and real document IDs; never fabricate IDs or silently submit on click.
5. Shared UI primitives Card/Button/Modal in src/components/ui/index.tsx still
 old styling. Retheme while keeping accessible modal handlers, validation,
 focus, SignaturePadModal hardware calibration and associated tests intact.
6. Current `.case-dashboard` recent-update bodies can be long; fixed254px card
 may overflow. Fix using deliberate clamp/wrap or actual short notification
 excerpt, not fabricated updates. Mobile title can wrap >one line: review capture.
 `.case-journey` CSS uses container query width100cqw for connectors; verify.
7. Unit tests: update Layout.test.tsx for actual new nav labels/placement and
 add meaningful tests for applicationPresentation/new behaviors. Existing demo
 browser tests depend on Tour, Inspect & Review, Kill Income API, etc. Keep
 interactions or update tests for explicit navigation with same full workflow.
8. Build both demo and pilot; run relevant unit + browser fixtures. Need visual
 comparisons representative all22 route states at1440,375,320. Native controls
 and zero overflow, no console errors, valid role restrictions, real action
 effects. Do not assert pixel-perfect without evidence or fake hardcoded stats.
9. Document results to .gsd/JOURNAL.md per empirical-validation. Final concise
 outcome + checks + limits, end with skipped/unverified/risk (Ponytail).

## Sources / helpers already explored

- `src/store/data.ts` has submitApplication, uploadDocument/resubmitDocument,
 reviewDocument, attachDocsToApplication, runVerification, setSourceHealth,
 resolveManualReview, completeInstituteVerification, completeDeptVerification,
 sanctionApplication, pushDbt, raiseDeficiency, correctDeficiency, notifications,
 broadcast, createGrievance/resolveGrievance. All local persisted by dbWrite.
- `src/types/index.ts`: Student, Scheme, Application, StudentDocument, etc.
- pilot/PilotApp.tsx has existing submit/run/command/refresh handlers, scoped
 snapshots, native dialogs and signature canvas. Role sections already complete.
- PilotAccount roles include family. PilotSnapshot wraps fields in records
 {id,version,data}. CaseOverview handles student mapping. Keep role boundaries.
- Demo Wallet.tsx has all upload/DigiLocker/scanner/OCR actions before return;
 return starts ~179, first inspection Modal ~367. Replace top visible layout
 before first Modal, preserve all modals/action handlers. State: uploadOpen,
 digilockerOpen,aadhaarOtpOpen,scannerOpen,inspectId, docs,inspected,totalReuse.
 on actions setUploadOpen, setDigiLockerOpen, setScannerOpen, setInspectId,
 handleDigiLockerPull. DOC_LABEL mapping defined at top. docs OCR source isn't
 a cryptographic checksum: don't claim it is SHA256.
- Demo ReviewQueue.tsx: selectedAppId/selectedApp modal, deficiency form and
 signAppId SignaturePadModal complete; top~100-380 has old huge hero, chart,
 switchboard and tabs. Keep all actions; create actual table matching SVG13.
- Current new files copied via .staging/case-layout.tsx, case-dashboard.tsx,
 case-login.tsx. These temp files can be deleted after success. They are NOT a
 source of truth after editing real files. update-pilot-case.mjs is one-shot;
 DO NOT run it again (would duplicate imports/hooks/rewrites).

## Skills

Ponytail full read. Supabase skill read because pilot: preserve existing auth,
RLS and actions; no backend edits requested. Checked official auth password docs
https://supabase.com/docs/guides/auth/passwords. changelog.md fetch failed via web
unsupported markdown content type; no new Supabase features planned.
Empirical-validation skill read/applied: screenshot proof required, journal evidence.
