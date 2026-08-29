import type { Metadata } from 'next'
import './globals.css'

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
  },
  ...(process.env.NEXT_PUBLIC_APP_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL) }
    : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body>{children}</body>
    </html>
  )
}
