import { describe, expect, it } from 'vitest'
import { sitemapPaths, sitemapPriority } from './sitemapPaths'
import { productCategories } from './products'
import { journalArticles } from './journal'

/**
 * The point of these is that the sitemap cannot silently fall behind the site
 * again. It listed five paths for a fortnight while sixteen were live.
 */
describe('sitemapPaths', () => {
  it('lists every services category', () => {
    const paths = sitemapPaths()
    for (const c of productCategories) {
      expect(paths, `missing /services/${c.slug}`).toContain(`/services/${c.slug}`)
    }
  })

  it('lists every journal article', () => {
    const paths = sitemapPaths()
    for (const a of journalArticles) {
      expect(paths, `missing /journal/${a.slug}`).toContain(`/journal/${a.slug}`)
    }
  })

  it('lists the pages a visitor would land on', () => {
    const paths = sitemapPaths()
    for (const p of ['', '/how-we-work', '/services', '/cover-review', '/contact', '/journal']) {
      expect(paths).toContain(p)
    }
  })

  it('lists no legal page and no confirmation page', () => {
    // Legal pages are noindex unconditionally until their wording is approved.
    for (const path of sitemapPaths()) {
      expect(path.startsWith('/legal')).toBe(false)
      expect(path).not.toBe('/cover-review/thanks')
    }
  })

  it('lists nothing twice', () => {
    const paths = sitemapPaths()
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('ranks the home page and the form above the rest', () => {
    expect(sitemapPriority('')).toBe(1)
    expect(sitemapPriority('/cover-review')).toBe(0.9)
    expect(sitemapPriority('/journal/gap-cover-and-hospital-plans')).toBeLessThan(
      sitemapPriority('/services'),
    )
  })
})
