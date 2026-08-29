import { getRedis } from './redis'

/**
 * P1-L-059 — abuse protection for public writes.
 *
 * `createLeadAction` is an unauthenticated endpoint that writes personal data
 * and creates work for Denise. Without a limit, one script can fill the inbox
 * with junk and bury real enquiries — a denial of service against the
 * practice rather than the server.
 *
 * Redis-backed when REDIS_URL is set, which it must be in production. The
 * in-memory limiter below is the fallback, and on Vercel it is close to
 * useless on its own: every serverless instance has its own memory, instances
 * are ephemeral and plural, so a caller gets a fresh budget per cold start.
 * It is kept for local development, for tests, and as a partial backstop if
 * Redis is unreachable.
 */

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

export type RateLimitOptions = { limit: number; windowMs: number }

// ---------------------------------------------------------------- in-memory

type Hit = { count: number; resetAt: number }
const buckets = new Map<string, Hit>()

function sweep(now: number) {
  if (buckets.size < 5_000) return
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key)
  }
}

export function rateLimitMemory(
  key: string,
  { limit, windowMs }: RateLimitOptions,
  now = Date.now(),
): RateLimitResult {
  sweep(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1

  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 }
}

/** Test seam. Never called in application code. */
export function __resetRateLimits() {
  buckets.clear()
}

// -------------------------------------------------------------------- redis

/**
 * INCR and the expiry must be one operation. Doing them as two round trips
 * leaves a window where a crash between them creates a key with no TTL, which
 * would lock a caller out permanently.
 */
const SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
return {count, redis.call('PTTL', KEYS[1])}
`

export async function rateLimit(
  key: string,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const redis = getRedis()
  if (!redis) return rateLimitMemory(key, opts)

  try {
    const [count, ttlMs] = (await redis.eval(
      SCRIPT,
      1,
      `rl:${key}`,
      String(opts.windowMs),
    )) as [number, number]

    if (count > opts.limit) {
      return {
        ok: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil(ttlMs / 1000)),
      }
    }

    return { ok: true, remaining: opts.limit - count, retryAfterSeconds: 0 }
  } catch {
    // Redis is unreachable. Fall back to the in-memory limiter rather than
    // failing open: weak protection beats none, and a Redis outage must not
    // stop the practice receiving genuine enquiries.
    return rateLimitMemory(key, opts)
  }
}

/**
 * A household genuinely might send two enquiries — one for medical aid, one
 * for a bond. Five in ten minutes from one address is not that.
 *
 * The ceiling is overridable because an end-to-end suite submits dozens of
 * enquiries from a single address in under a minute. It is never set in
 * production.
 */
export const LEAD_CAPTURE_LIMIT: RateLimitOptions = {
  limit: Number(process.env.LEAD_RATE_LIMIT_MAX ?? 5),
  windowMs: 10 * 60 * 1000,
}
