import { useEffect, useMemo, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useReducedMotion } from './use-reduced-motion'
import {
  useToastStore,
  type ToastData,
  type ToastVariant,
  type ToastPosition,
} from '../toast/Toast'

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-card border-border',
  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900',
  destructive: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900',
  error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900',
}

const variantTextStyles: Record<ToastVariant, string> = {
  default: 'text-foreground',
  success: 'text-green-800 dark:text-green-200',
  destructive: 'text-red-800 dark:text-red-200',
  error: 'text-red-800 dark:text-red-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  info: 'text-blue-800 dark:text-blue-200',
}

const iconMap: Record<ToastVariant, typeof Info | null> = {
  default: null,
  success: CheckCircle2,
  destructive: AlertCircle,
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

// Slide direction based on position
function getSlideDirection(position: ToastPosition) {
  if (position.includes('right')) return { x: 100 }
  if (position.includes('left')) return { x: -100 }
  if (position.startsWith('top')) return { y: -30 }
  return { y: 30 }
}

interface AnimatedToastItemProps extends ToastData {
  onClose: () => void
  position: ToastPosition
}

function AnimatedToastItem({
  title,
  description,
  variant = 'default',
  duration = 5000,
  action,
  onClose,
  position,
}: AnimatedToastItemProps) {
  const prefersReducedMotion = useReducedMotion()
  const IconComponent = iconMap[variant]
  const slide = getSlideDirection(position)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const animDuration = prefersReducedMotion ? 0 : 0.3

  return (
    <motion.div
      layout
      initial={{ opacity: 0, ...slide }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...slide }}
      transition={{ duration: animDuration, ease: [0.32, 0.72, 0, 1] }}
      role="alert"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm gap-3 rounded-lg border p-4 shadow-lg',
        variantStyles[variant],
        variantTextStyles[variant]
      )}
    >
      {IconComponent && (
        <div className="shrink-0">
          <IconComponent className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        {title && <p className="font-medium leading-none">{title}</p>}
        {description && <p className="text-sm opacity-90">{description}</p>}
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
        onClick={onClose}
        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </motion.div>
  )
}

export interface AnimatedToastContainerProps {
  position?: ToastPosition
  className?: string
}

/** Container that renders animated toast notifications at a configurable screen position. */
export function AnimatedToastContainer({
  position = 'top-right',
  className,
}: AnimatedToastContainerProps) {
  const { toasts, removeToast } = useToastStore()

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionStyles[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <AnimatedToastItem
            key={toast.id}
            {...toast}
            position={position}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Re-export useToast from the original for convenience
export function useAnimatedToast() {
  const { addToast, removeToast, clearToasts } = useToastStore()

  const toast = useMemo(() => {
    const t = Object.assign(
      (options: Omit<ToastData, 'id'>) => addToast(options),
      {
        success: (title: ReactNode, description?: ReactNode) =>
          addToast({ title, description, variant: 'success' as const }),
        error: (title: ReactNode, description?: ReactNode) =>
          addToast({ title, description, variant: 'destructive' as const }),
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
