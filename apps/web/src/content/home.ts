import { copy } from './copy'
import { productCategories } from './products'

/**
 * Structure for the home page.
 *
 * Every sentence still comes from `copy` (docs/ui/COPY_DECK.md) or from
 * `products.ts`. This file adds ordering, numbering and links only, so a
 * compliance review still has one file of prose to read rather than a page
 * with copy inlined into markup.
 */

/** The four-step process. The deck holds the sentences; the numbering is ours. */
export const processSteps = copy.how.steps.map((body, i) => ({
  n: String(i + 1).padStart(2, '0'),
  body,
}))

/** Services snapshot — the six categories, linking to their own pages. */
export const serviceSnapshot = productCategories.map((c) => ({
  slug: c.slug,
  title: c.title,
  href: `/services/${c.slug}`,
}))

/** The quick-facts rail beside the hero. All deck copy. */
export const heroFacts = [
  { label: 'Call the practice', value: copy.contact.phone },
  { label: 'Office hours', value: copy.contact.hours },
  { label: 'Where we work', value: copy.contact.areas },
] as const
