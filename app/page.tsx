import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Screenshots from '@/components/Screenshots'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Screenshots />
      <PricingSection />
      <FAQSection />
    </main>
  )
}
