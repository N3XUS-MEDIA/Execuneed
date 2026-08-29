import { Badge } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { HIGH_PRIORITY_SCORE } from '@/domain/leads/sla'

/** Score drives the SLA, so the badge shows which side of the line it fell. */
export function ScoreBadge({ score }: { score: number }) {
  const high = score >= HIGH_PRIORITY_SCORE
  return (
    <Badge tone={high ? 'sea' : 'neutral'} title={high ? '15 minute SLA' : 'Four business hours'}>
      {score}
    </Badge>
  )
}

/**
 * P1 live-done requires Denise to see at a glance whether marketing consent
 * was given. Getting this wrong is a POPIA problem, so it is never inferred —
 * it renders exactly what was stored.
 */
export function ConsentBadge({ marketing }: { marketing: boolean }) {
  return (
    <Badge tone={marketing ? 'ok' : 'neutral'}>
      {marketing ? copy.admin.consentMarketingYes : copy.admin.consentMarketingNo}
    </Badge>
  )
}

export function SlaBadge({ dueAt, status }: { dueAt: Date; status: string }) {
  if (status !== 'new') return null
  const overdue = dueAt.getTime() < Date.now()
  return (
    <Badge tone={overdue ? 'danger' : 'neutral'}>
      {overdue ? 'Past SLA' : `Due ${dueAt.toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', dateStyle: 'short', timeStyle: 'short' })}`}
    </Badge>
  )
}
