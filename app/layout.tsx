import type { Metadata } from 'next'
import localFont from 'next/font/local'
import CursorGlow from '@/components/CursorGlow'
import ScrollProgress from '@/components/ScrollProgress'
import Navbar from '@/components/Navbar'
import StructuredData from '@/components/StructuredData'
import './globals.css'

const circularStd = localFont({
  src: './fonts/CircularStd-Medium.ttf',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-circular',
})

export const metadata: Metadata = {
  title: {
    default: 'LiftLabb - Track your gains. Ditch the spreadsheet.',
    template: '%s | LiftLabb',
  },
  description: 'The workout tracker built for lifters who want to get stronger. Log workouts, build programs, track progression, and access 350+ exercises.',
  keywords: ['workout tracker', 'gym log', 'strength training', 'workout app', 'fitness tracker', 'weight lifting app', 'exercise tracker', 'gym tracker', 'progressive overload', 'workout planner'],
  authors: [{ name: 'LiftLabb' }],
  creator: 'LiftLabb',
  metadataBase: new URL('https://liftlabb.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://liftlabb.ca',
    siteName: 'LiftLabb',
    title: 'LiftLabb - Track your gains. Ditch the spreadsheet.',
    description: 'The workout tracker built for lifters who want to get stronger. Log workouts, build programs, and track your progression.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiftLabb - Track your gains. Ditch the spreadsheet.',
    description: 'The workout tracker built for lifters who want to get stronger.',
  },
  icons: {
    icon: '/LiftLabb-Logo.png',
    apple: '/icons/icon-180.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={circularStd.variable}>
      <body className="bg-bg text-text font-sans antialiased min-h-screen">
        <CursorGlow />
        <ScrollProgress />
        <Navbar />
        {children}
        <StructuredData />
      </body>
    </html>
  )
}
