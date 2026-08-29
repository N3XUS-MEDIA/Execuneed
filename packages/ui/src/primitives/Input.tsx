import * as React from 'react'
import { cn } from '../cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'min-h-[44px] w-full rounded-md border border-line bg-white px-3 py-2 text-base text-ink',
        'placeholder:text-ink-muted/60',
        'aria-[invalid=true]:border-danger',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
