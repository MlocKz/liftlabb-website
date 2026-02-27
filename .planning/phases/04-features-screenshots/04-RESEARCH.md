# Phase 4: Features & Screenshots - Research

**Researched:** 2026-02-27
**Domain:** Responsive card grids, scroll-triggered stagger animations, horizontal scroll galleries, CSS phone mockups
**Confidence:** HIGH

## Summary

Phase 4 builds two distinct sections: a 6-card feature grid and a horizontal screenshot gallery. Both are well-trodden patterns in the existing stack (Tailwind v4 grid + Motion stagger animations + CSS scroll-snap). The project already has the content data (`lib/content.ts` with 6 features including icon string identifiers), the Motion library installed (v12.34.3), and a proven animation pattern (`TestAnimation.tsx` using `whileInView`).

The key technical decisions are: (1) use Tailwind v4's `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for the responsive grid, (2) use Motion's `stagger()` function with variants and `whileInView` for staggered entrance, (3) use arbitrary Tailwind shadow values for the green glow hover effect, (4) use CSS `scroll-snap-type: x mandatory` for the mobile screenshot gallery, and (5) draw phone frames with pure CSS (border, border-radius, aspect-ratio).

**Primary recommendation:** Build the Features section as a client component with Motion variants for stagger, and the Screenshots section as a separate client component with CSS-only horizontal scrolling (no JS scroll library needed). Use inline SVG components for the 6 feature icons (no external icon library).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FEAT-01 | Section header "Everything you need to train smarter" | Standard h2 with design tokens -- trivial |
| FEAT-02 | 6-card responsive grid (3x2 desktop, 2x3 tablet, 1-col mobile) | Tailwind `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` -- verified pattern |
| FEAT-03 | Each card has icon, title, and description | Content data exists in `lib/content.ts`; inline SVG icon map pattern documented |
| FEAT-04 | Card styling with dark background, border, hover glow/lift effect | Tailwind arbitrary shadow `shadow-[0_0_20px_rgba(74,222,128,0.3)]` + `hover:-translate-y-1` |
| FEAT-05 | Staggered scroll-triggered entrance animation using Motion | `stagger()` + variants + `whileInView` -- verified in node_modules |
| SCRN-01 | Section header "See it in action" | Standard h2 with design tokens -- trivial |
| SCRN-02 | Horizontal scrolling gallery or staggered layout | CSS `scroll-snap-type: x mandatory` with `overflow-x: auto` |
| SCRN-03 | CSS-drawn phone frame mockups for each screenshot | Pure CSS: border, border-radius, aspect-ratio 9/19.5, notch pseudo-element |
| SCRN-04 | Placeholder images labeled with screen names | Colored rectangles with centered text labels |
| SCRN-05 | Smooth scroll/swipe on mobile | `scroll-behavior: smooth` + `scroll-snap-type: x mandatory` + `-webkit-overflow-scrolling: touch` |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.34.3 | Scroll-triggered stagger animations | Already installed; `stagger()` + variants + `whileInView` is the blessed pattern |
| tailwindcss | ^4 | Responsive grid, hover effects, spacing | Already configured with CSS-first `@theme` tokens |
| next | 15.5.12 | App Router, React Server Components | Already scaffolded |
| react | 19.1.0 | Component rendering | Already installed |

### Supporting (no new dependencies)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Inline SVGs | N/A | Feature card icons | 6 simple icons, no library needed |
| CSS scroll-snap | Native CSS | Horizontal gallery snapping | Built into all modern browsers |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVGs | lucide-react | Adds ~50KB dependency for 6 icons; not worth it |
| CSS scroll-snap | embla-carousel | Adds JS dependency for something CSS handles natively |
| Pure CSS phone frame | devices.css library | Adds dependency; we only need one simple frame shape |

**Installation:**
```bash
# No new dependencies needed -- everything is already in the project
```

## Architecture Patterns

### Recommended Component Structure
```
components/
  Features.tsx          # "use client" -- Motion stagger needs client
  FeatureCard.tsx       # Individual card (can be in same file or separate)
  FeatureIcon.tsx       # SVG icon map component
  Screenshots.tsx       # "use client" -- scroll interaction
  PhoneMockup.tsx       # CSS phone frame wrapper
```

### Pattern 1: Motion Stagger with Variants and whileInView
**What:** Parent container defines stagger timing; children inherit animation via variant propagation.
**When to use:** Any grid/list where items should animate in sequence on scroll.

```tsx
// Source: Verified against motion-dom v12 types + official docs pattern
"use client"
import { motion, stagger } from "motion/react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),  // Modern API (staggerChildren is deprecated)
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export function Features() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {features.map((feature) => (
        <motion.div key={feature.title} variants={itemVariants}>
          {/* card content */}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

**Key details verified in source:**
- `stagger(duration, options?)` returns a `DynamicOption<number>` -- confirmed in `motion-dom/dist/index.d.ts:3385`
- `stagger` is exported from `motion/react` -- confirmed via `node -e "require('motion/react').stagger"`
- `staggerChildren: number` still works but is **deprecated** per types: "Use `delayChildren: stagger(interval)` instead"
- `whileInView` triggers variant propagation to children automatically -- same pattern as existing `TestAnimation.tsx`

### Pattern 2: Responsive Grid (3x2 / 2x3 / 1x6)
**What:** Tailwind mobile-first responsive grid.
**When to use:** The feature card layout.

```tsx
// Source: Tailwind v4 docs -- grid-template-columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 6 cards: mobile=1col, tablet(768px+)=2col, desktop(1024px+)=3col */}
</div>
```

**Breakpoints (Tailwind v4 defaults, unchanged from v3):**
- `sm`: 640px
- `md`: 768px (tablet -- 2 columns)
- `lg`: 1024px (desktop -- 3 columns)

### Pattern 3: Hover Glow + Lift Effect
**What:** Dark card with green glow on hover, slight upward translation.
**When to use:** Feature cards.

```tsx
// Source: Tailwind v4 docs -- box-shadow arbitrary values
<div className="
  bg-card border border-border rounded-card p-6
  transition-all duration-300
  hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
  hover:-translate-y-1
  hover:border-accent/50
">
```

**Design token references (from globals.css @theme):**
- `bg-card` = `#1a1a1a`
- `border-border` = `#333333`
- `rounded-card` = `12px`
- Accent green = `#4ade80` (used in glow rgba: 74, 222, 128)

**Performance note (PERF-03):** `transform` (translate) and `opacity` are GPU-accelerated. `box-shadow` is NOT GPU-accelerated but is acceptable for hover-only (not animated continuously). Use `transition-all` which covers both transform and shadow in one declaration.

### Pattern 4: CSS Horizontal Scroll Gallery with Snap
**What:** Horizontal scrolling container with snap points for phone mockups.
**When to use:** Screenshots section, especially on mobile.

```tsx
// Source: MDN scroll-snap-type docs + CSS-Tricks patterns
<div className="
  flex gap-6 overflow-x-auto snap-x snap-mandatory
  scroll-smooth pb-4
  [-webkit-overflow-scrolling:touch]
  [scrollbar-width:none]
  [&::-webkit-scrollbar]:hidden
">
  {screenshots.map((screenshot) => (
    <div key={screenshot.name} className="snap-center shrink-0">
      <PhoneMockup>
        <Placeholder label={screenshot.name} />
      </PhoneMockup>
    </div>
  ))}
</div>
```

**Key Tailwind v4 classes:**
- `snap-x` = `scroll-snap-type: x var(--tw-scroll-snap-strictness)`
- `snap-mandatory` = sets `--tw-scroll-snap-strictness: mandatory`
- `snap-center` = `scroll-snap-align: center`
- `scroll-smooth` = `scroll-behavior: smooth`
- `shrink-0` = `flex-shrink: 0` (prevents items from collapsing)
- `overflow-x-auto` = shows scrollbar when needed

**Desktop layout option:** On large screens, the gallery can either continue scrolling or switch to a centered flex layout. Recommend keeping horizontal scroll on all sizes for consistency, but constraining the container width.

### Pattern 5: CSS Phone Frame Mockup
**What:** Pure CSS phone outline with notch, matching the hero mockup pattern.
**When to use:** Wrapping screenshot placeholders.

```tsx
// Source: CSS iPhone mockup patterns (CodePen, devices.css concepts)
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[260px] rounded-[36px] border-[3px] border-border bg-card overflow-hidden"
         style={{ aspectRatio: "9 / 19.5" }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-bg rounded-b-2xl z-10" />
      {/* Screen content */}
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  )
}
```

**Sizing:**
- Width: 260px (good for gallery items, not too large)
- Aspect ratio: 9/19.5 (modern phone proportions, ~iPhone 14/15)
- Border-radius: 36px (matches modern phone curves)
- Notch: centered pill at top, same bg as page background

### Pattern 6: Inline SVG Icon Map
**What:** Map feature icon strings from content.ts to inline SVG components.
**When to use:** Feature cards need icons; content.ts has string identifiers.

```tsx
// Map icon string identifiers from lib/content.ts to SVG paths
const iconMap: Record<string, React.ReactNode> = {
  "dumbbell": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className="w-8 h-8">
      <path d="M6.5 6.5h11M6.5 17.5h11M2 12h20M4 8v8M8 6v12M16 6v12M20 8v8" />
    </svg>
  ),
  "clipboard-list": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className="w-8 h-8">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
    </svg>
  ),
  "trending-up": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className="w-8 h-8">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  "library": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className="w-8 h-8">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6v7M9 13h6" />
    </svg>
  ),
  "refresh-cw": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className="w-8 h-8">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  "zap": (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         className="w-8 h-8">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
}

function FeatureIcon({ name }: { name: string }) {
  return (
    <div className="text-accent mb-4">
      {iconMap[name] ?? <span className="text-2xl">*</span>}
    </div>
  )
}
```

**Why inline SVGs:**
- The 6 icons are simple line-art (Lucide-style paths)
- Zero runtime dependency
- Full control over color via `currentColor` + Tailwind `text-accent`
- SVG paths are standard Lucide icon paths (24x24 viewBox, stroke-based)
- Total overhead: ~2KB of SVG markup (far less than any icon library)

### Anti-Patterns to Avoid
- **Installing an icon library for 6 icons:** lucide-react, heroicons, or react-icons add unnecessary bundle weight for such a small icon set.
- **Using JavaScript scroll libraries for horizontal scroll:** CSS scroll-snap handles this natively; no need for embla-carousel or swiper.
- **Animating box-shadow continuously:** Box-shadow is not GPU-accelerated. Only animate it on hover (state change), never as a scroll-triggered animation.
- **Using `animate` instead of `whileInView` for scroll animations:** The `whileInView` prop with variants is the idiomatic Motion pattern for scroll-triggered animations. Using `animate` + `useInView` is more verbose for the same result.
- **Forgetting `"use client"` on Motion components:** Motion hooks and animation props require client-side rendering. Every component using `<motion.div>` must have the `"use client"` directive.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered animations | IntersectionObserver + manual state | Motion `whileInView` + variants | Handles enter/exit, thresholds, once behavior |
| Staggered timing | Manual delay calculation per child | Motion `stagger()` function | Handles from-center, from-last, startDelay |
| Horizontal scroll snapping | JS touch event handlers | CSS `scroll-snap-type: x mandatory` | Native performance, no JS overhead |
| Responsive grid | CSS media queries + manual breakpoints | Tailwind `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | Consistent, tested breakpoints |
| Phone mockup images | PNG/SVG phone frames | Pure CSS borders + border-radius | Scalable, theme-consistent, no image loading |

**Key insight:** This phase has zero novel problems. Every requirement maps to a well-established pattern in the existing stack. The risk is over-engineering, not under-engineering.

## Common Pitfalls

### Pitfall 1: Stagger Not Working (Silent Failure)
**What goes wrong:** Cards all animate at once instead of staggering.
**Why it happens:** Missing variant propagation. The parent `motion.div` must use `variants` with `initial` and `whileInView` string labels, AND each child must also have `variants` with matching label names. If you put `animate` directly on children instead of using variants, stagger won't work.
**How to avoid:** Always use the container/item variants pattern. The parent defines `containerVariants` with `staggerChildren` or `delayChildren: stagger()`. Children define `itemVariants`. Both use the same label names ("hidden"/"visible").
**Warning signs:** All items appearing simultaneously despite stagger config.

### Pitfall 2: Scroll-Snap Not Snapping on iOS Safari
**What goes wrong:** Horizontal gallery scrolls freely without snapping on iOS.
**Why it happens:** Missing `-webkit-overflow-scrolling: touch` or incorrect scroll-snap-type. Also, `scroll-snap-type: x proximity` can feel like no snapping on fast swipes.
**How to avoid:** Use `snap-mandatory` (not `snap-proximity`). Add `-webkit-overflow-scrolling: touch` as an arbitrary Tailwind class. Test on actual iOS device or simulator.
**Warning signs:** Gallery scrolls but doesn't "land" on items.

### Pitfall 3: Phone Mockup Overflow Clipping
**What goes wrong:** Content inside the phone frame bleeds outside the rounded corners.
**Why it happens:** Child content not respecting parent's `overflow-hidden` with large border-radius.
**How to avoid:** Apply `overflow-hidden` on the phone frame container AND ensure the inner content div fills the frame completely. Use `rounded-[36px]` on the outer container with matching inner rounding.
**Warning signs:** Square corners visible on placeholder content inside rounded phone frame.

### Pitfall 4: Grid Gap Causes Layout Shift at Breakpoints
**What goes wrong:** Cards jump or reflow awkwardly when transitioning between breakpoints.
**Why it happens:** Different gap sizes at different breakpoints, or cards with inconsistent heights.
**How to avoid:** Use a consistent `gap-6` across all breakpoints. Ensure all cards have the same minimum height or let content flow naturally. Do NOT set fixed card heights.
**Warning signs:** Cards "jumping" when resizing browser window near breakpoint boundaries.

### Pitfall 5: Motion Re-Renders on Every Scroll
**What goes wrong:** Performance issues from Motion recalculating on every scroll event.
**Why it happens:** Missing `viewport={{ once: true }}` on the container's `whileInView`.
**How to avoid:** Always include `once: true` in the viewport config. The entrance animation should play once and stay. This also prevents stagger from re-triggering on scroll.
**Warning signs:** Animations replaying when scrolling back up to the section.

### Pitfall 6: Hover Effects on Mobile (Ghost Hovers)
**What goes wrong:** On mobile, tapping a card triggers the hover glow and it stays visible until the user taps elsewhere.
**Why it happens:** Mobile browsers translate touch events to hover states.
**How to avoid:** Use `@media (hover: hover)` to limit hover effects to devices with actual hover capability. In Tailwind v4, this is done with arbitrary media query or by accepting the minor visual quirk (the glow will dismiss on next tap).
**Warning signs:** Cards stuck in hover state on mobile after tapping.

## Code Examples

### Complete Feature Card Component
```tsx
// Source: Combining verified patterns from Motion docs + Tailwind v4 docs
"use client"
import { motion, stagger } from "motion/react"
import { features } from "@/lib/content"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.1),
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Everything you need to train smarter
        </h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="
                bg-card border border-border rounded-card p-6
                transition-all duration-300
                hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
                hover:-translate-y-1
                hover:border-accent/50
              "
            >
              <FeatureIcon name={feature.icon} />
              <h3 className="text-lg font-bold text-text mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

### Complete Horizontal Screenshot Gallery
```tsx
// Source: MDN scroll-snap + CSS phone mockup patterns
"use client"

const screenshots = [
  { name: "Today View", color: "#1a3a2a" },
  { name: "Program Builder", color: "#1a2a3a" },
  { name: "Charts", color: "#2a1a3a" },
  { name: "Exercise Library", color: "#3a2a1a" },
  { name: "Workout Log", color: "#1a3a3a" },
]

function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-[260px] shrink-0 rounded-[36px] border-[3px] border-border bg-card overflow-hidden"
      style={{ aspectRatio: "9 / 19.5" }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-bg rounded-b-2xl z-10" />
      {/* Content */}
      <div className="w-full h-full">{children}</div>
    </div>
  )
}

export function Screenshots() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          See it in action
        </h2>
        <div
          className="
            flex gap-6 overflow-x-auto snap-x snap-mandatory
            scroll-smooth pb-4 px-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {screenshots.map((s) => (
            <div key={s.name} className="snap-center shrink-0 first:ml-auto last:mr-auto">
              <PhoneMockup>
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: s.color }}
                >
                  <span className="text-text/70 text-sm font-medium">{s.name}</span>
                </div>
              </PhoneMockup>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Screenshot Data for lib/content.ts
```typescript
// Add to lib/content.ts
export interface Screenshot {
  name: string
  color: string  // Placeholder background color
}

export const screenshots: Screenshot[] = [
  { name: "Today View", color: "#1a3a2a" },
  { name: "Program Builder", color: "#1a2a3a" },
  { name: "Charts", color: "#2a1a3a" },
  { name: "Exercise Library", color: "#3a2a1a" },
  { name: "Workout Log", color: "#1a3a3a" },
]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `staggerChildren: 0.1` in transition | `delayChildren: stagger(0.1)` | motion-dom v12+ | Old still works (deprecated), new is recommended |
| `framer-motion` package | `motion` package (imports from `motion/react`) | 2024 rebrand | Same API, new package name; this project already uses `motion` |
| JS scroll libraries (Swiper, Embla) | CSS scroll-snap | 2020+ browser support | Native CSS, zero-JS, full browser support |
| Image-based phone mockups | Pure CSS phone frames | Always available | Scalable, theme-consistent, no image loading |

**Deprecated/outdated:**
- `staggerChildren` / `staggerDirection` transition props: Still functional but deprecated. Use `delayChildren: stagger(interval, options)` instead.
- `framer-motion` import path: The `motion` npm package now re-exports from `framer-motion` internally but the canonical import is `from "motion/react"`.

## Open Questions

1. **Screenshot content: How many screenshots and which screens?**
   - What we know: SCRN-04 mentions "Today View, Program Builder, Charts, etc." -- at least 4-5 screens
   - What's unclear: The exact list and whether more screens should be included
   - Recommendation: Start with 5 placeholder screens (Today View, Program Builder, Charts, Exercise Library, Workout Log). These can be swapped for real screenshots in v2.

2. **Desktop screenshot layout: Keep horizontal scroll or switch to grid?**
   - What we know: SCRN-02 says "horizontal scrolling gallery or staggered layout"
   - What's unclear: Whether horizontal scroll should persist on desktop or convert to a different layout
   - Recommendation: Keep horizontal scroll on all screen sizes. On desktop, center the gallery and make phone mockups slightly larger. This is simpler and more visually distinctive than a grid of phones.

3. **Phone frame consistency with hero mockup (Phase 3)?**
   - What we know: HERO-05 creates a phone mockup frame for the hero section
   - What's unclear: Whether the hero and screenshots phone frames should share the same component
   - Recommendation: Create a shared `PhoneMockup` component that both sections can use. Pass different widths via props. This ensures visual consistency.

## Sources

### Primary (HIGH confidence)
- `motion-dom/dist/index.d.ts` line 3385 - `stagger()` function signature verified locally
- `motion-dom/dist/index.d.ts` lines 1782-1802 - `delayChildren`, `staggerChildren` (deprecated) types verified
- `motion/react` exports - verified via `node -e "require('motion/react').stagger"` returning function
- Tailwind CSS v4 docs (tailwindcss.com/docs/grid-template-columns) - grid-cols responsive pattern
- Tailwind CSS v4 docs (tailwindcss.com/docs/box-shadow) - arbitrary shadow syntax `shadow-[value]`
- MDN scroll-snap-type docs (developer.mozilla.org) - CSS scroll snap specification
- Existing project code: `components/TestAnimation.tsx` - proven `whileInView` pattern
- Existing project code: `lib/content.ts` - feature data structure with icon string identifiers
- Existing project code: `app/globals.css` - `@theme` design tokens (colors, radius)

### Secondary (MEDIUM confidence)
- [Motion stagger docs](https://motion.dev/docs/stagger) - Official docs (page content not extractable via fetch, but API confirmed via local node_modules)
- [Motion variants tutorial](https://motion.dev/tutorials/react-variants) - Official tutorial for variant pattern
- [Motion transitions docs](https://motion.dev/docs/react-transitions) - Official docs for orchestration
- [CSS-Tricks scroll snap](https://css-tricks.com/practical-css-scroll-snapping/) - Verified scroll-snap patterns
- [MDN scroll-snap guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap) - Official CSS specification reference

### Tertiary (LOW confidence)
- None -- all findings verified against local source code or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and verified in node_modules
- Architecture: HIGH - Patterns verified against library source types and existing project code
- Pitfalls: HIGH - Common issues well-documented across multiple sources, verified against API types
- Code examples: HIGH - Built from verified API types + existing project patterns (TestAnimation.tsx, globals.css tokens)

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (stable -- no fast-moving dependencies)
