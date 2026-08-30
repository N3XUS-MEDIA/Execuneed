import Link from 'next/link'
import { Alert } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { Section, SectionHeading } from '@/ui/layout/Section'

/**
 * P1-S-024 — legal page shell.
 *
 * These pages exist so the routes and the footer links are real, not so they
 * can pretend to be finished policy. Statute text is never invented
 * (docs/ui/COPY_DECK.md), so the body says plainly that the wording is not
 * final and tells the reader how to get the information now.
 *
 * Every legal page is noindex regardless of ALLOW_INDEXING: an unfinished
 * PAIA manual or complaints process indexed by Google is a regulatory problem,
 * not just an embarrassing one.
 */
export function LegalShell({ title, summary }: { title: string; summary: string }) {
  return (
    <Section width="narrow">
      <SectionHeading as="h1" eyebrow="Legal" title={title} lede={summary} />

      <Alert tone="warn" title="This wording is not final" className="mt-10">
        {copy.legal.placeholder}
      </Alert>

      <div className="mt-10 rounded-lg border border-line bg-sand/40 p-7">
        <p className="eyebrow">Ask us directly</p>
        <p className="mt-4 leading-relaxed text-ink-muted">
          For this information now, please{' '}
          <Link href="/contact" className="text-navy underline underline-offset-4">
            contact the practice
          </Link>{' '}
          and we will send you the current document.
        </p>
        <a
          href={`tel:${copy.contact.phone.replace(/\s/g, '')}`}
          className="mt-4 inline-flex min-h-[44px] items-center font-heading text-xl font-semibold tracking-tight text-ink underline-offset-4 hover:underline"
        >
          {copy.contact.phone}
        </a>
      </div>
    </Section>
  )
}

/** Applied by every legal page. Not conditional on ALLOW_INDEXING. */
export const legalMetadata = {
  robots: { index: false, follow: false },
} as const
