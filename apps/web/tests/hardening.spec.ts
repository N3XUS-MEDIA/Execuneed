import { test, expect } from '@playwright/test'

/**
 * P1 production readiness: the things that must be true before this site is
 * put in front of the public.
 */

test.describe('security headers', () => {
  test('every response carries the baseline', async ({ page }) => {
    const res = await page.goto('/')
    const h = res!.headers()

    expect(h['content-security-policy']).toContain("frame-ancestors 'none'")
    expect(h['content-security-policy']).toContain("form-action 'self'")
    expect(h['x-frame-options']).toBe('DENY')
    expect(h['x-content-type-options']).toBe('nosniff')
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(h['permissions-policy']).toContain('geolocation=()')
  })

  test('the server does not announce what it is running', async ({ page }) => {
    const res = await page.goto('/')
    expect(res!.headers()['x-powered-by']).toBeUndefined()
  })
})

test.describe('crawler directives', () => {
  test('robots disallows everything while the legal wording is unconfirmed', async ({
    request,
  }) => {
    const res = await request.get('/robots.txt')
    expect(await res.text()).toContain('Disallow: /')
  })

  test('the sitemap lists nothing while indexing is off', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text()
    expect(body).not.toContain('<loc>')
  })

  test('legal pages are noindex in their own right', async ({ page }) => {
    await page.goto('/legal/paia')
    const robots = page.locator('meta[name="robots"]')
    await expect(robots).toHaveAttribute('content', /noindex/)
  })
})

test.describe('cookie notice', () => {
  test('appears, and records a decline without nagging again', async ({ page }) => {
    await page.goto('/')
    const notice = page.getByRole('dialog', { name: /Cookies on this site/ })
    await expect(notice).toBeVisible()

    // Decline is offered as plainly as accept.
    await expect(notice.getByRole('button', { name: 'No thanks' })).toBeVisible()
    await notice.getByRole('button', { name: 'No thanks' }).click()
    await expect(notice).toBeHidden()

    await page.reload()
    await expect(page.getByRole('dialog', { name: /Cookies on this site/ })).toBeHidden()
  })

  test('an undecided visitor does not count as consent', async ({ page }) => {
    await page.goto('/')
    const stored = await page.evaluate(() =>
      window.localStorage.getItem('execuneed.cookie-consent.v1'),
    )
    expect(stored).toBeNull()
  })
})

test.describe('spam and abuse', () => {
  test('the honeypot is unreachable by people but still visible to bots', async ({ page }) => {
    await page.goto('/cover-review')
    const honeypot = page.locator('input[name="website"]')
    await expect(honeypot).toHaveCount(1)

    // Positioned off-screen rather than display:none, which naive bots detect
    // and skip. So it is deliberately NOT hidden in the CSS sense — the checks
    // that matter are that nobody real can see it, tab to it, or hear it.
    const box = await honeypot.boundingBox()
    expect(box!.x + box!.width).toBeLessThan(0)

    await expect(honeypot).toHaveAttribute('tabindex', '-1')
    // aria-hidden keeps it out of the accessibility tree, so a screen reader
    // never announces it. getByRole reflects that tree; getByLabel does not.
    await expect(
      page.getByRole('textbox', { name: 'Leave this field empty' }),
    ).toHaveCount(0)
  })

  test('a submission that fills the honeypot writes nothing', async ({ page }) => {
    await page.goto('/cover-review')
    await page.getByLabel('First name').fill('Bot')
    await page.getByLabel('Mobile number').fill('0829998887')
    await page.getByLabel('Please contact me about this enquiry.').click()
    await page.locator('input[name="website"]').fill('http://spam.example')
    await page.getByRole('button', { name: 'Request a review' }).click()

    // Reports success so the bot learns nothing, but nothing is stored. The
    // database side of this is asserted in createLeadAction.test.ts.
    await expect(page).toHaveURL(/thanks/)
  })
})

test.describe('error and empty states', () => {
  test('an unknown page gets a real 404, not a stack trace', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist')
    expect(res!.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /could not find that page/i })).toBeVisible()
  })
})

test.describe('keyboard access', () => {
  test('a skip link is the first thing a keyboard user reaches', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveText('Skip to content')
    await expect(focused).toBeVisible()
  })
})

test.describe('Discovery product copy', () => {
  test('a category page publishes no unapproved product claim', async ({ page }) => {
    await page.goto('/services/banking-and-vitality')
    await expect(page.getByRole('heading', { name: 'Banking and Vitality' })).toBeVisible()

    // With no approvalRef, NeedsApproval renders the fallback and no claims.
    await expect(page.getByText(/being confirmed with Discovery/)).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Product detail' })).toHaveCount(0)
  })

  test('every service page carries the not-advice note', async ({ page }) => {
    for (const slug of ['life-and-income', 'retirement-and-investments', 'car-and-home']) {
      await page.goto(`/services/${slug}`)
      await expect(page.getByText(/Nothing on these pages is advice/)).toBeVisible()
    }
  })

  test('the services hub links every category', async ({ page }) => {
    await page.goto('/services')
    const links = page.getByRole('link', { name: 'What a review covers' })
    await expect(links).toHaveCount(6)
  })
})
