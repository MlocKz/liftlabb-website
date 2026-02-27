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
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4 max-w-xs">
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
          <div className="flex gap-16 sm:gap-20">
            <div>
              <h4 className="text-xs text-muted/40 uppercase tracking-wider font-bold mb-4">
                Navigate
              </h4>
              <ul className="space-y-2.5">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-text transition-colors duration-200"
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
                    className="text-sm text-accent hover:text-accent-bright transition-colors duration-200"
                  >
                    Launch App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-muted/40 uppercase tracking-wider font-bold mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted hover:text-text transition-colors duration-200"
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
