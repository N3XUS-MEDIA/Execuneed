import { describe, expect, it } from 'vitest'
import { NeedsApproval } from './NeedsApproval'

/**
 * The gate that stops an unapproved Discovery benefit claim reaching a page.
 * These cases are the reason the component exists.
 */
describe('NeedsApproval', () => {
  const render = (el: React.ReactElement | null) => el

  it('renders nothing without an approval reference', () => {
    const out = NeedsApproval({ children: 'Save up to 25% on premiums' })
    expect(out).toBeNull()
  })

  it('renders nothing for a blank or whitespace reference', () => {
    expect(NeedsApproval({ approvalRef: '', children: 'claim' })).toBeNull()
    expect(NeedsApproval({ approvalRef: '   ', children: 'claim' })).toBeNull()
    expect(NeedsApproval({ approvalRef: null, children: 'claim' })).toBeNull()
  })

  it('renders the fallback instead of the claim when unapproved', () => {
    const out = NeedsApproval({
      fallback: 'Ask us how integration works.',
      children: 'Save up to 25%',
    })
    expect(out).not.toBeNull()
    expect(JSON.stringify(out)).toContain('Ask us how integration works.')
    expect(JSON.stringify(out)).not.toContain('Save up to 25%')
  })

  it('renders the claim once an approval reference exists', () => {
    const out = NeedsApproval({ approvalRef: 'MS-2026-0142', children: 'Save up to 25%' })
    expect(JSON.stringify(out)).toContain('Save up to 25%')
  })

  void render
})
