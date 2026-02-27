import TestAnimation from '@/components/TestAnimation'
import { features, faqItems, pricingPlans } from '@/lib/content'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-8 p-8 pt-16">
      <h1 className="text-4xl font-bold text-accent">LiftLabb</h1>
      <p className="text-muted">Design system is working -- Circular Std font should render here</p>

      {/* Color swatches */}
      <div className="bg-card border border-border rounded-card p-6">
        <p className="text-text">Card with design tokens: bg-card, border-border, rounded-card</p>
      </div>
      <div className="flex gap-4">
        <span className="text-accent">accent</span>
        <span className="text-yellow">yellow</span>
        <span className="text-red">red</span>
        <span className="text-blue">blue</span>
        <span className="text-muted">muted</span>
      </div>

      {/* Content data verification */}
      <section className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-bold text-text mb-4">Features (from lib/content.ts)</h2>
        <div className="grid gap-3">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-card p-4">
              <h3 className="text-accent font-bold">{f.title}</h3>
              <p className="text-muted text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-text mb-4">Pricing (from lib/content.ts)</h2>
        <div className="flex gap-4">
          {pricingPlans.map((p) => (
            <div key={p.name} className="bg-card border border-border rounded-card p-4 flex-1">
              <h3 className="text-accent font-bold">{p.name}</h3>
              <p className="text-text text-2xl">{p.price}<span className="text-muted text-sm">{p.period}</span></p>
              {p.badge && <span className="text-yellow text-xs">{p.badge}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-text mb-4">FAQ (from lib/content.ts)</h2>
        <div className="grid gap-2">
          {faqItems.map((item) => (
            <div key={item.question} className="bg-card border border-border rounded-card p-4">
              <h3 className="text-text font-bold text-sm">{item.question}</h3>
              <p className="text-muted text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacer to create scroll distance for animation test */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted">Scroll down to test Motion whileInView animation</p>
      </div>

      <TestAnimation />

      {/* Extra space after animation */}
      <div className="h-64" />
    </main>
  )
}
