import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { warnDeprecated } from '../../utils/deprecate'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react'

export type AlertVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'destructive'
  /** @deprecated use `'destructive'` instead — removed in v1.0 */
  | 'error'

type ResolvedAlertVariant = Exclude<AlertVariant, 'error'>

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
  /** On close callback */
  onClose?: () => void
  /** @deprecated use `onClose` instead — removed in v1.0 */
  onDismiss?: () => void
}

const variantStyles: Record<ResolvedAlertVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200',
  success:
    'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-200',
  warning:
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-200',
  destructive:
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-200',
}

const iconMap: Record<ResolvedAlertVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
}

/** Contextual feedback message with variant-based styling, optional icon, and dismissible support. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      icon = true,
      customIcon,
      dismissible = false,
      onClose,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    if (variant === 'error') {
      warnDeprecated('Alert', 'variant="error"', 'variant="destructive"')
    }
    if (onDismiss) {
      warnDeprecated('Alert', 'onDismiss', 'onClose')
    }
    const resolvedVariant: ResolvedAlertVariant =
      variant === 'error' ? 'destructive' : variant
    const handleClose = onClose ?? onDismiss
    const IconComponent = iconMap[resolvedVariant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex gap-3 rounded-lg border p-4',
          variantStyles[resolvedVariant],
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
            onClick={handleClose}
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
