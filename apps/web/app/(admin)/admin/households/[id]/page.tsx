import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@execuneed/db'
import { Card, CardTitle, CardBody, EmptyState, PageHeader } from '@execuneed/ui'
import { requireStaff } from '@/server/auth'

/** P1-S-029 — household stub. Products, documents and reviews arrive in P2/P3. */
export default async function HouseholdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireStaff()
  const { id } = await params

  const household = await prisma.household.findUnique({
    where: { id },
    include: {
      people: true,
      leads: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!household) notFound()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={household.label}
        actions={
          <Link href="/admin/leads" className="self-center text-navy underline underline-offset-4">
            Back to leads
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>People</CardTitle>
          <CardBody className="mt-3">
            {household.people.length === 0 ? (
              <EmptyState title="Nobody on this household yet." />
            ) : (
              <ul className="flex flex-col gap-3">
                {household.people.map((p) => (
                  <li key={p.id}>
                    <p>{[p.firstName, p.lastName].filter(Boolean).join(' ')}</p>
                    <p className="text-sm text-ink-muted">
                      {p.mobile}
                      {p.email ? ` · ${p.email}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Enquiries</CardTitle>
          <CardBody className="mt-3">
            {household.leads.length === 0 ? (
              <EmptyState title="No enquiries." />
            ) : (
              <ul className="flex flex-col gap-2">
                {household.leads.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="text-navy underline underline-offset-4"
                    >
                      {l.intent.replace(/_/g, ' ')}
                    </Link>
                    <span className="ml-2 text-sm text-ink-muted">score {l.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardTitle>Products, documents and reviews</CardTitle>
        <CardBody className="mt-2">
          Not in P1. The product inventory arrives with the pipeline in P2 and the
          document vault in P2/P3.
        </CardBody>
      </Card>
    </div>
  )
}
