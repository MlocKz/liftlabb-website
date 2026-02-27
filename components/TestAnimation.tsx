"use client"
import { motion } from "motion/react"

export default function TestAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 bg-card rounded-card border border-border max-w-md"
    >
      <h2 className="text-xl font-bold text-accent mb-2">Motion Works!</h2>
      <p className="text-muted text-sm">
        This element animated into view using Motion whileInView.
      </p>
    </motion.div>
  )
}
