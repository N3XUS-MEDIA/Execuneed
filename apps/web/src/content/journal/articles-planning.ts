import type { JournalArticle } from './types'

export const planningArticles: JournalArticle[] = [
  {
    slug: 'retirement-annuities-before-the-tax-year-end',
    title: 'Retirement contributions and the end of February',
    standfirst:
      'The South African tax year ends on the last day of February, which is why retirement annuity conversations cluster in January.',
    question: 'Why do people top up their retirement annuity before the end of February?',
    category: 'Retirement',
    updated: '2026-08-30',
    readingMinutes: 5,
    sections: [
      {
        heading: 'The deadline is a tax deadline',
        paragraphs: [
          'South Africa’s tax year for individuals runs from 1 March to the last day of February. Contributions to a retirement fund — a pension fund, a provident fund or a retirement annuity — are deductible against taxable income for the year in which they are made.',
          'A contribution made on 27 February counts towards that tax year. The same contribution made on 2 March counts towards the next one. That single fact is the whole reason for the timing, and it is why the question arrives every January.',
        ],
      },
      {
        heading: 'How the deduction is limited',
        paragraphs: [
          'The deduction is not unlimited. It is capped in two ways at once: as a percentage of income, and by an annual rand amount. Whichever bites first is the one that applies.',
          'Contributions above the cap are not lost. They are carried forward and can be deducted in a later tax year, or set against the tax-free portion of a retirement lump sum. That is worth knowing before someone decides a contribution above the limit is wasted.',
        ],
        list: [
          'A percentage limit, applied to the greater of remuneration or taxable income.',
          'An annual rand cap, applied across all retirement funds together.',
          'Excess contributions roll forward rather than falling away.',
        ],
      },
      {
        heading: 'What a deduction is actually worth',
        paragraphs: [
          'The value of a deduction depends on your marginal rate. The same contribution is worth more to someone in a higher bracket than to someone in a lower one, which is why a rule of thumb about "how much to put in" is not much use without the rest of the picture.',
          'It also has to be weighed against liquidity. Money in a retirement annuity is not generally accessible before the retirement age set in the fund rules, with limited exceptions. A contribution that produces a deduction and then leaves a household short in April has not helped anyone.',
        ],
      },
      {
        heading: 'The part that is not about tax',
        paragraphs: [
          'A February contribution is a tax event. Whether the retirement plan is on track is a separate question, and the more important one.',
          'That question is about what is being contributed monthly, what it is invested in, what it is likely to produce, and the income the household wants at the other end. It cannot be answered in the last week of February, which is an argument for having it in June.',
        ],
      },
    ],
    faqs: [
      {
        q: 'When does the South African tax year end?',
        a: 'The last day of February. Contributions to a retirement fund made on or before that date are deductible against that tax year.',
      },
      {
        q: 'How much of my retirement contribution can I deduct?',
        a: 'The deduction is limited both by a percentage of the greater of your remuneration or taxable income, and by an annual rand cap across all your retirement funds. The current figures are set by SARS and should be confirmed for the tax year in question.',
      },
      {
        q: 'What happens if I contribute more than the limit?',
        a: 'The excess is not lost. It carries forward to future tax years, and can also be set against the tax-free portion of a retirement lump sum later.',
      },
      {
        q: 'Can I access money in a retirement annuity before retirement?',
        a: 'Access before the retirement age in the fund rules is restricted, with limited exceptions set by legislation. This is a material difference from a discretionary investment and is worth understanding before contributing.',
      },
    ],
    claims: [],
    approvalRef: null,
    figuresNote:
      'The percentage limit, the annual rand cap and the retirement tax tables are set by SARS and change. This article deliberately describes the structure rather than stating figures; confirm the current numbers for the relevant tax year before acting on them.',
    related: ['changing-jobs-and-the-cover-you-had-at-work', 'buying-a-home-and-updating-your-cover'],
  },
  {
    slug: 'buying-a-home-and-updating-your-cover',
    title: 'Buying a home changes more of your cover than you expect',
    standfirst:
      'A bond is a long obligation attached to one household. Four separate things usually need looking at, and only one of them is compulsory.',
    question: 'What insurance do I need when I buy a house?',
    category: 'Life events',
    updated: '2026-08-30',
    readingMinutes: 6,
    sections: [
      {
        heading: 'The one the bank insists on',
        paragraphs: [
          'A bond over a property normally requires homeowner’s cover — buildings insurance — as a condition of the loan. It covers the structure, not the contents, and the bank has an interest in it because the structure is its security.',
          'Banks routinely offer their own policy at the point of granting the bond. You are generally entitled to arrange the cover elsewhere provided it meets the bank’s requirements. The convenient option and the appropriate one are not automatically the same, and the difference is worth ten minutes.',
        ],
      },
      {
        heading: 'The one people confuse it with',
        paragraphs: [
          'Household contents cover is a separate policy covering what is inside the building. Buildings insurance does not cover it.',
          'The most common error here is not absence but amount. Sums insured are often set when the policy is taken out and never revisited, so a household that has replaced its appliances, bought a television and accumulated ten years of belongings is insured for what it owned a decade ago. Average clauses then reduce a claim proportionally.',
        ],
      },
      {
        heading: 'Life cover and the bond',
        paragraphs: [
          'A bond is a debt that outlives the person who signed for it. If one income in a two-income household stops, the instalment does not.',
          'There are two broad approaches. Bond-specific cover reduces as the outstanding balance does and is tied to that debt. Cover held in your own name is not tied to the bank, does not reduce automatically, and remains yours if you sell or move the bond. Which structure suits a household depends on what else it holds, and that is an adviser’s conversation.',
          'The practical point is simpler: this is the moment to check what life cover exists, who it pays, and whether it is enough to leave the family in the house.',
        ],
      },
      {
        heading: 'The one everybody forgets',
        paragraphs: [
          'Buying a home is a good moment to look at a will. A property is usually the largest asset a young household owns, and the way it is owned — jointly, in one name, in a trust — interacts with what a will can do.',
          'Transfer duty, bond registration costs and attorney fees also arrive in the same few months as the deposit. They are not insurance, but they are the reason an emergency fund gets emptied at exactly the point a household has taken on its largest obligation.',
        ],
      },
      {
        heading: 'A short list for the month after transfer',
        paragraphs: ['None of this is urgent on the day. All of it is easier while the paperwork is still on the table.'],
        list: [
          'Confirm the buildings cover in place, who arranged it, and what it is insured for.',
          'Set contents cover against what it would cost to replace what you own today.',
          'Check what life cover exists across the household, including any through an employer, and what it would leave.',
          'Update beneficiary nominations, which do not update themselves.',
          'Revisit the will now that there is a property in the estate.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I have to use the bank’s insurance for my bond?',
        a: 'Generally no. Homeowner’s cover is normally a condition of the bond, but you are usually entitled to arrange it elsewhere as long as the policy meets the bank’s requirements. Confirm the requirements with the bank before cancelling anything.',
      },
      {
        q: 'What is the difference between buildings and contents insurance?',
        a: 'Buildings insurance covers the physical structure. Contents insurance covers what is inside it. They are separate covers and one does not include the other.',
      },
      {
        q: 'Should life cover be tied to the bond?',
        a: 'Both structures are used. Cover tied to the bond reduces alongside the balance; cover in your own name does not and stays with you if you move. Which is appropriate depends on the rest of the household’s position and is a question for a licensed representative.',
      },
      {
        q: 'What is an average clause?',
        a: 'A term in short-term policies that reduces a claim proportionally if the sum insured is less than the replacement value. It is why an out-of-date contents figure matters even for a small claim.',
      },
    ],
    claims: [],
    approvalRef: null,
    related: ['income-protection-and-an-emergency-fund', 'changing-jobs-and-the-cover-you-had-at-work'],
  },
]
