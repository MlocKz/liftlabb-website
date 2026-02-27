"use client"
import { motion } from "motion/react"
import { screenshots } from "@/lib/content"
import PhoneMockup from "@/components/PhoneMockup"

export default function Screenshots() {
  return (
    <section id="screenshots" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[800px] h-[400px] bg-accent/[0.03] blur-[150px] rounded-full
                      pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            See it in action
          </h2>
          <p className="mt-4 text-muted text-lg">
            Clean, focused interfaces designed for the gym floor.
          </p>
        </motion.div>
      </div>

      {/* Scrollable gallery with edge fades */}
      <div className="fade-edges">
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth
                        pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6">
          {/* Left spacer */}
          <div className="shrink-0 w-[max(24px,calc((100%-5*220px-4*20px)/2))]" aria-hidden="true" />
          {screenshots.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="snap-center shrink-0"
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
            </motion.div>
          ))}
          {/* Right spacer */}
          <div className="shrink-0 w-[max(24px,calc((100%-5*220px-4*20px)/2))]" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
