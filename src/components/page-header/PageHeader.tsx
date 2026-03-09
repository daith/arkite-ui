import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Page title */
  title: ReactNode
  /** Optional description below the title */
  description?: ReactNode
  /** Actions slot (right side) */
  actions?: ReactNode
  /** Breadcrumb or back link slot (above title) */
  breadcrumb?: ReactNode
  /** Badge or status slot (next to title) */
  badge?: ReactNode
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, breadcrumb, badge, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-1', className)}
        {...props}
      >
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              {badge}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
        {children}
      </div>
    )
  }
)

PageHeader.displayName = 'PageHeader'
