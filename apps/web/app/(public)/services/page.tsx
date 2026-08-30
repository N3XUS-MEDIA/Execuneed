import type { Metadata } from 'next'
import Link from 'next/link'
import { Alert, Button } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { productCategories, productsCopy } from '@/content/products'
import { Section } from '@/ui/layout/Section'
import { PageHero } from '@/ui/layout/PageHero'

export const metadata: Metadata = { title: copy.nav.services, description: productsCopy.intro }

/**
 * P1-S-021 — the range Execuneed advises on.
 *
 * Each card describes the client's need, not a Discovery product. Plan names,
 * benefits and premiums live behind NeedsApproval on the category pages and do
 * not render until a Marketing Support reference exists.
 */
export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow={copy.nav.services} title="What a review looks at" lede={productsCopy.intro} />

      <Section>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-2">
          {productCategories.map((category) => (
            <li key={category.slug} className="flex flex-col bg-paper p-7 sm:p-9">
              <h2 className="text-xl text-ink sm:text-2xl">{category.title}</h2>
              <p className="mt-4 flex-1 leading-relaxed text-ink-muted">{category.need}</p>
              <Link
                href={`/services/${category.slug}`}
                className="group mt-6 inline-flex min-h-[44px] items-center gap-2 self-start font-medium text-navy"
              >
                What a review covers
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <Alert tone="info" className="mt-12 max-w-3xl">
          {productsCopy.adviceNote}
        </Alert>
      </Section>

      <Section tone="sand" bordered width="narrow" size="sm">
        <div className="text-center">
          <h2 className="text-3xl text-ink sm:text-4xl">{copy.review.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{copy.review.body}</p>
          <Button asChild size="lg" className="mt-9 w-full sm:w-auto">
            <Link href="/cover-review">{copy.cta.review}</Link>
          </Button>
        </div>
      </Section>
    </>
  )
}
