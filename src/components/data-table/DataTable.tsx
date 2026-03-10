import { useState, useMemo, useCallback, type ReactNode } from 'react'
import { cn } from '../../utils/cn'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../table/Table'
import { Button } from '../button/Button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Check, Minus } from 'lucide-react'

export interface Column<T> {
  /** Column key (should match data property) */
  key: string
  /** Column header */
  header: ReactNode
  /** Custom cell renderer */
  cell?: (row: T, index: number) => ReactNode
  /** Enable sorting for this column */
  sortable?: boolean
  /** Column width */
  width?: string | number
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Hide column */
  hidden?: boolean
}

export type SortDirection = 'asc' | 'desc' | null

export interface SortState {
  key: string
  direction: SortDirection
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface DataTableProps<T> {
  /** Table data */
  data: T[]
  /** Column definitions */
  columns: Column<T>[]
  /** Enable pagination */
  pagination?: boolean
  /** Page size options */
  pageSizeOptions?: number[]
  /** Default page size */
  defaultPageSize?: number
  /** Row key extractor */
  getRowKey?: (row: T, index: number) => string | number
  /** Loading state */
  loading?: boolean
  /** Empty state content */
  emptyContent?: ReactNode
  /** On row click */
  onRowClick?: (row: T, index: number) => void
  /** Selected rows */
  selectedRows?: Set<string | number>
  /** On selection change */
  onSelectionChange?: (selected: Set<string | number>) => void
  /** Enable row selection */
  selectable?: boolean
  /** Additional class name */
  className?: string
}

/* ─── Selection Checkbox ─── */

type CheckState = 'checked' | 'indeterminate' | 'unchecked'

function SelectionCheckbox({
  state,
  onChange,
  disabled,
  'aria-label': ariaLabel,
}: {
  state: CheckState
  onChange: () => void
  disabled?: boolean
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === 'indeterminate' ? 'mixed' : state === 'checked'}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={cn(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        state !== 'unchecked'
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-input bg-background'
      )}
    >
      {state === 'checked' && <Check className="h-3 w-3" />}
      {state === 'indeterminate' && <Minus className="h-3 w-3" />}
    </button>
  )
}

/** Feature-rich data table with sorting, pagination, and custom cell rendering. */
export function DataTable<T>({
  data,
  columns,
  pagination = true,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  getRowKey = (_row, index) => index,
  loading = false,
  emptyContent,
  onRowClick,
  selectable = false,
  selectedRows,
  onSelectionChange,
  className,
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState | null>(null)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  // Filter visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  )

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState || !sortState.direction) return data

    const sorted = [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortState.key]
      const bValue = (b as Record<string, unknown>)[sortState.key]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1
      return sortState.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [data, sortState])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const start = paginationState.pageIndex * paginationState.pageSize
    const end = start + paginationState.pageSize
    return sortedData.slice(start, end)
  }, [sortedData, pagination, paginationState])

  // Pagination info
  const totalPages = Math.ceil(sortedData.length / paginationState.pageSize)
  const canPreviousPage = paginationState.pageIndex > 0
  const canNextPage = paginationState.pageIndex < totalPages - 1

  const handleSort = (key: string) => {
    setSortState((prev) => {
      if (prev?.key !== key) {
        return { key, direction: 'asc' }
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return null
    })
  }

  const goToPage = (pageIndex: number) => {
    setPaginationState((prev) => ({
      ...prev,
      pageIndex: Math.max(0, Math.min(pageIndex, totalPages - 1)),
    }))
  }

  const setPageSize = (pageSize: number) => {
    setPaginationState({ pageIndex: 0, pageSize })
  }

  // ─── Selection helpers ───
  const selection = selectedRows ?? new Set<string | number>()

  const allPageKeys = useMemo(
    () => paginatedData.map((row, i) => getRowKey(row, paginationState.pageIndex * paginationState.pageSize + i)),
    [paginatedData, getRowKey, paginationState]
  )

  const headerCheckState: CheckState = useMemo(() => {
    if (!selectable || allPageKeys.length === 0) return 'unchecked'
    const selectedOnPage = allPageKeys.filter((k) => selection.has(k)).length
    if (selectedOnPage === 0) return 'unchecked'
    if (selectedOnPage === allPageKeys.length) return 'checked'
    return 'indeterminate'
  }, [selectable, allPageKeys, selection])

  const toggleAll = useCallback(() => {
    if (!onSelectionChange) return
    const next = new Set(selection)
    if (headerCheckState === 'checked') {
      allPageKeys.forEach((k) => next.delete(k))
    } else {
      allPageKeys.forEach((k) => next.add(k))
    }
    onSelectionChange(next)
  }, [onSelectionChange, selection, headerCheckState, allPageKeys])

  const toggleRow = useCallback(
    (key: string | number) => {
      if (!onSelectionChange) return
      const next = new Set(selection)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      onSelectionChange(next)
    },
    [onSelectionChange, selection]
  )

  const getSortIcon = (key: string) => {
    if (sortState?.key !== key) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />
    }
    if (sortState.direction === 'asc') {
      return <ArrowUp className="h-4 w-4" />
    }
    return <ArrowDown className="h-4 w-4" />
  }

  const getCellValue = (row: T, column: Column<T>, index: number): ReactNode => {
    if (column.cell) {
      return column.cell(row, index)
    }
    const value = (row as Record<string, unknown>)[column.key]
    if (value === null || value === undefined) return '-'
    return String(value)
  }

  return (
    <div className={cn('rounded-md border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead style={{ width: 40 }} className="px-3">
                <SelectionCheckbox
                  state={headerCheckState}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {visibleColumns.map((column) => (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                {column.sortable ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {column.header}
                    {getSortIcon(column.key)}
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                className="h-24 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + (selectable ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyContent || 'No results found.'}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, pageLocalIndex) => {
              const globalIndex = pagination
                ? paginationState.pageIndex * paginationState.pageSize + pageLocalIndex
                : pageLocalIndex
              const rowKey = getRowKey(row, globalIndex)
              const isSelected = selectable && selection.has(rowKey)
              return (
              <TableRow
                key={rowKey}
                onClick={onRowClick ? () => onRowClick(row, globalIndex) : undefined}
                className={cn(
                  onRowClick && 'cursor-pointer',
                  isSelected && 'bg-primary/5'
                )}
                data-selected={isSelected || undefined}
              >
                {selectable && (
                  <TableCell className="px-3">
                    <SelectionCheckbox
                      state={isSelected ? 'checked' : 'unchecked'}
                      onChange={() => toggleRow(rowKey)}
                      aria-label={`Select row ${rowKey}`}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {getCellValue(row, column, globalIndex)}
                  </TableCell>
                ))}
              </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {pagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows per page:</span>
            <select
              value={paginationState.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {paginationState.pageIndex * paginationState.pageSize + 1}-
              {Math.min(
                (paginationState.pageIndex + 1) * paginationState.pageSize,
                sortedData.length
              )}{' '}
              of {sortedData.length}
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(0)}
                  disabled={!canPreviousPage}
                  className="h-8 w-8"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(paginationState.pageIndex - 1)}
                  disabled={!canPreviousPage}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex h-8 min-w-[4rem] items-center justify-center text-sm">
                  {paginationState.pageIndex + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(paginationState.pageIndex + 1)}
                  disabled={!canNextPage}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(totalPages - 1)}
                  disabled={!canNextPage}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
