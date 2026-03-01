import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Screenshots from "@/components/Screenshots"
import PricingSection from "@/components/PricingSection"
import FAQSection from "@/components/FAQSection"
import Footer from "@/components/Footer"
import LiquidEther from "@/components/LiquidEther"
import ParallaxBlobs from "@/components/ParallaxBlobs"

export default function Home() {
  return (
    <>
      <LiquidEther />
      <ParallaxBlobs />
      <main className="relative z-10 min-h-screen grain">
        <Hero />

        {/* Divider line */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <Features />

        <Screenshots />

        {/* Divider line */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <PricingSection />

        {/* Divider line */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <FAQSection />

        <Footer />
      </main>
    </>
  )
}
