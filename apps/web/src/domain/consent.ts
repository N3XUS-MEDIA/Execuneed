import { z } from 'zod'
import type { Channel } from '../contracts/types'

/**
 * P1-L-008 — consent.
 *
 * POPIA treats handling an enquiry and sending direct marketing as two
 * different purposes with two different lawful bases. They are therefore two
 * fields, captured by two checkboxes, and they are never combined. A submit
 * button is not consent to market.
 *
 * docs/compliance/RULES.md §POPIA.
 */

export const CHANNELS = ['whatsapp', 'email', 'phone'] as const

export const consentSchema = z
  .object({
    // Literal true, not boolean: an unticked box must fail validation rather
    // than quietly persist as false.
    contactForEnquiry: z.literal(true, {
      errorMap: () => ({ message: 'We need your permission to contact you about this enquiry.' }),
    }),
    marketing: z.boolean().default(false),
    channels: z.array(z.enum(CHANNELS)).default([]),
  })
  .refine((v) => !v.marketing || v.channels.length > 0, {
    message: 'Choose at least one way for us to reach you.',
    path: ['channels'],
  })

export type ConsentInput = z.input<typeof consentSchema>

/**
 * Channels are only meaningful alongside a marketing opt-in. Storing them
 * without one would leave a record implying a permission that was never given.
 */
export function normaliseConsent(input: {
  contactForEnquiry: boolean
  marketing: boolean
  channels: Channel[]
}): { contactForEnquiry: boolean; marketing: boolean; channels: Channel[] } {
  return {
    contactForEnquiry: input.contactForEnquiry,
    marketing: input.marketing,
    channels: input.marketing ? [...new Set(input.channels)] : [],
  }
}

export function assertConsent(input: {
  contactForEnquiry: boolean
  marketing: boolean
  channels: Channel[]
}) {
  if (!input.contactForEnquiry) {
    throw new Error('Enquiry consent required')
  }
  if (input.marketing && input.channels.length === 0) {
    throw new Error('Marketing opt-in requires at least one channel')
  }
}
