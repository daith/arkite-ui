import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DescriptionList, DescriptionItem } from './DescriptionList'

describe('DescriptionList', () => {
  it('renders as a dl element', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="Name" value="John" />
      </DescriptionList>
    )
    expect(container.querySelector('dl')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <DescriptionList className="my-custom">
        <DescriptionItem label="Name" value="John" />
      </DescriptionList>
    )
    expect(container.firstElementChild?.className).toContain('my-custom')
  })

  it('renders multiple items', () => {
    render(
      <DescriptionList>
        <DescriptionItem label="Name" value="John" />
        <DescriptionItem label="Email" value="john@example.com" />
        <DescriptionItem label="Phone" value="+1 555-1234" />
      </DescriptionList>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
  })
})

describe('DescriptionItem', () => {
  it('renders label and value', () => {
    render(
      <DescriptionList>
        <DescriptionItem label="Name" value="Jane Doe" />
      </DescriptionList>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('shows dash placeholder when no value or children', () => {
    render(
      <DescriptionList>
        <DescriptionItem label="Notes" />
      </DescriptionList>
    )
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders children instead of value when both provided', () => {
    render(
      <DescriptionList>
        <DescriptionItem label="Status" value="fallback">
          <span data-testid="custom">Active</span>
        </DescriptionItem>
      </DescriptionList>
    )
    expect(screen.getByTestId('custom')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.queryByText('fallback')).not.toBeInTheDocument()
  })

  it('renders children as value', () => {
    render(
      <DescriptionList>
        <DescriptionItem label="Link">
          <a href="#">Click here</a>
        </DescriptionItem>
      </DescriptionList>
    )
    expect(screen.getByText('Click here')).toBeInTheDocument()
  })

  it('renders value as ReactNode', () => {
    render(
      <DescriptionList>
        <DescriptionItem label="Price" value={<strong>$100</strong>} />
      </DescriptionList>
    )
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('applies custom className to item', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="Test" value="val" className="item-custom" />
      </DescriptionList>
    )
    const item = container.querySelector('.item-custom')
    expect(item).toBeInTheDocument()
  })

  it('shows border-b when divider is true (default)', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="Name" value="John" />
      </DescriptionList>
    )
    const item = container.querySelector('dl > div')
    expect(item?.className).toContain('border-b')
  })

  it('does not show border-b when divider is false', () => {
    const { container } = render(
      <DescriptionList divider={false}>
        <DescriptionItem label="Name" value="John" />
      </DescriptionList>
    )
    const item = container.querySelector('dl > div')
    expect(item?.className).not.toContain('border-b')
  })

  it('renders label in a dt element', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="Company" value="Acme" />
      </DescriptionList>
    )
    const dt = container.querySelector('dt')
    expect(dt).toBeInTheDocument()
    expect(dt?.textContent).toBe('Company')
  })

  it('renders value in a dd element', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="Company" value="Acme" />
      </DescriptionList>
    )
    const dd = container.querySelector('dd')
    expect(dd).toBeInTheDocument()
    expect(dd?.textContent).toBe('Acme')
  })

  it('has py-3 padding on each row', () => {
    const { container } = render(
      <DescriptionList>
        <DescriptionItem label="Name" value="John" />
      </DescriptionList>
    )
    const item = container.querySelector('dl > div')
    expect(item?.className).toContain('py-3')
  })
})
