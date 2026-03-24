# @arkite/ui 採用報告

> 最後更新：2026-03-24

## 消費端總覽

| 專案 | 用途 | 框架 | 版本 | 頁面數 | 採用檔案 | 元件數 | 健康度 |
|---|---|---|---|---|---|---|---|
| **ark-crm** | CRM 多租戶管理平台 | React | local link | 253 | 196 | 78 | ⚠️ 持續改善中 |
| **ark-harvest** | 資料採集平台 | React | 0.3.5 | 17 | 21 | 22 | ✅ 完美 |
| **ark-rendoc-web** | AI 翻譯 Dashboard | React | 0.3.5 | 14 | 18 | 20 | ✅ 完美 |
| **ark-rendoc** | Chrome 翻譯外掛 | Svelte | — | — | — | — | N/A（框架不同） |
| **ark-launch** | 拖拉式頁面編輯器 | Vanilla JS | — | — | — | — | N/A（框架不同） |

**3 個 React 專案，78 個元件/hook/util 被實際使用。**

---

## 元件覆蓋率

幾乎所有匯出都有消費端在用：

| 類別 | 採用情況 |
|---|---|
| Layout（AdminLayout、Card、Stack、Container、Divider、CollapsibleSection） | ✅ 全部 |
| Navigation（Sidebar、Navbar、Breadcrumb、Tabs、TenantSwitcher） | ✅ 全部 |
| Primitives（Button、Badge、Input、Select、Checkbox、Radio、Toggle、Switch） | ✅ 全部 |
| Data Display（DataTable、Table、StatCard、EmptyState、Calendar、Timeline） | ✅ 全部 |
| Form（Form、FormField、SearchInput、DatePicker、FileUpload、ColorPicker） | ✅ 全部 |
| Feedback（Modal、Drawer、Toast、Alert、Spinner、Skeleton、Progress） | ✅ 全部 |
| Overlay（Popover、Tooltip、DropdownMenu、Combobox、CommandPalette） | ✅ 大部分 |
| Motion（AnimatedModal、AnimatedDrawer、AnimatedToast） | ⚠️ 僅 ark-rendoc-web |

---

## 各專案詳細狀態

### ark-harvest（模範生）

| 指標 | 數值 |
|---|---|
| 採用率 | 21/17 頁面 (>100%，layout 也算) |
| 原生 `<select>` | 0 |
| Emoji icon | 0 |
| 問題 | 無 |

### ark-rendoc-web（乾淨）

| 指標 | 數值 |
|---|---|
| 採用率 | 18/14 頁面 |
| 原生 `<select>` | 0 |
| Emoji icon | 0 |
| 備註 | 早期專案，功能成長後會自然用到更多元件 |

### ark-crm（主力，持續改善中）

| 指標 | 初始 | 現在 | 趨勢 |
|---|---|---|---|
| 原生 `<select>` | 247 處 | 45 檔 | ↓ 大幅改善 |
| Emoji icon | 29 檔 | ~8 檔（功能性） | ↓ 大幅改善 |
| Badge 用 variant（正確） | 未追蹤 | 106 處 | ✅ |
| Badge 用 className（繞過） | 8 處 | 0 處 | ✅ 已清零 |
| useDeleteConfirm 採用 | 0 | 16 頁（+16 待遷移） | ↑ 進行中 |
| 重複元件 | 3 個 | 0 | ✅ 已清除 |
| 共用 formatters | 無 | ✅ 4 個 | ✅ 已建立 |
| DynamicForm 用 Select | ✗ | ✅ | ✅ 已修正 |

**已完成的改善：**
- 刪除重複元件（CollapsibleSection、ActiveBadge、StatusBadge）
- DynamicForm 改用 @arkite/ui Select
- Tenant Profile 頁面接上 Badge variant
- 共用 formatters（formatDate、formatDateTime、formatCurrency、formatTime）
- useDeleteConfirm hook 建立並推廣至 16 頁
- Emoji → Lucide icon 大規模遷移
- Badge className 硬編碼色碼歸零

**剩餘項目：**
- 原生 `<select>` 45 檔（其中 ~15 檔為 PageBuilder，可不動）
- 舊 delete pattern 26 頁（ROI 遞減，可漸進處理）
- PageBuilder 模組的 emoji（設計選擇，低優先）

---

## 元件庫結論

| 問題 | 答案 |
|---|---|
| 需要新增元件嗎？ | **不需要**，78 個匯出都有人用 |
| 需要修改 API 嗎？ | **不需要**，三個專案都順利接入 |
| 需要加新 variant 嗎？ | **不需要**，Badge 7 種 variant 已足夠 |
| 可以規劃 v1.0 了嗎？ | **可以開始**，3 個專案已驗證通用性 |
| 最大風險？ | ark-crm PageBuilder 可能不會完全採用（可接受） |
