import { useState, forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Selected date */
  value?: Date | null
  /** Callback when date is selected */
  onSelect?: (date: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Highlighted dates (e.g. events) */
  highlightedDates?: Date[]
  /** Disabled dates */
  disabledDates?: Date[]
  /** First day of week (0=Sun, 1=Mon) */
  weekStartsOn?: 0 | 1
  /** Month to display (controlled) */
  month?: Date
  /** Callback when month changes */
  onMonthChange?: (month: Date) => void
}

const WEEKDAYS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const WEEKDAYS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function ChevronLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M6.15803 3.13514C5.95657 3.32401 5.94637 3.64042 6.13523 3.84188L9.56464 7.49991L6.13523 11.1579C5.94637 11.3594 5.95657 11.6758 6.15803 11.8647C6.35949 12.0535 6.67591 12.0433 6.86477 11.8419L10.6148 7.84188C10.7951 7.64955 10.7951 7.35027 10.6148 7.15794L6.86477 3.15794C6.67591 2.95648 6.35949 2.94628 6.15803 3.13514Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

/** Month-view date picker with selectable, highlighted, and disabled dates. */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onSelect,
      minDate,
      maxDate,
      highlightedDates = [],
      disabledDates = [],
      weekStartsOn = 0,
      month: controlledMonth,
      onMonthChange,
      className,
      ...props
    },
    ref
  ) => {
    const [uncontrolledMonth, setUncontrolledMonth] = useState(
      () => value ?? new Date()
    )

    const currentMonth = controlledMonth ?? uncontrolledMonth
    const setCurrentMonth = (date: Date) => {
      setUncontrolledMonth(date)
      onMonthChange?.(date)
    }

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const today = new Date()

    const weekdays = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN
    const daysInMonth = getDaysInMonth(year, month)
    let firstDayOfWeek = new Date(year, month, 1).getDay()
    if (weekStartsOn === 1) {
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    }

    const days: (Date | null)[] = []
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d))
    }

    const isDisabled = (date: Date): boolean => {
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return disabledDates.some((d) => isSameDay(d, date))
    }

    const isHighlighted = (date: Date): boolean => {
      return highlightedDates.some((d) => isSameDay(d, date))
    }

    const goToPreviousMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1))
    }

    const goToNextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1))
    }

    const monthLabel = currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    return (
      <div
        ref={ref}
        className={cn('w-[280px] rounded-lg border bg-card p-3', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon />
          </button>
          <span className="text-sm font-medium">{monthLabel}</span>
          <button
            type="button"
            onClick={goToNextMonth}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} />
            }

            const isSelected = value ? isSameDay(date, value) : false
            const isToday = isSameDay(date, today)
            const disabled = isDisabled(date)
            const highlighted = isHighlighted(date)

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => onSelect?.(date)}
                className={cn(
                  'h-8 w-8 mx-auto flex items-center justify-center rounded-md text-sm transition-colors',
                  'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  !isSelected && isToday && 'border border-primary text-primary font-medium',
                  !isSelected && highlighted && 'bg-primary/10 text-foreground font-medium',
                  disabled && 'opacity-30 pointer-events-none'
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

Calendar.displayName = 'Calendar'
