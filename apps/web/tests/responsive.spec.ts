import { test, expect } from '@playwright/test'

/**
 * P1-S-032 — responsive pass.
 *
 * Checks the thing that actually breaks on phones: content wider than the
 * viewport, which produces the sideways-scrolling page every client notices
 * and no developer does on a 27" monitor.
 */
const PAGES = [
  '/',
  '/how-we-work',
  '/services',
  '/cover-review',
  '/contact',
  '/legal/privacy',
  '/legal/paia',
  '/cover-review/thanks',
]

const VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
]

for (const vp of VIEWPORTS) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    for (const path of PAGES) {
      test(`${path} does not scroll sideways`, async ({ page }) => {
        await page.goto(path)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(1)
      })
    }
  })
}

test.describe('tap targets', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('every interactive control on the review page is at least 44px tall', async ({ page }) => {
    // The audience skews over 50 and mostly arrives from WhatsApp on a phone.
    await page.goto('/cover-review')
    // Radix mirrors each control with an aria-hidden input so native form
    // submission still works. Those are not tap targets.
    const sel = ['button', 'a', 'input:not([type=hidden])', 'select', 'textarea']
      .map((s) => `main ${s}:not([aria-hidden="true"])`)
      .join(', ')
    const controls = page.locator(sel)
    const count = await controls.count()
    expect(count).toBeGreaterThan(5)

    const small: string[] = []
    for (let i = 0; i < count; i++) {
      const el = controls.nth(i)
      if (!(await el.isVisible())) continue
      const box = await el.boundingBox()
      if (box && box.height < 44) {
        small.push(`${await el.evaluate((n) => n.tagName)} h=${Math.round(box.height)}`)
      }
    }
    expect(small, `controls under 44px: ${small.join(', ')}`).toEqual([])
  })
})
