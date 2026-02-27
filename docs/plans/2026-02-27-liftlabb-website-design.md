# LiftLabb Marketing Website — Design Document

**Date:** 2026-02-27
**Status:** Approved

## Overview

A marketing landing page for LiftLabb at `liftlabb.ca` that showcases the app's features, pricing, and screenshots, with a "Launch App" link to the web app at `app.liftlabb.ca`.

## Domain Structure

- `liftlabb.ca` → Next.js marketing site (deployed on Vercel)
- `app.liftlabb.ca` → Existing React workout app (Firebase Hosting)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with LiftLabb design tokens
- **Deployment:** Vercel (free tier)
- **Animations:** CSS animations + scroll-triggered effects (eye-catching, polished)

## Design System (from existing app)

### Colors
- Background: `#0a0a0a`
- Card: `#1a1a1a`
- Card2: `#222`
- Text: `#e5e5e5`
- Muted: `#888`
- Accent (green): `#4ade80`
- Yellow: `#facc15`
- Red: `#f87171`
- Blue: `#60a5fa`
- Border: `#333`

### Typography
- Font: Circular Std (Medium) with system fallbacks
- Dark theme throughout, matching the app

### Visual Style
- Dark theme with green accent
- Radial gradient backgrounds (green glow)
- Glassmorphic elements (backdrop blur)
- Rounded corners (10-14px)
- Smooth animations and transitions

## Project Structure

```
liftlabb-website/
├── app/
│   ├── layout.tsx          # Root layout, metadata, fonts
│   ├── page.tsx            # Single landing page (all sections)
│   ├── globals.css         # Tailwind base + design tokens
│   ├── privacy/page.tsx    # Privacy policy
│   └── terms/page.tsx      # Terms of service
├── components/
│   ├── Navbar.tsx          # Logo + nav links + "Launch App" CTA
│   ├── Hero.tsx            # Headline, tagline, CTA, hero image
│   ├── Features.tsx        # Feature grid with icons
│   ├── Screenshots.tsx     # App screenshot carousel/gallery
│   ├── Testimonials.tsx    # User reviews/quotes
│   ├── Pricing.tsx         # Monthly/Annual cards
│   ├── FAQ.tsx             # Accordion Q&A
│   └── Footer.tsx          # Links, legal, socials
├── public/
│   ├── icons/              # App icons (from workout-app)
│   ├── screenshots/        # Real app screenshots
│   └── fonts/              # Circular Std
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Landing Page Sections

### 1. Navbar (sticky, glassmorphic)
- LiftLabb logo (dumbbell icon + text) on the left
- Smooth scroll links: Features, Pricing, FAQ
- "Launch App" button → `app.liftlabb.ca`
- Blur backdrop, fades in on scroll

### 2. Hero Section
- **Headline:** "Track your gains. Ditch the spreadsheet."
- Subtext: Brief 1-liner about what LiftLabb does
- Two CTAs: "Get Started Free" (→ app) + "See Features" (→ scroll)
- Hero image: phone mockup showing the app's Today view
- Animated entrance (fade up + scale)

### 3. Features Section
- **Header:** "Everything you need to train smarter"
- Grid of 6 feature cards with icons:
  1. **Workout Logging** — Log sets, reps, weight, and RIR
  2. **Custom Programs** — Drag-and-drop program builder
  3. **Progression Charts** — Track your lifts over time
  4. **Exercise Library** — 13 categories, add your own
  5. **Cross-device Sync** — Pick up where you left off
  6. **Smart Auto-fill** — Weights pre-filled from last session
- Staggered fade-up animation on scroll

### 4. Screenshots Section
- **Header:** "See it in action"
- Carousel or staggered gallery of real app screenshots
- Phone frame mockups for each screenshot
- Smooth scroll/swipe animations

### 5. Testimonials Section
- **Header:** "What lifters are saying"
- Cards with quotes, names, and avatars
- Placeholder content initially (replace with real testimonials later)
- Slide-in animation

### 6. Pricing Section
- **Header:** "Simple, transparent pricing"
- Two cards:
  - **Monthly:** $2.99/mo — 7-day free trial
  - **Annual:** $19.99/yr — Save 44%, "Best Value" badge, 7-day free trial
- Feature checklist on each card
- CTA: "Start Free Trial" → `app.liftlabb.ca`
- Hover glow effect on cards

### 7. FAQ Section
- **Header:** "Frequently Asked Questions"
- Accordion expand/collapse
- Questions: platforms, cancellation, data safety, exercises, offline use
- Smooth expand animation

### 8. Footer
- LiftLabb logo
- Links: Privacy Policy, Terms of Service
- Tagline: "Built for lifters, by lifters"
- Future: App Store badges

## Assets Pulled from workout-app

| Asset | Source | Destination |
|-------|--------|-------------|
| Color palette | `src/index.css` CSS vars | `tailwind.config.ts` theme |
| Circular Std font | `public/CircularStd-Medium.ttf` | `public/fonts/` |
| App icons | `public/icon-*.png` | `public/icons/` |
| Privacy Policy | `src/components/legal/PrivacyPolicy.jsx` | `app/privacy/page.tsx` |
| Terms of Service | `src/components/legal/TermsOfService.jsx` | `app/terms/page.tsx` |
| Feature descriptions | `PaywallScreen.jsx`, `constants.js` | Component content |
| Pricing info | `PaywallScreen.jsx` | Pricing component |
| App screenshots | Captured from running app | `public/screenshots/` |

## Animation Requirements

- Eye-catching, polished animations throughout
- Scroll-triggered entrance animations (fade, slide, scale)
- Hover effects on interactive elements (glow, lift)
- Smooth transitions between states
- Glassmorphic blur effects
- Will use frontend-design skill during implementation for high design quality

## SEO & Meta

- Title: "LiftLabb — Track your gains. Ditch the spreadsheet."
- Description: Workout tracking app with custom programs, progression charts, and cross-device sync
- Open Graph tags for social sharing
- Proper heading hierarchy (h1-h6)

## Out of Scope

- No Firebase SDK or auth on the marketing site
- No app functionality — "Launch App" is a link to `app.liftlabb.ca`
- No backend — purely static/SSG marketing site
- No payment processing — pricing CTAs link to the app
