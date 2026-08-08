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

  // Regression (ark-finance feedback 3.1): the density/hover/stripe props must
  // be wired to CSS, not just emitted as inert data-attributes
  it('compact tightens cell padding via table[data-compact] selectors', () => {
    render(
      <Table compact>
        <TableHeader><TableRow><TableHead>H</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>C</TableCell></TableRow></TableBody>
      </Table>
    )
    expect(screen.getByRole('table')).toHaveAttribute('data-compact', 'true')
    expect(screen.getByRole('cell').className).toContain('[table[data-compact]_&]:py-2')
    expect(screen.getByRole('columnheader').className).toContain('[table[data-compact]_&]:h-8')
  })

  it('hoverable and striped are consumed by TableRow selectors', () => {
    render(
      <Table hoverable variant="striped">
        <TableBody><TableRow><TableCell>C</TableCell></TableRow></TableBody>
      </Table>
    )
    const row = screen.getByRole('row')
    expect(row.className).toContain('[table[data-hoverable]_&:hover]:bg-muted/50')
    expect(row.className).toContain("[table[data-variant=striped]_tbody_&:nth-child(even)]:bg-muted/30")
  })

  // Regression (ark-finance feedback 3.2): the table is border-separate, so
  // separators must live on cells — tr borders don't paint in that model
  it('row separators are drawn by cells, with the last body row exempt', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>H</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>C</TableCell></TableRow></TableBody>
      </Table>
    )
    expect(screen.getByRole('cell')).toHaveClass('border-b')
    expect(screen.getByRole('columnheader').closest('thead')?.className).toContain('[&_th]:border-b')
    expect(screen.getByRole('cell').closest('tbody')?.className).toContain(
      '[&_tr:last-child_td]:border-b-0'
    )
    expect(screen.getByRole('row', { name: 'C' }).className).not.toContain('border-b')
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

  it('applies stickyLead class', () => {
    render(
      <table><thead><tr><TableHead stickyLead>Ticker</TableHead></tr></thead></table>
    )
    expect(screen.getByRole('columnheader')).toHaveClass('sticky', 'left-0')
  })
})

describe('TableCell', () => {
  it('applies stickyAction class', () => {
    render(
      <table><tbody><tr><TableCell stickyAction>Edit</TableCell></tr></tbody></table>
    )
    expect(screen.getByRole('cell')).toHaveClass('sticky', 'right-0')
  })

  it('applies stickyLead class', () => {
    render(
      <table><tbody><tr><TableCell stickyLead>AAPL</TableCell></tr></tbody></table>
    )
    expect(screen.getByRole('cell')).toHaveClass('sticky', 'left-0')
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
