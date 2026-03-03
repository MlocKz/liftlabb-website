# Showcase Animations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Hero phone and Screenshots gallery sections more interactive with auto-cycling screens, 3D tilt, a card fan layout, and proper centering.

**Architecture:** All animations driven by GSAP + ScrollTrigger (already initialized in `lib/gsap-init.ts`). Hero phone gets a GSAP-powered crossfade carousel with dot indicators. Screenshots gallery gets a 3D fan layout on desktop with hover/tap lift, keeping horizontal scroll on mobile. `prefers-reduced-motion` respected throughout.

**Tech Stack:** GSAP, ScrollTrigger, @gsap/react (useGSAP), React state for carousel index, Tailwind CSS v4, Next.js Image

---

### Task 1: Update screenshot labels in content

**Files:**
- Modify: `lib/content.ts:139-146`

**Step 1: Rename "Charts" to "Progression"**

Change line 142:
```ts
// Before:
{ name: "Charts", src: "/screenshots/history.png" },
// After:
{ name: "Progression", src: "/screenshots/history.png" },
```

**Step 2: Verify dev server shows the site**

Run: `npm run dev`
Expected: Site loads at localhost:3000 without errors

**Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "content: rename Charts screenshot to Progression"
```

---

### Task 2: Add CSS utilities for 3D transforms and glow

**Files:**
- Modify: `app/globals.css` (append before reduced motion section)

**Step 1: Add the new utility classes**

Add these before the `/* ── Reduced Motion */` section (before line 183):

```css
/* ── 3D Perspective Containers ───────────── */
.perspective-1000 {
  perspective: 1000px;
}

/* ── Screenshot Card Glow on Active ──────── */
.card-glow {
  box-shadow:
    0 0 30px rgba(74, 222, 128, 0.15),
    0 0 60px rgba(74, 222, 128, 0.05);
}

/* ── Dot Indicator ───────────────────────── */
.dot-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}
.dot-indicator.active {
  background: var(--color-accent);
  transform: scale(1.3);
}
```

**Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add 3D perspective and card glow CSS utilities"
```

---

### Task 3: Hero phone auto-cycling with crossfade

This is the biggest task. We rewrite `Hero.tsx` to cycle through all screenshots with crossfade transitions, dot indicators, and tap-to-pause.

**Files:**
- Modify: `components/Hero.tsx`

**Step 1: Add imports and state**

At top of file, update the import line:
```ts
import { useRef, useState, useEffect, useCallback } from "react"
```

Add import for screenshots:
```ts
import { siteConfig, screenshots } from "@/lib/content"
```

**Step 2: Add cycling state and refs inside the Hero component**

After the existing refs (line 30, after `scrollRef`), add:

```ts
const [currentIndex, setCurrentIndex] = useState(0)
const [isPaused, setIsPaused] = useState(false)
const screenRefs = useRef<(HTMLDivElement | null)[]>([])
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
```

**Step 3: Add the auto-cycling effect**

After the `useGSAP` block (after line 105), add:

```ts
// Auto-cycle screenshots
const advanceSlide = useCallback(() => {
  setCurrentIndex((prev) => {
    const next = (prev + 1) % screenshots.length
    // Crossfade: fade out current, fade in next
    const screens = screenRefs.current
    if (screens[prev]) {
      gsap.to(screens[prev], { opacity: 0, scale: 0.95, duration: 0.6, ease: "power2.inOut" })
    }
    if (screens[next]) {
      gsap.to(screens[next], { opacity: 1, scale: 1, duration: 0.6, ease: "power2.inOut" })
    }
    return next
  })
}, [])

useEffect(() => {
  // Check reduced motion preference
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReduced || isPaused) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    return
  }

  intervalRef.current = setInterval(advanceSlide, 3000)
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
}, [isPaused, advanceSlide])
```

**Step 4: Add tap-to-pause handler**

Below the auto-cycling effect:

```ts
const handlePhoneTap = useCallback(() => {
  setIsPaused((p) => !p)
}, [])
```

**Step 5: Replace the phone mockup JSX**

Replace lines 214-252 (the phone mockup column) with:

```tsx
{/* Phone mockup column */}
<div ref={phoneRef} style={{ opacity: 0 }} className="flex-1 flex justify-center">
  <div className="relative perspective-1000">
    {/* Phone glow */}
    <div className="absolute -inset-8 bg-accent/6 blur-[60px] rounded-full" aria-hidden="true" />

    {/* Phone frame */}
    <div
      className="relative bg-card-2 rounded-[3rem] p-[10px]
                  shadow-2xl shadow-black/50
                  ring-1 ring-white/[0.05]
                  h-[520px] w-[250px] sm:h-[600px] sm:w-[290px]
                  cursor-pointer"
      onClick={handlePhoneTap}
    >
      {/* Inner screen */}
      <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-bg
                      ring-1 ring-white/[0.05]">
        {/* Dynamic island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2
                        w-[90px] h-[26px] bg-card-2 rounded-full z-10" />

        {/* Stacked screens for crossfade */}
        {screenshots.map((s, i) => (
          <div
            key={s.name}
            ref={(el) => { screenRefs.current[i] = el }}
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={s.src}
              alt={`LiftLabb ${s.name}`}
              fill
              className="object-cover object-top"
              sizes="290px"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Screen reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2
                      w-[120px] h-[4px] bg-white/10 rounded-full" />
    </div>

    {/* Dot indicators */}
    <div className="flex justify-center gap-2 mt-4">
      {screenshots.map((s, i) => (
        <button
          key={s.name}
          className={`dot-indicator ${i === currentIndex ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            // Fade out current
            const screens = screenRefs.current
            if (screens[currentIndex]) {
              gsap.to(screens[currentIndex], { opacity: 0, scale: 0.95, duration: 0.6, ease: "power2.inOut" })
            }
            // Fade in target
            if (screens[i]) {
              gsap.to(screens[i], { opacity: 1, scale: 1, duration: 0.6, ease: "power2.inOut" })
            }
            setCurrentIndex(i)
            setIsPaused(true)
          }}
          aria-label={`View ${s.name} screenshot`}
        />
      ))}
    </div>
  </div>
</div>
```

Key changes:
- `lg:justify-end` changed to `justify-center` (centering fix)
- All 6 screenshots stacked absolutely with opacity crossfade
- Dot indicators below phone
- Click/tap toggles pause
- `perspective-1000` class on wrapper for 3D tilt (Task 4)

**Step 6: Verify in browser**

Run: `npm run dev`
Check: Hero phone auto-cycles through screenshots every 3s, dot indicators update, tap pauses cycling

**Step 7: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add auto-cycling screenshot carousel to hero phone"
```

---

### Task 4: Hero phone 3D tilt on desktop

**Files:**
- Modify: `components/Hero.tsx`

**Step 1: Add tilt effect inside the useGSAP block**

After the scroll indicator bounce animation (after line ~103, before the closing `}, { scope: sectionRef })`), add:

```ts
// 3D tilt on desktop hover
const phoneEl = phoneRef.current
if (phoneEl && !window.matchMedia("(pointer: coarse)").matches) {
  const perspectiveWrapper = phoneEl.querySelector(".perspective-1000") as HTMLElement
  if (perspectiveWrapper) {
    const phoneFrame = perspectiveWrapper.querySelector(":scope > div:nth-child(2)") as HTMLElement
    if (phoneFrame) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = perspectiveWrapper.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8
        const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 8
        gsap.to(phoneFrame, {
          rotateX,
          rotateY,
          duration: 0.5,
          ease: "power2.out",
        })
      }

      const handleMouseLeave = () => {
        gsap.to(phoneFrame, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        })
      }

      perspectiveWrapper.addEventListener("mousemove", handleMouseMove)
      perspectiveWrapper.addEventListener("mouseleave", handleMouseLeave)

      // Cleanup — useGSAP context handles this via return
      return () => {
        perspectiveWrapper.removeEventListener("mousemove", handleMouseMove)
        perspectiveWrapper.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }
}
```

**Important:** The useGSAP cleanup handles reverting GSAP tweens, but we need the event listener cleanup too. Wrap the tilt code in its own cleanup function returned from the useGSAP callback.

Actually, since `useGSAP` doesn't work like a standard `useEffect` for cleanup — we should move the tilt logic into a separate `useEffect`:

```ts
useEffect(() => {
  const phoneEl = phoneRef.current
  if (!phoneEl) return
  // Skip tilt on touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const perspectiveWrapper = phoneEl.querySelector(".perspective-1000") as HTMLElement
  if (!perspectiveWrapper) return
  const phoneFrame = perspectiveWrapper.querySelector(":scope > .relative:not(.absolute)") as HTMLElement
  if (!phoneFrame) return

  const handleMouseMove = (e: MouseEvent) => {
    const rect = perspectiveWrapper.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 8
    gsap.to(phoneFrame, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  const handleMouseLeave = () => {
    gsap.to(phoneFrame, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    })
  }

  perspectiveWrapper.addEventListener("mousemove", handleMouseMove)
  perspectiveWrapper.addEventListener("mouseleave", handleMouseLeave)

  return () => {
    perspectiveWrapper.removeEventListener("mousemove", handleMouseMove)
    perspectiveWrapper.removeEventListener("mouseleave", handleMouseLeave)
  }
}, [])
```

**Step 2: Verify in browser**

On desktop: hover over phone, it should tilt toward cursor (max 8deg). Mouse leave resets.
On mobile: no tilt, just the float animation.

**Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add 3D tilt effect to hero phone on desktop"
```

---

### Task 5: Screenshots gallery — 3D card fan layout (desktop)

**Files:**
- Modify: `components/Screenshots.tsx`

**Step 1: Rewrite the component**

Replace the entire file with:

```tsx
"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { screenshots } from "@/lib/content"
import PhoneMockup from "@/components/PhoneMockup"

const titleWords = "See it in action".split(" ")

// Fan rotation angles: center card = 0, outer cards increase
function getFanTransform(index: number, total: number) {
  const center = (total - 1) / 2
  const offset = index - center
  return {
    rotateY: offset * 5,       // ±5deg per step from center
    translateZ: -Math.abs(offset) * 30,  // recede from center
    translateX: offset * 15,    // spread horizontally
    scale: 1 - Math.abs(offset) * 0.03,  // slightly smaller at edges
  }
}

export default function Screenshots() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useGSAP(() => {
    // Title word-by-word reveal
    const words = titleRef.current?.querySelectorAll(".title-word")
    if (words && words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            once: true,
          },
        }
      )
    }

    const cards = galleryRef.current?.querySelectorAll(".screenshot-card")
    if (!cards || cards.length === 0) return

    if (isMobile) {
      // Mobile: keep existing scale-rotate entrance
      gsap.fromTo(
        cards,
        { scale: 0.8, rotate: -5, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 75%",
            once: true,
          },
        }
      )
    } else {
      // Desktop: cards start stacked at center, fan out
      const total = cards.length
      cards.forEach((card, i) => {
        const t = getFanTransform(i, total)
        // Start state: all stacked at center
        gsap.set(card, {
          opacity: 0,
          rotateY: 0,
          z: 0,
          x: 0,
          scale: 0.8,
        })
      })

      // Fan out on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 75%",
          once: true,
        },
      })

      cards.forEach((card, i) => {
        const t = getFanTransform(i, total)
        tl.to(
          card,
          {
            opacity: 1,
            rotateY: t.rotateY,
            z: t.translateZ,
            x: t.translateX,
            scale: t.scale,
            duration: 0.7,
            ease: "back.out(1.4)",
          },
          i * 0.1 // stagger
        )
      })
    }
  }, { scope: sectionRef, dependencies: [isMobile] })

  // Handle card hover/tap
  const handleCardInteract = (index: number) => {
    setActiveCard((prev) => (prev === index ? null : index))

    const cards = galleryRef.current?.querySelectorAll(".screenshot-card")
    if (!cards) return

    cards.forEach((card, i) => {
      if (i === index && activeCard !== index) {
        // Lift this card
        gsap.to(card, {
          z: 40,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        })
      } else {
        // Reset to fan position
        const t = getFanTransform(i, cards.length)
        gsap.to(card, {
          z: t.translateZ,
          scale: t.scale,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    })
  }

  return (
    <section ref={sectionRef} id="screenshots" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[800px] h-[400px] bg-accent/[0.03] blur-[150px] rounded-full
                      pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            {titleWords.map((word, i) => (
              <span
                key={i}
                className="inline-block title-word mr-[0.3em]"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-muted text-lg">
            Clean, focused interfaces designed for the gym floor.
          </p>
        </div>
      </div>

      {isMobile ? (
        /* ── Mobile: horizontal scroll carousel ── */
        <div className="fade-edges">
          <div
            ref={galleryRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth
                       pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       px-[max(24px,calc((100vw-220px)/2))]"
          >
            {screenshots.map((s, i) => (
              <div
                key={s.name}
                className="screenshot-card snap-center shrink-0"
                style={{ opacity: 0 }}
                onClick={() => setActiveCard(prev => prev === i ? null : i)}
              >
                <div className={`transition-shadow duration-300 rounded-[2.5rem] ${activeCard === i ? "card-glow" : ""}`}>
                  <PhoneMockup className="w-[220px]">
                    <Image
                      src={s.src}
                      alt={s.name}
                      fill
                      className="object-cover object-top"
                      sizes="220px"
                    />
                  </PhoneMockup>
                </div>
                <p className={`text-center text-sm mt-3 transition-colors duration-300 ${
                  activeCard === i ? "text-accent" : "text-muted"
                }`}>
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Desktop: 3D card fan ── */
        <div className="perspective-1000 max-w-6xl mx-auto px-6">
          <div
            ref={galleryRef}
            className="flex justify-center items-center gap-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            {screenshots.map((s, i) => (
              <div
                key={s.name}
                className="screenshot-card"
                style={{ opacity: 0, transformStyle: "preserve-3d" }}
                onMouseEnter={() => handleCardInteract(i)}
                onMouseLeave={() => {
                  setActiveCard(null)
                  const cards = galleryRef.current?.querySelectorAll(".screenshot-card")
                  if (!cards) return
                  const t = getFanTransform(i, cards.length)
                  gsap.to(cards[i], {
                    z: t.translateZ,
                    scale: t.scale,
                    duration: 0.3,
                    ease: "power2.out",
                  })
                }}
                onClick={() => handleCardInteract(i)}
              >
                <div className={`transition-shadow duration-300 rounded-[2.5rem] ${activeCard === i ? "card-glow" : ""}`}>
                  <PhoneMockup className="w-[200px]">
                    <Image
                      src={s.src}
                      alt={s.name}
                      fill
                      className="object-cover object-top"
                      sizes="200px"
                    />
                  </PhoneMockup>
                </div>
                <p className={`text-center text-sm mt-3 transition-colors duration-300 ${
                  activeCard === i ? "text-accent" : "text-muted"
                }`}>
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
```

**Step 2: Verify in browser**

Desktop: Cards fan out on scroll, hover lifts with glow, label turns green.
Mobile: Horizontal scroll with snap centering, tap highlights card.

**Step 3: Commit**

```bash
git add components/Screenshots.tsx
git commit -m "feat: add 3D card fan layout and interactions to screenshots gallery"
```

---

### Task 6: Final polish and reduced motion

**Files:**
- Modify: `components/Hero.tsx` (minor)
- Modify: `components/Screenshots.tsx` (minor)

**Step 1: Verify reduced motion**

In Hero.tsx, the auto-cycling `useEffect` already checks `prefers-reduced-motion`. Verify:
- With reduced motion enabled in OS settings, hero shows static first screenshot
- Screenshots gallery shows cards in final fan position without animation

**Step 2: Browser testing checklist**

- [ ] Hero phone cycles every 3s on both mobile and desktop
- [ ] Tap/click pauses and resumes cycling
- [ ] Dot indicators update and are clickable
- [ ] Hero phone is centered (not right-justified)
- [ ] 3D tilt works on desktop, disabled on mobile
- [ ] Screenshots fan out on scroll (desktop)
- [ ] Screenshots hover/tap lifts card with green glow
- [ ] Mobile screenshots scroll horizontally with snap
- [ ] Feature labels appear under each card
- [ ] No horizontal overflow on any viewport width
- [ ] `prefers-reduced-motion` disables cycling and entrance animations

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: interactive showcase animations with auto-cycling hero and 3D gallery fan"
```
