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

### 數據總結

| 指標 | 數值 |
|------|------|
| 總 commits | 45 |
| 元件數量 | 56+ |
| 測試檔案 | 39 |
| 測試案例 | 412 |
| Bundle size (brotli) | ~36 KB |
| Storybook stories | 70+ |
| MDX 文件頁 | 7 |
| GitLab Issues 處理 | 9/9 (100%) |

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
- [ ] 考慮新增元件：Breadcrumb 增強、CommandPalette 快捷鍵綁定
- [ ] 持續補充剩餘元件的測試（目前 71% 覆蓋）
- [ ] 效能優化：lazy import motion 元件、減少 Radix 打包體積
