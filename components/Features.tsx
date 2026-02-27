"use client"
import { motion } from "motion/react"
import { features } from "@/lib/content"
import FeatureIcon from "@/components/FeatureIcon"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
}

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      bg-accent/[0.03] blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent">
              train smarter
            </span>
          </h2>
          <p className="mt-4 text-muted text-lg max-w-xl mx-auto">
            Purpose-built tools that replace your notebook, spreadsheet, and guesswork.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
