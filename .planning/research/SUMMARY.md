# Research Summary: LiftLabb Marketing Website

**Domain:** SaaS marketing landing page (fitness/workout tracking app)
**Researched:** 2026-02-27
**Overall confidence:** HIGH

## Executive Summary

The LiftLabb marketing website is a well-scoped project: a static Next.js landing page deployed on Vercel, designed to convert visitors into free trial users for a workout tracking SaaS. The core tech decisions (Next.js + Tailwind CSS + Vercel) are solid and align perfectly with 2025/2026 best practices for this type of site.

The primary research finding is that the existing implementation plan uses several Tailwind v3 and pre-Motion patterns that need updating. Tailwind CSS v4 (released Jan 2025, now at v4.2) fundamentally changed configuration from JavaScript files to CSS-first `@theme` directives. The animation approach in the implementation plan (raw CSS `@keyframes` + Intersection Observer) should be replaced with Motion (the rebranded Framer Motion, 18M+ monthly npm downloads) which provides declarative scroll-triggered animations, spring physics, and stagger orchestration with far less code. Font loading should use `next/font/local` instead of raw `@font-face` for automatic optimization.

Next.js 16 has been released (Dec 2025), but this project should stay on Next.js 15. Version 16 introduces breaking changes (async request APIs, Turbopack as default, middleware renaming) that add complexity without benefit for a simple static site. Pinning `create-next-app@15` ensures stability.

The SEO strategy should be expanded beyond the current plan's basic metadata. Next.js App Router provides native `sitemap.ts` and `robots.ts` file conventions that generate XML/txt files at build time with zero dependencies. Adding JSON-LD structured data (`SoftwareApplication` schema) will improve search result appearance. These are minimal-effort, high-impact additions.

## Key Findings

**Stack:** Next.js 15 + Tailwind CSS v4 + Motion + Vercel. Stick with 15 (not 16). Use CSS-first Tailwind v4 config, not JavaScript config files.
**Architecture:** Single-page SSG marketing site with App Router. Server Components for all static content, `"use client"` only for interactive elements (navbar scroll, accordion, animations).
**Critical pitfall:** The implementation plan uses Tailwind v3 patterns (`tailwind.config.ts`, `@tailwind` directives) that will not work correctly with Tailwind v4's CSS-first approach. Must update before implementation.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Project Scaffold + Design System** - Set up Next.js 15, Tailwind v4 (CSS-first config), font loading via `next/font/local`, Motion library
   - Addresses: Foundation, design tokens, font optimization
   - Avoids: Tailwind v3/v4 config mismatch pitfall

2. **Core Sections (Above the Fold)** - Navbar + Hero with Motion entrance animations
   - Addresses: First impression, primary CTA, glassmorphic effects
   - Avoids: Animation boilerplate (uses Motion instead of raw IntersectionObserver)

3. **Content Sections** - Features, Screenshots, Testimonials, Pricing, FAQ
   - Addresses: Conversion-driving content, scroll animations
   - Avoids: Over-engineering (simple components with Motion whileInView)

4. **SEO + Legal + Polish** - Sitemap, robots.txt, JSON-LD, Privacy/Terms pages, final animation pass
   - Addresses: Search visibility, legal requirements, polish
   - Avoids: Forgetting SEO files (common pitfall)

5. **Deployment** - Vercel setup, GoDaddy DNS, domain verification
   - Addresses: Going live
   - Avoids: DNS propagation issues (plan ahead)

**Phase ordering rationale:**
- Design system must come first because every component depends on it
- Above-the-fold content (Hero) comes before below-the-fold because it is the highest-impact visual
- SEO files are late because they depend on knowing all routes
- Deployment is last because it requires a complete build

**Research flags for phases:**
- Phase 1: Needs careful attention to Tailwind v4 setup (CSS-first config differs from most tutorials)
- Phase 5: DNS propagation and Vercel domain setup may need troubleshooting

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core choices verified against official docs (Next.js, Tailwind, Motion). Versions confirmed current. |
| Features | HIGH | Standard SaaS landing page sections. Well-established patterns. |
| Architecture | HIGH | Static Next.js on Vercel is the most common deployment pattern. No novel architecture decisions. |
| Pitfalls | MEDIUM | Tailwind v4 migration patterns verified. Motion + App Router compatibility confirmed. DNS setup is standard but environment-specific. |

## Gaps to Address

- **Circular Std font licensing:** The font is already in use in the app, but licensing terms for web use should be confirmed. Circular Std is a commercial font.
- **Screenshot capture workflow:** The implementation plan mentions Playwright for screenshots, but specifics of the capture pipeline are not researched here (separate concern from stack).
- **Analytics:** No analytics solution was specified. Consider adding Vercel Analytics (free tier) or a lightweight alternative like Plausible/Umami if analytics are needed.
- **Performance budget:** No specific Core Web Vitals targets were set. For a marketing site, aim for LCP < 2.5s, CLS < 0.1, INP < 200ms.
