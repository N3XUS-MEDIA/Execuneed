import { describe, expect, it } from 'vitest'
import { toE164, isSaMobile } from './mobile'

describe('toE164', () => {
  it.each([
    ['0821234567', '+27821234567'],
    ['082 123 4567', '+27821234567'],
    ['082-123-4567', '+27821234567'],
    ['(082) 123 4567', '+27821234567'],
    ['+27821234567', '+27821234567'],
    ['+27 82 123 4567', '+27821234567'],
    ['0027821234567', '+27821234567'],
    ['27821234567', '+27821234567'],
    ['821234567', '+27821234567'],
    ['0631234567', '+27631234567'],
    ['0711234567', '+27711234567'],
  ])('normalises %s', (input, expected) => {
    expect(toE164(input)).toBe(expected)
  })

  it('rejects a landline', () => {
    // 021 552 8989 is the office. It is not a mobile and must not be stored as one.
    expect(toE164('0215528989')).toBeNull()
    expect(toE164('+27215528989')).toBeNull()
  })

  it('rejects wrong lengths', () => {
    expect(toE164('08212345')).toBeNull()
    expect(toE164('082123456789')).toBeNull()
  })

  it('rejects non-numeric and empty input', () => {
    expect(toE164('not a number')).toBeNull()
    expect(toE164('')).toBeNull()
    expect(toE164('   ')).toBeNull()
  })

  it('rejects a foreign number', () => {
    expect(toE164('+442071234567')).toBeNull()
  })
})

describe('isSaMobile', () => {
  it('agrees with toE164', () => {
    expect(isSaMobile('082 123 4567')).toBe(true)
    expect(isSaMobile('021 552 8989')).toBe(false)
  })
})
