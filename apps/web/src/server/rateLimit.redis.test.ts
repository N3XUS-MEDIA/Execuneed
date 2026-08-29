import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { rateLimit } from './rateLimit'
import { getRedis } from './redis'

/**
 * The Redis path, against a real instance. Skips without REDIS_URL so local
 * runs and CI stay green, but this is the path that matters in production —
 * the in-memory limiter is near-useless across serverless instances.
 */
const hasRedis = Boolean(process.env.REDIS_URL)
const d = hasRedis ? describe : describe.skip

d('rateLimit via Redis', () => {
  const key = `test:${process.pid}`

  beforeEach(async () => {
    await getRedis()?.del(`rl:${key}`)
  })

  afterAll(async () => {
    await getRedis()?.del(`rl:${key}`)
    getRedis()?.disconnect()
  })

  it('allows up to the limit then blocks', async () => {
    const opts = { limit: 3, windowMs: 60_000 }
    expect((await rateLimit(key, opts)).ok).toBe(true)
    expect((await rateLimit(key, opts)).ok).toBe(true)
    expect((await rateLimit(key, opts)).ok).toBe(true)

    const blocked = await rateLimit(key, opts)
    expect(blocked.ok).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('reports remaining budget', async () => {
    const opts = { limit: 3, windowMs: 60_000 }
    expect((await rateLimit(key, opts)).remaining).toBe(2)
    expect((await rateLimit(key, opts)).remaining).toBe(1)
  })

  it('sets a TTL, so a counter can never strand a caller permanently', async () => {
    await rateLimit(key, { limit: 5, windowMs: 30_000 })
    const ttl = await getRedis()!.pttl(`rl:${key}`)
    expect(ttl).toBeGreaterThan(0)
    expect(ttl).toBeLessThanOrEqual(30_000)
  })

  it('keeps separate budgets per key', async () => {
    const opts = { limit: 1, windowMs: 60_000 }
    const other = `${key}:other`
    await getRedis()?.del(`rl:${other}`)

    expect((await rateLimit(key, opts)).ok).toBe(true)
    expect((await rateLimit(key, opts)).ok).toBe(false)
    expect((await rateLimit(other, opts)).ok).toBe(true)

    await getRedis()?.del(`rl:${other}`)
  })
})
