import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../utils/cn'

export type TabsVariant = 'default' | 'pills' | 'underline'
export type TabsSize = 'sm' | 'md' | 'lg'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  variant: TabsVariant
  size: TabsSize
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Currently active tab value */
  value?: string
  /** Default active tab (uncontrolled) */
  defaultValue?: string
  /** Callback when tab changes */
  onValueChange?: (value: string) => void
  /** Tab style variant */
  variant?: TabsVariant
  /** Tab size */
  size?: TabsSize
}

/** Tabbed navigation container supporting default, pill, and underline variants. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      variant = 'default',
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '')

    const value = controlledValue ?? uncontrolledValue
    const handleValueChange = (newValue: string) => {
      setUncontrolledValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <TabsContext.Provider
        value={{ value, onValueChange: handleValueChange, variant, size }}
      >
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'

export type TabsListProps = HTMLAttributes<HTMLDivElement>

const listVariantStyles: Record<TabsVariant, string> = {
  default: 'bg-muted rounded-lg p-1',
  pills: 'gap-1',
  underline: 'border-b gap-4',
}

/** Container for tab trigger buttons. */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    const { variant } = useTabsContext()

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'inline-flex items-center',
          listVariantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)

TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  /** Tab value */
  value: string
  /** Disabled state */
  disabled?: boolean
  /** Icon to show before label */
  icon?: ReactNode
}

const triggerSizeStyles: Record<TabsSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

const triggerVariantStyles: Record<TabsVariant, { base: string; active: string }> = {
  default: {
    base: 'rounded-md text-muted-foreground hover:text-foreground',
    active: 'bg-background text-foreground shadow-sm',
  },
  pills: {
    base: 'rounded-full text-muted-foreground hover:text-foreground hover:bg-muted',
    active: 'bg-primary text-primary-foreground',
  },
  underline: {
    base: 'text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px',
    active: 'text-foreground border-primary',
  },
}

/** Clickable tab button that activates its associated content panel. */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, disabled, icon, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, variant, size } = useTabsContext()
    const isActive = selectedValue === value
    const styles = triggerVariantStyles[variant]

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        disabled={disabled}
        onClick={() => onValueChange(value)}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          triggerSizeStyles[size],
          styles.base,
          isActive && styles.active,
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
    )
  }
)

TabsTrigger.displayName = 'TabsTrigger'

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Tab value */
  value: string
  /** Force render even when not active */
  forceMount?: boolean
}

/** Panel that displays content for the currently active tab. */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, forceMount, children, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext()
    const isActive = selectedValue === value

    if (!forceMount && !isActive) return null

    return (
      <div
        ref={ref}
        id={`tabpanel-${value}`}
        role="tabpanel"
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        hidden={!isActive}
        className={cn(
          'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabsContent.displayName = 'TabsContent'
