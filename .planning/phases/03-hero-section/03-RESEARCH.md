# Phase 3: Hero Section - Research

**Researched:** 2026-02-27
**Domain:** Hero section with animated entrance, CSS phone mockup, radial gradient glow, CTAs
**Confidence:** HIGH

## Summary

Phase 3 builds the above-the-fold hero section for the LiftLabb marketing site. The hero needs a two-column layout (text left, phone mockup right) that stacks on mobile, with a staggered Motion entrance animation and a radial green glow background effect. All building blocks exist in the current codebase: the Motion library (v12.34.3) is installed, the design tokens are configured in Tailwind v4 `@theme`, and the content data (`siteConfig.tagline`, `siteConfig.description`, `siteConfig.appUrl`) lives in `lib/content.ts`.

The phone mockup must be CSS-drawn (not an image of a phone frame) using Tailwind utility classes for the border, rounded corners, notch, and side buttons. The Flowbite/Themesberg pattern is the standard approach: a `div` with `border-[14px]`, `rounded-[2.5rem]`, absolute-positioned side button divs, and a centered notch div. The content area inside holds a placeholder image (or colored div) that will be swapped for a real screenshot later.

The Motion stagger API has been updated: `staggerChildren` on transition is deprecated in favor of `delayChildren: stagger(interval)`. The `stagger` function is confirmed exported from the installed `motion` package (verified in `node_modules`). The hero animation pattern uses Motion variants with a parent container controlling stagger timing and child elements defining their hidden/visible states.

**Primary recommendation:** Build the hero as a single `"use client"` component (`components/Hero.tsx`) using flexbox with `flex-col lg:flex-row` for responsive layout, Motion variants with `stagger()` for orchestrated entrance, CSS-drawn phone mockup with Tailwind utilities, and a pseudo-element or background-image radial gradient for the green glow.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-01 | Headline "Track your gains. Ditch the spreadsheet." prominently displayed | Content exists in `siteConfig.tagline` in `lib/content.ts`. Use as `<h1>` for SEO. |
| HERO-02 | Subtext describing what LiftLabb does in one line | Content exists in `siteConfig.description` in `lib/content.ts`. |
| HERO-03 | Primary CTA "Get Started Free" linking to `https://app.liftlabb.ca` | Use `<a>` tag (external link, not `<Link>`). URL from `siteConfig.appUrl`. |
| HERO-04 | Secondary CTA "See Features" smooth-scrolling to features section | Use `<a href="#features">` with CSS `scroll-behavior: smooth` already in globals.css. Add `scroll-mt-20` to target section. |
| HERO-05 | Phone mockup frame (placeholder image, swappable later) | CSS-drawn phone frame using Tailwind utilities (border, rounded corners, absolute buttons, notch). See Phone Mockup section. |
| HERO-06 | Animated entrance (fade-up + scale) using Motion | Motion variants with `stagger()` for orchestrated child animations. See Animation Patterns section. |
| HERO-07 | Radial gradient green glow background effect | CSS `radial-gradient()` using accent green with low opacity. See Radial Gradient Glow section. |
</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.34.3 | Entrance animations, stagger orchestration | Already installed. `stagger()` function confirmed in node_modules. Import from `motion/react`. |
| next | 15.5.12 | Framework, App Router | Already installed. |
| tailwindcss | 4.x | Utility-first styling, phone mockup frame | Already installed. CSS-first `@theme` config. |

### Supporting (no new installs needed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | built-in | Placeholder screenshot inside phone mockup | Use with `priority` prop since hero is above-the-fold. |
| lib/content.ts | N/A | Headline, description, appUrl | Import `siteConfig` for all hero text content. |

### No New Dependencies

This phase requires zero new package installs. Everything needed is already in the project.

## Architecture Patterns

### Recommended Component Structure

```
components/
  Hero.tsx          # "use client" -- single file, ~120 lines
```

The hero is a single Client Component. No sub-components needed -- the phone mockup, CTAs, and text are all part of one cohesive section. Extracting `PhoneMockup` or `CTAButton` would be premature abstraction for a marketing page with one hero section.

### Pattern 1: Two-Column Responsive Hero Layout

**What:** Text content on the left, phone mockup on the right. Stacks vertically on mobile (text first, phone below).

**When to use:** Hero sections with both text and a visual element.

**Implementation:**

```tsx
<section className="relative min-h-screen flex items-center overflow-hidden">
  {/* Radial gradient glow (background layer) */}
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-[800px] h-[600px] rounded-full
                    bg-accent/10 blur-[120px]" />
  </div>

  {/* Content grid */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32
                  flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
    {/* Text column */}
    <div className="flex-1 text-center lg:text-left">
      <h1>...</h1>
      <p>...</p>
      <div>{/* CTAs */}</div>
    </div>

    {/* Phone mockup column */}
    <div className="flex-1 flex justify-center">
      {/* Phone frame */}
    </div>
  </div>
</section>
```

**Key responsive behaviors:**
- `flex-col lg:flex-row` -- stacks on mobile, side-by-side on desktop (1024px+)
- `text-center lg:text-left` -- centered text on mobile, left-aligned on desktop
- `items-center` -- vertical centering on both layouts
- `gap-12 lg:gap-16` -- responsive spacing between columns

### Pattern 2: Motion Staggered Entrance with Variants

**What:** Parent container orchestrates staggered child animations using the `stagger()` function.

**When to use:** Hero entrance where headline, subtext, CTAs, and phone mockup animate in sequence.

**IMPORTANT: `staggerChildren` is deprecated.** The type definitions in `motion-dom` mark `staggerChildren` as deprecated with the note: "Use `delayChildren: stagger(interval)` instead." The `stagger()` function is confirmed exported from the `motion` package (verified in installed node_modules).

**Implementation:**

```tsx
"use client"
import { motion, stagger } from "motion/react"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.15),
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function Hero() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 variants={itemVariants}>
        Track your gains. Ditch the spreadsheet.
      </motion.h1>
      <motion.p variants={itemVariants}>
        The workout tracker built for lifters...
      </motion.p>
      <motion.div variants={itemVariants}>
        {/* CTA buttons */}
      </motion.div>
      <motion.div variants={itemVariants}>
        {/* Phone mockup */}
      </motion.div>
    </motion.section>
  )
}
```

**How variants work:**
1. Parent `motion.section` starts in `"hidden"` state, then transitions to `"visible"`
2. The `delayChildren: stagger(0.15)` on the parent's `visible` transition adds 0.15s between each child's animation start
3. Each child with `variants={itemVariants}` automatically inherits the parent's variant state
4. Children define their own `hidden` and `visible` states (opacity + y transform)
5. Result: headline appears first, then subtext 0.15s later, then CTAs 0.3s later, then phone 0.45s later

**stagger() API (from node_modules):**

```typescript
declare function stagger(
  duration?: number,            // seconds between each child (default: 0.1)
  options?: {
    startDelay?: number,        // delay before first child starts
    from?: StaggerOrigin,       // "first" | "last" | "center" | number
    ease?: Easing,              // easing for delay distribution
  }
): DynamicOption<number>
```

### Pattern 3: CSS-Drawn Phone Mockup Frame

**What:** A phone-shaped CSS frame built with Tailwind utility classes -- border for the bezel, rounded corners for the screen, absolute-positioned divs for side buttons and notch.

**When to use:** Displaying app screenshots in a realistic device frame without loading a phone image.

**Implementation (adapted from Flowbite/Themesberg pattern for dark theme):**

```tsx
{/* Phone frame - outer shell */}
<div className="relative mx-auto border-[14px] border-card-2 bg-card-2
                rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
  {/* Notch */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2
                  w-[148px] h-[18px] bg-card-2 rounded-b-[1rem]" />

  {/* Volume buttons (left side) */}
  <div className="absolute -left-[17px] top-[124px]
                  h-[46px] w-[3px] bg-card-2 rounded-l-lg" />
  <div className="absolute -left-[17px] top-[178px]
                  h-[46px] w-[3px] bg-card-2 rounded-l-lg" />

  {/* Power button (right side) */}
  <div className="absolute -right-[17px] top-[142px]
                  h-[64px] w-[3px] bg-card-2 rounded-r-lg" />

  {/* Screen content area */}
  <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-bg">
    {/* Placeholder - swap for Image component later */}
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-muted text-sm">App Screenshot</p>
    </div>
  </div>
</div>
```

**Design token mapping:**
- `border-card-2` (`#222222`) -- dark phone bezel, subtle against `#0a0a0a` bg
- `bg-card-2` -- same color for notch and buttons
- `bg-bg` (`#0a0a0a`) -- screen area matches page background for seamless feel
- `rounded-[2.5rem]` -- iPhone-like super-rounded corners
- `border-[14px]` -- realistic bezel width

**Sizing considerations:**
- Fixed dimensions (`h-[600px] w-[300px]`) at desktop, scale down on mobile
- Use `scale-75 sm:scale-90 lg:scale-100` for responsive sizing, or reduce the absolute pixel values
- The 300x600 aspect ratio (1:2) approximates modern smartphones

### Pattern 4: Radial Gradient Green Glow Background

**What:** A large, soft radial gradient using the accent green color at low opacity, positioned behind the hero content to create an ambient glow effect.

**When to use:** Dark theme hero sections needing visual depth without adding content weight.

**Implementation options:**

**Option A: Blurred absolute div (recommended -- simpler, more controllable):**

```tsx
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[800px] h-[600px] rounded-full
                bg-accent/10 blur-[120px]"
     aria-hidden="true" />
```

- `bg-accent/10` -- accent green at 10% opacity (very subtle)
- `blur-[120px]` -- large blur radius creates soft glow spread
- Absolutely positioned, centered in the hero section
- `pointer-events-none` on parent to prevent click interference

**Option B: CSS radial-gradient on background:**

```tsx
<section
  className="relative min-h-screen"
  style={{
    background: `radial-gradient(ellipse 60% 50% at 50% 50%,
      rgba(74, 222, 128, 0.12) 0%,
      rgba(74, 222, 128, 0.04) 40%,
      transparent 70%)`
  }}
>
```

- Uses `rgba(74, 222, 128, ...)` which is `#4ade80` (accent green) at varying opacities
- Ellipse shape with explicit size control
- Fades from ~12% opacity center to transparent edge

**Option C: Tailwind v4 custom utility in globals.css:**

```css
@utility hero-glow {
  background: radial-gradient(
    ellipse 60% 50% at 50% 50%,
    oklch(from var(--color-accent) l c h / 0.12) 0%,
    oklch(from var(--color-accent) l c h / 0.04) 40%,
    transparent 70%
  );
}
```

Then use as: `<section className="hero-glow">`.

**Recommendation: Use Option A (blurred div).** It is simpler to position, easier to tweak (just change opacity and blur values), and performs well since it is a single static element. The blur filter is applied once at paint time (not animated), so there is no ongoing GPU cost.

### Pattern 5: Smooth Scroll for "See Features" CTA

**What:** The "See Features" button scrolls smoothly to the `#features` section.

**Implementation:**

```tsx
<a href="#features" className="...styles...">
  See Features
</a>
```

This works because `globals.css` already has `scroll-behavior: smooth` on `html`. No JavaScript needed.

**Important:** Use `<a>` not `<Link>` from `next/link`. The `<Link>` component performs client-side routing and may interfere with smooth scroll behavior. This is documented in the project pitfalls research (Pitfall 8).

**Navbar offset:** The Features section (built in Phase 4) will need `scroll-mt-20` (80px offset) or equivalent to account for the sticky navbar. This is Phase 4's responsibility, but the anchor `href="#features"` must match the target section's `id="features"`.

### Anti-Patterns to Avoid

- **Extracting sub-components prematurely:** Do not create `PhoneMockup.tsx`, `HeroCTA.tsx`, `HeroHeadline.tsx`. One `Hero.tsx` file is sufficient for a single hero section. Extract only if the phone mockup is reused (it will be reused in Phase 4 Screenshots, but that can be extracted then).
- **Using `<Link>` for anchor scroll:** Use plain `<a href="#features">` for in-page smooth scrolling.
- **Animating layout properties:** Hero animation must use only `transform` (y, scale) and `opacity`. Never animate `height`, `width`, `margin`, `padding`, or `top/left` -- these trigger reflow. This satisfies PERF-03.
- **Using `staggerChildren` (deprecated):** Use `delayChildren: stagger(0.15)` instead.
- **Forgetting `"use client"` directive:** The Hero component uses Motion and must be a Client Component. Without it, Motion's `animate` prop will fail silently in a Server Component.
- **Making the glow animated:** The radial gradient glow should be a static background effect, not animated. Animating blur or large gradients is expensive and unnecessary.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Entrance animation orchestration | Manual `setTimeout` chains or CSS `animation-delay` per element | Motion variants with `stagger()` | Variants automatically cascade to children. Manual delays are brittle and hard to adjust. |
| Phone mockup frame | SVG phone outline or loaded phone image | CSS border + rounded corners + absolute buttons | Flowbite pattern is proven, lightweight, and uses existing Tailwind utilities. |
| Smooth scroll | JavaScript `scrollIntoView()` or custom scroll handler | CSS `scroll-behavior: smooth` + `<a href="#id">` | Already configured in globals.css. Zero JS needed. |
| Staggered delay calculation | Custom `delay: index * 0.15` on each child | `delayChildren: stagger(0.15)` in parent variant | `stagger()` handles delay distribution, `from` options, and easing. |

## Common Pitfalls

### Pitfall 1: Phone Mockup Scaling on Mobile
**What goes wrong:** Fixed 300x600px phone mockup overflows on small screens (320px viewport width).
**Why it happens:** Absolute pixel dimensions don't adapt to viewport.
**How to avoid:** Scale the phone mockup container on smaller breakpoints. Use `transform: scale(0.75)` on mobile or reduce the base dimensions. Alternatively, use relative sizing with a wrapper and `max-w-[280px]` on mobile.
**Warning signs:** Horizontal scrollbar appears on mobile. Phone mockup extends past viewport edges.

### Pitfall 2: Stagger Animation Not Working
**What goes wrong:** All children animate simultaneously instead of staggering.
**Why it happens:** Children don't have `variants` prop, or variant keys don't match parent (`hidden`/`visible` mismatch).
**How to avoid:** Every child `motion.*` element must have `variants={itemVariants}` with matching keys. The parent variant's `transition.delayChildren` only affects children that use variants -- not children with explicit `animate` props.
**Warning signs:** All hero elements appear at once despite `stagger()` being configured.

### Pitfall 3: Hero Not Full-Height on Mobile
**What goes wrong:** `min-h-screen` doesn't account for mobile browser chrome (URL bar, toolbar). Content may be cut off.
**Why it happens:** `100vh` on mobile includes area behind browser chrome.
**How to avoid:** Use `min-h-[100dvh]` instead of `min-h-screen`. The `dvh` unit (dynamic viewport height) adjusts for mobile browser chrome. Tailwind v4 supports arbitrary values: `min-h-[100dvh]`.
**Warning signs:** Hero content is partially hidden behind mobile browser URL bar.

### Pitfall 4: Blur Glow Causing Scroll Jank
**What goes wrong:** Large `blur()` filter on the glow element causes performance issues on low-end devices.
**Why it happens:** CSS `filter: blur()` is GPU-intensive, especially on large elements.
**How to avoid:** The glow div is static (not animated), which mitigates most performance concerns. Keep the blur element below 1000px in both dimensions. Add `will-change: transform` or use a pre-blurred static gradient instead. Test on throttled CPU in Chrome DevTools.
**Warning signs:** FPS drops when scrolling through the hero section.

### Pitfall 5: `animate` Instead of Variants on Children
**What goes wrong:** Using `initial` and `animate` directly on child elements breaks the stagger orchestration.
**Why it happens:** Motion's variant propagation requires children to use `variants` prop, not explicit `initial`/`animate`.
**How to avoid:** Only the parent `motion.section` should have `initial="hidden"` and `animate="visible"`. Children should only have `variants={itemVariants}`.
**Warning signs:** Children animate immediately regardless of stagger delay.

## Code Examples

### Complete Hero Component Structure

```tsx
// components/Hero.tsx
"use client"
import { motion, stagger } from "motion/react"
import { siteConfig } from "@/lib/content"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.15),
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

export default function Hero() {
  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Radial green glow background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[400px] lg:w-[800px] lg:h-[600px] rounded-full
                        bg-accent/10 blur-[120px]" />
      </div>

      {/* Two-column layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full
                      flex flex-col lg:flex-row items-center gap-12 lg:gap-16
                      pt-32 pb-16 lg:py-0">
        {/* Text column */}
        <div className="flex-1 text-center lg:text-left">
          <motion.h1 variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text
                       leading-tight tracking-tight">
            {siteConfig.tagline}
          </motion.h1>

          <motion.p variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-muted max-w-lg
                       mx-auto lg:mx-0">
            {siteConfig.description}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4
                       justify-center lg:justify-start">
            <a
              href={siteConfig.appUrl}
              className="inline-flex items-center justify-center px-8 py-3.5
                         bg-accent text-bg font-bold rounded-full text-lg
                         hover:brightness-110 transition-all"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3.5
                         border border-border text-text rounded-full text-lg
                         hover:border-accent hover:text-accent transition-colors"
            >
              See Features
            </a>
          </motion.div>
        </div>

        {/* Phone mockup column */}
        <motion.div variants={itemVariants}
          className="flex-1 flex justify-center">
          {/* Phone frame */}
          <div className="relative border-[14px] border-card-2 bg-card-2
                          rounded-[2.5rem] h-[500px] w-[245px]
                          sm:h-[600px] sm:w-[300px] shadow-xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2
                            w-[120px] sm:w-[148px] h-[18px]
                            bg-card-2 rounded-b-[1rem]" />

            {/* Volume buttons */}
            <div className="absolute -left-[17px] top-[124px]
                            h-[46px] w-[3px] bg-card-2 rounded-l-lg" />
            <div className="absolute -left-[17px] top-[178px]
                            h-[46px] w-[3px] bg-card-2 rounded-l-lg" />

            {/* Power button */}
            <div className="absolute -right-[17px] top-[142px]
                            h-[64px] w-[3px] bg-card-2 rounded-r-lg" />

            {/* Screen */}
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-bg
                            flex items-center justify-center">
              <span className="text-muted text-sm">App Preview</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
```

### Primary CTA Button Styling

```tsx
{/* High-contrast green button on dark background */}
<a
  href={siteConfig.appUrl}
  className="inline-flex items-center justify-center px-8 py-3.5
             bg-accent text-bg font-bold rounded-full text-lg
             hover:brightness-110 transition-all"
>
  Get Started Free
</a>
```

- `bg-accent` (`#4ade80`) on `text-bg` (`#0a0a0a`) -- high contrast, visually dominant
- `rounded-full` -- pill shape for modern CTA aesthetic
- `hover:brightness-110` -- subtle brightness increase on hover (GPU-friendly, no layout shift)
- `px-8 py-3.5` -- generous padding for large click target

### Secondary CTA Button Styling

```tsx
{/* Ghost/outline button for secondary action */}
<a
  href="#features"
  className="inline-flex items-center justify-center px-8 py-3.5
             border border-border text-text rounded-full text-lg
             hover:border-accent hover:text-accent transition-colors"
>
  See Features
</a>
```

- `border border-border` -- subtle outline style, doesn't compete with primary CTA
- `hover:border-accent hover:text-accent` -- accent green appears on hover

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `staggerChildren` in transition | `delayChildren: stagger(interval)` | Motion v12+ | `staggerChildren` is deprecated. `stagger()` is more powerful with `from`, `ease`, `startDelay` options. |
| `framer-motion` package | `motion` package | Late 2024 | Import from `motion/react`, not `framer-motion`. Same API, new package name. |
| `min-h-screen` (100vh) | `min-h-[100dvh]` | CSS dvh support ~2023 | `dvh` accounts for mobile browser chrome. `100vh` can cause content to be hidden behind URL bar. |
| `100vh` for mobile hero | `100dvh` or `100svh` | Universal browser support 2024+ | All modern browsers support dynamic viewport units. |

**Deprecated/outdated:**
- `staggerChildren`: Use `delayChildren: stagger(0.15)` instead (deprecated note found in Motion type definitions)
- `framer-motion` import: Use `motion/react` (project already uses correct import)

## Open Questions

1. **Phone mockup scale on tablet breakpoints**
   - What we know: 300x600px works on desktop (1024px+), may be large on tablets (768-1023px)
   - What's unclear: Exact scale factor needed for tablet viewport
   - Recommendation: Start with responsive classes (`sm:w-[250px] sm:h-[500px] lg:w-[300px] lg:h-[600px]`), adjust during visual review

2. **Glow positioning relative to phone mockup**
   - What we know: Glow should be behind hero content area
   - What's unclear: Whether glow should center on the phone mockup, on the text, or on the full section
   - Recommendation: Center the glow on the full section (50% 50%). This creates ambient lighting that doesn't bias toward either column. Adjust if visual review shows a better position.

3. **Phone mockup reuse in Phase 4 (Screenshots)**
   - What we know: Phase 4 (SCRN-03) also needs CSS-drawn phone frame mockups
   - What's unclear: Whether to extract a shared `PhoneMockup` component now or wait
   - Recommendation: Build inline in `Hero.tsx` for now. Extract to a shared component when Phase 4 needs it. Premature extraction adds complexity without benefit.

## Sources

### Primary (HIGH confidence)
- Motion library `node_modules/motion-dom/dist/index.d.ts` -- stagger function signature, staggerChildren deprecation notice
- Motion library `node_modules/framer-motion/dist/types/index.d.ts` -- variant types, transition orchestration
- Project codebase `lib/content.ts` -- siteConfig data structure
- Project codebase `app/globals.css` -- existing design tokens, scroll-behavior
- Project codebase `components/TestAnimation.tsx` -- confirmed Motion import pattern

### Secondary (MEDIUM confidence)
- [Flowbite Device Mockups](https://flowbite.com/docs/components/device-mockups/) -- phone mockup HTML structure with Tailwind
- [Themesberg Phone Mockup Tutorial](https://dev.to/themesberg/how-to-build-a-phone-mockup-using-only-tailwind-css-1e5c) -- phone mockup Tailwind pattern
- [Motion Stagger Docs](https://motion.dev/docs/stagger) -- stagger function API
- [Motion React Animation Docs](https://motion.dev/docs/react-animation) -- variant orchestration
- [MDN radial-gradient()](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient) -- CSS gradient syntax
- [frontend.fyi Staggered Text Tutorial](https://www.frontend.fyi/tutorials/staggered-text-animations-with-framer-motion) -- variant pattern with staggerChildren

### Tertiary (LOW confidence)
- [CSS-Tricks Smooth Scrolling](https://css-tricks.com/snippets/jquery/smooth-scrolling/) -- smooth scroll techniques (verified against project globals.css)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed, APIs verified in node_modules
- Architecture: HIGH -- responsive two-column layout is a well-established pattern, phone mockup code verified from multiple Tailwind sources
- Animation patterns: HIGH -- stagger() function confirmed in installed packages, variant orchestration is core Motion API
- Pitfalls: HIGH -- based on project-specific research (PITFALLS.md) and codebase verification
- Phone mockup: MEDIUM -- Flowbite/Themesberg patterns are proven but specific Tailwind class names may need fine-tuning for the dark theme design tokens

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (stable -- all libraries are installed and versions are locked)
