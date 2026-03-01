"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { features } from "@/lib/content"
import FeatureIcon from "@/components/FeatureIcon"
import TiltCard from "@/components/TiltCard"

const titleWords = [
  { text: "Everything", gradient: false },
  { text: "you", gradient: false },
  { text: "need", gradient: false },
  { text: "to", gradient: false },
  { text: "train", gradient: true },
  { text: "smarter", gradient: true },
]

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Word-by-word title reveal
    const words = headingRef.current?.querySelectorAll(".title-word")
    if (words && words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      )
    }

    // 3D card stagger entrance
    const cards = gridRef.current?.querySelectorAll(".feature-card")
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          rotateX: 15,
          rotateY: (_index: number) => (_index % 2 === 0 ? 10 : -10),
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            once: true,
          },
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="features" className="relative py-28 px-6">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      bg-accent/[0.03] blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            {titleWords.map((word, i) => (
              <span key={i}>
                <span
                  className={`title-word inline-block ${
                    word.gradient
                      ? "bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent"
                      : ""
                  }`}
                  style={{ opacity: 0 }}
                >
                  {word.text}
                </span>
                {/* Add space after each word except the last */}
                {i < titleWords.length - 1 && " "}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-muted text-lg max-w-xl mx-auto">
            Purpose-built tools that replace your notebook, spreadsheet, and guesswork.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ perspective: 1000 }}
        >
          {features.map((feature) => (
            <TiltCard key={feature.title}>
              <div
                className="feature-card group"
                style={{ opacity: 0, willChange: "transform" }}
              >
                <div className="h-full rounded-card bg-card/80 border border-white/[0.06]
                                p-6 transition-all duration-300
                                hover:bg-card hover:border-accent/20
                                hover:shadow-[0_0_30px_rgba(74,222,128,0.08)]
                                hover:-translate-y-0.5">
                  <FeatureIcon name={feature.icon} />
                  <h3 className="text-base font-bold text-text mb-2">{feature.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
