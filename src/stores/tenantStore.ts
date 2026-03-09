/**
 * Tenant Store - 管理 Platform Admin 的租戶切換狀態
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// TODO: decouple from app-specific imports
// Company type should be provided by consuming application

// 簡化的租戶資訊 (用於切換器)
export interface TenantInfo {
  id: string
  name: string
  slug: string
  logo_url?: string
  status: 'active' | 'trial' | 'suspended' | 'expired'
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
}

interface TenantState {
  // 當前選中的租戶 (null = 全平台模式)
  currentTenant: TenantInfo | null
  // 可選擇的租戶列表
  tenants: TenantInfo[]
  // 載入狀態
  isLoading: boolean
  // 錯誤訊息
  error: string | null
}

interface TenantStore extends TenantState {
  // 設定當前租戶
  setCurrentTenant: (tenant: TenantInfo | null) => void
  // 載入租戶列表
  fetchTenants: () => Promise<void>
  // 清除狀態 (登出時)
  reset: () => void
}

// Mock 租戶資料
const MOCK_TENANTS: TenantInfo[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    slug: 'acme',
    status: 'active',
    plan: 'professional',
  },
  {
    id: '2',
    name: 'Beta Industries',
    slug: 'beta',
    status: 'active',
    plan: 'starter',
  },
  {
    id: '3',
    name: 'Gamma Tech',
    slug: 'gamma',
    status: 'trial',
    plan: 'free',
  },
  {
    id: '4',
    name: 'Delta Solutions',
    slug: 'delta',
    status: 'suspended',
    plan: 'enterprise',
  },
]

const initialState: TenantState = {
  currentTenant: null,
  tenants: [],
  isLoading: false,
  error: null,
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set, _get) => ({
      ...initialState,

      /**
       * 設定當前租戶
       */
      setCurrentTenant: (tenant) => {
        set({ currentTenant: tenant })
      },

      /**
       * 載入租戶列表 (Mock implementation)
       */
      fetchTenants: async () => {
        set({ isLoading: true, error: null })

        try {
          // Mock: 模擬延遲
          await new Promise((resolve) => setTimeout(resolve, 300))
          set({ tenants: MOCK_TENANTS, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load tenants',
            isLoading: false,
          })
        }
      },

      /**
       * 清除狀態
       */
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'ark-tenant-storage',
      partialize: (state) => ({
        currentTenant: state.currentTenant,
      }),
    }
  )
)

// 取得當前租戶 ID (用於 API 請求)
export const getCurrentTenantId = (): string | undefined => {
  return useTenantStore.getState().currentTenant?.id
}
