# Migration Guide

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
