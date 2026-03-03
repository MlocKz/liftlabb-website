"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { screenshots } from "@/lib/content"
import PhoneMockup from "@/components/PhoneMockup"

const titleWords = "See it in action".split(" ")

export default function Screenshots() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  // ─── Scroll-driven focus effects ───────────────────────────
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const cards = track.querySelectorAll<HTMLElement>(".screenshot-card")
    if (cards.length === 0) return

    function updateFocus() {
      const trackCenter = track!.scrollLeft + track!.offsetWidth / 2
      cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(trackCenter - cardCenter)
        const maxDist = card.offsetWidth * 1.3
        const p = Math.min(dist / maxDist, 1)

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
    const timer = setTimeout(updateFocus, 1000)

    return () => {
      track.removeEventListener("scroll", onScroll)
      clearTimeout(timer)
    }
  }, [])

  // ─── GSAP entrance animations ──────────────────────────────
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

    // Cards entrance
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
  }, { scope: sectionRef })

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

      <div className="fade-edges">
        <div
          ref={trackRef}
          className="flex gap-5 lg:gap-8 overflow-x-scroll snap-x snap-mandatory
                     pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                     [scroll-snap-stop:always] overscroll-x-contain
                     px-[max(24px,calc((100vw-240px)/2))]
                     lg:px-[max(48px,calc((100vw-310px)/2))]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {screenshots.map((s) => (
            <div
              key={s.name}
              className="screenshot-card snap-center shrink-0"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              <PhoneMockup className="w-[240px] lg:w-[310px]">
                <Image
                  src={s.src}
                  alt={s.name}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 310px, 240px"
                />
              </PhoneMockup>
              <p className="text-center text-sm mt-3 text-muted">
                {s.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
