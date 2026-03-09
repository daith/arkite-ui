import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type StatusType = 'online' | 'offline' | 'busy' | 'away'
export type StatusDotSize = 'xs' | 'sm' | 'md' | 'lg'

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status type */
  status: StatusType
  /** Dot size */
  size?: StatusDotSize
  /** Show a pulse animation for online status */
  pulse?: boolean
}

const sizeStyles: Record<StatusDotSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
}

const statusStyles: Record<StatusType, string> = {
  online: 'bg-status-online',
  offline: 'bg-status-offline',
  busy: 'bg-status-busy',
  away: 'bg-status-away',
}

/**
 * Tiny colored dot indicating presence or entity status.
 *
 * Uses semantic CSS variables (`--status-online`, etc.) so the palette
 * stays consistent across Avatar, Badge, and Table status columns.
 *
 * @example
 * ```tsx
 * <StatusDot status="online" />
 * <StatusDot status="busy" size="lg" />
 * <span className="flex items-center gap-2">
 *   <StatusDot status="online" /> Active
 * </span>
 * ```
 */
export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status, size = 'sm', pulse = false, ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={status}
      className={cn(
        'inline-block shrink-0 rounded-full',
        sizeStyles[size],
        statusStyles[status],
        pulse && status === 'online' && 'animate-pulse',
        className
      )}
      {...props}
    />
  )
)

StatusDot.displayName = 'StatusDot'
