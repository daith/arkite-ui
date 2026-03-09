import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Required indicator */
  required?: boolean
  /** Optional text to show */
  optional?: boolean
  /** Description text */
  description?: string
}

/** Form label with optional required/optional indicators and description text. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, optional, description, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label
          ref={ref}
          className={cn(
            'text-sm font-medium leading-none',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className
          )}
          {...props}
        >
          {children}
          {required && (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          )}
          {optional && (
            <span className="ml-1 text-muted-foreground font-normal">
              (optional)
            </span>
          )}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    )
  }
)

Label.displayName = 'Label'
