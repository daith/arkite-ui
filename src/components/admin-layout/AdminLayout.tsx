import { type ReactNode } from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarToggle,
  useSidebar,
} from '../sidebar/Sidebar'
import { Navbar, NavbarContent, NavbarSpacer } from '../navbar/Navbar'
import { Avatar } from '../avatar/Avatar'
import { Badge, type BadgeVariant } from '../badge/Badge'
import { ToastContainer } from '../toast/Toast'
import { cn } from '../../utils/cn'

// --- Types ---

export interface AdminNavItem {
  /** Route path */
  path: string
  /** Display label */
  label: string
  /** Icon element */
  icon?: ReactNode
  /** Badge content (e.g., notification count) */
  badge?: ReactNode
  /** Required permissions (any match grants access) */
  permissions?: string[]
  /** External link (opens new tab) */
  external?: boolean
  /** Disabled state */
  disabled?: boolean
}

export interface AdminNavGroup {
  /** Group heading label */
  label: string
  /** Navigation items in this group */
  items: AdminNavItem[]
  /** Only visible when `visibleWhen` returns true */
  visibleWhen?: (context: AdminLayoutContext) => boolean
}

export interface AdminBrandConfig {
  /** Brand name */
  name: string
  /** Short name or letter for collapsed state */
  shortName?: string
  /** Logo element (replaces default letter icon) */
  logo?: ReactNode
  /** Collapsed logo element */
  collapsedLogo?: ReactNode
}

export interface AdminUserConfig {
  /** User display name */
  name?: string
  /** User email */
  email?: string
  /** Avatar fallback (initials) */
  avatarFallback?: string
  /** Avatar image URL */
  avatarSrc?: string
  /** Role display name */
  roleLabel?: string
  /** Role badge variant */
  roleBadgeVariant?: BadgeVariant
}

export interface AdminLayoutContext {
  /** Current path */
  currentPath: string
  /** Check if user has any of the given permissions */
  hasPermission?: (permissions: string[]) => boolean
}

export interface AdminLayoutProps {
  /** Current pathname for active state */
  currentPath: string
  /** Navigation groups */
  navigation: AdminNavGroup[]
  /** Brand configuration */
  brand: AdminBrandConfig
  /** User info for navbar display */
  user?: AdminUserConfig
  /** Base path prefix for all routes */
  basePath?: string
  /** Navigate callback */
  onNavigate: (path: string) => void
  /** Custom link renderer for framework integration (React Router, Next.js) */
  renderLink?: (props: { href: string; children: ReactNode; className?: string; active?: boolean }) => ReactNode
  /** Permission check function */
  hasPermission?: (permissions: string[]) => boolean
  /** Logout handler */
  onLogout?: () => void
  /** Extra content in the navbar (left side, after brand area) */
  navbarLeft?: ReactNode
  /** Extra content in the navbar (right side, before user info) */
  navbarRight?: ReactNode
  /** Sidebar footer content (replaces default logout button) */
  sidebarFooter?: ReactNode
  /** Toast position */
  toastPosition?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
  /** Hide toast container (if consumer manages their own) */
  hideToast?: boolean
  /** Main content */
  children: ReactNode
  className?: string
}

// --- Internal components ---

function SidebarBrand({ brand }: { brand: AdminBrandConfig }) {
  const { collapsed, setCollapsed } = useSidebar()

  if (collapsed) {
    return (
      <SidebarHeader className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
          title="Expand menu"
        >
          {brand.collapsedLogo || brand.shortName || brand.name.charAt(0)}
        </button>
      </SidebarHeader>
    )
  }

  return (
    <SidebarHeader className="flex items-center justify-between">
      <div className="flex items-center gap-2 px-2">
        {brand.logo || (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            {brand.shortName || brand.name.charAt(0)}
          </div>
        )}
        <span className="font-semibold">{brand.name}</span>
      </div>
      <SidebarToggle />
    </SidebarHeader>
  )
}

function NavItemContent({ item }: { item: AdminNavItem }) {
  return (
    <>
      {item.label}
      {item.badge && (
        <span className="ml-auto">{item.badge}</span>
      )}
    </>
  )
}

// --- Main component ---

/** Full admin page layout with a collapsible sidebar, top navbar, and permission-aware navigation. */
export function AdminLayout({
  currentPath,
  navigation,
  brand,
  user,
  basePath = '',
  onNavigate,
  renderLink,
  hasPermission,
  onLogout,
  navbarLeft,
  navbarRight,
  sidebarFooter,
  toastPosition = 'top-right',
  hideToast = false,
  children,
  className,
}: AdminLayoutProps) {
  const context: AdminLayoutContext = { currentPath, hasPermission }

  // Filter navigation based on permissions and visibility
  const visibleGroups = navigation
    .filter((group) => {
      if (group.visibleWhen && !group.visibleWhen(context)) return false
      return true
    })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.permissions && item.permissions.length > 0 && hasPermission) {
          return hasPermission(item.permissions)
        }
        return true
      }),
    }))
    .filter((group) => group.items.length > 0)

  const resolvePath = (path: string) => `${basePath}${path}`

  const handleItemClick = (item: AdminNavItem) => {
    if (item.external) {
      window.open(resolvePath(item.path), '_blank', 'noopener,noreferrer')
    } else {
      onNavigate(resolvePath(item.path))
    }
  }

  const isActive = (path: string) => {
    const resolved = resolvePath(path)
    return currentPath === resolved || currentPath.startsWith(`${resolved}/`)
  }

  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {/* Sidebar */}
      <Sidebar collapsible defaultCollapsed={false}>
        <SidebarBrand brand={brand} />

        <SidebarContent>
          {visibleGroups.map((group) => (
            <SidebarGroup key={group.label} label={group.label}>
              {group.items.map((item) => {
                const active = isActive(item.path)

                if (renderLink && !item.external) {
                  return (
                    <div key={item.path}>
                      {renderLink({
                        href: resolvePath(item.path),
                        active,
                        className: 'block',
                        children: (
                          <SidebarItem
                            icon={item.icon}
                            active={active}
                            disabled={item.disabled}
                          >
                            <NavItemContent item={item} />
                          </SidebarItem>
                        ),
                      })}
                    </div>
                  )
                }

                return (
                  <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    active={active}
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                  >
                    <NavItemContent item={item} />
                    {item.external && (
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" className="ml-1 opacity-50">
                        <path
                          d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3H6.5C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </SidebarItem>
                )
              })}
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          {sidebarFooter || (
            onLogout && (
              <SidebarItem onClick={onLogout}>
                Logout
              </SidebarItem>
            )
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar sticky bordered>
          <NavbarContent align="left">
            {navbarLeft}
          </NavbarContent>
          <NavbarSpacer />
          <NavbarContent align="right">
            {navbarRight}
            {user && (
              <div className="flex items-center gap-3">
                <Avatar
                  fallback={user.avatarFallback || user.name?.charAt(0) || 'U'}
                  src={user.avatarSrc}
                  size="sm"
                />
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                    {user.roleLabel && (
                      <Badge variant={user.roleBadgeVariant || 'secondary'} className="text-xs">
                        {user.roleLabel}
                      </Badge>
                    )}
                  </div>
                  {user.email && user.name && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>
            )}
          </NavbarContent>
        </Navbar>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Toast Container */}
      {!hideToast && <ToastContainer position={toastPosition} />}
    </div>
  )
}
