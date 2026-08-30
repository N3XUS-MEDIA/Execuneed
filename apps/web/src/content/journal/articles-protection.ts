import type { JournalArticle } from './types'

export const protectionArticles: JournalArticle[] = [
  {
    slug: 'income-protection-and-an-emergency-fund',
    title: 'An emergency fund and income protection solve different problems',
    standfirst:
      'One covers a broken geyser. The other covers a year off work. Households often build the first and assume it does the job of the second.',
    question: 'Do I need income protection if I have savings?',
    category: 'Protection',
    updated: '2026-08-30',
    readingMinutes: 5,
    sections: [
      {
        heading: 'The difference is duration, not size',
        paragraphs: [
          'An emergency fund is money you hold in an accessible account for the unplanned but survivable: a car repair, an excess, a month between jobs. Its job is liquidity.',
          'Income protection is insurance against your ability to earn stopping — through illness or injury — for a long time. Its job is replacing a salary, month after month, for as long as the policy provides and the condition lasts.',
          'The reason one cannot do the other’s work is arithmetic. Three months of expenses in a savings account is a genuinely good position to be in. It is also three months. A back injury that keeps someone out of work for a year is a different order of problem.',
        ],
      },
      {
        heading: 'What income protection is actually built around',
        paragraphs: [
          'Policies vary, and the terms below are where the differences live rather than in the headline amount.',
        ],
        list: [
          'The waiting period: how long you must be unable to work before the policy starts paying.',
          'The definition of disability: whether it is measured against your own occupation, a similar occupation, or any occupation at all. This is usually the single most important clause.',
          'The benefit period: whether it pays for two years, or to retirement age.',
          'Whether the benefit escalates, and how, over a long claim.',
          'How it interacts with any group cover you already have through an employer.',
        ],
      },
      {
        heading: 'Lump sum cover is a third thing again',
        paragraphs: [
          'Life cover, disability lump sums and severe illness cover all pay once. Income protection pays monthly. They are not alternatives to each other; they answer different questions.',
          'A lump sum is suited to obligations that end — settling a bond, funding a child through school. A monthly benefit is suited to the household’s running costs, which do not stop because someone is ill.',
        ],
      },
      {
        heading: 'Where the numbers come from',
        paragraphs: [
          'A sensible starting point is not a product. It is a page with what the household actually spends each month, what would still have to be paid if one income stopped, and what is already in place — including cover through an employer, which people routinely forget they have.',
          'That page is what a review is for. What sits on top of it is a decision for a licensed representative who has seen it.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the difference between income protection and disability cover?',
        a: 'Income protection pays a monthly benefit while you are unable to work. A disability lump sum pays a single amount on a defined event. They answer different questions — ongoing running costs versus a one-off obligation — and are often held together.',
      },
      {
        q: 'Does the cover through my employer count?',
        a: 'It counts, and it should be part of any calculation. Group arrangements differ in their definitions, their benefit periods and what happens when you leave that employer, so it is worth knowing the detail rather than assuming it is equivalent to individual cover.',
      },
      {
        q: 'How much of my income can be covered?',
        a: 'Insurers cap the benefit at a proportion of earnings rather than the full amount, so there is an incentive to return to work. The exact proportion depends on the insurer and the structure.',
      },
      {
        q: 'How big should an emergency fund be?',
        a: 'The common rule of thumb is a few months of expenses, but the right answer depends on how stable your income is and what other cover you hold. It is a planning question, not a product one.',
      },
    ],
    claims: [],
    approvalRef: null,
    related: ['buying-a-home-and-updating-your-cover', 'changing-jobs-and-the-cover-you-had-at-work'],
  },
  {
    slug: 'changing-jobs-and-the-cover-you-had-at-work',
    title: 'Changing jobs: what happens to the cover you had at work',
    standfirst:
      'Group life, disability cover, the medical aid subsidy and the retirement fund all sit with the employer. Three of them stop on your last day.',
    question: 'What happens to my group life cover and pension when I resign?',
    category: 'Life events',
    updated: '2026-08-30',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Cover you did not buy, and did not notice',
        paragraphs: [
          'Most people in formal employment in South Africa hold more cover than they think, and almost none of it is in their own name. Group life, group disability and sometimes severe illness cover are arranged by the employer, paid through payroll, and rarely looked at.',
          'The important characteristic of all of it is that it belongs to the employment relationship, not to you. When the employment ends, so does the cover — usually on the last day, sometimes at the end of that month.',
        ],
      },
      {
        heading: 'The four things to check before you resign',
        paragraphs: ['Each of these behaves differently, and the gap between jobs is where the risk sits.'],
        list: [
          'Group life and disability cover. Ends with employment. Some schemes allow a continuation option to an individual policy without new medical underwriting, but there is normally a short window to exercise it — often measured in weeks.',
          'Medical scheme membership. If the scheme membership was through the employer, it ends too. A break in cover is what creates waiting periods and, after 35, counts towards a late joiner penalty.',
          'The retirement fund. Your benefit does not disappear; it becomes a decision. The options and their tax treatment are the part worth understanding before anyone signs a withdrawal form.',
          'Anything the employer subsidised. A subsidy is not the same as the underlying product, and the product may continue at full cost without anyone telling you.',
        ],
      },
      {
        heading: 'The retirement fund decision is the expensive one',
        paragraphs: [
          'On leaving an employer you can generally preserve the benefit — in the new employer’s fund, in a preservation fund, or in a retirement annuity — or take some or all of it in cash.',
          'Taking cash is taxed on the withdrawal table, which is far less generous than the retirement table, and it uses up part of a lifetime allowance that would otherwise have been available at retirement. The cost is not only the tax paid now; it is the tax rate that applies to a later withdrawal.',
          'This is the single decision on this list where the difference between a good and a poor choice is measured in years of contributions, and it is made in the same week as a resignation letter, a handover and a house move.',
        ],
      },
      {
        heading: 'A continuation option is time-limited',
        paragraphs: [
          'Where a group risk policy allows conversion to individual cover without medical underwriting, that right typically lapses within a set period of leaving. Someone whose health has changed since they took the job may find it is the only cover available to them at a reasonable rate, and it is very easy to miss the deadline while starting a new role.',
          'It is worth asking the question — in writing, to HR or the fund administrator — before the last day rather than after it.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does my group life cover continue after I resign?',
        a: 'Generally no. Group risk cover is tied to employment and ends with it. Some policies offer a continuation option to individual cover without new medical underwriting, but it has to be exercised within a limited window after leaving.',
      },
      {
        q: 'Should I cash in my pension when I change jobs?',
        a: 'Whether to preserve or withdraw is a decision with significant tax consequences in both directions, and it depends on your circumstances. It is exactly the kind of question to put to a licensed representative before signing anything.',
      },
      {
        q: 'What happens to my medical aid if it was through my employer?',
        a: 'If the membership was arranged by the employer it normally ends with employment. A break in medical scheme cover can create waiting periods on a future scheme and, from age 35, contributes to a late joiner penalty, so continuity is worth planning rather than assuming.',
      },
      {
        q: 'How long do I have to make these decisions?',
        a: 'It varies by fund and by policy, and the windows are usually short. Ask for the specific deadlines in writing before your last day.',
      },
    ],
    claims: [],
    approvalRef: null,
    figuresNote:
      'Withdrawal and retirement tax tables and the treatment of retirement fund benefits are set by legislation and change. Confirm the current tables before relying on them.',
    related: ['retirement-annuities-before-the-tax-year-end', 'income-protection-and-an-emergency-fund'],
  },
]
