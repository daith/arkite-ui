import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface TimelineItem {
  /** Timestamp or date label */
  date?: string
  /** Event title */
  title: string
  /** Event description */
  description?: ReactNode
  /** Custom icon */
  icon?: ReactNode
  /** Dot color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive'
}

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Timeline items */
  items: TimelineItem[]
  /** Size */
  size?: 'sm' | 'md'
}

const variantStyles: Record<string, string> = {
  default: 'bg-muted-foreground',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
}

/** Vertical timeline displaying a sequence of events with dots and connecting lines. */
export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ items, size = 'md', className, ...props }, ref) => {
    const dotSize = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3'
    const iconSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8'

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const variant = item.variant ?? 'default'

          return (
            <div key={index} className="flex gap-4">
              {/* Left: dot + line */}
              <div className="flex flex-col items-center">
                {item.icon ? (
                  <div
                    className={cn(
                      'flex shrink-0 items-center justify-center rounded-full text-primary-foreground',
                      iconSize,
                      variantStyles[variant]
                    )}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <div
                    className={cn(
                      'shrink-0 rounded-full mt-1.5',
                      dotSize,
                      variantStyles[variant]
                    )}
                  />
                )}
                {!isLast && (
                  <div className="w-px flex-1 bg-border min-h-[16px]" />
                )}
              </div>

              {/* Right: content */}
              <div className={cn('pb-6', isLast && 'pb-0')}>
                {item.date && (
                  <p className="text-xs text-muted-foreground mb-0.5">{item.date}</p>
                )}
                <p className={cn('font-medium leading-tight', size === 'sm' ? 'text-sm' : 'text-base')}>
                  {item.title}
                </p>
                {item.description && (
                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'
