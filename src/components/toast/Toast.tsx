import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { create } from 'zustand'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'

export interface ToastData {
  id: string
  title?: ReactNode
  description?: ReactNode
  variant?: ToastVariant
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastStore {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
    return id
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-card border-border',
  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900',
  error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900',
}

const variantTextStyles: Record<ToastVariant, string> = {
  default: 'text-foreground',
  success: 'text-green-800 dark:text-green-200',
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  info: 'text-blue-800 dark:text-blue-200',
}

const iconMap: Record<ToastVariant, typeof Info | null> = {
  default: null,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
}

export interface ToastProps extends ToastData {
  onClose: () => void
}

/** Individual toast notification with auto-dismiss and variant styling. */
export function Toast({
  id: _id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  action,
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const IconComponent = iconMap[variant]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(onClose, 200)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(onClose, 200)
  }

  return (
    <div
      role="alert"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm gap-3 rounded-lg border p-4 shadow-lg transition-all duration-200',
        variantStyles[variant],
        variantTextStyles[variant],
        isExiting ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
      )}
    >
      {IconComponent && (
        <div className="shrink-0">
          <IconComponent className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        {title && <p className="font-medium leading-none">{title}</p>}
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  position?: ToastPosition
  className?: string
}

/** Fixed-position container that renders active toasts from the toast store. */
export function ToastContainer({
  position = 'top-right',
  className,
}: ToastContainerProps) {
  const { toasts, removeToast } = useToastStore()

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionStyles[position],
        className
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Hook for using toasts
export function useToast() {
  const { addToast, removeToast, clearToasts } = useToastStore()

  const toast = useMemo(() => {
    const t = Object.assign(
      (options: Omit<ToastData, 'id'>) => addToast(options),
      {
        success: (title: ReactNode, description?: ReactNode) =>
          addToast({ title, description, variant: 'success' as const }),
        error: (title: ReactNode, description?: ReactNode) =>
          addToast({ title, description, variant: 'error' as const }),
        warning: (title: ReactNode, description?: ReactNode) =>
          addToast({ title, description, variant: 'warning' as const }),
        info: (title: ReactNode, description?: ReactNode) =>
          addToast({ title, description, variant: 'info' as const }),
        dismiss: removeToast,
        clear: clearToasts,
      }
    )
    return t
  }, [addToast, removeToast, clearToasts])

  return toast
}
