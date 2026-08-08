import type { ArkiteLocale } from './types'

/**
 * English (US) — the built-in default. Values must stay identical to the
 * strings components shipped before the locale system existed, so
 * unwrapped apps render exactly as before.
 */
export const enUS: ArkiteLocale = {
  dateLocale: 'en-US',

  calendar: {
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  datePicker: {
    placeholder: 'Select date',
    openCalendar: 'Open calendar',
    today: 'Today',
    clearDate: 'Clear date',
  },
  dateRangePicker: {
    startLabel: 'Start',
    endLabel: 'End',
    clearDates: 'Clear dates',
    clear: 'Clear',
    selectRange: 'Select date range',
    selectStart: 'Select start date',
    selectEnd: 'Select end date',
  },
  searchInput: {
    clear: 'Clear search',
  },
  filterBar: {
    searchPlaceholder: 'Search...',
  },
  combobox: {
    placeholder: 'Select...',
    searchPlaceholder: 'Search...',
    emptyMessage: 'No results found.',
    loading: 'Loading...',
  },
  sheetSelect: {
    placeholder: 'Select…',
  },
  pagination: {
    label: 'Pagination',
    rowsPerPage: 'Rows per page:',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    pageLabel: (page) => `Page ${page}`,
    rangeInfo: (start, end, total) => `${start}-${end} of ${total}`,
  },
  dataTable: {
    emptyMessage: 'No results found.',
    toggleColumns: 'Toggle columns',
    selectAllRows: 'Select all rows',
    selectRow: (rowKey) => `Select row ${rowKey}`,
    columns: 'Columns',
    expand: 'Expand',
    expandRow: 'Expand row',
    collapseRow: 'Collapse row',
    sortBy: (header) => `Sort by ${header}`,
    sortColumn: 'Sort column',
    filterBy: (header) => `Filter ${header}`,
    clearFilter: 'Clear',
    loading: 'Loading...',
    showing: (count, total) => `Showing ${count} of ${total}`,
  },
  emptyState: {
    noResultsTitle: 'No results found',
    noResultsDescription: 'Try adjusting your search or filters.',
    noDataTitle: 'No data yet',
    noDataDescription: 'Get started by creating your first item.',
    errorTitle: 'Something went wrong',
    errorDescription: 'An error occurred while loading the data.',
    retryLabel: 'Try again',
  },
  confirmDialog: {
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    confirmTitle: 'Are you sure?',
    confirmDescription: 'This action cannot be undone.',
    deleteTitle: (itemName) => `Delete ${itemName}?`,
    deleteFallbackItem: 'this item',
    deleteDescription:
      'This action cannot be undone. All associated data will be permanently removed.',
    deleteLabel: 'Delete',
  },
  tenantSwitcher: {
    allLabel: 'All Tenants',
    allDescription: 'Platform-wide view',
    emptyMessage: 'No tenants found',
    searchPlaceholder: 'Search tenants...',
  },
  bulkActionBar: {
    selected: (count) => `${count} item${count === 1 ? '' : 's'} selected`,
    deselectAll: 'Deselect all',
  },
  numberInput: {
    increment: 'Increment',
    decrement: 'Decrement',
  },
  copyButton: {
    copy: 'Copy',
    copied: 'Copied!',
    copyAria: 'Copy to clipboard',
    copiedAria: 'Copied',
    copyValue: 'Copy value',
  },
  modal: {
    close: 'Close',
  },
  drawer: {
    close: 'Close',
  },
  toast: {
    close: 'Close',
  },
  spinner: {
    loading: 'Loading',
    loadingText: 'Loading...',
  },
  adminLayout: {
    primaryNavigation: 'Primary',
    logout: 'Logout',
    expandMenu: 'Expand menu',
    bottomNavigation: 'Bottom navigation',
  },
  pinInput: {
    charLabel: (index, length) => `Character ${index} of ${length}`,
  },
  viewToggle: {
    label: 'View mode',
    tableView: 'Table view',
    cardView: 'Card view',
  },
  commandPalette: {
    label: 'Command palette',
  },
  fileUpload: {
    uploadFile: 'Upload file',
    uploadFiles: 'Upload files',
    uploadImage: 'Upload image',
    addImage: 'Add image',
    upload: 'Upload',
    remove: 'Remove',
    replace: 'Replace',
    removeImage: 'Remove image',
    preview: 'Preview',
    dropzone: 'Drop files here or click to upload',
    anyFileType: 'Any file type accepted',
    acceptedTypes: (accept) => `Accepted: ${accept}`,
    maxSizeNote: (size) => `Max size: ${size}`,
    maxSizeHint: (size) => `Max ${size}`,
    fileTooLarge: (name, size) => `File "${name}" exceeds maximum size of ${size}`,
    fileNotAccepted: (name) => `File "${name}" is not an accepted file type`,
    tooManyFiles: (max) => `Maximum ${max} files allowed`,
  },
  virtualList: {
    label: 'Scrollable list',
    empty: 'No items',
    loadingMore: 'Loading more...',
  },
  colorPicker: {
    pickColor: 'Pick a color',
    hexValue: 'Hex color value',
    presetColors: 'Preset colors',
    selectColor: (color) => `Select color ${color}`,
  },
  progress: {
    label: 'Progress',
  },
  breadcrumb: {
    label: 'Breadcrumb',
  },
  label: {
    optional: '(optional)',
  },
  passwordInput: {
    hide: 'Hide password',
    show: 'Show password',
  },
  tagInput: {
    remove: (tag) => `Remove ${tag}`,
  },
  tree: {
    collapse: 'Collapse',
    expand: 'Expand',
    toggle: 'Toggle',
  },
  filterSelect: {
    all: 'All',
  },
  pageHeader: {
    back: 'Go back',
  },
  sidebar: {
    toggle: 'Toggle sidebar',
  },
  actionButtons: {
    label: 'Actions',
  },
}
