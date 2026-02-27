# Phase 1: Project Scaffold & Design System - Research

**Researched:** 2026-02-27
**Domain:** Next.js 15 scaffolding, Tailwind CSS v4 design system, font loading, Motion animation library
**Confidence:** HIGH

## Summary

Phase 1 establishes the foundational project scaffold: a Next.js 15 App Router project with Tailwind CSS v4 CSS-first configuration, the Circular Std font loaded via `next/font/local`, the Motion animation library, and a centralized content data file. This is the first phase with no dependencies -- everything starts from an empty directory containing only a logo PNG and planning docs.

The key technical challenges are: (1) correctly configuring Tailwind v4's CSS-first `@theme` system instead of the legacy v3 JavaScript config, (2) wiring `next/font/local` CSS variables into Tailwind v4 using `@theme inline`, and (3) ensuring `create-next-app@15` scaffolds Tailwind v4 (confirmed supported since Next.js 15.2). All technologies are well-documented and the patterns are verified against current official sources.

**Primary recommendation:** Scaffold with `npx create-next-app@15`, then configure the LiftLabb design tokens in `globals.css` using `@theme` and `@theme inline`, copy the font file into `app/fonts/`, set up `next/font/local` in `layout.tsx`, install `motion`, create `lib/content.ts`, and verify with a test animation element.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Next.js 15 project scaffolded with App Router, Tailwind v4 (CSS-first config), and TypeScript | Scaffold command, PostCSS config, @theme/@import syntax documented in Code Examples |
| FOUND-02 | LiftLabb design system configured via Tailwind @theme (colors, font, border-radius from existing app) | Full @theme token definition with all LiftLabb colors, font variable wiring via @theme inline |
| FOUND-03 | Circular Std font loaded via next/font/local with zero layout shift | next/font/local pattern with variable, @theme inline wiring, font file placement in app/fonts/ |
| FOUND-04 | Motion library installed for scroll-triggered animations | Installation command, import path, "use client" requirement documented |
| FOUND-05 | Centralized content data file (lib/content.ts) for all text, features, FAQ items, pricing | Content data pattern with TypeScript types and `as const` |
| FOUND-06 | Shared scroll animation hook/pattern using Motion whileInView | whileInView pattern with viewport={{ once: true }}, staggered animation example |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x (pin via `create-next-app@15`) | Framework, SSG, App Router | Battle-tested for static marketing sites. Pinned to 15 to avoid Next.js 16 breaking changes (async request APIs, Turbopack default). |
| React | 18.x (bundled with Next.js 15) | UI library | Ships with Next.js 15. React 19 ships with Next.js 16 -- not needed here. |
| TypeScript | 5.x | Type safety | Scaffolded by default with create-next-app. |
| Tailwind CSS | 4.x (latest 4.2) | Utility-first CSS, design system | CSS-first config via `@theme` directive. ~70% smaller production CSS vs v3. Scaffolded by `create-next-app@15` since Next.js 15.2. |
| `@tailwindcss/postcss` | 4.x | PostCSS plugin for Tailwind v4 | Required for Tailwind v4 in Next.js. Replaces the old `tailwindcss` PostCSS plugin. Scaffolded automatically. |
| Motion | 12.x | Scroll animations, entrance effects | Install via `npm install motion`, import from `motion/react`. Provides `whileInView` for scroll-triggered animations. Formerly Framer Motion (rebranded late 2024). |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/font/local` | Built into Next.js | Circular Std font loading | Always -- zero layout shift, automatic preloading, self-hosting. |
| `next/image` | Built into Next.js | Image optimization | For logo and any images. Automatic WebP/AVIF, responsive srcset on Vercel. |
| Lucide React | Latest (0.4x) | Icons for feature cards | Optional -- only if inline SVGs aren't sufficient for the 6 feature card icons. Not needed in Phase 1. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Motion | CSS @keyframes + IntersectionObserver | 30-50 lines boilerplate per section vs 2-3 lines with Motion. No spring physics or stagger orchestration. |
| `next/font/local` | Raw CSS `@font-face` | Misses automatic size-adjust, preloading, and CLS prevention. |
| Tailwind v4 @theme | Tailwind v3 tailwind.config.ts | v3 is legacy. v4 is what `create-next-app@15` scaffolds since 15.2. |

**Installation:**
```bash
# Scaffold project (pins to Next.js 15, scaffolds Tailwind v4 since 15.2)
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Animation library (NOT framer-motion)
npm install motion
```

## Architecture Patterns

### Recommended Project Structure
```
liftlabb-website/
+-- app/
|   +-- layout.tsx           # Root layout: next/font/local, metadata, <html>/<body>
|   +-- page.tsx             # Landing page: composes all sections
|   +-- globals.css          # @import "tailwindcss", @theme tokens, @theme inline for font
|   +-- fonts/
|   |   +-- CircularStd-Medium.ttf  # Font file co-located with app/ (not public/)
|   +-- sitemap.ts           # (Phase 7 - not this phase)
|   +-- robots.ts            # (Phase 7 - not this phase)
+-- components/              # Section components (built in later phases)
+-- lib/
|   +-- content.ts           # Centralized content: features, FAQ, pricing, headlines
+-- public/
|   +-- LiftLabb-Logo.png    # Logo (moved from project root, filename sanitized)
|   +-- icons/
|   |   +-- icon-180.png     # Apple touch icon
|   |   +-- icon-192.png     # PWA icon
|   |   +-- icon-512.png     # PWA icon
+-- postcss.config.mjs       # @tailwindcss/postcss plugin (scaffolded by create-next-app)
+-- next.config.ts           # Minimal config (NO output: 'export')
+-- tsconfig.json            # (scaffolded)
+-- package.json             # (scaffolded)
```

**Structure rationale:**
- **No `tailwind.config.ts`:** Tailwind v4 uses CSS-first `@theme` in `globals.css`. Delete if scaffolded.
- **Font in `app/fonts/`:** `next/font/local` requires relative paths from the importing file. Co-locating with `app/layout.tsx` keeps the path simple (`./fonts/CircularStd-Medium.ttf`).
- **No `src/` directory:** Small project, `src/` adds unnecessary nesting. Flag `--src-dir=false`.
- **`lib/content.ts`:** All copy, features, FAQ items, pricing in one typed file. Content changes touch one file.
- **Flat `components/`:** Only 8 section components total. No subdirectories needed.

### Pattern 1: Server-First with Client Boundaries

**What:** Default everything to Server Components. Add `"use client"` only where browser APIs are needed (Motion animations, useState, scroll listeners).

**When to use:** Always in Next.js App Router projects.

**Example:**
```tsx
// app/page.tsx -- Server Component (no directive needed)
// Composes all sections. Only sections with animations need "use client".
export default function Home() {
  return (
    <main>
      {/* Section components imported here in later phases */}
    </main>
  )
}
```

### Pattern 2: CSS-First Tailwind v4 Design Tokens

**What:** All design tokens defined in CSS `@theme` blocks. Font variable from next/font wired via `@theme inline`.

**When to use:** Project setup. All brand colors, fonts, spacing defined here.

**Example:**
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-card: #1a1a1a;
  --color-card-2: #222222;
  --color-text: #e5e5e5;
  --color-muted: #999999;
  --color-accent: #4ade80;
  --color-yellow: #facc15;
  --color-red: #f87171;
  --color-blue: #60a5fa;
  --color-border: #333333;
  --radius-card: 12px;
}

/* CRITICAL: Use @theme inline to reference next/font CSS variables */
@theme inline {
  --font-sans: var(--font-circular), -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
}
```

**Generated utilities:** `bg-bg`, `bg-card`, `text-text`, `text-muted`, `text-accent`, `border-border`, `rounded-card`, `font-sans`

### Pattern 3: next/font/local with CSS Variable

**What:** Load Circular Std font via next/font/local, expose as CSS variable, wire into Tailwind via `@theme inline`.

**Example:**
```tsx
// app/layout.tsx
import localFont from 'next/font/local'
import './globals.css'

const circularStd = localFont({
  src: './fonts/CircularStd-Medium.ttf',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-circular',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={circularStd.variable}>
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

**Key detail:** The `variable: '--font-circular'` creates a CSS custom property `--font-circular` on the `<html>` element. The `@theme inline { --font-sans: var(--font-circular)... }` in globals.css then makes Tailwind's `font-sans` utility use Circular Std. The `className={circularStd.variable}` on `<html>` is required to inject the CSS variable.

### Pattern 4: Motion whileInView for Scroll Animations

**What:** Use Motion's declarative `whileInView` prop instead of manual Intersection Observer.

**When to use:** Any component needing scroll-triggered entrance animation.

**Example:**
```tsx
"use client"
import { motion } from "motion/react"

// Reusable animation pattern for Phase 1 verification
export default function TestAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-card rounded-card border border-border"
    >
      <p className="text-accent">Motion whileInView is working!</p>
    </motion.div>
  )
}
```

### Pattern 5: Centralized Content Data

**What:** All text content as typed objects/arrays in `lib/content.ts`.

**Example:**
```ts
// lib/content.ts

export const siteConfig = {
  name: "LiftLabb",
  tagline: "Track your gains. Ditch the spreadsheet.",
  description: "The workout tracker built for lifters who want to get stronger.",
  url: "https://liftlabb.ca",
  appUrl: "https://app.liftlabb.ca",
} as const

export interface Feature {
  title: string
  description: string
  icon: string
}

export const features: Feature[] = [
  {
    title: "Workout Logging",
    description: "Log sets, reps, weight, and RIR for every exercise",
    icon: "dumbbell",
  },
  {
    title: "Custom Programs",
    description: "Build and follow periodized training programs",
    icon: "clipboard-list",
  },
  {
    title: "Progression Charts",
    description: "Visualize your strength gains over time",
    icon: "trending-up",
  },
  {
    title: "Exercise Library",
    description: "350+ exercises with muscle group targeting",
    icon: "library",
  },
  {
    title: "Cross-device Sync",
    description: "Train on any device, your data follows you",
    icon: "refresh-cw",
  },
  {
    title: "Smart Auto-fill",
    description: "Auto-suggests weights based on your history",
    icon: "zap",
  },
] as const

export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: "What platforms does LiftLabb work on?",
    answer: "LiftLabb works on any device with a web browser -- iPhone, Android, tablet, or desktop. No app download required.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Every plan comes with a 7-day free trial. No credit card required to start.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Cancel your subscription anytime from your account settings. No questions asked.",
  },
  {
    question: "Is my data safe?",
    answer: "Your data is stored securely on Google Cloud (Firebase). We never sell or share your personal information.",
  },
  {
    question: "Can I add custom exercises?",
    answer: "Yes! Add any exercise you want with custom muscle group targeting and notes.",
  },
  {
    question: "Does it work offline?",
    answer: "LiftLabb requires an internet connection to sync your data across devices. We're working on offline support for a future update.",
  },
] as const

export interface PricingPlan {
  name: string
  price: string
  period: string
  badge: string | null
  highlight: boolean
  features: string[]
  savings?: string
  monthly?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Monthly",
    price: "$2.99",
    period: "/mo",
    badge: null,
    highlight: false,
    features: [
      "Unlimited workout logging",
      "Custom programs",
      "Progression charts",
      "Exercise library",
      "Cross-device sync",
      "Smart auto-fill",
    ],
  },
  {
    name: "Annual",
    price: "$19.99",
    period: "/yr",
    badge: "Best Value",
    highlight: true,
    savings: "Save 44%",
    monthly: "$1.67/mo",
    features: [
      "Unlimited workout logging",
      "Custom programs",
      "Progression charts",
      "Exercise library",
      "Cross-device sync",
      "Smart auto-fill",
    ],
  },
] as const
```

### Anti-Patterns to Avoid

- **Using `tailwind.config.ts` with Tailwind v4:** v4 uses CSS-first `@theme`. A JS config file will be silently ignored. Delete it if `create-next-app` generates one.
- **Using `@theme` (not `@theme inline`) for next/font variables:** Tailwind v4 cannot resolve CSS variables injected at runtime by next/font unless `@theme inline` is used. Static color values use `@theme`; dynamic CSS variable references use `@theme inline`.
- **Placing font in `public/fonts/`:** While technically possible, `next/font/local` uses relative paths from the importing file. Placing the font in `app/fonts/` keeps the path simple (`./fonts/CircularStd-Medium.ttf` from `app/layout.tsx`).
- **Using `framer-motion` package:** The old package name. Install `motion`, import from `motion/react`.
- **Setting `output: 'export'` in next.config.ts:** Disables `next/image` optimization. On Vercel, the default mode serves SSG pages as static while keeping image optimization.
- **`"use client"` on everything:** Only components using Motion, useState, or browser APIs need it. `layout.tsx`, `page.tsx`, and Footer stay as Server Components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading with CLS prevention | CSS `@font-face` with manual size-adjust | `next/font/local` | Automatic `size-adjust`, `ascent-override`, preloading, zero CLS |
| Scroll-triggered animations | IntersectionObserver + CSS class toggling | Motion `whileInView` | 2-3 lines vs 30-50 lines, plus spring physics and stagger |
| CSS purging / utility generation | Manual CSS management | Tailwind v4 `@theme` | Automatic utility generation, ~6-12KB gzipped production CSS |
| Design token system | CSS custom properties + manual utility classes | Tailwind v4 `@theme` | `--color-accent` automatically generates `bg-accent`, `text-accent`, `border-accent`, etc. |

**Key insight:** Every "hand-roll" temptation in Phase 1 has a built-in or standard library solution that handles edge cases (font metric calculation, viewport intersection thresholds, CSS purging) that would take significant effort to replicate correctly.

## Common Pitfalls

### Pitfall 1: Tailwind v3 Config with Tailwind v4

**What goes wrong:** Using `tailwind.config.ts` with `@tailwind base; @tailwind components; @tailwind utilities;` directives. Custom design tokens silently fail to generate utilities.
**Why it happens:** Most tutorials and AI training data reference v3 patterns. `create-next-app@15` scaffolds v4 since 15.2.
**How to avoid:** Use `@import "tailwindcss";` (single import). Define tokens in `@theme { }`. Delete any auto-generated `tailwind.config.ts`.
**Warning signs:** `bg-accent` or `text-muted` classes produce no visible effect.

### Pitfall 2: @theme vs @theme inline for Font Variables

**What goes wrong:** Defining `--font-sans: var(--font-circular)` inside `@theme` instead of `@theme inline`. Tailwind cannot resolve the CSS variable at build time because next/font injects it at runtime.
**Why it happens:** The difference between `@theme` and `@theme inline` is subtle and poorly documented in tutorials.
**How to avoid:** Static values (hex colors, px values) go in `@theme`. Dynamic CSS variable references (from next/font) go in `@theme inline`.
**Warning signs:** `font-sans` utility doesn't apply Circular Std. Text renders in system font despite the variable being set.

### Pitfall 3: Installing `framer-motion` Instead of `motion`

**What goes wrong:** Wrong package installed. Import paths differ (`framer-motion` vs `motion/react`).
**Why it happens:** Rebrand happened late 2024. Old package name dominates search results and training data.
**How to avoid:** `npm install motion`. Import: `import { motion } from "motion/react"`.
**Warning signs:** `package.json` contains `framer-motion`.

### Pitfall 4: Font File Placement and Path Resolution

**What goes wrong:** Placing font in `public/fonts/` and using `src: '/fonts/CircularStd-Medium.ttf'` in next/font/local. Fails with "module not found" error.
**Why it happens:** `next/font/local` requires a relative path from the file where the font loader is called, not an absolute URL path.
**How to avoid:** Place font in `app/fonts/`. Reference as `src: './fonts/CircularStd-Medium.ttf'` from `app/layout.tsx`.
**Warning signs:** Build error mentioning module not found for font file.

### Pitfall 5: Missing `viewport={{ once: true }}` on Animations

**What goes wrong:** Scroll animations replay every time element enters viewport.
**Why it happens:** Motion's `whileInView` defaults to re-triggering on every viewport entry.
**How to avoid:** Always add `viewport={{ once: true }}` for entrance animations.
**Warning signs:** Scrolling up and down repeatedly re-triggers animations.

### Pitfall 6: Logo File Size (15.5MB PNG)

**What goes wrong:** The `LiftLabb Logo.png` at project root is 15.5MB. Serving this directly would devastate page load performance.
**Why it happens:** Original export is likely very high resolution.
**How to avoid:** Optimize/resize the logo before placing in `public/`. For a navbar logo, 200-400px width is sufficient. Use `next/image` with explicit width/height for further optimization.
**Warning signs:** Lighthouse flags massive image payload.

### Pitfall 7: Dark Theme Accessibility -- Insufficient Contrast

**What goes wrong:** Muted text `#888888` on dark backgrounds fails WCAG AA.
**Why it happens:** Dark theme designs often use low-contrast grays that look fine on retina displays but fail accessibility standards.
**How to avoid:** Use `#999999` for muted text (passes AA on `#0a0a0a` background at 5.0:1+ contrast ratio).
**Warning signs:** Contrast checker tools flag muted text.

## Code Examples

### Example 1: Complete globals.css with Tailwind v4 Design Tokens
```css
/* app/globals.css */
/* Source: Tailwind v4 docs (https://tailwindcss.com/docs/theme) + verified GitHub discussions */

@import "tailwindcss";

/* Static design tokens -- use @theme */
@theme {
  --color-bg: #0a0a0a;
  --color-card: #1a1a1a;
  --color-card-2: #222222;
  --color-text: #e5e5e5;
  --color-muted: #999999;
  --color-accent: #4ade80;
  --color-yellow: #facc15;
  --color-red: #f87171;
  --color-blue: #60a5fa;
  --color-border: #333333;
  --radius-card: 12px;
}

/* Dynamic font variable from next/font -- MUST use @theme inline */
@theme inline {
  --font-sans: var(--font-circular), -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
}

/* Base styles */
body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
```

### Example 2: Root Layout with next/font/local
```tsx
// app/layout.tsx
// Source: Next.js docs (https://nextjs.org/docs/app/getting-started/fonts)
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const circularStd = localFont({
  src: './fonts/CircularStd-Medium.ttf',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-circular',
})

export const metadata: Metadata = {
  title: 'LiftLabb - Track your gains. Ditch the spreadsheet.',
  description: 'The workout tracker built for lifters who want to get stronger.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={circularStd.variable}>
      <body className="bg-bg text-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
```

### Example 3: Test Page for Phase 1 Verification
```tsx
// app/page.tsx (Phase 1 verification page -- replaced in later phases)
import TestAnimation from '@/components/TestAnimation'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-accent">LiftLabb</h1>
      <p className="text-muted">Design system is working</p>
      <div className="bg-card border border-border rounded-card p-6">
        <p className="text-text">Card with design tokens</p>
      </div>

      {/* Scroll down to see animation */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted">Scroll down to test animation</p>
      </div>

      <TestAnimation />
    </main>
  )
}
```

### Example 4: Motion whileInView Test Component
```tsx
// components/TestAnimation.tsx
"use client"
import { motion } from "motion/react"

export default function TestAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 bg-card rounded-card border border-border max-w-md"
    >
      <h2 className="text-xl font-bold text-accent mb-2">Motion Works!</h2>
      <p className="text-muted text-sm">
        This element animated into view using Motion whileInView.
      </p>
    </motion.div>
  )
}
```

### Example 5: PostCSS Config (should be auto-scaffolded)
```js
// postcss.config.mjs
// Source: Tailwind v4 docs (https://tailwindcss.com/docs/installation/using-postcss)
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
export default config
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.ts` (JS config) | `@theme` in CSS | Tailwind v4 (Jan 2025) | No JS config file needed. Design tokens in CSS. |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4 (Jan 2025) | Single import replaces three directives. |
| `framer-motion` package | `motion` package | Late 2024 rebrand | Same library, new name. Import from `motion/react`. |
| CSS `@font-face` | `next/font/local` | Next.js 13+ | Zero CLS, automatic preloading, self-hosting. |
| `tailwindcss` PostCSS plugin | `@tailwindcss/postcss` | Tailwind v4 (Jan 2025) | New plugin name for v4 compatibility. |
| `create-next-app --tailwind` (Tailwind v3) | `create-next-app@15 --tailwind` (Tailwind v4) | Next.js 15.2 (Mar 2025) | Scaffolds v4 CSS-first config by default. |

**Deprecated/outdated:**
- `tailwind.config.ts` / `tailwind.config.js`: v3 pattern. v4 uses CSS-first `@theme`.
- `framer-motion` package: Rebranded to `motion`. Old package still works but is legacy.
- `@tailwind base; @tailwind components; @tailwind utilities;`: v3 directives. v4 uses `@import "tailwindcss"`.
- `react-intersection-observer` library: Motion's `whileInView` replaces this entirely.
- `next-seo` package: Next.js 15's built-in Metadata API is superior.

## Open Questions

1. **Circular Std Font Licensing**
   - What we know: Circular Std is a commercial typeface by Lineto. The font file exists and is used in the existing workout app.
   - What's unclear: Whether the existing license covers web usage on a marketing site.
   - Recommendation: Proceed with Circular Std (it's already in use in the app). If licensing becomes an issue, Inter is a visually similar free alternative available via `next/font/google`.

2. **Logo Optimization**
   - What we know: The logo file is 15.5MB PNG. This needs to be optimized before serving.
   - What's unclear: Whether the logo should be converted to SVG for crisp rendering at all sizes, or just resized/compressed as PNG.
   - Recommendation: Resize to ~400px width and compress. Use `next/image` component for automatic WebP/AVIF conversion. Consider SVG conversion for the navbar logo if a vector version exists.

3. **create-next-app@15 Scaffold Output**
   - What we know: Since Next.js 15.2 (March 2025), `create-next-app@15 --tailwind` scaffolds Tailwind v4 with CSS-first config.
   - What's unclear: Exact scaffolded file contents may vary between 15.2.x patch versions. There may be a `tailwind.config.ts` that needs to be deleted.
   - Recommendation: After scaffolding, verify: (1) `globals.css` has `@import "tailwindcss"` not `@tailwind` directives, (2) `postcss.config.mjs` has `@tailwindcss/postcss`, (3) delete any `tailwind.config.ts` if generated.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 - Install with Next.js](https://tailwindcss.com/docs/guides/nextjs) - Installation commands, PostCSS config, CSS syntax
- [Tailwind CSS v4 - Theme Variables](https://tailwindcss.com/docs/theme) - @theme directive syntax, namespace conventions, utility generation
- [Next.js Official Docs - Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) - next/font/local API, local font pattern, variable option
- [Motion Official Docs - Scroll Animations](https://motion.dev/docs/react-scroll-animations) - whileInView API, viewport options
- [Motion Official Docs - React Installation](https://motion.dev/docs/react-installation) - Installation and import path

### Secondary (MEDIUM confidence)
- [GitHub Discussion: Tailwind v4 + Next.js font variable](https://github.com/tailwindlabs/tailwindcss/discussions/15923) - @theme inline pattern for next/font CSS variables
- [GitHub Discussion: Next.js font variable not applying in Tailwind v4](https://github.com/tailwindlabs/tailwindcss/discussions/13410) - Confirmed @theme inline is required for runtime CSS variables
- [GitHub Discussion: create-next-app Tailwind v4 support](https://github.com/vercel/next.js/discussions/75320) - Lee Robinson confirmed Tailwind v4 support in Next.js 15.2 (March 2025)
- [GitHub Issue: local fonts docs and public folder](https://github.com/vercel/next.js/issues/76573) - Font files should be co-located in app/ not public/
- [OwOlf Blog: Custom Fonts in Next.js 15 + Tailwind v4](https://www.owolf.com/blog/how-to-use-custom-fonts-in-a-nextjs-15-tailwind-4-app) - Working @theme inline pattern

### Tertiary (LOW confidence)
- None -- all findings verified with multiple sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified with official docs and current versions confirmed
- Architecture: HIGH - Patterns verified against official Next.js and Tailwind v4 documentation plus GitHub discussions
- Pitfalls: HIGH - Cross-referenced across multiple GitHub issues and community reports; the @theme vs @theme inline distinction verified by Tailwind maintainer discussions

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (30 days -- stable ecosystem, no major releases expected)
