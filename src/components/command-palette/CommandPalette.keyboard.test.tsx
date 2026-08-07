import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, it, expect, vi } from 'vitest'

// cmdk internally uses ResizeObserver and scrollIntoView which are not available in jsdom
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView = vi.fn()
})
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from './CommandPalette'

// Keyboard interaction spec tests based on the WAI-ARIA APG combobox/listbox
// pattern as implemented by cmdk (focus stays on the input, the highlighted
// option is conveyed via aria-selected / aria-activedescendant):
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
//
// Passing tests document behavior that already conforms to the pattern.
// `it.fails` tests (with a FINDING comment) pin down current gaps — once the
// gap is fixed, remove `.fails` and the test becomes a regression guard.

function renderPalette() {
  const onClose = vi.fn()
  const onSelectFirst = vi.fn()
  const onSelectSecond = vi.fn()
  const onSelectThird = vi.fn()
  render(
    <CommandDialog open onClose={onClose}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <CommandItem onSelect={onSelectFirst}>Open file</CommandItem>
        <CommandItem onSelect={onSelectSecond}>Run build</CommandItem>
        <CommandItem onSelect={onSelectThird}>Toggle theme</CommandItem>
      </CommandList>
    </CommandDialog>
  )
  return { onClose, onSelectFirst, onSelectSecond, onSelectThird }
}

describe('CommandPalette keyboard interaction (APG combobox/listbox)', () => {
  // FINDING: CommandDialog 開啟後不會自動把焦點移到搜尋輸入框——CommandInput
  // 沒有 autoFocus,CommandDialog 也沒有任何 focus 管理,焦點停留在 <body>
  it.fails('focuses the search input when the dialog opens', () => {
    renderPalette()
    expect(screen.getByPlaceholderText('Search...')).toHaveFocus()
  })

  it('ArrowDown/ArrowUp move the highlighted option while focus stays on the input', async () => {
    const user = userEvent.setup()
    renderPalette()
    const input = screen.getByPlaceholderText('Search...')
    await user.click(input)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)
    // cmdk highlights the first option by default
    expect(options[0]).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowDown}')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    // Focus never leaves the input — highlight is conveyed via
    // aria-activedescendant pointing at the highlighted option
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', options[1].id)

    await user.keyboard('{ArrowUp}')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
    expect(input).toHaveFocus()
  })

  it('Enter runs onSelect of the currently highlighted option', async () => {
    const user = userEvent.setup()
    const { onSelectFirst, onSelectSecond, onSelectThird } = renderPalette()
    await user.click(screen.getByPlaceholderText('Search...'))

    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    expect(onSelectSecond).toHaveBeenCalledOnce()
    expect(onSelectFirst).not.toHaveBeenCalled()
    expect(onSelectThird).not.toHaveBeenCalled()
  })

  it('Escape calls onClose', async () => {
    const user = userEvent.setup()
    const { onClose } = renderPalette()
    await user.click(screen.getByPlaceholderText('Search...'))

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('typing filters the options down to matches', async () => {
    const user = userEvent.setup()
    renderPalette()
    const input = screen.getByPlaceholderText('Search...')

    await user.type(input, 'build')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Run build')
    expect(screen.queryByText('Open file')).not.toBeInTheDocument()
    expect(screen.queryByText('Toggle theme')).not.toBeInTheDocument()
  })

  it('shows the empty state when no options match', async () => {
    const user = userEvent.setup()
    renderPalette()
    const input = screen.getByPlaceholderText('Search...')

    await user.type(input, 'zzzz')
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('End jumps to the last option and Home back to the first', async () => {
    const user = userEvent.setup()
    renderPalette()
    const input = screen.getByPlaceholderText('Search...')
    await user.click(input)

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{End}')
    expect(options[2]).toHaveAttribute('aria-selected', 'true')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')

    await user.keyboard('{Home}')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[2]).toHaveAttribute('aria-selected', 'false')
  })
})
