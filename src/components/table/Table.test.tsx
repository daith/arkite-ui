import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from './Table'

describe('Table', () => {
  it('renders a table element', () => {
    render(<Table><tbody><tr><td>Cell</td></tr></tbody></Table>)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('sets data-sticky-header attribute', () => {
    render(<Table stickyHeader><tbody><tr><td>Cell</td></tr></tbody></Table>)
    expect(screen.getByRole('table')).toHaveAttribute('data-sticky-header', 'true')
  })

  it('applies bordered class', () => {
    render(<Table bordered><tbody><tr><td>Cell</td></tr></tbody></Table>)
    expect(screen.getByRole('table')).toHaveClass('border')
  })
})

describe('TableRow', () => {
  it('applies selected state', () => {
    render(
      <table><tbody><TableRow selected><td>Cell</td></TableRow></tbody></table>
    )
    expect(screen.getByRole('row')).toHaveAttribute('data-state', 'selected')
  })
})

describe('TableHead', () => {
  it('renders sortable indicator', () => {
    render(
      <table><thead><tr><TableHead sortable sortDirection="asc">Name</TableHead></tr></thead></table>
    )
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('renders desc indicator', () => {
    render(
      <table><thead><tr><TableHead sortable sortDirection="desc">Name</TableHead></tr></thead></table>
    )
    expect(screen.getByText('↓')).toBeInTheDocument()
  })

  it('renders unsorted indicator', () => {
    render(
      <table><thead><tr><TableHead sortable>Name</TableHead></tr></thead></table>
    )
    expect(screen.getByText('↕')).toBeInTheDocument()
  })

  it('applies stickyAction class', () => {
    render(
      <table><thead><tr><TableHead stickyAction>Actions</TableHead></tr></thead></table>
    )
    expect(screen.getByRole('columnheader')).toHaveClass('sticky', 'right-0')
  })
})

describe('TableCell', () => {
  it('applies stickyAction class', () => {
    render(
      <table><tbody><tr><TableCell stickyAction>Edit</TableCell></tr></tbody></table>
    )
    expect(screen.getByRole('cell')).toHaveClass('sticky', 'right-0')
  })
})

describe('TableCaption', () => {
  it('renders caption text', () => {
    render(
      <table><TableCaption>A list of users</TableCaption><tbody><tr><td>Cell</td></tr></tbody></table>
    )
    expect(screen.getByText('A list of users')).toBeInTheDocument()
  })
})

describe('TableHeader', () => {
  it('renders thead', () => {
    render(
      <table><TableHeader><tr><th>Name</th></tr></TableHeader><tbody><tr><td>Cell</td></tr></tbody></table>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
  })
})

describe('TableBody', () => {
  it('renders tbody', () => {
    render(
      <table><TableBody><tr><td>Data</td></tr></TableBody></table>
    )
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})

describe('TableFooter', () => {
  it('renders tfoot', () => {
    render(
      <table><TableFooter><tr><td>Total</td></tr></TableFooter></table>
    )
    expect(screen.getByText('Total')).toBeInTheDocument()
  })
})
