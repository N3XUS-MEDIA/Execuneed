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

export type ActionError = {
  code: 'VALIDATION' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'CONFLICT'
  message: string
  fields?: Record<string, string>
}
