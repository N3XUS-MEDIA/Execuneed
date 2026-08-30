import { describe, expect, it } from 'vitest'
import { findArticle, journalArticles, relatedTo } from './index'

/**
 * P2-S-043 — the same compliance gate the product pages carry.
 *
 * docs/compliance/RULES.md requires Marketing Support sign-off before any
 * Discovery benefit claim is published. An article reads more like guidance
 * than a services page does, so it needs the gate more, not less.
 */
describe('journal content', () => {
  it('ships the eight cornerstone articles', () => {
    expect(journalArticles).toHaveLength(8)
  })

  it('publishes no Discovery claim without an approval reference', () => {
    for (const a of journalArticles) {
      if (a.approvalRef === null) {
        expect(a.claims, `${a.slug} has claims but no approvalRef`).toEqual([])
      }
    }
  })

  it('has no approval references yet, because none have been requested', () => {
    // Fails deliberately when someone adds one, so the register in
    // docs/compliance/DISCOVERY_APPROVALS.md gets updated at the same time.
    for (const a of journalArticles) {
      expect(a.approvalRef).toBeNull()
    }
  })

  it('names no plan, premium or discount in the always-visible copy', () => {
    // Everything except `claims` renders unconditionally.
    const forbidden =
      /\b(classic|essential|purple|comprehensive|priority|saver|coastal|smart|cashback|premium of|R\d|\d+\s?% ?(off|back|discount))\b/i
    for (const a of journalArticles) {
      const visible = [
        a.title,
        a.standfirst,
        a.question,
        ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.list ?? [])]),
        ...a.faqs.flatMap((f) => [f.q, f.a]),
      ].join(' ')
      const hit = visible.match(forbidden)
      expect(hit?.[0], `${a.slug} visible copy contains "${hit?.[0]}"`).toBeUndefined()
    }
  })

  it('never tells a reader what they should buy', () => {
    // The FAIS line. These pages explain how a thing works; they do not
    // recommend one. Phrasing that reads as a recommendation is the failure
    // condition in docs/plan/DEFINITION_OF_DONE.md.
    const advice =
      /\b(you should (buy|take|get|choose|switch|move)|we recommend|the best (option|plan|policy|choice) (is|for you)|you need to buy)\b/i
    for (const a of journalArticles) {
      const visible = [
        ...a.sections.flatMap((s) => [...s.paragraphs, ...(s.list ?? [])]),
        ...a.faqs.map((f) => f.a),
      ].join(' ')
      const hit = visible.match(advice)
      expect(hit?.[0], `${a.slug} reads as advice: "${hit?.[0]}"`).toBeUndefined()
    }
  })

  it('gives every article a unique slug and real content', () => {
    const slugs = journalArticles.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)

    for (const a of journalArticles) {
      expect(a.standfirst.length, a.slug).toBeGreaterThan(40)
      expect(a.question.endsWith('?'), `${a.slug} question is not a question`).toBe(true)
      expect(a.faqs.length, a.slug).toBeGreaterThan(1)
      expect(a.sections.length, a.slug).toBeGreaterThan(0)
      // ISO date, so `new Date()` and the <time> attribute agree.
      expect(a.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('only links related articles that exist', () => {
    for (const a of journalArticles) {
      for (const slug of a.related) {
        expect(findArticle(slug), `${a.slug} links missing article ${slug}`).toBeDefined()
      }
      expect(relatedTo(a).some((r) => r.slug === a.slug)).toBe(false)
    }
  })

  it('resolves articles by slug', () => {
    expect(findArticle('gap-cover-and-hospital-plans')?.category).toBe('Medical aid')
    expect(findArticle('nope')).toBeUndefined()
  })
})
