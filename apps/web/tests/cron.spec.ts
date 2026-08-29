import { test, expect } from '@playwright/test'

/**
 * P1-L-068. The digest returns yesterday's leads — names, numbers, intents.
 * An unauthenticated endpoint that does that is a data breach with extra
 * steps, so these are the cases that matter.
 */
test.describe('daily digest cron route', () => {
  test('refuses an unauthenticated caller', async ({ request }) => {
    const res = await request.get('/api/cron/daily-digest')
    expect([401, 503]).toContain(res.status())
    expect(await res.text()).not.toContain('Execuneed — daily digest')
  })

  test('refuses a wrong secret', async ({ request }) => {
    const res = await request.get('/api/cron/daily-digest', {
      headers: { authorization: 'Bearer definitely-not-the-secret' },
    })
    expect([401, 503]).toContain(res.status())
    expect(await res.text()).not.toContain('daily digest')
  })

  test('accepts the configured secret and does not send', async ({ request }) => {
    const secret = process.env.CRON_SECRET
    test.skip(!secret, 'CRON_SECRET not set in this environment')

    const res = await request.get('/api/cron/daily-digest', {
      headers: { authorization: `Bearer ${secret}` },
    })
    expect(res.status()).toBe(200)

    const body = await res.json()
    expect(body.body).toContain('Execuneed — daily digest')
    // Transport arrives in P2. Until then it must not claim to have sent.
    expect(body.sent).toBe(false)
  })

  test('is never cached', async ({ request }) => {
    const secret = process.env.CRON_SECRET
    test.skip(!secret, 'CRON_SECRET not set in this environment')
    const res = await request.get('/api/cron/daily-digest', {
      headers: { authorization: `Bearer ${secret}` },
    })
    expect(res.headers()['cache-control']).toContain('no-store')
  })
})
