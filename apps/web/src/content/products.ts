/**
 * The Discovery range Execuneed advises on.
 *
 * Two layers, deliberately separated, because they carry different compliance
 * weight (docs/compliance/RULES.md §Discovery marketing):
 *
 *   `need`     — what the category is for, in plain language. Describes the
 *                client's problem, not a product's features. No benefit claim,
 *                no premium, no plan name. Safe to publish today.
 *
 *   `claims`   — anything that states a Discovery benefit, discount, plan name
 *                or premium. Rendered only through `NeedsApproval`, and only
 *                once `approvalRef` holds a real Discovery Marketing Support
 *                reference. Empty until then.
 *
 * Nothing here is copied from discovery.co.za. Reusing their copy is their
 * copyright and is exactly what the adviser marketing rules exist to prevent.
 * The taxonomy comes from the practice's own brief
 * (docs/product/EXECUNEED_AI_PLATFORM_PLAN.md §1).
 */

export type ProductCategory = {
  slug: string
  title: string
  /** Safe to publish. The need, not the product. */
  need: string
  /** What a review of this area actually covers. Process, not product. */
  covers: string[]
  /** Who this tends to matter for. */
  who: string
  /**
   * Discovery-specific benefit copy. Gated behind NeedsApproval.
   * Populate only alongside a Marketing Support reference.
   */
  claims: string[]
  /** Discovery Marketing Support reference. null = nothing renders. */
  approvalRef: string | null
}

export const productCategories: ProductCategory[] = [
  {
    slug: 'medical-aid-and-gap',
    title: 'Medical aid and gap cover',
    need: 'Choosing a medical scheme option is the decision most households get least help with, and the one they feel hardest at a hospital admission. Gap cover sits alongside it to deal with the shortfall between what a specialist charges and what the scheme pays.',
    covers: [
      'What your current option actually covers, in plain language',
      'Where a shortfall would fall to you',
      'Whether gap cover is worth it for your household',
      'Timing — changes are usually only possible at scheme year end',
    ],
    who: 'Families reviewing at year end, anyone who has recently had a large hospital account, and households where the plan was chosen years ago and never revisited.',
    claims: [],
    approvalRef: null,
  },
  {
    slug: 'life-and-income',
    title: 'Life, income and severe illness cover',
    need: 'If your income stopped tomorrow — through death, disability or a serious diagnosis — this is the cover that decides whether the household keeps its home and its plans. Most people have some. Fewer have the right amount, and fewer still have looked at it since it was taken out.',
    covers: [
      'What the household actually needs each month if an income stops',
      'Debt that would have to be settled, and by whom',
      'Cover you already hold, including through an employer',
      'Whether the structure still matches your dependants',
    ],
    who: 'Anyone with dependants, a bond, or a business that would struggle without them.',
    claims: [],
    approvalRef: null,
  },
  {
    slug: 'retirement-and-investments',
    title: 'Retirement and investments',
    need: 'Retirement funding is a long arithmetic problem that is easy to postpone. A review looks at what you are contributing, what it is likely to produce, and the gap between that and the income you want.',
    covers: [
      'Existing retirement annuities, pension and provident funds',
      'What your current contributions are on track to produce',
      'Tax treatment of contributions and of drawing an income later',
      'Where money is invested and whether that still suits your horizon',
    ],
    who: 'Anyone more than five years from retiring who has never had the numbers laid out, and anyone approaching retirement who needs an income plan.',
    claims: [],
    approvalRef: null,
  },
  {
    slug: 'car-and-home',
    title: 'Car and home insurance',
    need: 'Short-term cover is usually bought once and then renewed without thought, which is how people end up underinsured on the asset they would least like to replace.',
    covers: [
      'Whether sums insured still reflect what replacement would cost',
      'Excess structures and what you would actually pay at claim',
      'Cover that overlaps or duplicates something you already hold',
      'How this sits alongside the rest of the household file',
    ],
    who: 'Homeowners, anyone who has renovated or bought a vehicle recently, and households renewing on autopilot.',
    claims: [],
    approvalRef: null,
  },
  {
    slug: 'banking-and-vitality',
    title: 'Banking and Vitality',
    need: 'Banking and the Vitality programme sit alongside the rest of the household file. We can talk you through how they work as part of a wider review.',
    covers: [
      'How these fit with cover you already hold',
      'What is involved in taking them up',
      'What we would need from you to help',
    ],
    who: 'Existing clients reviewing their whole position, and households already using part of the range.',
    claims: [],
    approvalRef: null,
  },
  {
    slug: 'employers',
    title: 'Employers and group benefits',
    need: 'For a business, staff cover is both a retention tool and a risk question. Group arrangements are structured differently from individual cover and are worth reviewing on their own terms.',
    covers: [
      'Group risk and employee benefit arrangements',
      'What your staff are currently covered for',
      'Key person and business continuity exposure',
      'How individual cover interacts with what the business provides',
    ],
    who: 'Cape Town business owners, and practices or firms carrying key-person risk.',
    claims: [],
    approvalRef: null,
  },
]

export function findCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((c) => c.slug === slug)
}

/** Copy shared across the product pages. */
export const productsCopy = {
  intro:
    'Execuneed advises across the Discovery range. A review starts with what you already have — including cover held elsewhere — and what your household actually needs, not with a product.',
  adviceNote:
    'Nothing on these pages is advice or a recommendation. Plan names, benefits and premiums are discussed with a licensed representative who has looked at your circumstances.',
  approvalPending:
    'Product detail for this area is being confirmed with Discovery before we publish it. An adviser can talk you through it now.',
} as const
