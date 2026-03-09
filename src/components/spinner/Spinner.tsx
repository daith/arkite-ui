import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Spinner size */
  size?: SpinnerSize
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn(
          'animate-spin rounded-full',
          'border-current border-t-transparent',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'
