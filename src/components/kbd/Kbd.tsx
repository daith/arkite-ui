import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** Visual size */
  size?: 'sm' | 'md'
}

/** Inline keyboard shortcut badge rendered as a styled kbd element. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, size = 'sm', children, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded border border-border bg-muted font-sans font-medium text-muted-foreground shadow-xs',
          'select-none',
          size === 'sm' && 'min-w-5 px-1 py-0.5 text-[10px] leading-none',
          size === 'md' && 'min-w-6 px-1.5 py-0.5 text-xs leading-none',
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    )
  }
)

Kbd.displayName = 'Kbd'
