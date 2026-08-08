import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
  TableEmpty, TableLoading,
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

  // Regression (0.14.0 shipped hover as opt-in and every consumer's bare
  // Table silently lost row hover): hoverable defaults to TRUE, and a false
  // value must not render the attribute (CSS matches on presence)
  it('hoverable defaults to true; false removes the attribute entirely', () => {
    const { rerender } = render(<Table><tbody><tr><td>Cell</td></tr></tbody></Table>)
    expect(screen.getByRole('table')).toHaveAttribute('data-hoverable', 'true')
    rerender(<Table hoverable={false}><tbody><tr><td>Cell</td></tr></tbody></Table>)
    expect(screen.getByRole('table')).not.toHaveAttribute('data-hoverable')
  })

  it('compact={false} does not render the data attribute', () => {
    render(<Table compact={false}><tbody><tr><td>Cell</td></tr></tbody></Table>)
    expect(screen.getByRole('table')).not.toHaveAttribute('data-compact')
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

describe('align / numeric', () => {
  it('align maps to text classes and is not passed as the deprecated HTML attribute', () => {
    render(
      <table><tbody><tr>
        <TableCell align="right">1,234</TableCell>
        <TableCell align="center">mid</TableCell>
      </tr></tbody></table>
    )
    const [right, center] = screen.getAllByRole('cell')
    expect(right).toHaveClass('text-right')
    expect(right).not.toHaveAttribute('align')
    expect(center).toHaveClass('text-center')
  })

  it('TableHead align works too', () => {
    render(
      <table><thead><tr><TableHead align="right">Market Cap</TableHead></tr></thead></table>
    )
    expect(screen.getByRole('columnheader')).toHaveClass('text-right')
  })

  it('numeric right-aligns with tabular figures', () => {
    render(
      <table><tbody><tr><TableCell numeric>3.4T</TableCell></tr></tbody></table>
    )
    expect(screen.getByRole('cell')).toHaveClass('text-right', 'tabular-nums')
  })
})

describe('TableEmpty / TableLoading', () => {
  it('TableEmpty measures colSpan from the header row', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            {['a', 'b', 'c', 'd', 'e'].map((k) => <TableHead key={k}>{k}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody><TableEmpty /></TableBody>
      </Table>
    )
    const cell = screen.getByRole('cell')
    expect(cell).toHaveAttribute('colspan', '5')
    expect(cell).toHaveTextContent('No results found.')
  })

  it('explicit colSpan wins and custom content renders', () => {
    render(
      <Table><TableBody><TableEmpty colSpan={3}>Nothing here</TableEmpty></TableBody></Table>
    )
    const cell = screen.getByRole('cell')
    expect(cell).toHaveAttribute('colspan', '3')
    expect(cell).toHaveTextContent('Nothing here')
  })

  it('TableLoading renders spinner row with measured colSpan', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>a</TableHead><TableHead>b</TableHead></TableRow></TableHeader>
        <TableBody><TableLoading /></TableBody>
      </Table>
    )
    const cell = screen.getByRole('cell')
    expect(cell).toHaveAttribute('colspan', '2')
    expect(cell).toHaveTextContent('Loading')
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
