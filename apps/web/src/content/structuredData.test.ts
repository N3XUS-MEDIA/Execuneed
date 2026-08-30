import { describe, expect, it } from 'vitest'
import type { OrganisationSettings } from '@prisma/client'
import { articleLd, breadcrumbLd, faqLd, organisationLd } from './structuredData'
import { journalArticles } from './journal'

/**
 * The rule that matters here is that structured data may not assert anything
 * the practice has not confirmed. A placeholder legal name emitted as
 * `legalName` is a machine-readable false statement about a licensed
 * financial services provider, and it would be read by exactly the systems
 * §6.1 wants reading these pages.
 */

const org = {
  tradingName: 'Execuneed Financial Services',
  legalName: 'NEEDS_LEGAL — confirm registered entity name',
  discoveryJuristicText: '',
  disclaimer: 'NEEDS_LEGAL — not yet confirmed.',
  phoneDisplay: '021 552 8989',
  whatsappE164: '',
  email: 'john@execuneed.co.za',
  addressLine1: 'Bridgeway',
  addressLine2: 'Century City',
  city: 'Cape Town',
  postalCode: '7441',
  fspNumber: null,
  ncrNumber: null,
} as unknown as OrganisationSettings

describe('organisationLd', () => {
  it('never emits the unconfirmed legal identity', () => {
    const json = JSON.stringify(organisationLd(org, 'https://example.test'))
    expect(json).not.toContain('NEEDS_LEGAL')
    expect(json).not.toContain('legalName')
    expect(json).not.toContain('fspNumber')
    expect(json).not.toContain('ncrNumber')
  })

  it('never emits a placeholder disclaimer', () => {
    const json = JSON.stringify(organisationLd(org, 'https://example.test'))
    expect(json).not.toContain('juristic representative')
  })

  it('carries the confirmed facts', () => {
    const ld = organisationLd(org, 'https://example.test')
    expect(ld['@type']).toBe('FinancialService')
    expect(ld.name).toBe('Execuneed Financial Services')
    expect(ld.telephone).toBe('021 552 8989')
    expect(ld.areaServed).toContain('Century City')
  })

  it('omits fields rather than defaulting them when they are empty', () => {
    const bare = { ...org, email: '', addressLine1: '', addressLine2: '', city: '', postalCode: '' }
    const ld = organisationLd(bare as OrganisationSettings, undefined)
    expect(ld).not.toHaveProperty('email')
    expect(ld).not.toHaveProperty('url')
    expect(ld).not.toHaveProperty('logo')
    expect(ld).not.toHaveProperty('address')
  })

  it('survives a missing organisation row', () => {
    const ld = organisationLd(null, 'https://example.test')
    expect(ld.name).toBe('Execuneed')
    expect(ld).not.toHaveProperty('address')
  })
})

describe('articleLd', () => {
  const article = journalArticles[0]!

  it('describes the article without inventing a publication date', () => {
    const ld = articleLd(article, { baseUrl: 'https://example.test', publisher: 'Execuneed' })
    expect(ld['@type']).toBe('Article')
    expect(ld.headline).toBe(article.title)
    expect(ld.dateModified).toBe(article.updated)
    // The content files record a review date, not a first-published date.
    expect(ld).not.toHaveProperty('datePublished')
  })

  it('drops the url when there is no base', () => {
    const ld = articleLd(article, { baseUrl: undefined, publisher: 'Execuneed' })
    expect(ld).not.toHaveProperty('url')
    expect(ld).not.toHaveProperty('mainEntityOfPage')
  })
})

describe('faqLd', () => {
  it('mirrors the questions already on the page, and nothing else', () => {
    for (const article of journalArticles) {
      const ld = faqLd(article)
      if (article.faqs.length === 0) {
        expect(ld).toBeNull()
        continue
      }
      const entities = (ld as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> })
        .mainEntity
      expect(entities).toHaveLength(article.faqs.length)
      entities.forEach((entity, i) => {
        expect(entity.name).toBe(article.faqs[i]!.q)
        expect(entity.acceptedAnswer.text).toBe(article.faqs[i]!.a)
      })
    }
  })

  it('carries no product claim, on any article', () => {
    // Same gate the pages themselves are held to. Structured data is published
    // content; an assistant reading it will not check the approval register.
    const forbidden =
      /\b(classic|essential|purple|comprehensive|priority|saver|coastal|smart|cashback|premium of|R\d|\d+\s?% ?(off|back|discount))\b/i
    for (const article of journalArticles) {
      const json = JSON.stringify(faqLd(article) ?? {})
      const hit = json.match(forbidden)
      expect(hit?.[0], `${article.slug} FAQ data contains "${hit?.[0]}"`).toBeUndefined()
    }
  })
})

describe('breadcrumbLd', () => {
  it('numbers the trail from one', () => {
    const ld = breadcrumbLd(
      [
        { name: 'Journal', path: '/journal' },
        { name: 'A piece', path: '/journal/a-piece' },
      ],
      'https://example.test',
    )
    const items = (ld as { itemListElement: Array<{ position: number; item?: string }> }).itemListElement
    expect(items[0]!.position).toBe(1)
    expect(items[1]!.item).toBe('https://example.test/journal/a-piece')
  })

  it('omits the item url when there is no base', () => {
    const ld = breadcrumbLd([{ name: 'Journal', path: '/journal' }], undefined)
    const items = (ld as { itemListElement: Array<Record<string, unknown>> }).itemListElement
    expect(items[0]).not.toHaveProperty('item')
  })
})
