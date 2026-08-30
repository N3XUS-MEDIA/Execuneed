import { copy } from './copy'
import { productCategories } from './products'

/**
 * Every sentence the site concierge is able to say.
 *
 * It is a fixed script. There is no model behind it, no retrieval, and no
 * generated text of any kind — so there is exactly one file to read to know
 * what it can tell a member of the public, and it is this one.
 *
 * That is deliberate rather than a shortcut. `P2-L-070` scopes the concierge as
 * capture, booking, and answering **only** from content that has a stored
 * Discovery Marketing Support approval reference. There is no approved corpus
 * (docs/compliance/DISCOVERY_APPROVALS.md — nothing has been submitted), so the
 * answering half has nothing to read. Until it does, every question that is not
 * "how do I get hold of you" is refused and routed to a licensed
 * representative, which is what the ticket says the default should be anyway.
 *
 * What a visitor types is never answered. It is carried into the enquiry as the
 * message, so the person who calls them back has already read the question.
 */

/** docs/compliance/DISCLAIMERS.md §Public AI — required on this surface. */
export const CONCIERGE_DISCLAIMER =
  'This assistant shares general information only. It is not financial advice ' +
  'and does not recommend products. A licensed representative of Execuneed ' +
  'must review your circumstances before any recommendation is made.'

export const concierge = {
  /** Accessible name of the launcher. It is the icon and nothing else. */
  launcherLabel: 'Ask Execuneed',
  launcherClose: 'Close Execuneed assistant',
  title: 'Execuneed',
  subtitle: 'Here to get you to the right person',

  greeting:
    'Hello. I can book you a complimentary cover review, point you at the right page, or put you through to the practice.',

  /** What it will not do, said before anyone asks. */
  limits:
    'I cannot answer questions about products, premiums or which plan suits you. Those need a licensed adviser who has seen your details.',

  options: {
    book: 'Book a cover review',
    services: 'What do you help with?',
    talk: 'Talk to someone',
  },

  /**
   * The single response to anything typed. It does not vary with the question,
   * because varying it is how a script starts sounding like it knows the
   * answer.
   */
  refusal:
    'I am not able to answer that here — I would be guessing, and this is the sort of question a licensed adviser should answer with your details in front of them.',
  refusalOffer: 'I can have someone call you about it. Would that help?',
  refusalAccept: 'Yes, please call me',
  refusalDecline: 'No thanks',
  declined: 'No problem. The practice is on {phone} during office hours if you change your mind.',

  services: {
    intro: 'These are the areas a review looks at. Each page explains what is covered.',
    outro:
      'Nothing on those pages is advice or a recommendation. Plan names, benefits and premiums are discussed with a licensed representative who has looked at your circumstances.',
  },

  talk: {
    body: `The practice answers during office hours — ${copy.contact.hours}.`,
    call: copy.cta.call,
    whatsapp: copy.cta.whatsapp,
  },

  capture: {
    intro: 'I need three things, and then someone will come back to you.',
    questionLabel: 'What you asked',
    submit: 'Send this to the practice',
    sending: 'Sending…',
    blocked: copy.form.errorEnquiry,
    // The two consents are the deck's, verbatim, and are two separate boxes
    // here for the same reason they are two on the form.
    consentEnquiry: copy.form.consentEnquiry,
    consentMarketing: copy.form.consentMarketing,
    enquiryHint: 'Required — it is how we answer you.',
    marketingHint:
      'Entirely separate from the box above. Leave it unticked and we will only answer your enquiry.',
    privacy:
      'We use these details to answer your enquiry and to arrange a conversation with a licensed adviser. No advice is given through this assistant.',
  },

  sent: {
    title: copy.form.thanksTitle,
    body: copy.form.thanksBody,
    urgent: `If it is urgent, call ${copy.contact.phone}.`,
  },

  failed: 'That did not send. Please try again, or call the practice on {phone}.',
} as const

/** The six areas, as the concierge offers them. No claims, links only. */
export const conciergeServices = productCategories.map((c) => ({
  slug: c.slug,
  title: c.title,
  href: `/services/${c.slug}`,
}))
