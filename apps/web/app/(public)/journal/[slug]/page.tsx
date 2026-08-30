import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Alert, Badge, Button, NeedsApproval } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { findArticle, journalArticles, journalCopy, relatedTo } from '@/content/journal'
import { Container } from '@/ui/layout/Container'
import { Section } from '@/ui/layout/Section'
import { HexRule } from '@/ui/brand/HexMark'

export function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = findArticle(slug)
  return article ? { title: article.title, description: article.standfirst } : {}
}

const published = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Africa/Johannesburg',
})

/**
 * P2-S-043 — an article.
 *
 * Structure matters here beyond aesthetics. The question the reader asked is
 * the first thing on the page, the sections answer it in order, and the FAQ at
 * the end restates the answers in the form people ask them — which is the form
 * an assistant summarising this page will look for.
 *
 * Everything above is general information. Anything that would state a
 * Discovery benefit is in `claims` and renders only through `NeedsApproval`.
 */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = findArticle(slug)
  if (!article) notFound()

  const related = relatedTo(article)

  return (
    <>
      <div className="border-b border-line bg-gradient-to-b from-sand/60 to-paper">
        <Container width="narrow">
          <div className="py-14 sm:py-20">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="sea">{article.category}</Badge>
              <span className="text-sm text-ink-muted">{article.readingMinutes} min read</span>
            </div>
            <h1 className="mt-6 text-4xl text-ink sm:text-5xl">{article.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted sm:text-xl">
              {article.standfirst}
            </p>
            <p className="mt-8 text-sm text-ink-muted">
              Last reviewed{' '}
              <time dateTime={article.updated}>
                {published.format(new Date(article.updated))}
              </time>
            </p>
          </div>
        </Container>
      </div>

      <Section width="narrow">
        <p className="eyebrow">The question</p>
        <p className="mt-3 font-heading text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {article.question}
        </p>

        <div className="longform mt-12">
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.list ? (
                <ul>
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {/*
          Discovery benefit copy. Nothing renders until `approvalRef` holds a
          real Marketing Support reference — see docs/compliance/DISCOVERY_APPROVALS.md.
          There is deliberately no fallback: on an article the surrounding text
          already carries the point, and an "approval pending" box on every page
          would be noise.
        */}
        <NeedsApproval approvalRef={article.approvalRef}>
          <div className="longform mt-12">
            <h2>Product detail</h2>
            <ul>
              {article.claims.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </NeedsApproval>

        {article.figuresNote ? (
          <Alert tone="warn" title={journalCopy.figuresLabel} className="mt-12">
            {article.figuresNote}
          </Alert>
        ) : null}

        <HexRule className="my-14" />

        <h2 className="text-2xl text-ink sm:text-3xl">Common questions</h2>
        <dl className="mt-8 flex flex-col">
          {article.faqs.map((f) => (
            <div key={f.q} className="border-b border-line py-6 first:border-t">
              <dt className="font-heading text-lg font-semibold tracking-tight text-ink">{f.q}</dt>
              <dd className="mt-3 leading-relaxed text-ink-muted">{f.a}</dd>
            </div>
          ))}
        </dl>

        <Alert tone="info" title="Where advice happens" className="mt-12">
          {journalCopy.adviceNote}
        </Alert>

        <div className="mt-12 rounded-lg bg-navy p-7 sm:p-9">
          <p className="eyebrow-on-navy">No obligation</p>
          <h2 className="mt-4 text-2xl text-paper sm:text-3xl">{copy.review.title}</h2>
          <p className="mt-4 leading-relaxed text-paper/75">{copy.review.body}</p>
          <Button asChild variant="secondary" size="lg" className="mt-7 w-full sm:w-auto">
            <Link href="/cover-review">{copy.cta.review}</Link>
          </Button>
        </div>
      </Section>

      {related.length ? (
        <Section tone="sand" bordered size="sm">
          <h2 className="text-2xl text-ink sm:text-3xl">Read next</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/journal/${r.slug}`}
                  className="flex h-full flex-col rounded-lg border border-line bg-paper p-6 transition-colors hover:border-navy/40"
                >
                  <span className="font-heading text-lg font-semibold tracking-tight text-ink">
                    {r.title}
                  </span>
                  <span className="mt-3 leading-relaxed text-ink-muted">{r.standfirst}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link
              href="/journal"
              className="inline-flex min-h-[44px] items-center text-navy underline underline-offset-4"
            >
              All articles
            </Link>
          </p>
        </Section>
      ) : null}
    </>
  )
}
