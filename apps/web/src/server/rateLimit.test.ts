import { beforeEach, describe, expect, it } from 'vitest'
import { rateLimit, __resetRateLimits, LEAD_CAPTURE_LIMIT } from './rateLimit'

describe('rateLimit', () => {
  beforeEach(__resetRateLimits)

  const opts = { limit: 3, windowMs: 1000 }

  it('allows requests up to the limit', () => {
    expect(rateLimit('a', opts, 0).ok).toBe(true)
    expect(rateLimit('a', opts, 0).ok).toBe(true)
    expect(rateLimit('a', opts, 0).ok).toBe(true)
  })

  it('blocks the request past the limit', () => {
    for (let i = 0; i < 3; i++) rateLimit('a', opts, 0)
    const r = rateLimit('a', opts, 0)
    expect(r.ok).toBe(false)
    expect(r.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('keeps separate budgets per key', () => {
    for (let i = 0; i < 3; i++) rateLimit('a', opts, 0)
    expect(rateLimit('a', opts, 0).ok).toBe(false)
    expect(rateLimit('b', opts, 0).ok).toBe(true)
  })

  it('lets the window expire', () => {
    for (let i = 0; i < 3; i++) rateLimit('a', opts, 0)
    expect(rateLimit('a', opts, 999).ok).toBe(false)
    expect(rateLimit('a', opts, 1001).ok).toBe(true)
  })

  it('reports remaining budget', () => {
    expect(rateLimit('a', opts, 0).remaining).toBe(2)
    expect(rateLimit('a', opts, 0).remaining).toBe(1)
    expect(rateLimit('a', opts, 0).remaining).toBe(0)
  })

  it('leaves room for a household sending a second genuine enquiry', () => {
    // Two enquiries from one house is normal. Five in ten minutes is not.
    for (let i = 0; i < 2; i++) {
      expect(rateLimit('house', LEAD_CAPTURE_LIMIT, 0).ok).toBe(true)
    }
  })
})
