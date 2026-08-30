import { medicalArticles } from './articles-medical'
import { protectionArticles } from './articles-protection'
import { planningArticles } from './articles-planning'
import { businessArticles } from './articles-business'
import { gatedArticles } from './articles-gated'
import type { JournalArticle } from './types'

export type { JournalArticle, JournalCategory, JournalSection } from './types'

/**
 * P2-S-043 — the eight cornerstone articles.
 *
 * Order is editorial: the ones that answer the most common question first.
 */
export const journalArticles: JournalArticle[] = [
  ...medicalArticles,
  ...protectionArticles,
  ...planningArticles,
  ...businessArticles,
  ...gatedArticles,
]

export function findArticle(slug: string): JournalArticle | undefined {
  return journalArticles.find((a) => a.slug === slug)
}

export function relatedTo(article: JournalArticle): JournalArticle[] {
  return article.related
    .map((slug) => findArticle(slug))
    .filter((a): a is JournalArticle => Boolean(a) && a!.slug !== article.slug)
}

/** Copy shared across the journal. */
export const journalCopy = {
  title: 'Journal',
  standfirst:
    'Plain-language explanations of how cover, medical schemes and retirement funding work in South Africa. Written to be useful before you ever speak to us.',
  /**
   * The FAIS line, in the journal's own words. It appears on every article,
   * because an article that reads like guidance needs it more than a services
   * page does.
   */
  adviceNote:
    'This is general information about how these products work. It is not advice and it is not a recommendation. Whether any of it applies to you depends on your circumstances, and that is a conversation for a licensed representative.',
  figuresLabel: 'Figures to re-check',
} as const
