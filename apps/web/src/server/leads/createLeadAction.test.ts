import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@execuneed/db'
import { createLeadAction } from './createLeadAction'

/**
 * P1-L-007 integration. Runs against the database in DATABASE_URL and skips
 * when there is none, so CI stays green without a Postgres service.
 *
 * The consent cases here are the ones DEFINITION_OF_DONE.md calls
 * "never done" if they regress.
 */
const hasDb = Boolean(process.env.DATABASE_URL)
const d = hasDb ? describe : describe.skip

const valid = {
  firstName: 'Thandi',
  lastName: 'Nkosi',
  mobile: '082 123 4567',
  email: 'thandi@example.com',
  suburb: 'Century City',
  intent: 'cover_review',
  message: 'We had a baby in March and I have not looked at cover since.',
  existingDiscovery: true,
  children: 1,
  lifeEvents: ['new baby'],
  contactForEnquiry: true as const,
  marketing: false,
  channels: [],
}

async function wipe() {
  await prisma.auditEvent.deleteMany()
  await prisma.interaction.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.task.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.person.deleteMany()
  await prisma.household.deleteMany()
}

d('createLeadAction', () => {
  beforeEach(wipe)
  afterAll(async () => {
    await wipe()
    await prisma.$disconnect()
  })

  it('writes person, household, lead, consent, interaction and audit together', async () => {
    const res = await createLeadAction(valid)
    expect(res.ok).toBe(true)
    if (!res.ok) return

    const lead = await prisma.lead.findUniqueOrThrow({
      where: { id: res.data.leadId },
      include: { person: true, household: true, consents: true, interactions: true },
    })

    expect(lead.person.firstName).toBe('Thandi')
    expect(lead.household?.label).toBe('Nkosi household')
    expect(lead.interactions).toHaveLength(1)
    expect(lead.consents).toHaveLength(1)

    const auditRow = await prisma.auditEvent.findFirst({
      where: { entityId: lead.id, action: 'lead.created' },
    })
    expect(auditRow).not.toBeNull()
  })

  it('stores the mobile number in E.164', async () => {
    const res = await createLeadAction(valid)
    expect(res.ok).toBe(true)
    if (!res.ok) return
    const person = await prisma.person.findUniqueOrThrow({ where: { id: res.data.personId } })
    expect(person.mobile).toBe('+27821234567')
  })

  it('scores and sets an SLA', async () => {
    const res = await createLeadAction(valid)
    expect(res.ok).toBe(true)
    if (!res.ok) return
    // 3 review + 3 existing Discovery + 2 life event + 2 children + 1 metro
    expect(res.data.score).toBe(11)

    const lead = await prisma.lead.findUniqueOrThrow({ where: { id: res.data.leadId } })
    expect(lead.slaDueAt.getTime()).toBeGreaterThan(0)
    expect(lead.status).toBe('new')
  })

  it('persists marketing = false when it was not given', async () => {
    const res = await createLeadAction(valid)
    expect(res.ok).toBe(true)
    if (!res.ok) return
    const consent = await prisma.consent.findFirstOrThrow({ where: { leadId: res.data.leadId } })
    expect(consent.contactForEnquiry).toBe(true)
    expect(consent.marketing).toBe(false)
    expect(consent.channels).toEqual([])
  })

  it('persists marketing = true with the chosen channels', async () => {
    const res = await createLeadAction({
      ...valid,
      marketing: true,
      channels: ['whatsapp', 'email'],
    })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    const consent = await prisma.consent.findFirstOrThrow({ where: { leadId: res.data.leadId } })
    expect(consent.marketing).toBe(true)
    expect(consent.channels).toEqual(['whatsapp', 'email'])
  })

  it('drops channels that arrive without a marketing opt-in', async () => {
    const res = await createLeadAction({ ...valid, marketing: false, channels: ['email'] })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    const consent = await prisma.consent.findFirstOrThrow({ where: { leadId: res.data.leadId } })
    expect(consent.channels).toEqual([])
  })

  it('rejects a submission without enquiry consent, and writes nothing', async () => {
    const res = await createLeadAction({ ...valid, contactForEnquiry: false })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.error.code).toBe('VALIDATION')
    expect(res.error.fields).toHaveProperty('contactForEnquiry')
    expect(await prisma.lead.count()).toBe(0)
    expect(await prisma.person.count()).toBe(0)
  })

  it('rejects a marketing opt-in with no channel', async () => {
    const res = await createLeadAction({ ...valid, marketing: true, channels: [] })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.error.fields).toHaveProperty('channels')
    expect(await prisma.lead.count()).toBe(0)
  })

  it('rejects a landline in the mobile field', async () => {
    const res = await createLeadAction({ ...valid, mobile: '021 552 8989' })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.error.fields).toHaveProperty('mobile')
  })

  it('rejects a message over the 2000 character limit', async () => {
    const res = await createLeadAction({ ...valid, message: 'x'.repeat(2001) })
    expect(res.ok).toBe(false)
    if (res.ok) return
    expect(res.error.fields).toHaveProperty('message')
  })

  it('ignores fields the public form has no business collecting', async () => {
    const res = await createLeadAction({ ...valid, idNumber: '9001015800088', score: 99 })
    expect(res.ok).toBe(true)
    if (!res.ok) return
    // The score is computed server side, never accepted from the client.
    expect(res.data.score).toBe(11)
  })
})
