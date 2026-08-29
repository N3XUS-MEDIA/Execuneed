import { describe, expect, it } from 'vitest'
import { isStaff } from './auth.config'

/**
 * P0-L-004 — the /admin gate is only as good as this predicate.
 * docs/plan/CONTRACTS.md: admin actions require
 * admin | adviser | compliance | superadmin.
 */
describe('isStaff', () => {
  it.each(['superadmin', 'compliance', 'adviser', 'admin'])('admits %s', (role) => {
    expect(isStaff(role)).toBe(true)
  })

  it('rejects the client role', () => {
    expect(isStaff('client')).toBe(false)
  })

  it('rejects an absent or unknown role', () => {
    expect(isStaff(undefined)).toBe(false)
    expect(isStaff(null)).toBe(false)
    expect(isStaff('')).toBe(false)
    expect(isStaff('Admin')).toBe(false)
  })
})
