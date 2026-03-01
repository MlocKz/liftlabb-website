"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"

export default function TiltCard({
  children,
  className = "",
  tiltStrength = 10,
  spotlight = false,
}: {
  children: React.ReactNode
  className?: string
  tiltStrength?: number
  spotlight?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    setTilt({
      rotateX: (0.5 - y) * tiltStrength,
      rotateY: (x - 0.5) * tiltStrength,
    })
    setSpotlightPos({ x: x * 100, y: y * 100 })
  }

  const handleLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 })
    setSpotlightPos({ x: 50, y: 50 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={tilt}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
      {spotlight && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(74,222,128,0.08) 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  )
}
