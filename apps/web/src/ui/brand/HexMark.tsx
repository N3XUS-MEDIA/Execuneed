import { cn } from '@execuneed/ui'

/**
 * The hexagon and three bars from the Execuneed icon, redrawn as inline SVG so
 * it takes `currentColor` and can be set at any size.
 *
 * This is the site's only piece of ornament. There is no photography — the
 * brand pack has not been received and stock imagery would be worse than none
 * — so the geometry of the mark does the work that pictures usually do, at
 * section seams and behind the closing panel.
 */
export function HexMark({
  className,
  bars = true,
  strokeWidth = 26,
}: {
  className?: string
  /** The three bars read as clutter below roughly 32px. */
  bars?: boolean
  strokeWidth?: number
}) {
  return (
    <svg viewBox="0 0 512 512" className={cn('size-6', className)} aria-hidden="true">
      <path
        d="M256 61 424.9 158.5 424.9 353.5 256 451 87.1 353.5 87.1 158.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="miter"
      />
      {bars ? (
        <g fill="currentColor">
          <rect x="188" y="190" width="136" height="26" rx="3" />
          <rect x="188" y="243" width="136" height="26" rx="3" />
          <rect x="188" y="296" width="136" height="26" rx="3" />
        </g>
      ) : null}
    </svg>
  )
}

/**
 * A seam between sections: hairline, mark, hairline. Used sparingly — it is
 * the one moment of decoration on an otherwise very quiet page.
 */
export function HexRule({ className, onNavy = false }: { className?: string; onNavy?: boolean }) {
  return (
    <div className={cn('flex items-center gap-5', className)} aria-hidden="true">
      <span className={cn('h-px flex-1', onNavy ? 'bg-paper/20' : 'bg-line')} />
      <HexMark
        bars={false}
        strokeWidth={22}
        className={cn('size-7', onNavy ? 'text-paper/40' : 'text-navy/35')}
      />
      <span className={cn('h-px flex-1', onNavy ? 'bg-paper/20' : 'bg-line')} />
    </div>
  )
}
