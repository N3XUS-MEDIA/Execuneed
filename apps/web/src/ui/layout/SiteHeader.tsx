import Link from 'next/link'
import { copy } from '@/content/copy'
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
 */
export function SiteHeader() {
  return (
    <header className="bg-navy text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-4">
        <Link href="/" aria-label="Execuneed home" className="flex items-center">
          <AnimatedWordmark width={190} />
        </Link>

        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[44px] items-center text-paper/75 transition-colors hover:text-paper"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
