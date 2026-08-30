import Link from 'next/link'
import { Button } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { heroFacts, processSteps, serviceSnapshot } from '@/content/home'
import { productsCopy } from '@/content/products'
import { Container } from '@/ui/layout/Container'
import { Section, SectionHeading } from '@/ui/layout/Section'
import { HexMark, HexRule } from '@/ui/brand/HexMark'

/**
 * Home — docs/ui/WIREFRAMES.md: hero, problem, four-step process, services
 * snapshot, proof, review CTA.
 *
 * The page alternates paper, navy and sand bands rather than stacking cards on
 * one flat background. With no photography available that tonal rhythm is what
 * gives the page structure at a glance.
 */
export default function HomePage() {
  return (
    <>
      {/* Hero. A cool wash off the top so the page does not start on a flat
          field of paper directly under the navy header. */}
      <div className="bg-gradient-to-b from-sand/60 via-paper to-paper">
        <Container width="wide">
          <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
            <div className="lg:col-span-7">
              <p className="eyebrow">{copy.home.proof.title.replace(/\.$/, '')}</p>
              <h1 className="mt-5 text-4xl text-ink sm:text-5xl lg:text-6xl">
                {copy.home.hero.title}
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
                {copy.home.hero.body}
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
                {copy.home.hero.secondary}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="/cover-review">{copy.cta.review}</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/how-we-work">{copy.nav.how}</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 lg:pl-10">
              <dl className="flex flex-col divide-y divide-line border-y border-line lg:border-b-0 lg:border-l lg:border-r-0 lg:border-t-0 lg:pl-10">
                {heroFacts.map((f) => (
                  <div key={f.label} className="py-5">
                    <dt className="eyebrow">{f.label}</dt>
                    <dd className="mt-2 font-heading text-xl font-semibold tracking-tight text-ink">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </div>

      {/* Problem. The one moment the page raises its voice, so it gets the
          brand ground rather than another card. */}
      <Section tone="navy">
        <div className="mx-auto max-w-3xl text-center">
          <HexMark bars={false} strokeWidth={30} className="mx-auto size-10 text-paper/40" />
          <h2 className="mt-8 text-3xl text-paper sm:text-4xl lg:text-5xl">
            {copy.home.problem.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-paper/75 sm:text-xl">
            {copy.home.problem.body}
          </p>
        </div>
      </Section>

      {/* Four-step process */}
      <Section>
        <SectionHeading eyebrow={copy.nav.how} title={copy.home.process.title} />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
          {processSteps.map((s) => (
            <li key={s.n} className="flex flex-col gap-4 bg-paper p-7 sm:p-8">
              <span className="font-heading text-2xl font-semibold tracking-tight text-navy/65">
                {s.n}
              </span>
              <p className="leading-relaxed text-ink-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink-muted">{copy.how.note}</p>
      </Section>

      {/* Services snapshot */}
      <Section tone="sand" bordered>
        <SectionHeading
          eyebrow={copy.nav.services}
          title="What a review looks at"
          lede={productsCopy.intro}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceSnapshot.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.href}
                className="group flex min-h-[104px] items-center justify-between gap-4 rounded-lg border border-line bg-paper p-6 transition-colors hover:border-navy/40"
              >
                <span className="font-heading text-lg font-semibold tracking-tight text-ink">
                  {s.title}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Proof */}
      <Section width="narrow">
        <HexRule className="mb-12" />
        <div className="text-center">
          <h2 className="text-3xl text-ink sm:text-4xl">{copy.home.proof.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">{copy.home.proof.body}</p>
        </div>
      </Section>

      {/* Closing CTA. A navy panel rather than a full navy band — the footer is
          already navy and two abutting bands would read as one. */}
      <Section tone="sand" bordered>
        <div className="rounded-lg bg-navy px-6 py-14 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl text-paper sm:text-4xl">{copy.review.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-paper/75">
            {copy.review.body}
          </p>
          <div className="mt-10 flex flex-col items-center gap-5">
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/cover-review">{copy.cta.review}</Link>
            </Button>
            <a
              href={`tel:${copy.contact.phone.replace(/\s/g, '')}`}
              className="inline-flex min-h-[44px] items-center text-paper/75 underline underline-offset-4 transition-colors hover:text-paper"
            >
              {copy.cta.call}
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}
