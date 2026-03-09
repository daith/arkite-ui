import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders page info', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />)
    expect(screen.getByText('1 / 10')).toBeInTheDocument()
  })

  it('renders item range when totalItems and pageSize provided', () => {
    render(
      <Pagination currentPage={2} totalPages={10} onPageChange={vi.fn()} totalItems={100} pageSize={10} />
    )
    expect(screen.getByText('11-20 of 100')).toBeInTheDocument()
  })

  it('disables previous on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
    expect(screen.getByLabelText('First page')).toBeDisabled()
  })

  it('disables next on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
    expect(screen.getByLabelText('Last page')).toBeDisabled()
  })

  it('calls onPageChange when next is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange when previous is clicked', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByLabelText('Previous page'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('navigates to first page', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByLabelText('First page'))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('navigates to last page', async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByLabelText('Last page'))
    expect(onPageChange).toHaveBeenCalledWith(5)
  })

  it('renders compact mode without page buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} mode="compact" />)
    expect(screen.queryByLabelText('First page')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Last page')).not.toBeInTheDocument()
  })

  it('renders page size selector', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={vi.fn()}
        pageSize={10}
        showPageSize
        onPageSizeChange={vi.fn()}
      />
    )
    expect(screen.getByLabelText('Rows per page')).toBeInTheDocument()
  })
})
