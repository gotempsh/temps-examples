import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: 'YourSaaS — Build your SaaS in record time',
    template: '%s | YourSaaS',
  },
  description:
    'A production-ready Next.js boilerplate with authentication, payments, database, email, and everything you need to launch your SaaS.',
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'YourSaaS',
    title: 'YourSaaS — Build your SaaS in record time',
    description:
      'A production-ready Next.js boilerplate with authentication, payments, database, email, and everything you need to launch your SaaS.',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'YourSaaS — Build your SaaS in record time',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YourSaaS — Build your SaaS in record time',
    description:
      'A production-ready Next.js boilerplate with authentication, payments, database, email, and everything you need to launch your SaaS.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
