import { z } from 'zod'
import { CHANNELS } from '@/domain/consent'
import { toE164 } from '@/domain/mobile'

/**
 * P1-L-007 — the only door public data comes through.
 *
 * Mirrors CreateLeadInput in docs/plan/CONTRACTS.md. Anything not listed is
 * dropped: POPIA §minimality means the public form collects what the enquiry
 * needs and nothing more. In particular there is no ID number, no income and
 * no FICA document here — those are staff-initiated and arrive in P2.
 */

export const LEAD_INTENTS = [
  'cover_review',
  'medical_aid',
  'life',
  'income',
  'invest_ra',
  'insure',
  'bank',
  'claim',
  'service',
  'employer',
] as const

export const LEAD_SOURCES = [
  'web',
  'whatsapp',
  'phone',
  'referral',
  'ads',
  'review_campaign',
  'event',
] as const

export const createLeadSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Please tell us your first name.').max(80),
    lastName: z.string().trim().max(80).optional(),
    mobile: z
      .string()
      .trim()
      .min(1, 'We need a mobile number to reach you.')
      .transform((v, ctx) => {
        const e164 = toE164(v)
        if (!e164) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'That does not look like a South African mobile number.',
          })
          return z.NEVER
        }
        return e164
      }),
    email: z.string().trim().email('That email address does not look right.').optional().or(z.literal('').transform(() => undefined)),
    suburb: z.string().trim().max(120).optional(),
    intent: z.enum(LEAD_INTENTS, { errorMap: () => ({ message: 'Choose what you need help with.' }) }),
    message: z.string().trim().max(2000, 'Please keep this under 2000 characters.').optional(),
    existingDiscovery: z.boolean().optional(),
    adults: z.number().int().min(0).max(20).optional(),
    children: z.number().int().min(0).max(20).optional(),
    lifeEvents: z.array(z.string().trim().max(80)).max(10).default([]),

    // Consent. Two independent fields — never one checkbox.
    contactForEnquiry: z.literal(true, {
      errorMap: () => ({
        message: 'We need your permission to contact you about this enquiry.',
      }),
    }),
    marketing: z.boolean().default(false),
    channels: z.array(z.enum(CHANNELS)).default([]),

    source: z.enum(LEAD_SOURCES).default('web'),
  })
  .refine((v) => !v.marketing || v.channels.length > 0, {
    message: 'Choose at least one way for us to reach you.',
    path: ['channels'],
  })

export type CreateLeadParsed = z.output<typeof createLeadSchema>
