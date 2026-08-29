import * as React from 'react'
import { cn } from '../cn'

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border border-dashed border-line px-6 py-12 text-center',
        className,
      )}
    >
      <p className="font-heading text-lg text-ink">{title}</p>
      {body ? <p className="max-w-prose text-ink-muted">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
