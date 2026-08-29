import Link from 'next/link'
import { Card, EmptyState, Input, PageHeader, Select } from '@execuneed/ui'
import { copy } from '@/content/copy'
import { listLeadsAction } from '@/server/leads/queries'
import type { LeadStatus } from '@/contracts/types'
import { ConsentBadge, ScoreBadge, SlaBadge } from '@/ui/admin/LeadBadges'
import { LEAD_STATUSES, isLeadStatus, leadStatusLabel } from '@/domain/leads/status'

/**
 * P1-S-027 — the leads inbox.
 *
 * Ordered highest score then oldest SLA by the query, which is the order the
 * practice should work in rather than newest-first.
 */
export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams
  const validStatus: LeadStatus | undefined = isLeadStatus(status) ? status : undefined

  const leads = await listLeadsAction({ q, status: validStatus })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={copy.admin.leads} />

      <form className="flex flex-wrap items-end gap-3" role="search">
        <div className="flex min-w-56 flex-1 flex-col gap-1.5">
          <label htmlFor="q" className="text-sm text-ink-muted">
            Search name, mobile, email or suburb
          </label>
          <Input id="q" name="q" defaultValue={q ?? ''} type="search" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm text-ink-muted">
            Status
          </label>
          <Select id="status" name="status" defaultValue={validStatus ?? ''}>
            <option value="">All</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {leadStatusLabel(s)}
              </option>
            ))}
          </Select>
        </div>
        <button
          type="submit"
          className="min-h-[44px] rounded-md bg-navy px-4 text-paper"
        >
          Filter
        </button>
      </form>

      {leads.length === 0 ? (
        <EmptyState title={copy.admin.emptyLeads} />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">
              Leads, highest score first then oldest SLA
            </caption>
            <thead>
              <tr className="border-b border-line text-sm text-ink-muted">
                <th scope="col" className="p-3 font-medium">Score</th>
                <th scope="col" className="p-3 font-medium">Name</th>
                <th scope="col" className="p-3 font-medium">Intent</th>
                <th scope="col" className="p-3 font-medium">Suburb</th>
                <th scope="col" className="p-3 font-medium">Consent</th>
                <th scope="col" className="p-3 font-medium">SLA</th>
                <th scope="col" className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const consent = lead.consents[0]
                return (
                  <tr key={lead.id} className="border-b border-line last:border-0">
                    <td className="p-3">
                      <ScoreBadge score={lead.score} />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-navy underline underline-offset-4"
                      >
                        {[lead.person.firstName, lead.person.lastName].filter(Boolean).join(' ')}
                      </Link>
                      <p className="text-sm text-ink-muted">{lead.person.mobile}</p>
                    </td>
                    <td className="p-3">{leadStatusLabel(lead.intent)}</td>
                    <td className="p-3 text-ink-muted">{lead.person.suburb ?? '—'}</td>
                    <td className="p-3">
                      <ConsentBadge marketing={consent?.marketing ?? false} />
                    </td>
                    <td className="p-3">
                      <SlaBadge dueAt={lead.slaDueAt} status={lead.status} />
                    </td>
                    <td className="p-3 text-ink-muted">{leadStatusLabel(lead.status)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
