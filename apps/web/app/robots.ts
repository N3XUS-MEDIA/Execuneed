import type { MetadataRoute } from 'next'

/**
 * P1-L-063 — robots.
 *
 * Disallow everything until ALLOW_INDEXING is deliberately set. The legal
 * entity, FSP number and juristic representative wording are all unconfirmed
 * (docs/product/CLIENT_ANSWERS.md); a financial services site indexed with
 * placeholder disclosures is a regulatory problem.
 *
 * /admin and /login stay disallowed even once indexing is on.
 */
export default function robots(): MetadataRoute.Robots {
  const allowIndexing = process.env.ALLOW_INDEXING === 'true'
  const base = process.env.NEXT_PUBLIC_APP_URL

  if (!allowIndexing) {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/login', '/api/'] }],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  }
}
