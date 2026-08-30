import type { JournalArticle } from './types'

/**
 * The plan (docs/product/EXECUNEED_AI_PLATFORM_PLAN.md §6.1) lists "Discovery
 * integration discounts explained" as a cornerstone topic. It is also the one
 * topic on the list that cannot be written without stating Discovery benefits,
 * and docs/compliance/RULES.md is unambiguous: that copy needs Marketing
 * Support sign-off, and the reference has to be stored before it renders.
 *
 * So the article exists, and its body does not. `sections` carries only what is
 * true regardless of any approval — an explanation of why the page is empty.
 * Everything that would answer the reader's question sits in `claims`, behind
 * `NeedsApproval`, and will render the day an approval reference is recorded in
 * docs/compliance/DISCOVERY_APPROVALS.md.
 *
 * Deliberately not a stub to be filled in later by whoever gets there first.
 * The gate is the point.
 */
export const gatedArticles: JournalArticle[] = [
  {
    slug: 'how-discovery-integration-works',
    title: 'How Discovery integration works',
    standfirst:
      'The detail on this page is with Discovery for approval. Until it comes back, an adviser will take you through it directly.',
    question: 'How do Discovery integration discounts work?',
    category: 'Medical aid',
    updated: '2026-08-30',
    readingMinutes: 2,
    sections: [
      {
        heading: 'Why this page is short',
        paragraphs: [
          'This is one of the questions we are asked most often, and it is the one we are least able to answer in writing without permission.',
          'Anything that describes a specific product benefit, a discount, a plan name or a premium is marketing material for that product. In South Africa an adviser cannot publish it without the product supplier signing it off first, and the approval reference has to be on record. That rule exists because an adviser paraphrasing a benefit is how people end up believing they are covered for something they are not.',
          'We have not put wording through that process yet, so nothing is published here. When it has been approved the detail will appear on this page, and this paragraph will not.',
        ],
      },
      {
        heading: 'What you can do in the meantime',
        paragraphs: [
          'An adviser can talk you through how the products you hold, or are considering, interact — with your actual policies in front of them. That conversation is advice, it is given by a licensed representative, and it is not subject to the same restriction as a published page, because it is specific to you.',
          'If you already hold products across the range, that conversation is usually more useful than a general article would have been in any case.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Why will the website not explain the benefits?',
        a: 'Because product benefit copy has to be approved by the product supplier before an adviser publishes it, and that approval is not yet in place. A licensed representative can discuss it with you directly.',
      },
      {
        q: 'Can an adviser explain it to me?',
        a: 'Yes. A conversation with a licensed representative about your own policies is advice given to you, and it is the appropriate place for this question.',
      },
    ],
    // Populate alongside a Marketing Support reference, never before it.
    // See docs/compliance/DISCOVERY_APPROVALS.md step 1.
    claims: [],
    approvalRef: null,
    related: ['gap-cover-and-hospital-plans', 'changing-medical-aid-in-october'],
  },
]
