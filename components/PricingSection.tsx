import { pricingPlans, siteConfig } from "@/lib/content"

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-28 px-6">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[400px] bg-accent/[0.03] blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted text-lg">
            Start your 7-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={plan.highlight ? "gradient-border-bright" : "gradient-border"}
            >
              <div className={`relative h-full rounded-[15px] p-8
                ${plan.highlight
                  ? "bg-card"
                  : "bg-card"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-accent text-bg text-xs font-bold
                                     px-4 py-1 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-6">
                  {plan.name}
                </h3>

                <div className="mb-1">
                  <span className="text-5xl font-bold text-text tracking-tight">{plan.price}</span>
                  <span className="text-muted text-base ml-1">{plan.period}</span>
                </div>

                {plan.savings ? (
                  <div className="mb-6">
                    <span className="text-accent text-sm font-bold">{plan.savings}</span>
                    {plan.monthly && (
                      <span className="text-muted text-sm ml-2">({plan.monthly})</span>
                    )}
                  </div>
                ) : (
                  <p className="text-muted/60 text-sm mb-6">Billed monthly</p>
                )}

                <a
                  href={siteConfig.appUrl}
                  className={`btn-shimmer block w-full text-center py-3.5 rounded-full
                              font-bold text-sm transition-all duration-300 ${
                    plan.highlight
                      ? "bg-accent text-bg shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.35)]"
                      : "bg-white/[0.06] text-text hover:bg-white/[0.1] border border-white/[0.06]"
                  }`}
                >
                  Start Free Trial
                </a>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <p className="text-xs text-muted/60 uppercase tracking-wider font-bold mb-4">
                    Everything included
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-muted">
                        <svg
                          className="w-4 h-4 text-accent flex-shrink-0"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
