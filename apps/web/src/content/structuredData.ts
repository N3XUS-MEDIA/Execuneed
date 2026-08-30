import type { OrganisationSettings } from '@prisma/client'
import { copy } from './copy'
import type { JournalArticle } from './journal'

/**
 * Structured data for the public pages.
 *
 * `docs/product/EXECUNEED_AI_PLATFORM_PLAN.md` §6.1 asks for pages structured
 * so that assistants summarising them cite Execuneed rather than paraphrasing
 * a competitor. That is what this is for: the same content already on the page,
 * in a form a machine reads without guessing.
 *
 * Two rules govern what may appear here.
 *
 * Nothing unconfirmed. The legal entity name, the FSP number and the NCR
 * number are all still placeholders in `OrganisationSettings`
 * (docs/product/CLIENT_ANSWERS.md), and a placeholder legal name emitted as
 * `legalName` is a machine-readable false statement about a licensed practice.
 * Only fields the practice has actually confirmed are emitted, and a field
 * that is empty is omitted rather than defaulted.
 *
 * Nothing new. Every string here already exists on the rendered page, so it has
 * already been through the same compliance gate. This adds no copy of its own.
 */

type Json = Record<string, unknown>

/** Drop empty values rather than emitting `null`, which asserts absence. */
function compact(input: Json): Json {
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => {
      if (v === null || v === undefined || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    }),
  )
}

export function organisationLd(
  org: OrganisationSettings | null,
  baseUrl: string | undefined,
): Json {
  const street = [org?.addressLine1, org?.addressLine2].filter(Boolean).join(', ')
  // `@type` and a hardcoded country are not an address. Emit one only when the
  // row actually holds a place.
  const hasAddress = Boolean(street || org?.city)
  const address = hasAddress
    ? compact({
        '@type': 'PostalAddress',
        streetAddress: street,
        addressLocality: org?.city,
        postalCode: org?.postalCode,
        addressCountry: 'ZA',
      })
    : undefined

  return compact({
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: org?.tradingName ?? copy.brand.name,
    // legalName, FSP and NCR are deliberately absent. See the note above.
    description: copy.brand.tagline,
    url: baseUrl,
    telephone: org?.phoneDisplay ?? copy.contact.phone,
    email: org?.email,
    logo: baseUrl ? `${baseUrl}/brand/logo.png` : undefined,
    image: baseUrl ? `${baseUrl}/brand/logo.png` : undefined,
    address,
    areaServed: ['Century City', 'Melkbosstrand', 'Cape Town'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
  })
}

export function articleLd(
  article: JournalArticle,
  { baseUrl, publisher }: { baseUrl: string | undefined; publisher: string },
): Json {
  const url = baseUrl ? `${baseUrl}/journal/${article.slug}` : undefined

  return compact({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.standfirst,
    articleSection: article.category,
    // `dateModified` only. The content files record when an article was last
    // reviewed, not when it first went up, and inventing a publication date to
    // satisfy a rich-result checklist is still inventing one.
    dateModified: article.updated,
    inLanguage: 'en-ZA',
    isAccessibleForFree: true,
    author: { '@type': 'Organization', name: publisher },
    publisher: { '@type': 'Organization', name: publisher },
    mainEntityOfPage: url,
    url,
  })
}

/**
 * The questions and answers already at the foot of every article, in the shape
 * an assistant looks for. This is the piece §6.1 actually wants.
 */
export function faqLd(article: JournalArticle): Json | null {
  if (article.faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function breadcrumbLd(
  trail: Array<{ name: string; path: string }>,
  baseUrl: string | undefined,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      ...(baseUrl ? { item: `${baseUrl}${step.path}` } : {}),
    })),
  }
}
