// lib/content.ts

export const siteConfig = {
  name: "LiftLabb",
  tagline: "Track your gains. Ditch the spreadsheet.",
  description: "The workout tracker built for lifters who want to get stronger.",
  url: "https://liftlabb.ca",
  appUrl: "https://app.liftlabb.ca",
} as const

export interface Feature {
  title: string
  description: string
  icon: string
}

export const features: Feature[] = [
  {
    title: "Workout Logging",
    description: "Log sets, reps, weight, and RIR for every exercise",
    icon: "dumbbell",
  },
  {
    title: "Custom Programs",
    description: "Build and follow periodized training programs",
    icon: "clipboard-list",
  },
  {
    title: "Progression Charts",
    description: "Visualize your strength gains over time",
    icon: "trending-up",
  },
  {
    title: "Exercise Library",
    description: "350+ exercises with muscle group targeting",
    icon: "library",
  },
  {
    title: "Cross-device Sync",
    description: "Train on any device, your data follows you",
    icon: "refresh-cw",
  },
  {
    title: "Smart Auto-fill",
    description: "Auto-suggests weights based on your history",
    icon: "zap",
  },
]

export interface FAQItem {
  question: string
  answer: string
}

export const faqItems: FAQItem[] = [
  {
    question: "What platforms does LiftLabb work on?",
    answer: "LiftLabb works on any device with a web browser -- iPhone, Android, tablet, or desktop. No app download required.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! Every plan comes with a 7-day free trial. No credit card required to start.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Cancel your subscription anytime from your account settings. No questions asked.",
  },
  {
    question: "Is my data safe?",
    answer: "Your data is stored securely on Google Cloud (Firebase). We never sell or share your personal information.",
  },
  {
    question: "Can I add custom exercises?",
    answer: "Yes! Add any exercise you want with custom muscle group targeting and notes.",
  },
  {
    question: "Does it work offline?",
    answer: "LiftLabb requires an internet connection to sync your data across devices. We're working on offline support for a future update.",
  },
]

export interface PricingPlan {
  name: string
  price: string
  period: string
  badge: string | null
  highlight: boolean
  features: string[]
  savings?: string
  monthly?: string
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Monthly",
    price: "$2.99",
    period: "/mo",
    badge: null,
    highlight: false,
    features: [
      "Unlimited workout logging",
      "Custom programs",
      "Progression charts",
      "Exercise library",
      "Cross-device sync",
      "Smart auto-fill",
    ],
  },
  {
    name: "Annual",
    price: "$19.99",
    period: "/yr",
    badge: "Best Value",
    highlight: true,
    savings: "Save 44%",
    monthly: "$1.67/mo",
    features: [
      "Unlimited workout logging",
      "Custom programs",
      "Progression charts",
      "Exercise library",
      "Cross-device sync",
      "Smart auto-fill",
    ],
  },
]
