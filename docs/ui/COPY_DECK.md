# Copy deck — P1

Tone: calm, Cape Town professional, family-first. No scare tactics. No fake urgency.

`status`: final | NEEDS_LEGAL | NEEDS_APPROVAL

## Shared

| key | status | copy |
|---|---|---|
| brand.name | final | Execuneed |
| brand.tagline | final | Turning financial complexity into clarity, confidence, and long-term security for families. |
| nav.home | final | Home |
| nav.how | final | How we work |
| nav.services | final | Services |
| nav.review | final | Cover review |
| nav.journal | final | Journal |
| nav.contact | final | Contact |
| cta.review | final | Book a complimentary cover review |
| cta.whatsapp | final | Message us on WhatsApp |
| cta.call | final | Call 021 552 8989 |
| footer.disclaimer | NEEDS_LEGAL | See docs/compliance/DISCLAIMERS.md |
| whatsapp.prefill | final | Hello, I would like to book a cover review. |

## Home

| key | status | copy |
|---|---|---|
| home.hero.title | final | Clarity for the life you are building. |
| home.hero.body | final | Most families only discover a gap at a claim, a diagnosis, or a life event. We review what you already have, explain it in plain language, and help you act with a licensed adviser. |
| home.hero.secondary | final | Cape Town families and professionals. Discovery products, explained properly. |
| home.problem.title | final | Cover that looked fine on paper often is not. |
| home.problem.body | final | Policies drift. Families change. Integration benefits go unused. A structured review is the shortest path to certainty. |
| home.process.title | final | A review, not a pitch. |
| home.proof.title | final | In practice since 1985. |
| home.proof.body | final | Execuneed is a Cape Town practice working with families across Century City, Melkbosstrand, and the Atlantic seaboard. |

## How we work

| key | status | copy |
|---|---|---|
| how.s1 | final | Tell us what is on your mind. Cover, medical aid, retirement, or a second opinion. |
| how.s2 | final | We collect the minimum we need and book a conversation with an adviser. |
| how.s3 | final | You leave with a clear picture of gaps, overlaps, and next steps. |
| how.s4 | final | If you proceed, we handle the administration and keep the file in order. |
| how.note | final | We do not give product recommendations through this website or through chat. Advice happens with a licensed representative. |

## Services

| key | status | copy |
|---|---|---|
| svc.intro | final | We help families put the right protection, healthcare, investments, and banking tools in place — then keep them reviewed. |
| svc.health.title | final | Medical aid and gap cover |
| svc.health.body | final | Understand plan fit for your household and the role of gap cover. Any plan comparison is done with an adviser. |
| svc.life.title | final | Life, income, and severe illness |
| svc.life.body | final | Protection that matches dependants, debt, and the income the household actually needs. |
| svc.invest.title | final | Retirement and investments |
| svc.invest.body | final | Long-term structures discussed against your goals. Not a product catalogue. |
| svc.insure.title | final | Car and home |
| svc.insure.body | final | Short-term cover reviewed alongside the rest of the household file. |
| svc.bank.title | final | Banking and Vitality |
| svc.bank.body | NEEDS_APPROVAL | Do not state discount percentages or travel percentages until Discovery marketing approval is stored. Use: We can help you explore Discovery Bank and Vitality as part of a wider review. |
| svc.group.title | final | Employers |
| svc.group.body | final | Group risk and staff benefits conversations for Cape Town businesses. |

## Cover review

| key | status | copy |
|---|---|---|
| review.title | final | Complimentary cover review |
| review.body | final | A structured look at what you have, what has changed, and what still needs a decision. No obligation. |
| review.who | final | Useful if you have not reviewed cover in a year, you have a new child or bond, you are on Discovery already, or you are not sure your income is protected. |
| review.next | final | Send the form. We will reply on WhatsApp or phone during office hours. High-priority reviews are picked up the same morning where we can. |

## Contact

| key | status | copy |
|---|---|---|
| contact.phone | final | 021 552 8989 |
| contact.hours | final | Weekdays 08:00–17:00 SAST |
| contact.areas | final | Century City and Melkbosstrand, servicing greater Cape Town. |
| contact.address.century | final | Bridgeway, Century City, Cape Town |
| contact.address.melkbos | final | Atlantic Beach Golf Estate, Melkbosstrand |

## Form

| key | status | copy |
|---|---|---|
| form.firstName | final | First name |
| form.lastName | final | Last name |
| form.mobile | final | Mobile number |
| form.email | final | Email (optional) |
| form.suburb | final | Suburb |
| form.intent | final | What do you need? |
| form.message | final | Anything we should know? |
| form.existing | final | Do you already have Discovery products? |
| form.consent.enquiry | final | Please contact me about this enquiry. |
| form.consent.marketing | final | You may also send me occasional planning notes and offers. I can opt out anytime. |
| form.consent.channels | final | Preferred channels |
| form.submit | final | Request a review |
| form.error.enquiry | final | We need your permission to contact you about this enquiry. |
| form.thanks.title | final | We have the request. |
| form.thanks.body | final | An adviser or Denise will come back to you. If it is urgent, use WhatsApp now. |

## Site concierge

Every sentence the concierge is able to say. It is a fixed script with no model
behind it, so this table is exhaustive — implemented in
`apps/web/src/content/concierge.ts`.

| key | status | copy |
|---|---|---|
| concierge.launcher | final | Ask Execuneed |
| concierge.title | final | Execuneed |
| concierge.subtitle | final | Here to get you to the right person |
| concierge.disclaimer | final | From docs/compliance/DISCLAIMERS.md §Public AI, verbatim |
| concierge.greeting | final | Hello. I can book you a complimentary cover review, point you at the right page, or put you through to the practice. |
| concierge.limits | final | I cannot answer questions about products, premiums or which plan suits you. Those need a licensed adviser who has seen your details. |
| concierge.options.book | final | Book a cover review |
| concierge.options.services | final | What do you help with? |
| concierge.options.talk | final | Talk to someone |
| concierge.refusal | final | I am not able to answer that here — I would be guessing, and this is the sort of question a licensed adviser should answer with your details in front of them. |
| concierge.refusalOffer | final | I can have someone call you about it. Would that help? |
| concierge.capture.submit | final | Send this to the practice |
| concierge.capture.consent.enquiry | final | Same as form.consent.enquiry — the deck string, not a paraphrase |
| concierge.capture.consent.marketing | final | Same as form.consent.marketing — the deck string, not a paraphrase |

The refusal does not vary with the question. Varying it is how a script starts
sounding like it knows the answer.

## Admin chrome

| key | status | copy |
|---|---|---|
| admin.leads | final | Leads |
| admin.households | final | Households |
| admin.tasks | final | Tasks |
| admin.empty.leads | final | No leads yet. The cover review form writes here. |
| admin.consent.marketing.yes | final | Marketing opt-in |
| admin.consent.marketing.no | final | Enquiry only |

## Legal page titles (bodies NEEDS_LEGAL)

Privacy Policy. PAIA manual stub. Terms of use. Complaints process. Conflict of interest. Disclosures. Cookie policy.

Do not invent statute text. Use short “this page will be completed with the practice’s approved wording” until Lead pastes confirmed copy.
