import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface CollapsibleSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section title displayed in the header */
  title: string
  /** Content to show/hide when toggling */
  children: ReactNode
  /** Whether the section is open by default (uncontrolled mode) */
  defaultOpen?: boolean
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Subtitle text displayed below the title */
  description?: string
  /** Content rendered on the right side of the header (e.g. badge, counter) */
  rightSlot?: ReactNode
  /** Prevents toggling when true */
  disabled?: boolean
}

/**
 * Independent collapsible block for form sections, advanced settings, etc.
 *
 * Supports both controlled (`open` / `onOpenChange`) and uncontrolled (`defaultOpen`) modes.
 * Unlike Accordion, each CollapsibleSection operates independently.
 */
export const CollapsibleSection = forwardRef<
  HTMLDivElement,
  CollapsibleSectionProps
>(
  (
    {
      title,
      children,
      defaultOpen = true,
      open: controlledOpen,
      onOpenChange,
      description,
      rightSlot,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledOpen !== undefined
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const isOpen = isControlled ? controlledOpen : uncontrolledOpen

    const handleToggle = useCallback(() => {
      if (disabled) return
      const next = !isOpen
      if (!isControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    }, [disabled, isOpen, isControlled, onOpenChange])

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground',
          disabled && 'opacity-50',
          className
        )}
        {...props}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'flex w-full items-center gap-2 p-4 text-left select-none',
            !disabled && 'cursor-pointer hover:bg-muted/50',
            isOpen && 'border-b'
          )}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-90'
            )}
          />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium">{title}</span>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
          {rightSlot && (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              {rightSlot}
            </div>
          )}
        </button>
        {isOpen && <div className="p-4">{children}</div>}
      </div>
    )
  }
)

CollapsibleSection.displayName = 'CollapsibleSection'
