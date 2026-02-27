"use client"

import { motion } from "motion/react"
import { siteConfig } from "@/lib/content"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
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
      {/* Radial green glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[400px] lg:w-[800px] lg:h-[600px] rounded-full
                        bg-accent/10 blur-[120px]" />
      </div>

      {/* Two-column content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full
                      flex flex-col lg:flex-row items-center gap-12 lg:gap-16
                      pt-32 pb-16 lg:py-0">

        {/* Text column */}
        <div className="flex-1 text-center lg:text-left">
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight tracking-tight"
          >
            {siteConfig.tagline}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-muted max-w-lg mx-auto lg:mx-0"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <a
              href={siteConfig.appUrl}
              className="inline-flex items-center justify-center px-8 py-3.5
                         bg-accent text-bg font-bold rounded-full text-lg
                         hover:brightness-110 transition-all"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3.5
                         border border-border text-text rounded-full text-lg
                         hover:border-accent hover:text-accent transition-colors"
            >
              See Features
            </a>
          </motion.div>
        </div>

        {/* Phone mockup column */}
        <motion.div variants={itemVariants} className="flex-1 flex justify-center">
          <div className="relative border-[14px] border-card-2 bg-card-2
                          rounded-[2.5rem] h-[500px] w-[245px]
                          sm:h-[600px] sm:w-[300px] shadow-xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2
                            w-[120px] sm:w-[148px] h-[18px]
                            bg-card-2 rounded-b-[1rem]" />

            {/* Volume buttons (left side) */}
            <div className="absolute -left-[17px] top-[124px]
                            h-[46px] w-[3px] bg-card-2 rounded-l-lg" />
            <div className="absolute -left-[17px] top-[178px]
                            h-[46px] w-[3px] bg-card-2 rounded-l-lg" />

            {/* Power button (right side) */}
            <div className="absolute -right-[17px] top-[142px]
                            h-[64px] w-[3px] bg-card-2 rounded-r-lg" />

            {/* Screen content area */}
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-bg
                            flex items-center justify-center">
              <span className="text-muted text-sm">App Preview</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
