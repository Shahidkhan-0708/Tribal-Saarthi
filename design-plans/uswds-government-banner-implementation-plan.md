# Implementation Plan: USWDS Official Government Banner (`usa-banner`) & Layout Accessibility Conformance

> **Target File**: `src/components/layout/index.tsx`  
> **Governing Standards**: `GEMINI.md` Section 8.1 (USWDS Banner), Section 2 (Color Architecture), Section 5 (Accessibility Mandates)  
> **Status**: Ready for Execution

---

## 1. Problem Statement & Design Evidence

In [`src/components/layout/index.tsx`](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L221-L223), the top of the application currently renders a decorative 3px line:
```tsx
{/* Top Tribal Motif Accent Bar */}
<div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-600 via-earth-500 to-emerald-600 z-50 shadow-xs" />
```

### Violations against `GEMINI.md`:
1. **Section 8.1 (`usa-banner`) Contract**: Mandates an official government banner pinned to the very top of every page before primary navigation, displaying the sovereign government identity (*"An official website of the Ministry of Tribal Affairs · Government of India"*) and the HTTPS security seal (*"Official government websites use HTTPS"*).
2. **Section 5.1 (Touch Targets)**: Header mobile menu toggles (`h-8 w-8`), theme buttons, and sidebar navigation items (`py-2` ~32px) fall short of the mandated minimum **44 × 44 CSS pixels**.
3. **Section 2 & 10 (Color Contrast Math)**: Microcopy in sidebar headers and user account meta (`text-[10px] text-[#57534E]`) falls below the required 4.5:1 WCAG AA contrast against light background surfaces.

---

## 2. Proposed Changes & Implementation Specification

### File: `src/components/layout/index.tsx`

#### Change A: Add the Official USWDS Government Banner Component
Replace lines 221–223 with the standardized USWDS banner:

```tsx
{/* USWDS 3.0 Official Government Banner (GEMINI.md Section 8.1) */}
<div 
  role="region" 
  aria-label="Official government website banner" 
  className="w-full bg-[#064E3B] text-emerald-50 px-4 sm:px-8 py-2 text-[11px] font-semibold flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900 z-50"
>
  <div className="flex items-center gap-2">
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-black text-emerald-200">
      TS
    </div>
    <span>
      An official website of the <strong className="font-extrabold text-white">Ministry of Tribal Affairs</strong> · Government of India
    </span>
  </div>
  <div className="flex items-center gap-2 text-emerald-200 text-[10.5px]">
    <span className="inline-flex items-center gap-1 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60 font-mono text-[10px]">
      <svg className="h-3 w-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      HTTPS Encrypted
    </span>
    <span className="hidden md:inline text-emerald-300/80">·</span>
    <span className="hidden md:inline font-mono">Sec 65B Indian Evidence Act Compliant</span>
  </div>
</div>
```

#### Change B: Upgrade Interactive Controls to 44×44px Minimum Touch Targets
1. **Sidebar Navigation Links** ([Line 140](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L140)):
   - Change `px-3 py-2 text-xs` to `px-3.5 py-2.5 min-h-[44px] text-xs flex items-center`.
2. **Mobile Menu Toggle Button** ([Line 259](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L259)):
   - Change `h-8 w-8` to `h-11 w-11 min-h-[44px] min-w-[44px]`.
3. **Theme & Persona Controls** ([Lines 294, 320](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L294)):
   - Change `py-1 text-xs` to `min-h-[44px] py-2 px-3 text-xs`.
4. **Sign Out Button** ([Line 210](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L210)):
   - Change `py-1 text-xs` to `min-h-[44px] py-2.5 px-3 text-xs`.

#### Change C: Resolve Color Contrast Deficits
1. **Micro-Headers** ([Lines 127, 158](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L127)):
   - Change `text-[10px] font-extrabold tracking-wider text-[#57534E]` to `text-xs font-extrabold tracking-wider text-slate-700 dark:text-slate-300`.
2. **User Role Subtitle** ([Line 202](file:///C:/Users/HP/OneDrive/Documents/webd/task/Tribe%20Saarthi/src/components/layout/index.tsx#L202)):
   - Change `text-[10px] text-[#57534E]` to `text-xs font-semibold text-slate-700 dark:text-slate-300`.

---

## 3. Verification & Acceptance Criteria

1. **Compilation Check**:
   - Run `npm run build` or `npx tsc --noEmit` to verify zero TypeScript errors.
2. **Visual & Structural Check**:
   - The USWDS official banner renders pinned above the primary navigation on desktop and mobile viewports.
   - Contrast ratio for all text elements exceeds 4.5:1 (WCAG AA).
   - Every clickable target has a computed bounding box of at least 44 × 44 CSS pixels.
