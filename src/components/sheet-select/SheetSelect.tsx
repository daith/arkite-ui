import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../utils/cn'
import { Check, ChevronDown } from 'lucide-react'
import { Drawer } from '../drawer'

export type SheetSelectSize = 'sm' | 'md' | 'lg'

export interface SheetSelectOption {
  value: string
  label: string
  /** Secondary line shown under the label */
  description?: string
  disabled?: boolean
}

export interface SheetSelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'title'> {
  /** Options list */
  options: readonly SheetSelectOption[]
  /** Selected value */
  value?: string
  /** Callback when an option is selected */
  onChange?: (value: string) => void
  /** Placeholder text shown when nothing is selected */
  placeholder?: string
  /** Sheet header title */
  title?: ReactNode
  /** Disable the trigger */
  disabled?: boolean
  /** Error state */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Trigger size */
  size?: SheetSelectSize
  /** Custom option renderer */
  renderOption?: (option: SheetSelectOption, selected: boolean) => ReactNode
}

const sizeStyles: Record<SheetSelectSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const iconSizeStyles: Record<SheetSelectSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

/**
 * Mobile-friendly select that opens a bottom sheet with large touch targets
 * instead of a dropdown. Built on Drawer.
 */
export const SheetSelect = forwardRef<HTMLButtonElement, SheetSelectProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      placeholder = 'Select…',
      title,
      disabled = false,
      error = false,
      errorMessage,
      size = 'md',
      renderOption,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const selected = options.find((option) => option.value === value)

    const handleSelect = (option: SheetSelectOption) => {
      if (option.disabled) return
      onChange?.(option.value)
      setOpen(false)
    }

    return (
      <>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md border bg-background text-left',
            'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring/30 focus-visible:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            sizeStyles[size],
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input',
            className
          )}
          {...props}
        >
          <span className={cn('truncate', !selected && 'text-muted-foreground')}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            className={cn('shrink-0 text-muted-foreground', iconSizeStyles[size])}
          />
        </button>
        {errorMessage && (
          <p className="mt-1.5 text-xs text-destructive">{errorMessage}</p>
        )}

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          position="bottom"
          showCloseButton={false}
          className="h-auto max-h-[85dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]"
        >
          {/* Grab handle */}
          <div
            className="mx-auto mb-3 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/30"
            aria-hidden="true"
          />
          {title && (
            <div className="mb-2 px-1 text-base font-semibold text-foreground">
              {title}
            </div>
          )}
          <div role="listbox" aria-label={typeof title === 'string' ? title : undefined} className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm',
                    isSelected
                      ? 'bg-muted font-medium text-foreground'
                      : 'hover:bg-muted/50',
                    option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                  )}
                >
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <span className="min-w-0">
                      <span className="block truncate">{option.label}</span>
                      {option.description && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="h-4.5 w-4.5 shrink-0 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </Drawer>
      </>
    )
  }
)

SheetSelect.displayName = 'SheetSelect'
