import { NextResponse } from 'next/server'
import { runDailyDigest } from '@/server/jobs/dailyDigest'

/**
 * P1-L-068 — a way for the digest to actually run.
 *
 * P1-L-016 built the query and the rendering but left nothing able to trigger
 * it, so the digest could never have reached Wayne or Denise. This is the
 * trigger, designed for a platform scheduler (Vercel Cron, or any caller that
 * can set a header).
 *
 * Authorisation is a shared secret, compared in constant time. Without
 * CRON_SECRET set the route refuses outright rather than defaulting open — an
 * unauthenticated endpoint that returns yesterday's leads would be a data
 * breach with extra steps.
 *
 * It still does not send. Email transport lands with the queue in P2; until
 * then this returns the rendered digest so it can be verified and read.
 */
export const dynamic = 'force-dynamic'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET is not configured.' },
      { status: 503 },
    )
  }

  const header = request.headers.get('authorization') ?? ''
  const provided = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!timingSafeEqual(provided, secret)) {
    // No detail. An attacker learns nothing about why this failed.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runDailyDigest({ send: false })

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
