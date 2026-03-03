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
    rotateY: offset * 5,
    translateZ: -Math.abs(offset) * 30,
    translateX: offset * 15,
    scale: 1 - Math.abs(offset) * 0.03,
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
      // Mobile: scale-rotate entrance
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
      cards.forEach((card) => {
        gsap.set(card, {
          opacity: 0,
          rotateY: 0,
          z: 0,
          x: 0,
          scale: 0.8,
        })
      })

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
          i * 0.1
        )
      })
    }
  }, { scope: sectionRef, dependencies: [isMobile] })

  // Handle card hover/tap for desktop
  const handleCardEnter = (index: number) => {
    if (isMobile) return
    setActiveCard(index)
    const cards = galleryRef.current?.querySelectorAll(".screenshot-card")
    if (!cards) return
    gsap.to(cards[index], {
      z: 40,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleCardLeave = (index: number) => {
    if (isMobile) return
    setActiveCard(null)
    const cards = galleryRef.current?.querySelectorAll(".screenshot-card")
    if (!cards) return
    const t = getFanTransform(index, cards.length)
    gsap.to(cards[index], {
      z: t.translateZ,
      scale: t.scale,
      duration: 0.3,
      ease: "power2.out",
    })
  }

  // Handle tap for mobile
  const handleCardTap = (index: number) => {
    if (!isMobile) return
    setActiveCard((prev) => (prev === index ? null : index))
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
                onClick={() => handleCardTap(i)}
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
                onMouseEnter={() => handleCardEnter(i)}
                onMouseLeave={() => handleCardLeave(i)}
                onClick={() => handleCardTap(i)}
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
