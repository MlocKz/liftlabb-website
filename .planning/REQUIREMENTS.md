# Requirements: LiftLabb Marketing Website

**Defined:** 2026-02-27
**Core Value:** Drive signups to the LiftLabb app by making it look polished, trustworthy, and worth trying

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Next.js 15 project scaffolded with App Router, Tailwind v4 (CSS-first config), and TypeScript
- [ ] **FOUND-02**: LiftLabb design system configured via Tailwind `@theme` (colors, font, border-radius from existing app)
- [ ] **FOUND-03**: Circular Std font loaded via `next/font/local` with zero layout shift
- [ ] **FOUND-04**: Motion library installed for scroll-triggered animations
- [ ] **FOUND-05**: Centralized content data file (`lib/content.ts`) for all text, features, FAQ items, pricing
- [ ] **FOUND-06**: Shared scroll animation hook/pattern using Motion `whileInView`

### Navbar

- [ ] **NAV-01**: Sticky navbar with glassmorphic effect (backdrop-blur, semi-transparent)
- [ ] **NAV-02**: LiftLabb logo on the left
- [ ] **NAV-03**: Smooth-scroll anchor links to Features, Pricing, FAQ sections
- [ ] **NAV-04**: "Launch App" CTA button linking to `https://app.liftlabb.ca`
- [ ] **NAV-05**: Scroll-based opacity transition (transparent at top, glass on scroll)
- [ ] **NAV-06**: Mobile-responsive navigation (hamburger menu or simplified)

### Hero

- [ ] **HERO-01**: Headline "Track your gains. Ditch the spreadsheet." prominently displayed
- [ ] **HERO-02**: Subtext describing what LiftLabb does in one line
- [ ] **HERO-03**: Primary CTA "Get Started Free" linking to `https://app.liftlabb.ca`
- [ ] **HERO-04**: Secondary CTA "See Features" smooth-scrolling to features section
- [ ] **HERO-05**: Phone mockup frame (placeholder image, swappable later)
- [ ] **HERO-06**: Animated entrance (fade-up + scale) using Motion
- [ ] **HERO-07**: Radial gradient green glow background effect

### Features

- [ ] **FEAT-01**: Section header "Everything you need to train smarter"
- [ ] **FEAT-02**: 6-card responsive grid (3x2 desktop, 2x3 tablet, 1-col mobile)
- [ ] **FEAT-03**: Each card has icon, title, and description (Workout Logging, Custom Programs, Progression Charts, Exercise Library, Cross-device Sync, Smart Auto-fill)
- [ ] **FEAT-04**: Card styling with dark background, border, hover glow/lift effect
- [ ] **FEAT-05**: Staggered scroll-triggered entrance animation using Motion

### Screenshots

- [ ] **SCRN-01**: Section header "See it in action"
- [ ] **SCRN-02**: Horizontal scrolling gallery or staggered layout
- [ ] **SCRN-03**: CSS-drawn phone frame mockups for each screenshot
- [ ] **SCRN-04**: Placeholder images labeled with screen names (Today View, Program Builder, Charts, etc.)
- [ ] **SCRN-05**: Smooth scroll/swipe on mobile

### Pricing

- [ ] **PRIC-01**: Section header "Simple, transparent pricing" with trial subtext
- [ ] **PRIC-02**: Monthly card ($2.99/mo, 7-day free trial, feature checklist)
- [ ] **PRIC-03**: Annual card ($19.99/yr, "Best Value" badge, "Save 44%", 7-day free trial, feature checklist)
- [ ] **PRIC-04**: Annual card visually highlighted with green glow border
- [ ] **PRIC-05**: CTA "Start Free Trial" on each card linking to `https://app.liftlabb.ca`
- [ ] **PRIC-06**: Hover glow effect on cards
- [ ] **PRIC-07**: Responsive layout (side-by-side desktop, stacked mobile)

### FAQ

- [ ] **FAQ-01**: Section header "Frequently Asked Questions"
- [ ] **FAQ-02**: 6 FAQ items with accordion expand/collapse behavior
- [ ] **FAQ-03**: Smooth expand/collapse animation
- [ ] **FAQ-04**: Content covers: platforms, free trial, cancellation, data safety, custom exercises, offline use

### Footer

- [ ] **FOOT-01**: LiftLabb logo and tagline "Built for lifters, by lifters"
- [ ] **FOOT-02**: Links to Privacy Policy and Terms of Service pages
- [ ] **FOOT-03**: "Launch App" link to `https://app.liftlabb.ca`
- [ ] **FOOT-04**: Copyright notice
- [ ] **FOOT-05**: Responsive layout (stacked on mobile)

### Legal Pages

- [ ] **LEGAL-01**: Privacy Policy page at `/privacy` with full content ported from app
- [ ] **LEGAL-02**: Terms of Service page at `/terms` with full content ported from app
- [ ] **LEGAL-03**: "Back to home" navigation link on each legal page
- [ ] **LEGAL-04**: Consistent dark theme styling matching landing page

### SEO

- [ ] **SEO-01**: Page title and meta description optimized for "workout tracker" searches
- [ ] **SEO-02**: Open Graph tags for social sharing (title, description, image, URL)
- [ ] **SEO-03**: `app/sitemap.ts` generating sitemap.xml with all routes
- [ ] **SEO-04**: `app/robots.ts` generating robots.txt allowing all crawlers
- [ ] **SEO-05**: JSON-LD structured data (SoftwareApplication schema)
- [ ] **SEO-06**: JSON-LD FAQPage schema for FAQ section
- [ ] **SEO-07**: Proper heading hierarchy (h1-h6) across all pages
- [ ] **SEO-08**: Apple touch icon and favicon configured

### Deployment

- [ ] **DEPLOY-01**: Site deployed to Vercel and accessible
- [ ] **DEPLOY-02**: GoDaddy DNS configured: `liftlabb.ca` pointing to Vercel
- [ ] **DEPLOY-03**: GoDaddy DNS configured: `app.liftlabb.ca` CNAME to Firebase Hosting
- [ ] **DEPLOY-04**: SSL certificates provisioned for both domains
- [ ] **DEPLOY-05**: Firebase Hosting custom domain configured for `app.liftlabb.ca`
- [ ] **DEPLOY-06**: Production build passes with zero errors

### Performance

- [ ] **PERF-01**: All images optimized via `next/image` (WebP/AVIF, responsive srcset)
- [ ] **PERF-02**: Glassmorphism (`backdrop-filter: blur`) limited to navbar only
- [ ] **PERF-03**: Animations use only `transform` and `opacity` (GPU-accelerated)
- [ ] **PERF-04**: `scroll-margin-top` on all sections to account for sticky navbar

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content

- **CONT-01**: Real app screenshots captured at iPhone dimensions via Playwright
- **CONT-02**: Testimonials section with real user quotes
- **CONT-03**: App Store / Google Play badges in footer
- **CONT-04**: Blog section for SEO content marketing

### Analytics

- **ANLY-01**: Vercel Analytics integration for traffic monitoring
- **ANLY-02**: Conversion tracking (CTA click-through rates)

### Enhancements

- **ENH-01**: Stat/trust bar between Hero and Features ("13+ exercise categories", "7-day free trial")
- **ENH-02**: Video demo or animated GIF showing app in use
- **ENH-03**: Comparison table (LiftLabb vs spreadsheets vs competitors)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Firebase SDK / auth on marketing site | Purely static site — all app functionality at app.liftlabb.ca |
| Payment processing | Pricing CTAs link to app, no checkout on marketing site |
| Backend / API routes | Fully static SSG — no server-side logic |
| Testimonials section (v1) | No real testimonials yet — placeholder testimonials risk looking fake and harming trust |
| Real app screenshots (v1) | Will use placeholders first, capture real ones in v2 |
| Mobile app (React Native / Capacitor) | Existing Capacitor app is separate project |
| Internationalization (i18n) | English only for v1 — single market (.ca domain) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | TBD | Pending |
| FOUND-02 | TBD | Pending |
| FOUND-03 | TBD | Pending |
| FOUND-04 | TBD | Pending |
| FOUND-05 | TBD | Pending |
| FOUND-06 | TBD | Pending |
| NAV-01 | TBD | Pending |
| NAV-02 | TBD | Pending |
| NAV-03 | TBD | Pending |
| NAV-04 | TBD | Pending |
| NAV-05 | TBD | Pending |
| NAV-06 | TBD | Pending |
| HERO-01 | TBD | Pending |
| HERO-02 | TBD | Pending |
| HERO-03 | TBD | Pending |
| HERO-04 | TBD | Pending |
| HERO-05 | TBD | Pending |
| HERO-06 | TBD | Pending |
| HERO-07 | TBD | Pending |
| FEAT-01 | TBD | Pending |
| FEAT-02 | TBD | Pending |
| FEAT-03 | TBD | Pending |
| FEAT-04 | TBD | Pending |
| FEAT-05 | TBD | Pending |
| SCRN-01 | TBD | Pending |
| SCRN-02 | TBD | Pending |
| SCRN-03 | TBD | Pending |
| SCRN-04 | TBD | Pending |
| SCRN-05 | TBD | Pending |
| PRIC-01 | TBD | Pending |
| PRIC-02 | TBD | Pending |
| PRIC-03 | TBD | Pending |
| PRIC-04 | TBD | Pending |
| PRIC-05 | TBD | Pending |
| PRIC-06 | TBD | Pending |
| PRIC-07 | TBD | Pending |
| FAQ-01 | TBD | Pending |
| FAQ-02 | TBD | Pending |
| FAQ-03 | TBD | Pending |
| FAQ-04 | TBD | Pending |
| FOOT-01 | TBD | Pending |
| FOOT-02 | TBD | Pending |
| FOOT-03 | TBD | Pending |
| FOOT-04 | TBD | Pending |
| FOOT-05 | TBD | Pending |
| LEGAL-01 | TBD | Pending |
| LEGAL-02 | TBD | Pending |
| LEGAL-03 | TBD | Pending |
| LEGAL-04 | TBD | Pending |
| SEO-01 | TBD | Pending |
| SEO-02 | TBD | Pending |
| SEO-03 | TBD | Pending |
| SEO-04 | TBD | Pending |
| SEO-05 | TBD | Pending |
| SEO-06 | TBD | Pending |
| SEO-07 | TBD | Pending |
| SEO-08 | TBD | Pending |
| DEPLOY-01 | TBD | Pending |
| DEPLOY-02 | TBD | Pending |
| DEPLOY-03 | TBD | Pending |
| DEPLOY-04 | TBD | Pending |
| DEPLOY-05 | TBD | Pending |
| DEPLOY-06 | TBD | Pending |
| PERF-01 | TBD | Pending |
| PERF-02 | TBD | Pending |
| PERF-03 | TBD | Pending |
| PERF-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 60 total
- Mapped to phases: 0
- Unmapped: 60 (awaiting roadmap)

---
*Requirements defined: 2026-02-27*
*Last updated: 2026-02-27 after initial definition*
