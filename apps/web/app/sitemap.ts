import type { MetadataRoute } from 'next'
import { sitemapPaths, sitemapPriority } from '@/content/sitemapPaths'

/**
 * P1-L-063 — sitemap.
 *
 * Empty while ALLOW_INDEXING is false, so a stray crawl finds nothing to take.
 * The paths themselves are derived in `@/content/sitemapPaths`, where they can
 * be tested; a hand-kept list here had already gone stale twice.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const allowIndexing = process.env.ALLOW_INDEXING === 'true'
  const base = process.env.NEXT_PUBLIC_APP_URL

  if (!allowIndexing || !base) return []

  return sitemapPaths().map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'monthly' as const,
    priority: sitemapPriority(path),
  }))
}
