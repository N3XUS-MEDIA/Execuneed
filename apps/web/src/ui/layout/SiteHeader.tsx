'use client'

import { useEffect, useId, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, cn } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { Container } from './Container'
import { AnimatedWordmark } from './AnimatedWordmark'

const links = [
  { href: '/how-we-work', label: copy.nav.how },
  { href: '/services', label: copy.nav.services },
  { href: '/cover-review', label: copy.nav.review },
  { href: '/contact', label: copy.nav.contact },
]

/**
 * Navy bar. The wordmark is white on navy, so the header carries the brand
 * ground rather than sitting the logo on paper.
 *
 * The wordmark here is the animated one. It plays once per session on first
 * load and then rests as the static logo, so the animation is seen without
 * being a splash screen and without a second wordmark competing with it
 * further down the page.
 *
 * Below `lg` the four links previously wrapped onto a second row under the
 * logo, which pushed the hero down and read as a mistake. They now collapse
 * into a disclosure with 56px rows.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  // A menu left open across a navigation covers the page it just moved to.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 bg-navy text-paper">
      <Container width="wide">
        <div className="flex items-center justify-between gap-8 py-4">
          <Link
            href="/"
            aria-label="Execuneed home"
            className="flex min-h-[44px] items-center"
          >
            <AnimatedWordmark width={190} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-x-8">
              {links.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex min-h-[44px] items-center border-b-2 pt-0.5 transition-colors',
                        active
                          ? 'border-paper/70 text-paper'
                          : 'border-transparent text-paper/75 hover:text-paper',
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Button asChild variant="secondary">
              <Link href="/cover-review">Book a review</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="-mr-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-paper lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="size-6"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />}
            </svg>
          </button>
        </div>
      </Container>

      <div id={panelId} hidden={!open} className="border-t border-paper/15 lg:hidden">
        <Container width="wide">
          <nav aria-label="Primary" className="pb-5 pt-2">
            <ul className="flex flex-col divide-y divide-paper/10">
              {links.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`)
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex min-h-[56px] items-center text-lg',
                        active ? 'text-paper' : 'text-paper/75',
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Button asChild variant="secondary" size="lg" className="mt-5 w-full">
              <Link href="/cover-review">{copy.cta.review}</Link>
            </Button>
          </nav>
        </Container>
      </div>
    </header>
  )
}
