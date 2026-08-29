import type { ActionError } from '@/contracts/types'

/**
 * P1-L-017 — one shape for every server action failure.
 *
 * Deliberately dumb: no vendor SDK in P1. When observability lands, this is the
 * single place that changes.
 */
export function actionError(
  code: ActionError['code'],
  message: string,
  fields?: Record<string, string>,
): ActionError {
  return fields ? { code, message, fields } : { code, message }
}

export class ActionFailure extends Error {
  readonly error: ActionError
  constructor(error: ActionError) {
    super(error.message)
    this.name = 'ActionFailure'
    this.error = error
  }
}

export function fail(
  code: ActionError['code'],
  message: string,
  fields?: Record<string, string>,
): never {
  throw new ActionFailure(actionError(code, message, fields))
}

/**
 * Log a failure without ever writing personal data to the log stream.
 * POPIA: logs are not a lawful place to accumulate client detail.
 */
export function logActionError(action: string, error: unknown): ActionError {
  const known = error instanceof ActionFailure ? error.error : null
  const safe: ActionError = known ?? {
    code: 'VALIDATION',
    message: 'Unexpected error',
  }

  console.error(
    JSON.stringify({
      at: 'server-action',
      action,
      code: safe.code,
      // Field *names* only. Never their values.
      fields: safe.fields ? Object.keys(safe.fields) : undefined,
    }),
  )

  return safe
}
