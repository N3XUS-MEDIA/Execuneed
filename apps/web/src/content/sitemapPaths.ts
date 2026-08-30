import { productCategories } from './products'
import { journalArticles } from './journal'

/**
 * Every public path that should appear in the sitemap once indexing is on.
 *
 * Derived rather than listed by hand. The hand-written list in
 * `app/sitemap.ts` had gone stale twice over — still five paths after six
 * category pages and ten journal articles had shipped — and it would go stale
 * again the next time someone wrote an article. It lives here rather than in
 * `app/` so it can be tested.
 *
 * Legal pages are never listed. They are `noindex` unconditionally until the
 * practice confirms their wording, and `/cover-review/thanks` is a
 * confirmation page with nothing to offer a crawler.
 */
const STATIC_PATHS = [
  '',
  '/how-we-work',
  '/services',
  '/cover-review',
  '/contact',
  '/journal',
] as const

export function sitemapPaths(): string[] {
  return [
    ...STATIC_PATHS,
    ...productCategories.map((c) => `/services/${c.slug}`),
    ...journalArticles.map((a) => `/journal/${a.slug}`),
  ]
}

export function sitemapPriority(path: string): number {
  if (path === '') return 1
  if (path === '/cover-review') return 0.9
  if (path.startsWith('/journal/')) return 0.6
  return 0.7
}
