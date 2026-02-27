import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const circularStd = localFont({
  src: './fonts/CircularStd-Medium.ttf',
  weight: '500',
  style: 'normal',
  display: 'swap',
  variable: '--font-circular',
})

export const metadata: Metadata = {
  title: 'LiftLabb - Track your gains. Ditch the spreadsheet.',
  description: 'The workout tracker built for lifters who want to get stronger.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={circularStd.variable}>
      <body className="bg-bg text-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
