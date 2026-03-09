import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Toggle size */
  size?: ToggleSize
  /** Label text */
  label?: string
  /** Description text */
  description?: string
}

const sizeStyles: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'h-5 w-9',
    thumb: 'h-4 w-4',
    translate: 'translate-x-4',
  },
  md: {
    track: 'h-6 w-11',
    thumb: 'h-5 w-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'h-7 w-14',
    thumb: 'h-6 w-6',
    translate: 'translate-x-7',
  },
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      className,
      size = 'md',
      label,
      description,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size]
    const toggleId = id || `toggle-${Math.random().toString(36).slice(2)}`

    const toggle = (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          role="switch"
          ref={ref}
          id={toggleId}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'rounded-full bg-input transition-colors duration-200',
            'peer-checked:bg-primary',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            styles.track
          )}
        >
          <div
            className={cn(
              'rounded-full bg-background shadow-sm transition-transform duration-200',
              'translate-x-0.5 peer-checked:' + styles.translate,
              styles.thumb,
              'mt-0.5'
            )}
          />
        </div>
      </div>
    )

    if (!label && !description) {
      return <div className={className}>{toggle}</div>
    }

    return (
      <div className={cn('flex items-start gap-3', className)}>
        {toggle}
        <div className="space-y-1">
          {label && (
            <label
              htmlFor={toggleId}
              className={cn(
                'text-sm font-medium leading-none cursor-pointer',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
