"use client"

import { motion } from "motion/react"
import { siteConfig } from "@/lib/content"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export default function Hero() {
  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
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
                      pt-28 pb-20 lg:py-0">

        {/* Text column */}
        <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
          {/* Pill badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5
                             bg-accent/10 border border-accent/20 rounded-full
                             text-accent text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Free for 7 days
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl
                       font-bold leading-[1.08] tracking-tight"
          >
            <span className="text-text">Track your gains.</span>
            <br />
            <span className="bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent">
              Ditch the spreadsheet.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href={siteConfig.appUrl}
              className="btn-shimmer inline-flex items-center justify-center px-8 py-4
                         bg-accent text-bg font-bold rounded-full text-base
                         shadow-[0_0_30px_rgba(74,222,128,0.3)]
                         hover:shadow-[0_0_50px_rgba(74,222,128,0.4)]
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300"
            >
              Get Started Free
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4
                         border border-border-2 text-muted rounded-full text-base
                         hover:border-accent/40 hover:text-text
                         transition-all duration-300"
            >
              See Features
            </a>
          </motion.div>
        </div>

        {/* Phone mockup column */}
        <motion.div variants={itemVariants} className="flex-1 flex justify-center lg:justify-end">
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

                {/* Screen content placeholder */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-3
                                bg-gradient-to-b from-bg via-bg to-accent/5">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M6.5 6.5h11M6.5 17.5h11M2 12h20M4 8v8M8 6v12M16 6v12M20 8v8" />
                    </svg>
                  </div>
                  <span className="text-muted/60 text-xs font-medium tracking-wide">App Preview</span>
                </div>

                {/* Screen reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2
                              w-[120px] h-[4px] bg-white/10 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-muted/40 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-muted/20 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 bg-muted/40 rounded-full" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
