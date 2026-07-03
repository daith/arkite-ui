import { create } from 'zustand'

export interface ToastItem {
  id: string
  variant:
    | 'default'
    | 'success'
    | 'warning'
    | 'info'
    | 'destructive'
    /** @deprecated use `'destructive'` instead — removed in v1.0 */
    | 'error'
  title: string
  description?: string
  duration?: number
  action?: { label: string; onClick: () => void }
}

interface ToastStoreState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
}

const MAX_TOASTS = 5

export const useImperativeToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
    set((state) => {
      const next = [...state.toasts, { ...toast, id }]
      // Keep only the newest MAX_TOASTS, dismiss oldest when exceeding
      if (next.length > MAX_TOASTS) {
        return { toasts: next.slice(next.length - MAX_TOASTS) }
      }
      return { toasts: next }
    })
    return id
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  dismissAllToasts: () => set({ toasts: [] }),
}))
