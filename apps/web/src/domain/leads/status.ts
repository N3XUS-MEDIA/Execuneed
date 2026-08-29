import type { LeadStatus } from '@/contracts/types'

/**
 * The P1 lead statuses, in the order work actually moves through them.
 *
 * Lives here rather than in a `'use server'` module — those may only export
 * async functions — and rather than being restated per page, so the inbox
 * filter and the workflow control cannot drift apart.
 *
 * This is a list, not a state machine. The pipeline with enforced transitions
 * is P2-L-036.
 */
export const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'qualified',
  'booked',
  'advice_in_progress',
  'submitted',
  'won',
  'lost',
  'nurture',
]

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUSES as string[]).includes(v)
}

/** "advice_in_progress" reads badly in a table. */
export function leadStatusLabel(status: string): string {
  return status.replace(/_/g, ' ')
}
