import { cn } from '@execuneed/ui'
import { Container } from './Container'

type Tone = 'paper' | 'sand' | 'navy'

const tones: Record<Tone, string> = {
  paper: '',
  sand: 'bg-sand/50',
  navy: 'bg-navy text-paper',
}

/**
 * Vertical rhythm for the public pages.
 *
 * Whitespace and a small number of tonal bands are the design here — there is
 * no photography, because the brand pack has not been received and stock
 * imagery would be worse than none (docs/handoffs/2026-08-29-lead-to-support-p2.md).
 * Keeping the spacing scale in one place is what stops the pages drifting
 * apart as they are edited.
 */
export function Section({
  className,
  children,
  tone = 'paper',
  width,
  bordered = false,
  size = 'md',
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  tone?: Tone
  width?: React.ComponentProps<typeof Container>['width']
  bordered?: boolean
  size?: 'sm' | 'md'
}) {
  return (
    <section
      className={cn(
        size === 'sm' ? 'py-12 sm:py-16' : 'py-16 sm:py-20 lg:py-28',
        tones[tone],
        bordered && 'border-t border-line',
        className,
      )}
      {...props}
    >
      <Container width={width}>{children}</Container>
    </section>
  )
}

/**
 * Eyebrow, heading, lede — in that order, at the same optical weight on every
 * section of the site.
 *
 * The eyebrow drops a trailing full stop: the copy deck writes these as
 * sentences, and a full stop set in wide-tracked small caps reads as a typo.
 * The deck string itself is untouched.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  onNavy = false,
  as: Heading = 'h2',
  className,
}: {
  eyebrow?: string
  title: string
  lede?: string
  align?: 'left' | 'center'
  onNavy?: boolean
  as?: 'h1' | 'h2'
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <p className={onNavy ? 'eyebrow-on-navy' : 'eyebrow'}>{eyebrow.replace(/\.$/, '')}</p>
      ) : null}
      <Heading
        className={cn(
          'text-3xl sm:text-4xl',
          Heading === 'h1' && 'lg:text-5xl',
          onNavy ? 'text-paper' : 'text-ink',
          eyebrow && 'mt-4',
        )}
      >
        {title}
      </Heading>
      {lede ? (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed sm:text-xl',
            onNavy ? 'text-paper/75' : 'text-ink-muted',
          )}
        >
          {lede}
        </p>
      ) : null}
    </div>
  )
}
