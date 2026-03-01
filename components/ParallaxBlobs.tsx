"use client"

import { useEffect, useState } from "react"

export default function ParallaxBlobs() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const blobs = [
    { top: "20%", left: "70%", size: 600, color: "bg-accent/[0.06]", blur: 150, speed: 0.3 },
    { top: "50%", left: "20%", size: 400, color: "bg-accent/[0.04]", blur: 120, speed: 0.15 },
    { top: "75%", left: "60%", size: 500, color: "bg-blue/[0.03]", blur: 130, speed: 0.25 },
  ]

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${blob.color}`}
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            filter: `blur(${blob.blur}px)`,
            transform: `translateY(${scrollY * blob.speed * (i % 2 === 0 ? -1 : 1)}px) scale(${1 + Math.sin(scrollY * 0.001 + i) * 0.05})`,
            transition: "transform 0.1s linear",
          }}
        />
      ))}
    </div>
  )
}
