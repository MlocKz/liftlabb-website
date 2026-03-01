"use client"

import { useEffect, useState } from "react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? window.scrollY / total : 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-accent to-accent-bright"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
        }}
      />
      <div
        className="absolute top-0 h-[6px] w-[30px] blur-sm bg-accent-bright"
        style={{
          left: `calc(${progress * 100}% - 15px)`,
          opacity: progress > 0.01 ? 0.8 : 0,
          transition: "opacity 0.2s",
        }}
      />
    </div>
  )
}
