/**
 * TenantSwitcher - Tenant switching dropdown
 *
 * Props-driven: works with any state management solution.
 * Optionally use `useTenantStore` for a batteries-included experience.
 */

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Badge, type BadgeVariant } from '../badge/Badge'
import { Spinner } from '../spinner/Spinner'

// --- Types ---

export interface TenantItem {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** URL slug (used for search) */
  slug?: string
  /** Logo image URL */
  logoUrl?: string
  /** Status label */
  status?: string
  /** Status badge variant */
  statusVariant?: BadgeVariant
  /** Plan or secondary label */
  planLabel?: string
}

export interface TenantSwitcherProps {
  /** List of available tenants */
  tenants: TenantItem[]
  /** Currently selected tenant (null = all tenants / platform view) */
  currentTenant?: TenantItem | null
  /** Selection callback */
  onSelect?: (tenant: TenantItem | null) => void
  /** Async search callback (overrides local filtering) */
  onSearch?: (query: string) => void
  /** Loading state */
  loading?: boolean
  /** Show "All Tenants" option */
  showAllOption?: boolean
  /** "All Tenants" label */
  allLabel?: string
  /** "All Tenants" description */
  allDescription?: string
  /** Empty search message */
  emptyMessage?: string
  /** Search placeholder */
  searchPlaceholder?: string
  /** Custom tenant renderer */
  renderTenant?: (tenant: TenantItem, selected: boolean) => ReactNode
  className?: string
}

// --- Inline icons ---

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className}>
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className}>
      <path
        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className}>
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3354 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.5553 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className}>
      <path
        d="M7.5 0.5C7.77614 0.5 8 0.723858 8 1V2H12.5C12.7761 2 13 2.22386 13 2.5V14.5C13 14.7761 12.7761 15 12.5 15H2.5C2.22386 15 2 14.7761 2 14.5V2.5C2 2.22386 2.22386 2 2.5 2H7V1C7 0.723858 7.22386 0.5 7.5 0.5ZM3 3V14H7V11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5V14H12V3H3ZM5 5H4V6H5V5ZM4 7H5V8H4V7ZM5 9H4V10H5V9ZM10 5H11V6H10V5ZM11 7H10V8H11V7ZM10 9H11V10H10V9ZM8 5H7V6H8V5ZM7 7H8V8H7V7Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className}>
      <path
        d="M7.49996 1.80002C4.35194 1.80002 1.79996 4.352 1.79996 7.50002C1.79996 10.648 4.35194 13.2 7.49996 13.2C10.648 13.2 13.2 10.648 13.2 7.50002C13.2 4.352 10.648 1.80002 7.49996 1.80002ZM0.899963 7.50002C0.899963 3.85494 3.85488 0.900024 7.49996 0.900024C11.145 0.900024 14.1 3.85494 14.1 7.50002C14.1 11.1451 11.145 14.1 7.49996 14.1C3.85488 14.1 0.899963 11.1451 0.899963 7.50002Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M13.4999 7.89998H1.49994V7.09998H13.4999V7.89998Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M7.09991 13.5V1.5H7.89991V13.5H7.09991Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M10.375 7.49998C10.375 5.32724 9.59364 3.17778 8.06183 1.75656L8.53793 1.24341C10.2396 2.82218 11.075 5.17273 11.075 7.49998C11.075 9.82724 10.2396 12.1778 8.53793 13.7566L8.06183 13.2434C9.59364 11.8222 10.375 9.67273 10.375 7.49998Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M4.62503 7.49998C4.62503 5.32724 5.40642 3.17778 6.93823 1.75656L6.46213 1.24341C4.7605 2.82218 3.92503 5.17273 3.92503 7.49998C3.92503 9.82724 4.7605 12.1778 6.46213 13.7566L6.93823 13.2434C5.40642 11.8222 4.62503 9.67273 4.62503 7.49998Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

// --- Component ---

/** Dropdown for switching between tenants with search and optional "All Tenants" view. */
export function TenantSwitcher({
  tenants = [],
  currentTenant = null,
  onSelect,
  onSearch,
  loading = false,
  showAllOption = true,
  allLabel = 'All Tenants',
  allDescription = 'Platform-wide view',
  emptyMessage = 'No tenants found',
  searchPlaceholder = 'Search tenants...',
  renderTenant,
  className,
}: TenantSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Filter tenants (local filtering unless onSearch is provided)
  const filteredTenants = onSearch
    ? tenants
    : tenants.filter((t) => {
        const q = search.toLowerCase()
        return (
          t.name.toLowerCase().includes(q) ||
          (t.slug?.toLowerCase().includes(q) ?? false)
        )
      })

  const handleSearchChange = (q: string) => {
    setSearch(q)
    onSearch?.(q)
  }

  const handleSelect = (tenant: TenantItem | null) => {
    onSelect?.(tenant)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-md',
          'bg-card hover:bg-secondary',
          'border border-border shadow-sm',
          'text-sm font-medium',
          'transition-colors duration-200',
          'min-w-[180px] max-w-[240px]'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {currentTenant ? (
            <>
              <BuildingIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{currentTenant.name}</span>
            </>
          ) : (
            <>
              <GlobeIcon className="h-4 w-4 text-primary shrink-0" />
              <span className="text-primary">{allLabel}</span>
            </>
          )}
        </div>
        <ChevronDownIcon
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 z-50',
            'w-[280px] max-h-[400px]',
            'bg-card border border-border rounded-lg shadow-lg',
            'overflow-hidden'
          )}
        >
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={cn(
                  'w-full h-9 pl-8 pr-3 text-sm',
                  'bg-background border border-input rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-ring'
                )}
              />
            </div>
          </div>

          {/* Options */}
          <div className="overflow-y-auto max-h-[320px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : (
              <>
                {/* All Tenants option */}
                {showAllOption && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSelect(null)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5',
                        'hover:bg-muted transition-colors',
                        'text-left',
                        !currentTenant && 'bg-secondary'
                      )}
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
                        <GlobeIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary">{allLabel}</p>
                        <p className="text-xs text-muted-foreground">{allDescription}</p>
                      </div>
                      {!currentTenant && (
                        <CheckIcon className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                    <div className="h-px bg-border mx-2 my-1" />
                  </>
                )}

                {/* Tenant list */}
                {filteredTenants.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                ) : (
                  filteredTenants.map((tenant) => {
                    const selected = currentTenant?.id === tenant.id
                    if (renderTenant) {
                      return (
                        <button
                          key={tenant.id}
                          type="button"
                          onClick={() => handleSelect(tenant)}
                          className="w-full text-left hover:bg-muted transition-colors"
                        >
                          {renderTenant(tenant, selected)}
                        </button>
                      )
                    }
                    return (
                      <button
                        key={tenant.id}
                        type="button"
                        onClick={() => handleSelect(tenant)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5',
                          'hover:bg-muted transition-colors',
                          'text-left',
                          selected && 'bg-secondary'
                        )}
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-secondary-foreground font-medium text-sm">
                          {tenant.logoUrl ? (
                            <img
                              src={tenant.logoUrl}
                              alt={tenant.name}
                              className="h-8 w-8 rounded-md object-cover"
                            />
                          ) : (
                            tenant.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{tenant.name}</p>
                          <div className="flex items-center gap-2">
                            {tenant.planLabel && (
                              <span className="text-xs text-muted-foreground">
                                {tenant.planLabel}
                              </span>
                            )}
                            {tenant.status && (
                              <Badge
                                variant={tenant.statusVariant || 'secondary'}
                                className="text-[10px] px-1.5 py-0"
                              >
                                {tenant.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selected && (
                          <CheckIcon className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </button>
                    )
                  })
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
