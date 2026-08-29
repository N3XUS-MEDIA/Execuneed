import Link from 'next/link'
import { copy } from '@/content/copy'

const links = [
  { href: '/how-we-work', label: copy.nav.how },
  { href: '/services', label: copy.nav.services },
  { href: '/cover-review', label: copy.nav.review },
  { href: '/contact', label: copy.nav.contact },
]

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="font-heading text-2xl text-ink">
          {copy.brand.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[44px] items-center text-ink-muted hover:text-ink"
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
