import { create } from 'zustand'
import type { ToastData } from './Toast'

/** @deprecated Use `ToastData` instead — removed in v1.0. */
export type ToastItem = ToastData

interface ToastStoreState {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
  /** @deprecated Use `dismissToast` instead — removed in v1.0. */
  removeToast: (id: string) => void
  /** @deprecated Use `dismissAllToasts` instead — removed in v1.0. */
  clearToasts: () => void
}

const MAX_TOASTS = 5

/** Single shared store behind both `useToast()` and the imperative `toast` API. */
export const useToastStore = create<ToastStoreState>((set, get) => ({
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
  removeToast: (id) => get().dismissToast(id),
  clearToasts: () => get().dismissAllToasts(),
}))

/** @deprecated Use `useToastStore` instead — removed in v1.0. */
export const useImperativeToastStore = useToastStore
