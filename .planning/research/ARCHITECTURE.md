# Architecture Patterns

**Domain:** Static SaaS marketing landing page
**Researched:** 2026-02-27
**Confidence:** HIGH

## Recommended Architecture

Single-page static marketing site using Next.js 15 App Router. Server Components by default, Client Components only where interactivity (animations, state) is required.

```
User Request
    |
    v
Vercel CDN (edge, cached globally)
    |
    v
Pre-rendered HTML (SSG at build time)
    |
    v
Client hydration (only for interactive components)
```

### System Overview

```
+---------------------------------------------------------------+
|                     Vercel CDN Edge                            |
|  (Static HTML/CSS/JS served globally, no server at runtime)   |
+---------------------------------------------------------------+
         |
+--------v------------------------------------------------------+
|                    Next.js 15 App Router                       |
|  (Build-time only -- generates static HTML via SSG)           |
|                                                                |
|  +------------------+  +------------------+  +---------------+ |
|  |  Root Layout     |  |  Landing Page    |  |  Legal Pages  | |
|  |  (Server Comp)   |  |  / (Server Comp) |  |  /privacy     | |
|  |  - <html>, fonts |  |  - Composes all  |  |  /terms       | |
|  |  - metadata      |  |    sections      |  |  (Server Comp)| |
|  +--------+---------+  +--------+---------+  +---------------+ |
|           |                      |                              |
|  +--------v----------------------v----------------------------+ |
|  |              Section Components                            | |
|  |  +--------+ +--------+ +--------+ +--------+ +--------+  | |
|  |  | Navbar | | Hero   | |Features| |Screen- | |Testimo-|  | |
|  |  |(Client)| |(Client)| |(Client)| | shots  | | nials  |  | |
|  |  +--------+ +--------+ +--------+ |(Client)| |(Client)|  | |
|  |  +--------+ +--------+ +--------+ +--------+ +--------+  | |
|  |  |Pricing | | FAQ    | | Footer |                         | |
|  |  |(Client)| |(Client)| |(Server)|                         | |
|  |  +--------+ +--------+ +--------+                         | |
|  +------------------------------------------------------------+ |
+----------------------------------------------------------------+
         |
+--------v------------------------------------------------------+
|                      Static Assets                             |
|  public/fonts/  public/icons/  public/screenshots/            |
+---------------------------------------------------------------+
         |
         v
  External link only: app.liftlabb.ca (Firebase Hosting)
  No API calls, no data fetching, no backend communication
```

### Component Boundaries

| Component | Responsibility | Render Mode | Why Client/Server |
|-----------|---------------|-------------|-------------------|
| `app/layout.tsx` | HTML shell, metadata, font loading via `next/font/local` | Server Component | No interactivity needed. Metadata API is server-only. |
| `app/page.tsx` | Composes all 8 sections sequentially | Server Component | Pure composition, no state or browser APIs. |
| `app/privacy/page.tsx` | Privacy policy content | Server Component | Static text, no interactivity. |
| `app/terms/page.tsx` | Terms of service content | Server Component | Static text, no interactivity. |
| `app/sitemap.ts` | Generates sitemap.xml | Build-time function | Next.js convention, runs at build. |
| `app/robots.ts` | Generates robots.txt | Build-time function | Next.js convention, runs at build. |
| `components/Navbar.tsx` | Sticky nav, scroll opacity, mobile menu, CTA | Client Component | Needs `scroll` event listener, `useState` for mobile menu. |
| `components/Hero.tsx` | Headline, CTAs, hero image, entrance animation | Client Component | Motion entrance animation requires client. |
| `components/Features.tsx` | Feature card grid, staggered scroll animation | Client Component | Motion `whileInView` requires client. |
| `components/Screenshots.tsx` | Phone mockup gallery, scroll effects | Client Component | Motion scroll animations or horizontal scroll interaction. |
| `components/Testimonials.tsx` | Review cards, slide-in animation | Client Component | Motion `whileInView` requires client. |
| `components/Pricing.tsx` | Pricing cards, hover effects | Client Component | Motion hover animations. Could be Server if hover is CSS-only. |
| `components/FAQ.tsx` | Accordion expand/collapse | Client Component | `useState` for tracking open/closed items. |
| `components/Footer.tsx` | Logo, links, tagline, copyright | Server Component | Pure static content, no state or browser APIs. |

### Data Flow

This is a fully static site with no dynamic data. All content is hardcoded.

```
Build Time:
  next build --> SSG renders all pages to static HTML
  Tailwind v4 --> Purged, optimized CSS (~6-12KB gzipped)
  next/font --> Font file self-hosted, CSS size-adjust generated
  next/image --> Image manifests created for responsive srcset

Runtime (browser):
  HTML loads --> CSS applies (dark theme, layout)
  JS hydrates --> Client Components become interactive
  User scrolls --> Motion whileInView triggers entrance animations
  User clicks FAQ --> React state toggles accordion items
  User clicks CTA --> Browser navigates to app.liftlabb.ca
```

## Recommended Project Structure

```
liftlabb-website/
+-- app/
|   +-- layout.tsx           # Root layout: <html>, <body>, next/font, metadata
|   +-- page.tsx             # Landing page: composes all sections
|   +-- globals.css          # @import "tailwindcss", @theme tokens, custom utilities
|   +-- sitemap.ts           # Generates sitemap.xml at build time
|   +-- robots.ts            # Generates robots.txt at build time
|   +-- privacy/
|   |   +-- page.tsx         # Privacy policy (static content)
|   +-- terms/
|       +-- page.tsx         # Terms of service (static content)
+-- components/
|   +-- Navbar.tsx           # Sticky glassmorphic navbar
|   +-- Hero.tsx             # Hero section with CTAs
|   +-- Features.tsx         # Feature cards grid
|   +-- Screenshots.tsx      # Phone mockup gallery
|   +-- Testimonials.tsx     # Testimonial cards
|   +-- Pricing.tsx          # Pricing cards
|   +-- FAQ.tsx              # Accordion FAQ
|   +-- Footer.tsx           # Footer with links
+-- lib/
|   +-- content.ts           # Centralized content data (features, FAQs, testimonials, pricing)
+-- public/
|   +-- fonts/
|   |   +-- CircularStd-Medium.ttf   # (or .woff2 if converted)
|   +-- icons/
|   |   +-- icon-180.png
|   |   +-- icon-192.png
|   |   +-- icon-512.png
|   +-- screenshots/         # Real app screenshots (added after Playwright capture)
+-- postcss.config.mjs       # @tailwindcss/postcss plugin
+-- next.config.ts
+-- tsconfig.json
+-- package.json
```

**Structure rationale:**
- **No `tailwind.config.ts`:** Tailwind v4 uses CSS-first `@theme` config in `globals.css`
- **No `lib/animations.ts`:** Motion library handles all animation logic declaratively -- no custom hooks needed
- **`lib/content.ts` for data:** All copy, features, FAQ items, testimonials, and pricing in one typed file. Content changes touch one file, not component code
- **Flat `components/`:** Only 8 components. No subdirectories needed at this scale
- **No `src/` directory:** Small project, `src/` adds unnecessary nesting

## Patterns to Follow

### Pattern 1: Server-First with Client Boundaries

**What:** Default everything to Server Components. Add `"use client"` only where browser APIs are needed.

**When:** Always in Next.js App Router projects.

**Example:**

```tsx
// app/page.tsx -- Server Component (no directive needed)
import Navbar from '@/components/Navbar'        // Client (animations, scroll)
import Hero from '@/components/Hero'            // Client (entrance animation)
import Features from '@/components/Features'    // Client (scroll animation)
import Screenshots from '@/components/Screenshots' // Client (scroll animation)
import Testimonials from '@/components/Testimonials' // Client (scroll animation)
import Pricing from '@/components/Pricing'      // Client (hover animation)
import FAQ from '@/components/FAQ'              // Client (accordion state)
import Footer from '@/components/Footer'        // Server (static content)

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Screenshots />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
```

### Pattern 2: Motion for All Scroll Animations

**What:** Use Motion library's declarative API (`whileInView`, `initial`, `animate`) instead of manual Intersection Observer + CSS class toggling.

**When:** Any component needing scroll-triggered, hover, or entrance animations.

**Example:**

```tsx
// components/Features.tsx
"use client"
import { motion } from "motion/react"
import { features } from "@/lib/content"

export default function Features() {
  return (
    <section id="features" className="py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16"
      >
        Everything you need to train smarter
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-card border border-border rounded-card p-6 hover:shadow-lg hover:shadow-accent/5 transition-shadow"
          >
            <div className="text-accent text-2xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

### Pattern 3: Centralized Content Data

**What:** Store all text content as typed arrays in `lib/content.ts`. Components import and render.

**When:** Any section with repeating content (features, FAQ, testimonials, pricing).

**Example:**

```ts
// lib/content.ts
export const features = [
  {
    title: "Workout Logging",
    description: "Log sets, reps, weight, and RIR for every exercise",
    icon: "dumbbell", // or Lucide component reference
  },
  // ... 5 more
] as const

export const faqItems = [
  {
    question: "What platforms does LiftLabb work on?",
    answer: "LiftLabb works on any device with a web browser...",
  },
  // ... more items
] as const

export const pricingPlans = [
  {
    name: "Monthly",
    price: "$2.99",
    period: "/mo",
    badge: null,
    highlight: false,
  },
  {
    name: "Annual",
    price: "$19.99",
    period: "/yr",
    badge: "Best Value",
    highlight: true,
    savings: "Save 44%",
    monthly: "$1.67/mo",
  },
] as const
```

**Why:** Content changes touch one file. Future CMS integration replaces one import. Placeholder testimonials can be swapped without touching component logic.

### Pattern 4: CSS-First Tailwind v4 Design Tokens

**What:** All design tokens defined in CSS `@theme` blocks, not JavaScript config.

**When:** Project setup. All brand colors, fonts, spacing go here.

**Example:**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-card: #1a1a1a;
  --color-card-2: #222222;
  --color-text: #e5e5e5;
  --color-muted: #999999;  /* bumped from #888 for WCAG AA contrast */
  --color-accent: #4ade80;
  --color-border: #333333;
  --font-circular: var(--font-circular-std);
  --radius-card: 12px;
}

/* Custom glassmorphic utility */
@utility glass {
  background: oklch(from var(--color-card) l c h / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(from var(--color-border) l c h / 0.5);
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: `"use client"` on Everything

**What:** Marking every component `"use client"` because "it's interactive."

**Why bad:** Ships all component code, content strings, and dependencies as JavaScript. Increases bundle size, slows FCP and TTI. For a marketing site, most content is static text.

**Instead:** Only `"use client"` on components using `useState`, `useEffect`, Motion animations, or browser APIs. Footer and legal pages stay as Server Components.

### Anti-Pattern 2: `output: 'export'` on Vercel

**What:** Setting `output: 'export'` in `next.config.ts` because "it's a static site."

**Why bad:** Disables `next/image` optimization entirely. Images serve as unoptimized PNGs. Page weight increases 3-5x. Vercel already serves SSG pages as static assets -- you get static benefits without losing image optimization.

**Instead:** Leave `output` unset (default). Vercel handles it optimally.

### Anti-Pattern 3: Fetching Content via API Routes

**What:** Creating `app/api/content/route.ts` to serve content, then fetching from components.

**Why bad:** Unnecessary network hop. Prevents static generation. Content is known at build time.

**Instead:** Import content directly from `lib/content.ts`. Static import, zero runtime cost.

### Anti-Pattern 4: Deep Component Nesting

**What:** Creating `FeatureCard.tsx`, `FeatureIcon.tsx`, `PricingFeatureList.tsx`, `CTAButton.tsx` for a simple marketing page.

**Why bad:** Over-abstraction. For ~8 sections, deep component trees add file-hopping without reuse benefit. Each needs `"use client"` consideration.

**Instead:** Keep sections as single components. Extract only genuinely reused elements (e.g., a CTA button appearing in Hero AND Pricing).

### Anti-Pattern 5: Using Tailwind v3 Config with v4

**What:** Creating `tailwind.config.ts` with `theme.extend.colors` when Tailwind v4 is installed.

**Why bad:** v4 uses CSS-first `@theme`. JS config may be silently ignored. Design tokens won't generate utilities.

**Instead:** Define all tokens in `globals.css` using `@theme { }` blocks.

## Scalability Considerations

This is a static marketing site. "Scalability" means CDN edge caching, not database scaling.

| Concern | At Launch | At 10K monthly visitors | At 100K monthly visitors |
|---------|-----------|-------------------------|--------------------------|
| Hosting cost | Vercel free tier (100GB bandwidth) | Still free tier | May need Pro ($20/mo) if exceeding 100GB |
| Page load | <1s (SSG + CDN) | Same (static = no degradation) | Same |
| Image optimization | Vercel edge, free tier | Free tier (1000 source images) | May need Pro for more images |
| Adding a blog | Add `app/blog/` with MDX or headless CMS | Still static with ISR | Same |
| Multiple products | Use route groups: `(marketing)/`, `(product)/` | Shared layouts | Same |

## Sources

- [Next.js Official Docs - Project Structure](https://nextjs.org/docs/app/getting-started/project-structure) -- HIGH confidence
- [Next.js Official Docs - Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) -- HIGH confidence
- [Tailwind CSS v4 - Install with Next.js](https://tailwindcss.com/docs/guides/nextjs) -- HIGH confidence
- [Tailwind CSS v4 - Theme Variables](https://tailwindcss.com/docs/theme) -- HIGH confidence
- [Motion - React Installation](https://motion.dev/docs/react-installation) -- HIGH confidence
- [Vercel Pricing](https://vercel.com/pricing) -- HIGH confidence
