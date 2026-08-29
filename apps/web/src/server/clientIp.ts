import { headers } from 'next/headers'

/**
 * Best-effort caller identity for rate limiting.
 *
 * Only trustworthy because the app sits behind a proxy that sets these
 * headers. Never used for authorisation, and never written to the database —
 * an IP address is personal information under POPIA, so it is an in-memory
 * rate-limit key and nothing more.
 *
 * `headers()` throws outside a request scope, which is exactly what happens
 * when the action is exercised from a test or a job. Falling back to a shared
 * key is the safe direction: callers still share a budget rather than each
 * getting an unlimited one.
 */
export async function clientIp(): Promise<string> {
  try {
    const h = await headers()

    const forwarded = h.get('x-forwarded-for')
    if (forwarded) {
      const first = forwarded.split(',')[0]?.trim()
      if (first) return first
    }

    return h.get('x-real-ip') ?? h.get('cf-connecting-ip') ?? 'unknown'
  } catch {
    return 'no-request-scope'
  }
}
