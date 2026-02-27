# Feature Landscape

**Domain:** SaaS marketing landing page (fitness/workout tracking app)
**Researched:** 2026-02-27
**Confidence:** HIGH

## Table Stakes

Features users expect on a SaaS marketing landing page. Missing = product looks amateur.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hero with clear value prop** | First thing visitors see. Users decide in 3-5 seconds whether to stay. | Low | "Track your gains. Ditch the spreadsheet." -- specific, differentiating, benefits-first. |
| **Primary CTA above the fold** | "Start free" or "Try for free" appears on every high-performing SaaS page. Free trials outperform "Book a demo" for self-serve products. | Low | "Get Started Free" linking to app. Correct approach. |
| **Feature showcase (6 features)** | Users need to understand what they get before signing up. Scannable grid with icons is the standard pattern. | Low | 6 features in a grid. Matches competitor norm (Strong, Hevy, JEFIT all do this). |
| **Real app screenshots** | Seeing the actual product is a top conversion driver. Users distrust apps that hide their UI. | Med | Phone-frame mockups with real screenshots captured via Playwright. |
| **Pricing transparency** | Upfront pricing builds trust and filters leads. Hiding it signals "too expensive." | Low | Monthly ($2.99) + Annual ($19.99) with free trial. Annual highlighted as "Best Value." |
| **Social proof / testimonials** | Customer testimonials increase conversions by ~34%. Every competitor displays social proof. | Low | Placeholder testimonials for v1. Replace with real ones ASAP. |
| **FAQ section** | Addresses objections before users bounce. Reduces support load. Standard on SaaS pages. | Low | 6 questions covering platforms, trial, cancellation, data, exercises, offline. |
| **Mobile-responsive design** | 58%+ of SaaS traffic is mobile in 2026. Non-responsive = losing half your audience. | Med | Phone-first with Tailwind responsive utilities. |
| **Sticky navigation** | Standard UX for long single-page sites. Keeps primary CTA always visible. | Low | Glassmorphic sticky navbar with scroll opacity transition. |
| **Footer with legal links** | Privacy Policy and Terms of Service are legally required for any SaaS collecting user data. | Low | Links to /privacy and /terms pages. |
| **SEO metadata + Open Graph tags** | Controls how the site appears in Google and social sharing. | Low | Next.js built-in Metadata API (not next-seo library). |
| **Dark theme consistent with app** | Brand alignment. Light marketing site for a dark app creates cognitive dissonance. | Low | Design system tokens pulled from existing app. |
| **"Launch App" CTA in navbar** | Existing users need easy access. Every SaaS site has a login/dashboard link. | Low | Links to app.liftlabb.ca. |

## Differentiators

Features that elevate the site from "basic" to "polished." Not strictly expected, but high-impact.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Scroll-triggered entrance animations** | Websites with purposeful scroll animations have ~30% longer session times. Creates "polished product" perception. | Med | Use Motion library's `whileInView` for staggered fade-ups and slide-ins. Declarative, performant. |
| **Glassmorphic design language** | Distinctive visual identity. Backdrop blur + semi-transparent cards feel modern and premium. Most fitness app sites use flat cards. | Low | CSS backdrop-blur + semi-transparent backgrounds. Limit blur to navbar only for performance. |
| **Phone-frame mockup gallery** | CSS-drawn phone bezels make screenshots feel like holding the product. More immersive than flat screenshot grids. | Med | Build phone frames with CSS (rounded rect + notch). Avoid heavy image-based frames. |
| **JSON-LD structured data** | SoftwareApplication schema helps search engines understand the product. FAQ schema can capture "People Also Ask" boxes in Google. | Low | Script tag in page.tsx with SoftwareApplication + FAQPage schemas. |
| **Hover glow effects on cards** | Micro-interactions provide feedback and feel polished. | Low | CSS hover effects with box-shadow glow. Extend to feature cards and CTAs. |
| **Annual pricing savings callout** | "Save 44%" with visual emphasis nudges users toward higher-LTV annual plans. Proven pricing psychology. | Low | "Best Value" badge with glow border on annual card. |
| **OG share image** | Custom 1200x630 image with logo and tagline for social sharing. Far more professional than generic preview. | Med | Static designed image or Next.js dynamic OG image generation. |
| **Sitemap + robots.txt** | Accelerates search engine discovery and indexing. | Low | Next.js App Router native `sitemap.ts` and `robots.ts` -- zero dependencies, ~10 lines each. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Blog / content section** | Massive scope creep. Content marketing requires ongoing content creation. Focus on the product. | Focus SEO on the landing page with proper meta tags, structured data, and targeted keywords. |
| **Authentication on marketing site** | Complexity and maintenance for zero benefit. The app handles auth. | "Launch App" links to app.liftlabb.ca. Keep marketing site 100% static. |
| **Live chat / chatbot** | Third-party dependencies, JS bloat, maintenance. Negative ROI for $2.99/mo solo-dev product. | Contact email in footer. FAQ handles common questions. |
| **Video hero / autoplay background** | Hurts performance, increases bounce on mobile (data usage), distracts from CTA. 2026 trend is away from heavy video headers. | Static hero image (phone mockup) with subtle CSS/Motion entrance animation. |
| **Complex carousel library** | Carousel libraries add bundle size. Only ~1% click past first slide. Hides content behind interaction. | Horizontal scroll gallery (CSS snap points) or staggered static layout. |
| **App Store badges (v1)** | Creates confusion about which version to use. Complicates conversion funnel. | Single clear "Get Started Free" CTA to web app. Add badges later. |
| **Newsletter / email capture** | Adds GDPR complexity, requires email provider, distracts from primary CTA. | Focus on one CTA: start free trial. App onboarding captures email. |
| **Particle effects / canvas animations** | Performance killers on mobile. Battery drain, jank. Dated (2018-era aesthetic). | Radial gradient glow (CSS only). Lightweight, performant, visually striking on dark theme. |
| **Internationalization (i18n)** | Premature. Adds architectural complexity to every string in every component. | Ship English only. Add i18n when analytics show non-English traffic. |
| **A/B testing infrastructure** | Over-engineering for v1. Need baseline traffic before A/B provides statistical significance. | Launch, measure with basic analytics, iterate manually. |
| **Cookie consent banner** | Site is static with no cookies, no tracking, no third-party scripts. Banner on cookieless site is misleading. | Only add when analytics or tracking scripts are added. |

## Feature Dependencies

```
Design System (colors, fonts, tokens) --> All Components
next/font setup --> Font rendering in all components
Navbar --> Hero (hero needs proper top padding for sticky nav)
Hero --> Features (scroll anchor from "See Features" CTA)
Screenshots --> Real App Access (need running app for Playwright captures)
Pricing --> Feature List (pricing cards reference feature names)
SEO Metadata --> All Pages (layout.tsx metadata applies globally)
Sitemap --> All Routes (must know all pages: /, /privacy, /terms)
Motion library install --> All animated components
```

## MVP Recommendation

**Prioritize (ship in v1):**
1. All 8 sections (Navbar, Hero, Features, Screenshots, Testimonials, Pricing, FAQ, Footer)
2. Scroll-triggered animations with Motion (differentiator with minimal effort)
3. Glassmorphic design on navbar
4. Privacy Policy and Terms of Service pages
5. SEO metadata + OG tags + sitemap.ts + robots.ts
6. JSON-LD structured data (SoftwareApplication + FAQPage)

**Defer to v1.1 (within 2 weeks of launch):**
- Real testimonials replacing placeholders
- Custom OG share image
- Scroll-spy active state highlighting in navbar
- Analytics integration (Vercel Analytics -- one-click setup)

**Defer to v2 (only if validated by data):**
- Blog / content marketing section
- App store badges and download links
- Newsletter / email capture
- Multi-language support

## Sources

- [10 Essential Features Every SaaS Landing Page Needs in 2025](https://shipixen.com/blog/10-essential-features-every-saas-landing-page-needs-in-2025)
- [Best Next.js Landing Page Layouts for High SaaS Conversions](https://www.zignuts.com/blog/nextjs-landing-page-layouts)
- [183 SaaS Landing Page Examples Built With Next.js](https://saaslandingpage.com/technology/next-js/)
- [Vercel SaaS Templates](https://vercel.com/templates/saas)
- [Google: FAQPage Structured Data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
