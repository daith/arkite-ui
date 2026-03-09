import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type InputHTMLAttributes,
} from 'react'
import { cn } from '../../utils/cn'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return format
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day)
}

function parseDate(dateStr: string, format: string): Date | null {
  const yearMatch = format.indexOf('yyyy')
  const monthMatch = format.indexOf('MM')
  const dayMatch = format.indexOf('dd')

  if (yearMatch === -1 || monthMatch === -1 || dayMatch === -1) return null

  const year = parseInt(dateStr.slice(yearMatch, yearMatch + 4))
  const month = parseInt(dateStr.slice(monthMatch, monthMatch + 2)) - 1
  const day = parseInt(dateStr.slice(dayMatch, dayMatch + 2))

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null

  return new Date(year, month, day)
}

export type DatePickerSize = 'sm' | 'md' | 'lg'

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
  /** Selected date */
  value?: Date | null
  /** On date change */
  onChange?: (date: Date | null) => void
  /** Date format */
  format?: string
  /** Minimum date */
  minDate?: Date
  /** Maximum date */
  maxDate?: Date
  /** Disabled dates */
  disabledDates?: Date[]
  /** Show clear button */
  clearable?: boolean
  /** Error state */
  error?: boolean
  /** Size variant */
  size?: DatePickerSize
}

const inputSizeStyles: Record<DatePickerSize, string> = {
  sm: 'h-8 px-3 pr-8 text-xs',
  md: 'h-10 px-3 pr-10 text-sm',
  lg: 'h-12 px-4 pr-12 text-base',
}

const iconSizeStyles: Record<DatePickerSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      value,
      onChange,
      format = 'yyyy-MM-dd',
      minDate,
      maxDate,
      disabledDates = [],
      clearable: _clearable = true,
      error,
      disabled,
      size = 'md',
      placeholder = 'Select date',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState(value ? formatDate(value, format) : '')
    const [viewDate, setViewDate] = useState(value || new Date())
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync input value with prop value
    useEffect(() => {
      if (value) {
        setInputValue(formatDate(value, format)) // eslint-disable-line react-hooks/set-state-in-effect -- syncing derived state from props
        setViewDate(value)
      } else {
        setInputValue('')
      }
    }, [value, format])

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const isDateDisabled = (date: Date): boolean => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return disabledDates.some(
        (d) => d.toDateString() === date.toDateString()
      )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setInputValue(val)

      const parsed = parseDate(val, format)
      if (parsed && !isNaN(parsed.getTime()) && !isDateDisabled(parsed)) {
        onChange?.(parsed)
        setViewDate(parsed)
      }
    }

    const handleDateSelect = (day: number) => {
      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      if (!isDateDisabled(newDate)) {
        onChange?.(newDate)
        setIsOpen(false)
      }
    }

    const handlePrevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
    }

    const renderCalendar = () => {
      const year = viewDate.getFullYear()
      const month = viewDate.getMonth()
      const daysInMonth = getDaysInMonth(year, month)
      const firstDay = getFirstDayOfMonth(year, month)
      const today = new Date()

      const days: (number | null)[] = []

      // Empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        days.push(null)
      }

      // Days of month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
      }

      return (
        <div className="p-3 w-64">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-8" />
              }

              const date = new Date(year, month, day)
              const isDisabled = isDateDisabled(date)
              const isSelected = value?.toDateString() === date.toDateString()
              const isToday = today.toDateString() === date.toDateString()

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    'h-8 w-8 rounded-md text-sm transition-colors',
                    'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
                    isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                    isToday && !isSelected && 'bg-muted',
                    isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Today button */}
          <div className="mt-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => {
                const today = new Date()
                if (!isDateDisabled(today)) {
                  onChange?.(today)
                  setIsOpen(false)
                }
              }}
              className="w-full text-sm text-primary hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )
    }

    return (
      <div ref={containerRef} className={cn('relative', className)}>
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex w-full rounded-md border border-input bg-background',
              inputSizeStyles[size],
              'ring-offset-background placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              disabled && 'cursor-not-allowed'
            )}
          >
            <CalendarIcon className={iconSizeStyles[size]} />
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 rounded-md border bg-card shadow-lg">
            {renderCalendar()}
          </div>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
