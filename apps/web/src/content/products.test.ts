import { describe, expect, it } from 'vitest'
import { productCategories, findCategory } from './products'

/**
 * The compliance gate on Discovery product copy. docs/compliance/RULES.md
 * requires Marketing Support sign-off before any benefit claim is published,
 * and DEFINITION_OF_DONE.md lists unapproved benefit copy under "never done".
 */
describe('Discovery product content', () => {
  it('publishes no Discovery claim without an approval reference', () => {
    for (const c of productCategories) {
      if (c.approvalRef === null) {
        expect(c.claims, `${c.slug} has claims but no approvalRef`).toEqual([])
      }
    }
  })

  it('has no approval references yet, because none have been requested', () => {
    // Fails deliberately when someone adds one, so the register in
    // docs/compliance/DISCOVERY_APPROVALS.md gets updated at the same time.
    for (const c of productCategories) {
      expect(c.approvalRef).toBeNull()
    }
  })

  it('names no plan, premium or discount in the always-visible copy', () => {
    // The `need`/`covers`/`who` fields render unconditionally, so they must
    // not carry anything that would require approval.
    const forbidden =
      /\b(classic|essential|purple|comprehensive|priority|saver|coastal|smart|discount|cashback|premium of|R\d|\d+\s?% ?(off|back|discount))\b/i
    for (const c of productCategories) {
      const visible = [c.need, c.who, ...c.covers].join(' ')
      const hit = visible.match(forbidden)
      expect(hit?.[0], `${c.slug} visible copy contains "${hit?.[0]}"`).toBeUndefined()
    }
  })

  it('gives every category a unique slug and real content', () => {
    const slugs = productCategories.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const c of productCategories) {
      expect(c.title.length).toBeGreaterThan(0)
      expect(c.need.length).toBeGreaterThan(40)
      expect(c.covers.length).toBeGreaterThan(1)
    }
  })

  it('resolves categories by slug', () => {
    expect(findCategory('life-and-income')?.title).toContain('Life')
    expect(findCategory('nope')).toBeUndefined()
  })
})
