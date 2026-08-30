import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { Section } from '@/ui/layout/Section'

export const metadata: Metadata = {
  title: copy.form.thanksTitle,
  // A confirmation page has nothing to offer a search engine and should not be
  // an entry point.
  robots: { index: false, follow: false },
}

export default function ThanksPage() {
  return (
    <Section width="narrow" className="py-20 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <span
          className="flex size-14 items-center justify-center rounded-full bg-ok/10 text-ok"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-7"
          >
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
        </span>

        <h1 className="mt-8 text-4xl text-ink sm:text-5xl">{copy.form.thanksTitle}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">{copy.form.thanksBody}</p>
      </div>

      <ol className="mt-12 flex flex-col text-left">
        {[
          'Your request is with the practice now.',
          `We reply during office hours — ${copy.contact.hours}. High-priority reviews are picked up the same morning where we can.`,
          'Nothing is submitted to any product provider until you decide.',
        ].map((line, i) => (
          <li key={line} className="flex gap-5 border-b border-line py-5 first:border-t">
            <span className="font-heading text-lg font-semibold tracking-tight text-navy/65">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="leading-relaxed text-ink-muted">{line}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
          <a href={`tel:${copy.contact.phone.replace(/\s/g, '')}`}>{copy.cta.call}</a>
        </Button>
        <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
          <Link href="/">Back to the homepage</Link>
        </Button>
      </div>
    </Section>
  )
}
