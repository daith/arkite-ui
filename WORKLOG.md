# 工作日誌 — Arkite UI

## 2026-03-09（Day 1）

### 專案概述

從零開始建立 `@arkite/ui`，一個為 SaaS 管理後台設計的 React 元件庫。基於 shadcn/ui 的設計理念，使用 Tailwind CSS v4 + Radix UI + TypeScript 打造。

---

### Phase 1：基礎建設

**目標：** 建立專案骨架、核心元件、開發工具鏈

- 初始化專案結構，設定 tsup (ESM + CJS + DTS) 打包
- 建立 Storybook 10 文件站，配置 autodocs
- 設定 CI/CD pipeline（lint → typecheck → test → build → deploy）
- 配置 ESLint 9 flat config + jsx-a11y + react-hooks

**核心元件（v0.1.0 — 40+ 元件）：**

| 分類 | 元件 |
|------|------|
| Primitives | Button, Input, Badge, Select, Checkbox, Radio, Toggle, Avatar, Label, Spinner |
| Layout | AdminLayout, Card, Container, Stack, Divider |
| Navigation | Sidebar, TenantSwitcher, Navbar, Breadcrumb, Tabs |
| Data Display | DataTable, StatCard/StatGroup, EmptyState, Table, VirtualList, Calendar, Timeline, Steps |
| Form | Form (context-based), SearchInput, FileUpload, DatePicker |
| Feedback | Modal, Drawer, Toast (Zustand store), Alert, Progress, Skeleton |
| Overlay | Popover, Tooltip, DropdownMenu (Radix UI), Combobox, CommandPalette (cmdk) |
| Motion | AnimatedModal, AnimatedDrawer, AnimatedToastContainer (Framer Motion) |
| Actions | ActionButtons, ConfirmDialog, Pagination, PageHeader, ErrorBoundary |

**關鍵重構：**
- 解耦 `AdminLayout` — 移除 router 依賴，改用 `onNavigate` + `renderLink` props
- 解耦 `TenantSwitcher` — 移除 `useTenantStore` 依賴，改用 props 驅動

**Theme System：**
- 4 個內建預設（Default, Neutral, Ocean, Forest）
- `createTheme()` — 從品牌色自動生成完整 theme
- `applyTheme()` / `themeToCSS()` — runtime / SSR 套用

---

### Phase 2：Tailwind CSS v4 遷移（v0.2.0）

- 從 v3 config-file 遷移到 v4 CSS-first 設定
- 使用 `@theme`、`@custom-variant`、`@utility` 取代 `tailwind.config.ts`
- 新增 shadow elevation system（xs → 2xl）和 transition tokens
- 新增 `Kbd` 鍵盤快捷鍵元件
- 升級 `CommandShortcut` 自動拆分快捷鍵字串
- 新增 Storybook contextual stories（loading/empty/error states）
- 新增開發者文件（Introduction, Getting Started, Theme System, Form Patterns, Component Guidelines MDX）

---

### Phase 3：Final Sprint（v0.3.0）

**新增元件：**

| 元件 | 說明 |
|------|------|
| `BulkActionBar` | 浮動批次操作列，left/center/right slots |
| `StatusDot` | 狀態指示器 primitive（online/offline/busy/away），可選 pulse |
| `FilterBar` | 響應式 toolbar 佈局（FilterBarSearch + FilterBarFilters + FilterBarActions） |
| `Textarea` | 多行輸入，支援 autoResize、error state、sm/md/lg |
| `Switch` | Toggle 的語意別名 |
| `DeleteConfirmDialog` | 預設配置的刪除確認對話框，帶 `itemName` prop |

**元件增強：**
- `Table` — `stickyHeader` 黏性表頭 + `stickyAction` 黏性操作欄
- `ConfirmDialog` — 新增 `warning` variant（琥珀色圖示）
- `Badge` — 新增 `size` prop（sm/md）
- `Combobox` — 新增 `size` prop（sm/md/lg）
- `DatePicker` — 新增 `size` prop（sm/md/lg）
- `Avatar` — 重構使用 `StatusDot`，語意化 status 色彩

**Design Tokens：**
- Status color tokens — `--status-online/offline/busy/away`（light/dark mode）
- Chart color tokens — `--chart-1` ~ `--chart-5` + JS exports
- Density system 統一 — sm=h-8, md=h-10, lg=h-12

**Breaking Change：**
- 移除業務邏輯 exports（`authStore`, `tenantStore`, `usePermission`, `useDataFetch`）
- 確立核心原則：**純 UI 元件庫，不包含業務邏輯**

---

### Phase 4：品質優化（Issue #13–#21）

建立 9 個 GitLab Issues 並逐一處理：

| Issue | 標題 | 狀態 |
|-------|------|------|
| #13 | 移除業務邏輯 exports | ✅ Closed |
| #14 | 版本同步至 0.3.0 | ✅ Closed |
| #15 | 回填 CHANGELOG | ✅ Closed |
| #16 | 提升測試覆蓋率 | ✅ Closed |
| #17 | Storybook a11y error-based 測試 | ✅ Closed |
| #18 | Bundle size 監控 | ✅ Closed |
| #19 | Changesets 自動化版本管理 | ✅ Closed |
| #20 | Chromatic 視覺回歸測試 | ✅ Closed |
| #21 | JSDoc 文件 | ✅ Closed |

**測試覆蓋：**
- 從 13 個測試檔（60 tests）→ 39 個測試檔（412 tests）
- 覆蓋率 ~71%（39/55 元件）
- 高優先：DataTable, Modal, Toast, Pagination, ErrorBoundary, Combobox, Sidebar
- 中優先：Select, Checkbox, Radio, Alert, Drawer, Tabs, SearchInput, FileUpload
- 低優先：Card, Spinner, Label, Progress, Skeleton, Toggle, Kbd, Stack, Container, Divider, Avatar, Table

**基礎建設：**
- `@changesets/cli` — MR 驅動的版本管理流程
- `chromatic` — CI 整合視覺回歸測試（需設定 `CHROMATIC_PROJECT_TOKEN`）
- `size-limit` — Bundle size 預算（index.js < 300KB, tailwind-preset.js < 10KB）
- 全部 53 個 exported 元件加上 JSDoc 註解

---

### Phase 5：文件完善

- **README.md** — 全面重寫，反映 v0.3.0 現狀（55+ 元件清單、Tailwind v4 設定、changesets 流程）
- **CONTRIBUTING.md** — 新增 changeset 工作流程、density system 規範、元件 checklist
- **ARCHITECTURE.md** — 全新架構文件（設計原則、目錄結構、技術決策）
- **CHANGELOG.md** — 回填 v0.1.0 ~ v0.3.0 完整變更紀錄

---

## 2026-03-10（Day 2）

### ark-harvest 反饋驅動迭代

根據 ark-harvest 專案的實際使用反饋，進行元件新增、Bug 修復、文件補充三方面的改善。

---

### 新增元件（4 個）

| 元件 | 說明 | 位置 |
|------|------|------|
| `FilterSelect` | Filter toolbar 專用 Select wrapper，內建「全部」選項、簡化 onChange | `filter-bar/FilterSelect.tsx` |
| `SegmentedControl` | 水平 pill bar，2-5 個互斥選項切換，支援 fullWidth、per-option disabled、泛型 value | `segmented-control/` |
| `InlineCode` | 統一 `<code>` 樣式，取代各處手寫 `className="rounded bg-muted px-1.5..."` | `inline-code/` |
| `PasswordInput` | Input + 眼睛 toggle，支援 controlled/uncontrolled visibility | `input/PasswordInput.tsx` |
| `CheckboxCard` | Checkbox 卡片（label + description），用於功能開關、權限勾選 | `checkbox/CheckboxCard.tsx` |

### 功能實作

**DataTable row selection（重要）：**
- 實作原本只宣告未實作的 `selectable` / `selectedRows` / `onSelectionChange` props
- Header checkbox 支援全選/取消全選/indeterminate 狀態
- Per-row checkbox，選中列高亮 `bg-primary/5`
- `stopPropagation` 避免觸發 `onRowClick`
- Selection 僅作用於當前分頁
- 可搭配 `BulkActionBar` 使用

### Bug 修復（3 個）

| 修復 | 問題 | 原因 |
|------|------|------|
| Toggle 不可點擊 | 點擊 track 不會觸發 checkbox | track 是 `<div>` 不是 `<label>` |
| Toggle 圓圈不移動 | 切換後 thumb 不動 | `peer-checked:` 只對 sibling 有效，thumb 在 label 內不是 sibling |
| Toggle Tailwind v4 class 失效 | 動態拼接 `'peer-checked:' + styles.translate` | Tailwind v4 靜態分析無法解析動態字串 |

**Toggle 最終結構：** input 放入 label 內部，用 `has-[:checked]` + `group-has-[:checked]` 取代 `peer-checked:`。

### 型別與樣式修正

- `Select` / `FilterSelect` 的 `options` 改為 `readonly SelectOption[]`，支援 `as const` 陣列
- `SearchInput` sm 高度從 `h-8` 改為 `h-9`，對齊 `FilterBarSearch`

### Storybook 文件

**新增文件（2 份 MDX）：**
- **Guides/Overlay Components** — Drawer vs Modal vs ConfirmDialog 使用時機、決策樹、Animated 版本說明
- **Guides/Skeleton Loading** — 5 個 Skeleton 變體的 props 說明、Before/After 對比、實戰組合範例

**Storybook 修復：**
- 安裝 `remark-gfm` 並配置到 `addon-docs`，修復 MDX 中 Markdown table 不渲染的問題
- `preview-head.html` 加入 `.sbdocs-content table` 樣式，覆蓋 Tailwind preflight reset

**Stories 更新：**
- `DataTable.stories` — 新增 Selectable story（checkbox + BulkActionBar 整合）
- `BulkActionBar.stories` — WithTable 改用 DataTable selectable 取代手刻 raw Table
- `TanStackTable.mdx` — 加入 DataTable 內建 selection 的 Tip block

---

### 數據總結

| 指標 | Day 1 | Day 2 | 變化 |
|------|-------|-------|------|
| 總 commits | 45 | 57 | +12 |
| 元件數量 | 56+ | 61+ | +5 |
| 測試檔案 | 39 | 45 | +6 |
| 測試案例 | 412 | 455 | +43 |
| Storybook stories | 70+ | 72+ | +2 |
| MDX 文件頁 | 7 | 9 | +2 |

### 技術棧

| 工具 | 版本/用途 |
|------|-----------|
| React | ^18 / ^19 |
| Tailwind CSS | v4 (CSS-first) |
| TypeScript | ^5.6 |
| tsup | 打包 (ESM + CJS + DTS) |
| Storybook | 10 |
| Vitest | 測試 |
| Testing Library | DOM 測試 |
| Radix UI | Popover, Tooltip, DropdownMenu |
| cmdk | CommandPalette |
| @tanstack/react-virtual | VirtualList |
| Zustand | Toast store |
| Framer Motion | 動畫（optional） |
| Changesets | 版本管理 |
| Chromatic | 視覺回歸 |
| size-limit | Bundle 監控 |
| GitLab CI/CD | 自動化 pipeline |

### 待辦 / 後續

- [ ] 設定 Chromatic project token 啟用視覺回歸
- [ ] 首次使用 changesets 發布流程驗證
- [ ] 持續補充剩餘元件的測試（目前 45/61 覆蓋）
- [ ] 效能優化：lazy import motion 元件、減少 Radix 打包體積
- [ ] CopyButton / CopyInput — 目前只 1 處使用，待第 2 個專案需要再收錄
- [ ] SegmentedControl icon + description 擴充 — 待需求明確再加
- [ ] bump version to 0.4.0
