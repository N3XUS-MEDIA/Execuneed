import { prisma } from '@execuneed/db'

/**
 * P1-L-016 — the morning digest for Wayne and Denise.
 *
 * No AI (docs/plan/DECISIONS.md: no model calls in P1). This is a database
 * query and a plain-text email. The "AI-suggested next action" from the
 * product plan is P2 and is deliberately absent.
 */

export type DigestData = {
  generatedAt: Date
  newLeads: Awaited<ReturnType<typeof recentLeads>>
  breachedSla: Awaited<ReturnType<typeof breachedSla>>
  openTasks: number
}

function recentLeads(since: Date) {
  return prisma.lead.findMany({
    where: { createdAt: { gte: since } },
    include: { person: { select: { firstName: true, lastName: true, suburb: true } } },
    orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
    take: 50,
  })
}

function breachedSla(now: Date) {
  return prisma.lead.findMany({
    where: { slaDueAt: { lt: now }, status: 'new' },
    include: { person: { select: { firstName: true, lastName: true } } },
    orderBy: { slaDueAt: 'asc' },
    take: 50,
  })
}

export async function collectDigest(now = new Date()): Promise<DigestData> {
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [newLeads, breached, openTasks] = await Promise.all([
    recentLeads(since),
    breachedSla(now),
    prisma.task.count({ where: { status: 'open' } }),
  ])

  return { generatedAt: now, newLeads, breachedSla: breached, openTasks }
}

/** Plain text on purpose. HTML is P2-S-044. */
export function renderDigest(d: DigestData): string {
  const name = (p: { firstName: string; lastName: string | null }) =>
    [p.firstName, p.lastName].filter(Boolean).join(' ')

  const lines: string[] = [
    `Execuneed — daily digest`,
    d.generatedAt.toISOString(),
    '',
    `New leads in the last 24 hours: ${d.newLeads.length}`,
  ]

  for (const lead of d.newLeads) {
    lines.push(
      `  · [${lead.score}] ${name(lead.person)} — ${lead.intent}` +
        (lead.person.suburb ? ` (${lead.person.suburb})` : ''),
    )
  }

  lines.push('', `Past SLA and still untouched: ${d.breachedSla.length}`)
  for (const lead of d.breachedSla) {
    lines.push(`  · ${name(lead.person)} — due ${lead.slaDueAt.toISOString()}`)
  }

  lines.push('', `Open tasks: ${d.openTasks}`)
  return lines.join('\n')
}

/**
 * Dry run by default. Sending is wired when the Resend key is present and the
 * recipients in CLIENT_ANSWERS.md are confirmed — both are still blank.
 */
export async function runDailyDigest({ send = false }: { send?: boolean } = {}) {
  const data = await collectDigest()
  const body = renderDigest(data)

  if (!send) return { sent: false as const, body }

  const to = (process.env.DIGEST_RECIPIENTS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (to.length === 0 || !process.env.RESEND_API_KEY) {
    return { sent: false as const, body, reason: 'No recipients or no API key configured.' }
  }

  // Transport lands with the queue in P2. Until then this refuses rather than
  // pretending to have sent something.
  return { sent: false as const, body, reason: 'Email transport arrives in P2.' }
}
