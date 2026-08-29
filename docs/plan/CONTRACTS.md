# Contracts — P1

Lead owns this file. Support may only consume what is written here.

When this file changes, Lead posts `contract.changed`.

## Enums

```ts
export type Role = 'superadmin' | 'compliance' | 'adviser' | 'admin' | 'client'

export type LeadSource =
  | 'web'
  | 'whatsapp'
  | 'phone'
  | 'referral'
  | 'ads'
  | 'review_campaign'
  | 'event'

export type LeadIntent =
  | 'cover_review'
  | 'medical_aid'
  | 'life'
  | 'income'
  | 'invest_ra'
  | 'insure'
  | 'bank'
  | 'claim'
  | 'service'
  | 'employer'

export type LeadStatus =
  | 'new'
  | 'qualified'
  | 'booked'
  | 'advice_in_progress'
  | 'submitted'
  | 'won'
  | 'lost'
  | 'nurture'

export type Channel = 'whatsapp' | 'email' | 'phone'

export type TaskStatus = 'open' | 'done' | 'cancelled'

export type InteractionDirection = 'inbound' | 'outbound' | 'system'
```

## Records

```ts
export type OrganisationSettings = {
  id: string
  legalName: string
  tradingName: string
  disclaimer: string
  phoneDisplay: string
  whatsappE164: string
  email: string
  addressLine1: string
  addressLine2: string | null
  city: string
  postalCode: string
  fspNumber: string | null
  ncrNumber: string | null
  discoveryJuristicText: string
}

export type User = {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
}

export type Person = {
  id: string
  householdId: string | null
  firstName: string
  lastName: string | null
  mobile: string
  email: string | null
  suburb: string | null
}

export type Household = {
  id: string
  label: string
}

export type Consent = {
  id: string
  personId: string
  leadId: string | null
  contactForEnquiry: boolean
  marketing: boolean
  channels: Channel[]
  capturedAt: string
  source: string
}

export type Lead = {
  id: string
  personId: string
  householdId: string | null
  source: LeadSource
  intent: LeadIntent
  status: LeadStatus
  message: string | null
  lifeEvents: string[]
  existingDiscovery: boolean | null
  adults: number | null
  children: number | null
  score: number
  slaDueAt: string
  assignedToId: string | null
  createdAt: string
}

export type Task = {
  id: string
  leadId: string | null
  householdId: string | null
  title: string
  status: TaskStatus
  dueAt: string | null
  assigneeId: string | null
}

export type Interaction = {
  id: string
  leadId: string | null
  householdId: string | null
  personId: string | null
  channel: Channel | 'web' | 'system'
  direction: InteractionDirection
  body: string
  createdAt: string
}

export type AuditEvent = {
  id: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string
  meta: Record<string, unknown>
  createdAt: string
}
```

## Public lead input

```ts
export type CreateLeadInput = {
  firstName: string
  lastName?: string
  mobile: string
  email?: string
  suburb?: string
  intent: LeadIntent
  message?: string
  existingDiscovery?: boolean
  adults?: number
  children?: number
  lifeEvents?: string[]
  contactForEnquiry: true
  marketing: boolean
  channels: Channel[]
  source?: LeadSource
}

export type CreateLeadResult = {
  leadId: string
  personId: string
  score: number
}
```

Validation rules:

- `firstName` min 1
- `mobile` South African mobile, store as E.164
- `contactForEnquiry` must be true or reject
- `marketing` default false
- if `marketing` is true, `channels` min 1
- `message` max 2000

## Scoring (pure)

```ts
export function scoreLead(input: {
  intent: LeadIntent
  existingDiscovery: boolean | null
  lifeEvents: string[]
  children: number | null
  bookedBySelf?: boolean
  suburb?: string | null
}): number
```

Weights:

```text
+3 cover_review
+3 existingDiscovery === true
+2 lifeEvents.length > 0
+2 children > 0
+2 intent === 'employer'
+2 bookedBySelf
+1 Cape Town metro suburb match
-2 intent in claim | service
-5 never used in P1 public form (complaints are not this form)
```

Clamp 0–20.

## SLA

```text
score >= 7  → slaDueAt = now + 15 minutes during 08:00–17:00 SAST weekdays,
              else next weekday 08:15 SAST
score < 7   → slaDueAt = now + 4 business hours
```

## Server actions Support may call in P1

```ts
createLeadAction(input: CreateLeadInput): Promise<CreateLeadResult>
listLeadsAction(filter: {
  status?: LeadStatus
  q?: string
}): Promise<Lead[]>
getLeadAction(id: string): Promise<{
  lead: Lead
  person: Person
  consent: Consent | null
  tasks: Task[]
  interactions: Interaction[]
}>
completeTaskAction(id: string): Promise<void>
```

Admin actions require `admin | adviser | compliance | superadmin`.

Support does not add actions. If a screen needs one, post `question`.

## Error shape

```ts
export type ActionError = {
  code: 'VALIDATION' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'CONFLICT'
  message: string
  fields?: Record<string, string>
}
```

## UI flags

```ts
export type CopyTone = 'final' | 'NEEDS_LEGAL' | 'NEEDS_APPROVAL'
```

Any Discovery benefit sentence uses `NEEDS_APPROVAL`.
Any FSP/disclaimer still unconfirmed uses `NEEDS_LEGAL`.
