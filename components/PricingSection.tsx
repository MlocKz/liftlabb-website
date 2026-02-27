import { pricingPlans, siteConfig } from '@/lib/content'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-muted text-center mb-12">
          Start your 7-day free trial. No credit card required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-card p-8 border transition-shadow duration-300 ${
                plan.highlight
                  ? 'border-accent shadow-[0_0_30px_rgba(74,222,128,0.15)] hover:shadow-[0_0_40px_rgba(74,222,128,0.25)]'
                  : 'border-border hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-text mb-4">{plan.name}</h3>

              <div className="mb-2">
                <span className="text-4xl font-bold text-text">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </div>

              {plan.savings ? (
                <>
                  <p className="text-accent text-sm font-bold mb-1">{plan.savings}</p>
                  {plan.monthly && (
                    <p className="text-muted text-sm mb-6">{plan.monthly}</p>
                  )}
                </>
              ) : (
                <div className="mb-6" />
              )}

              <p className="text-muted text-sm mb-6">7-day free trial</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-text">
                    <svg
                      className="w-4 h-4 text-accent flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={siteConfig.appUrl}
                className={`block w-full text-center py-3 rounded-lg font-bold text-sm transition-colors duration-200 ${
                  plan.highlight
                    ? 'bg-accent text-bg hover:bg-accent/90'
                    : 'bg-card-2 text-text hover:bg-border'
                }`}
              >
                Start Free Trial
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
