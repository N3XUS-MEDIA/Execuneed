import * as React from 'react'
import { cn } from '../cn'

export function PageHeader({
  title,
  lede,
  actions,
  className,
}: {
  title: string
  lede?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <header className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        <h1 className="font-heading text-3xl text-ink sm:text-4xl">{title}</h1>
        {lede ? <p className="mt-3 text-lg text-ink-muted">{lede}</p> : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </header>
  )
}
