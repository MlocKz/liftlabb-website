# Phase 2: Navbar - Research

**Researched:** 2026-02-27
**Domain:** Sticky glassmorphic navbar with scroll behavior, anchor links, mobile responsiveness
**Confidence:** HIGH

## Summary

Phase 2 implements a sticky navbar that transitions from fully transparent at the page top to a glassmorphic (backdrop-blur + semi-transparent background) state on scroll. The navbar contains the LiftLabb logo, three smooth-scroll anchor links (Features, Pricing, FAQ), and a "Launch App" CTA button. On mobile, the navigation collapses into a hamburger menu with Motion-animated open/close.

The implementation requires a single client component (`"use client"`) because it depends on scroll event detection and interactive state (mobile menu toggle). Two approaches exist for the scroll-based opacity transition: (1) Motion's `useScroll` + `useTransform` for GPU-accelerated hardware animation, or (2) a simple `useState` + scroll event listener that toggles a CSS class. **Recommendation: Use approach (2) -- the simple useState toggle** -- because the navbar transition is a binary state change (transparent vs glass), not a continuous animation. The Motion `useTransform` approach is better for continuous scroll-linked animations (parallax, progress bars) but adds unnecessary complexity for a simple threshold toggle. Reserve Motion for the mobile menu enter/exit animation where `AnimatePresence` genuinely adds value.

**Primary recommendation:** Build the navbar as a single `"use client"` component with `useState` for scroll detection (threshold ~50px), CSS `transition` for smooth glassmorphism fade, `<a href="#section">` tags for anchor links, `scroll-margin-top` on target sections, and Motion `AnimatePresence` for the mobile hamburger menu overlay.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| NAV-01 | Sticky navbar with glassmorphic effect (backdrop-blur, semi-transparent) | Tailwind `fixed top-0` + `backdrop-blur-md` + `bg-bg/80` classes; CSS transition for smooth state change |
| NAV-02 | LiftLabb logo on the left | Use `next/image` with the existing `/public/LiftLabb-Logo.png` (165KB PNG); set width/height for optimization |
| NAV-03 | Smooth-scroll anchor links to Features, Pricing, FAQ sections | Plain `<a href="#features">` tags (NOT `next/link`); `scroll-behavior: smooth` already in globals.css; `scroll-margin-top` on target sections |
| NAV-04 | "Launch App" CTA button linking to app.liftlabb.ca | Plain `<a>` tag with `target="_blank"` and `rel="noopener noreferrer"`; styled as green accent button |
| NAV-05 | Scroll-based opacity transition (transparent at top, glass on scroll) | `useState` + `useEffect` scroll listener with ~50px threshold; toggle Tailwind classes; CSS `transition-all duration-300` |
| NAV-06 | Mobile-responsive navigation (hamburger menu) | `useState` for open/close; Motion `AnimatePresence` + `motion.div` for slide-down overlay animation; hamburger icon toggles to X |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.12 | Framework | Already installed in Phase 1 |
| React | 19.1.0 | UI library | Already installed |
| Tailwind CSS | 4.x | Styling (glassmorphism utilities) | Already installed; `backdrop-blur-*` and `bg-*/opacity` utilities built in |
| Motion | 12.34.3 | AnimatePresence for mobile menu | Already installed; import from `motion/react` |

### Supporting (no new installs needed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/image | Built-in | Logo optimization | For the PNG logo in navbar |
| next/font/local | Built-in | Already configured | Circular Std already loaded via `--font-circular` variable |

### No New Dependencies
Phase 2 requires zero new npm installations. Everything needed is already present from Phase 1.

## Architecture Patterns

### Recommended File Structure
```
components/
  Navbar.tsx          # Main navbar component ("use client")
lib/
  content.ts          # Add navLinks array (anchor labels + hrefs)
app/
  globals.css         # Add scroll-margin-top rule for sections
  layout.tsx          # Import and render <Navbar /> above {children}
```

### Pattern 1: Scroll-Detection with useState
**What:** Detect when user has scrolled past a threshold and toggle navbar background state
**When to use:** Binary state transitions (transparent vs visible), not continuous animations
**Why over Motion useScroll:** Simpler code, same visual result for a threshold toggle, no Motion overhead for what is essentially a boolean check

```typescript
// components/Navbar.tsx
"use client"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      {/* navbar content */}
    </nav>
  )
}
```

**Key details:**
- `{ passive: true }` on the scroll listener prevents blocking the browser's scroll thread -- critical for performance
- `window.scrollY > 50` is the threshold -- enough that intentional scrolling triggers it, not micro-movements
- CSS `transition-all duration-300` provides the smooth fade between states
- `z-50` ensures navbar stays above all content
- `bg-bg/80` uses Tailwind v4's color opacity syntax (80% opacity of `--color-bg`)

### Pattern 2: Glassmorphism via Tailwind Utility Classes
**What:** Achieve frosted glass effect using Tailwind's built-in backdrop-filter utilities
**When to use:** When the scrolled state is active

```
Scrolled state classes:
  bg-bg/80              → semi-transparent background (80% of #0a0a0a)
  backdrop-blur-md      → 12px gaussian blur on content behind navbar
  border-b border-border/50 → subtle bottom border at 50% opacity

Transparent state classes:
  bg-transparent        → fully transparent, no glass effect
```

**Tailwind v4 color/opacity syntax:**
- `bg-bg/80` = the `--color-bg` (#0a0a0a) at 80% opacity. This is the v4 syntax replacing v3's separate `bg-opacity-*` utilities.
- `border-border/50` = `--color-border` (#333333) at 50% opacity.
- These work because Phase 1 defined `--color-bg` and `--color-border` in the `@theme` block.

### Pattern 3: Anchor Links with scroll-margin-top
**What:** Smooth-scroll to sections without content hiding behind the fixed navbar
**When to use:** For all in-page anchor links

```css
/* In globals.css -- add this rule */
section[id] {
  scroll-margin-top: 5rem; /* 80px -- matches navbar height */
}
```

Combined with the existing `html { scroll-behavior: smooth; }` already in globals.css, clicking `<a href="#features">` will:
1. Smooth-scroll to the `#features` section
2. Stop 80px above the section's top edge (clearing the navbar)

**Why `section[id]` selector:** Targets only elements that are actual anchor targets. More specific than a universal selector, zero specificity issues.

**Alternative Tailwind approach:** Add `scroll-mt-20` (5rem = 80px) to each section's className. Either approach works; the CSS rule is DRYer since it applies to all sections automatically.

### Pattern 4: Mobile Menu with AnimatePresence
**What:** Animated hamburger menu overlay for mobile viewports
**When to use:** Below `md:` breakpoint (768px)

```typescript
import { AnimatePresence, motion } from "motion/react"

// Inside Navbar component:
const [mobileOpen, setMobileOpen] = useState(false)

// Desktop links hidden on mobile, hamburger shown
// Mobile overlay:
<AnimatePresence>
  {mobileOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-lg border-b border-border md:hidden"
    >
      {/* Mobile nav links */}
    </motion.div>
  )}
</AnimatePresence>
```

**Key details:**
- `AnimatePresence` enables the `exit` prop -- without it, the element disappears instantly when `mobileOpen` becomes false
- The overlay is `absolute` positioned below the navbar (`top-full`) so it slides down from the nav
- `md:hidden` on the mobile overlay ensures it never appears on desktop
- The hamburger button has `md:hidden` and desktop links have `hidden md:flex`
- Close the menu when any link is clicked (call `setMobileOpen(false)` in the onClick handler)
- Close the menu when clicking outside (optional: add an overlay backdrop)

### Pattern 5: Logo with next/image
**What:** Optimized logo rendering using Next.js Image component
**When to use:** For the LiftLabb PNG logo

```typescript
import Image from "next/image"

<Image
  src="/LiftLabb-Logo.png"
  alt="LiftLabb"
  width={36}
  height={36}
  className="rounded-lg"
/>
```

**Why next/image for the logo:**
- The logo is a 165KB PNG at the original size. `next/image` will serve it as optimized WebP/AVIF at the actual rendered size (~36x36px), dramatically reducing transfer size.
- Automatic `srcset` generation for different pixel densities (1x, 2x Retina).
- Built-in lazy loading (though for navbar, it loads immediately since it's above the fold -- consider adding `priority` if you see layout shift).

**Logo display approach:**
The existing `LiftLabb-Logo.png` is the green dumbbell "L" icon on a dark rounded-corner background. For the navbar, display it at ~36x36px alongside the text "LiftLabb" in the accent green color.

### Anti-Patterns to Avoid
- **Using `next/link` for anchor links:** `<Link href="#features">` from `next/link` performs client-side routing and may not respect `scroll-behavior: smooth`. Use plain `<a href="#features">` tags instead. This is a verified pitfall (see Phase 1 research PITFALLS.md #8).
- **Multiple backdrop-blur elements:** Applying `backdrop-blur` to cards, overlays, AND the navbar kills performance on mobile. Only the navbar gets `backdrop-blur` (PERF-02 requirement).
- **Using Motion useScroll for the threshold toggle:** `useScroll` + `useTransform` is designed for continuous scroll-linked animations. For a binary "scrolled past 50px" toggle, a simple `addEventListener("scroll")` with `useState` is clearer and performs identically.
- **Not adding `{ passive: true }` to scroll listener:** Without the passive flag, the browser must wait for the event handler to complete before scrolling, causing jank.
- **Forgetting to close mobile menu on link click:** User taps "Features" in mobile menu, the page scrolls but the menu stays open. Always call `setMobileOpen(false)` when a link is clicked.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Exit animations | Custom CSS animation + setTimeout to delay unmount | Motion `AnimatePresence` | Coordinating DOM removal with animation completion is error-prone; AnimatePresence handles the lifecycle correctly |
| Scroll-aware styling | Custom Intersection Observer on the navbar | `useState` + `scroll` event with threshold | IO is for observing elements entering the viewport, not tracking scroll position; scroll listener is simpler and more direct |
| Responsive breakpoints | Custom `window.matchMedia` listener for mobile detection | Tailwind `md:hidden` / `hidden md:flex` | CSS media queries via Tailwind classes handle this without any JS; no need to detect viewport width in React |
| Smooth scrolling | Custom `window.scrollTo` with requestAnimationFrame easing | `scroll-behavior: smooth` (CSS) + `scroll-margin-top` | Browser-native smooth scrolling is performant and accessible; already configured in globals.css from Phase 1 |

**Key insight:** The navbar is deceptively simple -- the main complexity is getting the scroll detection, glassmorphism transition, anchor offset, and mobile menu animation all working together without performance issues. Each individual piece is straightforward, but the composition requires careful attention to z-index stacking, passive event listeners, and proper Tailwind class toggling.

## Common Pitfalls

### Pitfall 1: Anchor Links Scroll Behind Fixed Navbar
**What goes wrong:** Clicking "Features" scrolls to the section, but the section heading is hidden behind the 80px-tall fixed navbar.
**Why it happens:** `scroll-behavior: smooth` scrolls to the exact top of the target element, which is now under the navbar.
**How to avoid:** Add `scroll-margin-top: 5rem` to all sections with `id` attributes. This tells the browser to stop scrolling 80px before the element's top edge.
**Warning signs:** Any section heading is cut off at the top after clicking a nav link.

### Pitfall 2: Backdrop-blur Not Visible on Dark Background
**What goes wrong:** The glassmorphic effect is invisible because the content behind the navbar is also dark (#0a0a0a). Blur of a uniform dark color looks identical to a solid dark color.
**Why it happens:** Glassmorphism is most visible when there's varied/light content behind the glass element. On a dark single-color background, the blur has nothing to blur.
**How to avoid:** The glassmorphic effect will become visible once the Hero section (Phase 3) and other colorful content exists beneath the navbar. For now during Phase 2 development, the `border-b border-border/50` bottom border provides the visual distinction. The green hero glow, colored cards, and text content in later phases will make the glass effect shine.
**Warning signs:** If the navbar looks identical when scrolled vs transparent, add a temporary light-colored test section below it during development.

### Pitfall 3: Mobile Menu Not Animating on Exit
**What goes wrong:** The hamburger menu appears with animation but disappears instantly when closed.
**Why it happens:** Without `AnimatePresence`, React unmounts the element immediately when the boolean becomes false, giving Motion no time to play the `exit` animation.
**How to avoid:** Wrap the conditional mobile menu in `<AnimatePresence>`. The `exit` prop on `motion.div` only works inside `AnimatePresence`.
**Warning signs:** Menu opens smoothly but snaps shut.

### Pitfall 4: Scroll Listener Memory Leak
**What goes wrong:** Adding a scroll event listener in `useEffect` without cleaning it up. If the component remounts (unlikely for navbar but possible in dev), stale listeners accumulate.
**Why it happens:** Missing the return cleanup function in `useEffect`.
**How to avoid:** Always return a cleanup function: `return () => window.removeEventListener("scroll", handleScroll)`
**Warning signs:** Performance degrades over time in development; multiple console logs from stale handlers.

### Pitfall 5: Layout Shift from Logo Image Loading
**What goes wrong:** The navbar jumps or shifts when the logo image loads, because its dimensions weren't reserved.
**Why it happens:** Not specifying explicit `width` and `height` on the `Image` component.
**How to avoid:** Always pass `width={36} height={36}` (or your chosen display size) to `next/image`. This reserves space in the layout before the image loads.
**Warning signs:** Navbar content shifts horizontally when the page first loads.

### Pitfall 6: Z-Index Stacking Issues with Mobile Menu
**What goes wrong:** The mobile menu overlay appears behind other page content (hero section, cards) instead of on top.
**Why it happens:** The mobile menu is positioned `absolute` inside the navbar, but other sections may have their own stacking contexts.
**How to avoid:** The navbar itself should have `z-50`. The mobile menu inherits this stacking context since it's a child. If other elements use `z-*` values, ensure they're lower than 50.
**Warning signs:** Mobile menu slides in but content from sections below shows through or on top.

## Code Examples

### Complete Navbar Component Structure

```typescript
// components/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { siteConfig } from "@/lib/content"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Image
              src="/LiftLabb-Logo.png"
              alt="LiftLabb"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <span className="text-accent font-bold text-lg">
              {siteConfig.name}
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted hover:text-text transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-bg font-bold px-4 py-2 rounded-card hover:bg-accent/90 transition-colors"
            >
              Launch App
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {/* Hamburger / X icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-bg/95 backdrop-blur-lg border-b border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted hover:text-text transition-colors text-lg"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-bg font-bold px-4 py-2.5 rounded-card text-center hover:bg-accent/90 transition-colors"
              >
                Launch App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
```

### Content Data Addition

```typescript
// Add to lib/content.ts
export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const
```

### Global CSS Addition

```css
/* Add to globals.css after existing rules */
section[id] {
  scroll-margin-top: 5rem; /* 80px -- clears the fixed navbar */
}
```

### Layout Integration

```typescript
// app/layout.tsx -- add Navbar import and render
import Navbar from "@/components/Navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={circularStd.variable}>
      <body className="bg-bg text-text font-sans antialiased min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
```

### Navbar Height Spacing

```typescript
// In app/page.tsx, add top padding to clear the fixed navbar
<main className="min-h-screen pt-16">
  {/* page content */}
</main>
```

The `pt-16` (64px) gives the page content breathing room below the fixed navbar. The navbar itself is `h-16` (64px tall), so this prevents content from hiding behind it.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package | Late 2024 | Import from `motion/react` not `framer-motion` |
| `bg-opacity-*` separate utility | `bg-color/opacity` syntax | Tailwind v4 (2025) | Use `bg-bg/80` not `bg-bg bg-opacity-80` |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` | Tailwind v4 | Single import replaces three directives |
| `tailwind.config.ts` for theme | `@theme { }` in CSS | Tailwind v4 | CSS-first configuration, no JS config |
| `next/link` for all navigation | Plain `<a>` for same-page anchors | Always (but commonly confused) | `next/link` is for page-to-page routing only |
| Manual Intersection Observer | Motion `whileInView` or browser scroll events | 2023+ | Use the right tool: `whileInView` for entrance animations, `scroll` events for position detection |

## Open Questions

1. **Navbar height: 64px or 80px?**
   - What we know: `h-16` (64px) is the most common navbar height. The `scroll-margin-top` must match.
   - What's unclear: Whether the design looks better with a slightly taller navbar (h-20 = 80px).
   - Recommendation: Start with `h-16` (64px). Easy to adjust both the navbar and `scroll-margin-top` if needed.

2. **Logo cropping for navbar**
   - What we know: The `LiftLabb-Logo.png` is a square icon with rounded corners and dark background that blends with the page background.
   - What's unclear: Whether the dark background around the icon should be transparent for better navbar integration, or whether the current square format works.
   - Recommendation: Use as-is with `rounded-lg` class. The dark background matches `--color-bg` so it blends naturally. If it looks off, a separate transparent-background logo variant could be created.

3. **Should nav links include "Testimonials"?**
   - What we know: The design doc lists a Testimonials section, but REQUIREMENTS.md removed it from v1 scope (testimonials deferred to v2).
   - What's unclear: Whether other future sections should have nav links preemptively.
   - Recommendation: Only link to sections that exist in v1: Features, Pricing, FAQ. Add more links as sections are implemented.

## Sources

### Primary (HIGH confidence)
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) - scroll-linked animation API
- [Motion AnimatePresence docs](https://motion.dev/docs/react-animate-presence) - exit animation lifecycle
- [Motion useMotionValueEvent docs](https://motion.dev/docs/react-use-motion-value-event) - scroll event handling
- [Tailwind CSS backdrop-blur docs](https://tailwindcss.com/docs/backdrop-filter-blur) - glassmorphism utilities
- [MDN scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-margin-top) - CSS scroll offset
- [Next.js Image Component docs](https://nextjs.org/docs/app/api-reference/components/image) - logo optimization
- [vercel/next.js Discussion #35641](https://github.com/vercel/next.js/discussions/35641) - SVG vs PNG with next/image
- [Epic Web Dev - Glassmorphism with Tailwind](https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css) - class combinations

### Secondary (MEDIUM confidence)
- [LogRocket - React Scroll Animations with Framer Motion](https://blog.logrocket.com/react-scroll-animations-framer-motion/) - useScroll/useTransform patterns
- [Publii - One-line CSS for anchor offset](https://getpublii.com/blog/one-line-css-solution-to-prevent-anchor-links-from-scrolling-behind-a-sticky-header.html) - scroll-margin-top solution
- [Braydon Coyer - Glassmorphic Navbar with Tailwind](https://www.braydoncoyer.dev/blog/build-a-glassmorphic-navbar-with-tailwindcss-backdrop-filter-and-backdrop-blur) - implementation pattern

### Tertiary (LOW confidence)
- [DEV.to - Animate Hamburger Menu with Framer Motion](https://dev.to/wiommi/animate-a-hamburger-menu-with-framer-motion-50ml) - AnimatePresence mobile menu pattern (uses old framer-motion import names)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed from Phase 1, no new dependencies
- Architecture: HIGH - scroll event + class toggle is a well-established pattern; AnimatePresence is documented Motion API
- Pitfalls: HIGH - scroll-margin-top, anchor link component choice, passive listeners are all verified in official docs and Phase 1 research
- Glassmorphism classes: HIGH - Tailwind v4 backdrop-blur and color/opacity syntax verified against official Tailwind docs

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (stable -- no fast-moving dependencies)
