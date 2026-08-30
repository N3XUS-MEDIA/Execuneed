import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge, Button } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { journalArticles, journalCopy } from '@/content/journal'
import { Section } from '@/ui/layout/Section'
import { PageHero } from '@/ui/layout/PageHero'

export const metadata: Metadata = {
  title: journalCopy.title,
  description: journalCopy.standfirst,
}

/**
 * P2-S-043 — the journal index.
 *
 * Each card leads with the question a reader would actually type rather than
 * the headline, because that is how someone arrives at one of these pages.
 */
export default function JournalPage() {
  return (
    <>
      <PageHero eyebrow={journalCopy.title} title="Questions worth an answer" lede={journalCopy.standfirst} />

      <Section>
        <ul className="flex flex-col">
          {journalArticles.map((a) => (
            <li key={a.slug} className="border-b border-line first:border-t">
              <Link href={`/journal/${a.slug}`} className="group block py-8 sm:py-10">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="sea">{a.category}</Badge>
                  <span className="text-sm text-ink-muted">{a.readingMinutes} min read</span>
                </div>
                <h2 className="mt-4 max-w-3xl text-2xl text-ink transition-colors group-hover:text-navy sm:text-3xl">
                  {a.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">{a.standfirst}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-medium text-navy">
                  Read
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
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 max-w-3xl text-sm leading-relaxed text-ink-muted">
          {journalCopy.adviceNote}
        </p>
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
