/**
 * P1-L-013 — when a lead must be touched by a human.
 *
 * docs/plan/CONTRACTS.md:
 *   score >= 7 → now + 15 minutes during 08:00–17:00 SAST weekdays,
 *                else next weekday 08:15 SAST
 *   score <  7 → now + 4 business hours
 *
 * SAST is UTC+2 year round with no daylight saving, so the arithmetic is a
 * fixed offset rather than a timezone database lookup.
 */

const SAST_OFFSET_MS = 2 * 60 * 60 * 1000
const OPEN_HOUR = 8
const CLOSE_HOUR = 17
const FOUR_BUSINESS_HOURS_MS = 4 * 60 * 60 * 1000

export const HIGH_PRIORITY_SCORE = 7

/** A Date shifted into SAST wall-clock, readable with the UTC getters. */
function toSast(d: Date): Date {
  return new Date(d.getTime() + SAST_OFFSET_MS)
}

function fromSast(d: Date): Date {
  return new Date(d.getTime() - SAST_OFFSET_MS)
}

function isWeekend(sast: Date): boolean {
  const day = sast.getUTCDay()
  return day === 0 || day === 6
}

function isWithinOfficeHours(sast: Date): boolean {
  if (isWeekend(sast)) return false
  const hour = sast.getUTCHours()
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR
}

/** Start of the next weekday at the given SAST hour and minute. */
function nextWeekdayAt(sast: Date, hour: number, minute: number): Date {
  const next = new Date(sast)
  next.setUTCDate(next.getUTCDate() + 1)
  next.setUTCHours(hour, minute, 0, 0)
  while (isWeekend(next)) {
    next.setUTCDate(next.getUTCDate() + 1)
  }
  return next
}

/**
 * Move a SAST instant to the next moment the office is open. An instant that
 * is already inside office hours is returned unchanged.
 */
function clampToOfficeHours(sast: Date): Date {
  const cursor = new Date(sast)

  if (isWeekend(cursor)) {
    return nextWeekdayAt(cursor, OPEN_HOUR, 0)
  }
  if (cursor.getUTCHours() < OPEN_HOUR) {
    cursor.setUTCHours(OPEN_HOUR, 0, 0, 0)
    return cursor
  }
  if (cursor.getUTCHours() >= CLOSE_HOUR) {
    return nextWeekdayAt(cursor, OPEN_HOUR, 0)
  }
  return cursor
}

/** Add business milliseconds, skipping evenings and weekends. */
function addBusinessMs(sast: Date, ms: number): Date {
  let cursor = clampToOfficeHours(sast)
  let remaining = ms

  while (remaining > 0) {
    const close = new Date(cursor)
    close.setUTCHours(CLOSE_HOUR, 0, 0, 0)
    const availableToday = close.getTime() - cursor.getTime()

    if (remaining <= availableToday) {
      return new Date(cursor.getTime() + remaining)
    }

    remaining -= availableToday
    cursor = nextWeekdayAt(cursor, OPEN_HOUR, 0)
  }

  return cursor
}

export function slaDueAt(score: number, now = new Date()): Date {
  const sastNow = toSast(now)

  if (score >= HIGH_PRIORITY_SCORE) {
    // 15 minutes, but only while someone is actually at a desk.
    if (isWithinOfficeHours(sastNow)) {
      return fromSast(new Date(sastNow.getTime() + 15 * 60 * 1000))
    }
    // Out of hours. clampToOfficeHours lands on the next working day at
    // exactly 08:00, so 08:15 of that same day is the answer — including the
    // early-morning case, where the right day is today rather than tomorrow.
    const open = clampToOfficeHours(sastNow)
    open.setUTCHours(OPEN_HOUR, 15, 0, 0)
    return fromSast(open)
  }

  return fromSast(addBusinessMs(sastNow, FOUR_BUSINESS_HOURS_MS))
}
