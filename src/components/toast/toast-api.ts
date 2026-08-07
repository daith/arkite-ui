import type { ReactNode } from 'react'
import { useToastStore } from './toast-store'
import type { ToastData } from './Toast'

export type ToastOptions = Partial<Omit<ToastData, 'id' | 'title' | 'variant'>>

function show(
  title: ReactNode,
  options?: Partial<Omit<ToastData, 'id' | 'title'>>
): string {
  return useToastStore.getState().addToast({
    variant: 'default',
    title,
    duration: 5000,
    ...options,
  })
}

function success(title: ReactNode, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'success' })
}

function error(title: ReactNode, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'destructive' })
}

function warning(title: ReactNode, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'warning' })
}

function info(title: ReactNode, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'info' })
}

function loading(title: ReactNode, options?: ToastOptions): string {
  // Loading toasts show a spinner and stay until dismissed (duration can be overridden).
  return show(title, { duration: 0, ...options, isLoading: true })
}

function dismiss(id: string): void {
  useToastStore.getState().dismissToast(id)
}

function dismissAll(): void {
  useToastStore.getState().dismissAllToasts()
}

export const toast = {
  show,
  success,
  error,
  warning,
  info,
  loading,
  dismiss,
  dismissAll,
}
