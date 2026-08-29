import path from 'node:path'
import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

const envFile = path.resolve(__dirname, '.env')
if (!process.env.DATABASE_URL && existsSync(envFile)) {
  process.loadEnvFile(envFile)
}

const PORT = Number(process.env.E2E_PORT ?? 3210)
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'list' : 'line',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm exec next dev -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
