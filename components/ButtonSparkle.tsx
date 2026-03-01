"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function ButtonSparkle({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  const handleHover = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
    }))
    setSparkles(newSparkles)
    setTimeout(() => setSparkles([]), 600)
  }, [])

  return (
    <div className={`relative inline-block ${className}`} onMouseEnter={handleHover}>
      {children}
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute w-1 h-1 bg-accent-bright rounded-full pointer-events-none"
            initial={{ opacity: 1, scale: 0, x: s.x, y: s.y }}
            animate={{
              opacity: 0,
              scale: 1.5,
              x: s.x + (Math.random() - 0.5) * 40,
              y: s.y - Math.random() * 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
