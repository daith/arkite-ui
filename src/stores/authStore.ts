import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// TODO: decouple from app-specific imports
// These types and API functions should be provided by the consuming application
export interface UserProfile {
  id: number
  email: string
  name: string
  is_active: boolean
  mfa_enabled: boolean
  created_at: string
  updated_at: string
  user_type?: 'platform' | 'tenant'
  role?: string
  is_super_admin?: boolean
  is_system_staff?: boolean
  tenant_id?: string
  tenant_name?: string
}

export interface LoginRequest {
  email: string
  password: string
}

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  setUser: (user: UserProfile | null) => void
  initialize: () => Promise<void>
}

// ============================================================================
// Mock Users - 開發環境測試用
// ============================================================================

interface MockUser {
  email: string
  password: string
  profile: UserProfile
}

const MOCK_USERS: MockUser[] = [
  // Platform Super Admin
  {
    email: 'admin@example.com',
    password: 'password',
    profile: {
      id: 1,
      email: 'admin@example.com',
      name: 'Super Admin',
      is_active: true,
      mfa_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_type: 'platform',
      role: 'super_admin',
      // 向後兼容
      is_super_admin: true,
      is_system_staff: false,
    },
  },
  // Platform Staff
  {
    email: 'staff@example.com',
    password: 'password',
    profile: {
      id: 2,
      email: 'staff@example.com',
      name: 'Platform Staff',
      is_active: true,
      mfa_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_type: 'platform',
      role: 'system_staff',
      // 向後兼容
      is_super_admin: false,
      is_system_staff: true,
    },
  },
  // Tenant Admin
  {
    email: 'tenant@example.com',
    password: 'password',
    profile: {
      id: 3,
      email: 'tenant@example.com',
      name: 'Tenant Admin',
      is_active: true,
      mfa_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_type: 'tenant',
      role: 'tenant_admin',
      tenant_id: '1',
      tenant_name: 'Acme Corporation',
      // 向後兼容
      is_super_admin: false,
      is_system_staff: false,
    },
  },
  // Tenant Member
  {
    email: 'member@example.com',
    password: 'password',
    profile: {
      id: 4,
      email: 'member@example.com',
      name: 'Team Member',
      is_active: true,
      mfa_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_type: 'tenant',
      role: 'member',
      tenant_id: '1',
      tenant_name: 'Acme Corporation',
      // 向後兼容
      is_super_admin: false,
      is_system_staff: false,
    },
  },
  // Tenant Viewer
  {
    email: 'viewer@example.com',
    password: 'password',
    profile: {
      id: 5,
      email: 'viewer@example.com',
      name: 'Viewer User',
      is_active: true,
      mfa_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_type: 'tenant',
      role: 'viewer',
      tenant_id: '1',
      tenant_name: 'Acme Corporation',
      // 向後兼容
      is_super_admin: false,
      is_system_staff: false,
    },
  },
]

// 預設 Mock User (Super Admin)
const DEFAULT_MOCK_USER = MOCK_USERS[0].profile

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * 登入 (Mock implementation)
       */
      login: async (credentials) => {
        set({ isLoading: true })

        try {
          // Mock login
          await new Promise((resolve) => setTimeout(resolve, 500))

          // 查找匹配的 mock user
          const mockUser = MOCK_USERS.find(
            (u) => u.email === credentials.email && u.password === credentials.password
          )

          if (mockUser) {
            set({
              user: mockUser.profile,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            throw new Error('Invalid email or password')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      /**
       * 登出
       */
      logout: async () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      /**
       * 取得當前用戶資訊
       */
      fetchUser: async () => {
        // Mock: 如果已認證，保持現有 user (或設定預設)
        const currentUser = get().user
        if (get().isAuthenticated && !currentUser) {
          set({ user: DEFAULT_MOCK_USER })
        }
      },

      /**
       * 設定用戶
       */
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },

      /**
       * 初始化認證狀態
       */
      initialize: async () => {
        // Mock 模式: 保持 persist 的狀態
      },
    }),
    {
      name: 'ark-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
