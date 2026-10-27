# Tribe Saarthi screen library

Open [the gallery](index.html) to browse all 22 SVG mockups, filter by audience,
and download individual screens. It works directly from disk. The
[design direction](../../design-plans/svg-design-direction.md) applies the root
`SKILL.MD`: a scholarship case file, a clear next action, forest green and white,
humanist typography, quiet surfaces, and plain language.

The SVGs contain sample records and depict proposed interfaces. They do not
implement the application workflows or establish accessibility, security, or
government certification. Signing, payments, and integrations are illustrative.

| Screens | Folder | Contents |
| --- | --- | --- |
| 01–12 | [Scholar portal](01-scholar-portal/) | Desktop and mobile dashboard, discovery, three application steps, tracker, documents, help, profile, family access, saved changes |
| 13–19 | [Officer portal](02-officer-portal/) | Review queue, inspection, correction request, approval, service testing, coverage gaps, decision history |
| 20–22 | [Sign-in and receipts](03-system-auth/) | Sign in, password recovery, public receipt preview |

The categorized folders are the gallery's primary screens. Identical copies are
written to `v2/` and `../../design-plans/`; eight legacy filenames in this folder
remain synchronized. Both dashboard aliases in `design-plans/` are synchronized
too. The [v2 gallery](v2/index.html) resolves its previews from the same screens.

SVGs have accessible titles and descriptions and use local font fallbacks:
Trebuchet MS, Nirmala UI, and Arial. They make no external font requests. Visual
controls inside an SVG are static; the HTML gallery supports keyboard navigation,
visible focus, pressed filter states, and a live result count.

From the project root:

```powershell
npm run mockups:build
npm run test:mockups
```

The builder reuses `scripts/uswds_svg_library.mjs` and the scholar, officer, and
system screen modules. It regenerates all 76 SVG outputs and both galleries,
runs Chromium validation, and refreshes these two distribution archives:

- `docs/Tribe-Saarthi-Complete-22-SVGs.zip`
- `Tribe-Saarthi-Complete-22-SVGs (2).zip`

The validator checks XML parsing, accessible descriptions, local references,
offline font rendering, text within each screen, mirrored outputs, preview
loading, and keyboard filtering. It checks gallery overflow at 320, 768, and
1440px. Screenshots and findings are saved to `artifacts/svg-review/`.

These checks require the already installed Playwright Chromium browser. No
application build or backend connection is needed to rebuild the mockups.
