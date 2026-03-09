import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Alert variant */
  variant?: AlertVariant
  /** Alert title */
  title?: ReactNode
  /** Show icon */
  icon?: boolean
  /** Custom icon */
  customIcon?: ReactNode
  /** Dismissible alert */
  dismissible?: boolean
  /** On dismiss callback */
  onDismiss?: () => void
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200',
  success:
    'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200',
  warning:
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200',
  error:
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200',
}

const iconMap: Record<AlertVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      icon = true,
      customIcon,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent = iconMap[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex gap-3 rounded-lg border p-4',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && (
          <div className="shrink-0">
            {customIcon || <IconComponent className="h-5 w-5" />}
          </div>
        )}
        <div className="flex-1 space-y-1">
          {title && <p className="font-medium leading-none">{title}</p>}
          {children && (
            <div className="text-sm opacity-90">{children}</div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'
