import { describe, expect, it } from 'vitest'
import { analyticsAllowed, parseConsent } from './cookieConsent'

describe('parseConsent', () => {
  it('reads a stored decision', () => {
    const raw = JSON.stringify({ analytics: 'accepted', decidedAt: '2026-08-29T00:00:00Z' })
    expect(parseConsent(raw)?.analytics).toBe('accepted')
  })

  it('returns null for anything it does not recognise', () => {
    expect(parseConsent(null)).toBeNull()
    expect(parseConsent('')).toBeNull()
    expect(parseConsent('not json')).toBeNull()
    expect(parseConsent('{}')).toBeNull()
    expect(parseConsent('{"analytics":"maybe"}')).toBeNull()
    expect(parseConsent('{"analytics":"accepted"}')).toBeNull()
  })
})

describe('analyticsAllowed', () => {
  it('is false until someone actively accepts', () => {
    // Absence of a decision is not consent.
    expect(analyticsAllowed(null)).toBe(false)
    expect(analyticsAllowed({ analytics: 'declined', decidedAt: 'x' })).toBe(false)
  })

  it('is true only after an explicit accept', () => {
    expect(analyticsAllowed({ analytics: 'accepted', decidedAt: 'x' })).toBe(true)
  })
})
