import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Card shadow */
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  /** Hover effect */
  hoverable?: boolean
  /** Card border */
  bordered?: boolean
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title */
  title?: ReactNode
  /** Header description */
  description?: ReactNode
  /** Header action (button, etc.) */
  action?: ReactNode
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding = 'none',
      shadow = 'sm',
      hoverable = false,
      bordered = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg bg-card text-card-foreground',
          bordered && 'border',
          paddingStyles[padding],
          shadowStyles[shadow],
          hoverable && 'transition-shadow hover:shadow-md cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4 p-4', className)}
        {...props}
      >
        <div className="space-y-1.5">
          {title && (
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
    )
  }
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-4 pt-0', className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'
