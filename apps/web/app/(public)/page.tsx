import Link from 'next/link'
import { Button, Card, CardTitle, CardBody, PageHeader } from '@execuneed/ui'
import { copy } from '@/content/copy'

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-16">
      <section className="flex flex-col gap-6">
        <PageHeader title={copy.home.hero.title} lede={copy.home.hero.body} />
        <p className="text-ink-muted">{copy.home.hero.secondary}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/cover-review">{copy.cta.review}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/how-we-work">{copy.nav.how}</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-3xl">
        <h2 className="font-heading text-2xl text-ink sm:text-3xl">{copy.home.problem.title}</h2>
        <p className="mt-3 text-lg text-ink-muted">{copy.home.problem.body}</p>
      </section>

      <section>
        <h2 className="font-heading text-2xl text-ink sm:text-3xl">{copy.home.process.title}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.how.steps.map((step, i) => (
            <li key={step}>
              <Card className="h-full">
                <p className="font-heading text-3xl text-sand">{i + 1}</p>
                <CardBody className="mt-2">{step}</CardBody>
              </Card>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm text-ink-muted">{copy.how.note}</p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardTitle>{copy.home.proof.title}</CardTitle>
          <CardBody className="mt-2">{copy.home.proof.body}</CardBody>
        </Card>
        <Card>
          <CardTitle>{copy.review.title}</CardTitle>
          <CardBody className="mt-2">{copy.review.body}</CardBody>
          <div className="mt-4">
            <Button asChild>
              <Link href="/cover-review">{copy.cta.review}</Link>
            </Button>
          </div>
        </Card>
      </section>
    </main>
  )
}
