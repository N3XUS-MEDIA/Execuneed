'use server'

import { prisma } from '@execuneed/db'
import type { LeadStatus } from '@/contracts/types'
import { requireStaff } from '@/server/auth'
import { recordAudit } from '@/server/audit'

/**
 * P1-L-010 — every admin read goes through requireStaff first.
 *
 * The middleware gate protects the route; this protects the data. A server
 * action is callable directly over the wire, so route protection alone is not
 * protection.
 */

export async function listLeadsAction(filter: { status?: LeadStatus; q?: string } = {}) {
  await requireStaff()

  const q = filter.q?.trim()

  return prisma.lead.findMany({
    where: {
      status: filter.status,
      ...(q
        ? {
            person: {
              OR: [
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { mobile: { contains: q } },
                { email: { contains: q, mode: 'insensitive' } },
                { suburb: { contains: q, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    },
    include: {
      person: true,
      consents: { orderBy: { capturedAt: 'desc' }, take: 1 },
      assignedTo: { select: { id: true, name: true } },
    },
    // Highest score first, then oldest SLA — the order Denise should work in.
    orderBy: [{ score: 'desc' }, { slaDueAt: 'asc' }],
    take: 200,
  })
}

export async function getLeadAction(id: string) {
  const staff = await requireStaff()

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      person: true,
      household: true,
      consents: { orderBy: { capturedAt: 'desc' } },
      tasks: { orderBy: [{ status: 'asc' }, { dueAt: 'asc' }] },
      interactions: { orderBy: { createdAt: 'asc' } },
      assignedTo: { select: { id: true, name: true } },
    },
  })

  if (!lead) return null

  // Opening a client file is itself an event worth keeping.
  await recordAudit(prisma, {
    action: 'lead.viewed',
    entityType: 'Lead',
    entityId: lead.id,
    actorId: staff.id,
  })

  return lead
}

export type LeadListItem = Awaited<ReturnType<typeof listLeadsAction>>[number]
export type LeadDetail = NonNullable<Awaited<ReturnType<typeof getLeadAction>>>
