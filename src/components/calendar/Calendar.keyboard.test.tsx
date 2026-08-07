import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Calendar } from './Calendar'

// Keyboard interaction acceptance tests against the WAI-ARIA APG
// grid pattern for date grids.
//
// June 2025: the 1st falls on a Sunday, so the grid has no leading blanks.
// 18 June 2025 is a Wednesday (its week runs 15–21).
const JUNE_18 = new Date(2025, 5, 18)

const day = (n: number) => screen.getByRole('button', { name: String(n) })

describe('Calendar keyboard interaction (APG grid)', () => {
  describe('focus', () => {
    it('date cells are focusable buttons', () => {
      render(<Calendar value={JUNE_18} />)

      day(18).focus()
      expect(day(18)).toHaveFocus()
    })

    it('date cells are reachable one by one with Tab', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      screen.getByLabelText('Next month').focus()
      await user.tab()
      expect(day(1)).toHaveFocus()
      await user.tab()
      expect(day(2)).toHaveFocus()
    })
  })

  describe('grid navigation', () => {
    it('ArrowRight moves focus to the next day', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      day(18).focus()
      await user.keyboard('{ArrowRight}')

      expect(day(19)).toHaveFocus()
    })

    it('ArrowLeft moves focus to the previous day', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      day(18).focus()
      await user.keyboard('{ArrowLeft}')

      expect(day(17)).toHaveFocus()
    })

    it('ArrowDown moves focus to the same day next week', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      day(18).focus()
      await user.keyboard('{ArrowDown}')

      expect(day(25)).toHaveFocus()
    })

    it('ArrowUp moves focus to the same day previous week', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      day(18).focus()
      await user.keyboard('{ArrowUp}')

      expect(day(11)).toHaveFocus()
    })

    it('ArrowRight on the last day of the month moves into the next month', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      day(30).focus()
      await user.keyboard('{ArrowRight}')

      expect(screen.getByText('July 2025')).toBeInTheDocument()
      expect(day(1)).toHaveFocus()
    })
  })

  describe('selection', () => {
    it('Enter on a focused date calls onSelect with that date', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(<Calendar month={new Date(2025, 5, 1)} onSelect={onSelect} />)

      day(18).focus()
      await user.keyboard('{Enter}')

      expect(onSelect).toHaveBeenCalledTimes(1)
      const selected: Date = onSelect.mock.calls[0][0]
      expect(selected.getFullYear()).toBe(2025)
      expect(selected.getMonth()).toBe(5)
      expect(selected.getDate()).toBe(18)
    })

    it('Space on a focused date calls onSelect with that date', async () => {
      const user = userEvent.setup()
      const onSelect = vi.fn()
      render(<Calendar month={new Date(2025, 5, 1)} onSelect={onSelect} />)

      day(18).focus()
      await user.keyboard(' ')

      expect(onSelect).toHaveBeenCalledTimes(1)
      const selected: Date = onSelect.mock.calls[0][0]
      expect(selected.getDate()).toBe(18)
    })
  })

  describe('month navigation buttons', () => {
    it('previous/next month buttons are reachable with Tab and triggered with Enter', async () => {
      const user = userEvent.setup()
      render(<Calendar value={JUNE_18} />)

      await user.tab()
      expect(screen.getByLabelText('Previous month')).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(screen.getByText('May 2025')).toBeInTheDocument()

      await user.tab()
      expect(screen.getByLabelText('Next month')).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(screen.getByText('June 2025')).toBeInTheDocument()
    })
  })

  describe('grid semantics', () => {
    it('exposes the days grid with grid semantics', () => {
      render(<Calendar value={JUNE_18} />)

      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
  })
})
