---
'@arkite-ui/core': minor
---

Prop-naming consistency cleanup (see docs/API_CONSISTENCY.md). All old names keep working as deprecated aliases with a dev-mode console warning — they will be removed in v1.0, so this release is **non-breaking**; migrate at your own pace.

Renames (old → new):

- `Alert` / `Progress` / `CircularProgress` / `Toast`: `variant="error"` → `variant="destructive"` (the `toast.error()` convenience method stays and now produces the destructive variant)
- `Alert`: `onDismiss` → `onClose`
- `Tabs`: `onValueChange` → `onChange`
- `LoadingOverlay`: `visible` → `open`
- `CommandDialog`: `onOpenChange` → `onClose`
- `CircularProgress`: `size` (number) → `diameter`
- `FormField` / `FormMessage`: `error` (string) → `errorMessage`
- `ImageUpload`: `error` (string) → `errorMessage` (+ `error` now also accepts a boolean state flag)
- `Toggle` component name → prefer `Switch` (Toggle export is deprecated)

Additions (non-breaking):

- `errorMessage?: string` on Checkbox, Radio/RadioGroup, Combobox, DatePicker, DateRangePicker, ColorPicker, TagInput, Toggle/Switch — aligned with the Input family's `error` + `errorMessage` convention
- `Toggle`/`Switch`: `error?: boolean` state flag
- `Tree`: `defaultCheckedKeys` (uncontrolled checked state)
- `className` on ConfirmDialog and CommandDialog
