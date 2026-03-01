"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"

export default function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const handleLeave = () => setVisible(false)
    window.addEventListener("mousemove", handleMove, { passive: true })
    document.addEventListener("mouseleave", handleLeave)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      document.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9998]"
      animate={{
        x: mousePos.x - 150,
        y: mousePos.y - 150,
        opacity: visible ? 0.07 : 0,
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
      style={{
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,222,128,0.5) 0%, transparent 70%)",
      }}
    />
  )
}
