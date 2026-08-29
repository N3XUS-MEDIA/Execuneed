import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, Card, CardTitle, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { getOrganisationSettings, whatsappHref } from '@/server/org'

export const metadata: Metadata = { title: copy.nav.contact }

export default async function ContactPage() {
  const org = await getOrganisationSettings()
  const wa = whatsappHref(org?.whatsappE164, copy.whatsapp.prefill)

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
      <PageHeader title={copy.nav.contact} lede={copy.contact.areas} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardTitle>Talk to us</CardTitle>
          <CardBody className="mt-2 flex flex-col gap-2">
            <a
              href={`tel:${copy.contact.phone.replace(/\s/g, '')}`}
              className="text-lg text-sea hover:underline"
            >
              {org?.phoneDisplay ?? copy.contact.phone}
            </a>
            <p>{copy.contact.hours}</p>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="text-sea hover:underline">
                {copy.cta.whatsapp}
              </a>
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Where we are</CardTitle>
          <CardBody className="mt-2 flex flex-col gap-2">
            <p>{copy.contact.addressCentury}</p>
            <p>{copy.contact.addressMelkbos}</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardTitle>Booking a review is faster</CardTitle>
        <CardBody className="mt-2 mb-4">
          Send the details once and we come back to you, rather than playing telephone tag.
        </CardBody>
        <Button asChild>
          <Link href="/cover-review">{copy.cta.review}</Link>
        </Button>
      </Card>
    </main>
  )
}
