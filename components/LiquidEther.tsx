"use client"

import { useEffect, useRef, useCallback } from "react"

// ── Configuration ──────────────────────────────────────────────
const COLORS = [
  [74, 222, 128],   // #4ade80  — green accent
  [10, 10, 10],     // #0a0a0a — near-black
  [26, 26, 26],     // #1a1a1a — dark gray
] as const

const BLOB_COUNT = 8
const BASE_RADIUS = 0.18          // fraction of min(w,h)
const SPEED_RANGE = [0.3, 0.8]    // pixels/frame at 60 fps
const MOUSE_INFLUENCE = 0.12      // how strongly blobs react to cursor
const MOUSE_DECAY = 0.96          // how fast mouse influence fades
const WRAPPER_OPACITY = 0.35      // outer opacity for readability

// ── Types ──────────────────────────────────────────────────────
interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: readonly [number, number, number]
  phase: number        // animation phase offset
  phaseSpeed: number   // how fast phase increments
}

// ── Helpers ────────────────────────────────────────────────────
function rand(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo)
}

function createBlob(w: number, h: number): Blob {
  const minDim = Math.min(w, h)
  const r = minDim * BASE_RADIUS * rand(0.7, 1.3)
  const angle = Math.random() * Math.PI * 2
  const speed = rand(SPEED_RANGE[0], SPEED_RANGE[1])
  return {
    x: rand(r, w - r),
    y: rand(r, h - r),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: rand(0.005, 0.015),
  }
}

// ── Component ──────────────────────────────────────────────────
export default function LiquidEther() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const mouseVelRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(true)
  const sizeRef = useRef({ w: 0, h: 0 })

  // ── Resize handler ─────────────────────────────────────────
  const handleResize = useCallback((w: number, h: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    const ctx = canvas.getContext("2d")
    if (ctx) ctx.scale(dpr, dpr)

    sizeRef.current = { w, h }

    // Re-create blobs on resize to fit new dimensions
    blobsRef.current = Array.from({ length: BLOB_COUNT }, () =>
      createBlob(w, h)
    )
  }, [])

  // ── Animation loop ─────────────────────────────────────────
  const animate = useCallback(() => {
    if (!visibleRef.current) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { w, h } = sizeRef.current
    if (w === 0 || h === 0) return

    // Decay mouse velocity
    mouseVelRef.current.x *= MOUSE_DECAY
    mouseVelRef.current.y *= MOUSE_DECAY

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Update blobs
    const blobs = blobsRef.current
    for (const blob of blobs) {
      blob.phase += blob.phaseSpeed

      // Organic wobble via sine modulation
      const wobbleX = Math.sin(blob.phase) * 0.4
      const wobbleY = Math.cos(blob.phase * 1.3) * 0.4

      blob.x += blob.vx + wobbleX
      blob.y += blob.vy + wobbleY

      // Mouse attraction — subtle pull toward cursor
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - blob.x
        const dy = mouseRef.current.y - blob.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = Math.min(w, h) * 0.5
        if (dist < maxDist) {
          const strength = (1 - dist / maxDist) * MOUSE_INFLUENCE
          blob.vx += (dx / dist) * strength + mouseVelRef.current.x * 0.02
          blob.vy += (dy / dist) * strength + mouseVelRef.current.y * 0.02
        }
      }

      // Speed damping (prevents runaway acceleration from mouse)
      const currentSpeed = Math.sqrt(blob.vx * blob.vx + blob.vy * blob.vy)
      const maxSpeed = SPEED_RANGE[1] * 2.5
      if (currentSpeed > maxSpeed) {
        const scale = maxSpeed / currentSpeed
        blob.vx *= scale
        blob.vy *= scale
      }

      // Bounce off edges with some padding
      const pad = blob.r * 0.3
      if (blob.x < -pad) { blob.x = -pad; blob.vx = Math.abs(blob.vx) }
      if (blob.x > w + pad) { blob.x = w + pad; blob.vx = -Math.abs(blob.vx) }
      if (blob.y < -pad) { blob.y = -pad; blob.vy = Math.abs(blob.vy) }
      if (blob.y > h + pad) { blob.y = h + pad; blob.vy = -Math.abs(blob.vy) }
    }

    // ── Draw metaballs ───────────────────────────────────────
    // We draw each blob as a large radial gradient circle.
    // Overlapping gradients with globalCompositeOperation create
    // the organic "liquid" merging effect.
    ctx.globalCompositeOperation = "lighter"

    for (const blob of blobs) {
      // Pulsing radius
      const pulseFactor = 1 + Math.sin(blob.phase * 0.7) * 0.08
      const r = blob.r * pulseFactor

      const gradient = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, r
      )

      const [cr, cg, cb] = blob.color
      // Core is brighter, edges fade to transparent
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.6)`)
      gradient.addColorStop(0.3, `rgba(${cr}, ${cg}, ${cb}, 0.25)`)
      gradient.addColorStop(0.6, `rgba(${cr}, ${cg}, ${cb}, 0.08)`)
      gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`)

      ctx.beginPath()
      ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // ── Second pass: soften with a screen-blend haze ─────────
    ctx.globalCompositeOperation = "screen"
    for (const blob of blobs) {
      const pulseFactor = 1 + Math.sin(blob.phase * 0.5 + 1) * 0.1
      const r = blob.r * pulseFactor * 1.5

      const gradient = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, r
      )

      const [cr, cg, cb] = blob.color
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.08)`)
      gradient.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.03)`)
      gradient.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`)

      ctx.beginPath()
      ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    ctx.globalCompositeOperation = "source-over"

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  // ── Setup & cleanup ────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = canvas.parentElement
    if (!container) return

    // Initial sizing
    const rect = container.getBoundingClientRect()
    handleResize(rect.width, rect.height)

    // ── ResizeObserver ─────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        handleResize(width, height)
      }
    })
    resizeObserver.observe(container)

    // ── IntersectionObserver for visibility / tab pausing ──
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(canvas)

    // ── Also pause when tab is hidden ─────────────────────
    const handleVisibility = () => {
      visibleRef.current =
        document.visibilityState === "visible"
    }
    document.addEventListener("visibilitychange", handleVisibility)

    // ── Mouse tracking ────────────────────────────────────
    let lastMouse = { x: 0, y: 0, t: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      const dt = Math.max(now - lastMouse.t, 1)

      mouseVelRef.current.x = (e.clientX - lastMouse.x) / dt * 16
      mouseVelRef.current.y = (e.clientY - lastMouse.y) / dt * 16

      lastMouse = { x: e.clientX, y: e.clientY, t: now }
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    // Touch support
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      const now = performance.now()
      const dt = Math.max(now - lastMouse.t, 1)

      mouseVelRef.current.x = (touch.clientX - lastMouse.x) / dt * 16
      mouseVelRef.current.y = (touch.clientY - lastMouse.y) / dt * 16

      lastMouse = { x: touch.clientX, y: touch.clientY, t: now }
      mouseRef.current = { x: touch.clientX, y: touch.clientY, active: true }
    }

    const handleTouchEnd = () => {
      mouseRef.current.active = false
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    // ── Start animation ───────────────────────────────────
    rafRef.current = requestAnimationFrame(animate)

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [animate, handleResize])

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: WRAPPER_OPACITY }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  )
}
