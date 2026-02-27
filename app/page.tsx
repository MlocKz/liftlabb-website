import { siteConfig, features, faqItems, pricingPlans } from '@/lib/content'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero placeholder -- will be replaced in Phase 3 */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl sm:text-6xl font-bold text-text text-center max-w-3xl leading-tight">
          {siteConfig.tagline}
        </h1>
        <p className="text-muted text-lg mt-4 text-center max-w-xl">
          {siteConfig.description}
        </p>
        <div className="flex gap-4 mt-8">
          <a
            href={siteConfig.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-bg font-bold px-8 py-3 rounded-full hover:bg-accent/90 transition-colors"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="border border-border text-text font-bold px-8 py-3 rounded-full hover:bg-white/5 transition-colors"
          >
            See Features
          </a>
        </div>
      </section>

      {/* Features section stub */}
      <section id="features" className="min-h-screen px-4 py-24 max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text text-center mb-16">
          Everything you need to train smarter
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-card p-6">
              <h3 className="text-accent font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing section stub */}
      <section id="pricing" className="min-h-screen px-4 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted text-center mb-16">
          Start your 7-day free trial. No credit card required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricingPlans.map((p) => (
            <div
              key={p.name}
              className={`bg-card border rounded-card p-8 ${
                p.highlight
                  ? 'border-accent/50 shadow-lg shadow-accent/5'
                  : 'border-border'
              }`}
            >
              {p.badge && (
                <span className="text-accent text-xs font-bold uppercase tracking-wider">
                  {p.badge}
                </span>
              )}
              <h3 className="text-text font-bold text-xl mt-2">{p.name}</h3>
              <p className="text-text text-4xl font-bold mt-2">
                {p.price}
                <span className="text-muted text-base font-normal">{p.period}</span>
              </p>
              {p.savings && (
                <p className="text-accent text-sm mt-1">{p.savings}</p>
              )}
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-6 bg-accent text-bg font-bold py-3 rounded-full text-center hover:bg-accent/90 transition-colors"
              >
                Start Free Trial
              </a>
              <ul className="mt-6 space-y-3">
                {p.features.map((feat) => (
                  <li key={feat} className="text-muted text-sm flex items-center gap-2">
                    <span className="text-accent">&#10003;</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ section stub */}
      <section id="faq" className="min-h-screen px-4 py-24 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-text text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="bg-card border border-border rounded-card p-6">
              <h3 className="text-text font-bold">{item.question}</h3>
              <p className="text-muted text-sm mt-2 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom spacer for scroll testing */}
      <div className="h-32" />
    </main>
  )
}
