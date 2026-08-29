import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge, Card, CardTitle, CardBody, EmptyState, PageHeader } from '@execuneed/ui'
import { getLeadAction } from '@/server/leads/queries'
import { listAssignableStaffAction } from '@/server/leads/mutations'
import { ConsentBadge, ScoreBadge, SlaBadge } from '@/ui/admin/LeadBadges'
import { LeadWorkflow } from '@/ui/admin/LeadWorkflow'

const sast = (d: Date) =>
  d.toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

/** P1-S-028 — the lead file: fields, consent record, timeline, tasks. */
export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [lead, staff] = await Promise.all([getLeadAction(id), listAssignableStaffAction()])
  if (!lead) notFound()

  const name = [lead.person.firstName, lead.person.lastName].filter(Boolean).join(' ')
  const consent = lead.consents[0]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={name}
        lede={lead.person.mobile}
        actions={
          <Link href="/admin/leads" className="self-center text-navy underline underline-offset-4">
            Back to leads
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2">
        <ScoreBadge score={lead.score} />
        <ConsentBadge marketing={consent?.marketing ?? false} />
        <SlaBadge dueAt={lead.slaDueAt} status={lead.status} />
        <Badge>{lead.status.replace(/_/g, ' ')}</Badge>
        {lead.assignedTo ? <Badge tone="sea">{lead.assignedTo.name}</Badge> : null}
      </div>

      <LeadWorkflow
        leadId={lead.id}
        status={lead.status}
        assigneeId={lead.assignedToId}
        staff={staff}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Enquiry</CardTitle>
          <CardBody className="mt-3">
            <dl className="grid grid-cols-[10rem_1fr] gap-y-2">
              <dt className="text-ink-muted">Intent</dt>
              <dd>{lead.intent.replace(/_/g, ' ')}</dd>
              <dt className="text-ink-muted">Source</dt>
              <dd>{lead.source}</dd>
              <dt className="text-ink-muted">Email</dt>
              <dd>{lead.person.email ?? '—'}</dd>
              <dt className="text-ink-muted">Suburb</dt>
              <dd>{lead.person.suburb ?? '—'}</dd>
              <dt className="text-ink-muted">Existing Discovery</dt>
              <dd>
                {lead.existingDiscovery === null
                  ? 'Not answered'
                  : lead.existingDiscovery
                    ? 'Yes'
                    : 'No'}
              </dd>
              <dt className="text-ink-muted">Children</dt>
              <dd>{lead.children ?? '—'}</dd>
              <dt className="text-ink-muted">Life events</dt>
              <dd>{lead.lifeEvents.length ? lead.lifeEvents.join(', ') : '—'}</dd>
              <dt className="text-ink-muted">SLA due</dt>
              <dd>{sast(lead.slaDueAt)}</dd>
              <dt className="text-ink-muted">Household</dt>
              <dd>
                {lead.household ? (
                  <Link
                    href={`/admin/households/${lead.household.id}`}
                    className="text-navy underline underline-offset-4"
                  >
                    {lead.household.label}
                  </Link>
                ) : (
                  '—'
                )}
              </dd>
            </dl>
            {lead.message ? (
              <p className="mt-4 whitespace-pre-wrap rounded-md bg-sand/30 p-3">{lead.message}</p>
            ) : null}
          </CardBody>
        </Card>

        {/*
          The consent record, shown verbatim. What was ticked decides what the
          practice may lawfully send, so it is never summarised or inferred.
        */}
        <Card>
          <CardTitle>Consent</CardTitle>
          <CardBody className="mt-3">
            {consent ? (
              <dl className="grid grid-cols-[10rem_1fr] gap-y-2">
                <dt className="text-ink-muted">Enquiry contact</dt>
                <dd>{consent.contactForEnquiry ? 'Given' : 'Not given'}</dd>
                <dt className="text-ink-muted">Marketing</dt>
                <dd>{consent.marketing ? 'Opted in' : 'Not given'}</dd>
                <dt className="text-ink-muted">Channels</dt>
                <dd>{consent.channels.length ? consent.channels.join(', ') : '—'}</dd>
                <dt className="text-ink-muted">Captured</dt>
                <dd>{sast(consent.capturedAt)}</dd>
                <dt className="text-ink-muted">Captured via</dt>
                <dd>{consent.source}</dd>
              </dl>
            ) : (
              <p className="text-danger">
                No consent record. Do not contact until this is resolved.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardTitle>Timeline</CardTitle>
        <CardBody className="mt-3">
          {lead.interactions.length === 0 ? (
            <EmptyState title="Nothing recorded yet." />
          ) : (
            <ol className="flex flex-col gap-4">
              {lead.interactions.map((i) => (
                <li key={i.id} className="border-l-2 border-line pl-4">
                  <p className="text-sm text-ink-muted">
                    {sast(i.createdAt)} · {i.channel} · {i.direction}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-ink">{i.body}</p>
                </li>
              ))}
            </ol>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Tasks</CardTitle>
        <CardBody className="mt-3">
          {lead.tasks.length === 0 ? (
            <EmptyState title="No tasks on this lead." />
          ) : (
            <ul className="flex flex-col gap-2">
              {lead.tasks.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4">
                  <span className={t.status === 'done' ? 'text-ink-muted line-through' : ''}>
                    {t.title}
                  </span>
                  <Badge tone={t.status === 'done' ? 'ok' : 'neutral'}>{t.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
