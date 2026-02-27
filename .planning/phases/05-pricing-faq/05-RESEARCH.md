# Phase 5: Pricing & FAQ - Research

**Researched:** 2026-02-27
**Domain:** Pricing card layout with highlighted plan, CSS glow effects, FAQ accordion with animated height, Motion AnimatePresence, ARIA accessibility
**Confidence:** HIGH

## Summary

Phase 5 builds two sections: a pricing comparison (two cards side-by-side on desktop) and an FAQ accordion (six items with smooth expand/collapse). The pricing section is straightforward -- server-renderable cards using Tailwind utility classes with the annual card visually distinguished via a green glow `box-shadow` and a "Best Value" badge. The FAQ section requires a client component (`"use client"`) for `useState` toggle and Motion's `AnimatePresence` for smooth height animation.

The key technical challenge is animating accordion content from `height: 0` to `height: "auto"`. Motion (formerly Framer Motion) supports animating to `height: "auto"` directly in `animate` and `exit` props -- this is a well-documented pattern that avoids the need for manual height measurement with `useMeasure` or `ResizeObserver`. The accordion must use `overflow: hidden` on the animating container and stagger opacity slightly behind height for a polished feel.

Both sections pull content from the existing `lib/content.ts` data (2 `pricingPlans`, 6 `faqItems` with full TypeScript interfaces). The data structure already has `highlight: boolean`, `badge: string | null`, `savings?: string`, and `monthly?: string` on pricing plans, making conditional rendering straightforward.

**Primary recommendation:** Build `PricingSection` as a server component rendering two cards with Tailwind classes (conditionally applying glow border to the highlighted plan). Build `FAQSection` as a `"use client"` component using `useState` for open/closed state and `AnimatePresence` with `motion.div` animating `height: 0` to `height: "auto"` for smooth accordion behavior. Use `<button>` elements with `aria-expanded` and `aria-controls` for accessibility.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIC-01 | Section header "Simple, transparent pricing" with trial subtext | Standard section header pattern with `text-accent` and `text-muted` subtext |
| PRIC-02 | Monthly card ($2.99/mo, 7-day free trial, feature checklist) | Pricing card pattern with data from `pricingPlans[0]`, checklist with checkmark SVG |
| PRIC-03 | Annual card ($19.99/yr, "Best Value" badge, "Save 44%", 7-day free trial, feature checklist) | Highlighted card pattern with badge, savings text, data from `pricingPlans[1]` |
| PRIC-04 | Annual card visually highlighted with green glow border | `box-shadow` glow technique with accent color, `border-accent` class |
| PRIC-05 | CTA "Start Free Trial" on each card linking to app | `<a>` tag styled as button linking to `siteConfig.appUrl` |
| PRIC-06 | Hover glow effect on cards | `transition` + `hover:shadow` with accent color, GPU-accelerated |
| PRIC-07 | Responsive layout (side-by-side desktop, stacked mobile) | `grid grid-cols-1 md:grid-cols-2` with `max-w-4xl mx-auto` |
| FAQ-01 | Section header "Frequently Asked Questions" | Standard section header pattern |
| FAQ-02 | 6 FAQ items with accordion expand/collapse behavior | `useState` per-item toggle, `AnimatePresence` wrapping conditional content |
| FAQ-03 | Smooth expand/collapse animation | Motion `animate={{ height: "auto", opacity: 1 }}` / `exit={{ height: 0, opacity: 0 }}` |
| FAQ-04 | Content covers: platforms, free trial, cancellation, data safety, custom exercises, offline use | All 6 topics already in `faqItems` array in `lib/content.ts` |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Motion | 12.x (installed) | FAQ accordion expand/collapse animation | AnimatePresence handles mount/unmount with height auto animation. Already installed. |
| Tailwind CSS | 4.x (installed) | All styling -- cards, glow, responsive grid, badges | CSS-first @theme tokens already configured with accent colors and card styles. |
| React | 19.x (installed) | useState for accordion state, conditional rendering | Already installed via Next.js 15. |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lib/content.ts` | N/A | Content data source | Always -- `pricingPlans` and `faqItems` arrays provide all content |
| `siteConfig` | N/A | App URL for CTA links | `siteConfig.appUrl` for "Start Free Trial" button hrefs |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| AnimatePresence for accordion | CSS `<details>/<summary>` | No smooth height animation, browser default triangle, limited styling control |
| AnimatePresence for accordion | `display: grid` + `grid-template-rows: 0fr/1fr` trick | Pure CSS, but no exit animation and limited browser support for `interpolate-size` |
| Manual `useMeasure` + ResizeObserver | Motion `height: "auto"` | `height: "auto"` works directly in Motion -- `useMeasure` adds unnecessary complexity for fixed content |
| `box-shadow` for glow | `outline` or `ring` utility | `box-shadow` supports blur radius for glow effect; `ring` is sharp-edged |

**Installation:**
```bash
# No new packages needed -- Motion, React, and Tailwind are already installed
```

## Architecture Patterns

### Recommended Project Structure
```
components/
  PricingSection.tsx     # Server component -- pricing cards (no interactivity beyond links)
  FAQSection.tsx         # "use client" -- accordion with useState + AnimatePresence
```

### Pattern 1: Pricing Cards with Conditional Highlighting

**What:** Render pricing cards by mapping over `pricingPlans` array. Conditionally apply glow border, badge, and savings text based on `plan.highlight` boolean.

**When to use:** Whenever one plan needs visual emphasis over others.

**Example:**
```tsx
// components/PricingSection.tsx (Server Component -- no "use client")
import { pricingPlans, siteConfig } from "@/lib/content"

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted text-center mb-12">
          Start your 7-day free trial. No credit card required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative bg-card rounded-card p-8 border
                transition-shadow duration-300
                ${plan.highlight
                  ? "border-accent shadow-[0_0_30px_rgba(74,222,128,0.15)] hover:shadow-[0_0_40px_rgba(74,222,128,0.25)]"
                  : "border-border hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]"
                }
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              <h3 className="text-lg font-bold text-text mb-4">{plan.name}</h3>

              {/* Price */}
              <div className="mb-2">
                <span className="text-4xl font-bold text-text">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </div>

              {/* Savings */}
              {plan.savings && (
                <p className="text-accent text-sm font-bold mb-1">{plan.savings}</p>
              )}
              {plan.monthly && (
                <p className="text-muted text-sm mb-6">{plan.monthly}</p>
              )}
              {!plan.savings && <div className="mb-6" />}

              {/* Trial text */}
              <p className="text-muted text-sm mb-6">7-day free trial</p>

              {/* Feature checklist */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-text">
                    <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={siteConfig.appUrl}
                className={`
                  block w-full text-center py-3 rounded-lg font-bold text-sm
                  transition-colors duration-200
                  ${plan.highlight
                    ? "bg-accent text-bg hover:bg-accent/90"
                    : "bg-card-2 text-text hover:bg-border"
                  }
                `}
              >
                Start Free Trial
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Pattern 2: FAQ Accordion with AnimatePresence

**What:** Client component with `useState` tracking which FAQ item is open (or null). `AnimatePresence` wraps the conditionally rendered answer content. Motion's `motion.div` animates `height` from `0` to `"auto"` and `opacity` from `0` to `1`.

**When to use:** Any accordion or collapsible content with smooth animation.

**Example:**
```tsx
// components/FAQSection.tsx
"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { faqItems } from "@/lib/content"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-border rounded-card overflow-hidden">
              <button
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
                className="w-full flex items-center justify-between p-5 text-left text-text hover:bg-card transition-colors"
              >
                <span className="font-bold text-sm md:text-base">{item.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-muted text-xl flex-shrink-0 ml-4"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                        opacity: { duration: 0.2, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                        opacity: { duration: 0.15 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-muted text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Pattern 3: Green Glow Effect with box-shadow

**What:** Use `box-shadow` with the accent color at low opacity and a large blur radius to create a glow effect around the highlighted pricing card. Layer shadows for depth.

**When to use:** Whenever a card needs visual emphasis (highlighted plan, hover states).

**Example:**
```css
/* Static glow on highlighted card */
box-shadow: 0 0 30px rgba(74, 222, 128, 0.15);

/* Hover glow (stronger) */
box-shadow: 0 0 40px rgba(74, 222, 128, 0.25);

/* Tailwind arbitrary value syntax */
shadow-[0_0_30px_rgba(74,222,128,0.15)]
hover:shadow-[0_0_40px_rgba(74,222,128,0.25)]
```

**Key detail:** `rgba(74, 222, 128, ...)` maps to the accent color `#4ade80`. The glow uses the SAME color as the accent for visual cohesion. Low opacity (0.15-0.25) prevents the glow from being overwhelming on the dark `#0a0a0a` background.

### Anti-Patterns to Avoid

- **Using `<details>/<summary>` for the accordion:** No smooth height animation possible. Browser default disclosure triangle is hard to style consistently.
- **Using `layout` prop instead of `AnimatePresence` for accordion:** The `layout` prop triggers FLIP animations which can cause visual artifacts when content changes. `AnimatePresence` with explicit `initial`/`animate`/`exit` is more predictable for show/hide.
- **Animating `max-height` instead of `height`:** Classic CSS hack that requires guessing a max value. Animation speed is inconsistent because it always animates the full `max-height` range regardless of actual content height.
- **Forgetting `overflow-hidden` on the animating container:** Without it, content is visible outside the container during the height animation, causing visual overflow.
- **Making pricing cards client components:** The pricing cards have no interactive state (only `<a>` links). Keep them as a server component. Only the FAQ section needs `"use client"`.
- **`"use client"` on each FAQ item:** Use a single `"use client"` on the FAQSection component. A single `useState` manages which item is open. Do not create separate client components per item.
- **Using `ring` instead of `box-shadow` for glow:** Tailwind's `ring` utility creates a sharp-edged outline. `box-shadow` with blur radius creates the soft glow effect needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accordion height animation | Manual ResizeObserver + height measurement | Motion `AnimatePresence` + `height: "auto"` | Motion handles auto height natively in animate/exit props. No measurement needed for static FAQ content. |
| Checkmark icons in feature list | Custom icon library or external SVG file | Inline `<svg>` with `<path d="M5 13l4 4L19 7" />` | Single-use icon. 3 lines of JSX vs an entire icon library dependency. |
| Glow border effect | CSS `outline` or custom `::after` pseudo-element | `box-shadow` with blur radius | One CSS property, GPU-accelerated, works with transitions. |
| Accordion state management | External state library (Zustand, Redux) | React `useState<number | null>` | 6 items with single-open behavior. One state variable is sufficient. |
| Responsive card layout | Custom media queries or flexbox hacks | `grid grid-cols-1 md:grid-cols-2` | Two Tailwind classes handle the entire responsive behavior. |

**Key insight:** Both sections are simple enough that no libraries beyond what's already installed are needed. The pricing section is pure Tailwind styling. The FAQ section needs only `useState` and `AnimatePresence` from libraries already in the project.

## Common Pitfalls

### Pitfall 1: Missing overflow-hidden on Accordion Content Container

**What goes wrong:** During the height animation (0 to auto), the text content is visible overflowing below the container, creating a visual glitch.
**Why it happens:** By default, `div` elements have `overflow: visible`. When animating `height` from 0 to the final value, the content inside extends beyond the 0-height container.
**How to avoid:** Add `className="overflow-hidden"` to the `motion.div` that has the `height` animation.
**Warning signs:** Text appears below the accordion item during expand/collapse animation.

### Pitfall 2: AnimatePresence Without initial={false}

**What goes wrong:** On first render, all FAQ items play their initial animation (height from 0 to... 0, which is a no-op, but opacity flashes).
**Why it happens:** `AnimatePresence` by default runs the `initial` animation on mount. Since all items start closed, this is unnecessary.
**How to avoid:** Add `initial={false}` to `<AnimatePresence>`. This tells Motion to skip the initial animation for children already present on mount.
**Warning signs:** Brief opacity flicker on page load in the FAQ section.

### Pitfall 3: Glow Color Not Matching Accent

**What goes wrong:** The glow effect uses a generic white or blue shadow that clashes with the green accent theme.
**Why it happens:** Using Tailwind's built-in `shadow-lg` or `shadow-xl` which are gray/black. The glow needs the accent color.
**How to avoid:** Use arbitrary value syntax: `shadow-[0_0_30px_rgba(74,222,128,0.15)]`. The RGB values `74, 222, 128` correspond to `#4ade80` (the accent color defined in `@theme`).
**Warning signs:** Shadow looks like a generic elevation effect rather than a colored glow.

### Pitfall 4: Pricing Badge Clipped by overflow-hidden

**What goes wrong:** The "Best Value" badge positioned with `absolute -top-3` gets clipped if the card has `overflow-hidden`.
**Why it happens:** Negative positioning pushes the badge outside the card boundary. `overflow-hidden` clips it.
**How to avoid:** Do NOT add `overflow-hidden` to the pricing card container. The badge needs to overflow. Only the FAQ accordion items need `overflow-hidden`.
**Warning signs:** Badge is cut off or invisible on the highlighted card.

### Pitfall 5: Click Area Too Small on FAQ Items

**What goes wrong:** Users can only click the text to expand/collapse, not the full row.
**Why it happens:** Using a `<span>` or `<div>` with `onClick` instead of a full-width `<button>`.
**How to avoid:** Use `<button className="w-full">` for the clickable header. This gives a full-width click target and proper keyboard accessibility (Enter/Space to toggle).
**Warning signs:** Users miss the click target. Keyboard users cannot activate the accordion.

### Pitfall 6: FAQ Content Not Available for SEO JSON-LD

**What goes wrong:** The FAQ content is not in the server-rendered HTML because AnimatePresence unmounts closed items.
**Why it happens:** AnimatePresence removes elements from the DOM when they exit.
**How to avoid:** This is NOT a problem for this project. The JSON-LD FAQPage structured data (Phase 7) will be generated server-side from `faqItems` in `lib/content.ts`, completely independent of the visual accordion component. Google reads JSON-LD, not the visual accordion.
**Warning signs:** None -- this is a non-issue, documented here to prevent unnecessary complexity.

## Code Examples

### Example 1: Green Glow box-shadow Values

```css
/* Source: Verified against CSS specification and multiple references */

/* Subtle resting glow for highlighted card */
box-shadow: 0 0 30px rgba(74, 222, 128, 0.15);
/* 0 0 = no offset, 30px blur, accent color at 15% opacity */

/* Stronger hover glow */
box-shadow: 0 0 40px rgba(74, 222, 128, 0.25);
/* Increased blur and opacity on hover */

/* Non-highlighted card hover glow (subtle) */
box-shadow: 0 0 30px rgba(74, 222, 128, 0.1);
/* Very subtle glow, just enough to feel interactive */

/* Tailwind arbitrary value classes */
/* Resting: */ shadow-[0_0_30px_rgba(74,222,128,0.15)]
/* Hover:  */ hover:shadow-[0_0_40px_rgba(74,222,128,0.25)]
/* Transition: */ transition-shadow duration-300
```

### Example 2: Accessible Accordion Button Markup

```tsx
// Source: WAI-ARIA Authoring Practices Guide (https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
<button
  id={`faq-button-${index}`}
  onClick={() => toggle(index)}
  aria-expanded={openIndex === index}
  aria-controls={`faq-panel-${index}`}
  className="w-full flex items-center justify-between p-5 text-left text-text hover:bg-card transition-colors"
>
  <span className="font-bold">{item.question}</span>
  <span aria-hidden="true" className="text-muted">+</span>
</button>

{/* Panel */}
<motion.div
  id={`faq-panel-${index}`}
  role="region"
  aria-labelledby={`faq-button-${index}`}
  // ... animation props
>
  <p>{item.answer}</p>
</motion.div>
```

**ARIA attributes explained:**
- `aria-expanded`: tells screen readers whether this item is open or closed
- `aria-controls`: links button to the panel it controls (by ID)
- `role="region"` + `aria-labelledby`: makes the panel a labeled landmark for screen readers
- `aria-hidden="true"` on the `+` icon: hides decorative icon from screen readers

### Example 3: AnimatePresence Height Auto Pattern

```tsx
// Source: Multiple verified sources (joshuawootonn.com, pawelkrystkiewicz.pl, Motion examples)
<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: "auto",
        opacity: 1,
        transition: {
          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
          opacity: { duration: 0.2, delay: 0.1 },
        },
      }}
      exit={{
        height: 0,
        opacity: 0,
        transition: {
          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
          opacity: { duration: 0.15 },
        },
      }}
      className="overflow-hidden"
    >
      <div className="px-5 pb-5">
        <p className="text-muted text-sm leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

**Key details:**
- `initial={false}` on AnimatePresence: prevents initial mount animation for already-closed items
- `height: "auto"`: Motion calculates the actual content height and animates to it
- Staggered timing: height animates first (0.3s), then opacity fades in with 0.1s delay -- prevents text from appearing before the container has expanded
- Exit: opacity fades out first (0.15s), then height collapses (0.3s) -- prevents text clipping during close
- Custom ease `[0.04, 0.62, 0.23, 0.98]`: smooth deceleration curve, feels natural
- `overflow-hidden`: critical -- prevents content from being visible outside the 0-height container during animation

### Example 4: Inline Checkmark SVG for Feature Lists

```tsx
// Source: Standard SVG path for a checkmark
<svg
  className="w-4 h-4 text-accent flex-shrink-0"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
</svg>
```

**Why inline SVG:** Avoids installing an icon library for a single icon used 12 times (6 features x 2 cards). The `flex-shrink-0` prevents the checkmark from squishing when text wraps.

### Example 5: Responsive Two-Column Pricing Grid

```tsx
// Side-by-side on desktop (md+), stacked on mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
  {pricingPlans.map((plan) => (
    <div key={plan.name} className="...">
      {/* card content */}
    </div>
  ))}
</div>
```

**Breakpoint:** `md` (768px) matches the existing project convention. `max-w-3xl` (48rem) constrains the two cards so they don't stretch too wide on large screens. `mx-auto` centers the grid.

### Example 6: Rotating Plus/Minus Icon for Accordion

```tsx
// Source: Motion animate prop for rotation
<motion.span
  animate={{ rotate: isOpen ? 45 : 0 }}
  transition={{ duration: 0.2 }}
  className="text-muted text-xl flex-shrink-0 ml-4"
  aria-hidden="true"
>
  +
</motion.span>
```

**Why rotate 45 degrees:** A `+` rotated 45 degrees becomes an `x` (close icon). This is a common UX pattern that uses a single character for both states. The rotation animates smoothly via Motion's `animate` prop. `aria-hidden="true"` hides it from screen readers since the `aria-expanded` on the button already communicates state.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS `max-height` hack for accordion | Motion `height: "auto"` | Framer Motion 5+ (2022) | No guessing max values, animation speed matches actual content |
| `<details>/<summary>` elements | Custom accordion with AnimatePresence | N/A (always better for animated UX) | Smooth height animation, full styling control, ARIA support |
| jQuery slideToggle | Motion AnimatePresence | N/A | Declarative, React-integrated, GPU-accelerated |
| Generic gray shadows for cards | Themed `box-shadow` matching brand color | Design trend 2023+ | Glow effects create cohesive dark-theme UI |
| `framer-motion` package | `motion` package | Late 2024 | Same API, new import path `motion/react` |

**Deprecated/outdated:**
- `max-height` CSS hack for collapsibles: Unreliable timing, wastes animation frames on empty space
- `react-collapse` library: Unnecessary when Motion is already installed and supports height auto
- `framer-motion` import path: Use `motion/react` (project already uses this correctly)

## Open Questions

1. **Single-open vs. multi-open accordion**
   - What we know: The pattern above uses `useState<number | null>` which allows only one item open at a time (single-open). Clicking a new item closes the previous one.
   - What's unclear: Whether users should be able to have multiple FAQ items open simultaneously.
   - Recommendation: Use single-open (one `number | null` state). This is the standard pattern for FAQ sections -- it keeps the page tidy and guides users through one answer at a time. If multi-open is needed later, the state can be changed to `Set<number>` with minimal code changes.

2. **Scroll-triggered entrance animation for the sections**
   - What we know: Previous phases use Motion `whileInView` for scroll-triggered entrance animations (e.g., feature cards in Phase 4).
   - What's unclear: Whether pricing and FAQ sections should also animate in on scroll.
   - Recommendation: Add `whileInView` entrance animation to both section headers and card containers for consistency with the rest of the page. Use the established pattern: `initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`.

## Sources

### Primary (HIGH confidence)
- [WAI-ARIA Accordion Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) - Authoritative ARIA attribute requirements, keyboard interaction, HTML structure
- [Aditus Accessible Accordion](https://www.aditus.io/patterns/accordion/) - Practical implementation with aria-expanded, aria-controls, hidden attribute
- [Motion for React Accordion Example](https://examples.motion.dev/react/accordion) - Official Motion accordion with height auto
- [CSS Box Shadow Specification](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) - Box-shadow syntax for glow effects

### Secondary (MEDIUM confidence)
- [Joshua Wootonn: Animate Height with Framer Motion](https://www.joshuawootonn.com/how-to-animate-width-and-height-with-framer-motion) - Verified AnimatePresence + height auto pattern with staggered opacity timing
- [Pawel Krystkiewicz: Height Transitions in React](https://www.pawelkrystkiewicz.pl/articles/react-animations-height) - AnimateHeight component pattern, useMeasure alternative, duration scaling formula
- [Coder's Block: CSS Glow Effects](https://codersblock.com/blog/creating-glow-effects-with-css/) - Layered box-shadow technique, blur/spread values for glow
- [GitHub Motion Discussion #1884](https://github.com/motiondivision/motion/discussions/1884) - Confirmed height auto works for static content; ResizeObserver only needed for dynamically changing content

### Tertiary (LOW confidence)
- None -- all findings verified with multiple sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and verified in Phase 1. No new dependencies needed.
- Architecture: HIGH - AnimatePresence + height auto pattern verified across official examples, community articles, and GitHub discussions. Pricing card pattern is standard Tailwind.
- Pitfalls: HIGH - Overflow-hidden, initial={false}, badge clipping, and glow color matching all documented across multiple sources and cross-verified.

**Research date:** 2026-02-27
**Valid until:** 2026-03-27 (30 days -- stable ecosystem, Motion 12.x API is mature)
