"use client"
import { motion, stagger } from "motion/react"
import { features } from "@/lib/content"
import FeatureIcon from "@/components/FeatureIcon"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.1),
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Everything you need to train smarter
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="bg-card border border-border rounded-card p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:-translate-y-1 hover:border-accent/50"
            >
              <FeatureIcon name={feature.icon} />
              <h3 className="text-lg font-bold text-text mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
