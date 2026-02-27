# LiftLabb Marketing Website

## What This Is

A marketing landing page for LiftLabb — a workout tracking app for lifters of all levels. The site at `liftlabb.ca` showcases the app's features, pricing, and real screenshots, with the primary goal of driving free trial signups to the web app at `app.liftlabb.ca`. Secondary goals are establishing brand credibility and SEO presence for workout tracker searches.

## Core Value

Drive signups to the LiftLabb app by making it look polished, trustworthy, and worth trying — the site must convert visitors into free trial users.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Marketing landing page with 8 sections (Navbar, Hero, Features, Screenshots, Testimonials, Pricing, FAQ, Footer)
- [ ] Dark theme matching the app's design system (green accent, glassmorphic elements)
- [ ] Eye-catching scroll animations and entrance effects
- [ ] Real app screenshots captured at iPhone dimensions
- [ ] Pricing display ($2.99/mo, $19.99/yr with 7-day free trial)
- [ ] Privacy Policy and Terms of Service pages (ported from app)
- [ ] SEO metadata and Open Graph tags
- [ ] Mobile-responsive design (phone-first)
- [ ] Domain setup: `liftlabb.ca` → Vercel (marketing site)
- [ ] Domain setup: `app.liftlabb.ca` → Firebase Hosting (workout app)
- [ ] Vercel deployment configuration
- [ ] GoDaddy DNS configuration for both domains

### Out of Scope

- Firebase SDK or auth on the marketing site — it's purely static
- Payment processing — pricing CTAs link to the app
- App functionality — "Launch App" is just a link to `app.liftlabb.ca`
- Backend or API routes — fully static/SSG site
- Real testimonials for v1 — use placeholders, swap later

## Context

- **Existing app:** LiftLabb workout tracker at `workout-tracker-cole.web.app` (React + Firebase + Capacitor)
- **Current domain:** `liftlabb.ca` registered on GoDaddy, not yet configured
- **App features:** Workout logging (sets/reps/weight/RIR), custom programs with drag-and-drop builder, progression charts, exercise library (13+ categories), cross-device sync, smart auto-fill from previous sessions
- **Pricing:** Monthly $2.99, Annual $19.99 (web). iOS is $3.99/$25.99. 7-day free trial on all plans.
- **Target audience:** All lifters — beginners wanting structure through serious athletes needing detailed tracking
- **Design assets available:** Color palette, Circular Std font, app icons, legal content — all from existing workout-app project at `/Users/colematlock/Library/Mobile Documents/com~apple~CloudDocs/Aussy plan/workout-app/`
- **App login for screenshots:** colematlock18@outlook.com (capture at iPhone viewport size using Playwright)
- **Existing design doc:** `docs/plans/2026-02-27-liftlabb-website-design.md` (approved)
- **Existing implementation plan:** `docs/plans/2026-02-27-liftlabb-implementation-plan.md`

## Constraints

- **Tech stack:** Next.js 15 (App Router) + Tailwind CSS — decision already made in design doc
- **Deployment:** Vercel free tier for marketing site
- **Domain registrar:** GoDaddy — DNS records managed there
- **App hosting:** Firebase Hosting for `app.liftlabb.ca` subdomain
- **Font licensing:** Circular Std (already in use in the app, file available locally)
- **Budget:** Free tier only (Vercel, no paid services)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 15 + Tailwind CSS | Matches modern best practices, fast static site, great Vercel integration | — Pending |
| Vercel for hosting | Free tier, native Next.js support, easy domain setup | — Pending |
| Pull design system from app | Consistency between marketing site and product, no design work needed | — Pending |
| Placeholder testimonials | No real testimonials yet, can swap later without code changes | — Pending |
| Capture real screenshots via Playwright | Authentic representation of the app, iPhone viewport for mobile feel | — Pending |
| GoDaddy DNS → Vercel + Firebase | Single registrar manages both domains, straightforward setup | — Pending |

---
*Last updated: 2026-02-27 after initialization*
