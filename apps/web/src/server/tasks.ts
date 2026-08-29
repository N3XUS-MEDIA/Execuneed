'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@execuneed/db'
import { requireStaff } from '@/server/auth'

/** P1-L-015 — tasks against a lead or a household. */
export async function createTaskAction(input: {
  title: string
  leadId?: string | null
  householdId?: string | null
  dueAt?: Date | null
  assigneeId?: string | null
}) {
  const staff = await requireStaff()

  const title = input.title.trim()
  if (!title) {
    return { ok: false as const, error: { code: 'VALIDATION' as const, message: 'Task needs a title.' } }
  }

  const task = await prisma.task.create({
    data: {
      title,
      leadId: input.leadId ?? null,
      householdId: input.householdId ?? null,
      dueAt: input.dueAt ?? null,
      assigneeId: input.assigneeId ?? staff.id,
    },
  })

  revalidatePath('/admin/tasks')
  if (input.leadId) revalidatePath(`/admin/leads/${input.leadId}`)

  return { ok: true as const, data: task }
}

/**
 * Idempotent by requirement: completing an already-complete task is a no-op,
 * not an error. Two people clicking the same button is a normal Tuesday.
 */
export async function completeTaskAction(id: string): Promise<void> {
  const staff = await requireStaff()

  const { count } = await prisma.task.updateMany({
    where: { id, status: 'open' },
    data: { status: 'done' },
  })

  if (count === 0) return

  await prisma.auditEvent.create({
    data: {
      action: 'task.completed',
      entityType: 'Task',
      entityId: id,
      actorId: staff.id,
    },
  })

  revalidatePath('/admin/tasks')
}

/** P1-S-064 — the task board. Open work first, oldest due date at the top. */
export async function listTasksAction() {
  await requireStaff()

  return prisma.task.findMany({
    include: {
      assignee: { select: { id: true, name: true } },
      lead: { include: { person: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: [{ status: 'asc' }, { dueAt: 'asc' }, { createdAt: 'asc' }],
    take: 200,
  })
}

export type TaskListItem = Awaited<ReturnType<typeof listTasksAction>>[number]
