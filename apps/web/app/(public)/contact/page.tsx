import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { getOrganisationSettings, whatsappHref } from '@/server/org'
import { Section } from '@/ui/layout/Section'
import { PageHero } from '@/ui/layout/PageHero'

export const metadata: Metadata = { title: copy.nav.contact, description: copy.contact.areas }

export default async function ContactPage() {
  const org = await getOrganisationSettings()
  const wa = whatsappHref(org?.whatsappE164, copy.whatsapp.prefill)
  const tel = copy.contact.phone.replace(/\s/g, '')

  const offices = [
    { name: 'Century City', address: copy.contact.addressCentury },
    { name: 'Melkbosstrand', address: copy.contact.addressMelkbos },
  ]

  return (
    <>
      <PageHero eyebrow={copy.nav.contact} title="Talk to us" lede={copy.contact.areas} />

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl text-ink sm:text-3xl">By phone</h2>
            <dl className="mt-8 flex flex-col divide-y divide-line border-y border-line">
              <div className="py-6">
                <dt className="eyebrow">Phone</dt>
                <dd className="mt-2">
                  <a
                    href={`tel:${tel}`}
                    className="inline-flex min-h-[44px] items-center font-heading text-2xl font-semibold tracking-tight text-ink underline-offset-4 hover:underline sm:text-3xl"
                  >
                    {org?.phoneDisplay ?? copy.contact.phone}
                  </a>
                </dd>
              </div>
              <div className="py-6">
                <dt className="eyebrow">Office hours</dt>
                <dd className="mt-2 text-lg text-ink">{copy.contact.hours}</dd>
              </div>
              {org?.email ? (
                <div className="py-6">
                  <dt className="eyebrow">Email</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${org.email}`}
                      className="inline-flex min-h-[44px] items-center break-all text-lg text-ink underline-offset-4 hover:underline"
                    >
                      {org.email}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            {wa ? (
              <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
                <a href={wa} target="_blank" rel="noopener noreferrer">
                  {copy.cta.whatsapp}
                </a>
              </Button>
            ) : null}
          </div>

          <div>
            <h2 className="text-2xl text-ink sm:text-3xl">Where we are</h2>
            <ul className="mt-8 grid gap-4">
              {offices.map((o) => (
                <li key={o.name} className="rounded-lg border border-line bg-sand/40 p-7">
                  <p className="eyebrow">{o.name}</p>
                  <p className="mt-3 leading-relaxed text-ink-muted">{o.address}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-ink-muted">{copy.contact.areas}</p>
          </div>
        </div>
      </Section>

      <Section tone="sand" bordered width="narrow" size="sm">
        <div className="text-center">
          <h2 className="text-3xl text-ink sm:text-4xl">Booking a review is faster</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Send the details once and we come back to you, rather than playing telephone tag.
          </p>
          <Button asChild size="lg" className="mt-9 w-full sm:w-auto">
            <Link href="/cover-review">{copy.cta.review}</Link>
          </Button>
        </div>
      </Section>
    </>
  )
}
