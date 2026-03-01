"use client"

import { useState, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import { motion, AnimatePresence } from "motion/react"
import { faqItems } from "@/lib/content"

const titleWords = [
  { text: "Frequently", gradient: false },
  { text: "asked", gradient: false },
  { text: "questions", gradient: false },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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

    // FAQ items slide in from right
    const items = listRef.current?.querySelectorAll(".faq-item")
    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, x: 80, rotateY: -5 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
            once: true,
          },
        }
      )
    }
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="faq" className="relative py-28 px-6">
      <div className="max-w-2xl mx-auto">
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
            Got questions? We have answers.
          </p>
        </div>

        <div
          ref={listRef}
          className="space-y-2"
          style={{ perspective: 1000 }}
        >
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.question}
                className={`faq-item rounded-card border transition-colors duration-300 ${
                  isOpen
                    ? "bg-card/80 border-accent/20"
                    : "bg-transparent border-white/[0.06] hover:border-white/[0.1]"
                }`}
                style={{ opacity: 0, willChange: "transform" }}
              >
                <button
                  id={`faq-button-${index}`}
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <span className={`font-bold text-sm md:text-base transition-colors duration-200 ${
                    isOpen ? "text-text" : "text-muted group-hover:text-text"
                  }`}>
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-200 ${
                        isOpen ? "text-accent" : "text-muted/50"
                      }`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-button-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.2, delay: 0.1 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-muted text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
