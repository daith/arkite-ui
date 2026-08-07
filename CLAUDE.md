# CLAUDE.md

## Project
`@arkite-ui/core` — Ark 生態系共用 React 元件庫（SaaS admin panel 專用），發佈成 npm 套件。
Tailwind CSS v4 + TypeScript，tsup 打包，Storybook 文件，changesets 發版。

## ⚠️ 核心設計原則（必守）
**Pure UI only** — 不含任何業務邏輯、auth、store、權限 hook。
每個元件都必須能在不同專案間**免修改重用**；domain 邏輯留在各專案（如 `@ark-crm/auth`）。

## Commands
```bash
pnpm install
pnpm storybook     # 元件預覽 http://localhost:6006
pnpm test          # vitest（unit）
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm build         # tsup
pnpm changeset     # 有變更 → 建 changeset（發版必要）
```

## 規範
- 開發流程與貢獻規則見 `CONTRIBUTING.md`；發版用 changesets（見 `scripts/verify-changesets.sh`）。
- 前端整體規範見 `../arkite-frontend/`；生態系規範源頭見 `../arkite-bankend/`。
- 改動 public API / props 前先想向後相容，並更新 Storybook 與型別。
