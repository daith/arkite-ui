import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../utils/cn'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export type DateRangePickerSize = 'sm' | 'md' | 'lg'
export type DateRangePickerVariant = 'input' | 'calendar'

export interface DateRangePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Selected start date */
  startDate?: Date | null
  /** Selected end date */
  endDate?: Date | null
  /** Called when the start date changes */
  onStartChange?: (date: Date | null) => void
  /** Called when the end date changes */
  onEndChange?: (date: Date | null) => void
  /** Called when the clear button is clicked, resetting both dates */
  onClear?: () => void
  /** Label for the start date input */
  startLabel?: string
  /** Label for the end date input */
  endLabel?: string
  /** Date display format */
  format?: string
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Disabled state for both inputs */
  disabled?: boolean
  /** Error state for both inputs */
  error?: boolean
  /** Error message */
  errorMessage?: string
  /** Size variant */
  size?: DateRangePickerSize
  /** Display variant. 'input' shows two text inputs (default). 'calendar' shows a single trigger button with a dual-month calendar popover. */
  variant?: DateRangePickerVariant
}

const inputSizeStyles: Record<DateRangePickerSize, string> = {
  sm: 'h-8 px-3 pr-8 text-xs',
  md: 'h-10 px-3 pr-10 text-sm',
  lg: 'h-12 px-4 pr-12 text-base',
}

const iconSizeStyles: Record<DateRangePickerSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

const labelSizeStyles: Record<DateRangePickerSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const triggerSizeStyles: Record<DateRangePickerSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

type ActiveField = 'start' | 'end' | null

/**
 * A date range picker with two side-by-side date inputs (start and end),
 * shared calendar dropdowns, and a clear button to reset both values.
 *
 * When `variant="calendar"`, renders a single trigger button that opens
 * a dual-month calendar popover for visual range selection.
 *
 * The start date constrains the end date — the end date cannot be set
 * earlier than the start date.
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className,
      startDate,
      endDate,
      onStartChange,
      onEndChange,
      onClear,
      startLabel = 'Start',
      endLabel = 'End',
      format = 'yyyy-MM-dd',
      minDate,
      maxDate,
      disabled,
      error,
      errorMessage,
      size = 'md',
      variant = 'input',
      ...props
    },
    ref
  ) => {
    const [activeField, setActiveField] = useState<ActiveField>(null)
    const [startInputValue, setStartInputValue] = useState(
      startDate ? formatDate(startDate, format) : ''
    )
    const [endInputValue, setEndInputValue] = useState(
      endDate ? formatDate(endDate, format) : ''
    )
    const [viewDate, setViewDate] = useState(
      startDate || endDate || new Date()
    )
    const containerRef = useRef<HTMLDivElement>(null)

    // Calendar variant state
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [calendarViewDate, setCalendarViewDate] = useState(
      startDate || new Date()
    )
    const [calendarSelectionPhase, setCalendarSelectionPhase] = useState<'start' | 'end'>('start')
    const [calendarPendingStart, setCalendarPendingStart] = useState<Date | null>(null)
    const [calendarHoverDate, setCalendarHoverDate] = useState<Date | null>(null)

    // Sync start input value with prop
    useEffect(() => {
      if (startDate) {
        setStartInputValue(formatDate(startDate, format)) // eslint-disable-line react-hooks/set-state-in-effect -- syncing derived state from props
      } else {
        setStartInputValue('')
      }
    }, [startDate, format])

    // Sync end input value with prop
    useEffect(() => {
      if (endDate) {
        setEndInputValue(formatDate(endDate, format)) // eslint-disable-line react-hooks/set-state-in-effect -- syncing derived state from props
      } else {
        setEndInputValue('')
      }
    }, [endDate, format])

    // Update viewDate when the active field or dates change (input variant)
    useEffect(() => {
      if (activeField === 'start' && startDate) {
        setViewDate(startDate) // eslint-disable-line react-hooks/set-state-in-effect -- syncing view to active field
      } else if (activeField === 'end' && endDate) {
        setViewDate(endDate)
      }
    }, [activeField, startDate, endDate])

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setActiveField(null)
          setCalendarOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const isDateDisabled = useCallback((date: Date, field: ActiveField): boolean => {
      const d = stripTime(date)
      if (minDate && d < stripTime(minDate)) return true
      if (maxDate && d > stripTime(maxDate)) return true
      // End date cannot be before start date
      if (field === 'end' && startDate && d < stripTime(startDate)) return true
      return false
    }, [minDate, maxDate, startDate])

    // --- Input variant handlers ---

    const handleStartInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const val = e.target.value
      setStartInputValue(val)

      const parsed = parseDate(val, format)
      if (parsed && !isNaN(parsed.getTime()) && !isDateDisabled(parsed, 'start')) {
        onStartChange?.(parsed)
        setViewDate(parsed)
        // If end date is now before start, clear it
        if (endDate && stripTime(endDate) < stripTime(parsed)) {
          onEndChange?.(null)
        }
      }
    }

    const handleEndInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setEndInputValue(val)

      const parsed = parseDate(val, format)
      if (parsed && !isNaN(parsed.getTime()) && !isDateDisabled(parsed, 'end')) {
        onEndChange?.(parsed)
        setViewDate(parsed)
      }
    }

    const handleDateSelect = (day: number) => {
      const newDate = new Date(
        viewDate.getFullYear(),
        viewDate.getMonth(),
        day
      )

      if (activeField === 'start') {
        if (!isDateDisabled(newDate, 'start')) {
          onStartChange?.(newDate)
          // If end date is now before the new start, clear it
          if (endDate && stripTime(endDate) < stripTime(newDate)) {
            onEndChange?.(null)
          }
          setActiveField('end')
        }
      } else if (activeField === 'end') {
        if (!isDateDisabled(newDate, 'end')) {
          onEndChange?.(newDate)
          setActiveField(null)
        }
      }
    }

    const handlePrevMonth = () => {
      setViewDate(
        new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
      )
    }

    const handleNextMonth = () => {
      setViewDate(
        new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
      )
    }

    const handleClear = () => {
      onStartChange?.(null)
      onEndChange?.(null)
      onClear?.()
    }

    const hasDates = startDate || endDate

    const renderCalendar = () => {
      const year = viewDate.getFullYear()
      const month = viewDate.getMonth()
      const daysInMonth = getDaysInMonth(year, month)
      const firstDay = getFirstDayOfMonth(year, month)
      const today = new Date()

      const days: (number | null)[] = []

      for (let i = 0; i < firstDay; i++) {
        days.push(null)
      }

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
              const dateStr = date.toDateString()
              const isDisabledDay = isDateDisabled(date, activeField)
              const isStartSelected =
                startDate?.toDateString() === dateStr
              const isEndSelected =
                endDate?.toDateString() === dateStr
              const isSelected = isStartSelected || isEndSelected
              const isInRange =
                startDate &&
                endDate &&
                stripTime(date) > stripTime(startDate) &&
                stripTime(date) < stripTime(endDate)
              const isToday = today.toDateString() === dateStr

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isDisabledDay}
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    'h-8 w-8 rounded-md text-sm transition-colors',
                    'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
                    isSelected &&
                      'bg-primary text-primary-foreground hover:bg-primary',
                    isInRange && 'bg-primary/10',
                    isToday && !isSelected && 'bg-muted',
                    isDisabledDay &&
                      'opacity-50 cursor-not-allowed hover:bg-transparent'
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
                if (!isDateDisabled(today, activeField)) {
                  handleDateSelect(today.getDate())
                  setViewDate(today)
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

    // --- Calendar variant handlers ---

    const isCalendarDateDisabled = useCallback((date: Date): boolean => {
      const d = stripTime(date)
      if (minDate && d < stripTime(minDate)) return true
      if (maxDate && d > stripTime(maxDate)) return true
      // When selecting end date, cannot be before pending start
      if (calendarSelectionPhase === 'end' && calendarPendingStart && d < stripTime(calendarPendingStart)) return true
      return false
    }, [minDate, maxDate, calendarSelectionPhase, calendarPendingStart])

    const handleCalendarToggle = () => {
      if (disabled) return
      if (!calendarOpen) {
        // Reset selection phase when opening
        setCalendarSelectionPhase('start')
        setCalendarPendingStart(null)
        setCalendarHoverDate(null)
        setCalendarViewDate(startDate || new Date())
      }
      setCalendarOpen(!calendarOpen)
    }

    const handleCalendarDateSelect = (date: Date) => {
      if (isCalendarDateDisabled(date)) return

      if (calendarSelectionPhase === 'start') {
        setCalendarPendingStart(date)
        onStartChange?.(date)
        // If existing end date is before new start, clear it
        if (endDate && stripTime(endDate) < stripTime(date)) {
          onEndChange?.(null)
        }
        setCalendarSelectionPhase('end')
      } else {
        // End date selection
        onEndChange?.(date)
        setCalendarPendingStart(null)
        setCalendarHoverDate(null)
        setCalendarSelectionPhase('start')
        setCalendarOpen(false)
      }
    }

    const handleCalendarPrevMonth = () => {
      setCalendarViewDate(
        new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1)
      )
    }

    const handleCalendarNextMonth = () => {
      setCalendarViewDate(
        new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1)
      )
    }

    const handleCalendarClear = () => {
      onStartChange?.(null)
      onEndChange?.(null)
      onClear?.()
      setCalendarPendingStart(null)
      setCalendarHoverDate(null)
      setCalendarSelectionPhase('start')
    }

    const handleCalendarToday = () => {
      const today = new Date()
      const stripped = stripTime(today)
      if (!isCalendarDateDisabled(stripped)) {
        handleCalendarDateSelect(stripped)
        setCalendarViewDate(stripped)
      }
    }

    const renderDualMonthCalendar = () => {
      const leftYear = calendarViewDate.getFullYear()
      const leftMonth = calendarViewDate.getMonth()
      const rightDate = new Date(leftYear, leftMonth + 1, 1)
      const rightYear = rightDate.getFullYear()
      const rightMonth = rightDate.getMonth()

      const renderMonthGrid = (year: number, month: number) => {
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)
        const today = new Date()

        const days: (number | null)[] = []
        for (let i = 0; i < firstDay; i++) {
          days.push(null)
        }
        for (let i = 1; i <= daysInMonth; i++) {
          days.push(i)
        }

        // Determine effective start/end for highlight
        const effectiveStart = calendarPendingStart || startDate
        const effectiveEnd = calendarSelectionPhase === 'end' && calendarHoverDate
          ? calendarHoverDate
          : endDate

        return (
          <div className="p-3 w-64">
            {/* Month title (no nav arrows, arrows are in the outer header) */}
            <div className="flex items-center justify-center mb-3">
              <span className="text-sm font-medium">
                {MONTHS[month]} {year}
              </span>
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
                const dateStr = date.toDateString()
                const isDisabledDay = isCalendarDateDisabled(date)
                const isStartSelected = startDate?.toDateString() === dateStr
                const isEndSelected = endDate?.toDateString() === dateStr
                const isPendingStart = calendarPendingStart?.toDateString() === dateStr
                const isSelected = isStartSelected || isEndSelected || isPendingStart
                const isToday = today.toDateString() === dateStr

                // Range highlight
                const d = stripTime(date)
                const isInRange =
                  effectiveStart &&
                  effectiveEnd &&
                  d > stripTime(effectiveStart) &&
                  d < stripTime(effectiveEnd)

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isDisabledDay}
                    onClick={() => handleCalendarDateSelect(date)}
                    onMouseEnter={() => {
                      if (calendarSelectionPhase === 'end') {
                        setCalendarHoverDate(date)
                      }
                    }}
                    className={cn(
                      'h-8 w-8 rounded-md text-sm transition-colors',
                      'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
                      isSelected &&
                        'bg-primary text-primary-foreground hover:bg-primary',
                      isInRange && 'bg-primary/10',
                      isToday && !isSelected && 'bg-muted',
                      isDisabledDay &&
                        'opacity-50 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )
      }

      return (
        <div
          className="absolute top-full left-0 z-50 mt-1 rounded-lg border bg-card shadow-lg min-w-[540px]"
          data-testid="calendar-popover"
        >
          {/* Navigation header */}
          <div className="flex items-center justify-between px-3 pt-3">
            <button
              type="button"
              onClick={handleCalendarPrevMonth}
              className="p-1 rounded hover:bg-muted"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              {calendarSelectionPhase === 'start' ? 'Select start date' : 'Select end date'}
            </span>
            <button
              type="button"
              onClick={handleCalendarNextMonth}
              className="p-1 rounded hover:bg-muted"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Two calendars side by side */}
          <div className="flex">
            {renderMonthGrid(leftYear, leftMonth)}
            <div className="w-px bg-border my-3" />
            {renderMonthGrid(rightYear, rightMonth)}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t mx-3">
            <button
              type="button"
              onClick={handleCalendarToday}
              className="text-sm text-primary hover:underline"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleCalendarClear}
              className="text-sm text-muted-foreground hover:text-foreground"
              aria-label="Clear dates"
            >
              Clear
            </button>
          </div>
        </div>
      )
    }

    // --- Calendar variant render ---

    if (variant === 'calendar') {
      const triggerText =
        startDate && endDate
          ? `${formatDate(startDate, format)} ~ ${formatDate(endDate, format)}`
          : startDate
            ? `${formatDate(startDate, format)} ~ ...`
            : 'Select date range'

      return (
        <div
          ref={(node) => {
            ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }
          }}
          className={cn('relative inline-block', className)}
          {...props}
        >
          <button
            type="button"
            onClick={handleCalendarToggle}
            disabled={disabled}
            data-testid="calendar-trigger"
            className={cn(
              'inline-flex items-center gap-2 rounded-md border border-input bg-background',
              triggerSizeStyles[size],
              'ring-offset-background',
              'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring/30 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive',
              calendarOpen && 'ring-1 ring-ring/40 ring-offset-0',
              !(startDate && endDate) && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className={iconSizeStyles[size]} />
            <span>{triggerText}</span>
          </button>

          {calendarOpen && renderDualMonthCalendar()}

          {errorMessage && (
            <p className="mt-1.5 text-xs text-destructive">{errorMessage}</p>
          )}
        </div>
      )
    }

    // --- Input variant render (original behavior) ---

    const inputVariant = (
      <div
        ref={(node) => {
          // Merge forwarded ref with internal ref
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
          }
        }}
        className={cn('relative inline-flex items-end gap-2', className)}
        {...props}
      >
        {/* Start date field */}
        <div className="flex flex-col gap-1">
          <label
            className={cn(
              'font-medium text-foreground',
              labelSizeStyles[size]
            )}
          >
            {startLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={startInputValue}
              onChange={handleStartInputChange}
              onFocus={() => setActiveField('start')}
              placeholder={format.toLowerCase()}
              disabled={disabled}
              className={cn(
                'flex w-full rounded-md border border-input bg-background',
                inputSizeStyles[size],
                'ring-offset-background placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring/30 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-destructive focus-visible:ring-destructive',
                activeField === 'start' && 'ring-1 ring-ring/40 ring-offset-0'
              )}
            />
            <button
              type="button"
              aria-label="Open calendar"
              onClick={() => !disabled && setActiveField(activeField === 'start' ? null : 'start')}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
                disabled && 'cursor-not-allowed'
              )}
            >
              <CalendarIcon className={iconSizeStyles[size]} />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div
          className={cn(
            'flex items-center text-muted-foreground shrink-0',
            size === 'sm' && 'h-8',
            size === 'md' && 'h-10',
            size === 'lg' && 'h-12'
          )}
        >
          <span className="px-1">&mdash;</span>
        </div>

        {/* End date field */}
        <div className="flex flex-col gap-1">
          <label
            className={cn(
              'font-medium text-foreground',
              labelSizeStyles[size]
            )}
          >
            {endLabel}
          </label>
          <div className="relative">
            <input
              type="text"
              value={endInputValue}
              onChange={handleEndInputChange}
              onFocus={() => setActiveField('end')}
              placeholder={format.toLowerCase()}
              disabled={disabled}
              className={cn(
                'flex w-full rounded-md border border-input bg-background',
                inputSizeStyles[size],
                'ring-offset-background placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-ring/30 focus-visible:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-destructive focus-visible:ring-destructive',
                activeField === 'end' && 'ring-1 ring-ring/40 ring-offset-0'
              )}
            />
            <button
              type="button"
              aria-label="Open calendar"
              onClick={() => !disabled && setActiveField(activeField === 'end' ? null : 'end')}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
                disabled && 'cursor-not-allowed'
              )}
            >
              <CalendarIcon className={iconSizeStyles[size]} />
            </button>
          </div>
        </div>

        {/* Clear button */}
        {hasDates && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0',
              size === 'sm' && 'h-8 w-8',
              size === 'md' && 'h-10 w-10',
              size === 'lg' && 'h-12 w-12'
            )}
            aria-label="Clear dates"
          >
            <X className={iconSizeStyles[size]} />
          </button>
        )}

        {/* Calendar dropdown */}
        {activeField && (
          <div className="absolute top-full left-0 z-50 mt-1 rounded-md border bg-card shadow-lg">
            {renderCalendar()}
          </div>
        )}
      </div>
    )

    if (!errorMessage) {
      return inputVariant
    }

    return (
      <div className="inline-block">
        {inputVariant}
        <p className="mt-1.5 text-xs text-destructive">{errorMessage}</p>
      </div>
    )
  }
)

DateRangePicker.displayName = 'DateRangePicker'
