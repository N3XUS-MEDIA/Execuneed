import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, Card, CardTitle, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export const metadata: Metadata = { title: copy.nav.services }

/**
 * P1-S-021 — no premiums, no plan names, no benefit percentages.
 *
 * The Banking and Vitality entry is the generic fallback from the copy deck.
 * Anything stronger is a Discovery benefit claim and must go through
 * NeedsApproval with a Marketing Support reference.
 */
export default function ServicesPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <PageHeader title={copy.nav.services} lede={copy.services.intro} />

      <div className="grid gap-6 sm:grid-cols-2">
        {copy.services.items.map((item) => (
          <Card key={item.key}>
            <CardTitle as="h2">{item.title}</CardTitle>
            <CardBody className="mt-2">{item.body}</CardBody>
          </Card>
        ))}
      </div>

      <div>
        <Button asChild size="lg">
          <Link href="/cover-review">{copy.cta.review}</Link>
        </Button>
      </div>
    </main>
  )
}
