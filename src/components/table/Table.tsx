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
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', compact, bordered, hoverable, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
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
        {...props}
      />
    </div>
  )
)

Table.displayName = 'Table'

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  )
)

TableHeader.displayName = 'TableHeader'

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

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

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {}

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
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-medium text-muted-foreground',
        '[&:has([role=checkbox])]:pr-0',
        sortable && 'cursor-pointer select-none hover:text-foreground',
        className
      )}
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

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  )
)

TableCell.displayName = 'TableCell'

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

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
