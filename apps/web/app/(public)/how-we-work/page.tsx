import type { Metadata } from 'next'
import Link from 'next/link'
import { Button, Card, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export const metadata: Metadata = { title: copy.nav.how }

export default function HowWeWorkPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16">
      <PageHeader title={copy.home.process.title} lede={copy.home.hero.body} />

      <ol className="flex flex-col gap-4">
        {copy.how.steps.map((step, i) => (
          <li key={step}>
            <Card className="flex gap-5">
              <span className="font-heading text-3xl text-sand">{i + 1}</span>
              <CardBody className="self-center">{step}</CardBody>
            </Card>
          </li>
        ))}
      </ol>

      {/* The FAIS line. This site does not advise; a licensed person does. */}
      <p className="rounded-md border border-line bg-sand/30 p-5 text-ink-muted">
        {copy.how.note}
      </p>

      <div>
        <Button asChild size="lg">
          <Link href="/cover-review">{copy.cta.review}</Link>
        </Button>
      </div>
    </main>
  )
}
