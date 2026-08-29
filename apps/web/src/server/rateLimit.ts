/**
 * P1-L-059 — abuse protection for public writes.
 *
 * `createLeadAction` is an unauthenticated endpoint that writes personal data
 * to the database and creates work for Denise. Without a limit, one script can
 * fill the inbox with junk and bury real enquiries, which is a denial of
 * service against the practice rather than the server.
 *
 * This is an in-memory fixed window, so it is PER INSTANCE. On a single
 * container that is genuinely effective; the moment the app runs more than one
 * instance, a determined caller gets N times the budget. That is an accepted
 * P1 trade-off — the alternative is standing up Redis before a site that does
 * not yet have a domain. `docs/plan/DECISIONS.md` records it, and the swap is
 * one function.
 */

type Hit = { count: number; resetAt: number }

const buckets = new Map<string, Hit>()

/** Stop the map growing without bound on a long-lived process. */
function sweep(now: number) {
  if (buckets.size < 5_000) return
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
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

/**
 * A household genuinely might send two enquiries — one for medical aid, one
 * for a bond. Five in ten minutes from one address is not that.
 *
 * The ceiling is overridable because an end-to-end suite submits dozens of
 * enquiries from a single address in under a minute and would otherwise be
 * throttled by this. The override exists for that and for load testing; it is
 * never set in production, where the default stands. The limiter's own
 * behaviour is covered by unit tests, so raising it for e2e loses no coverage.
 */
export const LEAD_CAPTURE_LIMIT = {
  limit: Number(process.env.LEAD_RATE_LIMIT_MAX ?? 5),
  windowMs: 10 * 60 * 1000,
}
