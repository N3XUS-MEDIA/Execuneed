import * as React from 'react'
import { cn } from '../cn'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

/**
 * A native select on purpose. Mobile browsers render it as the OS picker,
 * which is a far better experience for the 50+ audience than a custom listbox.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'min-h-[44px] w-full rounded-md border border-line bg-white px-3 py-2 text-base text-ink',
        'aria-[invalid=true]:border-danger',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'
