import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

/**
 * Self-hosted by next/font, which matters here: the CSP in
 * src/server/securityHeaders.ts pins font-src and style-src to 'self', so a
 * Google Fonts CDN link would be blocked. next/font downloads the files at
 * build time and serves them from our own origin.
 */
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Execuneed Financial Services'
const allowIndexing = process.env.ALLOW_INDEXING === 'true'

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s — ${siteName}`,
  },
  description:
    'Turning financial complexity into clarity, confidence, and long-term security for families.',
  // Legal entity, FSP and NCR wording are unconfirmed (docs/product/CLIENT_ANSWERS.md).
  // Nothing is crawlable until ALLOW_INDEXING is deliberately set.
  robots: allowIndexing ? undefined : { index: false, follow: false },
  // These links get shared on WhatsApp and LinkedIn. Without this they render
  // as a bare URL. No image yet — the brand pack has not been received
  // (docs/product/CLIENT_ANSWERS.md), and a stock placeholder would be worse.
  openGraph: {
    type: 'website',
    siteName,
    locale: 'en_ZA',
    title: siteName,
    description:
      'A structured review of the cover you already have, explained in plain language, with a licensed adviser.',
    images: [{ url: '/brand/logo.png', width: 1960, height: 420, alt: 'Execuneed' }],
  },
  ...(process.env.NEXT_PUBLIC_APP_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL) }
    : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${montserrat.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
