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
