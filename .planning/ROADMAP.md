# Roadmap: LiftLabb Marketing Website

## Overview

This roadmap delivers the LiftLabb marketing website at `liftlabb.ca` -- a static Next.js landing page designed to convert visitors into free trial users of the workout tracking app at `app.liftlabb.ca`. The project progresses from foundational scaffolding through each page section (top-to-bottom as a visitor scrolls), then adds SEO/performance polish, and culminates in deployment with DNS configuration. Every phase delivers a verifiable slice of the final site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Project Scaffold & Design System** - Next.js 15 project with Tailwind v4, Circular Std font, Motion library, and shared content/animation patterns (completed 2026-02-27)
- [ ] **Phase 2: Navbar** - Sticky glassmorphic navbar with scroll behavior, anchor links, and mobile responsiveness
- [ ] **Phase 3: Hero Section** - Above-the-fold hero with headline, CTAs, phone mockup, and animated entrance
- [ ] **Phase 4: Features & Screenshots** - Feature card grid and screenshot gallery sections with scroll-triggered animations
- [ ] **Phase 5: Pricing & FAQ** - Pricing cards with trial info and accordion FAQ section
- [ ] **Phase 6: Footer & Legal Pages** - Site footer with links and full Privacy Policy / Terms of Service pages
- [ ] **Phase 7: SEO & Performance** - Metadata, structured data, sitemap, robots.txt, image optimization, and animation performance
- [ ] **Phase 8: Deployment & Go Live** - Vercel deployment, GoDaddy DNS for both domains, SSL, and production build verification

## Phase Details

### Phase 1: Project Scaffold & Design System
**Goal**: A running Next.js 15 dev server with the complete LiftLabb design system configured, ready for component development
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` launches a Next.js 15 app with App Router and TypeScript, no errors
  2. Tailwind v4 CSS-first config is active with LiftLabb theme colors (green accent, dark backgrounds) applied via `@theme` directive
  3. Circular Std font renders on all text with no visible layout shift on page load
  4. A test element using Motion `whileInView` animates on scroll in the browser
  5. All landing page text content (headlines, features, FAQ items, pricing) lives in a single `lib/content.ts` file
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md -- Scaffold Next.js 15 project, install Motion, copy asset files (font, icons, logo)
- [ ] 01-02-PLAN.md -- Configure Tailwind v4 design tokens, Circular Std font, content data file, and animation test

### Phase 2: Navbar
**Goal**: Visitors see a polished, sticky navigation bar that transitions from transparent to glassmorphic on scroll and works on all screen sizes
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, NAV-06
**Skill**: frontend-design
**Success Criteria** (what must be TRUE):
  1. Navbar is fixed at the top of the viewport and stays visible while scrolling
  2. Navbar starts transparent at page top and gains a glassmorphic blur/opacity effect after scrolling down
  3. Clicking "Features", "Pricing", or "FAQ" smooth-scrolls to the correct section (with offset for navbar height)
  4. "Launch App" button is visible and links to `https://app.liftlabb.ca`
  5. On mobile viewport, navigation collapses into a hamburger menu that expands to show all links
**Plans**: TBD

Plans:
- [ ] 02-01: TBD

### Phase 3: Hero Section
**Goal**: Visitors immediately see a compelling headline, understand what LiftLabb does, and have a clear path to sign up -- all with a polished animated entrance
**Depends on**: Phase 2
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06, HERO-07
**Skill**: frontend-design
**Success Criteria** (what must be TRUE):
  1. "Track your gains. Ditch the spreadsheet." headline is the first text visitors read, prominently displayed
  2. "Get Started Free" button is visually dominant and links to `https://app.liftlabb.ca`
  3. "See Features" link smooth-scrolls to the features section
  4. A phone mockup frame with placeholder image is visible alongside the text content
  5. On page load, the hero content fades up and scales in using Motion animation, with a radial green glow background effect
**Plans**: 1 plan

Plans:
- [ ] 03-01-PLAN.md -- Hero component with headline, CTAs, phone mockup, stagger animation, and radial green glow

### Phase 4: Features & Screenshots
**Goal**: Visitors scrolling past the hero discover the six core app capabilities in a card grid and see the app in action through a screenshot gallery
**Depends on**: Phase 3
**Requirements**: FEAT-01, FEAT-02, FEAT-03, FEAT-04, FEAT-05, SCRN-01, SCRN-02, SCRN-03, SCRN-04, SCRN-05
**Skill**: frontend-design
**Success Criteria** (what must be TRUE):
  1. "Everything you need to train smarter" section displays six feature cards in a responsive grid (3x2 desktop, 2x3 tablet, single column mobile)
  2. Each feature card shows an icon, title, and description, with a hover glow/lift effect
  3. Feature cards animate into view with staggered timing as the user scrolls to them
  4. "See it in action" section displays placeholder screenshots inside CSS-drawn phone frame mockups
  5. Screenshot gallery scrolls/swipes horizontally on mobile with smooth behavior
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Pricing & FAQ
**Goal**: Visitors understand exactly what LiftLabb costs, see the value of the annual plan, and get answers to common questions -- all driving toward starting a free trial
**Depends on**: Phase 4
**Requirements**: PRIC-01, PRIC-02, PRIC-03, PRIC-04, PRIC-05, PRIC-06, PRIC-07, FAQ-01, FAQ-02, FAQ-03, FAQ-04
**Skill**: frontend-design
**Success Criteria** (what must be TRUE):
  1. "Simple, transparent pricing" section shows Monthly ($2.99/mo) and Annual ($19.99/yr) cards side-by-side on desktop, stacked on mobile
  2. Annual card is visually highlighted with a green glow border and displays "Best Value" badge and "Save 44%" text
  3. Each pricing card has a "Start Free Trial" button linking to `https://app.liftlabb.ca` and a feature checklist
  4. FAQ section displays 6 questions that expand/collapse individually with smooth animation
  5. FAQ content covers platforms, free trial, cancellation, data safety, custom exercises, and offline use
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Footer & Legal Pages
**Goal**: Visitors can access legal information and navigate to the app from the bottom of the page, and full Privacy Policy / Terms of Service pages exist at dedicated routes
**Depends on**: Phase 5
**Requirements**: FOOT-01, FOOT-02, FOOT-03, FOOT-04, FOOT-05, LEGAL-01, LEGAL-02, LEGAL-03, LEGAL-04
**Skill**: frontend-design
**Success Criteria** (what must be TRUE):
  1. Footer displays LiftLabb logo, "Built for lifters, by lifters" tagline, and copyright notice
  2. Footer contains working links to Privacy Policy (`/privacy`), Terms of Service (`/terms`), and the app (`https://app.liftlabb.ca`)
  3. Footer layout stacks vertically on mobile viewports
  4. `/privacy` and `/terms` pages render full legal content ported from the existing app, styled consistently with the dark theme
  5. Each legal page has a "Back to home" link that returns to the landing page
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: SEO & Performance
**Goal**: The site is discoverable by search engines with rich metadata and structured data, and all animations/images are optimized for fast loading
**Depends on**: Phase 6
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Page title and meta description appear correctly for "workout tracker" searches (visible in browser tab and page source)
  2. Sharing the URL on social media (or using an OG preview tool) shows correct title, description, and image
  3. `/sitemap.xml` lists all routes and `/robots.txt` allows all crawlers
  4. Page source contains JSON-LD structured data for SoftwareApplication and FAQPage schemas
  5. All images use `next/image` with responsive sizing, and animations use only GPU-accelerated properties (transform, opacity)
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Deployment & Go Live
**Goal**: The site is live at `liftlabb.ca` with SSL, the app is accessible at `app.liftlabb.ca`, and the production build is error-free
**Depends on**: Phase 7
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05, DEPLOY-06
**Success Criteria** (what must be TRUE):
  1. Visiting `https://liftlabb.ca` in a browser loads the marketing site with a valid SSL certificate
  2. Visiting `https://app.liftlabb.ca` in a browser loads the workout tracking app with a valid SSL certificate
  3. `next build` completes with zero errors and zero warnings
  4. All CTA links on the live site correctly navigate to `https://app.liftlabb.ca`
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffold & Design System | 1/2 | Complete    | 2026-02-27 |
| 2. Navbar | 0/TBD | Not started | - |
| 3. Hero Section | 0/1 | Not started | - |
| 4. Features & Screenshots | 0/TBD | Not started | - |
| 5. Pricing & FAQ | 0/TBD | Not started | - |
| 6. Footer & Legal Pages | 0/TBD | Not started | - |
| 7. SEO & Performance | 0/TBD | Not started | - |
| 8. Deployment & Go Live | 0/TBD | Not started | - |
