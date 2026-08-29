import { describe, expect, it } from 'vitest'
import { slaDueAt } from './sla'

/**
 * P1-L-013. Dates are written as SAST wall-clock and converted with the +02:00
 * suffix, so the test reads the way the rule is written in CONTRACTS.md.
 *
 * 2026-08-24 is a Monday; 2026-08-29 a Saturday; 2026-08-30 a Sunday.
 */
const sast = (iso: string) => new Date(`${iso}+02:00`)
const asSast = (d: Date) =>
  new Date(d.getTime() + 2 * 60 * 60 * 1000).toISOString().replace('.000Z', '')

describe('slaDueAt — high priority (score >= 7)', () => {
  it('is 15 minutes away mid-morning on a weekday', () => {
    expect(asSast(slaDueAt(9, sast('2026-08-24T09:00:00')))).toBe('2026-08-24T09:15:00')
  })

  it('still allows 15 minutes at 16:50, even though it crosses closing', () => {
    expect(asSast(slaDueAt(7, sast('2026-08-24T16:50:00')))).toBe('2026-08-24T17:05:00')
  })

  it('rolls a late-evening lead to 08:15 the next weekday', () => {
    expect(asSast(slaDueAt(8, sast('2026-08-24T19:30:00')))).toBe('2026-08-25T08:15:00')
  })

  it('rolls an early-morning lead to 08:15 the SAME day', () => {
    // 06:00 Monday: the office opens in two hours. Tuesday would be wrong.
    expect(asSast(slaDueAt(8, sast('2026-08-24T06:00:00')))).toBe('2026-08-24T08:15:00')
  })

  it('rolls a Saturday lead to Monday 08:15', () => {
    expect(asSast(slaDueAt(10, sast('2026-08-29T11:00:00')))).toBe('2026-08-31T08:15:00')
  })

  it('rolls a Sunday lead to Monday 08:15', () => {
    expect(asSast(slaDueAt(10, sast('2026-08-30T20:00:00')))).toBe('2026-08-31T08:15:00')
  })

  it('rolls a Friday evening lead over the weekend', () => {
    // 2026-08-28 is a Friday.
    expect(asSast(slaDueAt(9, sast('2026-08-28T18:00:00')))).toBe('2026-08-31T08:15:00')
  })
})

describe('slaDueAt — standard (score < 7)', () => {
  it('adds four hours inside a single working day', () => {
    expect(asSast(slaDueAt(3, sast('2026-08-24T09:00:00')))).toBe('2026-08-24T13:00:00')
  })

  it('carries the remainder into the next working day', () => {
    // 15:00 Monday leaves 2h before close; the other 2h land after Tuesday open.
    expect(asSast(slaDueAt(0, sast('2026-08-24T15:00:00')))).toBe('2026-08-25T10:00:00')
  })

  it('starts the clock at opening for an overnight lead', () => {
    expect(asSast(slaDueAt(2, sast('2026-08-25T02:00:00')))).toBe('2026-08-25T12:00:00')
  })

  it('starts the clock Monday morning for a weekend lead', () => {
    expect(asSast(slaDueAt(4, sast('2026-08-29T13:00:00')))).toBe('2026-08-31T12:00:00')
  })

  it('does not consume Saturday when it runs off a Friday afternoon', () => {
    expect(asSast(slaDueAt(1, sast('2026-08-28T16:00:00')))).toBe('2026-08-31T11:00:00')
  })
})

describe('slaDueAt — the boundary', () => {
  it('treats 7 as high priority and 6 as standard', () => {
    const at = sast('2026-08-24T09:00:00')
    expect(asSast(slaDueAt(7, at))).toBe('2026-08-24T09:15:00')
    expect(asSast(slaDueAt(6, at))).toBe('2026-08-24T13:00:00')
  })
})
