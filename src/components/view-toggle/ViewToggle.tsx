import { type ReactNode } from 'react'
import { LayoutGrid, LayoutList } from 'lucide-react'
import { cn } from '../../utils/cn'

export type ViewMode = 'table' | 'card'

export interface ViewToggleProps {
  /** Current view mode */
  value: ViewMode
  /** View change callback */
  onChange: (mode: ViewMode) => void
  /** Size variant */
  size?: 'sm' | 'md'
  /** Additional class name */
  className?: string
}

interface ViewOption {
  mode: ViewMode
  icon: ReactNode
  label: string
}

const sizeStyles = {
  sm: { wrapper: 'h-8', button: 'h-6 w-6', icon: 'h-3.5 w-3.5' },
  md: { wrapper: 'h-9', button: 'h-7 w-7', icon: 'h-4 w-4' },
}

/** Toggle between table and card view layouts. */
export function ViewToggle({
  value,
  onChange,
  size = 'md',
  className,
}: ViewToggleProps) {
  const styles = sizeStyles[size]

  const options: ViewOption[] = [
    { mode: 'table', icon: <LayoutList className={styles.icon} />, label: 'Table view' },
    { mode: 'card', icon: <LayoutGrid className={styles.icon} />, label: 'Card view' },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="View mode"
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-input bg-background p-1',
        styles.wrapper,
        className
      )}
    >
      {options.map(({ mode, icon, label }) => (
        <button
          key={mode}
          type="button"
          role="radio"
          aria-checked={value === mode}
          aria-label={label}
          onClick={() => onChange(mode)}
          className={cn(
            'inline-flex items-center justify-center rounded-sm transition-colors',
            styles.button,
            value === mode
              ? 'bg-secondary text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
