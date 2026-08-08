import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'
import { cn } from '../../utils/cn'
import { useLocale } from '../../locale'

type TableAlign = 'left' | 'center' | 'right'

const alignStyles: Record<TableAlign, string | false> = {
  left: false,
  center: 'text-center',
  right: 'text-right',
}

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Table variant */
  variant?: 'default' | 'striped'
  /** Compact table */
  compact?: boolean
  /** Bordered table */
  bordered?: boolean
  /** Row hover feedback @default true — pass `false` for static/print-like tables */
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

/**
 * Styled HTML table with support for striping, density, borders, and sticky
 * headers. The style props are exposed as `data-*` attributes consumed by CSS
 * on the child components — attribute PRESENCE activates the selectors, so
 * falsy values must render as `undefined` (never `"false"`).
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = 'default', compact, bordered, hoverable = true, stickyHeader, fillHeight, ...props }, ref) => (
    <div className={cn('relative w-full overflow-auto', fillHeight && 'h-full')}>
      <table
        ref={ref}
        className={cn(
          // border-separate + border-spacing-0 是 cross-browser sticky thead 必須
          // 預設 border-collapse:collapse 在 Chrome 會讓 sticky 失效
          'w-full caption-bottom text-sm border-separate border-spacing-0',
          bordered && 'border',
          className
        )}
        data-variant={variant}
        data-compact={compact || undefined}
        data-hoverable={hoverable || undefined}
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
        // Separator lives on the cells: the table is border-separate (needed
        // for cross-browser sticky headers) and row/row-group borders don't
        // paint in that model
        '[&_th]:border-b',
        /* Sticky header: activated by parent table[data-sticky-header] */
        '[table[data-sticky-header]_&]:sticky [table[data-sticky-header]_&]:top-0 [table[data-sticky-header]_&]:z-10 [table[data-sticky-header]_&]:bg-background [table[data-sticky-header]_&]:shadow-sticky-header',
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
      className={cn('[&_tr:last-child_td]:border-b-0', className)}
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
      className={cn('bg-muted/50 font-medium [&_td]:border-t', className)}
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
        'transition-colors',
        // Hover feedback is opt-in via table[data-hoverable] (Table `hoverable`)
        '[table[data-hoverable]_&:hover]:bg-muted/50',
        // Zebra striping via table[data-variant=striped], body rows only
        '[table[data-variant=striped]_tbody_&:nth-child(even)]:bg-muted/30',
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

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Sortable column */
  sortable?: boolean
  /** Sort direction */
  sortDirection?: 'asc' | 'desc' | null
  /** Text alignment @default "left" */
  align?: TableAlign
  /** Sticky action column — pins to the right edge during horizontal scroll */
  stickyAction?: boolean
  /** Sticky lead column — pins to the left edge during horizontal scroll (e.g. a ticker/name column in a wide table) */
  stickyLead?: boolean
}

/** Table header cell with optional sort indicators and sticky positioning. */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sortDirection, align = 'left', stickyAction, stickyLead, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-10 px-4 text-left align-middle font-medium text-muted-foreground',
        '[table[data-compact]_&]:h-8 [table[data-compact]_&]:px-3',
        '[&:has([role=checkbox])]:pr-0',
        alignStyles[align],
        sortable && 'cursor-pointer select-none hover:text-foreground',
        stickyAction && 'sticky right-0 bg-background shadow-sticky-left',
        stickyLead && 'sticky left-0 bg-background shadow-sticky-right',
        className
      )}
      data-sticky-action={stickyAction || undefined}
      data-sticky-lead={stickyLead || undefined}
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

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Text alignment @default "left" */
  align?: TableAlign
  /** Numeric cell — right-aligned with tabular figures so digit columns line up */
  numeric?: boolean
  /** Sticky action column — pins to the right edge during horizontal scroll */
  stickyAction?: boolean
  /** Sticky lead column — pins to the left edge during horizontal scroll (e.g. a ticker/name column in a wide table) */
  stickyLead?: boolean
}

/** Table data cell with optional alignment, numeric formatting, and sticky columns. */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = 'left', numeric, stickyAction, stickyLead, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        // Row separator lives here — tr borders don't paint under border-separate
        'border-b p-4 align-middle [&:has([role=checkbox])]:pr-0',
        '[table[data-compact]_&]:px-3 [table[data-compact]_&]:py-2',
        alignStyles[align],
        numeric && 'text-right tabular-nums',
        stickyAction && 'sticky right-0 bg-background shadow-sticky-left',
        stickyLead && 'sticky left-0 bg-background shadow-sticky-right',
        className
      )}
      data-sticky-action={stickyAction || undefined}
      data-sticky-lead={stickyLead || undefined}
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

/**
 * Auto colSpan: count the header cells of the enclosing table once mounted.
 * An explicit colSpan skips measuring (use it when columns change at runtime).
 */
function useAutoColSpan(explicit?: number) {
  const ref = useRef<HTMLTableCellElement>(null)
  const [measured, setMeasured] = useState(1)
  useLayoutEffect(() => {
    if (explicit != null) return
    const table = ref.current?.closest('table')
    const headerRow = table?.querySelector('thead tr')
    const count = headerRow?.children.length ?? 0
    if (count > 0) setMeasured(count)
  }, [explicit])
  return { ref, colSpan: explicit ?? measured }
}

export interface TableEmptyProps {
  /** Span — measured from the header row when omitted */
  colSpan?: number
  /** Custom empty content — defaults to the locale's empty message */
  children?: ReactNode
  className?: string
}

/** Full-width empty-state row for the Table family (colSpan handled for you). */
export function TableEmpty({ colSpan, children, className }: TableEmptyProps) {
  const locale = useLocale()
  const auto = useAutoColSpan(colSpan)
  return (
    <TableRow>
      <TableCell
        ref={auto.ref}
        colSpan={auto.colSpan}
        className={cn('h-24 text-center text-muted-foreground', className)}
      >
        {children ?? locale.dataTable.emptyMessage}
      </TableCell>
    </TableRow>
  )
}

export interface TableLoadingProps {
  /** Span — measured from the header row when omitted */
  colSpan?: number
  /** Custom label — defaults to the locale's loading message */
  children?: ReactNode
  className?: string
}

/** Full-width loading row for the Table family (colSpan handled for you). */
export function TableLoading({ colSpan, children, className }: TableLoadingProps) {
  const locale = useLocale()
  const auto = useAutoColSpan(colSpan)
  return (
    <TableRow>
      <TableCell
        ref={auto.ref}
        colSpan={auto.colSpan}
        className={cn('h-24 text-center', className)}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-muted-foreground">{children ?? locale.dataTable.loading}</span>
        </div>
      </TableCell>
    </TableRow>
  )
}
