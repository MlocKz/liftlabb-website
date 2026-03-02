"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { siteConfig } from "@/lib/content"
import Image from "next/image"
import MagneticButton from "@/components/MagneticButton"
import ButtonSparkle from "@/components/ButtonSparkle"

function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block split-char" style={{ opacity: 0 }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    // 1. Pill badge fades in first
    tl.fromTo(
      pillRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    )

    // 2. Split-text character animation on headline
    const chars = headlineRef.current?.querySelectorAll(".split-char")
    if (chars && chars.length > 0) {
      tl.fromTo(
        chars,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.03 },
        "-=0.1"
      )
    }

    // 3. Description paragraph fades in
    tl.fromTo(
      descRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.2"
    )

    // 4. CTA buttons scale in
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    )

    // 5. Phone mockup fades in
    tl.fromTo(
      phoneRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )

    // 6. Scroll indicator fades in
    tl.fromTo(
      scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      "-=0.3"
    )

    // 7. Continuous floating animation on phone mockup
    gsap.to(phoneRef.current, {
      y: "-=4",
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: tl.duration(),
    })

    // 8. Scroll indicator bounce
    const scrollDot = scrollRef.current?.querySelector(".scroll-dot")
    if (scrollDot) {
      gsap.to(scrollDot, {
        y: 6,
        duration: 0.75,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* ── Background layers ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Dot grid fading out from center */}
        <div className="absolute inset-0 dot-grid opacity-40"
          style={{
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 100%)",
          }}
        />

        {/* Primary green glow — behind phone */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px]
                        rounded-full bg-accent/8 blur-[150px] glow-pulse" />

        {/* Secondary warm glow — behind text */}
        <div className="absolute top-1/2 left-[15%] w-[300px] h-[300px]
                        rounded-full bg-accent/5 blur-[100px]" />

        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32
                        bg-gradient-to-b from-bg to-transparent" />
      </div>

      {/* ── Content ────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full
                      flex flex-col lg:flex-row items-center gap-16 lg:gap-20
                      pt-28 pb-32 lg:py-0">

        {/* Text column */}
        <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
          {/* Pill badge */}
          <div ref={pillRef} style={{ opacity: 0 }} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5
                             bg-accent/10 border border-accent/20 rounded-full
                             text-accent text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Free for 7 days
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                       font-bold leading-[1.08] tracking-tight"
          >
            <SplitText text="Track your gains." className="text-text" />
            <br />
            <SplitText
              text="Ditch the spreadsheet."
              className="bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent"
            />
          </h1>

          <p
            ref={descRef}
            style={{ opacity: 0 }}
            className="mt-6 text-lg sm:text-xl text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            {siteConfig.description}
          </p>

          <div
            ref={ctaRef}
            style={{ opacity: 0 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <ButtonSparkle>
              <MagneticButton>
                <a
                  href={siteConfig.appUrl}
                  className="group btn-shimmer inline-flex items-center justify-center px-8 py-4
                             bg-accent text-bg font-bold rounded-full text-base
                             shadow-[0_0_30px_rgba(74,222,128,0.3)]
                             hover:shadow-[0_0_50px_rgba(74,222,128,0.4)]
                             hover:scale-[1.02] active:scale-[0.98]
                             transition-all duration-300"
                >
                  Get Started Free
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
              </MagneticButton>
            </ButtonSparkle>
            <MagneticButton>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4
                           border border-border-2 text-muted rounded-full text-base
                           hover:border-accent/40 hover:text-text
                           transition-all duration-300"
              >
                See Features
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Phone mockup column */}
        <div ref={phoneRef} style={{ opacity: 0 }} className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">
            {/* Phone glow */}
            <div className="absolute -inset-8 bg-accent/6 blur-[60px] rounded-full" aria-hidden="true" />

            {/* Phone frame */}
            <div className="relative bg-card-2 rounded-[3rem] p-[10px]
                            shadow-2xl shadow-black/50
                            ring-1 ring-white/[0.05]
                            h-[520px] w-[250px] sm:h-[600px] sm:w-[290px]">
              {/* Inner screen */}
              <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden bg-bg
                              ring-1 ring-white/[0.05]">
                {/* Dynamic island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2
                                w-[90px] h-[26px] bg-card-2 rounded-full z-10" />

                {/* Screen content */}
                <div className="relative w-full h-full">
                  <Image
                    src="/screenshots/today-view.png"
                    alt="LiftLabb workout tracking"
                    fill
                    className="object-cover object-top"
                    sizes="290px"
                    priority
                  />
                </div>

                {/* Screen reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2
                              w-[120px] h-[4px] bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────── */}
      <div
        ref={scrollRef}
        style={{ opacity: 0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-muted/40 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-muted/20 rounded-full flex justify-center pt-1.5">
          <div className="scroll-dot w-1 h-1.5 bg-muted/40 rounded-full" />
        </div>
      </div>
    </section>
  )
}
