import { describe, expect, it } from 'vitest'
import { consentSchema, normaliseConsent, assertConsent } from './consent'

/**
 * P1-L-008. "Marketing consent bundled into submit" is listed under
 * docs/plan/DEFINITION_OF_DONE.md §Never done. These tests are the guard.
 */
describe('consentSchema', () => {
  it('rejects a submission without enquiry consent', () => {
    const r = consentSchema.safeParse({ contactForEnquiry: false, marketing: false })
    expect(r.success).toBe(false)
  })

  it('rejects a missing enquiry consent field outright', () => {
    const r = consentSchema.safeParse({ marketing: true, channels: ['email'] })
    expect(r.success).toBe(false)
  })

  it('accepts enquiry consent alone, with marketing defaulting to false', () => {
    const r = consentSchema.safeParse({ contactForEnquiry: true })
    expect(r.success).toBe(true)
    expect(r.success && r.data.marketing).toBe(false)
    expect(r.success && r.data.channels).toEqual([])
  })

  it('rejects a marketing opt-in with no channel', () => {
    const r = consentSchema.safeParse({
      contactForEnquiry: true,
      marketing: true,
      channels: [],
    })
    expect(r.success).toBe(false)
    expect(r.success === false && r.error.issues[0]?.path).toEqual(['channels'])
  })

  it('accepts a marketing opt-in with a channel', () => {
    const r = consentSchema.safeParse({
      contactForEnquiry: true,
      marketing: true,
      channels: ['whatsapp'],
    })
    expect(r.success).toBe(true)
  })

  it('rejects an unknown channel', () => {
    const r = consentSchema.safeParse({
      contactForEnquiry: true,
      marketing: true,
      channels: ['carrier-pigeon'],
    })
    expect(r.success).toBe(false)
  })
})

describe('normaliseConsent', () => {
  it('drops channels when marketing was declined', () => {
    // Otherwise the record implies a permission that was never given.
    const out = normaliseConsent({
      contactForEnquiry: true,
      marketing: false,
      channels: ['email', 'whatsapp'],
    })
    expect(out.channels).toEqual([])
    expect(out.marketing).toBe(false)
  })

  it('keeps channels when marketing was accepted, deduplicated', () => {
    const out = normaliseConsent({
      contactForEnquiry: true,
      marketing: true,
      channels: ['email', 'email', 'phone'],
    })
    expect(out.channels).toEqual(['email', 'phone'])
  })

  it('never invents enquiry consent', () => {
    expect(
      normaliseConsent({ contactForEnquiry: false, marketing: true, channels: ['email'] })
        .contactForEnquiry,
    ).toBe(false)
  })
})

describe('assertConsent', () => {
  it('throws without enquiry consent', () => {
    expect(() =>
      assertConsent({ contactForEnquiry: false, marketing: false, channels: [] }),
    ).toThrow()
  })

  it('throws on a marketing opt-in with no channel', () => {
    expect(() =>
      assertConsent({ contactForEnquiry: true, marketing: true, channels: [] }),
    ).toThrow()
  })

  it('passes for enquiry only', () => {
    expect(() =>
      assertConsent({ contactForEnquiry: true, marketing: false, channels: [] }),
    ).not.toThrow()
  })
})
