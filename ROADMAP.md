# Roadmap — Arkite UI

> **定位：自己的專案用得爽，順便放出去。**
>
> 不主動推廣、不經營社群、不追 star。品質自然會說話，
> 有人用就回應，沒人用也不影響我們自己開發。

---

## 現況快照（2026-07-02）

| 指標 | 數據 |
|------|------|
| 版本 | v0.5.0（2026-04-22 以 `@arkite-ui/core` 發布 npm，0.6.0 changeset 待發） |
| 元件數 | 67 個目錄 |
| 測試 | 74 檔、834 cases、100% 通過 |
| Stories | 75 檔、100% 元件覆蓋 |
| a11y | 零 violation（WCAG AA，2026-03-24 審查） |
| Bundle | < 300 KB（size-limit 監控） |
| 消費端 | 9 個專案安裝（ark-crm、ark-harvest、ark-rendoc-web、ark-shield、ark-crew、ark-connect、ark-finance、chronoark-one 等） |

> 完整採用數據見 [docs/ADOPTION_REPORT.md](docs/ADOPTION_REPORT.md)（2026-03-24 時點）

---

## 經營策略：佛系開源

### 為什麼開源？

- **自己跨專案共用**才是主因（ark-crm、ark-harvest、ark-rendoc-web）
- 放在 npm 上自己裝也方便，順便公開而已
- 如果真的有外部使用者，代表元件品質夠好 — 正向循環

### 不做的事

- 不經營 Discord / Slack 社群
- 不寫推廣文章、不投稿技術媒體
- 不做 YouTube / live coding
- 不主動找人貢獻
- 不為了外部需求犧牲內部開發節奏

### 怎樣自然擴散

```
自己專案用 → Storybook 站台公開 → npm 能搜到 → 有人試用
                                                    ↓
                          README 夠清楚 ← 有人提 Issue ← 覺得好用
                                ↓
                          自然口碑（自己都不用推）
```

**關鍵槓桿點：讓「找到 → 試用 → 跑起來」這條路零摩擦。**

---

## Phase 1：放上去（v0.4.0） — ✅ 完成（2026-07-02 對齊）

> 花最少力氣，讓套件在 npm 上能被找到、裝起來能跑。

### 必做（直接受益自己專案）

- [x] 修正 `package.json` metadata（author、description 移除 shadcn/ui）
- [x] 補 `MIGRATION.md` — motion import 路徑 + Radix peer deps 變更
- [x] Chromatic token 設好，CI 視覺回歸跑通（`.gitlab-ci.yml` chromatic job，MR + main 觸發）
- [x] Changesets 首次發布驗證，確認 npm publish 流程正確
- [x] bump v0.4.0 → 後續以 `@arkite-ui/core@0.5.0` 發布 npm public（2026-04-22）

### 順手做（10 分鐘內搞定的事）

- [x] `LICENSE` 確認 copyright 年份 + 組織名稱正確（2026-07-02 修正年份 2024 → 2026）
- [x] `package.json` keywords 補 `radix-ui`、`design-system`（2026-07-02）
- [x] README 頂部加一行 npm badge（`npm version`、`bundle size`）（2026-07-02）

### 不急（有人問再說）

- CODE_OF_CONDUCT、SECURITY.md — 真的有外部貢獻者再補
- Issue / PR template — 自己團隊不需要模板

---

## Phase 2：內部品質鞏固（v0.5.x — 進行中）

> 多個專案都在用了，重點是穩固 API、確保不出事。

### 必做

- [x] Chromatic 視覺回歸常態化 — 每個 MR 跑 snapshot（⚠️ 目前 `--exit-zero-on-changes`，有差異不會擋 merge，要擋需移除該 flag）
- [ ] Dark mode 全元件走查 — 確認所有元件在 dark mode 下正確顯示
- [x] 元件 API 一致性審查 — 審查報告見 [docs/API_CONSISTENCY.md](docs/API_CONSISTENCY.md)（2026-07-02）；rename 執行歸入 Phase 3 breaking 清理
- [ ] React 19 驗證 — peer deps 已支援 `^19.0.0`，需實際驗證
- [x] 移除業務邏輯滲入 — 刪除 authStore/tenantStore/usePermission/useDataFetch/breadcrumb config（2026-07-02，0.6.0 changeset）

### 值得做但不急

- [ ] Bundle size regression 顯示在 MR comment（CI job 已有 size-limit）
- [x] Storybook 部署到公開 URL（GitHub Pages：daith.github.io/arkite-ui）
- [ ] README 的 Quick Start 確保 copy-paste 就能跑（新專案開局時驗證）

### 不做

- Starter template repo（`create-arkite-app`）— 維護成本 > 收益
- TypeDoc API reference 站台 — Storybook autodocs + JSDoc 已經夠用
- 獨立文件站 — Storybook 就是文件站（docs/ 有 Fumadocs 骨架，需求驅動再啟用）

---

## Phase 3：v1.0.0 準備

> 前提條件已達成：3 個專案穩定使用。剩餘條件：API 穩定半年無 breaking change。

### 發版前必須完成

- [ ] API 穩定宣告 — 標記哪些元件 API 已凍結、哪些仍 experimental
- [ ] Breaking change 一次性清理 — props 命名、event handler 風格統一
- [ ] MIGRATION.md 完善 — v0.x → v1.0 升級指南
- [ ] 所有消費端升級驗證 — ark-crm、ark-harvest、ark-rendoc-web 全部跑通

### v1.0.0 什麼時候發？

**3 個專案已穩定使用 ✅，等 API 半年沒有 breaking change 即可。**

預估時間線：
- v0.4.0 發布後開始計算 API 穩定期
- 最快 2026 Q4，不趕

---

## Phase 4：如果真的有人用了

> 以下是「被動觸發」的事項 — 不主動規劃，出現訊號時再做。

| 訊號 | 動作 |
|------|------|
| 有人開 Issue 問怎麼用 | 把回答整理進 README FAQ |
| 有人提 PR | 寫個簡單的 CONTRIBUTING 引導（已有），review 合進去 |
| 累計 5+ 外部 Issue | 補 Issue template（bug / feature request） |
| 有人問能不能商用 | 確認 LICENSE (MIT) 夠清楚，README 加一行說明 |
| npm 週下載 > 100 | 考慮補 SECURITY.md、CODE_OF_CONDUCT |
| 有公司正式採用 | 考慮寫一篇 blog post 或 case study |
| 有人要求 Figma 同步 | 評估投入產出比，可能只給 design token JSON |

---

## 版本規劃

| 版本 | 觸發條件 | 內容 |
|------|---------|------|
| **v0.4.0** ✅ | — | metadata 修正 + Chromatic CI + tokens entry point |
| **v0.5.0** ✅ | 2026-04-22 | 改名 `@arkite-ui/core` 發布 npm、rail sidebar、subNav slot |
| **v0.6.0** | changeset 已備 | 移除業務邏輯（breadcrumb config、stores、hooks）— breaking |
| **v0.7.0** | API 審查後 | prop naming 統一（依 docs/API_CONSISTENCY.md）— breaking 一次清完 |
| **v0.x.x** | 內部專案需求驅動 | 持續迭代，不設時間表 |
| **v1.0.0** | API 穩定半年 + 消費端驗證 | API 凍結、semver 承諾（最快 2026 Q4） |

---

## 不需要做的事（已驗證）

基於 3 個消費端的實際採用審查（2026-03-24），以下確認不需要：

- **不需要加新元件** — 78 個匯出全被使用，覆蓋所有 SaaS admin 場景
- **不需要加新 Badge variant** — 7 種 variant 足夠覆蓋所有狀態
- **不需要 i18n 方案** — 文字由消費端 props/children 傳入
- **不需要 form state 管理** — layout-only 設計已驗證正確
- **不需要 page-level template** — ListPageTemplate/FormPageTemplate 屬於專案層
- **不需要 formatDate/formatCurrency** — locale 格式是專案層設定

---

## 最小維護清單（每次發版）

做完這 5 件事就可以 publish，不需要更多：

1. `npm test` 全過
2. `npm run build` 成功
3. `npm run size` 沒超標
4. CHANGELOG 有更新
5. Changesets 走完流程

就這樣。其他的都是錦上添花。
