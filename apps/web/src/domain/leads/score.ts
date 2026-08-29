import type { LeadIntent } from '../../contracts/types'

const CAPE_TOWN_HINTS = [
  'century city',
  'melkbosstrand',
  'melkbos',
  'table view',
  'blouberg',
  'atlantic beach',
  'milnerton',
  'sea point',
  'camps bay',
  'claremont',
  'rondebosch',
  'durbanville',
  'bellville',
  'somerset west',
  'stellenbosch',
  'cape town',
]

export function scoreLead(input: {
  intent: LeadIntent
  existingDiscovery: boolean | null
  lifeEvents: string[]
  children: number | null
  bookedBySelf?: boolean
  suburb?: string | null
}): number {
  let score = 0
  if (input.intent === 'cover_review') score += 3
  if (input.existingDiscovery === true) score += 3
  if (input.lifeEvents.length > 0) score += 2
  if ((input.children ?? 0) > 0) score += 2
  if (input.intent === 'employer') score += 2
  if (input.bookedBySelf) score += 2
  const suburb = (input.suburb ?? '').toLowerCase()
  if (suburb && CAPE_TOWN_HINTS.some((h) => suburb.includes(h))) score += 1
  if (input.intent === 'claim' || input.intent === 'service') score -= 2
  return Math.max(0, Math.min(20, score))
}
