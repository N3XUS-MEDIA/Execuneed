import * as React from 'react'
import { cn } from '../cn'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[120px] w-full rounded-md border border-line bg-white px-3 py-2 text-base text-ink',
        'placeholder:text-ink-muted/60',
        'aria-[invalid=true]:border-danger',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
