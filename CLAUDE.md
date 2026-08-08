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

## 發版與同步流程（團隊共識，必守）
完整版見 `CONTRIBUTING.md` §Release & Sync Process，重點：
1. **同步在發版前完成**：每個改動同一 MR 內附測試 + Storybook story + DESIGN.md（若影響選型規則）+ changeset；llms.txt 與 API snapshot 由 build/release 自動產生，勿手改。
2. **改動以 consumer 證據驅動**：來源是 grep 稽核、lint 豁免聚類、消費端反饋文件；問題修在上游，不在下游寫 workaround；CHANGELOG 記「本版退役了哪些 workaround」。
3. **發版一律 `pnpm release:cut`**：tag pipeline 發 npm，腳本同步 GitHub 鏡像（Pages 重佈）；絕不手動 npm publish。
4. **starter 金絲雀是發版必經步驟**：發版後 arkite-admin-starter 立即 bump + build + redeploy starter.foson.co，金絲雀綠了發版才算完成。
5. **對外連結一律 GitHub / ui.foson.co**，絕不指 GitLab。
