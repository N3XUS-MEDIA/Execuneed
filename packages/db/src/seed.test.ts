import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const seed = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'seed.ts'), 'utf8')

/**
 * `discoveryJuristicText` is rendered in the public footer. Seeding it with a
 * placeholder would publish unconfirmed legal wording on a financial services
 * site. This is a source-level guard because the alternative is running the
 * seed against a database inside a unit test.
 */
describe('seed', () => {
  it('never seeds placeholder text into the public disclaimer field', () => {
    const match = seed.match(/discoveryJuristicText:\s*(.+)/)
    expect(match?.[1]?.trim()).toBe("'',")
  })

  it('refuses to run against production', () => {
    expect(seed).toContain("process.env.NODE_ENV === 'production'")
    expect(seed).toContain('Refusing to seed a production database')
  })

  it('does not commit a usable password', () => {
    // Passwords come from env or are generated and printed once.
    expect(seed).toContain('SEED_WAYNE_PASSWORD')
    expect(seed).not.toMatch(/password:\s*['"][a-zA-Z0-9]{6,}['"]/)
  })
})
