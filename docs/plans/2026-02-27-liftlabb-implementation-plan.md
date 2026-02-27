# LiftLabb Marketing Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Use frontend-design skill for all component implementation tasks (Tasks 5-12).

**Goal:** Build a polished, dark-themed marketing landing page for LiftLabb at `liftlabb.ca` using Next.js 15 + Tailwind CSS, with eye-catching animations and glassmorphic design.

**Architecture:** Static Next.js site with App Router. Single landing page (`/`) with smooth-scroll sections, plus `/privacy` and `/terms` routes. All components are server-rendered with client interactivity only for scroll animations and accordion behavior. No backend, no auth, no payments on this site.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS v4, TypeScript, Vercel deployment

**Design Doc:** `docs/plans/2026-02-27-liftlabb-website-design.md`

**Source App (for assets):** `/Users/colematlock/Library/Mobile Documents/com~apple~CloudDocs/Aussy plan/workout-app/`

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`

**Step 1: Scaffold Next.js 15 with App Router + Tailwind**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack
```

Accept defaults. This creates the full project scaffold.

**Step 2: Verify it runs**

Run: `npm run dev`
Expected: Dev server starts at `http://localhost:3000`, shows Next.js default page.

**Step 3: Clean up boilerplate**

- Remove all content from `app/page.tsx` (replace with a simple `<main>LiftLabb</main>`)
- Remove default styles from `app/globals.css` (keep only Tailwind directives)

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 project with Tailwind"
```

---

## Task 2: Copy Assets from Workout App

**Files:**
- Create: `public/fonts/CircularStd-Medium.ttf`
- Create: `public/icons/icon-180.png`, `public/icons/icon-192.png`, `public/icons/icon-512.png`

**Step 1: Create asset directories**

```bash
mkdir -p public/fonts public/icons public/screenshots
```

**Step 2: Copy font file**

```bash
cp "/Users/colematlock/Library/Mobile Documents/com~apple~CloudDocs/Aussy plan/workout-app/public/CircularStd-Medium.ttf" public/fonts/
```

**Step 3: Copy icon files**

```bash
cp "/Users/colematlock/Library/Mobile Documents/com~apple~CloudDocs/Aussy plan/workout-app/public/icon-180.png" public/icons/
cp "/Users/colematlock/Library/Mobile Documents/com~apple~CloudDocs/Aussy plan/workout-app/public/icon-192.png" public/icons/
cp "/Users/colematlock/Library/Mobile Documents/com~apple~CloudDocs/Aussy plan/workout-app/public/icon-512.png" public/icons/
```

**Step 4: Commit**

```bash
git add public/
git commit -m "chore: copy font and icon assets from workout-app"
```

---

## Task 3: Configure Design System (Tailwind + Global CSS)

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Configure Tailwind with LiftLabb design tokens**

`tailwind.config.ts` — extend theme with brand colors, font, border radius:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        card: "#1a1a1a",
        card2: "#222222",
        text: "#e5e5e5",
        muted: "#888888",
        accent: "#4ade80",
        yellow: "#facc15",
        red: "#f87171",
        blue: "#60a5fa",
        border: "#333333",
      },
      fontFamily: {
        circular: ["'Circular Std'", "-apple-system", "BlinkMacSystemFont", "'SF Pro'", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Set up global CSS with font-face and base styles**

`app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Circular Std';
  src: url('/fonts/CircularStd-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@layer base {
  body {
    @apply bg-bg text-text font-circular antialiased;
    line-height: 1.5;
  }
}

/* Scroll behavior for smooth anchor links */
html {
  scroll-behavior: smooth;
}

/* Glassmorphic utility */
@layer utilities {
  .glass {
    @apply bg-card/80 backdrop-blur-xl border border-border/50;
  }
}
```

**Step 3: Verify styles load**

Run: `npm run dev`
Expected: Page has dark `#0a0a0a` background and `#e5e5e5` text.

**Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure LiftLabb design system with brand colors and font"
```

---

## Task 4: Root Layout + Metadata

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Set up root layout with SEO metadata**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiftLabb — Track your gains. Ditch the spreadsheet.",
  description:
    "Workout tracking app with custom programs, progression charts, and cross-device sync. Start your free trial today.",
  openGraph: {
    title: "LiftLabb — Track your gains. Ditch the spreadsheet.",
    description:
      "Workout tracking app with custom programs, progression charts, and cross-device sync.",
    url: "https://liftlabb.ca",
    siteName: "LiftLabb",
    type: "website",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-180.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Step 2: Verify metadata renders**

Run: `npm run dev`, inspect `<head>` in browser devtools.
Expected: Title, description, OG tags, and icon links present.

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with SEO metadata and OG tags"
```

---

## Task 5: Navbar Component

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Navbar.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Sticky top, glassmorphic (backdrop-blur + semi-transparent bg)
- Left: LiftLabb logo (dumbbell icon or text)
- Center/right: smooth-scroll links — Features, Pricing, FAQ
- Far right: "Launch App" CTA button (green accent, links to `https://app.liftlabb.ca`)
- Fades in / becomes opaque on scroll
- Mobile: hamburger menu or simplified nav
- z-index high enough to stay on top of all sections

**Step 1: Build the Navbar component**

Use `"use client"` directive (needs scroll listener). Include:
- Scroll-based opacity transition (transparent at top → glass on scroll)
- Smooth scroll `<a href="#features">` etc.
- "Launch App" as `<a href="https://app.liftlabb.ca">` styled as green button
- Mobile responsive (collapsible menu)

**Step 2: Import into page.tsx**

Add `<Navbar />` at top of page.

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Sticky navbar, transparent at top, glassmorphic on scroll, links work.

**Step 4: Commit**

```bash
git add components/Navbar.tsx app/page.tsx
git commit -m "feat: add glassmorphic sticky navbar with scroll behavior"
```

---

## Task 6: Hero Section

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Headline: **"Track your gains. Ditch the spreadsheet."**
- Subtext: "The workout tracker built for lifters who care about progression. Log sets, build programs, and watch your numbers climb."
- Two CTAs:
  - "Get Started Free" → `https://app.liftlabb.ca` (primary green button)
  - "See Features" → `#features` (secondary outline button)
- Right side / below: phone mockup frame (placeholder image for now, will add real screenshot later)
- Background: radial gradient green glow — `radial-gradient(ellipse at 50% 30%, rgba(74,222,128,0.06) 0%, transparent 60%)`
- Animated entrance: fade-up + slight scale on load
- Full viewport height (min-h-screen), centered content

**Step 1: Build the Hero component**

Animated entrance using CSS `@keyframes` + Tailwind `animate-` classes.

**Step 2: Add to page.tsx**

**Step 3: Verify — should be visually striking, centered, animated entrance**

**Step 4: Commit**

```bash
git add components/Hero.tsx app/page.tsx
git commit -m "feat: add hero section with headline, CTAs, and entrance animation"
```

---

## Task 7: Features Section

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Features.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Section id: `features`
- Header: "Everything you need to train smarter"
- 6-card grid (3x2 on desktop, 2x3 on tablet, 1x6 on mobile)
- Each card:
  - Icon (use SVG or emoji)
  - Title + description
  - Card background: `#1a1a1a` with `#333` border
  - Hover: subtle glow/lift effect
- Staggered fade-up animation on scroll (each card enters slightly after the previous)

**Feature cards content:**

| # | Title | Description | Icon idea |
|---|-------|-------------|-----------|
| 1 | Workout Logging | Log sets, reps, weight, and RIR for every exercise | Dumbbell |
| 2 | Custom Programs | Build your own training programs with drag-and-drop | Clipboard |
| 3 | Progression Charts | Visualize your strength gains over time | Chart trending up |
| 4 | Exercise Library | Browse 13+ categories or add your own exercises | Book/library |
| 5 | Cross-device Sync | Start on your phone, finish on your laptop | Sync arrows |
| 6 | Smart Auto-fill | Weights pre-filled from your last session | Lightning bolt |

**Step 1: Build Features component with scroll-triggered animations**

Use Intersection Observer (`"use client"`) for scroll-triggered staggered entrance.

**Step 2: Add to page.tsx with `id="features"`**

**Step 3: Verify — cards animate in on scroll, grid is responsive**

**Step 4: Commit**

```bash
git add components/Features.tsx app/page.tsx
git commit -m "feat: add features section with scroll-animated card grid"
```

---

## Task 8: Screenshots Section

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Screenshots.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Header: "See it in action"
- Horizontal scrolling gallery or staggered layout
- Each screenshot in a phone-frame mockup (CSS-drawn phone bezel)
- Placeholder colored rectangles for now (labeled "Today View", "Program Builder", "Charts", etc.) — real screenshots will be added later
- Smooth scroll/swipe on mobile
- Subtle parallax or scale effect on hover

**Step 1: Build Screenshots component**

Create phone frame mockup with CSS (rounded rect with notch). Use placeholder gradient fills labeled with screen names.

**Step 2: Add to page.tsx**

**Step 3: Verify — phone frames look realistic, horizontal scroll works on mobile**

**Step 4: Commit**

```bash
git add components/Screenshots.tsx app/page.tsx
git commit -m "feat: add screenshots section with phone mockup gallery"
```

---

## Task 9: Testimonials Section

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Testimonials.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Header: "What lifters are saying"
- 3 testimonial cards with:
  - Quote text
  - Name + "Lifter" subtitle
  - Avatar (colored circle with initials for now)
- Cards on `#1a1a1a` background
- Slide-in animation on scroll
- Placeholder content (will be replaced with real testimonials):

| Name | Quote |
|------|-------|
| Alex M. | "Finally an app that actually understands how lifters train. The auto-fill feature saves me so much time." |
| Sarah K. | "I switched from spreadsheets and never looked back. The progression charts are addicting." |
| Jordan R. | "Clean, fast, no bloat. Just logs my lifts and gets out of the way. Exactly what I wanted." |

**Step 1: Build Testimonials component with slide-in animation**

**Step 2: Add to page.tsx**

**Step 3: Verify — cards slide in on scroll, look polished**

**Step 4: Commit**

```bash
git add components/Testimonials.tsx app/page.tsx
git commit -m "feat: add testimonials section with placeholder reviews"
```

---

## Task 10: Pricing Section

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Pricing.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Section id: `pricing`
- Header: "Simple, transparent pricing"
- Subtext: "Start with a 7-day free trial. Cancel anytime."
- Two cards side by side:

**Monthly card:**
- Title: "Monthly"
- Price: "$2.99/mo"
- "7-day free trial"
- Feature list: Unlimited workouts, Custom programs, Progression charts, Exercise library, Cross-device sync
- CTA: "Start Free Trial" → `https://app.liftlabb.ca`

**Annual card (highlighted):**
- "Best Value" badge (green)
- Title: "Annual"
- Price: "$19.99/yr"
- Subtext: "~$1.67/mo — Save 44%"
- "7-day free trial"
- Same feature list
- CTA: "Start Free Trial" → `https://app.liftlabb.ca`
- Glow border effect (green accent)

**Both cards:**
- Hover glow effect
- Card bg: `#1a1a1a`
- Checkmark icons for feature list
- Responsive: stack on mobile

**Step 1: Build Pricing component**

**Step 2: Add to page.tsx with `id="pricing"`**

**Step 3: Verify — two cards, annual highlighted with badge and glow, hover effects work**

**Step 4: Commit**

```bash
git add components/Pricing.tsx app/page.tsx
git commit -m "feat: add pricing section with monthly and annual cards"
```

---

## Task 11: FAQ Section

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/FAQ.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Section id: `faq`
- Header: "Frequently Asked Questions"
- Accordion with smooth expand/collapse animation
- `"use client"` for interactivity
- FAQ items:

| Question | Answer |
|----------|--------|
| What platforms does LiftLabb work on? | LiftLabb works on any device with a web browser — phone, tablet, or computer. An iOS app is also available. Your data syncs across all devices automatically. |
| How does the free trial work? | You get 7 days of full access to all features. No charge until your trial ends. Cancel anytime before and you won't be billed. |
| Can I cancel my subscription? | Yes, cancel anytime. On web, go to Settings → Manage Subscription. On iOS, manage through your Apple ID settings. You keep access until the end of your billing period. |
| Is my data safe? | Your data is stored securely with Google Firebase, encrypted in transit and at rest. Only you can access your workout data through your authenticated account. |
| Can I add my own exercises? | Absolutely. LiftLabb comes with a library of exercises across 13+ categories, and you can add custom exercises at any time. |
| Does it work offline? | The web app requires an internet connection. The iOS app supports offline workout logging that syncs when you reconnect. |

**Step 1: Build FAQ component with accordion behavior**

Use React state for open/close toggle per item. CSS transitions for height animation.

**Step 2: Add to page.tsx with `id="faq"`**

**Step 3: Verify — accordion expands/collapses smoothly, only one open at a time**

**Step 4: Commit**

```bash
git add components/FAQ.tsx app/page.tsx
git commit -m "feat: add FAQ section with animated accordion"
```

---

## Task 12: Footer Component

> **Use frontend-design skill** for this task.

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/page.tsx`

**Design requirements:**
- Dark background (slightly lighter than page: `#111` or `card` color)
- Top border: `#333`
- Layout:
  - Left: LiftLabb logo + tagline "Built for lifters, by lifters"
  - Center: Links — Privacy Policy (`/privacy`), Terms of Service (`/terms`)
  - Right: "Launch App" link → `https://app.liftlabb.ca`
- Bottom: `© 2026 LiftLabb. All rights reserved.`
- Responsive: stack vertically on mobile

**Step 1: Build Footer component**

**Step 2: Add to page.tsx**

**Step 3: Verify — footer renders, links navigate correctly**

**Step 4: Commit**

```bash
git add components/Footer.tsx app/page.tsx
git commit -m "feat: add footer with links, tagline, and copyright"
```

---

## Task 13: Privacy Policy Page

**Files:**
- Create: `app/privacy/page.tsx`

**Step 1: Build privacy policy page**

Port content from workout-app's `PrivacyPolicy.jsx` into a Next.js page. Same dark theme styling. Content sections:

- Overview ("LiftLabb is operated by Cole Matlock...")
- Data We Collect (email, display name, workout data, subscription data, device info)
- How We Use Your Data (provide app, manage subscriptions, sync, improve)
- Third-Party Services (Firebase, Stripe, RevenueCat)
- Data Storage & Security (Firebase encryption)
- Data Deletion (from Settings page)
- Children's Privacy (not for under 13)
- Contact: colematlock18@gmail.com
- Last updated: February 26, 2026

Style with Tailwind prose classes on dark theme. Add a "← Back to home" link at top.

**Step 2: Verify — page renders at `/privacy`, content is readable**

**Step 3: Commit**

```bash
git add app/privacy/page.tsx
git commit -m "feat: add privacy policy page"
```

---

## Task 14: Terms of Service Page

**Files:**
- Create: `app/terms/page.tsx`

**Step 1: Build terms of service page**

Port content from workout-app's `TermsOfService.jsx`. Key sections:

1. Acceptance of Terms
2. Description of Service (fitness tracking, workouts, programs, progression)
3. Subscriptions & Payments (Monthly $2.99, Annual $19.99, 7-day trial, auto-renewal)
4. Cancellation & Refunds (cancel anytime, access through billing period, refund policies)
5. User Responsibilities
6. Intellectual Property
7. Privacy (link to `/privacy`)
8. Modifications to Service
9. Limitation of Liability ("as is", not liable for injuries)
10. Apple-Specific Terms (EULA reference)
11. Contact: colematlock18@gmail.com
- Last updated: February 26, 2026

Same styling approach as privacy page.

**Step 2: Verify — page renders at `/terms`, content is readable**

**Step 3: Commit**

```bash
git add app/terms/page.tsx
git commit -m "feat: add terms of service page"
```

---

## Task 15: Final Polish + Animation Pass

**Files:**
- Modify: `app/globals.css` (add keyframe animations)
- Modify: Various components as needed

**Step 1: Add global animation keyframes**

In `globals.css`, add:
- `fadeUp` — opacity 0→1, translateY 20px→0
- `fadeIn` — opacity 0→1
- `slideInLeft` / `slideInRight` — translateX animations
- `scaleIn` — scale 0.95→1 + opacity
- `glow` — box-shadow pulse for hover effects

**Step 2: Review each section for consistency**

- Verify scroll animations trigger correctly
- Verify hover effects on cards and buttons
- Verify glassmorphic navbar behavior
- Check mobile responsiveness on all sections
- Verify all links work (smooth scroll + external)

**Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: polish animations and final responsive tweaks"
```

---

## Task 16: Build Verification + Deployment Prep

**Files:**
- Possibly modify: `next.config.ts`

**Step 1: Run full production build**

```bash
npm run build && npm run start
```

Expected: Builds successfully, serves at `http://localhost:3000`.

**Step 2: Test all pages**

- `/` — landing page with all 8 sections
- `/privacy` — privacy policy page
- `/terms` — terms of service page
- All smooth-scroll links work
- All external links open correctly
- Mobile responsive at 375px, 768px, 1024px, 1440px widths

**Step 3: Verify meta tags**

Check `<head>` for title, description, OG tags, and icon references.

**Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final build verification and deployment prep"
```

---

## Execution Notes

- **Tasks 5-12** (all component tasks) MUST use the `frontend-design` skill to ensure high design quality, polished animations, and distinctive visual identity
- **Placeholder screenshots** will be used initially — real app screenshots can be captured and added later
- **Placeholder testimonials** will be used — real ones can be swapped in later
- All components should be mobile-first responsive
- Keep the site fully static (no `"use server"` actions, no API routes)
- Font file is ~60KB TTF — acceptable for a marketing site
