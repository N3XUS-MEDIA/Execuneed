import { test, expect, type Page } from '@playwright/test'
import { PrismaClient } from '@execuneed/db'

/**
 * The site concierge — the capture half of P2-L-070.
 *
 * Two things are being protected here. The first is that it never answers: it
 * has no approved corpus to answer from, so refusal is the only correct
 * response to a question, and a script that starts answering is the failure
 * condition in docs/plan/DEFINITION_OF_DONE.md.
 *
 * The second is consent. This is a second surface that writes leads, and a
 * second surface is exactly where consent handling drifts away from the first.
 * These mirror the guarantees in lead-form.spec.ts.
 */
const prisma = new PrismaClient()

test.afterAll(async () => {
  await prisma.$disconnect()
})

async function leadFor(mobileE164: string) {
  const person = await prisma.person.findFirst({
    where: { mobile: mobileE164 },
    orderBy: { createdAt: 'desc' },
    include: { consents: { orderBy: { capturedAt: 'desc' }, take: 1 }, leads: true },
  })
  return { person, consent: person?.consents[0] ?? null, lead: person?.leads[0] ?? null }
}

async function openConcierge(page: Page, path = '/') {
  await page.goto(path)
  await page.evaluate(() =>
    window.localStorage.setItem(
      'execuneed.cookie-consent.v1',
      JSON.stringify({ analytics: 'declined', decidedAt: new Date().toISOString() }),
    ),
  )
  await page.reload()
  await page.getByRole('button', { name: 'Ask Execuneed' }).click()
  return page.getByRole('dialog', { name: 'Execuneed' })
}

test('the launcher is the icon, and it is a real target', async ({ page }) => {
  await page.goto('/')
  const launcher = page.getByRole('button', { name: 'Ask Execuneed' })
  await expect(launcher).toBeVisible()

  const box = await launcher.boundingBox()
  expect(box!.height).toBeGreaterThanOrEqual(44)
  expect(box!.width).toBeGreaterThanOrEqual(44)

  // The icon and nothing else — no wrapper chrome behind it.
  await expect(launcher.locator('img')).toHaveAttribute('src', /icon/)
})

test('it stays off the page that already is the form', async ({ page }) => {
  await page.goto('/cover-review')
  await expect(page.getByRole('button', { name: 'Ask Execuneed' })).toHaveCount(0)
})

test('it opens carrying the public AI disclaimer, verbatim', async ({ page }) => {
  const panel = await openConcierge(page)
  await expect(panel).toContainText(
    'This assistant shares general information only. It is not financial advice and does not recommend products.',
  )
  await expect(panel).toContainText('A licensed representative of Execuneed must review your circumstances')
})

test('it refuses to answer a product question, every time', async ({ page }) => {
  const panel = await openConcierge(page)

  await panel.getByLabel('Ask a question').fill('Which Discovery plan is best for my family?');
  await panel.getByRole('button', { name: 'Send question' }).click()

  await expect(panel).toContainText('I am not able to answer that here')
  await expect(panel).toContainText('a licensed adviser should answer')

  // It must not have produced anything that reads like an answer.
  const text = await panel.innerText()
  expect(text).not.toMatch(/\bI recommend\b|\byou should\b|\bthe best plan\b/i)
})

test('booking through the concierge writes a lead, with marketing false', async ({ page }) => {
  const mobile = '0824440101'
  const panel = await openConcierge(page)

  await panel.getByLabel('Ask a question').fill('Is my income protected if I cannot work?')
  await panel.getByRole('button', { name: 'Send question' }).click()
  await panel.getByRole('button', { name: 'Yes, please call me' }).click()

  await panel.getByLabel('First name').fill('Concierge')
  await panel.getByLabel('Mobile number').fill(mobile)
  await panel.getByLabel('Please contact me about this enquiry.').click()
  await panel.getByRole('button', { name: 'Send this to the practice' }).click()

  await expect(panel).toContainText('We have the request.')

  const { consent, lead } = await leadFor('+27824440101')
  expect(consent?.contactForEnquiry).toBe(true)
  expect(consent?.marketing).toBe(false)
  expect(consent?.channels).toEqual([])
  // The question the visitor typed is carried through, not answered.
  expect(lead?.message).toBe('Is my income protected if I cannot work?')
})

test('a marketing opt-in in the concierge persists as its own field', async ({ page }) => {
  const mobile = '0824440102'
  const panel = await openConcierge(page)

  await panel.getByRole('button', { name: 'Book a cover review' }).click()
  await panel.getByLabel('First name').fill('Concierge')
  await panel.getByLabel('Mobile number').fill(mobile)
  await panel.getByLabel('Please contact me about this enquiry.').click()
  await panel
    .getByLabel('You may also send me occasional planning notes and offers. I can opt out anytime.')
    .click()
  await panel.getByRole('button', { name: 'Send this to the practice' }).click()

  await expect(panel).toContainText('We have the request.')

  const { consent } = await leadFor('+27824440102')
  expect(consent?.contactForEnquiry).toBe(true)
  expect(consent?.marketing).toBe(true)
  expect(consent?.channels).toEqual(['whatsapp'])
})

test('it writes nothing without enquiry consent', async ({ page }) => {
  const mobile = '0824440103'
  const panel = await openConcierge(page)

  await panel.getByRole('button', { name: 'Book a cover review' }).click()
  await panel.getByLabel('First name').fill('Concierge')
  await panel.getByLabel('Mobile number').fill(mobile)

  const submit = panel.getByRole('button', { name: 'Send this to the practice' })
  await expect(submit).toBeDisabled()
  await submit.click({ force: true })

  // Focus goes to the box that is blocking it, rather than nothing happening.
  await expect(panel.getByLabel('Please contact me about this enquiry.')).toBeFocused()

  const { person } = await leadFor('+27824440103')
  expect(person).toBeNull()
})

test('escape closes it and hands focus back to the launcher', async ({ page }) => {
  const panel = await openConcierge(page)
  await expect(panel).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await expect(page.getByRole('button', { name: 'Ask Execuneed' })).toBeFocused()
})
