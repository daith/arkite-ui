# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - Unreleased

### Added

- **Core Components** — Button, Input, Badge, Select, Checkbox, Radio, Toggle, Avatar, Label, Spinner
- **Layout** — AdminLayout (props-driven, framework-agnostic), Card, Container, Stack, Divider
- **Navigation** — Sidebar, TenantSwitcher (decoupled), Navbar, Breadcrumb, Tabs
- **Data Display** — DataTable (sort, paginate), StatCard/StatGroup, EmptyState, Table, VirtualList, InfiniteScroll, Calendar, Timeline, Steps
- **Form** — Form (context-based), SearchInput, FileUpload, DatePicker
- **Feedback** — Modal, Drawer, Toast (Zustand store), Alert, Progress, Skeleton
- **Overlay** — Popover, Tooltip, DropdownMenu (Radix UI), Combobox, CommandPalette (cmdk)
- **Motion** — AnimatedModal, AnimatedDrawer, AnimatedToastContainer (Framer Motion, optional)
- **Theme System** — 4 presets (Default, Neutral, Ocean, Forest), `createTheme()`, `applyTheme()`, `themeToCSS()`
- **Hooks** — usePermission, useDataFetch, useReducedMotion
- **Stores** — useAuthStore, useTenantStore, useToastStore
- **Infrastructure** — Storybook 10, ESLint 9, Vitest + Testing Library (68 tests), CI/CD pipeline
- **Tailwind Preset** — CSS Variables theming, dark mode, tailwindcss-animate
