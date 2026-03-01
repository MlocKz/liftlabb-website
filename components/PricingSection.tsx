"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { pricingPlans, siteConfig } from "@/lib/content"

const titleWords = [
  { text: "Simple,", gradient: false },
  { text: "transparent", gradient: false },
  { text: "pricing", gradient: true },
]

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const priceRefs = useRef<(HTMLSpanElement | null)[]>([])
  const checkmarkRefs = useRef<(SVGPathElement | null)[][]>([])

  useGSAP(() => {
    // ── Title word reveal ──
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

    // ── Main timeline for card animations ──
    const cards = gridRef.current?.querySelectorAll(".pricing-card")
    if (!cards || cards.length === 0) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 75%",
        once: true,
      },
    })

    // ── Card 3D flip entrance ──
    tl.fromTo(
      cards,
      {
        rotateY: 90,
        opacity: 0,
      },
      {
        rotateY: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }
    )

    // ── Price counter animation ──
    pricingPlans.forEach((plan, index) => {
      const priceEl = priceRefs.current[index]
      if (!priceEl) return

      // Parse numeric value from price string (e.g. "$2.99" → 2.99)
      const targetPrice = parseFloat(plan.price.replace("$", ""))
      const counter = { value: 0 }

      tl.to(
        counter,
        {
          value: targetPrice,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            priceEl.textContent = counter.value.toFixed(2)
          },
        },
        "-=0.6" // Overlap slightly with previous card flip
      )
    })

    // ── Checkmark SVG path draw ──
    pricingPlans.forEach((plan, planIndex) => {
      const paths = checkmarkRefs.current[planIndex]
      if (!paths || paths.length === 0) return

      paths.forEach((path) => {
        if (!path) return
        const length = path.getTotalLength()
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      })

      tl.to(
        paths.filter(Boolean),
        {
          strokeDashoffset: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=1.0" // Overlap with price counter
      )
    })

    // ── Highlighted card pulsing glow ──
    pricingPlans.forEach((plan, index) => {
      if (!plan.highlight) return
      const card = cards[index]
      if (!card) return

      gsap.fromTo(
        card,
        { boxShadow: "0 0 20px rgba(74,222,128,0.15)" },
        {
          boxShadow: "0 0 40px rgba(74,222,128,0.3)",
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        }
      )
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="pricing" className="relative py-28 px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[400px] bg-accent/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto">
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
                {i < titleWords.length - 1 && " "}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-muted text-lg">
            Start your 7-day free trial. No credit card required.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
          style={{ perspective: 1200 }}
        >
          {pricingPlans.map((plan, planIndex) => {
            // Initialize checkmark refs array for this plan
            if (!checkmarkRefs.current[planIndex]) {
              checkmarkRefs.current[planIndex] = []
            }

            return (
              <div
                key={plan.name}
                className={`pricing-card ${plan.highlight ? "gradient-border-bright" : "gradient-border"}`}
                style={{ opacity: 0, backfaceVisibility: "hidden", willChange: "transform" }}
              >
                <div className={`relative h-full rounded-[15px] p-8
                  ${plan.highlight
                    ? "bg-card"
                    : "bg-card"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-accent text-bg text-xs font-bold
                                       px-4 py-1 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-6">
                    {plan.name}
                  </h3>

                  <div className="mb-1">
                    <span className="text-5xl font-bold text-text tracking-tight">
                      $<span
                        ref={(el) => { priceRefs.current[planIndex] = el }}
                      >
                        {plan.price.replace("$", "")}
                      </span>
                    </span>
                    <span className="text-muted text-base ml-1">{plan.period}</span>
                  </div>

                  {plan.savings ? (
                    <div className="mb-6">
                      <span className="text-accent text-sm font-bold">{plan.savings}</span>
                      {plan.monthly && (
                        <span className="text-muted text-sm ml-2">({plan.monthly})</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted/60 text-sm mb-6">Billed monthly</p>
                  )}

                  <a
                    href={siteConfig.appUrl}
                    className={`btn-shimmer block w-full text-center py-3.5 rounded-full
                                font-bold text-sm transition-all duration-300 ${
                      plan.highlight
                        ? "bg-accent text-bg shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.35)]"
                        : "bg-white/[0.06] text-text hover:bg-white/[0.1] border border-white/[0.06]"
                    }`}
                  >
                    Start Free Trial
                  </a>

                  <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <p className="text-xs text-muted/60 uppercase tracking-wider font-bold mb-4">
                      Everything included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-muted">
                          <svg
                            className="w-4 h-4 text-accent flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              ref={(el) => {
                                if (!checkmarkRefs.current[planIndex]) {
                                  checkmarkRefs.current[planIndex] = []
                                }
                                checkmarkRefs.current[planIndex][featureIndex] = el
                              }}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
