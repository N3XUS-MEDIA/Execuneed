'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '../cn'

/**
 * The hit area is 44px even though the box reads as 24px.
 *
 * A 24px checkbox is a miss-prone target on a phone, and this audience skews
 * over 50 and arrives mostly from WhatsApp on mobile. The root is the full
 * 44px square and the visible box is drawn inside it.
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'group -m-2.5 flex size-11 shrink-0 items-center justify-center',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span
      className={cn(
        'flex size-6 items-center justify-center rounded-sm border border-line bg-white',
        'group-data-[state=checked]:border-sea group-data-[state=checked]:bg-sea',
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-paper">
        <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
          <path
            d="M4 10.5l4 4 8-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </span>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'
