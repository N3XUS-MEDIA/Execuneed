/**
 * P1-L-060 — security headers.
 *
 * This site collects names, mobile numbers and consent decisions, so the
 * baseline matters more than it would on a brochure. Nothing here is exotic;
 * it is the set an assessor would expect to find and would note the absence of.
 */

export type SecurityHeader = readonly [name: string, value: string]

/**
 * `unsafe-inline` on style-src is required by Next's injected critical CSS.
 * `unsafe-eval` is dev-only — the React refresh runtime needs it, production
 * does not, and shipping it would defeat much of the point of a CSP.
 */
export function contentSecurityPolicy({ dev }: { dev: boolean }): string {
  const scriptSrc = dev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'"

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // No third-party analytics or chat widget is wired up yet. When Plausible
    // or the WhatsApp widget lands, add that origin here deliberately rather
    // than loosening this to '*'.
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ].join('; ')
}

export function securityHeaders({ dev }: { dev: boolean }): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    ['Content-Security-Policy', contentSecurityPolicy({ dev })],
    // frame-ancestors covers modern browsers; this covers the rest.
    ['X-Frame-Options', 'DENY'],
    ['X-Content-Type-Options', 'nosniff'],
    // Do not leak which enquiry page a visitor came from to another origin.
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()'],
    ['X-DNS-Prefetch-Control', 'off'],
  ]

  if (!dev) {
    headers.push([
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    ])
  }

  return headers
}
