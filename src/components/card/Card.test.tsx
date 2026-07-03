import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardContent, CardFooter } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies padding variants', () => {
    const { container } = render(<Card padding="lg">Content</Card>)
    expect(container.firstChild).toHaveClass('p-6')
  })

  it('applies shadow variants', () => {
    const { container } = render(<Card shadow="lg">Content</Card>)
    expect(container.firstChild).toHaveClass('shadow-lg')
  })

  it('applies hoverable style', () => {
    const { container } = render(<Card hoverable>Content</Card>)
    expect(container.firstChild).toHaveClass('cursor-pointer')
  })

  it('applies border by default', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild).toHaveClass('border')
  })

  it('removes border when bordered=false', () => {
    const { container } = render(<Card bordered={false}>Content</Card>)
    expect(container.firstChild).not.toHaveClass('border')
  })
})

describe('Card density', () => {
  it('defaults to default density (unchanged padding)', () => {
    render(
      <Card>
        <CardHeader title="Title" data-testid="header" />
        <CardContent data-testid="content">Body</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    )
    expect(screen.getByTestId('header')).toHaveClass('p-4')
    expect(screen.getByTestId('content')).toHaveClass('p-4', 'pt-0')
    expect(screen.getByTestId('footer')).toHaveClass('p-4', 'pt-0')
    expect(screen.getByText('Title')).toHaveClass('text-lg')
  })

  it('compact density on Card tightens header, content, and footer', () => {
    render(
      <Card density="compact">
        <CardHeader title="Title" description="Desc" data-testid="header" />
        <CardContent data-testid="content">Body</CardContent>
        <CardFooter data-testid="footer">Footer</CardFooter>
      </Card>
    )
    expect(screen.getByTestId('header')).toHaveClass('px-4', 'py-3')
    expect(screen.getByTestId('content')).toHaveClass('px-4', 'pb-3', 'pt-0')
    expect(screen.getByTestId('footer')).toHaveClass('px-4', 'pb-3', 'pt-0')
    expect(screen.getByText('Title')).toHaveClass('text-sm')
    expect(screen.getByText('Desc')).toHaveClass('text-xs')
  })

  it('subcomponent density prop overrides the Card context', () => {
    render(
      <Card density="compact">
        <CardContent density="default" data-testid="content">Body</CardContent>
      </Card>
    )
    expect(screen.getByTestId('content')).toHaveClass('p-4', 'pt-0')
  })
})

describe('CardHeader', () => {
  it('renders title and description', () => {
    render(<CardHeader title="Title" description="Desc" />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<CardHeader title="Title" action={<button>Action</button>} />)
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders actions slot as a right-aligned row', () => {
    render(
      <CardHeader
        title="Title"
        actions={
          <>
            <button>Refresh</button>
            <button>Settings</button>
          </>
        }
      />
    )
    const refresh = screen.getByText('Refresh')
    expect(refresh).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(refresh.parentElement).toHaveClass('flex', 'items-center', 'gap-1')
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Body</CardContent>)
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
