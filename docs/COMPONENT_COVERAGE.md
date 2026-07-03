# 元件覆蓋率與自建元件收編審查

> 審查日期：2026-07-03（v0.7.0 時點）
> 範圍：7 個 `@arkite-ui/core` 消費端（ark-crm、ark-connect web+app、ark-finance、ark-shield、ark-harvest、ark-museum web+field）；自建元件盤點另含 ark-rendoc-web（用舊 `@arkite/ui`）。依指示排除 ark-crew。
> 計數以「import 來源為 `@arkite-ui/core(/motion)` 的去重檔案數」為準，經交叉驗證。

## Part 1 — 元件使用覆蓋率

### 總覽

| 專案 | 相異元件數 / 171 | 覆蓋率 |
|---|---|---|
| ark-crm | **90** | 52.6% |
| ark-harvest/web | **72** | 42.1% |
| ark-museum/apps/web | **42** | 24.6% |
| ark-shield/web | **26** | 15.2% |
| ark-connect | **19** | 11.1% |
| ark-museum/apps/field | **16** | 9.4% |
| ark-finance/frontend | **15** | 8.8% |

- **聯集使用 112 / 171（65.5%）**；59 個匯出無任何專案直接 import。
- `Tabs` 家族是**唯一遍及全部 7 個專案**的元件系列；檔案數最大宗為 `Button`(211)、`Card`(173)、`Alert`(166)、`PageHeader`(163)、`Spinner`(149)。

### 零使用的 59 個匯出（分三類）

**A. Compound 子元件（31 個）— 父元件有人用，子件經父元件間接渲染，非真閒置**
Breadcrumb 子件 ×7、DropdownMenu 子件 ×10、Popover 子件 ×2（Anchor/Close）、Table 子件 ×2（Caption/Footer）、原生 Tooltip 三件組（實際都用 `SimpleTooltip`）、Skeleton 子件 ×2（Avatar/Text）、Navbar 子件 ×4、FilterBarActions。

**B. 命令面板整組（9 個）— 功能區塊零採用**
`Command` `CommandDialog` `CommandEmpty` `CommandGroup` `CommandInput` `CommandItem` `CommandList` `CommandSeparator` `CommandShortcut`（含 `useCommandPalette` hook 也是 0）。

**C. 獨立元件零使用（19 個）**
`ActionButtons` `AvatarGroup` `Calendar` `CircularProgress` `CollapsibleSection` `Container` `ErrorBoundary` `Form`(root) `HStack` `VStack` `InfiniteScroll` `LoadingOverlay` `NoData` `NoResults` `StatusDot` `Timeline` `Toast`(原生) `Tree` `VirtualList`

### 其他零採用的功能區

- **`/motion` entry point 全零**：AnimatedModal / AnimatedDrawer / AnimatedToastContainer / useAnimatedToast 沒有任何專案 import。
- **主題 API 全零**：`createTheme` / `applyTheme` / `themePresets` 無消費端使用（各專案用預設主題）。
- **Toast 兩派用法**：crm/harvest 走 `useToast` + `ToastContainer`；connect/finance/museum/shield 走 imperative `toast` + `ImperativeToastContainer`。

### 僅單一專案使用（41 個，節錄）

- 僅 ark-crm（21）：`CardField`(9) `ViewToggle`(9) `DescriptionList`(5) `DateRangePicker`(5) `RadioGroup`(5) `TagInput`(3) `BulkActionBar` `ColorPicker` `Kbd` `Popover` 家族等
- 僅 ark-harvest（16）：`Stack`(17) `Drawer` 子件(13) 及**整組 `Sidebar*`/`Navbar*` 導覽系列**
- 其餘：`Stat`(shield)、`NumberInput`(museum-web)、`ModalHeader`(finance)、`Radio`(shield)

## Part 2 — 消費端自建元件盤點

### 總體結論

**沒有「純 UI 且被 2+ 專案各自重造」的元件** —— 基礎 UI 已成功收斂到 core（ark-shield 甚至 0 自建）。真正跨專案重複的是 **route guard 類**（AuthGuard ×4、RoleGuard ×2），但它們 router+auth 硬耦合，不屬於 UI 庫。

### 各專案自建概況

| 專案 | 自建數 | 重複造輪子 (A) | 通用候選 (C) | 業務元件 (D) |
|---|---|---|---|---|
| ark-crm | ~20+ | ErrorBoundary×3、DynamicForm、PageBuilder blocks | — | cms/PageBuilder 業務 block 群 |
| ark-connect web/app | 8 | — | Turnstile、AlertProvider(RN) | Header/Footer/DestinationCard/PhoneVerification 等 |
| ark-finance | 47 | **PageHeader、WidgetCard** | **Sparkline、MarkdownView** | quant/dashboard/news/watchlist ~43 個 |
| ark-shield | **0** | — | — | — |
| ark-harvest | 5 | — | — | wizard/panel/item cards |
| ark-museum web/field | 22 | TabCount(≈Badge)、BusyOverlay(≈LoadingOverlay) | **SheetSelect**、SettingsNav、BottomNav | collection/batch/institution 群 |
| ark-rendoc-web | 1 | FetchError(≈ErrorState；因仍用舊套件) | — | — |

### A 類 —— 重造的原因就是 core 的功能缺口

| 本地元件 | 對應 core | 缺口（重造原因） |
|---|---|---|
| finance/PageHeader | `PageHeader` | 缺 `size: sm/md/lg`、title 旁 inline `badge` slot |
| finance/WidgetCard | `Card` | 缺 dense/compact 變體、header 多 action icon |
| museum-field/BusyOverlay | `LoadingOverlay` | 缺 fullscreen 變體（fixed + backdrop-blur） |
| museum-web/TabCount | `Badge` | 缺中性灰 count-pill variant |
| crm/ErrorBoundary ×3 | `ErrorBoundary` | 無缺口，未採用 core 版 → 直接改用 |
| rendoc/FetchError | `ErrorState` | 無缺口，卡在舊套件未遷移 |

## 守門人裁決（Prioritized）

> **✅ 2026-07-03 已實作**：下方「收編」與「補強」全部項目已進 core（Sparkline、SheetSelect、Badge `count` variant、PageHeader `size`、Card `density`+`CardHeader.actions`、LoadingOverlay `fullscreen`）。後續動作：通知 finance/museum 改用 core 版並刪除本地自建。

### ✅ 收編（進 core）

1. **Sparkline**（finance）— 純 SVG ~20 行、零依賴、props 完備；SaaS admin dashboard 是本庫定位核心，與 Stat/StatCard 天然互補。成本極低。
2. **SheetSelect**（museum-field）— 建構於 core `Drawer` 的行動端 bottom-sheet 選單，補 core 行動端空缺；收編時泛化為 `Select` 的 mobile 變體或獨立 `SheetSelect`。
3. **TabCount → 不新開元件，擴 `Badge` 加 count/neutral variant**（避免過度特化，符合「用通用 Badge」原則）。

### 🔧 補強既有元件（不新增 export）

4. `PageHeader` 補 `size` + `badge` slot；`Card` 補 dense 變體 + header actions；`LoadingOverlay` 補 fullscreen —— 完成後推動 finance/museum 移除自建版。

### ⏸ 暫緩（守 2+ 專案原則）

5. **MarkdownView** — 通用但會帶入 `react-markdown` 依賴鏈；目前僅 finance 用。等第二個專案有需求時以 `@arkite-ui/core/markdown` 可選子路徑收編（比照 motion 模式）。

### ❌ 不收編

- **AuthGuard/RoleGuard/TenantGuard**（4 專案重複）— router+auth 耦合，屬 headless 邏輯，建議另立 `@arkite/auth` 收斂，不進 UI 庫。
- **Turnstile**（vendor 整合）、**AlertProvider/BottomNav**（React Native，平台不同）、**所有 domain 卡片/精靈/面板**（業務元件，留專案）。

### 對 v1.0 API 凍結的建議

零採用的三大功能區（**Command 家族、motion entry、theme API**）與 C 類 19 個零使用元件：**不刪除，但在 v1.0 的 API 穩定宣告中標記為 experimental（不凍結）**，避免為沒人用的 API 背上 semver 承諾。若到 v1.0 前仍零採用，屆時再決定去留。
