import type { Prisma, PrismaClient } from '@execuneed/db'
import { prisma } from '@execuneed/db'

type Db = PrismaClient | Prisma.TransactionClient

/**
 * Every write that touches a person leaves a row here.
 *
 * docs/compliance/RULES.md: "AuditEvent on lead create, consent change, login,
 * document access". Retention target is five years, so `meta` holds decisions
 * and references — never a copy of the personal data itself, which lives in
 * the entity row and is subject to deletion requests.
 */
export async function recordAudit(
  db: Db,
  event: {
    action: string
    entityType: string
    entityId: string
    actorId?: string | null
    meta?: Prisma.InputJsonValue
  },
) {
  return db.auditEvent.create({
    data: {
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId,
      actorId: event.actorId ?? null,
      meta: event.meta,
    },
  })
}

export const audit = (event: Parameters<typeof recordAudit>[1]) => recordAudit(prisma, event)
