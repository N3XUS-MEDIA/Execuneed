/**
 * P2-S-043 — the journal.
 *
 * Eight cornerstone articles, structured the same way as the product pages and
 * under the same compliance gate (docs/compliance/RULES.md,
 * docs/compliance/DISCOVERY_APPROVALS.md):
 *
 *   `sections`, `faqs` — general education. They explain how a thing works in
 *                        South Africa. They name no product, quote no premium,
 *                        claim no benefit and recommend nothing.
 *
 *   `claims`           — anything that states a Discovery benefit, discount,
 *                        plan name or premium. Rendered only through
 *                        `NeedsApproval`, and only once `approvalRef` holds a
 *                        real Marketing Support reference. Empty until then.
 *
 * The line these articles must not cross is the FAIS one. They can say what
 * gap cover is. They cannot say whether you need it. Every page ends with the
 * route to a licensed representative, because that is where advice happens.
 */

export type JournalCategory =
  | 'Medical aid'
  | 'Protection'
  | 'Retirement'
  | 'Short-term'
  | 'Business'
  | 'Life events'

export type JournalSection = {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export type JournalArticle = {
  slug: string
  title: string
  /** One sentence. Meta description, and the card on the index. */
  standfirst: string
  /** The question a reader actually types, in their words. */
  question: string
  category: JournalCategory
  /** ISO date. Shown, because a reader deserves to know how old this is. */
  updated: string
  readingMinutes: number
  sections: JournalSection[]
  faqs: { q: string; a: string }[]
  /** Discovery benefit copy. Gated. Empty until an approval exists. */
  claims: string[]
  approvalRef: string | null
  /**
   * Set where the article states a figure that comes from legislation, SARS or
   * scheme rules and will go stale. Rendered with the article so the reader
   * knows what to re-check, and so the practice knows what to review each year.
   */
  figuresNote?: string
  /** Slugs of articles worth reading next. */
  related: string[]
}
