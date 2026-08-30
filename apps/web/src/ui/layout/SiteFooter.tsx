import Link from 'next/link'
import { Disclaimer } from '@execuneed/ui'
import { Wordmark } from './Wordmark'
import type { OrganisationSettings } from '@prisma/client'
import { copy } from '@/content/copy'
import { Container } from './Container'

const siteLinks = [
  { href: '/how-we-work', label: copy.nav.how },
  { href: '/services', label: copy.nav.services },
  { href: '/cover-review', label: copy.nav.review },
  { href: '/contact', label: copy.nav.contact },
]

const legalLinks = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/paia', label: 'PAIA' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/complaints', label: 'Complaints' },
  { href: '/legal/conflict-of-interest', label: 'Conflict of interest' },
  { href: '/legal/disclosures', label: 'Disclosures' },
  { href: '/legal/cookies', label: 'Cookies' },
]

/**
 * P0-S-002 / P1-L-006 — the disclaimer slot.
 *
 * Discovery's GC/DFP rules require the juristic representative wording to be
 * present. It comes from OrganisationSettings, never from a literal here, and
 * while the practice's approved wording is unknown the slot renders nothing at
 * all in production. That is deliberate.
 */
export function SiteFooter({ org }: { org: OrganisationSettings | null }) {
  const tel = copy.contact.phone.replace(/\s/g, '')

  return (
    <footer className="bg-navy text-paper">
      <Container width="wide">
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
          <div className="lg:col-span-2 lg:pr-12">
            <Wordmark width={180} className="max-w-[180px]" />
            <p className="mt-5 max-w-sm leading-relaxed text-paper/70">{copy.brand.tagline}</p>
            <a
              href={`tel:${tel}`}
              className="mt-6 inline-flex min-h-[44px] items-center font-heading text-2xl font-semibold tracking-tight text-paper transition-opacity hover:opacity-80"
            >
              {org?.phoneDisplay ?? copy.contact.phone}
            </a>
            <p className="text-sm text-paper/60">{copy.contact.hours}</p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow-on-navy">Site</p>
            <ul className="mt-4 flex flex-col">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex min-h-[44px] items-center text-paper/70 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <p className="eyebrow-on-navy">Legal</p>
            <ul className="mt-4 flex flex-col">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex min-h-[44px] items-center text-paper/70 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-paper/15 py-8">
          <p className="text-sm text-paper/60">
            {copy.contact.addressCentury}
            <span className="mx-2 text-paper/25">·</span>
            {copy.contact.addressMelkbos}
          </p>

          <div className="mt-4 max-w-3xl">
            <Disclaimer text={org?.discoveryJuristicText} className="text-paper/60" />
            {org?.fspNumber || org?.ncrNumber ? (
              <p className="mt-2 text-sm text-paper/60">
                {org.fspNumber ? `FSP ${org.fspNumber}` : null}
                {org.fspNumber && org.ncrNumber ? ' · ' : null}
                {org.ncrNumber ? `NCR ${org.ncrNumber}` : null}
              </p>
            ) : null}
          </div>

          <p className="mt-6 text-sm text-paper/60">
            © {new Date().getFullYear()} {org?.tradingName ?? copy.brand.name}. This website
            provides general information. It is not financial advice, and nothing on it is a
            recommendation.
          </p>
        </div>
      </Container>
    </footer>
  )
}
