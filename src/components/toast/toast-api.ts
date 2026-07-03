import { useImperativeToastStore, type ToastItem } from './toast-store'

type ToastOptions = Partial<Omit<ToastItem, 'id' | 'title' | 'variant'>>

function show(
  title: string,
  options?: Partial<Omit<ToastItem, 'id' | 'title'>>
): string {
  return useImperativeToastStore.getState().addToast({
    variant: 'default',
    title,
    duration: 5000,
    ...options,
  })
}

function success(title: string, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'success' })
}

function error(title: string, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'destructive' })
}

function warning(title: string, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'warning' })
}

function info(title: string, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'info' })
}

function loading(title: string, options?: ToastOptions): string {
  return show(title, { ...options, variant: 'default' })
}

function dismiss(id: string): void {
  useImperativeToastStore.getState().dismissToast(id)
}

function dismissAll(): void {
  useImperativeToastStore.getState().dismissAllToasts()
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
