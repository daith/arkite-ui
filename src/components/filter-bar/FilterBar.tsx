import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

/* ─── FilterBar (root) ─── */

export interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Responsive layout shell for data page toolbars.
 *
 * Provides a consistent Search | Filters | Actions pattern
 * that stacks on mobile and flows horizontally on desktop.
 *
 * @example
 * ```tsx
 * <FilterBar>
 *   <FilterBarSearch placeholder="Search orders..." value={q} onChange={setQ} />
 *   <FilterBarFilters>
 *     <Select ... />
 *     <DatePicker ... />
 *   </FilterBarFilters>
 *   <FilterBarActions>
 *     <Button>Export</Button>
 *   </FilterBarActions>
 * </FilterBar>
 * ```
 */
export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)

FilterBar.displayName = 'FilterBar'

/* ─── FilterBarSearch ─── */

export interface FilterBarSearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Search placeholder */
  placeholder?: string
  /** Current search value */
  value?: string
  /** Search change handler */
  onChange?: (value: string) => void
}

/**
 * Left slot — search input with magnifying glass icon.
 */
export const FilterBarSearch = forwardRef<HTMLDivElement, FilterBarSearchProps>(
  ({ className, placeholder = 'Search...', value, onChange, ...props }, ref) => (
    <div ref={ref} className={cn('relative w-full sm:max-w-xs', className)} {...props}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      >
        <path
          d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
      />
    </div>
  )
)

FilterBarSearch.displayName = 'FilterBarSearch'

/* ─── FilterBarFilters ─── */

export interface FilterBarFiltersProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Center slot — wraps filter controls (Select, DatePicker, Combobox, etc.)
 */
export const FilterBarFilters = forwardRef<HTMLDivElement, FilterBarFiltersProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
)

FilterBarFilters.displayName = 'FilterBarFilters'

/* ─── FilterBarActions ─── */

export interface FilterBarActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Right slot — action buttons (Export, Add, etc.)
 */
export const FilterBarActions = forwardRef<HTMLDivElement, FilterBarActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2 sm:ml-auto', className)}
      {...props}
    >
      {children}
    </div>
  )
)

FilterBarActions.displayName = 'FilterBarActions'
