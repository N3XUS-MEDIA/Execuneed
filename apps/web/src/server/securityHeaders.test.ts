import { describe, expect, it } from 'vitest'
import { contentSecurityPolicy, securityHeaders } from './securityHeaders'

describe('contentSecurityPolicy', () => {
  it('does not allow unsafe-eval in production', () => {
    // The dev-only React refresh runtime needs it; shipping it would defeat
    // much of the point of having a policy at all.
    expect(contentSecurityPolicy({ dev: false })).not.toContain('unsafe-eval')
    expect(contentSecurityPolicy({ dev: true })).toContain('unsafe-eval')
  })

  it('refuses to be framed and pins form submission to this origin', () => {
    const csp = contentSecurityPolicy({ dev: false })
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("form-action 'self'")
    expect(csp).toContain("object-src 'none'")
  })

  it('does not open connect-src to the world', () => {
    expect(contentSecurityPolicy({ dev: false })).toContain("connect-src 'self'")
  })

  it('upgrades insecure requests in production only', () => {
    expect(contentSecurityPolicy({ dev: false })).toContain('upgrade-insecure-requests')
    expect(contentSecurityPolicy({ dev: true })).not.toContain('upgrade-insecure-requests')
  })
})

describe('securityHeaders', () => {
  const names = (dev: boolean) => securityHeaders({ dev }).map(([n]) => n)

  it('sets HSTS in production but not in development', () => {
    expect(names(false)).toContain('Strict-Transport-Security')
    expect(names(true)).not.toContain('Strict-Transport-Security')
  })

  it('sets the expected baseline', () => {
    for (const h of [
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]) {
      expect(names(false)).toContain(h)
    }
  })

  it('does not leak the referring page cross-origin', () => {
    const referrer = securityHeaders({ dev: false }).find(([n]) => n === 'Referrer-Policy')
    expect(referrer?.[1]).toBe('strict-origin-when-cross-origin')
  })
})
