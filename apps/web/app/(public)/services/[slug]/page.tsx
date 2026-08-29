import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Alert, Button, Card, CardTitle, CardBody, NeedsApproval, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { findCategory, productCategories, productsCopy } from '@/content/products'

export function generateStaticParams() {
  return productCategories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = findCategory(slug)
  return category ? { title: category.title, description: category.need } : {}
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = findCategory(slug)
  if (!category) notFound()

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      <PageHeader title={category.title} lede={category.need} />

      <Card>
        <CardTitle as="h2">What a review covers</CardTitle>
        <CardBody className="mt-3">
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {category.covers.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardTitle as="h2">Who this tends to matter for</CardTitle>
        <CardBody className="mt-2">{category.who}</CardBody>
      </Card>

      {/*
        Discovery benefit copy. Renders nothing until `approvalRef` holds a real
        Marketing Support reference — an unapproved product claim is worse than
        a gap, so the fallback makes no claim of its own.
      */}
      <NeedsApproval
        approvalRef={category.approvalRef}
        fallback={<Alert tone="info">{productsCopy.approvalPending}</Alert>}
      >
        <Card>
          <CardTitle as="h2">Product detail</CardTitle>
          <CardBody className="mt-3">
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {category.claims.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </NeedsApproval>

      <Alert tone="info">{productsCopy.adviceNote}</Alert>

      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/cover-review">{copy.cta.review}</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/services">All services</Link>
        </Button>
      </div>
    </main>
  )
}
