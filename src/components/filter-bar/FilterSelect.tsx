import { forwardRef, useMemo, type SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import { Select, type SelectOption, type SelectSize } from '../select'

export interface FilterSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'onChange'> {
  /** Filter label — shown as prefix in the "all" option (e.g. "狀態: 全部") */
  label?: string
  /** Options list */
  options?: SelectOption[]
  /** Text for the "all" option — pass `false` to hide it. @default "全部" */
  allLabel?: string | false
  /** Select size @default "sm" */
  size?: SelectSize
  /** Fires with the selected value (empty string for "all") */
  onChange?: (value: string) => void
}

/**
 * Thin wrapper around `<Select>` tailored for filter toolbars.
 *
 * Adds a built-in "all" option and simplifies `onChange` to return
 * the value string directly instead of a change event.
 */
export const FilterSelect = forwardRef<HTMLSelectElement, FilterSelectProps>(
  (
    {
      className,
      label,
      options = [],
      allLabel = '全部',
      size = 'sm',
      onChange,
      ...props
    },
    ref
  ) => {
    const mergedOptions = useMemo(() => {
      if (allLabel === false) return options

      const allText = label ? `${label}: ${allLabel}` : allLabel
      const allOption: SelectOption = { value: '', label: allText }
      return [allOption, ...options]
    }, [options, allLabel, label])

    return (
      <Select
        ref={ref}
        size={size}
        options={mergedOptions}
        className={cn('w-auto', className)}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    )
  }
)

FilterSelect.displayName = 'FilterSelect'
