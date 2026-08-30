import type { Metadata } from 'next'
import Link from 'next/link'
import { Alert, Button } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { processSteps } from '@/content/home'
import { Section } from '@/ui/layout/Section'
import { PageHero } from '@/ui/layout/PageHero'

export const metadata: Metadata = {
  title: copy.nav.how,
  description: copy.home.process.title,
}

export default function HowWeWorkPage() {
  return (
    <>
      <PageHero
        eyebrow={copy.nav.how}
        title={copy.home.process.title}
        lede={copy.home.hero.body}
      />

      <Section>
        <ol className="flex flex-col">
          {processSteps.map((s) => (
            <li
              key={s.n}
              className="grid gap-3 border-b border-line py-8 first:border-t sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-10"
            >
              <span className="font-heading text-3xl font-semibold tracking-tight text-navy/65">
                {s.n}
              </span>
              <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* The FAIS line. This site does not advise; a licensed person does. */}
        <Alert tone="info" title="Where advice happens" className="mt-12 max-w-2xl">
          {copy.how.note}
        </Alert>
      </Section>

      <Section tone="sand" bordered width="narrow" size="sm">
        <div className="text-center">
          <h2 className="text-3xl text-ink sm:text-4xl">{copy.review.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{copy.review.next}</p>
          <Button asChild size="lg" className="mt-9 w-full sm:w-auto">
            <Link href="/cover-review">{copy.cta.review}</Link>
          </Button>
        </div>
      </Section>
    </>
  )
}
