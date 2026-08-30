import { Container } from './Container'
import { SectionHeading } from './Section'

/**
 * The opening band on every page below the home page.
 *
 * One component so that `/services`, `/contact` and a category page all start
 * at the same height, with the same wash off the navy header. Pages differed by
 * a few rem before this existed, which is the sort of thing nobody can name but
 * everybody feels when they click between them.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  children?: React.ReactNode
}) {
  return (
    <div className="border-b border-line bg-gradient-to-b from-sand/60 to-paper">
      <Container>
        <div className="py-14 sm:py-20">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} lede={lede} />
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </div>
  )
}
