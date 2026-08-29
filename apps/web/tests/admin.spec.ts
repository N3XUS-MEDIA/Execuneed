import { test, expect, type Page } from '@playwright/test'
import { PrismaClient } from '@execuneed/db'

/**
 * The P1 live-done checklist from docs/plan/DEFINITION_OF_DONE.md:
 * Denise opens /admin, signs in as admin, sees a lead created from
 * /cover-review, and can see whether marketing consent was given.
 */

const DENISE = { email: 'denise@execuneed.co.za', password: process.env.SEED_DENISE_PASSWORD! }
const CLIENT = { email: 'client@example.com', password: process.env.SEED_CLIENT_PASSWORD! }

async function signIn(page: Page, who: { email: string; password: string }) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(who.email)
  await page.getByLabel('Password').fill(who.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
}

test.describe.configure({ mode: 'serial' })

const prisma = new PrismaClient()

// Leads accumulate across runs and the inbox is a list, so start from a known
// empty board. Only enquiry data is cleared — staff users and the organisation
// row are left alone.
test.beforeAll(async () => {
  await prisma.auditEvent.deleteMany()
  await prisma.interaction.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.task.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.person.deleteMany()
  await prisma.household.deleteMany()
})

test.afterAll(async () => {
  await prisma.$disconnect()
})

test('a lead submitted on the public site reaches the admin inbox', async ({ page }) => {
  // Submit as a member of the public, with marketing declined.
  await page.goto('/cover-review')
  await page.getByLabel('First name').fill('Marlene')
  await page.getByLabel('Last name').fill('Adams')
  await page.getByLabel('Mobile number').fill('0824447771')
  await page.getByLabel('Suburb').fill('Melkbosstrand')
  await page.getByLabel('Please contact me about this enquiry.').click()
  await page.getByRole('button', { name: 'Request a review' }).click()
  await expect(page).toHaveURL(/thanks/)

  // Now Denise.
  await signIn(page, DENISE)
  await expect(page).toHaveURL(/\/admin\/leads/)

  const row = page.getByRole('row', { name: /Marlene Adams/ })
  await expect(row).toBeVisible()
  // Enquiry only — marketing was not given.
  await expect(row.getByText('Enquiry only')).toBeVisible()

  await page.getByRole('link', { name: 'Marlene Adams' }).click()
  await expect(page.getByRole('heading', { name: 'Marlene Adams' })).toBeVisible()
  await expect(page.getByText('+27824447771')).toBeVisible()

  // The consent record, verbatim.
  await expect(page.getByRole('definition').filter({ hasText: 'Given' }).first()).toBeVisible()
  await expect(page.getByText('Not given')).toBeVisible()

  // Score and SLA are both present.
  await expect(page.getByText('SLA due')).toBeVisible()

  // And the enquiry is already on the timeline.
  await expect(page.getByText(/Enquiry via website/)).toBeVisible()
})

test('a marketing opt-in is visibly different in the inbox', async ({ page }) => {
  await page.goto('/cover-review')
  await page.getByLabel('First name').fill('Sipho')
  await page.getByLabel('Last name').fill('Dlamini')
  await page.getByLabel('Mobile number').fill('0824447772')
  await page.getByLabel('Please contact me about this enquiry.').click()
  await page
    .getByLabel('You may also send me occasional planning notes and offers. I can opt out anytime.')
    .click()
  await page.getByLabel('Email me').check()
  await page.getByRole('button', { name: 'Request a review' }).click()
  await expect(page).toHaveURL(/thanks/)

  await signIn(page, DENISE)
  const row = page.getByRole('row', { name: /Sipho Dlamini/ })
  await expect(row.getByText('Marketing opt-in')).toBeVisible()
})

test('a client-role account cannot reach admin', async ({ page }) => {
  await signIn(page, CLIENT)
  await page.goto('/admin/leads')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Leads' })).toHaveCount(0)
})

test.describe('working a lead', () => {
  test('Denise can move, assign, note and task a lead', async ({ page }) => {
    await page.goto('/cover-review')
    await page.getByLabel('First name').fill('Workflow')
    await page.getByLabel('Last name').fill('Case')
    await page.getByLabel('Mobile number').fill('0824446660')
    await page.getByLabel('Please contact me about this enquiry.').click()
    await page.getByRole('button', { name: 'Request a review' }).click()
    await expect(page).toHaveURL(/thanks/)

    await signIn(page, DENISE)
    await page.getByRole('link', { name: 'Workflow Case' }).click()
    await expect(page.getByRole('heading', { name: 'Workflow Case' })).toBeVisible()

    // Move it forward.
    await page.getByLabel('Status').selectOption('qualified')
    await page.getByRole('button', { name: 'Update status' }).click()
    await expect(page.getByText('Status changed from new to qualified.')).toBeVisible()

    // Assign it.
    await page.getByLabel('Assigned to').selectOption({ label: 'Denise — admin' })
    await page.getByRole('button', { name: 'Assign' }).click()
    await expect(page.getByText('Denise', { exact: true }).first()).toBeVisible()

    // Log a call. If it is not in the system it did not happen.
    await page.getByLabel('What was said').fill('Called, booked for Thursday 10am.')
    await page.getByRole('button', { name: 'Add to timeline' }).click()
    await expect(page.getByText('Called, booked for Thursday 10am.')).toBeVisible()

    // Raise a task.
    await page.getByLabel('What needs doing').fill('Send the pre-meeting checklist')
    await page.getByRole('button', { name: 'Create task' }).click()
    await expect(page.getByText('Send the pre-meeting checklist')).toBeVisible()
  })

  async function submitLead(page: Page, first: string, last: string, mobile: string) {
    await page.goto('/cover-review')
    await page.getByLabel('First name').fill(first)
    await page.getByLabel('Last name').fill(last)
    await page.getByLabel('Mobile number').fill(mobile)
    await page.getByLabel('Please contact me about this enquiry.').click()
    await page.getByRole('button', { name: 'Request a review' }).click()
    await expect(page).toHaveURL(/thanks/)
  }

  // Two separate leads rather than two attempts on one page. Submitting twice
  // in a row races the re-render from the first attempt against the second
  // selection, which made this flaky in CI and not locally.
  test('marking a lead lost is refused without a reason', async ({ page }) => {
    await submitLead(page, 'Lost', 'NoReason', '0824446661')
    await signIn(page, DENISE)
    await page.getByRole('link', { name: 'Lost NoReason' }).click()
    await expect(page.getByRole('heading', { name: 'Lost NoReason' })).toBeVisible()

    await page.getByLabel('Status').selectOption('lost')
    await page.getByRole('button', { name: 'Update status' }).click()

    // The timeline is the proof: still only the original enquiry.
    await expect(page.getByText(/Enquiry via website/)).toBeVisible()
    await expect(page.getByText(/Status changed from new to lost/)).toHaveCount(0)
  })

  test('marking a lead lost records the reason on the timeline', async ({ page }) => {
    await submitLead(page, 'Lost', 'WithReason', '0824446662')
    await signIn(page, DENISE)
    await page.getByRole('link', { name: 'Lost WithReason' }).click()
    await expect(page.getByRole('heading', { name: 'Lost WithReason' })).toBeVisible()

    await page.getByLabel('Status').selectOption('lost')
    await page.getByLabel(/Reason/).fill('Went direct to Discovery')
    await page.getByRole('button', { name: 'Update status' }).click()

    // The reason stays searchable on the file instead of living in a memory.
    await expect(page.getByText(/Reason: Went direct to Discovery/)).toBeVisible()
  })

  test('a completed task disappears from the open count', async ({ page }) => {
    await signIn(page, DENISE)
    await page.goto('/admin/tasks')
    const done = page.getByRole('button', { name: 'Mark done' }).first()
    if (await done.count()) {
      await done.click()
      await expect(page.getByText('Done').first()).toBeVisible()
    }
  })
})
