"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"

export default function AnimatedIcon({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return
    const paths = ref.current.querySelectorAll("path, line, polyline, circle")

    paths.forEach((el) => {
      const pathEl = el as SVGGeometryElement
      if (pathEl.getTotalLength) {
        const length = pathEl.getTotalLength()
        gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(pathEl, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        })
      }
    })
  }, { scope: ref })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
