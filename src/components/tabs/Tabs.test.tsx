import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

function renderTabs(props: React.ComponentProps<typeof Tabs> = {}) {
  return render(
    <Tabs defaultValue="tab1" {...props}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders all tab triggers', () => {
    renderTabs()

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeInTheDocument()
  })

  it('shows active tab content based on defaultValue', () => {
    renderTabs()

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument()
  })

  it('switches tab content on click', async () => {
    const user = userEvent.setup()
    renderTabs()

    expect(screen.getByText('Content 1')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('does not switch to a disabled tab', async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }))

    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument()
  })

  it('marks the disabled trigger as disabled', () => {
    renderTabs()

    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeDisabled()
  })

  it('applies custom className to the root element', () => {
    const { container } = renderTabs({ className: 'my-custom-class' })

    expect(container.firstChild).toHaveClass('my-custom-class')
  })

  it('renders with a controlled value', () => {
    render(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('calls onValueChange when a tab is clicked', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    renderTabs({ onValueChange: handleChange })

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }))

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('tab2')
  })
})
