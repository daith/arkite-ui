import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTable } from './Skeleton'

describe('Skeleton', () => {
  it('renders with default pulse animation', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('applies circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies width and height as numbers', () => {
    const { container } = render(<Skeleton width={100} height={50} />)
    expect(container.firstChild).toHaveStyle({ width: '100px', height: '50px' })
  })

  it('applies width and height as strings', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />)
    expect(container.firstChild).toHaveStyle({ width: '50%', height: '2rem' })
  })

  it('supports no animation', () => {
    const { container } = render(<Skeleton animation="none" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })
})

describe('SkeletonText', () => {
  it('renders correct number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />)
    expect(container.firstChild?.childNodes).toHaveLength(5)
  })

  it('defaults to 3 lines', () => {
    const { container } = render(<SkeletonText />)
    expect(container.firstChild?.childNodes).toHaveLength(3)
  })
})

describe('SkeletonAvatar', () => {
  it('renders as circular', () => {
    const { container } = render(<SkeletonAvatar />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })
})

describe('SkeletonCard', () => {
  it('renders with image by default', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.querySelector('.h-32')).toBeInTheDocument()
  })

  it('hides image when showImage=false', () => {
    const { container } = render(<SkeletonCard showImage={false} />)
    expect(container.querySelector('.h-32')).not.toBeInTheDocument()
  })
})

describe('SkeletonTable', () => {
  it('renders rows and columns', () => {
    const { container } = render(<SkeletonTable rows={3} columns={2} />)
    // 1 header row + 3 data rows = 4 flex rows, each with 2 children
    const rows = container.querySelectorAll('.flex.gap-4')
    expect(rows).toHaveLength(4)
  })
})
