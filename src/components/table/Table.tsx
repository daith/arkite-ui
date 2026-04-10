import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Table variant */
  variant?: 'default' | 'striped'
  /** Compact table */
  compact?: boolean
  /** Bordered table */
  bordered?: boolean
  /** Hoverable rows */
  hoverable?: boolean
  /** Sticky header — stays fixed while scrolling vertically */
  stickyHeader?: boolean
  /**
   * Make the scroll wrapper fill its parent's height (`h-full`).
   * Use this when the table is inside a fixed-height flex container so the
   * horizontal scrollbar pins to the bottom of the viewport even when there
   * are few rows. The parent must provide a determinate height (e.g.
   * `flex-1 min-h-0` inside a `flex flex-col` chain).
   */
  fillHeight?: boolean
}

/** Styled HTML table with support for striping, borders, and sticky headers. */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', compact, bordered, hoverable, stickyHeader, fillHeight, ...props }, ref) => (
    <div className={cn('relative w-full overflow-auto', fillHeight && 'h-full')}>
      <table
        ref={ref}
        className={cn(
          'w-full caption-bottom text-sm',
          bordered && 'border',
          className
        )}
        data-variant={variant}
        data-compact={compact}
        data-hoverable={hoverable}
        data-sticky-header={stickyHeader || undefined}
        {...props}
      />
    </div>
  )
)

Table.displayName = 'Table'

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

/** Table header section with optional sticky positioning. */
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        '[&_tr]:border-b',
        /* Sticky header: activated by parent table[data-sticky-header] */
        '[table[data-sticky-header]_&]:sticky [table[data-sticky-header]_&]:top-0 [table[data-sticky-header]_&]:z-10 [table[data-sticky-header]_&]:bg-background [table[data-sticky-header]_&]:shadow-[0_1px_0_0_hsl(var(--border))]',
        className
      )}
      {...props}
    />
  )
)

TableHeader.displayName = 'TableHeader'

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

/** Table body section containing data rows. */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
)

TableBody.displayName = 'TableBody'

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>

/** Table footer section for summary or aggregate content. */
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  )
)

TableFooter.displayName = 'TableFooter'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Selected state */
  selected?: boolean
}

/** Table row with hover and selected state styling. */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors',
        'hover:bg-muted/50',
        'data-[state=selected]:bg-muted',
        selected && 'bg-muted',
        className
      )}
      data-state={selected ? 'selected' : undefined}
      {...props}
    />
  )
)

TableRow.displayName = 'TableRow'

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Sortable column */
  sortable?: boolean
  /** Sort direction */
  sortDirection?: 'asc' | 'desc' | null
  /** Sticky action column — pins to the right edge during horizontal scroll */
  stickyAction?: boolean
}

/** Table header cell with optional sort indicators and sticky positioning. */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, stickyAction, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-medium text-muted-foreground',
        '[&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer select-none hover:text-foreground',
        stickyAction && 'sticky right-0 bg-background shadow-[-2px_0_4px_-2px_rgb(0_0_0/0.1)]',
        className
      )}
      data-sticky-action={stickyAction || undefined}
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-1">
          {children}
          <span className="text-xs">
            {sortDirection === 'asc' && '\u2191'}
            {sortDirection === 'desc' && '\u2193'}
            {!sortDirection && '\u2195'}
          </span>
        </div>
      ) : (
        children
      )}
    </th>
  )
)

TableHead.displayName = 'TableHead'

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Sticky action column — pins to the right edge during horizontal scroll */
  stickyAction?: boolean
}

/** Table data cell with optional sticky action column support. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, stickyAction, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        stickyAction && 'sticky right-0 bg-background shadow-[-2px_0_4px_-2px_rgb(0_0_0/0.1)]',
        className
      )}
      data-sticky-action={stickyAction || undefined}
      {...props}
    />
  )
)

TableCell.displayName = 'TableCell'

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>

/** Table caption displayed below the table. */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
)

TableCaption.displayName = 'TableCaption'
