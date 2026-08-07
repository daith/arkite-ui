---
"@arkite-ui/core": patch
---

1.0 audit phase 1 — bug fixes and consistency polish across 25+ components:

- **Fixed: checked indicators never rendered.** Checkbox/CheckboxCard check marks and the Radio dot used `peer-checked` styles on nested children the peer selector can't reach — a checked box changed color but never showed its mark. Dedicated Checkbox/Radio stories now pin the checked states in Chromatic.
- **i18n completed for real**: 16 new locale keys cover every remaining hardcoded string (Modal/Drawer/motion "Close", Sidebar toggle, PageHeader back, Tree/TagInput/ColorPicker/ImageUpload aria-labels, Label "(optional)", PasswordInput show/hide, ErrorBoundary fallback) — including `FilterSelect`'s reverse case, a hardcoded Chinese `'全部'` that now defaults to English and localizes via `zhTW`.
- **Overlay hardening**: Drawer and AnimatedDrawer gain the focus trap, dialog semantics, and focus restore Modal already had; AnimatedModal restores focus and accepts HTML attributes; Modal/AnimatedModal use `useId` so multiple dialogs on one page no longer collide; CommandDialog and ConfirmDialog expose `closeOnEscape`/`closeOnBackdropClick`.
- **Refs & escape hatches**: forwardRef added to RadioGroup, Tree, VirtualList/InfiniteScroll, ViewToggle, AvatarGroup, TenantSwitcher, CommandDialog, ActionButtons; TagInput's broken callback-ref handling fixed; SidebarItem's anchor branch no longer drops ref/props; StatCard's ref now points at the card element; CopyInput and SimpleTooltip accept standard attributes.
- **Semantics**: CheckboxCard gains `error`/`errorMessage`; CollapsibleSection no longer nests interactive content inside a button; Tabs aria wiring (trigger ids + panel labelling) works with multiple instances per page.
