import Link from 'next/link'
import { Button, PageHeader } from '@execuneed/ui'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <PageHeader
        title="We could not find that page."
        lede="It may have moved, or the link may be out of date."
      />
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/">Back to the homepage</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">Contact the practice</Link>
        </Button>
      </div>
    </main>
  )
}
