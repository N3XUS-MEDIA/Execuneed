import type { Metadata } from 'next'
import { copy } from '@/content/copy'
import { processSteps } from '@/content/home'
import { getOrganisationSettings, whatsappHref } from '@/server/org'
import { Container } from '@/ui/layout/Container'
import { Section, SectionHeading } from '@/ui/layout/Section'
import { LeadForm } from '@/ui/leads/LeadForm'

export const metadata: Metadata = { title: copy.review.title, description: copy.review.body }

/**
 * The page the whole site points at.
 *
 * The form is the primary column and is not boxed inside a card — on a phone a
 * bordered panel around a long form just adds two edges and steals width. The
 * supporting detail sits in a rail that drops below the form on small screens,
 * so nothing stands between arriving and starting to type.
 */
export default async function CoverReviewPage() {
  const org = await getOrganisationSettings()
  const wa = whatsappHref(org?.whatsappE164, copy.whatsapp.prefill)
  const tel = copy.contact.phone.replace(/\s/g, '')

  return (
    <>
      <div className="border-b border-line bg-gradient-to-b from-sand/60 to-paper">
        <Container>
          <div className="py-14 sm:py-20">
            <SectionHeading
              as="h1"
              eyebrow="No obligation"
              title={copy.review.title}
              lede={copy.review.body}
            />
            <p className="mt-6 max-w-2xl leading-relaxed text-ink-muted">{copy.review.who}</p>
          </div>
        </Container>
      </div>

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl text-ink sm:text-3xl">Tell us where to start</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-ink-muted">{copy.review.next}</p>
            <div className="mt-10">
              <LeadForm source="web" />
            </div>
          </div>

          <aside className="lg:col-span-5 lg:pl-6">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-2xl text-ink sm:text-3xl">What happens next</h2>
              <ol className="mt-6 flex flex-col">
                {processSteps.map((s) => (
                  <li key={s.n} className="flex gap-5 border-b border-line py-5 first:border-t">
                    <span className="font-heading text-lg font-semibold tracking-tight text-navy/65">
                      {s.n}
                    </span>
                    <p className="leading-relaxed text-ink-muted">{s.body}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-lg border border-line bg-sand/40 p-7">
                <p className="eyebrow">Rather talk?</p>
                <p className="mt-3 leading-relaxed text-ink-muted">{copy.contact.hours}</p>
                <a
                  href={`tel:${tel}`}
                  className="mt-3 inline-flex min-h-[44px] items-center font-heading text-2xl font-semibold tracking-tight text-ink underline-offset-4 hover:underline"
                >
                  {org?.phoneDisplay ?? copy.contact.phone}
                </a>
                {wa ? (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-[44px] items-center text-navy underline underline-offset-4"
                  >
                    {copy.cta.whatsapp}
                  </a>
                ) : null}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-ink-muted">{copy.how.note}</p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  )
}
