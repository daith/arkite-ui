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
  /** Back button callback — renders a ← button before the title */
  onBack?: () => void
  /** Back button aria-label */
  backLabel?: string
}

function ArrowLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

/** Page header with title, description, breadcrumb, and action slots. */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, breadcrumb, badge, onBack, backLabel = 'Go back', className, children, ...props }, ref) => {
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
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={backLabel}
                >
                  <ArrowLeftIcon />
                </button>
              )}
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
