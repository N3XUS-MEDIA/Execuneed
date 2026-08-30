import { cn } from '@execuneed/ui'

/**
 * The one horizontal measure for the site.
 *
 * Gutters are deliberately generous on a phone. Most of this audience arrives
 * from WhatsApp on a handset and reads at arm's length; cramped margins are
 * the first thing that makes a page feel cheap.
 */
export function Container({
  className,
  width = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { width?: 'narrow' | 'default' | 'wide' }) {
  const widths = {
    narrow: 'max-w-2xl',
    default: 'max-w-5xl',
    wide: 'max-w-6xl',
  } as const

  return (
    <div className={cn('mx-auto w-full px-5 sm:px-8', widths[width], className)} {...props} />
  )
}
