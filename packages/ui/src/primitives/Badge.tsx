import * as React from 'react'
import { cn } from '../cn'

type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'sea'

const tones: Record<Tone, string> = {
  neutral: 'bg-sand/60 text-ink',
  ok: 'bg-ok/10 text-ok',
  warn: 'bg-warn/10 text-warn',
  danger: 'bg-danger/10 text-danger',
  sea: 'bg-navy/10 text-navy',
}

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-sm font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
