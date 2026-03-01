# Animation Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the LiftLabb website from a mostly-static site into an over-the-top showcase with Liquid Ether background, GSAP scroll-triggered entrances, micro-interactions, and Lottie accents.

**Architecture:** 4 independent animation layers that stack for depth: Background World (Liquid Ether + parallax), Section Entrances (GSAP ScrollTrigger), Micro-interactions (cursor tracking + magnetic effects), and Lottie Accents (animated icons). Each layer is independently deployable.

**Tech Stack:** Next.js 15.5, React 19, Motion v12, GSAP + ScrollTrigger (new), Lottie-react (new), Tailwind CSS v4

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install GSAP, Lottie, and the Liquid Ether dependency (Three.js)**

Run:
```bash
npm install gsap @gsap/react lottie-react three @react-three/fiber
```

**Step 2: Verify installation**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install gsap, lottie-react, three.js for animation overhaul"
```

---

## Task 2: Liquid Ether Background Component

**Files:**
- Create: `components/LiquidEther.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the Liquid Ether component**

Create `components/LiquidEther.tsx` — a WebGL fluid simulation background. Adapt from reactbits.dev/backgrounds/liquid-ether source. Key requirements:
- Colors: `['#4ade80', '#0a0a0a', '#1a1a1a']`
- Fixed position behind all content (z-index: 0)
- Low opacity (~0.3-0.4) so content stays readable
- Mouse-reactive with auto-animation when idle
- IntersectionObserver to pause when off-screen
- `"use client"` directive
- Wrap in a container div with `fixed inset-0 z-0 opacity-30`

**Step 2: Add Liquid Ether to the page**

Modify `app/page.tsx`. Add import and render before the `<main>` tag:

```tsx
import LiquidEther from "@/components/LiquidEther"

export default function Home() {
  return (
    <>
      <LiquidEther />
      <main className="relative z-10 min-h-screen grain">
        {/* existing sections unchanged */}
      </main>
    </>
  )
}
```

Key changes:
- Line 1-6: Add LiquidEther import alongside existing imports
- Line 10: Wrap existing `<main>` content — add `relative z-10` to ensure content is above the background
- Add `<LiquidEther />` before `<main>`

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Flowing green/dark fluid background visible behind all content. Content remains fully readable.

**Step 4: Commit**

```bash
git add components/LiquidEther.tsx app/page.tsx
git commit -m "feat: add Liquid Ether WebGL fluid background"
```

---

## Task 3: Animated Grain Overlay

**Files:**
- Modify: `app/globals.css` (lines 77-86)

**Step 1: Add animation to the grain overlay**

In `app/globals.css`, replace the existing `.grain::after` block (lines 77-86) with an animated version:

```css
.grain::after {
  content: '';
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.015;
  pointer-events: none;
  z-index: 9999;
  animation: grain-shift 8s steps(10) infinite;
}

@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -15%); }
  40% { transform: translate(-5%, 15%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 10%); }
  80% { transform: translate(3%, -15%); }
  90% { transform: translate(-10%, 5%); }
}
```

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Grain texture subtly shifts position creating a shimmer effect. Should be barely perceptible.

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add animated grain shimmer overlay"
```

---

## Task 4: Parallax Gradient Blobs

**Files:**
- Create: `components/ParallaxBlobs.tsx`
- Modify: `app/page.tsx`

**Step 1: Create the ParallaxBlobs component**

Create `components/ParallaxBlobs.tsx`:

```tsx
"use client"

import { useEffect, useState } from "react"

export default function ParallaxBlobs() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const blobs = [
    { top: "20%", left: "70%", size: 600, color: "bg-accent/[0.06]", blur: 150, speed: 0.3 },
    { top: "50%", left: "20%", size: 400, color: "bg-accent/[0.04]", blur: 120, speed: 0.15 },
    { top: "75%", left: "60%", size: 500, color: "bg-blue/[0.03]", blur: 130, speed: 0.25 },
  ]

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${blob.color}`}
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            filter: `blur(${blob.blur}px)`,
            transform: `translateY(${scrollY * blob.speed * (i % 2 === 0 ? -1 : 1)}px) scale(${1 + Math.sin(scrollY * 0.001 + i) * 0.05})`,
            transition: "transform 0.1s linear",
          }}
        />
      ))}
    </div>
  )
}
```

**Step 2: Add to page**

Modify `app/page.tsx` — add import and render after `<LiquidEther />`:

```tsx
import ParallaxBlobs from "@/components/ParallaxBlobs"
// ...
<LiquidEther />
<ParallaxBlobs />
<main className="relative z-10 min-h-screen grain">
```

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Gradient blobs visible behind content that move at different speeds when scrolling.

**Step 4: Commit**

```bash
git add components/ParallaxBlobs.tsx app/page.tsx
git commit -m "feat: add scroll-linked parallax gradient blobs"
```

---

## Task 5: GSAP ScrollTrigger Setup + Hero Split-Text Animation

**Files:**
- Create: `lib/gsap-init.ts`
- Modify: `components/Hero.tsx`

**Step 1: Create GSAP initialization module**

Create `lib/gsap-init.ts`:

```ts
"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

**Step 2: Rewrite Hero with GSAP split-text animation**

Modify `components/Hero.tsx`. Replace the existing Motion-based animation with GSAP:

Key changes:
- Replace `import { motion } from "motion/react"` with GSAP imports
- Add `useRef` and `useLayoutEffect` hooks
- Split the headline text into individual `<span>` elements wrapping each character
- Use GSAP timeline for staggered character entrance:
  - Each character: `opacity: 0 → 1`, `y: 40 → 0`, stagger: 0.03s
  - After headline: description fades in (0.7s)
  - After description: buttons scale in with bounce easing
- Phone mockup gets continuous floating animation: `y: "-=4"` yoyo repeat infinite, duration 3s
- Background glow: GSAP `fromTo` with scale and opacity pulse (keep infinite)
- Keep the scroll indicator bounce animation
- Remove `containerVariants` and `itemVariants` — replace with GSAP timeline
- Use `useGSAP` hook from `@gsap/react` for cleanup

The hero headline "Track your gains." and "Ditch the spreadsheet." should each have characters wrapped in spans. The gradient text "Ditch the spreadsheet." gets the same treatment but keeps its gradient classes.

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Hero loads with dramatic character-by-character text reveal, buttons bounce in after, phone floats continuously.

**Step 4: Commit**

```bash
git add lib/gsap-init.ts components/Hero.tsx
git commit -m "feat: GSAP split-text hero animation with floating phone"
```

---

## Task 6: Features Section — Word Reveal + 3D Card Entrances

**Files:**
- Modify: `components/Features.tsx`

**Step 1: Rewrite Features with GSAP ScrollTrigger**

Modify `components/Features.tsx`:

Key changes:
- Replace Motion imports with GSAP + ScrollTrigger
- Title "Everything you need to train smarter" gets word-by-word reveal:
  - Split into `<span>` per word
  - Each word: `opacity: 0 → 1`, `y: 30 → 0`, stagger: 0.08s
  - Triggered by ScrollTrigger when section enters viewport
- Feature cards get 3D stagger entrance:
  - `opacity: 0 → 1`, `y: 60 → 0`, `rotateX: 15 → 0`, `rotateY: alternating ±10 → 0`
  - Stagger: 0.1s between cards
  - Perspective set on parent container: `style={{ perspective: 1000 }}`
  - ScrollTrigger: `start: "top 80%"`, `once: true`
- Keep existing hover effects (they're CSS-based via Tailwind)
- Add `will-change: transform` to cards for GPU acceleration

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Scrolling to Features triggers word-by-word title reveal, then cards tilt in from alternating directions.

**Step 3: Commit**

```bash
git add components/Features.tsx
git commit -m "feat: GSAP word reveal + 3D card entrances for Features"
```

---

## Task 7: Screenshots Section — Scale-Rotate Entrance

**Files:**
- Modify: `components/Screenshots.tsx`

**Step 1: Rewrite Screenshots with GSAP ScrollTrigger**

Modify `components/Screenshots.tsx`:

Key changes:
- Replace Motion imports with GSAP
- Title: word-by-word reveal (same pattern as Features)
- Phone mockup cards: `scale: 0.8 → 1`, `rotate: -5 → 0`, `opacity: 0 → 1`
  - Stagger: 0.12s
  - ScrollTrigger: `start: "top 75%"`
  - Easing: `"back.out(1.7)"` for overshoot effect
- Keep horizontal scroll behavior and fade-edges mask

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Screenshots scale up and unrotate as they enter viewport.

**Step 3: Commit**

```bash
git add components/Screenshots.tsx
git commit -m "feat: GSAP scale-rotate entrance for Screenshots"
```

---

## Task 8: Pricing Section — 3D Flip + Counter + Checkmark Draw

**Files:**
- Modify: `components/PricingSection.tsx`

**Step 1: Convert PricingSection to client component with GSAP**

This is currently a server component. Convert to client component and add animations:

Key changes:
- Add `"use client"` directive at top
- Import GSAP + ScrollTrigger + useRef + useLayoutEffect
- Cards get 3D Y-axis flip entrance:
  - `rotateY: 180 → 0`, `opacity: 0 → 1`
  - Perspective on parent: 1200px
  - `backfaceVisibility: "hidden"` on cards
  - Duration: 0.8s, stagger: 0.2s
  - Easing: `"power2.out"`
  - ScrollTrigger: `start: "top 75%"`
- Price numbers count up from $0:
  - Use GSAP `to` with `snap` modifier
  - `innerText` target with snap to 0.01 for decimals
  - Duration: 1.5s, easing: `"power2.out"`
  - Triggered after cards flip in
- Feature checkmarks: SVG path stroke animation
  - Replace static checkmark SVGs with `<path>` elements that have `strokeDasharray` and `strokeDashoffset`
  - GSAP animates `strokeDashoffset` from full length to 0
  - Stagger: 0.1s between checkmarks
- Highlighted card: add pulsing glow border
  - GSAP infinite timeline: `boxShadow` oscillates between `0 0 20px rgba(74,222,128,0.2)` and `0 0 40px rgba(74,222,128,0.4)`

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Pricing cards flip in from back, numbers count up, checkmarks draw themselves in sequence.

**Step 3: Commit**

```bash
git add components/PricingSection.tsx
git commit -m "feat: GSAP 3D flip, counter, checkmark draw for Pricing"
```

---

## Task 9: FAQ Section — Slide-in + Spring Chevron

**Files:**
- Modify: `components/FAQSection.tsx`

**Step 1: Enhance FAQ with GSAP**

Modify `components/FAQSection.tsx`:

Key changes:
- Keep Motion for the accordion expand/collapse (AnimatePresence is better for this)
- Add GSAP ScrollTrigger for entrance animations:
  - Items slide in from right: `x: 80 → 0`, `opacity: 0 → 1`, `rotateY: -5 → 0`
  - Stagger: 0.08s
  - Perspective on parent container
- Replace chevron rotation with spring physics:
  - Use Motion's `transition: { type: "spring", stiffness: 300, damping: 15 }`
  - This gives an overshoot bounce when rotating
- Answer content: fast word reveal on expand
  - Split answer text into words, stagger opacity with 0.02s delay
  - Use Motion variants within AnimatePresence

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: FAQ items slide in from right with slight 3D tilt, chevrons bounce with spring physics, answers reveal word by word.

**Step 3: Commit**

```bash
git add components/FAQSection.tsx
git commit -m "feat: GSAP slide-in + spring chevron for FAQ"
```

---

## Task 10: Footer — Stagger Entrance + Gradient Line

**Files:**
- Modify: `components/Footer.tsx`

**Step 1: Convert Footer to client component with GSAP entrance**

Key changes:
- Add `"use client"` directive
- Import GSAP + ScrollTrigger + useRef + useLayoutEffect
- Animated gradient line at top:
  - `<div>` with gradient background, `scaleX: 0 → 1`, `transformOrigin: "left"`
  - Duration: 1s, ScrollTrigger: `start: "top 90%"`
- Link columns stagger in from bottom:
  - `opacity: 0 → 1`, `y: 30 → 0`
  - Stagger: 0.05s
  - ScrollTrigger triggered when footer enters viewport
- Brand column fades in first, then link columns

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Gradient line draws across footer top, then content staggers in from bottom.

**Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: GSAP footer entrance with gradient line animation"
```

---

## Task 11: Magnetic Buttons Component

**Files:**
- Create: `components/MagneticButton.tsx`
- Modify: `components/Hero.tsx` (wrap CTA buttons)
- Modify: `components/PricingSection.tsx` (wrap CTA buttons)

**Step 1: Create MagneticButton component**

Create `components/MagneticButton.tsx`:

```tsx
"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  as?: "a" | "button"
  href?: string
  strength?: number
  [key: string]: unknown
}

export default function MagneticButton({
  children,
  className = "",
  as = "button",
  href,
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) * strength
    const y = (e.clientY - top - height / 2) * strength
    setPosition({ x, y })
  }

  const handleLeave = () => setPosition({ x: 0, y: 0 })

  const Component = motion[as] as typeof motion.button

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {as === "a" ? (
        <motion.a href={href} {...props}>{children}</motion.a>
      ) : (
        <Component {...props}>{children}</Component>
      )}
    </motion.div>
  )
}
```

**Step 2: Wrap Hero CTA buttons with MagneticButton**

In `components/Hero.tsx`, wrap the "Get Started Free" and "See Features" buttons.

**Step 3: Wrap Pricing CTA buttons with MagneticButton**

In `components/PricingSection.tsx`, wrap the pricing CTA buttons.

**Step 4: Verify in browser**

Run: `npm run dev`
Expected: Buttons subtly follow cursor when hovering, snap back with spring physics on leave.

**Step 5: Commit**

```bash
git add components/MagneticButton.tsx components/Hero.tsx components/PricingSection.tsx
git commit -m "feat: add magnetic button effect to CTAs"
```

---

## Task 12: 3D Tilt Card Effect

**Files:**
- Create: `components/TiltCard.tsx`
- Modify: `components/Features.tsx` (wrap feature cards)
- Modify: `components/PricingSection.tsx` (wrap pricing cards)

**Step 1: Create TiltCard component**

Create `components/TiltCard.tsx`:

```tsx
"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  tiltStrength?: number
  spotlight?: boolean
}

export default function TiltCard({
  children,
  className = "",
  tiltStrength = 10,
  spotlight = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    setTilt({
      rotateX: (0.5 - y) * tiltStrength,
      rotateY: (x - 0.5) * tiltStrength,
    })
    setSpotlightPos({ x: x * 100, y: y * 100 })
  }

  const handleLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setSpotlightPos({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={tilt}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
      {spotlight && (
        <div
          className="absolute inset-0 rounded-card pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(74,222,128,0.08) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  )
}
```

**Step 2: Wrap feature cards and pricing cards with TiltCard**

- In `components/Features.tsx`: wrap each feature card `<div>` with `<TiltCard>`
- In `components/PricingSection.tsx`: wrap each pricing card with `<TiltCard spotlight>`

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Cards tilt toward cursor with spring physics. Pricing cards also show a green spotlight gradient following cursor.

**Step 4: Commit**

```bash
git add components/TiltCard.tsx components/Features.tsx components/PricingSection.tsx
git commit -m "feat: add 3D tilt effect to feature and pricing cards"
```

---

## Task 13: Cursor-Following Glow

**Files:**
- Create: `components/CursorGlow.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create CursorGlow component**

Create `components/CursorGlow.tsx`:

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

export default function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const handleLeave = () => setVisible(false)

    window.addEventListener("mousemove", handleMove, { passive: true })
    document.addEventListener("mouseleave", handleLeave)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998]"
      animate={{
        x: mousePos.x - 150,
        y: mousePos.y - 150,
        opacity: visible ? 0.07 : 0,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      style={{
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,222,128,0.5) 0%, transparent 70%)",
      }}
    />
  )
}
```

**Step 2: Add to layout**

Modify `app/layout.tsx` — add CursorGlow inside the body, before Navbar:

```tsx
import CursorGlow from "@/components/CursorGlow"
// ...
<body>
  <CursorGlow />
  <Navbar />
  {children}
  <StructuredData />
</body>
```

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Soft green glow follows cursor across entire page with slight spring lag.

**Step 4: Commit**

```bash
git add components/CursorGlow.tsx app/layout.tsx
git commit -m "feat: add cursor-following green glow effect"
```

---

## Task 14: Animated Link Underlines

**Files:**
- Modify: `app/globals.css`
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`

**Step 1: Add animated underline CSS utility**

Add to `app/globals.css` after the existing utilities:

```css
.link-underline {
  position: relative;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-bright));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.25, 0.4, 0.25, 1);
}

.link-underline:hover::after {
  transform: scaleX(1);
}
```

**Step 2: Add `link-underline` class to nav links and footer links**

- In `components/Navbar.tsx`: add `link-underline` to desktop nav link classNames (around line 48)
- In `components/Footer.tsx`: add `link-underline` to footer link classNames

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Links get a green underline that draws in from left on hover.

**Step 4: Commit**

```bash
git add app/globals.css components/Navbar.tsx components/Footer.tsx
git commit -m "feat: add animated draw-in underlines to nav and footer links"
```

---

## Task 15: Scroll Progress Bar

**Files:**
- Create: `components/ScrollProgress.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create ScrollProgress component**

Create `components/ScrollProgress.tsx`:

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-accent to-accent-bright origin-left"
        style={{ scaleX: progress, transformOrigin: "left" }}
        transition={{ duration: 0.05 }}
      />
      <motion.div
        className="absolute top-0 right-0 h-full w-[20px] blur-sm bg-accent-bright"
        style={{
          left: `calc(${progress * 100}% - 20px)`,
          opacity: progress > 0.01 ? 0.8 : 0,
        }}
      />
    </div>
  )
}
```

**Step 2: Add to layout**

Modify `app/layout.tsx` — add ScrollProgress after CursorGlow:

```tsx
import ScrollProgress from "@/components/ScrollProgress"
// ...
<CursorGlow />
<ScrollProgress />
<Navbar />
```

**Step 3: Verify in browser**

Run: `npm run dev`
Expected: Thin green progress bar at top of viewport with glowing tip.

**Step 4: Commit**

```bash
git add components/ScrollProgress.tsx app/layout.tsx
git commit -m "feat: add scroll progress bar with glow tip"
```

---

## Task 16: Hide/Show Navbar on Scroll

**Files:**
- Modify: `components/Navbar.tsx`

**Step 1: Add hide/show behavior to Navbar**

Modify `components/Navbar.tsx`:

Key changes:
- Add `lastScrollY` ref and `navVisible` state
- On scroll down (scrollY > lastScrollY + threshold): set `navVisible = false`
- On scroll up (scrollY < lastScrollY - threshold): set `navVisible = true`
- Always visible when scrollY < 100 (near top)
- Apply `transform: translateY(-100%)` when hidden, `translateY(0)` when visible
- Add `transition-transform duration-300` to nav wrapper
- Keep existing scrolled state logic for backdrop blur

```tsx
const [navVisible, setNavVisible] = useState(true)
const lastScrollY = useRef(0)

useEffect(() => {
  const handleScroll = () => {
    const currentY = window.scrollY
    setScrolled(currentY > 50)

    if (currentY < 100) {
      setNavVisible(true)
    } else if (currentY > lastScrollY.current + 10) {
      setNavVisible(false)
    } else if (currentY < lastScrollY.current - 10) {
      setNavVisible(true)
    }
    lastScrollY.current = currentY
  }
  window.addEventListener("scroll", handleScroll, { passive: true })
  return () => window.removeEventListener("scroll", handleScroll)
}, [])
```

Add to nav className: `${navVisible ? "translate-y-0" : "-translate-y-full"}`

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Navbar hides when scrolling down, reappears when scrolling up.

**Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: auto-hide/show navbar on scroll direction"
```

---

## Task 17: Lottie Feature Icons

**Files:**
- Create: `components/LottieIcon.tsx`
- Create: `lib/lottie-icons.ts` (inline Lottie JSON data for 6 feature icons)
- Modify: `components/Features.tsx`

**Step 1: Create Lottie icon data**

Create `lib/lottie-icons.ts` with simple programmatic Lottie animation data for each of the 6 feature icons: dumbbell, clipboard-list, trending-up, library, refresh-cw, zap. Each animation should be a simple draw-on stroke effect.

Since creating full Lottie JSON by hand is complex, use a simpler approach: create a `LottieIcon` wrapper component that uses CSS-driven SVG stroke animations (`stroke-dasharray` + `stroke-dashoffset`) triggered on viewport entry using GSAP ScrollTrigger. This achieves the same draw-on effect without needing Lottie JSON files.

**Step 2: Create LottieIcon component**

Create `components/LottieIcon.tsx`:

```tsx
"use client"

import { useRef, useLayoutEffect } from "react"
import { gsap } from "@/lib/gsap-init"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface LottieIconProps {
  children: React.ReactNode
  className?: string
}

export default function LottieIcon({ children, className = "" }: LottieIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) return
    const paths = ref.current.querySelectorAll("path, line, polyline, circle")

    paths.forEach((path) => {
      const el = path as SVGGeometryElement
      if (el.getTotalLength) {
        const length = el.getTotalLength()
        gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            once: true,
          },
        })
      }
    })
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
```

**Step 3: Wrap FeatureIcon in Features.tsx with LottieIcon**

In `components/Features.tsx`, wrap each `<FeatureIcon>` with `<LottieIcon>`.

**Step 4: Verify in browser**

Run: `npm run dev`
Expected: Feature icons draw their strokes on scroll into viewport.

**Step 5: Commit**

```bash
git add components/LottieIcon.tsx components/Features.tsx
git commit -m "feat: SVG stroke draw-on animation for feature icons"
```

---

## Task 18: Pricing Checkmark Cascade

**Files:**
- Modify: `components/PricingSection.tsx`

**Step 1: Add cascading checkmark animation**

In `components/PricingSection.tsx`, replace static checkmark SVGs with animated versions:

- Each checkmark `<svg>` gets a ref
- GSAP ScrollTrigger animates `strokeDashoffset` from full length to 0
- Stagger: 0.1s between checkmarks within each card
- Triggered when the pricing card enters viewport
- The check path should use `strokeDasharray` equal to its total path length

**Step 2: Verify in browser**

Run: `npm run dev`
Expected: Checkmarks draw themselves one by one as pricing cards enter view.

**Step 3: Commit**

```bash
git add components/PricingSection.tsx
git commit -m "feat: cascading checkmark draw animation in pricing"
```

---

## Task 19: CTA Button Sparkle/Arrow Effects

**Files:**
- Create: `components/ButtonSparkle.tsx`
- Modify: `components/Hero.tsx`

**Step 1: Create ButtonSparkle component**

Create `components/ButtonSparkle.tsx` — a small sparkle burst that triggers on hover:

```tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

interface ButtonSparkleProps {
  children: React.ReactNode
  className?: string
}

export default function ButtonSparkle({ children, className = "" }: ButtonSparkleProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  const handleHover = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
    }))
    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 600)
  }

  return (
    <div className={`relative inline-block ${className}`} onMouseEnter={handleHover}>
      {children}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute w-1 h-1 bg-accent-bright rounded-full pointer-events-none"
            initial={{ opacity: 1, scale: 0, x: s.x, y: s.y }}
            animate={{
              opacity: 0,
              scale: 1.5,
              x: s.x + (Math.random() - 0.5) * 40,
              y: s.y - Math.random() * 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
```

**Step 2: Add animated arrow to Hero CTA**

In `components/Hero.tsx`, modify the "Get Started Free" button arrow SVG:
- Wrap arrow in `motion.span`
- On parent hover: `x: 0 → 4` with spring transition
- Add group class to button, `group-hover:translate-x-1` to arrow

**Step 3: Wrap Hero CTA with ButtonSparkle**

**Step 4: Verify in browser**

Run: `npm run dev`
Expected: Sparkles burst on CTA hover, arrow slides right on hover.

**Step 5: Commit**

```bash
git add components/ButtonSparkle.tsx components/Hero.tsx
git commit -m "feat: sparkle burst and animated arrow on CTA buttons"
```

---

## Task 20: Accessibility — Reduced Motion Support

**Files:**
- Modify: `app/globals.css`
- Modify: `components/LiquidEther.tsx`

**Step 1: Add reduced-motion media query**

Add to `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .grain::after {
    animation: none;
  }
}
```

**Step 2: Add reduced-motion check to Liquid Ether**

In `components/LiquidEther.tsx`, check `window.matchMedia("(prefers-reduced-motion: reduce)")`:
- If true: render a static gradient background instead of the WebGL simulation
- Fallback: `bg-gradient-to-br from-accent/5 via-bg to-bg`

**Step 3: Verify with system setting**

Toggle "Reduce motion" in macOS System Settings > Accessibility > Display.
Expected: All animations disabled, static gradient replaces Liquid Ether.

**Step 4: Commit**

```bash
git add app/globals.css components/LiquidEther.tsx
git commit -m "feat: add prefers-reduced-motion accessibility support"
```

---

## Task 21: Final Build Verification

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Run production server and test**

Run: `npm start`
Expected: All animations work correctly in production mode.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete animation overhaul — Layered Atmosphere"
```

---

## Summary

| Task | Layer | Component | Effort |
|------|-------|-----------|--------|
| 1 | Setup | Install deps | Small |
| 2 | L1 | Liquid Ether background | Large |
| 3 | L1 | Animated grain | Small |
| 4 | L1 | Parallax blobs | Medium |
| 5 | L2 | Hero split-text + float | Large |
| 6 | L2 | Features word reveal + 3D cards | Medium |
| 7 | L2 | Screenshots scale-rotate | Medium |
| 8 | L2 | Pricing 3D flip + counter | Large |
| 9 | L2 | FAQ slide-in + spring | Medium |
| 10 | L2 | Footer stagger + gradient line | Small |
| 11 | L3 | Magnetic buttons | Medium |
| 12 | L3 | 3D tilt cards | Medium |
| 13 | L3 | Cursor glow | Small |
| 14 | L3 | Link underlines | Small |
| 15 | L3 | Scroll progress | Small |
| 16 | L3 | Hide/show navbar | Small |
| 17 | L4 | SVG draw-on icons | Medium |
| 18 | L4 | Checkmark cascade | Small |
| 19 | L4 | Button sparkle/arrow | Medium |
| 20 | A11y | Reduced motion | Small |
| 21 | Final | Build verification | Small |
