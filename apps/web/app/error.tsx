'use client'

import { useEffect } from 'react'
import { Alert, Button, PageHeader } from '@execuneed/ui'

/**
 * P1-S-062 — the page a visitor sees when something breaks.
 *
 * It shows no stack trace, no digest and no internal detail, and it offers the
 * phone number — because someone who hit an error while asking for help with
 * their cover should not be left with a dead end.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server-side reporting lands with observability. Logging here at least
    // puts it in the browser console for a developer looking over a shoulder.
    console.error('Unhandled error', error.digest ?? '')
  }, [error])

  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <PageHeader
        title="Something went wrong on our side."
        lede="Nothing you entered has been lost or sent anywhere."
      />
      <Alert tone="warn">
        If you were sending us an enquiry, please try again — or call the practice on{' '}
        <a href="tel:0215528989" className="underline underline-offset-4">
          021 552 8989
        </a>{' '}
        and we will take the details over the phone.
      </Alert>
      <div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  )
}
