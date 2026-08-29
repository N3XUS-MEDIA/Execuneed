import type { MetadataRoute } from 'next'

/**
 * P1-L-063 — sitemap.
 *
 * Empty while ALLOW_INDEXING is false, so a stray crawl finds nothing to take.
 * Legal pages are never listed: they are noindex unconditionally until the
 * practice confirms their wording.
 */
const PUBLIC_PATHS = ['', '/how-we-work', '/services', '/cover-review', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const allowIndexing = process.env.ALLOW_INDEXING === 'true'
  const base = process.env.NEXT_PUBLIC_APP_URL

  if (!allowIndexing || !base) return []

  return PUBLIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : path === '/cover-review' ? 0.9 : 0.7,
  }))
}
