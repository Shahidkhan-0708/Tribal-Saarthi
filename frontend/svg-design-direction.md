# Tribe Saarthi SVG design direction

Apply the root `SKILL.MD` to the complete 22-screen mockup set.

## Audience and job

Tribal scholars need to know their next step, documents needed, and application
status. Institution officers need to inspect evidence and explain their decisions.
Family members need clear consent. These are scholarship case files, so the
application and its next action carry the visual identity.

## Tokens

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#FFFFFF` | Forms and reading surfaces |
| Mist | `#EEF3F3` | Page background and grouped rows |
| Ink | `#152E35` | Headings and body text |
| Forest | `#075A46` | Primary action and selected navigation |
| Slate | `#52666D` | Supporting text |
| Ochre | `#8A4F13` | Pending action, always accompanied by text |

Type: Trebuchet MS for its open, humanist shapes, with Nirmala UI for Indian
scripts and system sans-serif fallbacks. One family throughout; 24–28px task
headings, 14–16px primary content, 11–12px compact supporting information in
desktop evidence tables. Use tabular numerals for amounts and IDs; reserve
monospace for literal hashes. No external font requests in the SVG files.

Layout: left aligned case-file content beside a stable navigation rail. A single
task heading precedes the application journey; related facts share a summary
strip instead of separate metric cards. Buttons name the next action. Use modest
8px surface radii, 4px controls, and 1px grouping rules; elevation only for dialogs.

```text
Desktop                           Mobile
Brand / language / person         Brand / language
Nav | Application / next action   Hello, Mohan
    | Journey                     Application / next action
    | Related facts in one strip  Journey
    | Documents | Recent updates  Documents / saved changes
    |           | Ask Saarthi     Ask Saarthi / help
                                  Bottom navigation
```

## Review against the brief

Rejected a decorative tribal pattern: it would imply a shared visual tradition
across distinct communities. Rejected repeated donuts and gradient metric cards
as the main identity: scholars need an intelligible application state. Keep
charts where they compare meaningful data, and keep numbered markers only for
actual sequential workflows. The case file, clear pending state, and plain
language are the distinctive elements. Retain green for portal continuity.

## Implementation and critique

### Second-pass plan

Keep the six tokens and humanist type above. Use 28px task headings, 16px row
titles, and 13–14px supporting information on the two redesigned work lists.
Both are left aligned. The repeated equal-card discovery layout and metric-first
review queue still looked interchangeable with unrelated dashboards, so replace
them with structures that serve these two specific scholarship tasks:

```text
Find a scholarship                    Officer review queue
Heading / search                      Urgent work / start next review
Schemes                  Preparation  Needs review / corrections / approved
Name / support / action  checklist    Search / institution / due soonest
Name / support / action               Scholar / evidence / due / review
Name / support / action               Scholar / evidence / due / review
```

Comparison rows make the three schemes easier to scan. The review queue puts
the oldest and most urgent work first. Neither needs a percentage ring as its
opening element. Replace rings for document completion, one resolved help
request, and available family access with direct status sentences. Retain charts
for real component or district comparisons. Avoid fabricated confidence scores
in the inspection screen; list the evidence checks instead.

Update the existing shared SVG library and its three screen generators, then
regenerate categorized screens, v2 copies, root aliases, design plans, galleries,
and both distribution ZIPs. Preserve the app and favicon. Add accessible titles
and descriptions to the standalone SVGs. The gallery must work at 320px and by
keyboard, without hover motion or missing previews in v2.

Validate all 22 screens in Chromium with fonts offline, inspect desktop/mobile,
officer, form and authentication screenshots, check XML and viewport bounds,
check mirrored output equality and gallery filters. Static SVGs depict controls;
they do not implement the application workflows or establish compliance.

## Verification

Chromium parsed and rendered every screen with HTTP requests blocked. All 76
SVG outputs matched their source screens, titles and descriptions were present,
and no text extended outside the declared viewports. Both galleries loaded all
22 previews, passed keyboard filter checks, and stayed within 320, 768, and
1440px viewports. Screenshots are in `artifacts/svg-review/`.

Visual critique corrected seven overflowing lines in five screens, removed
repeated stepper badges, and repaired missing audit-event names and incorrectly
offset connectors. The sign-in and recovery mockups now use one coherent email
flow. The existing application and backend were outside this SVG task.
