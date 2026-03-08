/**
 * JSON-LD structured data for SEO.
 * All content is hardcoded string literals (no user input),
 * so dangerouslySetInnerHTML is safe here.
 */

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LiftLabb',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  url: 'https://app.liftlabb.ca',
  description: 'The workout tracker built for lifters who want to get stronger. Log workouts, build programs, track progression, and access 350+ exercises.',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      name: 'Early Access',
      description: 'Free during early access. All features included.',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What platforms does LiftLabb work on?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LiftLabb works on any device with a web browser -- iPhone, Android, tablet, or desktop. No app download required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is LiftLabb really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! LiftLabb is completely free during early access. No credit card required, no hidden fees. Every feature is included.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will it always be free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LiftLabb is free during early access. We will give plenty of notice before introducing any paid plans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your data is stored securely on Google Cloud (Firebase). We never sell or share your personal information.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add custom exercises?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Add any exercise you want with custom muscle group targeting and notes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LiftLabb requires an internet connection to sync your data across devices. We are working on offline support for a future update.',
      },
    },
  ],
}

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
