/**
 * Locale contract for all built-in component strings.
 *
 * Every default string a component renders (visible text, placeholders,
 * aria-labels) resolves through this object, so a single provider swap
 * localizes the whole library. Explicit props always win over locale
 * values.
 */
export interface ArkiteLocale {
  /** BCP 47 tag for Intl-based formatting (calendar month names, etc.) */
  dateLocale: string

  calendar: {
    previousMonth: string
    nextMonth: string
    /** Weekday headers, Sunday first — rotated for `weekStartsOn`. */
    weekdays: [string, string, string, string, string, string, string]
    /** Wider weekday headers (DatePicker grids), Sunday first. */
    weekdaysShort: [string, string, string, string, string, string, string]
  }
  datePicker: {
    placeholder: string
    openCalendar: string
    today: string
  }
  dateRangePicker: {
    startLabel: string
    endLabel: string
    clearDates: string
    clear: string
    selectRange: string
    selectStart: string
    selectEnd: string
  }
  searchInput: {
    clear: string
  }
  filterBar: {
    searchPlaceholder: string
  }
  combobox: {
    placeholder: string
    searchPlaceholder: string
    emptyMessage: string
    loading: string
  }
  sheetSelect: {
    placeholder: string
  }
  pagination: {
    label: string
    rowsPerPage: string
    firstPage: string
    previousPage: string
    nextPage: string
    lastPage: string
    pageLabel: (page: number) => string
    rangeInfo: (start: number, end: number, total: number) => string
  }
  dataTable: {
    emptyMessage: string
    toggleColumns: string
    selectAllRows: string
    selectRow: (rowKey: string | number) => string
    columns: string
    expand: string
    expandRow: string
    collapseRow: string
    sortBy: (header: string) => string
    sortColumn: string
    filterBy: (header: string) => string
    clearFilter: string
    loading: string
    showing: (count: number, total: number) => string
  }
  emptyState: {
    noResultsTitle: string
    noResultsDescription: string
    noDataTitle: string
    noDataDescription: string
    errorTitle: string
    errorDescription: string
    retryLabel: string
  }
  confirmDialog: {
    cancelLabel: string
    confirmLabel: string
    confirmTitle: string
    confirmDescription: string
    deleteTitle: (itemName: string) => string
    /** Used in `deleteTitle` when no item name is given. */
    deleteFallbackItem: string
    deleteDescription: string
    deleteLabel: string
  }
  tenantSwitcher: {
    allLabel: string
    allDescription: string
    emptyMessage: string
    searchPlaceholder: string
  }
  bulkActionBar: {
    selected: (count: number) => string
    deselectAll: string
  }
  numberInput: {
    increment: string
    decrement: string
  }
  copyButton: {
    copy: string
    copied: string
    copyAria: string
    copiedAria: string
    copyValue: string
  }
  modal: {
    close: string
  }
  drawer: {
    close: string
  }
  toast: {
    close: string
  }
  spinner: {
    loading: string
    loadingText: string
  }
  adminLayout: {
    primaryNavigation: string
    logout: string
    expandMenu: string
  }
  viewToggle: {
    label: string
    tableView: string
    cardView: string
  }
  commandPalette: {
    label: string
  }
  fileUpload: {
    uploadFile: string
    uploadFiles: string
    uploadImage: string
    addImage: string
    upload: string
    remove: string
    replace: string
    removeImage: string
    preview: string
    dropzone: string
    anyFileType: string
    acceptedTypes: (accept: string) => string
    maxSizeNote: (size: string) => string
    maxSizeHint: (size: string) => string
    fileTooLarge: (name: string, size: string) => string
    fileNotAccepted: (name: string) => string
    tooManyFiles: (max: number) => string
  }
  virtualList: {
    label: string
    empty: string
    loadingMore: string
  }
  colorPicker: {
    pickColor: string
    hexValue: string
    presetColors: string
    selectColor: (color: string) => string
  }
  progress: {
    label: string
  }
  breadcrumb: {
    label: string
  }
  label: {
    optional: string
  }
  passwordInput: {
    hide: string
    show: string
  }
  tagInput: {
    remove: (tag: string) => string
  }
  tree: {
    collapse: string
    expand: string
    toggle: string
  }
  filterSelect: {
    all: string
  }
  pageHeader: {
    back: string
  }
  sidebar: {
    toggle: string
  }
  actionButtons: {
    label: string
  }
}

/**
 * Partial locale for overrides: any section may be omitted, and within a
 * section any key may be omitted — missing values fall back to English.
 */
export type PartialArkiteLocale = {
  [K in keyof ArkiteLocale]?: ArkiteLocale[K] extends object
    ? Partial<ArkiteLocale[K]>
    : ArkiteLocale[K]
}
