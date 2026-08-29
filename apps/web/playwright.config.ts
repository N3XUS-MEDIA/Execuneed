import path from 'node:path'
import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const envFile = path.resolve(__dirname, '.env')
if (!process.env.DATABASE_URL && existsSync(envFile)) {
  process.loadEnvFile(envFile)
}

// One source for the cron secret. The test signs its request with this and
// the server under test validates against it; two defaults would silently
// disagree, which is exactly what happened when CI set its own.
process.env.CRON_SECRET ||= 'e2e-cron-secret'

const PORT = Number(process.env.E2E_PORT ?? 3210)
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'list' : 'line',
  // The suite runs against `next dev`, which compiles each route lazily on
  // first hit. A cold server action can easily exceed the 5s default and the
  // failure looks like a hang rather than a slow compile.
  expect: { timeout: 15_000 },
  // Some tests walk a whole workflow — submit, sign in, then several server
  // actions — against a lazily compiling dev server.
  timeout: 90_000,
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // The suite submits far more enquiries from one address than a person
    // ever would, so the public rate limit is raised here. Its real behaviour
    // is covered in src/server/rateLimit.test.ts.
    env: { LEAD_RATE_LIMIT_MAX: '1000', CRON_SECRET: process.env.CRON_SECRET },
    command: `pnpm exec next dev -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
