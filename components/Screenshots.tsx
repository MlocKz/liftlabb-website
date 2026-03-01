"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { screenshots } from "@/lib/content"
import PhoneMockup from "@/components/PhoneMockup"

const titleWords = "See it in action".split(" ")

export default function Screenshots() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

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

    // Phone mockup scale-rotate entrance
    const cards = galleryRef.current?.querySelectorAll(".screenshot-card")
    if (cards && cards.length > 0) {
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

      {/* Scrollable gallery with edge fades */}
      <div className="fade-edges">
        <div
          ref={galleryRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth
                        pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6"
        >
          {/* Left spacer */}
          <div className="shrink-0 w-[max(24px,calc((100%-5*220px-4*20px)/2))]" aria-hidden="true" />
          {screenshots.map((s) => (
            <div
              key={s.name}
              className="screenshot-card snap-center shrink-0"
              style={{ opacity: 0 }}
            >
              <PhoneMockup className="w-[220px]">
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-2"
                  style={{ backgroundColor: s.color }}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-sm bg-white/20" />
                  </div>
                  <span className="text-white/50 text-xs font-medium tracking-wide">{s.name}</span>
                </div>
              </PhoneMockup>
            </div>
          ))}
          {/* Right spacer */}
          <div className="shrink-0 w-[max(24px,calc((100%-5*220px-4*20px)/2))]" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
