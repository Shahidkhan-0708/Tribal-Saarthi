# Interface simplification research

Date: 18 October 2026. Status: research complete; interface migration not implemented.

The owner asked for a simpler scholarship portal, research through Context7, and professional components/icons instead of hand-made UI components. This report uses the running application, its source, Context7 documentation and official service-design guidance. No application components or dependencies were changed during this research.

## Recommendation

Use **Material UI Core with the existing Lucide React icons** for both portals. Use the official MUI templates as references for the shell and sign-in page, and import the library's styled components directly. Keep the existing scholarship engines, role checks, Supabase data access, offline queue and version checks.

This is a recommendation for this project, not a claim that one library automatically makes a service usable. The larger improvement is to organize each page around the next task, with less competing content.

Context7 libraries consulted:

- `/mui/material-ui`: packaged components, responsive navigation, theming and installation.
- `/shadcn-ui/ui`: official components/blocks, ownership model and configuration.
- `/websites/lucide_dev`: direct imports, consistent icon properties and accessible labels.

MUI provides packaged styled components and [free official React templates](https://mui.com/material-ui/getting-started/templates/). That fits the request for supplied components. shadcn/ui is a valid alternative, but its [documented model](https://ui.shadcn.com/docs) distributes component source for the application to own and maintain. For the owner's preference, use MUI rather than creating another local component library.

### Compatibility and implementation constraints

- Installed versions inspected: React/React DOM 18.3.1, Tailwind 3.4.19, Lucide React 0.441.0.
- The npm registry returned MUI Core 9.5.0 with MIT licensing and React 18 in its peer range on the research date. This is metadata verification, not an installed compatibility test.
- MUI's [installation instructions](https://mui.com/material-ui/getting-started/installation/) explicitly require matching `react-is` to React 18.3.1 through the dependency and npm override. Include this before testing the integration.
- MUI documents [Tailwind v3 interoperability](https://mui.com/material-ui/integrations/interoperability/#tailwind-css-v3), including CSS reset ownership, injection order and portal placement. Establish this once in the foundation; do not scatter overrides across screens or apply a global reset change without regression checks.
- Keep Tailwind for existing layout utilities during migration and use a single MUI theme for library components. No React/Tailwind major upgrade is needed merely to execute this recommendation.
- Use Core `Table` and existing server pagination initially. Do not introduce paid grid/template features. Recheck package versions, required peers and licenses when implementation begins.
- Import Lucide icons by name; [Lucide documents tree shaking](https://lucide.dev/guide/react/getting-started). Keep one icon set, consistent size/stroke, and text labels for navigation. Label icon-only buttons on the button itself.

The implementation rule is: no new hand-written Button, Card, Modal, Sidebar, Input or Stepper primitives. Existing page code may compose imported library components and connect the current data/actions. Theme configuration and integration code are still necessary; a library does not supply the scholarship business workflow.

## What was inspected

Eight current-interface screenshots and DOM measurements are saved in `.gsd/evidence/ui-research/`. These are screenshots of the existing product, not generated redesigns.

| Current screen | Viewport | Document height | Observation |
| --- | --- | --- | --- |
| Demo student home | 1440 x 960 | 1938px | Hero and identity card precede application progress |
| Demo scholarships | 1440 x 960 | 1066px | Multiple eligibility summaries and controls |
| Demo applications | 1440 x 960 | 1587px | Tracking, verification and actions compete on one page |
| Demo officer queue | 1440 x 960 | 1867px | Review work is mixed with demo controls |
| Demo student home | 390 x 844 | 3229px | All six sidebar navigation links are hidden; document is 395px wide |
| Pilot sign-in | 1440 x 960 | 960px | Sign-in, recovery, installation and privacy share one surface |
| Pilot student overview | 1440 x 960 | 960px | Eleven student navigation choices; technical account details and records browser |
| Pilot student overview | 390 x 844 | 1045px | Eleven choices become a horizontally scrolling navigation strip |

Counts describe the seeded accounts and viewports tested. Height and number of controls are observations, not universal usability thresholds. No participant usability study, screen-reader session or physical-device audit was performed for this research.

### Layout findings

| Severity | Location | Before | Proposed after | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/components/layout/index.tsx:98`; `demo-student-mobile.png`; `mobile-detail.json` | Sidebar is hidden below its desktop breakpoint; none of its six navigation links are visible at 390px | Official MUI responsive `Drawer`: permanent when it fits, temporary with a labelled Menu button on small screens | Keep controls distinct from content; primary destinations must remain reachable |
| MEDIUM | `src/pages/Student/Dashboard.tsx:81`; `demo-student-home.png` | Large decorative hero and identity card appear before the application task; the mobile page also overflows by 5px | Compact greeting, next required action and current application status first; identity card in the profile/documents area; constrain verification rows | Order by importance and preserve layout at small widths |
| MEDIUM | `src/pilot/PilotApp.tsx`; `pilot-student-home.png`; `pilot-student-mobile.png` | Eleven peer-level student destinations, technical identifiers and records browsing on the overview | Five main student destinations, account/support options in their relevant menus, operational data tools in the relevant task or role | Related work should be grouped; technical details should not compete with the primary task |

Layout verdict: **Block** simplification acceptance until the missing mobile navigation is repaired. This is an audit finding, not a claim that a new design has passed verification.

### Writing findings

| Severity | Location | Before | Proposed after | Why |
| --- | --- | --- | --- | --- |
| HIGH | `src/pages/Student/Dashboard.tsx:234`, `:242`, `:261`; `demo-student-home.png` | Every unread notice is labelled a pending action, including a disbursement update | Separate unread updates from actions that actually need a response; use the authoritative application/deficiency status | A read-state flag does not establish that the student must act |
| MEDIUM | `src/lib/i18n.ts:20`, `:22`; `src/components/layout/index.tsx` | Labels include Forensic Audit Log, Broadcasts & SMS, Scholarship Discovery and Document Wallet | Activity log, Announcements, Scholarships and Documents; retain clear simulation/provider notices where applicable | Familiar task names are easier to scan and avoid implying live SMS delivery |

Writing verdict: **Block** acceptance until informational notices stop claiming that action is required. Check the same vocabulary in both languages and portals; this research does not establish full multilingual coverage.

## Proposed information structure

These are project-specific proposals based on the inspected workflows, not a universal rule that every service must have five navigation items.

Student main navigation:

1. **Home**: next required action, current application status and recent updates.
2. **Scholarships**: concise results, eligibility explanation and scheme details.
3. **My applications**: drafts, current applications, history, receipts and tracking.
4. **Documents**: uploads, verification state, corrections and reuse.
5. **Help**: assistance, complaints and their status.

Move profile/password/privacy/family consent into the account area. Open notifications from a labelled header control. Put the assistant under Help. Show queued offline work beside the action it belongs to and retain a reachable queue view under account/support; do not delete it to make the page look cleaner.

Use the same header pattern in both portals: page title, language, notifications and account menu. Keep persona selection, reset and tour in one **Demo tools** menu in the demonstration. Preserve those workflows and their tests. Keep a concise visible demonstration notice and explicit labels on simulated verification/payment results.

Officer main navigation should emphasize **Review applications**, **Help requests** and **Reports**, with **Accounts** and **Settings** only for authorized roles. Keep audit history, operational jobs and configuration reachable within their relevant destinations. Navigation grouping must not alter server authorization or add privileges.

## Pages should answer one question at a time

The service-design basis is [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/): ask only for needed information, make the question clear, support going back and reuse existing answers. These are usability references, not Indian-government approval or branding requirements.

- **Home:** What do I need to do next? Give priority to an actual correction/request, otherwise the current application, otherwise finding a suitable scholarship. Do not invent tasks from unread notifications.
- **Scholarships:** Which scheme fits me? Show name, benefit, deadline and advisory eligibility summary. Open detailed rules on request. Preserve explanations of missing evidence and failed checks.
- **Apply:** What information is still needed? Group profile, evidence/documents and review/submit into short steps. Reuse uploaded documents and saved data. Preserve draft saving and the online-only final submission rule.
- **Check answers:** Is this ready to submit? Use a review summary with change links before the final confirmation, following the [check-answers pattern](https://design-system.service.gov.uk/patterns/check-answers/).
- **Application status:** Where is it now, and do I need to act? Show the server status and a specific next action. Expand event/verification details when needed. Returned, deficient and rejected states must remain explicit; a decorative progress percentage must not imply approval.
- **Officer queue:** Which case needs my review? Use searchable, paginated rows with one review action. Put document evidence, notes and versioned decisions in the case detail view.

For long applications that people can complete over several sessions and in a flexible order, consider the [complete-multiple-tasks pattern](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/). Use a linear flow where a specific order is required; a task list is not appropriate everywhere. Use [step indicators](https://designsystem.digital.gov/components/step-indicator/) for orientation within a suitable multi-step form, not as a substitute for navigation or server workflow rules.

Secondary explanations can use progressive disclosure, as described by the [details guidance](https://design-system.service.gov.uk/components/details/). Keep deadlines, required corrections, costs, critical consent information and failure recovery visible. Collapsing everything would create a different usability problem.

## Professional component map

| Need | Supplied component or reference | Integration boundary |
| --- | --- | --- |
| Desktop/mobile navigation | MUI `AppBar`, `Toolbar`, `Drawer`, `List`, `ListItemButton`; [responsive drawer](https://mui.com/material-ui/react-drawer/) and official Dashboard template | Existing role routes/sections and labelled mobile menu |
| Sign-in and recovery | Official MUI sign-in template; `TextField`, `Button`, `Link`, `Alert` | Existing Auth calls, recovery state and errors; separate recovery task |
| Page structure | MUI `Container`, `Stack`, `Typography`, `Paper` | One shared theme and readable content width |
| Profile and application fields | MUI [TextField](https://mui.com/material-ui/react-text-field/), `FormControl`, `FormHelperText`, `Select`, `Checkbox` | Keep controlled values, validation, persistent labels and current payloads |
| Form orientation | MUI [Stepper](https://mui.com/material-ui/react-stepper/), `Step`, `StepLabel`, `Button` | Client form steps remain distinct from server review stages |
| Application rows and officer queues | MUI [Table](https://mui.com/material-ui/react-table/), `TablePagination`, `Chip` | Preserve existing server pagination, search scope and selection semantics |
| Important warnings/updates | MUI `Alert`, `AlertTitle`, `Snackbar` | Critical or actionable messages persist; brief acknowledgements may be transient |
| Evidence and detail views | MUI `Accordion`, `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` | Full detail views for review; confirmation dialogs for consequential decisions |
| Account and demo tools | MUI `Menu`, `MenuItem`, `IconButton`, `Tooltip` | Preserve focus, keyboard access, logout and existing demo functions |
| Loading and empty states | MUI `Skeleton`, `CircularProgress`, `Typography`, `Button` | Explain what is loading or how to proceed; never display fabricated records |
| Icons | Existing `lucide-react` named exports | Consistent stroke and scale; visible labels for main destinations |

Use imported defaults and documented variants. Theme-level brand colors/spacing are acceptable; do not create new bespoke primitives, add another icon collection, download an unrelated paid dashboard, or populate a template with irrelevant analytics widgets.

## Migration order and acceptance evidence

This is the implementation handoff, not a completed redesign.

1. **Foundation and navigation:** add pinned compatible MUI/Emotion dependencies and the React 18 `react-is` override; establish theme/reset ownership; integrate the official responsive shell into the existing demo and pilot entry paths. Check desktop and mobile navigation before migrating every screen.
2. **Home and language:** move the next action/application status first, separate required action from unread updates, group demo tools, unify navigation labels and remove technical identifiers from default summaries.
3. **Scholarship and application tasks:** migrate supplied form components, grouped application steps, review/change links, scheme summaries and document selection. Keep eligibility/state-machine/offline behavior unchanged.
4. **Officer and account work:** migrate the queue, case details, confirmations, account/recovery/privacy/family and operation-history views. Keep all current features connected and scope/version checks intact.
5. **Verification:** run typecheck and unit tests after each implemented task, both builds, demo persona/tour regressions, production offline/conflict/permission-denial tests and focused authenticated browser checks. Update feature status only after those results exist.

Required browser checks for the implementation:

- At 320px, 390px, tablet and desktop widths: every authorized destination remains reachable, the menu has a visible label, and ordinary page content has no horizontal overflow. A wide data table may scroll inside its own labelled container.
- The next task/status appears before decorative content. Long scheme names, names and Hindi labels wrap without clipping important actions.
- Keyboard users can open/close the library drawer/dialog/menu, reach all controls and recover focus. Check 200% zoom and contrast; library use does not prove full application accessibility.
- Critical warnings and simulation disclosures remain visible at the relevant point. Optional technical details do not dominate the overview.
- Draft saving, upload persistence, document reuse, receipts, officer notes/decisions, permission denials and offline replay still use the existing authoritative data.
- Test people can find a scholarship, resume an application, correct a document and identify their current status. Measure confusion and successful task completion with actual participants before claiming the site is easier for everyone.

## Research result and limits

Research and current-screen inspection are complete. The recommended next implementation is the shared professional component foundation and responsive navigation, followed by task-focused page migration. No new UI component, mockup, dependency installation, application-source edit, backend change or deployment was made for this research. Current user-facing defects remain until that implementation is performed. Tests were not rerun because application code was unchanged.
