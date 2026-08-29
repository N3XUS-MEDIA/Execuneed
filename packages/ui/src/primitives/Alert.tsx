import * as React from 'react'
import { cn } from '../cn'

type Tone = 'info' | 'warn' | 'danger' | 'ok'

const tones: Record<Tone, string> = {
  info: 'border-navy/30 bg-navy/5 text-ink',
  warn: 'border-warn/30 bg-warn/5 text-ink',
  danger: 'border-danger/30 bg-danger/5 text-ink',
  ok: 'border-ok/30 bg-ok/5 text-ink',
}

export function Alert({
  className,
  tone = 'info',
  title,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone; title?: string }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('rounded-md border p-4', tones[tone], className)}
      {...props}
    >
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      <div className="text-ink-muted">{children}</div>
    </div>
  )
}
