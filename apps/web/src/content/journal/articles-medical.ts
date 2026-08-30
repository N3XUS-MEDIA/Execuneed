import type { JournalArticle } from './types'

export const medicalArticles: JournalArticle[] = [
  {
    slug: 'changing-medical-aid-in-october',
    title: 'Why medical aid decisions happen in October',
    standfirst:
      'South African medical schemes work on a calendar year, which puts almost every option change into a short window at the end of it.',
    question: 'When can I change my medical aid option?',
    category: 'Medical aid',
    updated: '2026-08-30',
    readingMinutes: 5,
    sections: [
      {
        heading: 'The scheme year, not your year',
        paragraphs: [
          'Medical schemes registered in South Africa run on the calendar year. Contributions and benefits are set for January to December, and schemes publish the following year’s contributions and benefit changes towards the end of the current one — usually from about October.',
          'That timing is why the conversation always seems to arrive in the same few weeks. It is not a sales season. It is the only point in the year when a member can normally move between options on the same scheme without a reason such as a change in employment or family circumstances.',
        ],
      },
      {
        heading: 'What actually changes on 1 January',
        paragraphs: [
          'Two things move at once, and it is worth separating them.',
        ],
        list: [
          'The contribution. What you pay each month for the option you are already on.',
          'The benefits. What the option covers, the annual limits that apply, and how the savings or day-to-day portion works.',
          'The rules around networks and designated service providers, which decide where you can be treated without a co-payment.',
        ],
      },
      {
        heading: 'Moving option versus moving scheme',
        paragraphs: [
          'Changing to a different option within the same scheme is the simpler move. You stay a member, your history stays intact, and in most cases no new waiting periods apply.',
          'Changing to a different scheme is a different exercise. You are a new member there. Depending on how long you have been on a scheme without a break, a new scheme may apply a general waiting period, or a condition-specific waiting period on something you are already being treated for. Prescribed Minimum Benefits still have to be covered, but they are a floor, not a substitute for the cover you had.',
          'Neither of those is a reason to avoid moving. They are reasons to look at the detail before you do, rather than in February when a claim is declined.',
        ],
      },
      {
        heading: 'The questions worth having answered before you decide',
        paragraphs: [
          'A useful review is mostly a list of specifics about your household rather than a comparison of brochures.',
        ],
        list: [
          'What did you actually claim for in the past two years, and what did you pay out of pocket?',
          'Is anyone in the household being treated for a chronic condition, and is it on the scheme’s chronic list?',
          'Are the specialists and the hospital you would use in the option’s network?',
          'Is there anything planned for next year — a birth, a procedure, a move — that changes what you need?',
          'If you have gap cover, does the option you are considering change the shortfall it is there to absorb?',
        ],
      },
      {
        heading: 'Late joiner penalties',
        paragraphs: [
          'If you join a medical scheme for the first time after age 35, having not been a member of a South African scheme for a period before that, a scheme may apply a late joiner penalty. It is a permanent addition to your contribution, calculated on the number of uncovered years.',
          'This matters mostly for people who dropped scheme membership for a few years and are considering going back. It is worth understanding the number before you make the decision, not after.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I change my medical aid option at any time of year?',
        a: 'Usually not. Most South African schemes allow option changes with effect from 1 January and ask for the instruction before their published cut-off, which is typically in the last quarter. Changes outside that window are normally limited to specific life events, such as a change of employment or adding a dependant.',
      },
      {
        q: 'Will I have waiting periods if I move to a different scheme?',
        a: 'You may. A new scheme can apply a general waiting period and a condition-specific waiting period, depending on how long you have had continuous cover. Moving between options on the same scheme does not usually create new waiting periods. The scheme rules are what decide it, so check them for the specific move you are considering.',
      },
      {
        q: 'What is a late joiner penalty?',
        a: 'A permanent increase to your monthly contribution that a scheme may apply if you join after age 35 without having had prior South African medical scheme cover. It is calculated on the number of years you were not covered.',
      },
      {
        q: 'Is the cheapest option the right one?',
        a: 'That is not a question that can be answered in general. It depends on what your household claims for, who is being treated for what, and where you would want to be treated. It is the sort of question to put to a licensed adviser who can look at your circumstances.',
      },
    ],
    claims: [],
    approvalRef: null,
    figuresNote:
      'Late joiner penalties and waiting periods are governed by the Medical Schemes Act and by individual scheme rules, both of which change. Confirm the current position for the specific scheme before acting.',
    related: ['gap-cover-and-hospital-plans', 'changing-jobs-and-the-cover-you-had-at-work'],
  },
  {
    slug: 'gap-cover-and-hospital-plans',
    title: 'Gap cover and hospital plans are not the same thing',
    standfirst:
      'One is a medical scheme option. The other is a short-term insurance policy that sits alongside it. Confusing them is how people end up with a bill they did not expect.',
    question: 'What is the difference between gap cover and a hospital plan?',
    category: 'Medical aid',
    updated: '2026-08-30',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Two different products under two different laws',
        paragraphs: [
          'A hospital plan is an option on a registered medical scheme. It is regulated under the Medical Schemes Act, it is not risk-rated by your health, and it covers in-hospital treatment according to the scheme’s rules and tariffs.',
          'Gap cover is a short-term insurance policy. It is regulated as insurance, not as a medical scheme, and it exists to cover the shortfall between what a healthcare provider charges and what your scheme pays. It is not a substitute for medical scheme membership, and in South Africa it cannot be sold as one.',
        ],
      },
      {
        heading: 'Where the shortfall comes from',
        paragraphs: [
          'Medical schemes pay in-hospital specialist accounts at a rate set in their rules. Specialists are not obliged to charge that rate. When a surgeon or anaesthetist charges more than the scheme pays, the difference falls to the member.',
          'The gap is not usually a small percentage. It is the reason someone with perfectly good hospital cover can still receive an account after a planned procedure, and it is why the two products are usually discussed together.',
        ],
      },
      {
        heading: 'What gap cover typically deals with',
        paragraphs: [
          'Policies differ, and the wording is what matters. Broadly, this category of cover is built around a few situations.',
        ],
        list: [
          'The shortfall between a specialist’s in-hospital account and the scheme tariff.',
          'Co-payments and deductibles the scheme applies to specific procedures or scans.',
          'Sub-limits, where a scheme covers a category of treatment only up to a stated annual amount.',
        ],
      },
      {
        heading: 'The limits that matter',
        paragraphs: [
          'Gap cover is capped. South African regulation sets a maximum annual amount that this category of policy may pay per person, and policies also carry their own waiting periods and exclusions — commonly for pre-existing conditions in the first months.',
          'It also only ever pays alongside a medical scheme. If scheme membership lapses, the gap policy has nothing to sit against.',
        ],
      },
      {
        heading: 'How to compare two of them properly',
        paragraphs: [
          'Almost every meaningful difference between gap policies is in the wording rather than the premium.',
        ],
        list: [
          'What multiple of the scheme rate does it pay up to?',
          'Does it cover co-payments and deductibles, or only the specialist shortfall?',
          'What are the waiting periods, and how are pre-existing conditions handled?',
          'Is there an overall annual limit per person, and how close would a single large admission come to it?',
          'What is excluded outright?',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I have gap cover without a medical aid?',
        a: 'No. Gap cover is designed to pay the difference between what a provider charges and what a medical scheme pays. Without scheme membership there is nothing for it to sit against, and it is not a substitute for a medical scheme.',
      },
      {
        q: 'Does gap cover pay for day-to-day expenses like GP visits?',
        a: 'Generally no. This category of cover is built around in-hospital shortfalls, co-payments and sub-limits. Some policies extend to specific out-of-hospital items, but that is a policy-by-policy question and the wording decides it.',
      },
      {
        q: 'Is there a limit on how much gap cover can pay?',
        a: 'Yes. South African regulation caps the annual amount this category of policy may pay per insured person, and individual policies apply their own limits, waiting periods and exclusions on top of that.',
      },
      {
        q: 'Do I need gap cover?',
        a: 'That depends on your scheme option, what it pays specialists, your household’s health, and what you could absorb if an account arrived. It is a question for a licensed adviser looking at your circumstances rather than one with a general answer.',
      },
    ],
    claims: [],
    approvalRef: null,
    figuresNote:
      'The annual cap on gap cover is set by regulation and is adjusted from time to time. Confirm the current amount before quoting it.',
    related: ['changing-medical-aid-in-october', 'how-discovery-integration-works'],
  },
]
