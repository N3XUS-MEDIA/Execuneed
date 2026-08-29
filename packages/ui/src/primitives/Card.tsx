import * as React from 'react'
import { cn } from '../cn'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-line bg-white p-6', className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex flex-col gap-1', className)} {...props} />
}

/**
 * Defaults to h3, because a card usually sits under a section h2. Where a card
 * IS the section — a form panel directly under the page h1 — pass `as="h2"`.
 * Skipping a level is an accessibility failure, not a style choice.
 */
export function CardTitle({
  className,
  as: Tag = 'h3',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return <Tag className={cn('font-heading text-xl text-ink', className)} {...props} />
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-ink-muted', className)} {...props} />
}
