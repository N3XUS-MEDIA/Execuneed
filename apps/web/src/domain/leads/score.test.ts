import { describe, expect, it } from 'vitest'
import { scoreLead } from './score'

/**
 * P1-L-014 — weights are fixed in docs/plan/CONTRACTS.md. If a number here
 * changes, the contract changed and Lead owes a `contract.changed` event.
 */
const base = {
  intent: 'life' as const,
  existingDiscovery: null,
  lifeEvents: [] as string[],
  children: null,
}

describe('scoreLead weights', () => {
  it('scores a bare enquiry at zero', () => {
    expect(scoreLead(base)).toBe(0)
  })

  it('adds 3 for a cover review', () => {
    expect(scoreLead({ ...base, intent: 'cover_review' })).toBe(3)
  })

  it('adds 3 for an existing Discovery client', () => {
    expect(scoreLead({ ...base, existingDiscovery: true })).toBe(3)
  })

  it('does not reward an unanswered Discovery question', () => {
    expect(scoreLead({ ...base, existingDiscovery: null })).toBe(0)
    expect(scoreLead({ ...base, existingDiscovery: false })).toBe(0)
  })

  it('adds 2 for any life event', () => {
    expect(scoreLead({ ...base, lifeEvents: ['new baby'] })).toBe(2)
    expect(scoreLead({ ...base, lifeEvents: ['new baby', 'new bond'] })).toBe(2)
  })

  it('adds 2 for children in the household', () => {
    expect(scoreLead({ ...base, children: 2 })).toBe(2)
    expect(scoreLead({ ...base, children: 0 })).toBe(0)
  })

  it('adds 2 for an employer enquiry', () => {
    expect(scoreLead({ ...base, intent: 'employer' })).toBe(2)
  })

  it('adds 2 when they booked a slot themselves', () => {
    expect(scoreLead({ ...base, bookedBySelf: true })).toBe(2)
  })

  it('adds 1 for a Cape Town metro suburb, case insensitively', () => {
    expect(scoreLead({ ...base, suburb: 'Century City' })).toBe(1)
    expect(scoreLead({ ...base, suburb: 'melkbosstrand' })).toBe(1)
    expect(scoreLead({ ...base, suburb: 'Table View, Cape Town' })).toBe(1)
  })

  it('does not reward a suburb outside the metro', () => {
    expect(scoreLead({ ...base, suburb: 'Sandton' })).toBe(0)
    expect(scoreLead({ ...base, suburb: '' })).toBe(0)
    expect(scoreLead({ ...base, suburb: null })).toBe(0)
  })

  it('subtracts 2 for a claim or a service request', () => {
    // These route to the service desk, not to sales.
    expect(scoreLead({ ...base, intent: 'claim', children: 2 })).toBe(0)
    expect(scoreLead({ ...base, intent: 'service', children: 2 })).toBe(0)
  })
})

describe('scoreLead clamping', () => {
  it('never returns below zero', () => {
    expect(scoreLead({ ...base, intent: 'claim' })).toBe(0)
  })

  it('never returns above twenty', () => {
    expect(
      scoreLead({
        intent: 'cover_review',
        existingDiscovery: true,
        lifeEvents: ['new baby'],
        children: 3,
        bookedBySelf: true,
        suburb: 'Century City',
      }),
    ).toBeLessThanOrEqual(20)
  })
})

describe('scoreLead and the SLA boundary', () => {
  it('puts an existing Discovery family asking for a review over the line', () => {
    // 3 review + 3 existing + 2 children + 1 metro = 9, so 15-minute SLA.
    const score = scoreLead({
      intent: 'cover_review',
      existingDiscovery: true,
      lifeEvents: [],
      children: 2,
      suburb: 'Durbanville',
    })
    expect(score).toBe(9)
    expect(score).toBeGreaterThanOrEqual(7)
  })

  it('leaves a cold single-product enquiry under it', () => {
    expect(scoreLead({ ...base, intent: 'medical_aid', suburb: 'Claremont' })).toBeLessThan(7)
  })
})
