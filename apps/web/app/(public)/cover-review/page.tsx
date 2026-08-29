import type { Metadata } from 'next'
import { Card, CardTitle, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { LeadForm } from '@/ui/leads/LeadForm'

export const metadata: Metadata = { title: copy.review.title }

export default function CoverReviewPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <PageHeader title={copy.review.title} lede={copy.review.body} />

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <Card className="order-2 lg:order-1">
          <CardTitle>Tell us where to start</CardTitle>
          <CardBody className="mt-2 mb-6">{copy.review.next}</CardBody>
          <LeadForm source="web" />
        </Card>

        <aside className="order-1 flex flex-col gap-6 lg:order-2">
          <Card>
            <CardTitle>Who this is for</CardTitle>
            <CardBody className="mt-2">{copy.review.who}</CardBody>
          </Card>
          <Card>
            <CardTitle>What happens next</CardTitle>
            <CardBody className="mt-2">
              <ol className="flex list-decimal flex-col gap-2 pl-4">
                <li>We read what you sent and check nothing is missing.</li>
                <li>An adviser or Denise contacts you during office hours.</li>
                <li>We agree a time and what to bring.</li>
              </ol>
            </CardBody>
          </Card>
          <p className="text-sm text-ink-muted">{copy.how.note}</p>
        </aside>
      </div>
    </main>
  )
}
