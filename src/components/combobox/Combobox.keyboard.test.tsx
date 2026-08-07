import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Combobox, type ComboboxOption } from './Combobox'

const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', description: 'A red fruit' },
]

describe('Combobox keyboard interaction (WAI-ARIA APG combobox pattern)', () => {
  describe('opening the popup', () => {
    it('opens on Enter when trigger is focused', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      expect(screen.getByRole('combobox')).toHaveFocus()
      await user.keyboard('{Enter}')

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('opens on Space when trigger is focused', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      await user.keyboard(' ')

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('opens on ArrowDown when trigger is focused', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      await user.keyboard('{ArrowDown}')

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    })

    it('moves focus into the search input when opened', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      await user.keyboard('{Enter}')

      expect(screen.getByPlaceholderText('Search...')).toHaveFocus()
    })
  })

  describe('navigating and selecting options', () => {
    it('ArrowDown/ArrowUp move the highlight between options', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      await user.keyboard('{Enter}')
      const searchInput = screen.getByPlaceholderText('Search...')

      await user.keyboard('{ArrowDown}')
      expect(searchInput.getAttribute('aria-activedescendant')).toBeTruthy()
    })

    it('Enter selects the highlighted option, calls onChange and closes', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Combobox options={options} onChange={onChange} />)

      await user.tab()
      await user.keyboard('{Enter}')
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      expect(onChange).toHaveBeenCalledWith('apple')
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
    })

    it('shows the selected label on the trigger', () => {
      render(<Combobox options={options} value="apple" />)
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.queryByText('Select...')).not.toBeInTheDocument()
    })
  })

  describe('dismissing the popup', () => {
    it('Escape closes without changing value and returns focus to the trigger', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      render(<Combobox options={options} onChange={onChange} />)

      const trigger = screen.getByRole('combobox')
      await user.tab()
      await user.keyboard('{Enter}')
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
      expect(onChange).not.toHaveBeenCalled()
      expect(trigger).toHaveFocus()
    })

    it('Tab closes the popup and moves focus out', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      await user.keyboard('{Enter}')
      expect(screen.getByPlaceholderText('Search...')).toHaveFocus()

      await user.tab()

      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
    })
  })

  describe('ARIA roles and states', () => {
    it('trigger reflects open state via aria-expanded', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await user.click(trigger)

      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    it('trigger has role combobox', () => {
      render(<Combobox options={options} />)
      expect(screen.getByRole('combobox')).toHaveAttribute('role', 'combobox')
    })

    it('popup exposes listbox and option roles', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.click(screen.getByRole('combobox'))

      const listbox = screen.getByRole('listbox')
      expect(within(listbox).getAllByRole('option')).toHaveLength(options.length)
    })
  })

  describe('typeahead filtering', () => {
    it('typing in the search input filters the options', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} />)

      await user.tab()
      await user.keyboard('{Enter}')
      await user.keyboard('ban')

      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText('Banana')).toBeInTheDocument()
      expect(within(dialog).queryByText('Apple')).not.toBeInTheDocument()
      expect(within(dialog).queryByText('Cherry')).not.toBeInTheDocument()
    })

    it('shows emptyMessage when no option matches', async () => {
      const user = userEvent.setup()
      render(<Combobox options={options} emptyMessage="Nothing here!" />)

      await user.tab()
      await user.keyboard('{Enter}')
      await user.keyboard('zzz')

      expect(screen.getByText('Nothing here!')).toBeInTheDocument()
    })
  })
})
