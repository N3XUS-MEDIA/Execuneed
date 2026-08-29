import path from 'node:path'
import { existsSync } from 'node:fs'
import { defineConfig } from 'vitest/config'

// Integration tests need DATABASE_URL. Locally that lives in .env (a symlink to
// the repo root); in CI it is set by the workflow. Tests that need a database
// skip themselves when neither provides one.
const envFile = path.resolve(import.meta.dirname, '.env')
if (!process.env.DATABASE_URL && existsSync(envFile)) {
  process.loadEnvFile(envFile)
}

export default defineConfig({
  resolve: {
    // Mirror the `@/*` path alias from tsconfig.json.
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Integration tests share one database, so they must not race each other.
    fileParallelism: false,
  },
})
