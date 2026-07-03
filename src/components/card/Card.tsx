import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type CardDensity = 'default' | 'compact'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Card shadow */
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  /** Hover effect */
  hoverable?: boolean
  /** Card border */
  bordered?: boolean
  /** Content density — `compact` tightens header/content/footer padding and typography for dashboard widgets. Inherited by CardHeader/CardContent/CardFooter. */
  density?: CardDensity
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Header title */
  title?: ReactNode
  /** Header description */
  description?: ReactNode
  /** Header action (button, etc.) */
  action?: ReactNode
  /** Right-aligned row of actions (e.g. multiple icon buttons) */
  actions?: ReactNode
  /** Density override — defaults to the parent Card's `density` */
  density?: CardDensity
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Density override — defaults to the parent Card's `density` */
  density?: CardDensity
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Density override — defaults to the parent Card's `density` */
  density?: CardDensity
}

const CardDensityContext = createContext<CardDensity>('default')

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

/** Styled container surface with configurable padding, shadow, and hover effects. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      padding = 'none',
      shadow = 'sm',
      hoverable = false,
      bordered = true,
      density = 'default',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <CardDensityContext.Provider value={density}>
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
      </CardDensityContext.Provider>
    )
  }
)

Card.displayName = 'Card'

/** Card header section with title, description, and optional action slots. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, actions, density, children, ...props }, ref) => {
    const contextDensity = useContext(CardDensityContext)
    const compact = (density ?? contextDensity) === 'compact'
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between gap-4',
          compact ? 'px-4 py-3' : 'p-4',
          className
        )}
        {...props}
      >
        <div className={compact ? 'min-w-0 space-y-1' : 'space-y-1.5'}>
          {title && (
            <h3
              className={cn(
                'font-semibold leading-none tracking-tight',
                compact ? 'text-sm' : 'text-lg'
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
              {description}
            </p>
          )}
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
        {actions && (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

/** Main body section of a Card. */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, density, ...props }, ref) => {
    const contextDensity = useContext(CardDensityContext)
    const compact = (density ?? contextDensity) === 'compact'
    return (
      <div
        ref={ref}
        className={cn(compact ? 'px-4 pb-3 pt-0' : 'p-4 pt-0', className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = 'CardContent'

/** Bottom section of a Card, typically used for actions or metadata. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, density, ...props }, ref) => {
    const contextDensity = useContext(CardDensityContext)
    const compact = (density ?? contextDensity) === 'compact'
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          compact ? 'px-4 pb-3 pt-0' : 'p-4 pt-0',
          className
        )}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'
