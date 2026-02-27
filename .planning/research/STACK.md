# Technology Stack

**Project:** LiftLabb Marketing Website
**Researched:** 2026-02-27

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 15.x (latest 15.x) | Framework, SSG, routing | Already decided. Stick with 15 rather than upgrading to 16 -- this is a simple static marketing site, and 15 is battle-tested. Next.js 16 brings async request APIs as breaking changes, Turbopack as default bundler, and middleware renaming -- complexity this project does not need. `create-next-app@15` pins to 15.x. | HIGH |
| React | 18.x (bundled with Next.js 15) | UI library | Ships with Next.js 15. React 19 ships with Next.js 16 -- another reason to stay on 15 for a simple static site. | HIGH |
| TypeScript | 5.x | Type safety | Non-negotiable in 2026. Catches bugs at build time, improves DX. Next.js scaffolds it by default. | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.x (latest 4.2) | Utility-first CSS | Already decided. v4 is a major improvement: CSS-first config via `@theme` directive (no `tailwind.config.js` needed), ~70% smaller production CSS, and automatic content detection. Use v4 not v3. | HIGH |
| `@tailwindcss/postcss` | 4.x | PostCSS plugin for Tailwind v4 | Required for Tailwind v4 in Next.js. Replaces the old `tailwindcss` PostCSS plugin. | HIGH |

**IMPORTANT: Tailwind v4 Config Change.** The implementation plan references `tailwind.config.ts` -- this is the v3 pattern. Tailwind v4 uses CSS-first configuration with `@theme` in your CSS file. The design tokens should be defined like this:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-card: #1a1a1a;
  --color-card-2: #222222;
  --color-text: #e5e5e5;
  --color-muted: #888888;
  --color-accent: #4ade80;
  --color-yellow: #facc15;
  --color-red: #f87171;
  --color-blue: #60a5fa;
  --color-border: #333333;
  --font-circular: 'Circular Std', -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
  --radius-card: 12px;
}
```

This generates utilities like `bg-bg`, `text-accent`, `font-circular`, `rounded-card` automatically. No JavaScript config file needed.

### Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Motion (formerly Framer Motion) | 12.x (latest) | Scroll animations, entrance effects, hover states | The dominant React animation library (18M+ monthly npm downloads). Rebranded from Framer Motion to Motion in late 2024. Install via `npm install motion`, import from `motion/react`. Provides `whileInView` for scroll-triggered animations (eliminates manual Intersection Observer code), spring physics, layout animations, and gesture support. The hybrid engine uses native browser APIs (Web Animations API, ScrollTimeline) for 120fps performance. | HIGH |

**Why Motion over raw CSS animations or Intersection Observer:**
- The design doc calls for "eye-catching, polished animations throughout" with scroll-triggered staggered entrances, hover effects, and glassmorphic transitions
- Raw CSS `@keyframes` + Intersection Observer (as the implementation plan suggests) requires ~30-50 lines of boilerplate per animated section
- Motion's `whileInView` prop achieves the same with 2-3 lines, plus spring physics and stagger orchestration built in
- Motion is tree-shakeable -- only the features you use get bundled
- `"use client"` is required on animated components regardless (for Intersection Observer too), so there is no SSR penalty difference

**Why NOT GSAP:** Heavier (60KB+), imperative API, commercial license needed for some features. Overkill for a marketing landing page.

**Why NOT AOS (Animate On Scroll):** Unmaintained, not React-native, uses data attributes instead of props. Legacy library.

**Why NOT CSS-only:** The implementation plan's current approach. Works for simple fade-ups but becomes painful for staggered entrances, spring physics, and orchestrated sequences. Motion handles all of this declaratively.

### Font Loading

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `next/font/local` | Built into Next.js | Custom font loading (Circular Std) | Next.js's built-in font optimization. Self-hosts the font, eliminates layout shift via `size-adjust`, preloads at build time. Use this instead of raw `@font-face` in CSS. The implementation plan uses `@font-face` in globals.css -- switch to `next/font/local` for automatic optimization. | HIGH |

**Correct pattern for Circular Std:**

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const circularStd = localFont({
  src: './fonts/CircularStd-Medium.ttf',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-circular',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={circularStd.variable}>
      <body>{children}</body>
    </html>
  )
}
```

Then reference in Tailwind v4 CSS:

```css
@theme {
  --font-circular: var(--font-circular), -apple-system, BlinkMacSystemFont, 'SF Pro', sans-serif;
}
```

**Note:** The font file is `.ttf` (~60KB). Ideally convert to `.woff2` for ~40% smaller size, but `.ttf` works fine with `next/font` and is acceptable for a single-font marketing site.

### Icons

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Lucide React | Latest (0.4x) | Icon library for feature cards and UI elements | Tree-shakeable (only imports icons you use), 1500+ icons, ESM-first, ~29M weekly npm downloads. Lighter than react-icons at scale. Consistent stroke-width aesthetic pairs well with the minimal dark theme. | MEDIUM |

**Why NOT Heroicons:** Only ~316 icons (may not have all needed fitness/workout icons). Designed for Tailwind but Lucide's larger set is more practical.

**Why NOT react-icons:** Massive bundle cost (+81KB at 50 icons vs Lucide's +5KB). Wraps multiple icon sets but tree-shaking is poor.

**Alternative: Inline SVGs.** The design doc mentions "SVG or emoji" for feature icons. If the 6 feature icons are custom-drawn or simple enough, inline SVGs avoid any library dependency. Use Lucide only if you need a consistent icon set beyond the 6 feature cards.

### Image Optimization

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| `next/image` | Built into Next.js | Screenshot and hero image optimization | Automatic WebP/AVIF conversion, lazy loading, responsive `srcset`, and layout shift prevention. Use for all app screenshots and the hero phone mockup. On Vercel, images are optimized at the edge with zero config. | HIGH |

**Usage for phone mockup screenshots:**

```tsx
import Image from 'next/image'

<Image
  src="/screenshots/today-view.png"
  alt="LiftLabb Today View"
  width={375}
  height={812}
  quality={90}
  priority  // for hero image (above the fold)
/>
```

Use `priority` for the hero image only. All other screenshots lazy-load by default.

### SEO

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js Metadata API | Built into Next.js 15 | Title, description, OG tags | Type-safe `metadata` object in `layout.tsx` and `page.tsx`. Already in the implementation plan and correctly implemented. | HIGH |
| `sitemap.ts` (App Router convention) | Built into Next.js 15 | Sitemap generation | Create `app/sitemap.ts` that exports a function returning page URLs. Zero dependencies needed. Next.js generates `sitemap.xml` automatically at build time. | HIGH |
| `robots.ts` (App Router convention) | Built into Next.js 15 | Robots.txt generation | Create `app/robots.ts` that exports rules. Points crawlers to the sitemap. | HIGH |
| JSON-LD structured data | Manual (no library needed) | Schema.org markup for rich search results | Use a `<script type="application/ld+json">` tag in `page.tsx` with `SoftwareApplication` schema for the app. Sanitize with `.replace(/</g, '\\u003c')`. Optional: `schema-dts` package for TypeScript types. | HIGH |

**Sitemap implementation:**

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://liftlabb.ca', lastModified: new Date(), priority: 1.0 },
    { url: 'https://liftlabb.ca/privacy', lastModified: new Date(), priority: 0.3 },
    { url: 'https://liftlabb.ca/terms', lastModified: new Date(), priority: 0.3 },
  ]
}
```

**Robots implementation:**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://liftlabb.ca/sitemap.xml',
  }
}
```

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | Free tier | Hosting, CDN, image optimization | Already decided. Native Next.js support, automatic deployments from Git, edge CDN, image optimization API. Free tier includes 100GB bandwidth/month -- more than enough for a marketing site. | HIGH |
| GoDaddy DNS | N/A | Domain management | Already decided. Configure A/CNAME records to point `liftlabb.ca` to Vercel. | HIGH |

### Dev Dependencies

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| ESLint | Latest (bundled) | Linting | Scaffolded by `create-next-app`. Use the default Next.js ESLint config. | HIGH |
| PostCSS | Latest | CSS processing | Required by Tailwind v4. Scaffolded by setup. | HIGH |

## What NOT to Install

| Library | Why Not |
|---------|---------|
| `tailwind.config.ts` / `tailwind.config.js` | Tailwind v4 uses CSS-first `@theme` config. No JS config file. |
| `@tailwindcss/typography` | Only needed for markdown/prose content. The legal pages can use basic Tailwind utilities. If you find you need prose styling, add it later. |
| `react-intersection-observer` | Motion's `whileInView` replaces this entirely. |
| `next-seo` | Deprecated approach. Next.js 15's built-in Metadata API is superior and type-safe. |
| `next-sitemap` | Unnecessary. Next.js App Router's `sitemap.ts` convention handles this natively. |
| GSAP / AOS / animate.css | Overkill, unmaintained, or non-React-native. Motion covers all animation needs. |
| `react-icons` | Poor tree-shaking, large bundle. Use Lucide or inline SVGs. |
| Shadcn UI | Designed for app UIs with forms, dialogs, etc. A marketing landing page needs custom components, not a component library. Shadcn would add unnecessary abstraction. |
| `framer-motion` | Old package name. Install `motion` instead (same library, rebranded). |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework version | Next.js 15 | Next.js 16 | 16 introduces async request API changes, Turbopack default, middleware renaming -- unnecessary complexity for a static marketing site. 15 is stable and well-documented. |
| Styling | Tailwind CSS v4 | Tailwind CSS v3 | v4 is current, smaller output, better DX with CSS-first config. v3 is legacy. |
| Animation | Motion | CSS-only | CSS animations work for simple fades but lack spring physics, stagger orchestration, and scroll-linked animations that make a landing page feel premium. |
| Animation | Motion | GSAP | Heavier bundle, imperative API, commercial license concerns. Motion is lighter and declarative. |
| Icons | Lucide React | Heroicons | Smaller icon set (316 vs 1500+). Both work with Tailwind. |
| Icons | Lucide React | Inline SVGs | Viable for just 6 feature icons. Lucide adds consistency if more icons needed later. |
| Font loading | next/font/local | CSS @font-face | next/font provides automatic optimization, zero layout shift, and preloading. Raw @font-face misses these. |
| SEO | Built-in Metadata API | next-seo package | next-seo is a third-party wrapper around what Next.js now does natively. Adds a dependency for zero benefit. |
| Static export | Default (no output config) | `output: 'export'` | On Vercel, the default mode is optimal -- Vercel handles SSG pages as static assets automatically. `output: 'export'` disables `next/image` optimization, which we want. Only use `export` for non-Vercel CDN-only deployments. |

## Installation

```bash
# Scaffold project (pins to Next.js 15)
npx create-next-app@15 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Animation library
npm install motion

# Icons (optional -- can use inline SVGs instead)
npm install lucide-react
```

**Note:** Tailwind v4 and PostCSS are installed automatically by `create-next-app` with the `--tailwind` flag. No additional setup needed.

## Implementation Plan Corrections

The existing implementation plan (`docs/plans/2026-02-27-liftlabb-implementation-plan.md`) has several patterns that should be updated:

1. **Tailwind config:** Replace `tailwind.config.ts` with CSS-first `@theme` in `globals.css` (Tailwind v4 pattern)
2. **Font loading:** Replace `@font-face` in CSS with `next/font/local` in `layout.tsx`
3. **Animations:** Replace raw Intersection Observer + CSS `@keyframes` with Motion's `whileInView` and `motion` components
4. **Tailwind directives:** Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";` (v4 syntax)
5. **SEO files:** Add `app/sitemap.ts` and `app/robots.ts` (missing from implementation plan)
6. **JSON-LD:** Add `SoftwareApplication` schema markup (missing from implementation plan)
7. **create-next-app command:** Pin to `@15` to avoid accidentally getting Next.js 16

## Sources

- [Next.js Official Docs - Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) (verified 2026-02-24)
- [Next.js Official Docs - JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) (verified 2026-02-24)
- [Next.js Official Docs - Sitemap Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js Official Docs - Robots Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js Official Docs - Image Optimization](https://nextjs.org/docs/app/getting-started/images)
- [Tailwind CSS v4 - Install with Next.js](https://tailwindcss.com/docs/guides/nextjs) (verified 2026-02-27)
- [Tailwind CSS v4 - Theme Variables](https://tailwindcss.com/docs/theme)
- [Motion Official Site](https://motion.dev/) - Rebrand announcement and docs
- [Motion npm package](https://www.npmjs.com/package/motion) - v12.x
- [Motion Installation Guide](https://motion.dev/docs/react-installation)
- [Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations)
- [Lucide React bundle cost analysis](https://medium.nkcroft.com/the-hidden-bundle-cost-of-react-icons-why-lucide-wins-in-2026-1ddb74c1a86c)
- [Next.js 16 vs 15 comparison](https://www.descope.com/blog/post/nextjs15-vs-nextjs16)
- [Tailwind CSS v4.2 release](https://laravel-news.com/tailwindcss-4-2-0) (Feb 19, 2026)
