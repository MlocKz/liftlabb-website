# Domain Pitfalls

**Domain:** SaaS marketing landing page (Next.js 15 + Tailwind v4 + Motion)
**Researched:** 2026-02-27
**Confidence:** HIGH

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Tailwind v3 Configuration with Tailwind v4

**What goes wrong:** Using `tailwind.config.ts` with `@tailwind base; @tailwind components; @tailwind utilities;` directives when Tailwind v4 is installed. The build may succeed but custom design tokens silently fail to generate utilities.

**Why it happens:** Most tutorials, blog posts, and AI training data reference Tailwind v3 patterns. The existing implementation plan uses v3 syntax. `create-next-app` with `--tailwind` scaffolds v4 by default as of 2025.

**Consequences:** Design tokens don't apply. Colors, fonts, border-radius all use Tailwind defaults instead of LiftLabb brand values. Every component looks wrong. Hours wasted debugging "why my custom classes don't work."

**Prevention:**
- Use `@import "tailwindcss";` (single import, not three `@tailwind` directives)
- Define all design tokens in `@theme { }` in CSS, not in a JavaScript config file
- Delete any auto-generated `tailwind.config.ts` or `tailwind.config.js`
- Use `@tailwindcss/postcss` in PostCSS config, not the old `tailwindcss` plugin

**Detection:** If `bg-accent` or `text-muted` classes produce no visible effect, the design tokens are not registered. Check `package.json` for Tailwind version, check `globals.css` for correct import syntax.

### Pitfall 2: Installing `framer-motion` Instead of `motion`

**What goes wrong:** Installing the old `framer-motion` package instead of the current `motion` package, or importing from `framer-motion` instead of `motion/react`.

**Why it happens:** The rebrand happened in late 2024. Most existing tutorials, Stack Overflow answers, and training data reference `framer-motion`. The old package still works but is effectively legacy.

**Consequences:** Using the old package means missing newer features (hybrid engine with Web Animations API, improved tree-shaking, vanilla JS APIs). Import paths differ: `motion/react` vs `framer-motion`.

**Prevention:**
- Install: `npm install motion`
- Import: `import { motion } from "motion/react"`
- If you see `framer-motion` in any tutorial code, mentally replace with `motion/react`

**Detection:** `package.json` contains `framer-motion` instead of `motion`.

### Pitfall 3: Using `output: 'export'` and Losing Image Optimization

**What goes wrong:** Setting `output: 'export'` in `next.config.ts` because "it's a static site." This disables `next/image` optimization entirely -- images serve unoptimized, no WebP/AVIF conversion, no responsive srcset.

**Why it happens:** Developers equate "static site" with "static export." On Vercel, this is unnecessary and harmful.

**Consequences:** Screenshots and hero images load as full-size PNGs. Page weight increases 3-5x. LCP degrades significantly. Bandwidth costs increase.

**Prevention:** Do NOT set `output: 'export'` when deploying to Vercel. The default configuration renders pages as static HTML at build time AND optimizes images at the edge. Best of both worlds.

**Detection:** `next.config.ts` contains `output: 'export'`. Or: images in DevTools Network tab show as PNG/JPEG instead of WebP/AVIF.

### Pitfall 4: Raw @font-face Instead of next/font

**What goes wrong:** Defining `@font-face` directly in CSS instead of using `next/font/local`. The font loads but without Next.js optimizations.

**Why it happens:** CSS `@font-face` is the traditional approach. The existing implementation plan uses this pattern.

**Consequences:**
- Layout shift (CLS) when font loads -- text reflows because fallback system font has different metrics
- Flash of unstyled text (FOUT) -- users see system font snap to Circular Std
- No automatic `size-adjust`, `ascent-override`, `descent-override` calculations
- TTF file is uncompressed (~60KB vs ~36KB as WOFF2)

**Prevention:** Use `next/font/local` in `layout.tsx`. Provides automatic `font-display: swap`, CSS `size-adjust` for zero CLS, font file preloading at build time, and self-hosting from same domain.

**Detection:** Check if `next/font` is used in `layout.tsx`. If font is loaded via CSS `@font-face`, this pitfall is active.

## Moderate Pitfalls

### Pitfall 5: Forgetting `viewport: { once: true }` on Motion Animations

**What goes wrong:** Scroll-triggered animations replay every time the element enters the viewport. Scrolling up and down repeatedly re-triggers entrance animations.

**Why it happens:** Motion's `whileInView` defaults to re-triggering on every viewport entry. This is correct for some use cases but jarring for entrance animations.

**Prevention:** Always add `viewport={{ once: true }}` for entrance animations:

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}  // animate once only
/>
```

### Pitfall 6: Missing SEO Files (sitemap.xml, robots.txt)

**What goes wrong:** Site launches without sitemap or robots.txt. Search engines can still crawl, but discovery and indexing are slower. The implementation plan does not include these.

**Prevention:** Create `app/sitemap.ts` and `app/robots.ts` during project setup. They are ~10 lines each, require zero dependencies, and use Next.js App Router conventions.

### Pitfall 7: Smooth Scroll Conflict with Sticky Navbar

**What goes wrong:** Clicking "Features" in the nav scrolls to the section, but the section header is hidden behind the sticky navbar.

**Why it happens:** `scroll-behavior: smooth` + anchor links scroll to the exact top of the element, not accounting for navbar height.

**Prevention:** Add `scroll-margin-top` to each section:

```css
section[id] {
  scroll-margin-top: 80px; /* navbar height */
}
```

Or use Tailwind: `className="scroll-mt-20"` on each section element.

### Pitfall 8: Using `<Link>` for Same-Page Anchors

**What goes wrong:** Using `<Link href="#features">` from `next/link` for in-page navigation. The Link component performs client-side routing and may not respect `scroll-behavior: smooth`.

**Prevention:** Use plain `<a href="#features">` tags for same-page anchor navigation. `<Link>` is for page-to-page routing. Alternatively, `<Link href="#features" scroll={false}>` works but plain anchors are simpler.

### Pitfall 9: Glassmorphism Performance on Mobile

**What goes wrong:** `backdrop-filter: blur()` on multiple elements causes frame drops and janky scrolling on mid-range devices.

**Why it happens:** Glassmorphism looks great on developer MacBooks but is GPU-intensive. Some mobile browsers disable backdrop-filter in low-power mode.

**Prevention:**
- Limit `backdrop-filter: blur()` to ONE element: the sticky navbar
- Use solid dark backgrounds for cards (Features, Pricing, Testimonials)
- Keep blur values to 8-12px max
- Always provide solid color fallback: `background: rgba(26,26,26,0.8)` so element is readable if blur is disabled

### Pitfall 10: Dark Theme Accessibility -- Insufficient Contrast

**What goes wrong:** The design uses `#888` (muted text) on `#0a0a0a` (background). Contrast ratio is 4.37:1 -- barely passing WCAG AA (requires 4.5:1). On cards (`#1a1a1a`), it drops to 3.75:1 -- failing AA.

**Prevention:**
- Bump muted text from `#888` to `#999` or `#9a9a9a` (achieves 5.0:1+ contrast)
- Verify every text/background combination with a contrast checker
- The accent green `#4ade80` on `#0a0a0a` passes (~7.5:1 contrast)

### Pitfall 11: DNS Conflict Between Vercel and Firebase

**What goes wrong:** Setting up `liftlabb.ca` for Vercel while `app.liftlabb.ca` points to Firebase. Common mistakes: conflicting A records, removing Firebase TXT verification record, SSL certificate provisioning failures.

**Prevention:**
- Root domain: Vercel A records (`76.76.21.21`), CNAME `www` to `cname.vercel-dns.com`
- Subdomain: CNAME `app` to Firebase Hosting target
- Keep Firebase TXT verification record permanently (needed for SSL renewal)
- Do NOT add wildcard (`*`) CNAME to Vercel
- Set up Vercel first, verify it works, then configure Firebase subdomain

### Pitfall 12: Placeholder Testimonials That Look Fake

**What goes wrong:** Made-up names ("Alex M.", "Sarah K.") with generic quotes and colored-circle avatars. Savvy users recognize fake testimonials, which actively harms trust -- worse than no testimonials.

**Prevention:**
- **Option A (recommended):** Remove testimonials section for v1. Add when real feedback exists. Honest page without testimonials > page with obvious fakes.
- **Option B:** If keeping placeholders, label honestly: "What we're building for" not "What lifters are saying"
- **Option C:** Get 2-3 real quotes from beta users or friends who've used the app

## Minor Pitfalls

### Pitfall 13: TTF Font File Size

**What goes wrong:** Circular Std TTF is ~60KB. WOFF2 would be ~36KB (~40% smaller). Not critical but suboptimal.

**Prevention:** Convert TTF to WOFF2 using an online tool or `woff2_compress`. `next/font/local` supports both formats. WOFF2 has universal browser support in 2026.

### Pitfall 14: Missing `alt` Text on Images

**What goes wrong:** Accessibility issues and SEO penalties for images without descriptive `alt` attributes.

**Prevention:** Every `<Image>` must have a meaningful `alt`. "Screenshot of LiftLabb workout logging screen" not just "screenshot."

### Pitfall 15: Not Testing at Intermediate Breakpoints

**What goes wrong:** Site looks great at 375px (mobile) and 1440px (desktop) but breaks at 768px (tablet) or 1024px (small laptop).

**Prevention:** Test at 375px, 640px, 768px, 1024px, 1280px, 1440px. Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) handle this but must be applied deliberately.

### Pitfall 16: Circular Std Font Licensing

**What goes wrong:** Circular Std is a commercial typeface by Lineto. Using it on a public website requires a web font license.

**Prevention:** Verify the font license covers web usage. If unlicensed: switch to Inter (visually similar, free, available via `next/font/google` with zero licensing risk).

### Pitfall 17: Animating Layout Properties

**What goes wrong:** Scroll animations using `height`, `width`, `margin`, or `padding` transitions instead of `transform` and `opacity`. Layout properties trigger browser reflow on every frame.

**Prevention:** Only animate `transform` (translateX/Y, scale) and `opacity` -- these run on GPU compositor thread. For FAQ accordion, use `grid-template-rows: 0fr` to `1fr` or Motion's layout animation.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project scaffold | Tailwind v3/v4 config mismatch (#1) | Verify `@import "tailwindcss"` syntax, delete `tailwind.config.ts` |
| Project scaffold | Wrong Next.js version (#N/A) | Pin `create-next-app@15` to avoid Next.js 16 |
| Design system | Wrong font loading (#4) | Use `next/font/local`, not `@font-face` |
| Design system | Muted color contrast (#10) | Bump `#888` to `#999` in design tokens |
| Design system | Font licensing (#16) | Verify Circular Std web license exists |
| Navbar | Scroll offset (#7) | Add `scroll-margin-top` to all sections |
| Navbar | Wrong link component (#8) | Use `<a>` not `<Link>` for anchor links |
| All animated sections | Wrong animation package (#2) | Install `motion` not `framer-motion` |
| All animated sections | Animations replaying (#5) | Add `viewport={{ once: true }}` everywhere |
| All animated sections | Layout property animation (#17) | Only animate transform + opacity |
| Glassmorphic effects | Mobile performance (#9) | Limit backdrop-blur to navbar only |
| Screenshots | Unoptimized images (#3) | Use `next/image`, do NOT set `output: 'export'` |
| Testimonials | Fake-looking reviews (#12) | Consider removing section until real testimonials exist |
| SEO | Missing sitemap/robots (#6) | Create `app/sitemap.ts` and `app/robots.ts` |
| Deployment | DNS conflicts (#11) | Set up Vercel first, then Firebase subdomain |

## Sources

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) -- HIGH confidence
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts) -- HIGH confidence
- [Next.js Image Component](https://nextjs.org/docs/app/getting-started/images) -- HIGH confidence
- [Motion & Framer Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) -- HIGH confidence
- [Motion for React Installation](https://motion.dev/docs/react-installation) -- HIGH confidence
- [Framer Motion is now Motion announcement](https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion) -- HIGH confidence
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) -- HIGH confidence
- [Vercel Custom Domain Configuration](https://vercel.com/docs/domains/working-with-domains/add-a-domain) -- HIGH confidence
- [Firebase Hosting Custom Domain](https://firebase.google.com/docs/hosting/custom-domain) -- HIGH confidence
- [Next.js Link Smooth Scroll Issue](https://github.com/vercel/next.js/issues/51721) -- HIGH confidence
