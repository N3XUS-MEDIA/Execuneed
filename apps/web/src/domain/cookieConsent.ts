/**
 * P1-S-061 — cookie preferences.
 *
 * POPIA and the ECT Act separate strictly necessary storage from everything
 * else. The session cookie that keeps Denise signed in is necessary and needs
 * no permission; analytics do.
 *
 * Today the site sets *no* non-essential storage at all — nothing is wired up.
 * This exists so that when Plausible or an ads pixel lands, the gate is
 * already in the code path and cannot be forgotten. A banner that records a
 * choice nothing reads is theatre; `analyticsAllowed` is what stops that.
 *
 * The preference itself is kept in localStorage rather than a cookie, so
 * declining does not require setting a cookie to remember that you declined.
 */

export const COOKIE_CONSENT_KEY = 'execuneed.cookie-consent.v1'

export type CookieChoice = 'accepted' | 'declined'

export type CookieConsent = {
  analytics: CookieChoice
  decidedAt: string
}

export function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>
    if (parsed.analytics !== 'accepted' && parsed.analytics !== 'declined') return null
    if (typeof parsed.decidedAt !== 'string') return null
    return { analytics: parsed.analytics, decidedAt: parsed.decidedAt }
  } catch {
    return null
  }
}

/**
 * The gate. Anything that loads a third-party script or sets non-essential
 * storage must pass through here first. Absence of a decision is not consent.
 */
export function analyticsAllowed(consent: CookieConsent | null): boolean {
  return consent?.analytics === 'accepted'
}
