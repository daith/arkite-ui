import { useEffect, useState, type KeyboardEvent, type RefObject } from 'react'

function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

function addMonthsClamped(date: Date, amount: number): Date {
  const year = date.getFullYear()
  const month = date.getMonth() + amount
  const lastDayOfTarget = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(date.getDate(), lastDayOfTarget))
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Stable per-day key used to locate a day button in the grid DOM. */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export interface UseGridKeyboardOptions {
  /** Element containing the day buttons (matched via their `data-day` attribute). */
  containerRef: RefObject<HTMLElement | null>
  /** Month currently rendered in the grid. */
  currentMonth: Date
  /** Called when focus needs to land on a day outside the rendered month. */
  onNavigateToMonth: (month: Date) => void
  /** First day of week (0=Sun, 1=Mon). */
  weekStartsOn?: 0 | 1
}

/**
 * Shared APG-style keyboard navigation for month grids (Calendar and
 * DatePicker): arrows move by day/week, Home/End jump to the edges of the
 * week, PageUp/PageDown move by month (clamped to the target month's last
 * day). When the target day is outside the rendered month the hook first
 * switches the month, then an effect focuses the target button once it
 * exists in the DOM.
 */
export function useGridKeyboard({
  containerRef,
  currentMonth,
  onNavigateToMonth,
  weekStartsOn = 0,
}: UseGridKeyboardOptions) {
  const [focusTarget, setFocusTarget] = useState<Date | null>(null)

  useEffect(() => {
    if (!focusTarget) return
    containerRef.current
      ?.querySelector<HTMLElement>(`[data-day="${toDayKey(focusTarget)}"]`)
      ?.focus()
  }, [focusTarget, containerRef])

  const focusDay = (target: Date) => {
    if (!isSameMonth(target, currentMonth)) {
      onNavigateToMonth(new Date(target.getFullYear(), target.getMonth(), 1))
    }
    // Clone so repeated requests for the same Date instance still re-trigger
    // the focus effect.
    setFocusTarget(new Date(target))
  }

  const handleDayKeyDown = (event: KeyboardEvent<HTMLElement>, date: Date) => {
    let target: Date
    switch (event.key) {
      case 'ArrowLeft':
        target = addDays(date, -1)
        break
      case 'ArrowRight':
        target = addDays(date, 1)
        break
      case 'ArrowUp':
        target = addDays(date, -7)
        break
      case 'ArrowDown':
        target = addDays(date, 7)
        break
      case 'Home':
        target = addDays(date, -((date.getDay() - weekStartsOn + 7) % 7))
        break
      case 'End':
        target = addDays(date, 6 - ((date.getDay() - weekStartsOn + 7) % 7))
        break
      case 'PageUp':
        target = addMonthsClamped(date, -1)
        break
      case 'PageDown':
        target = addMonthsClamped(date, 1)
        break
      default:
        return
    }
    event.preventDefault()
    focusDay(target)
  }

  return { focusDay, handleDayKeyDown }
}
