import { describe, expect, it } from 'vitest'
import { householdLabel } from './households'

describe('householdLabel', () => {
  it('prefers the surname', () => {
    expect(householdLabel({ firstName: 'Anele', lastName: 'Mbeki' })).toBe('Mbeki household')
  })

  it('falls back to the first name when no surname was given', () => {
    expect(householdLabel({ firstName: 'Anele' })).toBe('Anele household')
    expect(householdLabel({ firstName: 'Anele', lastName: '' })).toBe('Anele household')
    expect(householdLabel({ firstName: 'Anele', lastName: '  ' })).toBe('Anele household')
    expect(householdLabel({ firstName: 'Anele', lastName: null })).toBe('Anele household')
  })

  it('never produces an empty label', () => {
    expect(householdLabel({ firstName: '  ' })).toBe('Unnamed household')
  })
})
