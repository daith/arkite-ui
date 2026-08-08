import type { ArkiteLocale } from './types'

/** 繁體中文（台灣） */
export const zhTW: ArkiteLocale = {
  dateLocale: 'zh-TW',

  calendar: {
    previousMonth: '上個月',
    nextMonth: '下個月',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    weekdaysShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  },
  datePicker: {
    placeholder: '選擇日期',
    openCalendar: '開啟日曆',
    today: '今天',
    clearDate: '清除日期',
  },
  dateRangePicker: {
    startLabel: '開始',
    endLabel: '結束',
    clearDates: '清除日期',
    clear: '清除',
    selectRange: '選擇日期範圍',
    selectStart: '選擇開始日期',
    selectEnd: '選擇結束日期',
  },
  searchInput: {
    clear: '清除搜尋',
  },
  filterBar: {
    searchPlaceholder: '搜尋…',
  },
  combobox: {
    placeholder: '請選擇…',
    searchPlaceholder: '搜尋…',
    emptyMessage: '查無結果',
    loading: '載入中…',
  },
  sheetSelect: {
    placeholder: '請選擇…',
  },
  pagination: {
    label: '分頁',
    rowsPerPage: '每頁筆數：',
    firstPage: '第一頁',
    previousPage: '上一頁',
    nextPage: '下一頁',
    lastPage: '最後一頁',
    pageLabel: (page) => `第 ${page} 頁`,
    rangeInfo: (start, end, total) => `第 ${start}-${end} 筆，共 ${total} 筆`,
  },
  dataTable: {
    emptyMessage: '查無結果',
    toggleColumns: '切換欄位',
    selectAllRows: '全選',
    selectRow: (rowKey) => `選取第 ${rowKey} 列`,
    columns: '欄位',
    expand: '展開',
    expandRow: '展開列',
    collapseRow: '收合列',
    sortBy: (header) => `依 ${header} 排序`,
    sortColumn: '排序欄位',
    filterBy: (header) => `篩選 ${header}`,
    clearFilter: '清除',
    loading: '載入中…',
    showing: (count, total) => `顯示 ${count} 筆，共 ${total} 筆`,
  },
  emptyState: {
    noResultsTitle: '查無結果',
    noResultsDescription: '請調整搜尋或篩選條件。',
    noDataTitle: '尚無資料',
    noDataDescription: '建立第一筆資料開始使用。',
    errorTitle: '發生錯誤',
    errorDescription: '載入資料時發生錯誤。',
    retryLabel: '重試',
  },
  confirmDialog: {
    cancelLabel: '取消',
    confirmLabel: '確認',
    confirmTitle: '確定要執行嗎？',
    confirmDescription: '此操作無法復原。',
    deleteTitle: (itemName) => `刪除${itemName}？`,
    deleteFallbackItem: '此項目',
    deleteDescription: '此操作無法復原，所有相關資料將被永久移除。',
    deleteLabel: '刪除',
  },
  tenantSwitcher: {
    allLabel: '全部租戶',
    allDescription: '平台總覽',
    emptyMessage: '查無租戶',
    searchPlaceholder: '搜尋租戶…',
  },
  bulkActionBar: {
    selected: (count) => `已選取 ${count} 筆`,
    deselectAll: '取消全選',
  },
  numberInput: {
    increment: '增加',
    decrement: '減少',
  },
  copyButton: {
    copy: '複製',
    copied: '已複製！',
    copyAria: '複製到剪貼簿',
    copiedAria: '已複製',
    copyValue: '複製內容',
  },
  modal: {
    close: '關閉',
  },
  drawer: {
    close: '關閉',
  },
  toast: {
    close: '關閉',
  },
  spinner: {
    loading: '載入中',
    loadingText: '載入中…',
  },
  adminLayout: {
    primaryNavigation: '主導覽',
    logout: '登出',
    expandMenu: '展開選單',
    bottomNavigation: '底部導覽',
  },
  pinInput: {
    charLabel: (index, length) => `第 ${index} 碼,共 ${length} 碼`,
  },
  viewToggle: {
    label: '檢視模式',
    tableView: '表格檢視',
    cardView: '卡片檢視',
  },
  commandPalette: {
    label: '命令面板',
  },
  fileUpload: {
    uploadFile: '上傳檔案',
    uploadFiles: '上傳檔案',
    uploadImage: '上傳圖片',
    addImage: '新增圖片',
    upload: '上傳',
    remove: '移除',
    replace: '更換',
    removeImage: '移除圖片',
    preview: '預覽',
    dropzone: '拖放檔案至此，或點擊上傳',
    anyFileType: '不限檔案格式',
    acceptedTypes: (accept) => `可接受格式：${accept}`,
    maxSizeNote: (size) => `大小上限：${size}`,
    maxSizeHint: (size) => `上限 ${size}`,
    fileTooLarge: (name, size) => `檔案「${name}」超過大小上限 ${size}`,
    fileNotAccepted: (name) => `檔案「${name}」格式不符`,
    tooManyFiles: (max) => `最多只能上傳 ${max} 個檔案`,
  },
  virtualList: {
    label: '可捲動清單',
    empty: '沒有項目',
    loadingMore: '載入更多…',
  },
  colorPicker: {
    pickColor: '選擇顏色',
    hexValue: '十六進位色碼',
    presetColors: '預設色票',
    selectColor: (color) => `選擇顏色 ${color}`,
  },
  progress: {
    label: '進度',
  },
  breadcrumb: {
    label: '導覽路徑',
  },
  label: {
    optional: '(選填)',
  },
  passwordInput: {
    hide: '隱藏密碼',
    show: '顯示密碼',
  },
  tagInput: {
    remove: (tag) => `移除 ${tag}`,
  },
  tree: {
    collapse: '收合',
    expand: '展開',
    toggle: '切換',
  },
  filterSelect: {
    all: '全部',
  },
  pageHeader: {
    back: '返回',
  },
  sidebar: {
    toggle: '切換側欄',
  },
  actionButtons: {
    label: '操作',
  },
}
