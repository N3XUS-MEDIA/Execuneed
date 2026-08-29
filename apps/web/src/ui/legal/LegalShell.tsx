import Link from 'next/link'
import { Alert, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

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
export function LegalShell({
  title,
  summary,
}: {
  title: string
  summary: string
}) {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <PageHeader title={title} lede={summary} />

      <Alert tone="warn" title="This wording is not final">
        {copy.legal.placeholder}
      </Alert>

      <p className="text-ink-muted">
        For this information now, please{' '}
        <Link href="/contact" className="text-sea underline underline-offset-4">
          contact the practice
        </Link>{' '}
        and we will send you the current document.
      </p>
    </main>
  )
}

/** Applied by every legal page. Not conditional on ALLOW_INDEXING. */
export const legalMetadata = {
  robots: { index: false, follow: false },
} as const
