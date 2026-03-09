import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Inbox, Search, FileX, AlertCircle, Plus } from 'lucide-react'

export type EmptyStateVariant = 'default' | 'search' | 'error' | 'no-data'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Variant */
  variant?: EmptyStateVariant
  /** Icon to display */
  icon?: ReactNode
  /** Title text */
  title?: ReactNode
  /** Description text */
  description?: ReactNode
  /** Action button or element */
  action?: ReactNode
  /** Size */
  size?: 'sm' | 'md' | 'lg'
}

const variantIcons: Record<EmptyStateVariant, typeof Inbox> = {
  default: Inbox,
  search: Search,
  error: AlertCircle,
  'no-data': FileX,
}

const sizeStyles = {
  sm: {
    container: 'py-8',
    icon: 'h-8 w-8',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'h-12 w-12',
    title: 'text-lg',
    description: 'text-sm',
  },
  lg: {
    container: 'py-16',
    icon: 'h-16 w-16',
    title: 'text-xl',
    description: 'text-base',
  },
}

/** Placeholder display for empty views with an icon, message, and optional action. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      variant = 'default',
      icon,
      title,
      description,
      action,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const IconComponent = variantIcons[variant]
    const styles = sizeStyles[size]

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          styles.container,
          className
        )}
        {...props}
      >
        <div className="mb-4 text-muted-foreground">
          {icon || <IconComponent className={styles.icon} />}
        </div>
        {title && (
          <h3 className={cn('font-semibold text-foreground', styles.title)}>
            {title}
          </h3>
        )}
        {description && (
          <p
            className={cn(
              'mt-1 max-w-sm text-muted-foreground',
              styles.description
            )}
          >
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

// Pre-configured empty states
export interface EmptyStatePresetProps extends Omit<EmptyStateProps, 'variant' | 'title' | 'description' | 'icon'> {
  /** Custom title (overrides preset) */
  title?: ReactNode
  /** Custom description (overrides preset) */
  description?: ReactNode
}

/** Preset empty state for search queries that returned no results. */
export const NoResults = forwardRef<HTMLDivElement, EmptyStatePresetProps>(
  ({ title = 'No results found', description = 'Try adjusting your search or filters.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      variant="search"
      title={title}
      description={description}
      {...props}
    />
  )
)

NoResults.displayName = 'NoResults'

/** Preset empty state prompting the user to create their first item. */
export const NoData = forwardRef<HTMLDivElement, EmptyStatePresetProps>(
  ({ title = 'No data yet', description = 'Get started by creating your first item.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      variant="no-data"
      title={title}
      description={description}
      icon={<Plus className="h-12 w-12" />}
      {...props}
    />
  )
)

NoData.displayName = 'NoData'

/** Preset empty state indicating a data loading error occurred. */
export const ErrorState = forwardRef<HTMLDivElement, EmptyStatePresetProps>(
  ({ title = 'Something went wrong', description = 'An error occurred while loading the data.', ...props }, ref) => (
    <EmptyState
      ref={ref}
      variant="error"
      title={title}
      description={description}
      {...props}
    />
  )
)

ErrorState.displayName = 'ErrorState'
