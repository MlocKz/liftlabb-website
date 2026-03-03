"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { screenshots } from "@/lib/content"
import PhoneMockup from "@/components/PhoneMockup"

const titleWords = "See it in action".split(" ")
const CARD_COUNT = screenshots.length
const ANGLE_PER_CARD = 360 / CARD_COUNT
const RADIUS = 380

// Lightweight velocity tracker — measures px/s from last ~100ms of movement
class VelocityTracker {
  private history: { value: number; time: number }[] = []
  record(value: number) {
    const now = performance.now()
    this.history.push({ value, time: now })
    this.history = this.history.filter(h => now - h.time < 100)
  }
  getVelocity(): number {
    if (this.history.length < 2) return 0
    const oldest = this.history[0]
    const newest = this.history[this.history.length - 1]
    const dt = (newest.time - oldest.time) / 1000
    if (dt === 0) return 0
    return (newest.value - oldest.value) / dt
  }
  reset() { this.history = [] }
}

export default function Screenshots() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const angleRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragRef = useRef({ startX: 0, startAngle: 0, isDragging: false })
  const velocityRef = useRef(new VelocityTracker())

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // ─── Mobile: scroll-driven focus effects ───────────────────
  useEffect(() => {
    if (!isMobile) return
    const track = mobileTrackRef.current
    if (!track) return

    const cards = track.querySelectorAll<HTMLElement>(".screenshot-card")
    if (cards.length === 0) return

    function updateFocus() {
      const trackCenter = track!.scrollLeft + track!.offsetWidth / 2
      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(trackCenter - cardCenter)
        const maxDist = card.offsetWidth * 1.3
        const p = Math.min(dist / maxDist, 1) // 0 = centered, 1 = far

        // Scale down, shift down, dim when off-center
        gsap.set(card, {
          scale: 1 - p * 0.12,
          y: p * 10,
          opacity: 1 - p * 0.5,
          overwrite: true,
        })
      })
    }

    const onScroll = () => requestAnimationFrame(updateFocus)
    track.addEventListener("scroll", onScroll, { passive: true })
    // Initial update after GSAP entrance animation settles
    const timer = setTimeout(updateFocus, 1000)

    return () => {
      track.removeEventListener("scroll", onScroll)
      clearTimeout(timer)
    }
  }, [isMobile])

  // ─── Desktop: carousel rotation ───────────────────────────
  const rotateCarousel = useCallback((angle: number, duration = 0.6, ease = "power2.out") => {
    if (!carouselRef.current) return
    gsap.to(carouselRef.current, {
      rotateY: angle,
      duration,
      ease,
      overwrite: true,
    })
  }, [])

  // Auto-cycle
  const advance = useCallback(() => {
    angleRef.current -= ANGLE_PER_CARD
    setCurrentAngle(angleRef.current)
    rotateCarousel(angleRef.current, 0.8, "power2.inOut")
  }, [rotateCarousel])

  useEffect(() => {
    if (isMobile) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(advance, 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, isMobile, advance])

  // Drag/swipe with velocity tracking (desktop)
  useEffect(() => {
    if (isMobile) return
    const el = carouselRef.current?.parentElement
    if (!el) return

    const handlePointerDown = (e: PointerEvent) => {
      setIsPaused(true)
      velocityRef.current.reset()
      dragRef.current = { startX: e.clientX, startAngle: angleRef.current, isDragging: true }
      el.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDragging) return
      const delta = e.clientX - dragRef.current.startX
      const newAngle = dragRef.current.startAngle + delta * 0.3
      velocityRef.current.record(newAngle)
      angleRef.current = newAngle
      setCurrentAngle(newAngle)
      rotateCarousel(newAngle, 0.05)
    }

    const handlePointerUp = () => {
      if (!dragRef.current.isDragging) return
      dragRef.current.isDragging = false

      // Read velocity and project where momentum would carry
      const velocity = velocityRef.current.getVelocity()
      const throwAngle = angleRef.current + velocity * 0.08
      // Snap to nearest card from the projected position
      const snapped = Math.round(throwAngle / ANGLE_PER_CARD) * ANGLE_PER_CARD

      angleRef.current = snapped
      setCurrentAngle(snapped)
      // Spring-like ease: overshoots slightly then settles
      rotateCarousel(snapped, 0.55, "back.out(1.2)")
    }

    el.addEventListener("pointerdown", handlePointerDown)
    el.addEventListener("pointermove", handlePointerMove)
    el.addEventListener("pointerup", handlePointerUp)
    el.addEventListener("pointercancel", handlePointerUp)

    return () => {
      el.removeEventListener("pointerdown", handlePointerDown)
      el.removeEventListener("pointermove", handlePointerMove)
      el.removeEventListener("pointerup", handlePointerUp)
      el.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [isMobile, rotateCarousel])

  // Which card faces front
  const frontIndex = (() => {
    const normalized = (((-currentAngle % 360) + 360) % 360)
    return Math.round(normalized / ANGLE_PER_CARD) % CARD_COUNT
  })()

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

    // Mobile entrance animation — cards start hidden, animate in
    if (isMobile) {
      const cards = sectionRef.current?.querySelectorAll(".screenshot-card")
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { scale: 0.85, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(".fade-edges"),
              start: "top 75%",
              once: true,
            },
          }
        )
      }
    }
  }, { scope: sectionRef, dependencies: [isMobile] })

  const goToCard = (index: number) => {
    setIsPaused(true)
    const targetAngle = -(index * ANGLE_PER_CARD)
    angleRef.current = targetAngle
    setCurrentAngle(targetAngle)
    rotateCarousel(targetAngle, 0.6, "power2.inOut")
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
        /* ── Mobile: smooth focus carousel ── */
        <div className="fade-edges">
          <div
            ref={mobileTrackRef}
            className="flex gap-5 overflow-x-scroll snap-x snap-mandatory
                       pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                       [scroll-snap-stop:always] overscroll-x-contain
                       px-[max(24px,calc((100vw-220px)/2))]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {screenshots.map((s) => (
              <div
                key={s.name}
                className="screenshot-card snap-center shrink-0"
                style={{ opacity: 0, willChange: "transform, opacity" }}
              >
                <PhoneMockup className="w-[220px]">
                  <Image
                    src={s.src}
                    alt={s.name}
                    fill
                    className="object-cover object-top"
                    sizes="220px"
                  />
                </PhoneMockup>
                <p className="text-center text-sm mt-3 text-muted">
                  {s.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Desktop: 3D cylinder carousel ── */
        <div className="relative max-w-6xl mx-auto">
          <div
            className="relative mx-auto cursor-grab active:cursor-grabbing select-none"
            style={{ perspective: "1200px", height: "520px" }}
          >
            <div
              ref={carouselRef}
              className="absolute left-1/2 top-1/2"
              style={{
                transformStyle: "preserve-3d",
                transform: `translateX(-50%) translateY(-50%) rotateY(${currentAngle}deg)`,
                width: "200px",
                height: "430px",
              }}
            >
              {screenshots.map((s, i) => {
                const angle = i * ANGLE_PER_CARD
                return (
                  <div
                    key={s.name}
                    className="screenshot-card absolute left-1/2 top-0"
                    style={{
                      transform: `translateX(-50%) rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      backfaceVisibility: "hidden",
                    }}
                    onClick={() => goToCard(i)}
                  >
                    <div className={`transition-shadow duration-300 rounded-[2.5rem] ${
                      frontIndex === i ? "card-glow" : ""
                    }`}>
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
                      frontIndex === i ? "text-accent" : "text-muted"
                    }`}>
                      {s.name}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-3 mt-6">
            {screenshots.map((s, i) => (
              <button
                key={s.name}
                className={`dot-indicator ${frontIndex === i ? "active" : ""}`}
                onClick={() => goToCard(i)}
                aria-label={`View ${s.name} screenshot`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
