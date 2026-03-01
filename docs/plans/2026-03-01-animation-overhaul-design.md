# LiftLabb Website Animation Overhaul — Design Document

**Date**: 2026-03-01
**Approach**: "Layered Atmosphere" — Over-the-top showcase with maximum toolkit
**Libraries**: Motion (existing) + GSAP + Lottie

---

## Approach

Build the animation system in 4 independent layers that stack to create depth:
1. Background World — living, breathing atmosphere
2. Section Entrances — dramatic scroll-triggered reveals
3. Micro-interactions — cursor-driven responsiveness
4. Lottie Accents — animated icons and decorative bursts

Each layer is independently testable and can be dialed up/down without affecting others.

---

## Layer 1: Background World

### Liquid Ether Background
- Full-page WebGL fluid dynamics simulation behind all content
- Colors: `['#4ade80', '#0a0a0a', '#1a1a1a']` (green accent through dark tones)
- Low opacity so content remains readable
- Reacts to mouse movement for interactive feel
- Auto-animates when idle so page never feels static
- Source: [reactbits.dev/backgrounds/liquid-ether](https://reactbits.dev/backgrounds/liquid-ether)

### Parallax Gradient Blobs
- Existing Hero green glow blob gets scroll-linked parallax (moves slower than content)
- 2-3 additional gradient blobs at section boundaries shift/pulse on scroll
- Blobs use blur filters and scale transforms tied to scroll position

### Animated Grain
- Existing `.grain` overlay gets subtle position animation
- Shifts noise texture slightly every few seconds for a "shimmer" effect

---

## Layer 2: Section Entrances

### Hero Section
- **Split-text character animation** on headline — each letter animates individually with stagger
- Phone mockup **continuous float** — subtle up/down drift (3-4px, 3s cycle)
- CTA buttons **scale in** with bounce easing after text completes
- Background glow **expands outward** from center on load

### Features Section
- Title: **word-by-word reveal** (each word slides up)
- Cards: **stagger from alternating directions** — left/right with 3D rotation (slight tilt entering, flattening to 0)
- Icons: **Lottie entrance animation** (draw-on or pop-in)

### Screenshots Section
- Title: word-by-word reveal
- Phone mockups: **scale 0.8→1.0 with rotation** (-5deg→0deg) on scroll
- Horizontal scroll: **velocity-based momentum** feel

### Pricing Section (currently fully static — biggest upgrade)
- Title: split-text character reveal
- Cards: **3D flip in** (Y-axis rotation, 180deg→0deg)
- Prices: **count up from $0** with easing
- Checkmarks: **SVG path draw** in sequence
- Highlighted card: **pulsing glow border**

### FAQ Section
- Items: **slide in from right** with stagger and 3D perspective tilt
- Answer text: **fast word reveal** on expand
- Chevron: **spring physics** bounce on rotation

### Footer
- Links: **stagger in from bottom**
- **Gradient line animates** across top of footer on scroll arrival

---

## Layer 3: Micro-interactions

### Magnetic Buttons
- CTA buttons subtly **follow cursor** when hovering nearby (2-4px shift toward cursor)
- Click: **ripple effect** from click point + scale down (0.95) then bounce back

### Card Hover Effects
- Feature cards: **3D tilt** following cursor position (~5deg max)
- Pricing cards: 3D tilt + **spotlight gradient** following cursor across surface
- FAQ items: subtle **background glow** follows cursor horizontally

### Cursor-following Glow
- Soft green radial gradient (~200px) follows cursor across entire page
- Very low opacity (~0.05-0.08)

### Link Hover Animations
- Nav + footer links: **underline draws in** from left to right
- Subtle **color transition** with glow

### Scroll Progress Bar
- Thin green **progress bar** at top of viewport
- Subtle glow on progress tip

### Hide/Show Navbar
- Scroll down: navbar **slides up and hides**
- Scroll up: navbar **slides back down** with backdrop blur
- More immersive feel + more screen real estate

---

## Layer 4: Lottie Accents

### Feature Icons
- Replace static SVG icons with **Lottie animations** on scroll-into-view
- Unique entrances: draw-on stroke, pop-in with bounce, or morph-in
- Subtle **loop** after entrance (gentle pulse or slow rotation)

### Pricing Checkmarks
- **Lottie check animation** that draws in sequence as card appears
- Staggered timing cascading down the feature list

### CTA Accents
- Small **sparkle/confetti** Lottie on CTA button hover (0.5s)
- **Arrow animation** on "Get Started" — arrow slides right on hover

---

## Accessibility

### `prefers-reduced-motion` Support
- All GSAP, Motion, and Lottie animations respect OS reduced-motion setting
- When enabled: instant reveals, static icons, no parallax, no cursor effects
- Liquid Ether falls back to static gradient

---

## Technical Summary

| Layer | What | Library |
|-------|------|---------|
| 1 — Background | Liquid Ether, parallax blobs, animated grain | React component + CSS |
| 2 — Entrances | Split-text, 3D flips, counters, word reveals | GSAP ScrollTrigger |
| 3 — Micro-interactions | Magnetic buttons, 3D tilt, cursor glow, scroll progress, navbar | Motion + vanilla JS |
| 4 — Accents | Animated icons, cascading checks, sparkle bursts | Lottie |
| A11y | Reduced-motion fallbacks | CSS media query |
