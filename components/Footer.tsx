"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap-init"
import Image from "next/image"
import { siteConfig } from "@/lib/content"

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const gradientLineRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Animated gradient line: scaleX 0 -> 1
    if (gradientLineRef.current) {
      gsap.fromTo(
        gradientLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      )
    }

    // Brand column fades in first
    if (brandRef.current) {
      gsap.fromTo(
        brandRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      )
    }

    // Link columns stagger in
    const linkColumns = linksRef.current?.querySelectorAll(".footer-link-col")
    if (linkColumns && linkColumns.length > 0) {
      gsap.fromTo(
        linkColumns,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            once: true,
          },
        }
      )
    }
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} className="relative border-t border-white/[0.06]">
      {/* Animated gradient line */}
      <div
        ref={gradientLineRef}
        className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        style={{ transform: "scaleX(0)", transformOrigin: "left" }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand column */}
          <div ref={brandRef} className="flex flex-col gap-4 max-w-xs" style={{ opacity: 0 }}>
            <a href="#" className="flex items-center gap-2.5 group">
              <Image
                src="/LiftLabb-Logo.png"
                alt="LiftLabb"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="text-text font-bold text-sm tracking-tight">
                {siteConfig.name}
              </span>
            </a>
            <p className="text-muted/60 text-sm leading-relaxed">
              Built for lifters, by lifters.
            </p>
          </div>

          {/* Links columns */}
          <div ref={linksRef} className="flex gap-16 sm:gap-20">
            <div className="footer-link-col" style={{ opacity: 0 }}>
              <h4 className="text-xs text-muted/40 uppercase tracking-wider font-bold mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-text transition-colors duration-200 link-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={siteConfig.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:text-accent-bright transition-colors duration-200 link-underline"
                  >
                    Launch App
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-link-col" style={{ opacity: 0 }}>
              <h4 className="text-xs text-muted/40 uppercase tracking-wider font-bold mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-text transition-colors duration-200 link-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/[0.04]
                        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted/40 text-xs">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href={siteConfig.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted/40 hover:text-accent transition-colors duration-200"
          >
            app.liftlabb.ca
          </a>
        </div>
      </div>
    </footer>
  )
}
