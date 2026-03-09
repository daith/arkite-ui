/**
 * TenantSwitcher - Platform Admin 租戶切換器
 */

import { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { useTenantStore, type TenantInfo } from '../../stores/tenantStore'
import { Badge } from '../badge/Badge'
import { Spinner } from '../spinner/Spinner'
import {
  ChevronDown,
  Building2,
  Globe,
  Check,
  Search,
} from 'lucide-react'

export interface TenantSwitcherProps {
  className?: string
}

const statusColors: Record<TenantInfo['status'], 'default' | 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  trial: 'warning',
  suspended: 'destructive',
  expired: 'default',
}

const planLabels: Record<TenantInfo['plan'], string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Pro',
  enterprise: 'Enterprise',
}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const {
    currentTenant,
    tenants,
    isLoading,
    setCurrentTenant,
    fetchTenants,
  } = useTenantStore()

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // 載入租戶列表
  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  // 點擊外部關閉
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

  // 開啟時聚焦搜尋框
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // 過濾租戶
  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(search.toLowerCase()) ||
    tenant.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (tenant: TenantInfo | null) => {
    setCurrentTenant(tenant)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
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
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{currentTenant.name}</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <span className="text-primary">All Tenants</span>
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
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
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tenants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : (
              <>
                {/* All Tenants Option */}
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
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary">All Tenants</p>
                    <p className="text-xs text-muted-foreground">Platform-wide view</p>
                  </div>
                  {!currentTenant && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>

                {/* Divider */}
                <div className="h-px bg-border mx-2 my-1" />

                {/* Tenant List */}
                {filteredTenants.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No tenants found
                  </div>
                ) : (
                  filteredTenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      type="button"
                      onClick={() => handleSelect(tenant)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5',
                        'hover:bg-muted transition-colors',
                        'text-left',
                        currentTenant?.id === tenant.id && 'bg-secondary'
                      )}
                    >
                      {/* Avatar/Logo */}
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-secondary-foreground font-medium text-sm">
                        {tenant.logo_url ? (
                          <img
                            src={tenant.logo_url}
                            alt={tenant.name}
                            className="h-8 w-8 rounded-md object-cover"
                          />
                        ) : (
                          tenant.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{tenant.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {planLabels[tenant.plan]}
                          </span>
                          <Badge
                            variant={statusColors[tenant.status]}
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tenant.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Check */}
                      {currentTenant?.id === tenant.id && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
