'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@execuneed/ui'
import { COOKIE_CONSENT_KEY, parseConsent, type CookieChoice } from '@/domain/cookieConsent'

/**
 * P1-S-061 — cookie notice.
 *
 * Deliberately honest about the current state: the site sets nothing beyond
 * what signing in requires. The choice is recorded so that when analytics are
 * added they are already gated behind it.
 *
 * Rendered only after mount, because reading localStorage during SSR would
 * flash the banner at people who already answered.
 */
export function CookieNotice() {
  const [decided, setDecided] = useState(true)

  useEffect(() => {
    try {
      setDecided(parseConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY)) !== null)
    } catch {
      // Private browsing, or storage blocked. Ask again next time rather than
      // assuming an answer either way.
      setDecided(true)
    }
  }, [])

  function decide(analytics: CookieChoice) {
    try {
      window.localStorage.setItem(
        COOKIE_CONSENT_KEY,
        JSON.stringify({ analytics, decidedAt: new Date().toISOString() }),
      )
    } catch {
      // Nothing to do. The gate defaults to declined.
    }
    setDecided(true)
  }

  if (decided) return null

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-notice-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="cookie-notice-title" className="font-heading text-lg text-ink">
            Cookies on this site
          </p>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            We only store what the site needs to work, such as keeping staff signed in. We
            would also like to measure which pages are useful. You can say no and everything
            still works.{' '}
            <Link href="/legal/cookies" className="text-sea underline underline-offset-4">
              Read the cookie policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          {/* Decline is presented first and styled equally. Nudging toward
              accept is exactly the dark pattern regulators look for. */}
          <Button variant="secondary" onClick={() => decide('declined')}>
            No thanks
          </Button>
          <Button onClick={() => decide('accepted')}>Allow</Button>
        </div>
      </div>
    </div>
  )
}
