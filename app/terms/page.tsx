import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service - LiftLabb",
  description: "LiftLabb terms of service. Rules and conditions for using the platform.",
}

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-muted text-sm mb-12">
          Last updated: February 27, 2026
        </p>

        <div className="space-y-10 text-muted text-sm leading-relaxed [&_h2]:text-text [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-3 [&_strong]:text-text/90">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using LiftLabb (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              LiftLabb is a web-based workout tracking application that allows users to log
              workouts, build training programs, track progression, and access an exercise
              library. The Service is available at{" "}
              <a href="https://app.liftlabb.ca" className="text-accent hover:text-accent-bright transition-colors">
                app.liftlabb.ca
              </a>.
            </p>
          </section>

          <section>
            <h2>3. Account Registration</h2>
            <p>
              To use LiftLabb, you must create an account with a valid email address. You are
              responsible for maintaining the confidentiality of your account credentials and
              for all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2>4. Access & Future Pricing</h2>
            <p>
              LiftLabb is currently <strong>free during early access</strong>. All features are
              included at no cost. No credit card is required. We may introduce paid subscription
              plans in the future, with advance notice to all users.
            </p>
          </section>

          <section>
            <h2>5. Refunds</h2>
            <p>
              LiftLabb is currently free. If paid plans are introduced in the future, refund
              policies will be outlined at that time.
            </p>
          </section>

          <section>
            <h2>6. User Content & Data</h2>
            <p>
              You retain ownership of all workout data and content you create in LiftLabb. By
              using the Service, you grant us a limited license to store, process, and display
              your data solely for the purpose of providing the Service to you.
            </p>
          </section>

          <section>
            <h2>7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-3 space-y-1.5">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reverse-engineer or attempt to extract the source code of the Service</li>
              <li>Share your account credentials with others or create multiple free trial accounts</li>
            </ul>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              LiftLabb is provided &quot;as is&quot; without warranties of any kind. We are not liable
              for any indirect, incidental, or consequential damages arising from your use
              of the Service. Our total liability shall not exceed the amount you paid for the
              Service in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2>9. Service Availability</h2>
            <p>
              We strive to keep LiftLabb available 24/7, but we do not guarantee uninterrupted
              access. We may temporarily suspend the Service for maintenance, updates, or
              circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these
              terms. You may delete your account at any time. Upon termination, your data will
              be deleted in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2>11. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Material changes will be communicated
              via email or in-app notification at least 30 days before taking effect. Continued
              use of the Service after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
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
