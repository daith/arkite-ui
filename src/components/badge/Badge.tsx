import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'outline'
  | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge style variant */
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-primary text-primary-foreground',
  secondary:
    'bg-secondary text-secondary-foreground',
  success:
    'bg-success text-success-foreground',
  warning:
    'bg-warning text-warning-foreground',
  destructive:
    'bg-destructive text-destructive-foreground',
  outline:
    'border border-border text-foreground bg-transparent',
  info:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5',
          'text-xs font-medium',
          'transition-colors',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'
