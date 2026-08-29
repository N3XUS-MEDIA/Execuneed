import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, Card, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export const metadata: Metadata = { title: copy.form.thanksTitle }

export default function ThanksPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-24">
      <PageHeader title={copy.form.thanksTitle} lede={copy.form.thanksBody} />

      <Card>
        <CardBody>
          <ol className="flex list-decimal flex-col gap-3 pl-4">
            <li>Your request is with the practice now.</li>
            <li>
              We reply during office hours — {copy.contact.hours}. High-priority reviews are
              picked up the same morning where we can.
            </li>
            <li>Nothing is submitted to any product provider until you decide.</li>
          </ol>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link href="/">Back to the homepage</Link>
        </Button>
        <Button asChild variant="link">
          <a href={`tel:${copy.contact.phone.replace(/\s/g, '')}`}>{copy.cta.call}</a>
        </Button>
      </div>
    </main>
  )
}
