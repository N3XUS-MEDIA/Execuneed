import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-navy text-paper hover:bg-navy/90',
  secondary: 'border border-line bg-paper text-ink hover:bg-sand/40',
  ghost: 'text-ink hover:bg-sand/40',
  link: 'text-navy underline underline-offset-4 hover:no-underline',
}

// docs/design: 50+ audience on phones. Nothing below a 44px target.
const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-4 py-2.5 text-base',
  lg: 'min-h-[52px] px-6 py-3 text-lg',
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-body transition-colors',
          'disabled:pointer-events-none disabled:opacity-50',
          variant !== 'link' && sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
