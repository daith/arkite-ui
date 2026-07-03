import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'
import { warnDeprecated } from '../../utils/deprecate'
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { useImperativeToastStore, type ToastItem } from './toast-store'
import type { ToastPosition } from './Toast'

type ResolvedToastItemVariant = Exclude<ToastItem['variant'], 'error'>

const variantStyles: Record<ResolvedToastItemVariant, string> = {
  default: 'bg-card border-border',
  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900',
  destructive: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900',
}

const variantTextStyles: Record<ResolvedToastItemVariant, string> = {
  default: 'text-foreground',
  success: 'text-green-800 dark:text-green-200',
  destructive: 'text-red-800 dark:text-red-200',
  warning: 'text-yellow-800 dark:text-yellow-200',
  info: 'text-blue-800 dark:text-blue-200',
}

const iconMap: Record<ResolvedToastItemVariant, typeof Info | null> = {
  default: null,
  success: CheckCircle2,
  destructive: AlertCircle,
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

interface ImperativeToastProps {
  item: ToastItem
  onClose: () => void
  isLoading?: boolean
}

function ImperativeToast({ item, onClose, isLoading }: ImperativeToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const duration = item.duration ?? 5000
  if (item.variant === 'error') {
    warnDeprecated('Toast', 'variant="error"', 'variant="destructive"')
  }
  const resolvedVariant: ResolvedToastItemVariant =
    item.variant === 'error' ? 'destructive' : item.variant
  const IconComponent = isLoading ? null : iconMap[resolvedVariant]

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
        variantStyles[resolvedVariant],
        variantTextStyles[resolvedVariant],
        isExiting ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
      )}
    >
      {isLoading && (
        <div className="shrink-0">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {IconComponent && (
        <div className="shrink-0">
          <IconComponent className="h-5 w-5" />
        </div>
      )}
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-none">{item.title}</p>
        {item.description && (
          <p className="text-sm opacity-90">{item.description}</p>
        )}
        {item.action && (
          <button
            onClick={item.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {item.action.label}
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

export interface ImperativeToastContainerProps {
  position?: ToastPosition
  className?: string
}

/** Fixed-position container that renders toasts from the imperative toast API. */
export function ImperativeToastContainer({
  position = 'bottom-right',
  className,
}: ImperativeToastContainerProps) {
  const { toasts, dismissToast } = useImperativeToastStore()

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionStyles[position],
        className
      )}
    >
      {toasts.map((item) => (
        <ImperativeToast
          key={item.id}
          item={item}
          onClose={() => dismissToast(item.id)}
        />
      ))}
    </div>
  )
}
