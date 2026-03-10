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
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandShortcut,
  CommandDialog,
} from './CommandPalette'

describe('CommandPalette exports', () => {
  it('exports all expected components', () => {
    expect(Command).toBeDefined()
    expect(CommandInput).toBeDefined()
    expect(CommandList).toBeDefined()
    expect(CommandEmpty).toBeDefined()
    expect(CommandGroup).toBeDefined()
    expect(CommandSeparator).toBeDefined()
    expect(CommandItem).toBeDefined()
    expect(CommandShortcut).toBeDefined()
    expect(CommandDialog).toBeDefined()
  })
})

describe('Command', () => {
  it('renders with children', () => {
    render(
      <Command>
        <div>child content</div>
      </Command>
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Command className="my-custom">
        <div>test</div>
      </Command>
    )
    expect(container.firstElementChild!.className).toContain('my-custom')
  })
})

describe('CommandInput', () => {
  it('renders an input element', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
      </Command>
    )
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search...').tagName).toBe('INPUT')
  })
})

describe('CommandEmpty', () => {
  it('shows text when no results match', () => {
    render(
      <Command>
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
        </CommandList>
      </Command>
    )
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })
})

describe('CommandGroup', () => {
  it('renders with heading', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
})

describe('CommandItem', () => {
  it('renders and responds to click', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Command>
        <CommandList>
          <CommandItem onSelect={onSelect}>Click me</CommandItem>
        </CommandList>
      </Command>
    )
    const item = screen.getByText('Click me')
    expect(item).toBeInTheDocument()
    await user.click(item)
    expect(onSelect).toHaveBeenCalled()
  })
})

describe('CommandShortcut', () => {
  it('splits shortcut string on "+" and renders kbd elements', () => {
    const { container } = render(<CommandShortcut>Ctrl+Shift+K</CommandShortcut>)
    const kbds = container.querySelectorAll('kbd')
    expect(kbds).toHaveLength(3)
    expect(kbds[0].textContent).toBe('Ctrl')
    expect(kbds[1].textContent).toBe('Shift')
    expect(kbds[2].textContent).toBe('K')
  })

  it('renders non-string children as-is', () => {
    render(
      <CommandShortcut>
        <span data-testid="custom">custom</span>
      </CommandShortcut>
    )
    expect(screen.getByTestId('custom')).toBeInTheDocument()
  })
})

describe('CommandDialog', () => {
  it('renders children when open=true', () => {
    render(
      <CommandDialog open={true} onOpenChange={() => {}}>
        <CommandInput placeholder="Type a command..." />
      </CommandDialog>
    )
    expect(screen.getByPlaceholderText('Type a command...')).toBeInTheDocument()
  })

  it('does not render when open=false', () => {
    render(
      <CommandDialog open={false} onOpenChange={() => {}}>
        <CommandInput placeholder="Type a command..." />
      </CommandDialog>
    )
    expect(screen.queryByPlaceholderText('Type a command...')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <CommandDialog open={true} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search..." />
      </CommandDialog>
    )
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onOpenChange(false) when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { container } = render(
      <CommandDialog open={true} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search..." />
      </CommandDialog>
    )
    // The backdrop is the first child div with bg-black/50
    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50')
    expect(backdrop).not.toBeNull()
    await user.click(backdrop!)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
