'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@execuneed/db'
import type { LeadStatus } from '@/contracts/types'
import { requireStaff } from '@/server/auth'
import { recordAudit } from '@/server/audit'
import { isLeadStatus } from '@/domain/leads/status'

/**
 * P1-L-066 — the writes that make the inbox a working board rather than a
 * read-only list.
 *
 * Deliberately not a state machine. The pipeline in the product brief is
 * P2-L-036; pretending to enforce it now would either be wrong or would have
 * to be unpicked. P1 lets staff move a lead where the work actually went, and
 * records every move.
 */

export async function updateLeadStatusAction(input: {
  leadId: string
  status: string
  reason?: string
}) {
  const staff = await requireStaff()

  if (!isLeadStatus(input.status)) {
    return { ok: false as const, error: { code: 'VALIDATION' as const, message: 'Unknown status.' } }
  }

  const before = await prisma.lead.findUnique({
    where: { id: input.leadId },
    select: { status: true, householdId: true, personId: true },
  })
  if (!before) {
    return { ok: false as const, error: { code: 'NOT_FOUND' as const, message: 'Lead not found.' } }
  }
  if (before.status === input.status) {
    return { ok: true as const }
  }

  // A lost lead without a reason teaches the practice nothing. The brief asks
  // for loss reasons; there is no column for one in the P1 schema, so it is
  // captured on the timeline where it is still searchable and auditable.
  const reason = input.reason?.trim()
  if (input.status === 'lost' && !reason) {
    return {
      ok: false as const,
      error: {
        code: 'VALIDATION' as const,
        message: 'Please say why this was lost — price, inertia, went direct, not ready, competitor.',
      },
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.lead.update({ where: { id: input.leadId }, data: { status: input.status as LeadStatus } })

    await tx.interaction.create({
      data: {
        leadId: input.leadId,
        householdId: before.householdId,
        personId: before.personId,
        channel: 'system',
        direction: 'system',
        body: reason
          ? `Status changed from ${before.status} to ${input.status}. Reason: ${reason}`
          : `Status changed from ${before.status} to ${input.status}.`,
      },
    })

    await recordAudit(tx, {
      action: 'lead.status_changed',
      entityType: 'Lead',
      entityId: input.leadId,
      actorId: staff.id,
      meta: { from: before.status, to: input.status },
    })
  })

  revalidatePath(`/admin/leads/${input.leadId}`)
  revalidatePath('/admin/leads')
  return { ok: true as const }
}

export async function assignLeadAction(input: { leadId: string; assigneeId: string | null }) {
  const staff = await requireStaff()

  if (input.assigneeId) {
    const assignee = await prisma.user.findUnique({
      where: { id: input.assigneeId },
      select: { id: true, active: true, role: true },
    })
    // A lead parked on a deactivated account is a lead nobody is working.
    if (!assignee || !assignee.active || assignee.role === 'client') {
      return {
        ok: false as const,
        error: { code: 'VALIDATION' as const, message: 'That is not an active staff member.' },
      }
    }
  }

  await prisma.lead.update({
    where: { id: input.leadId },
    data: { assignedToId: input.assigneeId },
  })

  await recordAudit(prisma, {
    action: 'lead.assigned',
    entityType: 'Lead',
    entityId: input.leadId,
    actorId: staff.id,
    meta: { assigneeId: input.assigneeId },
  })

  revalidatePath(`/admin/leads/${input.leadId}`)
  revalidatePath('/admin/leads')
  return { ok: true as const }
}

/** Staff who can own a lead. Clients and deactivated accounts are excluded. */
export async function listAssignableStaffAction() {
  await requireStaff()

  return prisma.user.findMany({
    where: { active: true, role: { in: ['superadmin', 'compliance', 'adviser', 'admin'] } },
    select: { id: true, name: true, role: true },
    orderBy: { name: 'asc' },
  })
}
