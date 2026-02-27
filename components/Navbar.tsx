"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { siteConfig, navLinks } from "@/lib/content"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-md border-b border-border/50 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <Image
              src="/LiftLabb-Logo.png"
              alt="LiftLabb"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
            <span className="text-accent font-bold text-lg tracking-tight">
              {siteConfig.name}
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-text px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* Launch App CTA */}
            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 bg-accent text-bg text-sm font-bold px-5 py-2 rounded-full hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] transition-all duration-200"
            >
              Launch App
            </a>
          </div>

          {/* Hamburger button (mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-0.5 w-5 bg-text transition-all duration-300 absolute ${
                mobileOpen ? "translate-y-0 rotate-45" : "translate-y-[-6px]"
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text transition-all duration-300 absolute ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-text transition-all duration-300 absolute ${
                mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-[6px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-lg border-b border-border/50"
          >
            <div className="px-4 py-3 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted hover:text-text text-base py-3 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-border/30 last:border-b-0"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 bg-accent text-bg font-bold py-3 rounded-full text-center hover:bg-accent/90 transition-colors"
              >
                Launch App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
