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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <body>{children}</body>
    </html>
  )
}
