import { cache } from 'react'
import { prisma } from '@/server/db'
import type { OrganisationSettings } from '@prisma/client'

/**
 * P1-L-006 — the single organisation row.
 *
 * Legal name, FSP number, NCR number and the juristic representative wording
 * all live here rather than in code, because none of them are confirmed yet
 * (docs/product/CLIENT_ANSWERS.md) and they must be editable without a deploy.
 *
 * Cached per request. Returns null if the row is missing — callers decide
 * whether that is fatal. It is never invented.
 */
export const getOrganisationSettings = cache(
  async (): Promise<OrganisationSettings | null> => {
    try {
      return await prisma.organisationSettings.findFirst({ orderBy: { createdAt: 'asc' } })
    } catch {
      // A public page must still render if the database is unreachable. The
      // Disclaimer component surfaces the gap loudly in development.
      return null
    }
  },
)

/**
 * Click-to-chat link. P1 is human-answered — no bot (docs/plan/ARCHITECTURE.md).
 *
 * Returns null when no number is confirmed. We do not fall back to an env
 * placeholder: sending clients to an unverified number is worse than hiding
 * the button.
 */
export function whatsappHref(e164: string | null | undefined, prefill?: string): string | null {
  const digits = (e164 ?? '').replace(/\D/g, '')
  if (digits.length < 10) return null
  const query = prefill ? `?text=${encodeURIComponent(prefill)}` : ''
  return `https://wa.me/${digits}${query}`
}
