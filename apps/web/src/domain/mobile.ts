/**
 * South African mobile numbers, stored as E.164.
 *
 * docs/plan/CONTRACTS.md: "mobile — South African mobile, store as E.164".
 * One canonical format matters more than usual here: the number is the key
 * Denise matches a WhatsApp thread against, and 082 555 1234 / +27825551234 /
 * 0027825551234 must not become three different people.
 */

const SA_MOBILE_PREFIXES = ['6', '7', '8']

/** Returns +27XXXXXXXXX, or null if this is not a valid SA mobile. */
export function toE164(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null

  let digits = raw.replace(/[\s().-]/g, '')

  if (digits.startsWith('+')) digits = digits.slice(1)
  else if (digits.startsWith('00')) digits = digits.slice(2)

  if (!/^\d+$/.test(digits)) return null

  // 0821234567 -> 27821234567
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = `27${digits.slice(1)}`
  }
  // 821234567 -> 27821234567
  else if (digits.length === 9 && SA_MOBILE_PREFIXES.includes(digits[0]!)) {
    digits = `27${digits}`
  }

  if (digits.length !== 11 || !digits.startsWith('27')) return null

  const subscriber = digits.slice(2)
  if (!SA_MOBILE_PREFIXES.includes(subscriber[0]!)) return null

  return `+${digits}`
}

export function isSaMobile(input: string): boolean {
  return toE164(input) !== null
}
