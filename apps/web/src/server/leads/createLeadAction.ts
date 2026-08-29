'use server'

import { prisma } from '@/server/db'
import { clientIp } from '@/server/clientIp'
import { LEAD_CAPTURE_LIMIT, rateLimit } from '@/server/rateLimit'
import { scoreLead } from '@/domain/leads/score'
import { slaDueAt } from '@/domain/leads/sla'
import { normaliseConsent } from '@/domain/consent'
import { householdLabel } from '@/domain/households'
import { recordAudit } from '@/server/audit'
import { ActionFailure, actionError, logActionError } from '@/server/log'
import { createLeadSchema } from './schema'
import type { ActionError, CreateLeadResult } from '@/contracts/types'

export type CreateLeadOutcome =
  | { ok: true; data: CreateLeadResult }
  | { ok: false; error: ActionError }

/**
 * P1-L-007 — the public lead capture.
 *
 * Person, Household, Lead, Consent and the audit row are written in one
 * transaction. A lead without its consent record is not a lead we are allowed
 * to act on, so they succeed or fail together.
 *
 * This action gives no advice, quotes no premium and recommends no product.
 * It records what someone asked for and when a human must respond.
 *
 * It is also the only unauthenticated write in the app, so it is rate limited
 * and honeypotted. Junk in the inbox buries real enquiries, which costs the
 * practice more than downtime would.
 */
export async function createLeadAction(input: unknown): Promise<CreateLeadOutcome> {
  try {
    const ip = await clientIp()
    const limit = await rateLimit(`lead:${ip}`, LEAD_CAPTURE_LIMIT)
    if (!limit.ok) {
      throw new ActionFailure(
        actionError(
          'CONFLICT',
          'That is a few enquiries in a short time. Please give it a few minutes, or call us on 021 552 8989.',
        ),
      )
    }

    const parsed = createLeadSchema.safeParse(input)

    if (!parsed.success) {
      const fields: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path.join('.') || 'form'
        fields[key] ??= issue.message
      }
      throw new ActionFailure(
        actionError('VALIDATION', 'Please check the highlighted fields.', fields),
      )
    }

    const v = parsed.data

    // Honeypot tripped. Report success so the bot does not learn to adapt, and
    // write nothing.
    if (v.website && v.website.trim().length > 0) {
      return { ok: true, data: { leadId: 'discarded', personId: 'discarded', score: 0 } }
    }

    const consent = normaliseConsent({
      contactForEnquiry: v.contactForEnquiry,
      marketing: v.marketing,
      channels: v.channels,
    })

    // Belt and braces: the schema already demands literal true, but a lead
    // written without enquiry consent would be a POPIA breach, so it is
    // checked again at the point of the write.
    if (!consent.contactForEnquiry) {
      throw new ActionFailure(
        actionError('VALIDATION', 'We need your permission to contact you about this enquiry.', {
          contactForEnquiry: 'Required',
        }),
      )
    }

    const score = scoreLead({
      intent: v.intent,
      existingDiscovery: v.existingDiscovery ?? null,
      lifeEvents: v.lifeEvents,
      children: v.children ?? null,
      suburb: v.suburb ?? null,
    })

    const result = await prisma.$transaction(async (tx) => {
      const household = await tx.household.create({
        data: { label: householdLabel({ firstName: v.firstName, lastName: v.lastName }) },
      })

      const person = await tx.person.create({
        data: {
          householdId: household.id,
          firstName: v.firstName,
          lastName: v.lastName ?? null,
          mobile: v.mobile,
          email: v.email ?? null,
          suburb: v.suburb ?? null,
        },
      })

      const lead = await tx.lead.create({
        data: {
          personId: person.id,
          householdId: household.id,
          source: v.source,
          intent: v.intent,
          status: 'new',
          message: v.message ?? null,
          lifeEvents: v.lifeEvents,
          existingDiscovery: v.existingDiscovery ?? null,
          adults: v.adults ?? null,
          children: v.children ?? null,
          score,
          slaDueAt: slaDueAt(score),
        },
      })

      await tx.consent.create({
        data: {
          personId: person.id,
          leadId: lead.id,
          contactForEnquiry: consent.contactForEnquiry,
          marketing: consent.marketing,
          channels: consent.channels,
          source: `web:${v.source}`,
        },
      })

      await tx.interaction.create({
        data: {
          leadId: lead.id,
          householdId: household.id,
          personId: person.id,
          channel: 'web',
          direction: 'inbound',
          body: v.message?.trim()
            ? `Enquiry via website (${v.intent}): ${v.message.trim()}`
            : `Enquiry via website (${v.intent}).`,
        },
      })

      await recordAudit(tx, {
        action: 'lead.created',
        entityType: 'Lead',
        entityId: lead.id,
        // References and decisions, not a second copy of the personal data.
        meta: {
          source: v.source,
          intent: v.intent,
          score,
          marketingConsent: consent.marketing,
          consentChannels: consent.channels,
          slaDueAt: lead.slaDueAt.toISOString(),
        },
      })

      return { leadId: lead.id, personId: person.id, score }
    })

    return { ok: true, data: result }
  } catch (error) {
    return { ok: false, error: logActionError('createLeadAction', error) }
  }
}
