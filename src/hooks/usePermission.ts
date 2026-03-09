/**
 * Permission Hook
 * 提供權限檢查功能
 */

import { useMemo, useCallback } from 'react'
import { useAuthStore } from '../stores/authStore'

// TODO: decouple from app-specific imports
// These types and functions should be provided by the consuming application
export type Permission = string

export type UserType = 'platform' | 'tenant'
export type UserRole = 'super_admin' | 'system_staff' | 'tenant_admin' | 'member' | 'viewer' | string

// Placeholder permission functions - consumers should override these
export function hasPermission(_userType: UserType, _role: UserRole, _permission: Permission): boolean {
  return true
}

export function hasAnyPermission(_userType: UserType, _role: UserRole, _permissions: Permission[]): boolean {
  return true
}

export function hasAllPermissions(_userType: UserType, _role: UserRole, _permissions: Permission[]): boolean {
  return true
}

export function getRolePermissions(_userType: UserType, _role: UserRole): Permission[] {
  return []
}

export function isPlatformAdminCheck(userType: UserType, _role: UserRole): boolean {
  return userType === 'platform'
}

export function isSuperAdminCheck(userType: UserType, role: UserRole): boolean {
  return userType === 'platform' && role === 'super_admin'
}

export function canAccessRouteCheck(_userType: UserType, _role: UserRole, _path: string): boolean {
  return true
}

interface UsePermissionReturn {
  /** 用戶類型 */
  userType: UserType | undefined
  /** 用戶角色 */
  role: UserRole | undefined
  /** 所有權限列表 */
  permissions: Permission[]
  /** 檢查是否有特定權限 */
  can: (permission: Permission) => boolean
  /** 檢查是否有任一權限 */
  canAny: (permissions: Permission[]) => boolean
  /** 檢查是否有所有權限 */
  canAll: (permissions: Permission[]) => boolean
  /** 是否為平台管理員 */
  isPlatformAdmin: boolean
  /** 是否為超級管理員 */
  isSuperAdmin: boolean
  /** 檢查是否可以訪問路由 */
  canAccessRoute: (path: string) => boolean
}

/**
 * 權限檢查 Hook
 *
 * @example
 * ```tsx
 * const { can, isPlatformAdmin } = usePermission()
 *
 * // 檢查單一權限
 * if (can('companies:create')) {
 *   // 顯示新增按鈕
 * }
 *
 * // 檢查多個權限
 * if (canAny(['sources:edit', 'sources:delete'])) {
 *   // 顯示操作按鈕
 * }
 * ```
 */
export function usePermission(): UsePermissionReturn {
  const { user } = useAuthStore()

  // 從用戶資料取得 userType 和 role
  // 支援新舊兩種格式
  const userType = useMemo<UserType | undefined>(() => {
    if (!user) return undefined
    // 新格式
    if (user.user_type) return user.user_type
    // 舊格式轉換
    if (user.is_super_admin || user.is_system_staff) return 'platform'
    return 'tenant'
  }, [user])

  const role = useMemo<UserRole | undefined>(() => {
    if (!user) return undefined
    // 新格式
    if (user.role) return user.role
    // 舊格式轉換
    if (user.is_super_admin) return 'super_admin'
    if (user.is_system_staff) return 'system_staff'
    return 'tenant_admin' // 預設 tenant admin
  }, [user])

  // 取得所有權限
  const permissions = useMemo<Permission[]>(() => {
    if (!userType || !role) return []
    return getRolePermissions(userType, role)
  }, [userType, role])

  // 權限檢查函數
  const can = useCallback(
    (permission: Permission): boolean => {
      if (!userType || !role) return false
      return hasPermission(userType, role, permission)
    },
    [userType, role]
  )

  const canAny = useCallback(
    (perms: Permission[]): boolean => {
      if (!userType || !role) return false
      return hasAnyPermission(userType, role, perms)
    },
    [userType, role]
  )

  const canAll = useCallback(
    (perms: Permission[]): boolean => {
      if (!userType || !role) return false
      return hasAllPermissions(userType, role, perms)
    },
    [userType, role]
  )

  const checkCanAccessRoute = useCallback(
    (path: string): boolean => {
      if (!userType || !role) return false
      return canAccessRouteCheck(userType, role, path)
    },
    [userType, role]
  )

  return {
    userType,
    role,
    permissions,
    can,
    canAny,
    canAll,
    isPlatformAdmin: userType && role ? isPlatformAdminCheck(userType, role) : false,
    isSuperAdmin: userType && role ? isSuperAdminCheck(userType, role) : false,
    canAccessRoute: checkCanAccessRoute,
  }
}

/**
 * 條件渲染 Component
 * 根據權限決定是否顯示子元素
 *
 * @example
 * ```tsx
 * <Can permission="companies:create">
 *   <Button>新增公司</Button>
 * </Can>
 *
 * <Can permissions={['sources:edit', 'sources:delete']} mode="any">
 *   <ActionButtons />
 * </Can>
 * ```
 */
interface CanProps {
  /** 單一權限 */
  permission?: Permission
  /** 多個權限 */
  permissions?: Permission[]
  /** 檢查模式: any = 任一權限, all = 所有權限 */
  mode?: 'any' | 'all'
  /** 無權限時顯示的內容 */
  fallback?: React.ReactNode
  /** 子元素 */
  children: React.ReactNode
}

export function Can({
  permission,
  permissions,
  mode = 'any',
  fallback = null,
  children,
}: CanProps): React.ReactNode {
  const { can, canAny, canAll } = usePermission()

  let hasAccess = false

  if (permission) {
    hasAccess = can(permission)
  } else if (permissions) {
    hasAccess = mode === 'all' ? canAll(permissions) : canAny(permissions)
  } else {
    // 沒有指定權限，預設顯示
    hasAccess = true
  }

  return hasAccess ? children : fallback
}
