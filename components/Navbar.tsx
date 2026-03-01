"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { siteConfig, navLinks } from "@/lib/content"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 50)

      if (currentScrollY < 100) {
        setNavVisible(true)
      } else if (currentScrollY > lastScrollY.current + 10) {
        setNavVisible(false)
      } else if (currentScrollY < lastScrollY.current - 10) {
        setNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/70 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      } ${navVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <Image
              src="/LiftLabb-Logo.png"
              alt="LiftLabb"
              width={28}
              height={28}
              className="rounded-lg transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(74,222,128,0.3)]"
              priority
            />
            <span className="text-text font-bold text-base tracking-tight
                             transition-colors duration-300 group-hover:text-accent">
              {siteConfig.name}
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] text-muted hover:text-text
                           px-4 py-2 rounded-lg transition-all duration-200
                           hover:bg-white/[0.04] link-underline"
              >
                {link.label}
              </a>
            ))}

            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 bg-accent text-bg text-[13px] font-bold
                         px-5 py-2 rounded-full
                         hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
                         active:scale-[0.97]
                         transition-all duration-300"
            >
              Launch App
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center
                       rounded-lg hover:bg-white/[0.04] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className={`block h-[1.5px] w-5 bg-text transition-all duration-300 absolute ${
              mobileOpen ? "translate-y-0 rotate-45" : "translate-y-[-5px]"
            }`} />
            <span className={`block h-[1.5px] w-5 bg-text transition-all duration-300 absolute ${
              mobileOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"
            }`} />
            <span className={`block h-[1.5px] w-5 bg-text transition-all duration-300 absolute ${
              mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px]"
            }`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden overflow-hidden bg-bg/95 backdrop-blur-xl
                       border-b border-white/[0.06]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="text-muted hover:text-text text-base py-3 px-3
                             rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                className="mt-2 bg-accent text-bg font-bold py-3 rounded-full
                           text-center transition-colors hover:bg-accent/90"
              >
                Launch App
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
