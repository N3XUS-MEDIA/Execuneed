import * as React from 'react'
import { cn } from '../cn'

/**
 * The juristic representative disclaimer. Text comes from
 * `OrganisationSettings.discoveryJuristicText` — never hardcoded, because the
 * legal entity, FSP number and NCR number are still unconfirmed
 * (docs/product/CLIENT_ANSWERS.md).
 *
 * Discovery's GC/DFP rules require this on the homepage. It renders in the
 * public footer on every page.
 */
export function Disclaimer({
  text,
  className,
}: {
  text: string | null | undefined
  className?: string
}) {
  if (!text || text.trim().length === 0) {
    // Visible in development so a missing disclaimer cannot ship silently.
    if (process.env.NODE_ENV === 'production') return null
    return (
      <p className={cn('text-sm text-danger', className)} data-testid="disclaimer-missing">
        Disclaimer missing: OrganisationSettings.discoveryJuristicText is empty.
      </p>
    )
  }

  return (
    <p className={cn('text-sm leading-relaxed text-ink-muted', className)}>{text}</p>
  )
}
