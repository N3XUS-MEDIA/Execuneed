/**
 * P1-L-009 — household stubs.
 *
 * P1 does not ask who else is in the family, so a household is created as a
 * one-person stub and filled in later by an adviser. Creating it now rather
 * than at first review means the CRM has somewhere to hang documents, tasks
 * and interactions from day one.
 */
export function householdLabel(input: {
  firstName: string
  lastName?: string | null
}): string {
  const last = input.lastName?.trim()
  if (last) return `${last} household`

  const first = input.firstName.trim()
  return first ? `${first} household` : 'Unnamed household'
}
