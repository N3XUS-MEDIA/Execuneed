import { test, expect, type Page } from '@playwright/test'
import { PrismaClient } from '@execuneed/db'

/**
 * P1-S-031 — the consent paths, end to end.
 *
 * docs/plan/DEFINITION_OF_DONE.md lists "marketing consent bundled into
 * submit" under Never done. These tests are what stops that regressing.
 */
const prisma = new PrismaClient()

test.afterAll(async () => {
  await prisma.$disconnect()
})

async function consentFor(mobileE164: string) {
  const person = await prisma.person.findFirst({
    where: { mobile: mobileE164 },
    orderBy: { createdAt: 'desc' },
    include: { consents: { orderBy: { capturedAt: 'desc' }, take: 1 }, leads: true },
  })
  return { person, consent: person?.consents[0] ?? null }
}

async function fillBasics(page: Page, mobile: string) {
  await page.goto('/cover-review')
  await page.getByLabel('First name').fill('Playwright')
  await page.getByLabel('Last name').fill('Tester')
  await page.getByLabel('Mobile number').fill(mobile)
  await page.getByLabel('Suburb').fill('Century City')
}

test('submitting with enquiry consent only persists marketing = false', async ({ page }) => {
  const mobile = '0821110001'
  await fillBasics(page, mobile)

  await page.getByLabel('Please contact me about this enquiry.').click()
  await page.getByRole('button', { name: 'Request a review' }).click()

  await expect(page).toHaveURL(/\/cover-review\/thanks/)
  await expect(page.getByRole('heading', { name: 'We have the request.' })).toBeVisible()

  const { person, consent } = await consentFor('+27821110001')
  expect(person).not.toBeNull()
  expect(consent?.contactForEnquiry).toBe(true)
  expect(consent?.marketing).toBe(false)
  expect(consent?.channels).toEqual([])
})

test('submitting with marketing consent persists the chosen channel', async ({ page }) => {
  const mobile = '0821110002'
  await fillBasics(page, mobile)

  await page.getByLabel('Please contact me about this enquiry.').click()
  await page
    .getByLabel('You may also send me occasional planning notes and offers. I can opt out anytime.')
    .click()
  await page.getByLabel('WhatsApp').check()
  await page.getByRole('button', { name: 'Request a review' }).click()

  await expect(page).toHaveURL(/\/cover-review\/thanks/)

  const { consent } = await consentFor('+27821110002')
  expect(consent?.contactForEnquiry).toBe(true)
  expect(consent?.marketing).toBe(true)
  expect(consent?.channels).toEqual(['whatsapp'])
})

test('the form cannot be submitted without enquiry consent', async ({ page }) => {
  await fillBasics(page, '0821110003')

  // The submit button stays disabled until the enquiry box is ticked, so a
  // marketing opt-in alone can never carry a submission through.
  const submit = page.getByRole('button', { name: 'Request a review' })
  await expect(submit).toBeDisabled()

  await page
    .getByLabel('You may also send me occasional planning notes and offers. I can opt out anytime.')
    .click()
  await expect(submit).toBeDisabled()

  const { person } = await consentFor('+27821110003')
  expect(person).toBeNull()
})

test('marketing opt-in requires a channel', async ({ page }) => {
  await fillBasics(page, '0821110004')

  await page.getByLabel('Please contact me about this enquiry.').click()
  await page
    .getByLabel('You may also send me occasional planning notes and offers. I can opt out anytime.')
    .click()
  // Deliberately choose no channel.
  await page.getByRole('button', { name: 'Request a review' }).click()

  await expect(page.getByText('Choose at least one way for us to reach you.')).toBeVisible()
  await expect(page).not.toHaveURL(/thanks/)

  const { person } = await consentFor('+27821110004')
  expect(person).toBeNull()
})

test('a validation error does not wipe what the visitor typed', async ({ page }) => {
  // React 19 resets a form once a form action resolves. That behaviour once
  // cleared every field here, so one mistyped digit meant starting over. On
  // the practice's main lead-capture page that is a conversion bug.
  await fillBasics(page, '0215528989') // landline: fails validation
  await page.getByLabel('Please contact me about this enquiry.').click()
  await page.getByRole('button', { name: 'Request a review' }).click()

  await expect(page.getByLabel('First name')).toHaveValue('Playwright')
  await expect(page.getByLabel('Last name')).toHaveValue('Tester')
  await expect(page.getByLabel('Suburb')).toHaveValue('Century City')
  await expect(
    page.getByRole('checkbox', { name: /contact me about this enquiry/ }),
  ).toBeChecked()
})

test('a landline is rejected with a message on the field', async ({ page }) => {
  await fillBasics(page, '0215528989')
  await page.getByLabel('Please contact me about this enquiry.').click()
  await page.getByRole('button', { name: 'Request a review' }).click()

  await expect(
    page.getByText('That does not look like a South African mobile number.'),
  ).toBeVisible()
})

test('public pages are noindex while the legal wording is unconfirmed', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.headers()['x-robots-tag']).toContain('noindex')
})

test('anonymous visitors are redirected away from admin', async ({ page }) => {
  await page.goto('/admin/leads')
  await expect(page).toHaveURL(/\/login/)
})
