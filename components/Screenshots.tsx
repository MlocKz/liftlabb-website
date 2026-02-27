"use client"
import { motion } from "motion/react"
import { screenshots } from "@/lib/content"
import PhoneMockup from "@/components/PhoneMockup"

export default function Screenshots() {
  return (
    <section id="screenshots" className="py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          See it in action
        </motion.h2>
        <div
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Left spacer for centering on desktop */}
          <div className="shrink-0 w-[max(0px,calc((100%-5*260px-4*24px)/2))]" aria-hidden="true" />
          {screenshots.map((s) => (
            <div key={s.name} className="snap-center shrink-0">
              <PhoneMockup className="w-[260px]">
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: s.color }}
                >
                  <span className="text-text/70 text-sm font-medium">{s.name}</span>
                </div>
              </PhoneMockup>
            </div>
          ))}
          {/* Right spacer for centering on desktop */}
          <div className="shrink-0 w-[max(0px,calc((100%-5*260px-4*24px)/2))]" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
