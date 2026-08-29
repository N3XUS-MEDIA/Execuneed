import Link from 'next/link'
import { Disclaimer } from '@execuneed/ui'
import { Wordmark } from './Wordmark'
import type { OrganisationSettings } from '@execuneed/db'
import { copy } from '@/content/copy'

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
 * present. It comes from OrganisationSettings, never from a literal here.
 */
export function SiteFooter({ org }: { org: OrganisationSettings | null }) {
  return (
    <footer className="mt-24 bg-navy text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <Wordmark width={180} />
            <p className="mt-4 max-w-sm text-paper/70">{copy.contact.areas}</p>
            <p className="mt-4 text-paper/70">
              <a
                href={`tel:${copy.contact.phone.replace(/\s/g, '')}`}
                className="transition-colors hover:text-paper"
              >
                {org?.phoneDisplay ?? copy.contact.phone}
              </a>
              <span className="mx-2 text-paper/30">·</span>
              {copy.contact.hours}
            </p>
          </div>

          <nav aria-label="Legal">
            <ul className="flex flex-col gap-1">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/70 transition-colors hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-paper/15 pt-6">
          <Disclaimer text={org?.discoveryJuristicText} className="text-paper/60" />
          {org?.fspNumber ? (
            <p className="mt-2 text-sm text-paper/60">FSP {org.fspNumber}</p>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
