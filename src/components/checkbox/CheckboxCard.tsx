import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Check } from 'lucide-react'

export interface CheckboxCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Card title / label */
  label: string
  /** Optional description below the label */
  description?: string
}

/**
 * Checkbox presented as a selectable card with label and description.
 *
 * Useful for feature toggles, permission lists, onboarding options, etc.
 */
export const CheckboxCard = forwardRef<HTMLInputElement, CheckboxCardProps>(
  ({ className, label, description, disabled, id, ...props }, ref) => {
    const stableId = useId()
    const inputId = id || stableId

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'relative flex items-start gap-3 rounded-lg border border-input bg-background p-4',
          'transition-colors duration-200',
          'has-[:checked]:border-primary has-[:checked]:bg-primary/5',
          'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:border-muted-foreground/50',
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border',
            'border-input transition-colors duration-200',
            'peer-checked:border-primary peer-checked:bg-primary'
          )}
        >
          <Check className="h-3.5 w-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium leading-none">{label}</div>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </label>
    )
  }
)

CheckboxCard.displayName = 'CheckboxCard'
