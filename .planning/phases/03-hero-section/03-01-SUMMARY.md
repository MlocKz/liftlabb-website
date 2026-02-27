---
phase: 03-hero-section
plan: 01
subsystem: ui
tags: [motion, react, animation, hero, cta, css-mockup, tailwind-v4]

# Dependency graph
requires:
  - phase: 01-project-scaffold-design-system
    provides: "Tailwind v4 design tokens, globals.css, lib/content.ts siteConfig, Motion library"
provides:
  - "Hero section component with headline, CTAs, phone mockup, stagger animation, radial glow"
  - "Self-contained Hero export ready for page integration"
affects: [04-features-section, 06-footer, 02-navbar]

# Tech tracking
tech-stack:
  added: []
  patterns: [motion-variant-stagger, css-phone-mockup, radial-glow-bg, 100dvh-viewport]

key-files:
  created:
    - components/Hero.tsx
  modified: []

key-decisions:
  - "Used staggerChildren (number) instead of stagger() function for variant orchestration -- stagger() is for imperative animate() API, not declarative variants"
  - "Skipped page.tsx modification per user instruction -- Hero is self-contained export for later integration"
  - "Used as const on ease value to satisfy Motion TypeScript strict typing"

patterns-established:
  - "Motion variant stagger pattern: containerVariants with staggerChildren + itemVariants with opacity/y"
  - "CSS-drawn phone mockup pattern: border-based frame with absolute positioned notch and buttons"
  - "Radial glow pattern: absolute div with bg-accent/10 blur-[120px] rounded-full"
  - "CTA button patterns: pill (bg-accent rounded-full) and ghost (border border-border rounded-full)"

requirements-completed: [HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06, HERO-07]

# Metrics
duration: 2min
completed: 2026-02-27
---

# Phase 3 Plan 1: Hero Section Summary

**Full-viewport hero with staggered Motion entrance animation, CSS phone mockup, dual CTAs, and radial green glow background**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-27T05:26:54Z
- **Completed:** 2026-02-27T05:29:15Z
- **Tasks:** 1 (Task 2 skipped per user instruction)
- **Files modified:** 1

## Accomplishments
- Hero section component with h1 headline from siteConfig.tagline and description from siteConfig.description
- Staggered fade-up animation using Motion variants (containerVariants orchestrates staggerChildren, itemVariants animate opacity+y)
- Primary "Get Started Free" green pill CTA linking to app.liftlabb.ca, secondary "See Features" ghost outline CTA anchoring to #features
- CSS-drawn phone mockup with dark bezel, notch, volume/power buttons, and placeholder screen
- Radial green glow background layer using blurred absolute div (bg-accent/10 blur-[120px])
- Responsive layout: stacked on mobile, two-column on desktop, 100dvh viewport height

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hero component with layout, CTAs, phone mockup, animation, and glow** - `a402be7` (feat)

**Task 2 (page.tsx update):** Skipped per user instruction -- user will handle page integration after all phases complete.

## Files Created/Modified
- `components/Hero.tsx` - Full hero section: layout, headline, CTAs, phone mockup, stagger animation, radial glow (114 lines)

## Decisions Made
- Used `staggerChildren: 0.15` on container variant transition instead of `delayChildren: stagger(0.15)` -- the `stagger()` function returns `(i, total) => delay` which is designed for the imperative `animate()` API, not declarative variant orchestration
- Added `as const` assertion on ease string literal to satisfy Motion's strict TypeScript Easing type
- Did not modify page.tsx per explicit user override of plan Task 2

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Motion variant stagger API usage**
- **Found during:** Task 1 (Hero component creation)
- **Issue:** Plan specified `delayChildren: stagger(0.15)` but `stagger()` returns a function for the imperative API, not a value for variant transitions
- **Fix:** Used `staggerChildren: 0.15` which is the correct variant orchestration property (still fully supported in Motion v12)
- **Files modified:** components/Hero.tsx
- **Verification:** Build passes, animation stagger works correctly
- **Committed in:** a402be7

**2. [Rule 1 - Bug] Fixed Motion TypeScript ease type error**
- **Found during:** Task 1 (build verification)
- **Issue:** `ease: "easeOut"` typed as `string` not assignable to Motion's `Easing` type
- **Fix:** Added `as const` assertion: `ease: "easeOut" as const`
- **Files modified:** components/Hero.tsx
- **Verification:** `npx next build` passes with zero errors
- **Committed in:** a402be7

---

**Total deviations:** 2 auto-fixed (2 bug fixes)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero component is a self-contained export ready for page.tsx integration
- "See Features" CTA links to #features which will be provided by Phase 4 (Features section)
- Phone mockup placeholder ready for real app screenshot in v2
- Motion variant stagger pattern established for reuse in other animated sections

## Self-Check: PASSED

- FOUND: components/Hero.tsx
- FOUND: commit a402be7
- FOUND: .planning/phases/03-hero-section/03-01-SUMMARY.md

---
*Phase: 03-hero-section*
*Completed: 2026-02-27*
