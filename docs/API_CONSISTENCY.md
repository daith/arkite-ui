# 元件 API 一致性審查報告

> 審查日期：2026-07-02
> 審查範圍：`dist/index.d.ts`（公開 API）+ `dist/Drawer-*.d.ts`（Modal / Drawer / Toast）+ 原始碼抽查。所有 prop / 元件名以 .d.ts 實際宣告為準。
> 對應 ROADMAP Phase 2「元件 API 一致性審查」；rename 執行歸入 v0.7.0 breaking 清理。
> **消費端實測影響面見 [API_CONSISTENCY_IMPACT.md](API_CONSISTENCY_IMPACT.md)**（2026-07-03，7 專案 384 檔）：P0-1 Alert variant 175 筆為最大宗；LoadingOverlay/CircularProgress/Tree 等項全數 0 用例可直接定版。

## 總體結論

整體一致性**中等偏上**。做得好、直接維持的部分：

- **布林狀態 prop 全庫統一無 `is` 前綴**（`disabled` / `loading` / `open` / `active`，公開 API 沒有任何 `isDisabled` / `isLoading` / `isOpen`）
- `size` 基本圍繞 `sm/md/lg` 展開，刻度命名一致（無 `small/medium` 混用）
- Radix 包裝元件族內部一致（`onOpenChange` / `onValueChange` 遵循 Radix 慣例，無需改動）

但有 **4 類會影響 v1.0 API 穩定性的真實不一致**，必須在 v1.0 前定版：

1. **`variant` 的「危險/負面」語義分裂成 `destructive` 與 `error` 兩派**（跨自建元件，非 Radix 藉口可解釋）
2. **`error` prop 型別衝突**：多數是 `boolean`（配 `errorMessage`），少數是 `string`（本身即訊息）
3. **自建取值型元件的變更回呼命名分裂**：多數 `onChange(value)`，但 `Tabs` 獨用 `onValueChange`
4. **可關閉元件的關閉回呼三種寫法並存**：`onClose` / `onDismiss` / `onOpenChange`，自建對話框族內就不一致

---

## 1. 變更回呼（Change Handlers）

### 自建元件（非 Radix 包裝）

| 模式 | 元件 |
|---|---|
| `onChange: (value) => void`（原始值，非 event） | `ViewToggle`(mode)、`SegmentedControl`、`RadioGroup`、`Combobox`(string\|string[])、`NumberInput`(number\|null)、`TagInput`(string[])、`ColorPicker`、`DatePicker`(Date\|null)、`FileUpload`/`FileUploadButton`/`ImageUpload`(File[])、`FilterSelect`、`FilterBarSearch` |
| `onChange`（原生 React event） | `Input`、`Select`、`Checkbox`、`CheckboxCard`、`Radio`、`Toggle`/`Switch`、`Textarea`（均 extends `*HTMLAttributes`） |
| `onValueChange: (value) => void` | ⚠️ `Tabs`（自建元件卻借用 Radix 命名） |
| `onSelect: (item) => void` | `Calendar`(Date)、`Tree`(key,node)、`TenantSwitcher`(tenant) |
| 專用命名 | `PasswordInput.onVisibleChange`、`Sidebar.onCollapsedChange`、`CollapsibleSection.onOpenChange`、`Tree.onExpandChange`/`onCheckChange`、`Calendar.onMonthChange`、`Pagination.onPageChange`/`onPageSizeChange`、`DataTable.onSelectionChange`/`onFilterChange`、`DateRangePicker.onStartChange`/`onEndChange`、`SearchInput.onDebouncedChange` |

⚠️ Outlier：

- **`Tabs.onValueChange`** 是自建元件裡唯一用 `onValueChange` 的單值選擇器。同類的 `SegmentedControl` / `ViewToggle` / `RadioGroup` 全用 `onChange(value)`。
- 同為「原始值回呼」，一部分叫 `onChange`、一部分叫 `onSelect`（`Calendar`、`TenantSwitcher`）、一部分叫 `onValueChange`（`Tabs`）——三者做的是同一件事。

### Radix 包裝元件（維持現狀）

`Popover`/`Tooltip`/`DropdownMenu` 透傳 Radix 的 `onOpenChange`；`Command`/`CommandInput` 透傳 cmdk 的 `onValueChange`；`CommandItem.onSelect(value)`。族內一致，**無需改動**。

---

## 2. 受控 / 非受控配對

| 模式 | 元件 |
|---|---|
| `value` + `defaultValue`（完整） | `RadioGroup`、`Tabs`、`NumberInput`、`Command` |
| 僅 `value`（受控-only） | `SegmentedControl`、`ViewToggle`、`Combobox`、`DatePicker`、`ColorPicker`、`TagInput`、`FileUpload`、`Calendar`、`FilterSelect`、`FilterBarSearch` |
| `open` + `defaultOpen` + `onOpenChange`（完整） | `CollapsibleSection` |
| `collapsed` + `defaultCollapsed` + `onCollapsedChange`（完整） | `Sidebar` |
| `open` + `onClose`（受控-only） | `Modal`、`Drawer`、`ConfirmDialog` |
| `open` + `onOpenChange`（受控-only） | `CommandDialog` |
| `expandedKeys`/`defaultExpandedKeys` 完整，但 `checkedKeys` 缺 `defaultCheckedKeys` | ⚠️ `Tree`（同元件內兩套狀態處理不一致） |
| `checked` + `defaultChecked`（原生繼承） | `Checkbox`、`Radio`、`Toggle`/`Switch`、`CheckboxCard` |

對話框類無 `defaultOpen` 屬可接受（對話框通常受控），優先級低。

---

## 3. Size Prop

| union | 元件 |
|---|---|
| `sm \| md \| lg` | `Input`、`Select`、`Checkbox`、`Radio`、`Toggle`、`Textarea`、`NumberInput`、`TagInput`、`SearchInput`、`Combobox`、`SegmentedControl`、`DatePicker`、`DateRangePicker`、`ColorPicker`、`CopyInput`、`Spinner`、`LoadingOverlay`、`EmptyState`、`Progress`、`SkeletonText.spacing` |
| `sm \| md \| lg \| icon` | `Button`、`CopyButton`（`ButtonSize`） |
| `sm \| md` | `ViewToggle`、`Badge`、`Kbd`、`Steps`、`Timeline`、`ActionButtons` |
| `xs \| sm \| md \| lg` | `StatusDot` |
| `sm \| md \| lg \| xl` | ⚠️ `SkeletonAvatar`（與 `Avatar` 的 `xs…2xl` 不對齊，骨架屏無法精確匹配所有頭像尺寸） |
| `xs \| sm \| md \| lg \| xl \| 2xl` | `Avatar` |
| `sm…full` | `Container`（至 `2xl`）、`Modal`（至 `4xl`，`ConfirmDialog` 複用）、`Drawer`（至 `6xl`） |
| **`number`（像素）** | ⚠️ `CircularProgress`（`size?: number`） |

刻度命名一致，差異主要是範圍不同，多數可接受。最易踩坑的是 **`CircularProgress.size` 是 `number`（直徑 px），而 `Progress.size` 是 `sm/md/lg`** —— 同名 prop 在姐妹元件裡型別不同。

---

## 4. Variant Prop

| variant union | 元件 |
|---|---|
| `primary \| secondary \| outline \| ghost \| destructive \| gradient` | `Button`（`CopyButton`、`ActionButtons` 複用） |
| `default \| secondary \| success \| warning \| destructive \| outline \| info` | `Badge` |
| `default \| primary \| success \| warning \| destructive` | `Timeline`(item) |
| `default \| destructive \| warning` | `ConfirmDialog` |
| `info \| success \| warning \| error` | ⚠️ `Alert` |
| `default \| success \| warning \| error` | ⚠️ `Progress`/`CircularProgress` |
| `default \| success \| error \| warning \| info` | ⚠️ `Toast`/`ToastItem` |
| `default \| search \| error \| no-data` | `EmptyState`（此處 `error` 表「錯誤態」，語義可接受） |
| 形態類（無衝突） | `StatCard`(bordered/filled)、`Avatar`(circle/rounded/square)、`Skeleton`、`Table`(striped)、`Tabs`(pills/underline)、`DateRangePicker`(input/calendar) |
| `destructive?: boolean` | `DropdownMenuItem` |

⚠️ **核心 outlier —— 「危險/負面」語義命名分裂**：

- **`destructive` 派**：`Button`、`Badge`、`Timeline`、`ConfirmDialog`、`ActionItem`、`DropdownMenuItem`
- **`error` 派**：`Alert`、`Progress`/`CircularProgress`、`Toast`

另：`secondary` 與 `outline` 在 `Button`、`Badge` 中並存且含義區分清楚，**一致、無需改**。

---

## 5. 布林狀態 Prop

| 概念 | 全庫命名 | 結論 |
|---|---|---|
| 禁用 | `disabled` | ✅ 一致，無 `isDisabled` |
| 載入 | `loading`（`InfiniteScroll` 另有 `loadingMore`；`ImageUpload` 用 `loadingUrls`） | ✅ 一致，無 `isLoading` |
| 開啟 | `open` | ✅ 一致，無 `isOpen` |
| 啟用中 | `active`（`SidebarItem`、`NavbarItem`、`NavbarLink`） | ✅ 一致 |
| 顯示 | ⚠️ `LoadingOverlay.visible` | 語義同 `open` 卻用 `visible`（`PasswordInput.visible` 表「明文可見」，語義特殊可保留） |

這一類是全庫做得最好的部分，唯一問題是 `visible` vs `open`。

---

## 6. 雜項

### 6a. `className` 缺失

絕大多數元件都支援 `className`。⚠️ 手寫介面漏掉的：**`ConfirmDialog`**、**`CommandDialog`**。

### 6b. 表單控件的 `label` / `description` / `error`

| prop 組合 | 元件 |
|---|---|
| `label` + `description` + `error: boolean` | `Checkbox`、`Radio` |
| `label` + `description`，無 `error` | ⚠️ `Toggle`/`Switch`、`CheckboxCard` |
| `error: boolean` + `errorMessage: string` | `Input`、`Select`、`Textarea`、`NumberInput` |
| `error: boolean`（僅布林，無 errorMessage） | `Checkbox`、`Radio`、`RadioGroup`、`Combobox`、`DatePicker`、`DateRangePicker`、`ColorPicker`、`TagInput` |
| **`error: string`（本身即訊息）** | ⚠️ `ImageUpload`、`FormField`、`FormMessage` |

⚠️ **核心 outlier —— `error` 型別衝突**：同名 `error` 在 `Input`/`Checkbox`/`Combobox` 等是 `boolean`，在 `ImageUpload`/`FormField`/`FormMessage` 是 `string`。開發者跨控件無法憑直覺複用同一變數。

### 6c. 可關閉元件的關閉回呼

| 模式 | 元件 |
|---|---|
| `onClose` | `Modal`、`Drawer`、`ConfirmDialog`、`BulkActionBar`、`Toast` |
| `onDismiss` | ⚠️ `Alert`（`dismissible` + `onDismiss`） |
| `onOpenChange(false)` | ⚠️ `CommandDialog`（自建，卻與 Modal 族不同）、`CollapsibleSection`、Radix 系 |

### 6d. 元件名重複：`Switch` = `Toggle`

`Switch` 是 `Toggle` 的純別名（`src/components/switch/Switch.tsx` 直接 `export { Toggle as Switch }`）。同一元件對外兩個名字，v1.0 前應決定規範名。

---

## 優先級修復建議（v0.7.0 breaking 清理）

### P0 —— 破壞性、影響面最大，務必定版

1. **統一「危險/負面」variant 值 → 定為 `destructive`**（與 Button/shadcn 生態一致；反向選 `error` 要改 Button/Badge/Timeline/ConfirmDialog，改動面更大）
   - 需改：`Alert`、`Progress`/`CircularProgress`、`Toast`/`ToastItem` 的 `error` → `destructive`
   - `EmptyState` 的 `error` 表「錯誤態」而非顏色，可保留
2. **消除 `error` prop 的 boolean/string 型別衝突**
   - 規範：`error: boolean`（狀態）+ `errorMessage?: string`（文案）
   - 需改：`ImageUpload`（拆為 `error`+`errorMessage`）；`FormField`/`FormMessage` 改名為 `errorMessage`
   - 為 `Combobox`/`DatePicker`/`TagInput`/`ColorPicker`/`Radio`/`Checkbox` 補 `errorMessage` 對齊 `Input` 家族
3. **統一自建單值選擇器的變更回呼 → `onChange(value)`**
   - 需改：`Tabs.onValueChange` → `onChange`
   - Radix 包裝元件（Popover/Command 等）保留原命名不動

### P1 —— 一致性與開發體驗

4. **統一自建可關閉元件的關閉回呼 → `onClose`**：`CommandDialog.onOpenChange` → `onClose`；`Alert.onDismiss` → `onClose`
5. **補 `className`**：`ConfirmDialog`、`CommandDialog`
6. **`LoadingOverlay.visible` → `open`**（`PasswordInput.visible` 保留）

### P2 —— 收尾打磨

7. **`CircularProgress.size`** 改名為 `diameter`（把 `size` 讓給枚舉，保持同名同型）
8. **`Switch`/`Toggle` 二選一**：建議保留 `Switch` 作對外規範名，`Toggle` 標記 deprecated
9. **`Tree` 補 `defaultCheckedKeys`**
10. **`Toggle`/`Switch` 補 `error`**（可選，對齊表單控件三件套）
