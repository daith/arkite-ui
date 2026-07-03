# Migration Guide

## v0.6.x → v0.7.0

### Prop 命名統一（漸進式，非破壞性）

v0.7.0 統一了 prop 命名慣例（完整審查見 `docs/API_CONSISTENCY.md`）。**所有舊名稱仍可用**，但會在 dev mode 印出 deprecation 警告，並於 **v1.0 移除** —— 請在升級 v1.0 前完成以下取代：

| 元件 | 舊 | 新 |
|------|----|----|
| `Alert` / `Progress` / `CircularProgress` / `Toast` | `variant="error"` | `variant="destructive"` |
| `Alert` | `onDismiss` | `onClose` |
| `Tabs` | `onValueChange` | `onChange` |
| `LoadingOverlay` | `visible` | `open` |
| `CommandDialog` | `onOpenChange` | `onClose` |
| `CircularProgress` | `size`（number） | `diameter` |
| `FormField` / `FormMessage` | `error`（string） | `errorMessage` |
| `ImageUpload` | `error`（string） | `errorMessage`（`error` 改為 boolean 狀態旗標） |
| `Toggle`（元件名） | `Toggle` | `Switch` |

機械式取代範例（各專案可直接跑）：

```bash
# Alert variant（最大宗）
grep -rl 'variant="error"' src | xargs sed -i '' 's/<Alert variant="error"/<Alert variant="destructive"/g'
```

`toast.error(...)` 便捷方法**保留不變**（內部改為產生 destructive variant，外觀不變）。

### 新增（無需遷移）

- `errorMessage?: string`：Checkbox、Radio/RadioGroup、Combobox、DatePicker、DateRangePicker、ColorPicker、TagInput、Switch —— 對齊 Input 家族的 `error` + `errorMessage` 慣例
- `Tree.defaultCheckedKeys`（非受控勾選狀態）
- `ConfirmDialog` / `CommandDialog` 支援 `className`

---

## v0.3.x → v0.4.0

### 1. Motion 元件 import 路徑變更

動畫元件已移至獨立的 `motion` entry point，需要額外安裝 `framer-motion`。

**Before (v0.3.x):**
```tsx
import { AnimatedModal, AnimatedDrawer } from '@arkite-ui/core'
```

**After (v0.4.0+):**
```tsx
import { AnimatedModal, AnimatedDrawer, AnimatedToastContainer, useAnimatedToast } from '@arkite-ui/core/motion'
```

原因：將 framer-motion 設為 optional peer dependency，讓不需要動畫的專案不需要安裝此套件，減少 bundle size。

---

### 2. 新增 Peer Dependencies

v0.4.0 新增以下 optional peer dependencies，請依照使用的元件安裝：

| 元件 | 需要安裝的套件 |
|------|--------------|
| `CommandPalette` | `cmdk@^1.0.0` |
| `VirtualList`、`DataTable`（大資料量） | `@tanstack/react-virtual@^3.0.0` |
| `DropdownMenu` | `@radix-ui/react-dropdown-menu@^2.0.0` |
| `Popover`、`DatePicker`、`ColorPicker` 等 | `@radix-ui/react-popover@^1.0.0` |
| `Tooltip` | `@radix-ui/react-tooltip@^1.0.0` |
| `AnimatedModal`、`AnimatedDrawer`、`AnimatedToastContainer` | `framer-motion@^10 \|\| ^11 \|\| ^12` |

安裝範例：

```bash
# 安裝全部
pnpm add cmdk @tanstack/react-virtual @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-tooltip framer-motion

# 或只安裝需要的
pnpm add cmdk framer-motion
```

---

### 3. Tailwind CSS v4 必要設定

`@arkite-ui/core` 現在要求 Tailwind CSS v4。若尚未升級：

```bash
pnpm add tailwindcss@^4.0.0 @tailwindcss/vite
```

並在 `tailwind.config` 引入 preset：

```ts
// tailwind.config.ts
import arkitePreset from '@arkite-ui/core/tailwind'

export default {
  presets: [arkitePreset],
}
```

---

### 4. CSS 樣式 import

確保在應用程式入口 import 樣式：

```ts
import '@arkite-ui/core/styles.css'
```

---

## v0.2.x → v0.3.x

### Alert variant 名稱變更

`variant="destructive"` 已重新命名為 `variant="error"`，更語意化。

**Before:**
```tsx
<Alert variant="destructive">...</Alert>
```

**After:**
```tsx
<Alert variant="error">...</Alert>
```
