import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
} from './DropdownMenu'

describe('DropdownMenu', () => {
  it('exports all compound component parts', () => {
    expect(DropdownMenu).toBeDefined()
    expect(DropdownMenuTrigger).toBeDefined()
    expect(DropdownMenuContent).toBeDefined()
    expect(DropdownMenuItem).toBeDefined()
    expect(DropdownMenuCheckboxItem).toBeDefined()
    expect(DropdownMenuRadioItem).toBeDefined()
    expect(DropdownMenuRadioGroup).toBeDefined()
    expect(DropdownMenuLabel).toBeDefined()
    expect(DropdownMenuSeparator).toBeDefined()
    expect(DropdownMenuShortcut).toBeDefined()
    expect(DropdownMenuSub).toBeDefined()
    expect(DropdownMenuSubTrigger).toBeDefined()
    expect(DropdownMenuSubContent).toBeDefined()
    expect(DropdownMenuGroup).toBeDefined()
    expect(DropdownMenuPortal).toBeDefined()
  })

  it('renders trigger content', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(screen.getByText('Open menu')).toBeInTheDocument()
  })

  it('opens menu and shows items when trigger is clicked', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText('Open menu'))

    expect(await screen.findByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('applies destructive styling to DropdownMenuItem', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem destructive>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText('Open menu'))

    const item = await screen.findByText('Delete')
    expect(item.closest('[role="menuitem"]')!.className).toContain('text-destructive')
  })

  it('renders DropdownMenuShortcut with text content', () => {
    render(<DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>)
    const shortcut = screen.getByText('Ctrl+S')
    expect(shortcut).toBeInTheDocument()
    expect(shortcut.tagName).toBe('SPAN')
    expect(shortcut.className).toContain('ml-auto')
    expect(shortcut.className).toContain('text-muted-foreground')
  })

  it('renders DropdownMenuShortcut with custom className', () => {
    render(<DropdownMenuShortcut className="custom-class">Ctrl+K</DropdownMenuShortcut>)
    const shortcut = screen.getByText('Ctrl+K')
    expect(shortcut.className).toContain('custom-class')
  })

  it('calls onSelect handler when item is clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText('Open menu'))
    await user.click(await screen.findByText('Action'))

    expect(onSelect).toHaveBeenCalled()
  })

  it('renders DropdownMenuLabel', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText('Open menu'))
    expect(await screen.findByText('My Account')).toBeInTheDocument()
  })

  it('renders DropdownMenuSeparator', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByText('Open menu'))
    await screen.findByText('Item 1')
    expect(screen.getByTestId('separator')).toBeInTheDocument()
  })
})
