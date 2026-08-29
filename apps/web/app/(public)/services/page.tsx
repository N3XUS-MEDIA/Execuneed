import type { Metadata } from 'next'
import Link from 'next/link'
import { Alert, Button, Card, CardTitle, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { productCategories, productsCopy } from '@/content/products'

export const metadata: Metadata = { title: copy.nav.services }

/**
 * P1-S-021 — the range Execuneed advises on.
 *
 * Each card describes the client's need, not a Discovery product. Plan names,
 * benefits and premiums live behind NeedsApproval on the category pages and do
 * not render until a Marketing Support reference exists.
 */
export default function ServicesPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <PageHeader title={copy.nav.services} lede={productsCopy.intro} />

      <div className="grid gap-6 sm:grid-cols-2">
        {productCategories.map((category) => (
          <Card key={category.slug} className="flex flex-col">
            <CardTitle as="h2">{category.title}</CardTitle>
            <CardBody className="mt-2 flex-1">{category.need}</CardBody>
            <div className="mt-4">
              <Link
                href={`/services/${category.slug}`}
                className="text-navy underline underline-offset-4"
              >
                What a review covers
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <Alert tone="info">{productsCopy.adviceNote}</Alert>

      <div>
        <Button asChild size="lg">
          <Link href="/cover-review">{copy.cta.review}</Link>
        </Button>
      </div>
    </main>
  )
}
