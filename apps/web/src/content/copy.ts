/**
 * P0-S-004 — typed copy deck. Mirrors docs/ui/COPY_DECK.md.
 *
 * Pages import from here rather than inlining strings, so a copy change is one
 * edit and compliance can review a single file.
 *
 * Anything that states a Discovery benefit, premium or discount does NOT live
 * here as final copy — it goes through the `NeedsApproval` component.
 */
export const copy = {
  brand: {
    name: 'Execuneed',
    tagline:
      'Turning financial complexity into clarity, confidence, and long-term security for families.',
  },
  nav: {
    home: 'Home',
    how: 'How we work',
    services: 'Services',
    review: 'Cover review',
    contact: 'Contact',
  },
  cta: {
    review: 'Book a complimentary cover review',
    whatsapp: 'Message us on WhatsApp',
    call: 'Call 021 552 8989',
  },
  whatsapp: {
    prefill: 'Hello, I would like to book a cover review.',
  },
  home: {
    hero: {
      title: 'Clarity for the life you are building.',
      body: 'Most families only discover a gap at a claim, a diagnosis, or a life event. We review what you already have, explain it in plain language, and help you act with a licensed adviser.',
      secondary: 'Cape Town families and professionals. Discovery products, explained properly.',
    },
    problem: {
      title: 'Cover that looked fine on paper often is not.',
      body: 'Policies drift. Families change. Integration benefits go unused. A structured review is the shortest path to certainty.',
    },
    process: { title: 'A review, not a pitch.' },
    proof: {
      title: 'In practice since 1985.',
      body: 'Execuneed is a Cape Town practice working with families across Century City, Melkbosstrand, and the Atlantic seaboard.',
    },
  },
  how: {
    steps: [
      'Tell us what is on your mind. Cover, medical aid, retirement, or a second opinion.',
      'We collect the minimum we need and book a conversation with an adviser.',
      'You leave with a clear picture of gaps, overlaps, and next steps.',
      'If you proceed, we handle the administration and keep the file in order.',
    ],
    note: 'We do not give product recommendations through this website or through chat. Advice happens with a licensed representative.',
  },
  services: {
    intro:
      'We help families put the right protection, healthcare, investments, and banking tools in place — then keep them reviewed.',
    items: [
      {
        key: 'health',
        title: 'Medical aid and gap cover',
        body: 'Understand plan fit for your household and the role of gap cover. Any plan comparison is done with an adviser.',
      },
      {
        key: 'life',
        title: 'Life, income, and severe illness',
        body: 'Protection that matches dependants, debt, and the income the household actually needs.',
      },
      {
        key: 'invest',
        title: 'Retirement and investments',
        body: 'Long-term structures discussed against your goals. Not a product catalogue.',
      },
      {
        key: 'insure',
        title: 'Car and home',
        body: 'Short-term cover reviewed alongside the rest of the household file.',
      },
      {
        // NEEDS_APPROVAL in the deck. No discount or travel percentages until a
        // Discovery Marketing Support reference is stored. This is the generic
        // fallback and makes no product claim.
        key: 'bank',
        title: 'Banking and Vitality',
        body: 'We can help you explore Discovery Bank and Vitality as part of a wider review.',
      },
      {
        key: 'group',
        title: 'Employers',
        body: 'Group risk and staff benefits conversations for Cape Town businesses.',
      },
    ],
  },
  review: {
    title: 'Complimentary cover review',
    body: 'A structured look at what you have, what has changed, and what still needs a decision. No obligation.',
    who: 'Useful if you have not reviewed cover in a year, you have a new child or bond, you are on Discovery already, or you are not sure your income is protected.',
    next: 'Send the form. We will reply on WhatsApp or phone during office hours. High-priority reviews are picked up the same morning where we can.',
  },
  contact: {
    phone: '021 552 8989',
    hours: 'Weekdays 08:00–17:00 SAST',
    areas: 'Century City and Melkbosstrand, servicing greater Cape Town.',
    addressCentury: 'Bridgeway, Century City, Cape Town',
    addressMelkbos: 'Atlantic Beach Golf Estate, Melkbosstrand',
  },
  form: {
    firstName: 'First name',
    lastName: 'Last name',
    mobile: 'Mobile number',
    email: 'Email (optional)',
    suburb: 'Suburb',
    intent: 'What do you need?',
    message: 'Anything we should know?',
    existing: 'Do you already have Discovery products?',
    consentEnquiry: 'Please contact me about this enquiry.',
    consentMarketing:
      'You may also send me occasional planning notes and offers. I can opt out anytime.',
    consentChannels: 'Preferred channels',
    submit: 'Request a review',
    errorEnquiry: 'We need your permission to contact you about this enquiry.',
    thanksTitle: 'We have the request.',
    thanksBody:
      'An adviser or Denise will come back to you. If it is urgent, use WhatsApp now.',
  },
  admin: {
    leads: 'Leads',
    households: 'Households',
    tasks: 'Tasks',
    emptyLeads: 'No leads yet. The cover review form writes here.',
    consentMarketingYes: 'Marketing opt-in',
    consentMarketingNo: 'Enquiry only',
  },
  legal: {
    // NEEDS_LEGAL. Statute text is never invented — see docs/ui/COPY_DECK.md.
    placeholder:
      'This page will be completed with the practice’s approved wording. If you need this information now, please contact us.',
  },
} as const

/** Intent options for the public form, in the order they should be shown. */
export const intentOptions = [
  { value: 'cover_review', label: 'A review of my current cover' },
  { value: 'medical_aid', label: 'Medical aid or gap cover' },
  { value: 'life', label: 'Life or severe illness cover' },
  { value: 'income', label: 'Income protection' },
  { value: 'invest_ra', label: 'Retirement or investments' },
  { value: 'insure', label: 'Car or home insurance' },
  { value: 'bank', label: 'Banking and Vitality' },
  { value: 'employer', label: 'Cover for my business or staff' },
  { value: 'service', label: 'Help with an existing policy' },
] as const
