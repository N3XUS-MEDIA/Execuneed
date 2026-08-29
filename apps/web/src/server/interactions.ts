'use server'

import { prisma } from '@execuneed/db'
import type { InteractionDirection } from '@/contracts/types'
import { requireStaff } from '@/server/auth'

/**
 * P1-L-012 — the timeline.
 *
 * "If it's not in the system it didn't happen." WhatsApp threads, calls and
 * meetings all land here eventually (P2); P1 covers web enquiries and notes a
 * staff member adds by hand.
 */
export async function addInteractionAction(input: {
  leadId?: string | null
  householdId?: string | null
  personId?: string | null
  channel: string
  direction: InteractionDirection
  body: string
}) {
  const staff = await requireStaff()

  const body = input.body.trim()
  if (!body) {
    return { ok: false as const, error: { code: 'VALIDATION' as const, message: 'Empty note.' } }
  }

  const interaction = await prisma.interaction.create({
    data: {
      leadId: input.leadId ?? null,
      householdId: input.householdId ?? null,
      personId: input.personId ?? null,
      channel: input.channel,
      direction: input.direction,
      body,
    },
  })

  await prisma.auditEvent.create({
    data: {
      action: 'interaction.created',
      entityType: 'Interaction',
      entityId: interaction.id,
      actorId: staff.id,
      meta: { channel: input.channel, direction: input.direction, leadId: input.leadId ?? null },
    },
  })

  return { ok: true as const, data: interaction }
}
