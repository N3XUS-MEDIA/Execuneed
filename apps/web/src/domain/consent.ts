import type { Channel } from '../contracts/types'

export function assertConsent(input: {
  contactForEnquiry: boolean
  marketing: boolean
  channels: Channel[]
}) {
  if (!input.contactForEnquiry) {
    throw new Error('Enquiry consent required')
  }
  if (input.marketing && input.channels.length === 0) {
    throw new Error('Marketing opt-in requires at least one channel')
  }
}
