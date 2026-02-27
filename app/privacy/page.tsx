import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy - LiftLabb",
  description: "LiftLabb privacy policy. How we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent
                     transition-colors duration-200 mb-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted text-sm mb-12">
          Last updated: February 27, 2026
        </p>

        <div className="space-y-10 text-muted text-sm leading-relaxed [&_h2]:text-text [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-3 [&_strong]:text-text/90">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              When you use LiftLabb, we collect information you provide directly:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li>Account information (email address, display name)</li>
              <li>Workout data (exercises, sets, reps, weights, programs)</li>
              <li>Usage data (features accessed, session duration)</li>
              <li>Device information (browser type, operating system)</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li>Provide and maintain the LiftLabb service</li>
              <li>Sync your workout data across devices</li>
              <li>Generate progression charts and training insights</li>
              <li>Send important service updates (never marketing spam)</li>
              <li>Improve the app experience based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Storage & Security</h2>
            <p>
              Your data is stored securely on <strong>Google Cloud Platform</strong> via
              Firebase. We use industry-standard encryption for data in transit (TLS/SSL)
              and at rest. We do not store payment information directly — all payments
              are processed securely through Stripe.
            </p>
          </section>

          <section>
            <h2>4. Data Sharing</h2>
            <p>
              We <strong>never sell your personal information</strong>. We only share data with:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li><strong>Firebase / Google Cloud</strong> — infrastructure and database hosting</li>
              <li><strong>Stripe</strong> — payment processing (only payment-related data)</li>
            </ul>
            <p className="mt-3">
              We do not use advertising networks or share data with third-party marketing services.
            </p>
          </section>

          <section>
            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li>Access and export your workout data at any time</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Update or correct your account information</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>
              LiftLabb uses essential cookies for authentication and session management only.
              We do not use tracking cookies or third-party analytics cookies.
            </p>
          </section>

          <section>
            <h2>7. Children&apos;s Privacy</h2>
            <p>
              LiftLabb is not intended for children under 13. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              significant changes by posting a notice in the app or sending an email to your
              registered address.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              If you have questions about this privacy policy or your data, contact us at{" "}
              <a href="mailto:support@liftlabb.ca" className="text-accent hover:text-accent-bright transition-colors">
                support@liftlabb.ca
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
