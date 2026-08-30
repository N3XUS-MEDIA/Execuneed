import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Alert, Button, NeedsApproval } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { findCategory, productCategories, productsCopy } from '@/content/products'
import { Section } from '@/ui/layout/Section'
import { PageHero } from '@/ui/layout/PageHero'
import { HexMark } from '@/ui/brand/HexMark'

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = findCategory(slug)
  if (!category) notFound()

  const others = productCategories.filter((c) => c.slug !== category.slug).slice(0, 3)

  return (
    <>
      <PageHero eyebrow={copy.nav.services} title={category.title} lede={category.need} />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-2xl text-ink sm:text-3xl">What a review covers</h2>
            <ul className="mt-8 flex flex-col">
              {category.covers.map((line) => (
                <li key={line} className="flex gap-4 border-b border-line py-5 first:border-t">
                  <HexMark
                    bars={false}
                    strokeWidth={40}
                    className="mt-1 size-4 shrink-0 text-navy/40"
                  />
                  <span className="leading-relaxed text-ink-muted">{line}</span>
                </li>
              ))}
            </ul>

            {/*
              Discovery benefit copy. Renders nothing until `approvalRef` holds a
              real Marketing Support reference — an unapproved product claim is
              worse than a gap, so the fallback makes no claim of its own.
            */}
            <NeedsApproval
              approvalRef={category.approvalRef}
              fallback={
                <Alert tone="info" className="mt-12">
                  {productsCopy.approvalPending}
                </Alert>
              }
            >
              <div className="mt-12">
                <h2 className="text-2xl text-ink sm:text-3xl">Product detail</h2>
                <ul className="mt-6 flex list-disc flex-col gap-3 pl-5 text-lg leading-relaxed text-ink-muted">
                  {category.claims.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </NeedsApproval>
          </div>

          <aside className="lg:col-span-5 lg:pl-6">
            <div className="rounded-lg border border-line bg-sand/40 p-7">
              <p className="eyebrow">Who this tends to matter for</p>
              <p className="mt-4 leading-relaxed text-ink-muted">{category.who}</p>
            </div>

            <div className="mt-6 rounded-lg bg-navy p-7">
              <p className="eyebrow-on-navy">No obligation</p>
              <p className="mt-4 font-heading text-xl font-semibold tracking-tight text-paper">
                {copy.review.title}
              </p>
              <p className="mt-3 leading-relaxed text-paper/70">{copy.review.body}</p>
              <Button asChild variant="secondary" className="mt-6 w-full">
                <Link href="/cover-review">{copy.cta.review}</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              {productsCopy.adviceNote}
            </p>
          </aside>
        </div>
      </Section>

      <Section tone="sand" bordered size="sm">
        <h2 className="text-2xl text-ink sm:text-3xl">Other areas we review</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/services/${o.slug}`}
                className="flex min-h-[88px] items-center rounded-lg border border-line bg-paper p-5 font-heading font-semibold tracking-tight text-ink transition-colors hover:border-navy/40"
              >
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link
            href="/services"
            className="inline-flex min-h-[44px] items-center text-navy underline underline-offset-4"
          >
            All services
          </Link>
        </p>
      </Section>
    </>
  )
}
