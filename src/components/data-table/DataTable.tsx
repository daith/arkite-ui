import { Fragment, useState, useMemo, useCallback, useRef, useEffect, type ReactNode } from 'react'
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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Check, Minus, Columns3, ListFilter } from 'lucide-react'

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
  /** Enable filtering for this column */
  filterable?: boolean
  /** Custom filter options. If not provided, auto-detect unique values from data. */
  filterOptions?: string[]
  /** Custom filter function */
  filterFn?: (row: T, filterValue: string) => boolean
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
  /** Expandable row content renderer */
  expandable?: (row: T, index: number) => ReactNode
  /** Show column visibility toggle */
  columnToggle?: boolean
  /** Stick table header to top when scrolling */
  stickyHeader?: boolean
  /** Max height for the scrollable table area (e.g. '400px', '60vh'). Required for stickyHeader to work. */
  maxHeight?: string | number
  /**
   * Make the table scroll wrapper fill its parent's height (`h-full`).
   * Use when the DataTable is inside a fixed-height flex container so the
   * horizontal scrollbar pins to the bottom of the viewport even when there
   * are few rows. The parent must provide a determinate height.
   */
  fillHeight?: boolean
  /** Callback when filters change (for controlled usage) */
  onFilterChange?: (filters: Record<string, string[]>) => void
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
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:ring-offset-0',
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
  expandable,
  columnToggle = false,
  stickyHeader = false,
  maxHeight,
  fillHeight = false,
  onFilterChange,
  className,
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set())
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<Set<string>>(new Set())
  const [columnToggleOpen, setColumnToggleOpen] = useState(false)
  const columnToggleRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [openFilterKey, setOpenFilterKey] = useState<string | null>(null)
  const filterDropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  // Close column toggle dropdown on outside click
  useEffect(() => {
    if (!columnToggleOpen) return
    const handleClick = (e: MouseEvent) => {
      if (columnToggleRef.current && !columnToggleRef.current.contains(e.target as Node)) {
        setColumnToggleOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [columnToggleOpen])

  // Close filter dropdown on outside click
  useEffect(() => {
    if (!openFilterKey) return
    const handleClick = (e: MouseEvent) => {
      const ref = filterDropdownRefs.current[openFilterKey]
      if (ref && !ref.contains(e.target as Node)) {
        setOpenFilterKey(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openFilterKey])

  // Filter visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden && !hiddenColumnKeys.has(col.key)),
    [columns, hiddenColumnKeys]
  )

  // Toggleable columns (non-hidden by definition)
  const toggleableColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  )

  // ─── Filter helpers ───
  const getFilterOptions = useCallback(
    (column: Column<T>): string[] => {
      if (column.filterOptions) return column.filterOptions
      const unique = new Set<string>()
      data.forEach((row) => {
        const value = (row as Record<string, unknown>)[column.key]
        if (value !== null && value !== undefined) {
          unique.add(String(value))
        }
      })
      return Array.from(unique).sort()
    },
    [data]
  )

  const toggleFilterValue = useCallback(
    (columnKey: string, value: string) => {
      setFilters((prev) => {
        const current = prev[columnKey] ?? []
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        const updated = { ...prev }
        if (next.length === 0) {
          delete updated[columnKey]
        } else {
          updated[columnKey] = next
        }
        onFilterChange?.(updated)
        return updated
      })
      setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
    },
    [onFilterChange]
  )

  const clearColumnFilter = useCallback(
    (columnKey: string) => {
      setFilters((prev) => {
        const updated = { ...prev }
        delete updated[columnKey]
        onFilterChange?.(updated)
        return updated
      })
      setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
    },
    [onFilterChange]
  )

  // Filter data
  const filteredData = useMemo(() => {
    const activeFilters = Object.entries(filters).filter(([, values]) => values.length > 0)
    if (activeFilters.length === 0) return data

    return data.filter((row) =>
      activeFilters.every(([columnKey, filterValues]) => {
        const column = columns.find((c) => c.key === columnKey)
        if (column?.filterFn) {
          return filterValues.some((fv) => column.filterFn!(row, fv))
        }
        const cellValue = String((row as Record<string, unknown>)[columnKey] ?? '')
        return filterValues.includes(cellValue)
      })
    )
  }, [data, filters, columns])

  const hasActiveFilters = Object.keys(filters).length > 0

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState || !sortState.direction) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortState.key]
      const bValue = (b as Record<string, unknown>)[sortState.key]

      if (aValue === bValue) return 0
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      const comparison = aValue < bValue ? -1 : 1
      return sortState.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredData, sortState])

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

  // ─── Expand helpers ───
  const toggleExpand = useCallback((key: string | number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // ─── Column toggle helpers ───
  const toggleColumnVisibility = useCallback((key: string) => {
    setHiddenColumnKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // Total colSpan for full-width rows
  const totalColSpan = visibleColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)

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
    <div className={cn('rounded-md border', fillHeight && 'flex h-full flex-col', className)}>
      {columnToggle && (
        <div className="flex items-center justify-end border-b px-4 py-2">
          <div ref={columnToggleRef} className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColumnToggleOpen((o) => !o)}
              className="h-8 gap-1.5"
              aria-label="Toggle columns"
            >
              <Columns3 className="h-4 w-4" />
              Columns
            </Button>
            {columnToggleOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 min-w-[10rem] rounded-md border bg-popover p-1 shadow-md">
                {toggleableColumns.map((col) => {
                  const isVisible = !hiddenColumnKeys.has(col.key)
                  return (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => toggleColumnVisibility(col.key)}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className={cn(
                        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
                        isVisible ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                      )}>
                        {isVisible && <Check className="h-3 w-3" />}
                      </span>
                      {typeof col.header === 'string' ? col.header : col.key}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div
        data-testid={stickyHeader ? 'sticky-scroll-container' : undefined}
        className={cn(
          // 沒 fillHeight 時 sticky 自己提供 scroll container
          stickyHeader && !fillHeight && 'overflow-auto',
          // fillHeight 模式：middle 只當 flex 容器，scroll 交給 inner Table wrapper
          fillHeight && 'flex-1 min-h-0',
        )}
        style={stickyHeader && !fillHeight && maxHeight ? { maxHeight } : undefined}
      >
      <Table stickyHeader={stickyHeader} fillHeight={fillHeight}>
        <TableHeader>
          <TableRow>
            {expandable && (
              <TableHead style={{ width: 40 }} className="px-2">
                <span className="sr-only">Expand</span>
              </TableHead>
            )}
            {selectable && (
              <TableHead style={{ width: 40 }} className="px-3">
                <SelectionCheckbox
                  state={headerCheckState}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {visibleColumns.map((column) => {
              const isFilterActive = (filters[column.key]?.length ?? 0) > 0
              const isFilterOpen = openFilterKey === column.key
              return (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  'relative',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                <div className="inline-flex items-center gap-1">
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      aria-label={typeof column.header === 'string' ? `Sort by ${column.header}` : `Sort column`}
                    >
                      {column.header}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                  {column.filterable && (
                    <div ref={(el) => { filterDropdownRefs.current[column.key] = el }} className="relative inline-block">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenFilterKey(isFilterOpen ? null : column.key)
                        }}
                        aria-label={`Filter ${typeof column.header === 'string' ? column.header : column.key}`}
                        className={cn(
                          'inline-flex h-5 w-5 items-center justify-center rounded-sm hover:bg-accent',
                          isFilterActive ? 'text-primary' : 'opacity-50'
                        )}
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                      </button>
                      {isFilterOpen && (
                        <div data-testid={`filter-dropdown-${column.key}`} className="absolute left-0 top-full z-20 mt-1 min-w-[10rem] rounded-md border bg-popover p-1 shadow-md">
                          {getFilterOptions(column).map((option) => {
                            const isSelected = filters[column.key]?.includes(option) ?? false
                            return (
                              <button
                                key={option}
                                type="button"
                                role="checkbox"
                                aria-checked={filters[column.key]?.includes(option) ?? false}
                                aria-label={option}
                                onClick={() => toggleFilterValue(column.key, option)}
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                              >
                                <span className={cn(
                                  'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border',
                                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                                )}>
                                  {isSelected && <Check className="h-3 w-3" />}
                                </span>
                                {option}
                              </button>
                            )
                          })}
                          {isFilterActive && (
                            <button
                              type="button"
                              onClick={() => clearColumnFilter(column.key)}
                              className="mt-1 flex w-full items-center justify-center rounded-sm border-t px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={totalColSpan}
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
                colSpan={totalColSpan}
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
              const isExpanded = expandable && expandedRows.has(rowKey)
              return (
              <Fragment key={rowKey}>
              <TableRow
                onClick={onRowClick ? () => onRowClick(row, globalIndex) : undefined}
                className={cn(
                  onRowClick && 'cursor-pointer',
                  isSelected && 'bg-primary/5'
                )}
                data-selected={isSelected || undefined}
              >
                {expandable && (
                  <TableCell className="px-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpand(rowKey)
                      }}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-sm hover:bg-accent"
                      aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                    >
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                    </button>
                  </TableCell>
                )}
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
              {isExpanded && (
                <TableRow>
                  <TableCell colSpan={totalColSpan} className="bg-muted/30 p-4">
                    {expandable(row, globalIndex)}
                  </TableCell>
                </TableRow>
              )}
              </Fragment>
              )
            })
          )}
        </TableBody>
      </Table>
      </div>

      {pagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {hasActiveFilters && (
              <span data-testid="filter-count">
                Showing {filteredData.length} of {data.length}
              </span>
            )}
            <span>Rows per page:</span>
            <select
              value={paginationState.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Rows per page"
              className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring/40 focus:ring-offset-0 cursor-pointer"
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
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(paginationState.pageIndex - 1)}
                  disabled={!canPreviousPage}
                  className="h-8 w-8"
                  aria-label="Previous page"
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
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(totalPages - 1)}
                  disabled={!canNextPage}
                  className="h-8 w-8"
                  aria-label="Last page"
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
