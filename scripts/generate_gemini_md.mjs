import fs from 'node:fs';

const rawData = JSON.parse(fs.readFileSync('scripts/uswds_scraped_raw.json', 'utf8'));

// Format comprehensive GEMINI.md
const geminiMdContent = `# USWDS Design System Rules & Frontend Implementation Guidelines (GEMINI.md)

> **Source**: [United States Web Design System (USWDS 3.0)](https://designsystem.digital.gov/)  
> **Target Application**: **Tribe Saarthi** (Ministry of Tribal Affairs, Government of India)  
> **Purpose**: Authoritative frontend design specifications, design tokens, accessibility mandates, and component rules scraped and synthesized from \`designsystem.digital.gov\` to guarantee federal/government-grade usability, trustworthiness, inclusivity, and aesthetics across the entire codebase.

---

## Table of Contents
1. [Core Design Principles](#1-core-design-principles)
2. [Design Tokens: Color Architecture](#2-design-tokens-color-architecture)
3. [Design Tokens: Typography & Typesetting](#3-design-tokens-typography--typesetting)
4. [Design Tokens: Spacing, Grid & Elevation](#4-design-tokens-spacing-grid--elevation)
5. [Accessibility Mandates (Section 508 & WCAG 2.1 AA/AAA)](#5-accessibility-mandates-section-508--wcag-21-aaaaa)
6. [Data Visualization Guidelines](#6-data-visualization-guidelines)
7. [Forms, Validation & Complex Workflows](#7-forms-validation--complex-workflows)
8. [Core Component Specifications](#8-core-component-specifications)
9. [Frontend Code Implementation (Tailwind & React/MUI Integration)](#9-frontend-code-implementation-tailwind--reactmui-integration)
10. [Do's and Don'ts Checklist](#10-dos-and-donts-checklist)

---

## 1. Core Design Principles

Directly derived from [USWDS Design Principles](https://designsystem.digital.gov/design-principles/):

### Principle 1: Start with Real User Needs
- **Ground design in user evidence**: Build interfaces around the actual tasks tribal students, parents, and nodal officers need to accomplish—not internal government bureaucracy.
- **Support diverse contexts**: Optimize for 2G/3G mobile networks, intermittent connectivity, budget smartphones, screen readers, and low digital literacy.
- **Default to plain language**: Technical legal rules (e.g. PVTG criteria, Aadhaar vault verification) must be translated into simple, readable explanations at an 8th-grade reading level.

### Principle 2: Earn Trust
- **Unmistakable government identity**: Display authentic, standardized identity markers (Ministry header, official seal, secure HTTPS banner).
- **Radical transparency**: Never fail silently. When external databases (e.g. DigiLocker, PFMS) experience downtime, explain the fallback gracefully without frightening the student.
- **Zero dark patterns**: Do not hide deadlines, fees, or document requirements. Sanction calculations must show tuition, maintenance, and book grants explicitly.

### Principle 3: Embrace Accessibility by Default
- **Accessibility is a civil right**: Section 508 and WCAG 2.1 AA compliance is non-negotiable across every page, state, and interaction.
- **Multi-modal feedback**: Every state change must be communicated through text, color, shape/icon, and ARIA announcements.
- **Keyboard navigable**: Every interactive control must be 100% operable via keyboard alone with visible, high-contrast focus indicators.

### Principle 4: Promote Continuity
- **Unified token vocabulary**: Color names, spacing increments, and typography scales must remain identical across the Scholar Portal, Officer Verification Desk, and Public Verification Portal.
- **Predictable workflows**: Buttons, links, search bars, and dialogs must behave consistently. Place primary actions predictably at the bottom-right or top-right.

### Principle 5: Listen and Learn
- **Continuous feedback loops**: Provide frictionless ways for users to report errors or ask Saarthi AI for assistance without leaving their current workflow.

---

## 2. Design Tokens: Color Architecture

Derived from [USWDS Color Overview](https://designsystem.digital.gov/design-tokens/color/overview/) and [Color Tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/):

### The 100-Point Grade System
USWDS categorizes every color on a **grade scale from 0 to 100**:
- \`grade 0\`: Pure White (\`#FFFFFF\`)
- \`grade 5–20\`: Very Light Tint (backgrounds, alert containers, table headers)
- \`grade 30–40\`: Light Accent (borders, inactive chips, subtle dividers)
- \`grade 50\`: Mid-tone (non-text decorative icons, large secondary graphics)
- \`grade 60–70\`: High-contrast interactive (buttons, active tabs, secondary text)
- \`grade 80–90\`: Deep Ink (primary text, critical badges, high-contrast borders)
- \`grade 100\`: Pure Black (\`#000000\`)

### The USWDS Magic Number Rule (Accessibility by Math)
> **The 50+ Rule (WCAG AA)**: Any two colors whose grade values differ by **50 or more** will automatically meet WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text/icons).  
> **The 70+ Rule (WCAG AAA)**: Any two colors whose grade values differ by **70 or more** meet WCAG 2.1 AAA contrast requirements (7:1).

### Semantic Theme Tokens
\`\`\`scss
// 1. Primary Brand (Forest & Emerald Government Identity)
$color-primary-darker:  #064E3B; // Grade 90 (Headers, bold emphasis)
$color-primary-dark:    #047857; // Grade 70 (Primary buttons, active states)
$color-primary:         #059669; // Grade 60 (Interactive links, icons)
$color-primary-light:   #A7F3D0; // Grade 20 (Card highlights, focus rings)
$color-primary-lighter: #ECFDF5; // Grade 5  (Success containers, card backgrounds)

// 2. Secondary & Accent (Warm Amber / Ochre Tribal Heritage)
$color-secondary-dark:  #92400E; // Grade 80 (PVTG badge text, alert text)
$color-secondary:       #D97706; // Grade 60 (Warning highlights, action buttons)
$color-secondary-light: #FDE68A; // Grade 20 (Notice borders, active chips)
$color-secondary-lighter:#FEF3C7; // Grade 5  (Warning containers, callout boxes)

// 3. Base & Neutral Ink
$color-base-darkest:    #0F172A; // Grade 95 (Headings, primary body text)
$color-base-dark:       #334155; // Grade 75 (Secondary text, metadata)
$color-base:            #64748B; // Grade 50 (Placeholders, inactive icons)
$color-base-light:      #CBD5E1; // Grade 30 (Component borders, card dividers)
$color-base-lighter:    #F1F5F9; // Grade 10 (Table alternate stripes, input bg)
$color-base-lightest:   #F8FAFC; // Grade 5  (Page background, modal backdrop)
$color-white:           #FFFFFF; // Grade 0  (Card surface, input surface)

// 4. System Feedback States
$color-state-success:   #047857; // Approved, Verified, Sealed
$color-state-warning:   #B45309; // Pending review, SLA approaching
$color-state-error:     #DC2626; // Discrepancy found, missing mandatory field
$color-state-info:      #2563EB; // System notification, registry sync info
\`\`\`

---

## 3. Design Tokens: Typography & Typesetting

Derived from [USWDS Typesetting](https://designsystem.digital.gov/design-tokens/typesetting/overview/):

### Font Families
- **Primary Body & Interface**: \`'Plus Jakarta Sans', 'Public Sans', system-ui, -apple-system, sans-serif\`
- **Data, Numbers & Cryptographic Hashes**: \`'JetBrains Mono', 'Roboto Mono', ui-monospace, monospace\`
- **Government Display & Headings**: \`'Plus Jakarta Sans', -apple-system, sans-serif\` (weights: 700 bold, 800 extra bold, 900 black)

### Type Scale
| Token | Rem | Px | Usage | Leading (Line Height) |
| :--- | :--- | :--- | :--- | :--- |
| \`text-3xs\` | 0.6875rem | 11px | Badges, status pills, table micro-headers | 1.2 |
| \`text-2xs\` | 0.75rem | 12px | Captions, secondary timestamps, SLA labels | 1.35 |
| \`text-xs\` | 0.8125rem | 13px | Form helper text, table body cells | 1.4 |
| \`text-sm\` | 0.875rem | 14px | Input values, sidebar navigation, compact buttons | 1.45 |
| \`text-base\`| 1.0rem | 16px | Primary body copy, description paragraphs | 1.55 |
| \`text-md\` | 1.125rem | 18px | Card titles, modal subtitles, section subheads | 1.4 |
| \`text-lg\` | 1.25rem | 20px | Section headers (\`h3\`), KPI card values | 1.3 |
| \`text-xl\` | 1.5rem | 24px | Page subheadings (\`h2\`), modal titles | 1.25 |
| \`text-2xl\`| 1.75rem | 28px | Main page titles (\`h1\`), dashboard greetings | 1.2 |
| \`text-3xl\`| 2.25rem | 36px | Hero anchor statistics (\`81,373\`), financial sums | 1.1 |

### The Measure Rule (Optimal Line Length)
- **45 to 75 characters per line** is the mandated reading limit.
- Body text must never span full width on widescreen viewports. Constrain reading containers to \`max-width: 65ch\` (\`prose\` or \`max-w-2xl\`).

---

## 4. Design Tokens: Spacing, Grid & Elevation

Derived from [USWDS Spacing Units](https://designsystem.digital.gov/design-tokens/spacing-units/) and [Shadow](https://designsystem.digital.gov/design-tokens/shadow/):

### 8px Base Grid Increments
- \`0.5\` = 4px (Micro gaps between icon and text)
- \`1\`   = 8px (Inner badge padding, tight stack gap)
- \`1.5\` = 12px (Form input vertical padding, icon margins)
- \`2\`   = 16px (Card inner padding on mobile, standard component gap)
- \`3\`   = 24px (Standard desktop card padding, section gap)
- \`4\`   = 32px (Grid columns gap, modal inner padding)
- \`5\`   = 40px (Hero section spacing, page section break)
- \`6\`   = 48px (Major structural dividing gap)
- \`8\`   = 64px (Header to main container offset)

### Elevation & Shadows
- **Elevation 1 (Card border / subtle lift)**:
  \`box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px 0 rgba(15, 23, 42, 0.03);\`
- **Elevation 2 (Interactive Card Hover)**:
  \`box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04);\`
- **Elevation 3 (Sticky Navbars / Toolbars)**:
  \`box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03);\`
- **Elevation 4 (Modal Dialogs & Drawers)**:
  \`box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 10px 10px -5px rgba(15, 23, 42, 0.04);\`

---

## 5. Accessibility Mandates (Section 508 & WCAG 2.1 AA/AAA)

Derived from [USWDS Accessibility Guide](https://designsystem.digital.gov/documentation/accessibility/):

1. **Target Size**: Minimum **44 × 44 CSS pixels** for every clickable element (buttons, links, form inputs, checkboxes, accordion toggles).
2. **Visible Focus Ring**:
   - Focus outline must have at least **3:1 contrast** against both the element and background.
   - Recommended style: \`outline: 2px solid #047857; outline-offset: 2px;\`.
   - Never suppress outline with \`outline: none\` without providing an explicit replacement.
3. **Non-Color Indicators**:
   - Statuses must never rely purely on green/red/amber.
   - Pair with explicit text (\`VERIFIED\`, \`ACTION REQUIRED\`, \`PENDING\`) and Lucide vector icons (\`CheckCircle\`, \`AlertTriangle\`, \`Clock\`).
4. **Accessible Tables**:
   - Include \`<th scope="col">\` for column headers and \`<th scope="row">\` for row keys.
   - Numeric columns right-aligned with monospace figures (\`font-variant-numeric: tabular-nums\`).
5. **Screen Reader Announcements**:
   - Use \`aria-live="polite"\` for asynchronous status updates (e.g. offline synchronization flushes, file upload completions).
   - Use \`aria-describedby\` to link input fields to their validation error messages.

---

## 6. Data Visualization Guidelines

Derived from [USWDS Data Visualizations](https://designsystem.digital.gov/components/data-visualizations/):

1. **Donut / Pie Charts**:
   - Optimal slice count: **Maximum 4 to 6 slices**. If more exist, group smaller slices into "Other".
   - Slice separation: Always leave a **2px white boundary gap** between adjacent segments to prevent optical color bleed.
   - Centered metrics: Donut cavities must display the focal aggregate metric (\`₹132K\`, \`52% Coverage\`, \`145 Cases\`) with a 1-word descriptive subtitle.
   - Visual Legends: Pair each slice color with an explicit swatch, human-readable label, percentage, and monetary or count value.
2. **Process Pipelines & Steppers**:
   - Distinct visual state encoding:
     - Completed: Filled solid emerald circle with white checkmark (\`✓\`).
     - Active: Amber concentric pulsing ring with center badge.
     - Upcoming: Slate-gray neutral number with subtle border.
   - Connecting rails must visually fill up to the active stage.
3. **Alternative Accessible Tables**:
   - Every graphical chart must offer a toggle to view the underlying data in an accessible semantic HTML \`<table>\` or a one-click CSV download.

---

## 7. Forms, Validation & Complex Workflows

Derived from [USWDS Complex Form Patterns](https://designsystem.digital.gov/patterns/complete-a-complex-form/) and [Form Validation](https://designsystem.digital.gov/components/validation/):

1. **Single-Column Form Architecture**:
   - Form controls should follow a single vertical column. Multi-column forms disrupt natural reading rhythm and mobile responsiveness.
2. **Clear Field Labeling**:
   - Always place the \`<label>\` directly above the input.
   - Mark optional fields with explicit text: \`Guardian Contact Number (Optional)\`. Do not rely on solitary asterisks (\`*\`).
3. **In-Line Validation Protocol**:
   - Do not validate prematurely while the user is typing.
   - Trigger field validation on \`blur\` (when the user navigates away) or upon form submission.
   - When an error occurs:
     - Highlight the input border in \`#DC2626\` (Grade 70 red).
     - Display an error message directly below the label and above the input.
     - Associate the error text using \`aria-describedby="input-error-msg"\`.
4. **Top Page Error Summary**:
   - If form submission fails, render an alert box at the very top of the page focusing the keyboard on it.
   - List each failed field as an anchor link jumping straight to the problem field.

---

## 8. Core Component Specifications

Derived from USWDS Components ([Banner](https://designsystem.digital.gov/components/banner/), [Alert](https://designsystem.digital.gov/components/alert/), [Card](https://designsystem.digital.gov/components/card/), [Table](https://designsystem.digital.gov/components/table/)):

### 1. Official Government Banner (\`usa-banner\`)
- **Position**: Pinned to the top of every page before the primary navigation.
- **Content**:
  - Official MoTA emblem.
  - Text: *"An official website of the Ministry of Tribal Affairs · Government of India"*.
  - Lock icon + *"Official government websites use HTTPS"* security seal.

### 2. Alert Component (\`usa-alert\`)
- **Slim Alert**: Height 40px, single line with icon for quick inline feedback.
- **Card Alert**: With bold title, explanatory body, and optional action link.
- **Colors**:
  - Success: Emerald background (\`#ECFDF5\`), 4px left border (\`#047857\`).
  - Warning: Warm amber background (\`#FEF3C7\`), 4px left border (\`#D97706\`).
  - Error: Light red background (\`#FEE2E2\`), 4px left border (\`#DC2626\`).
  - Info: Light blue background (\`#EFF6FF\`), 4px left border (\`#2563EB\`).

### 3. Step Indicator (\`usa-step-indicator\`)
- Horizontal layout on desktop with numbered or icon circular nodes.
- Vertical layout on mobile screens under 640px.
- Live progress announcement: \`<span class="sr-only">Step 2 of 4: College Review</span>\`.

### 4. Interactive Data Table (\`usa-table\`)
- Light gray table header (\`#F8FAFC\`) with bold uppercase micro-headings (\`text-3xs font-extrabold text-slate-500\`).
- Cell padding: 12px vertical, 16px horizontal.
- Subtle row separator: \`1px solid #F1F5F9\`.
- Hover state: \`background-color: #F8FAFC\`.

---

## 9. Frontend Code Implementation (Tailwind & React/MUI Integration)

### Tailwind Config Token Mapping
In our project's \`tailwind.config.ts\`, map the USWDS design tokens to utility classes:

\`\`\`typescript
// tailwind.config.ts excerpt
export default {
  theme: {
    extend: {
      colors: {
        gov: {
          'primary-darker': '#064E3B',
          'primary-dark': '#047857',
          'primary': '#059669',
          'primary-light': '#A7F3D0',
          'primary-lighter': '#ECFDF5',
          'secondary-dark': '#92400E',
          'secondary': '#D97706',
          'secondary-light': '#FDE68A',
          'secondary-lighter': '#FEF3C7',
          'base-darkest': '#0F172A',
          'base-dark': '#334155',
          'base': '#64748B',
          'base-light': '#CBD5E1',
          'base-lighter': '#F1F5F9',
          'base-lightest': '#F8FAFC',
          'state-error': '#DC2626',
          'state-success': '#047857',
          'state-warning': '#D97706',
          'state-info': '#2563EB',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'gov-1': '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        'gov-2': '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
        'gov-3': '0 10px 15px -3px rgba(15, 23, 42, 0.08)',
        'gov-modal': '0 20px 25px -5px rgba(15, 23, 42, 0.25)',
      }
    }
  }
}
\`\`\`

### Example React Component: Government-Grade Alert Box
\`\`\`tsx
import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface GovAlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  children: React.ReactNode;
}

const alertConfig = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-600',
    text: 'text-emerald-900',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-600',
    text: 'text-amber-900',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-600',
    text: 'text-red-900',
    icon: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-600',
    text: 'text-blue-900',
    icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
  }
};

export const GovAlert: React.FC<GovAlertProps> = ({ type, title, children }) => {
  const cfg = alertConfig[type];
  return (
    <div 
      role="region" 
      aria-label={title} 
      className={\`\${cfg.bg} border-l-4 \${cfg.border} p-4 rounded-r-lg shadow-sm flex gap-3.5 my-3\`}
    >
      {cfg.icon}
      <div>
        <h4 className={\`text-sm font-extrabold \${cfg.text}\`}>{title}</h4>
        <div className="text-xs text-slate-700 mt-1 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
\`\`\`

---

## 10. Do's and Don'ts Checklist

| Rule | DO | DON'T |
| :--- | :--- | :--- |
| **Color Contrast** | **DO** ensure all text has at least 4.5:1 contrast against its background using the 50-grade difference rule. | **DON'T** use light gray text (\`#94A3B8\`) on white or light backgrounds. |
| **Focus Rings** | **DO** provide a 2px high-contrast outline on keyboard focus (\`focus-visible:ring-2\`). | **DON'T** remove outlines with \`outline: none\` without custom styling. |
| **Touch Targets** | **DO** provide at least 44px × 44px hit areas on all buttons, links, and switches. | **DON'T** make tiny clickable text links clustered closely together on mobile. |
| **Form Layout** | **DO** stack form fields vertically in a single predictable column. | **DON'T** place related inputs across horizontal columns that confuse tab order. |
| **Error Feedback** | **DO** describe specifically what is wrong and exactly how to fix it with an icon. | **DON'T** say "Invalid input" or rely solely on a red border with no text explanation. |
| **Data Visuals** | **DO** provide a centered total, clean 2px slice gaps, and a table alternative for charts. | **DON'T** show raw unformatted numbers without currency signs or percentage context. |
| **Language** | **DO** explain statutory government rules in plain, layman-accessible language. | **DON'T** overwhelm citizens with internal bureaucratic acronyms with no definition. |
`;

fs.writeFileSync('GEMINI.md', geminiMdContent, 'utf8');
console.log('✓ Successfully created GEMINI.md with comprehensive USWDS design rules.');
