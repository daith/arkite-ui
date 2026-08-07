import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DatePicker } from './DatePicker'

// Keyboard interaction acceptance tests against the WAI-ARIA APG
// "Date Picker Dialog" pattern. Specs the component meets use it(...);
// gaps are pinned with it.fails(...) plus a FINDING comment so the suite
// stays green while documenting the bug list.
//
// June 2025: the 1st falls on a Sunday, so the grid has no leading blanks.
// 18 June 2025 is a Wednesday (its week runs 15–21).
const JUNE_18 = new Date(2025, 5, 18)

const day = (n: number) => screen.getByRole('button', { name: String(n) })

const openCalendar = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByLabelText('Open calendar'))
}

describe('DatePicker keyboard interaction (APG date picker dialog)', () => {
  describe('opening the popup', () => {
    it('opens the calendar with Enter on the trigger button', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)

      screen.getByLabelText('Open calendar').focus()
      await user.keyboard('{Enter}')

      expect(screen.getByText('June 2025')).toBeInTheDocument()
    })

    it('opens the calendar with Space on the trigger button', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)

      screen.getByLabelText('Open calendar').focus()
      await user.keyboard(' ')

      expect(screen.getByText('June 2025')).toBeInTheDocument()
    })

    it('opens the calendar when the input receives keyboard focus', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)

      await user.tab()

      expect(screen.getByPlaceholderText('Select date')).toHaveFocus()
      expect(screen.getByText('June 2025')).toBeInTheDocument()
    })

    // FINDING: opening the popup leaves focus on the trigger — APG expects initial focus to move to the selected day (or today)
    it.fails('moves focus to the selected day when the calendar opens', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)

      screen.getByLabelText('Open calendar').focus()
      await user.keyboard('{Enter}')

      expect(day(18)).toHaveFocus()
    })
  })

  describe('grid navigation', () => {
    // FINDING: ArrowRight on a focused day does nothing — no keydown handling on the days grid
    it.fails('ArrowRight moves focus to the next day', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{ArrowRight}')

      expect(day(19)).toHaveFocus()
    })

    // FINDING: ArrowLeft on a focused day does nothing — no keydown handling on the days grid
    it.fails('ArrowLeft moves focus to the previous day', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{ArrowLeft}')

      expect(day(17)).toHaveFocus()
    })

    // FINDING: ArrowDown on a focused day does nothing — should move focus one week later
    it.fails('ArrowDown moves focus to the same day next week', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{ArrowDown}')

      expect(day(25)).toHaveFocus()
    })

    // FINDING: ArrowUp on a focused day does nothing — should move focus one week earlier
    it.fails('ArrowUp moves focus to the same day previous week', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{ArrowUp}')

      expect(day(11)).toHaveFocus()
    })

    // FINDING: Home does nothing — should move focus to the first day of the week
    it.fails('Home moves focus to the first day of the week', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{Home}')

      expect(day(15)).toHaveFocus()
    })

    // FINDING: End does nothing — should move focus to the last day of the week
    it.fails('End moves focus to the last day of the week', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{End}')

      expect(day(21)).toHaveFocus()
    })

    // FINDING: PageUp does nothing — should show the previous month
    it.fails('PageUp changes the grid to the previous month', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{PageUp}')

      expect(screen.getByText('May 2025')).toBeInTheDocument()
    })

    // FINDING: PageDown does nothing — should show the next month
    it.fails('PageDown changes the grid to the next month', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      day(18).focus()
      await user.keyboard('{PageDown}')

      expect(screen.getByText('July 2025')).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('Enter on a focused day selects it, calls onChange and closes the popup', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<DatePicker value={JUNE_18} onChange={onChange} />)
      await openCalendar(user)

      day(20).focus()
      await user.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledTimes(1)
      const selected: Date = onChange.mock.calls[0][0]
      expect(selected.getFullYear()).toBe(2025)
      expect(selected.getMonth()).toBe(5)
      expect(selected.getDate()).toBe(20)
      expect(screen.queryByText('June 2025')).not.toBeInTheDocument()
    })

    it('Space on a focused day selects it, calls onChange and closes the popup', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<DatePicker value={JUNE_18} onChange={onChange} />)
      await openCalendar(user)

      day(20).focus()
      await user.keyboard(' ')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(screen.queryByText('June 2025')).not.toBeInTheDocument()
    })
  })

  describe('dismissal', () => {
    // FINDING: Escape does not close the popup (no Escape handler); focus also never returns to the input
    it.fails('Escape closes the calendar without selecting and returns focus to the input', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<DatePicker value={JUNE_18} onChange={onChange} />)
      await openCalendar(user)

      day(20).focus()
      await user.keyboard('{Escape}')

      expect(screen.queryByText('June 2025')).not.toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
      expect(screen.getByPlaceholderText('Select date')).toHaveFocus()
    })
  })

  describe('month navigation buttons', () => {
    it('previous/next month buttons are reachable with Tab and triggered with Enter', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)

      await user.tab() // input — opens the popup on focus
      await user.tab() // calendar trigger button
      await user.tab() // previous month button inside the popup

      expect(screen.getByLabelText('Previous month')).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(screen.getByText('May 2025')).toBeInTheDocument()

      await user.tab() // next month button
      expect(screen.getByLabelText('Next month')).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(screen.getByText('June 2025')).toBeInTheDocument()
    })
  })

  describe('fallback tab access', () => {
    it('day buttons are reachable one by one with Tab', async () => {
      const user = userEvent.setup()
      render(<DatePicker value={JUNE_18} />)
      await openCalendar(user)

      screen.getByLabelText('Next month').focus()
      await user.tab()
      expect(day(1)).toHaveFocus()
      await user.tab()
      expect(day(2)).toHaveFocus()
    })
  })
})
