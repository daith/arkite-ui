# Roadmap — Arkite UI

> **定位：自己的專案用得爽，順便放出去。**
>
> 不主動推廣、不經營社群、不追 star。品質自然會說話，
> 有人用就回應，沒人用也不影響我們自己開發。

---

## 經營策略：佛系開源

### 為什麼開源？

- **自己跨專案共用**才是主因（ark-harvest、未來新專案）
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

## Phase 1：放上去（v0.4.0）

> 花最少力氣，讓套件在 npm 上能被找到、裝起來能跑。

### 必做（直接受益自己專案）

- [ ] 修正 `package.json` metadata（author、description 移除 shadcn/ui）
- [ ] 補 `MIGRATION.md` — motion import 路徑 + Radix peer deps 變更
- [ ] Chromatic token 設好，CI 視覺回歸跑通
- [ ] Changesets 首次發布驗證，確認 npm publish 流程正確
- [ ] bump v0.4.0，npm publish public

### 順手做（10 分鐘內搞定的事）

- [ ] `LICENSE` 確認 copyright 年份 + 組織名稱正確
- [ ] `package.json` keywords 補 `radix-ui`、`design-system`
- [ ] README 頂部加一行 npm badge（`npm version`、`bundle size`）

### 不急（有人問再說）

- CODE_OF_CONDUCT、SECURITY.md — 真的有外部貢獻者再補
- Issue / PR template — 自己團隊不需要模板

---

## Phase 2：讓人跑得起來（v0.5.0）

> 如果有外部使用者，最常卡關的地方是「裝好了但不知道怎麼設定 Tailwind / Theme」。

### 被動觸發做

- [ ] Storybook 部署到公開 URL（GitLab Pages 或 Vercel，CI 已有 job）
- [ ] README 的 Quick Start 確保 copy-paste 就能跑（自己新專案開局時驗證）
- [ ] 有第 2 個外部使用者問同樣的問題 → 補 FAQ section

### 有空再做

- [ ] StackBlitz 一鍵範本 — 其實就是一個 `package.json` + `App.tsx`，花 30 分鐘
- [ ] Storybook 每個元件頁加上 code snippet 可複製

### 不做

- Starter template repo（`create-arkite-app`）— 維護成本 > 收益
- TypeDoc API reference 站台 — Storybook autodocs + JSDoc 已經夠用
- 獨立文件站 — Storybook 就是文件站

---

## Phase 3：內部品質持續提升（跟版本走）

> 這些不是為了開源做的，是自己專案需要所以做。做了順便受益開源。

### 隨專案需求自然發生

- [ ] 新元件收錄 — 第 2 個專案用到就收（gatekeeper 標準不變）
- [ ] a11y 改善 — 被自己 QA 或用戶回報時修
- [ ] React 19 驗證 — 等自己專案要升級時一起處理
- [ ] SSR / Next.js 驗證 — 等自己專案用 Next.js 時驗證

### 值得做但不急

- [ ] Bundle size regression 顯示在 MR comment（CI job 已有 size-limit）
- [ ] Dark mode 全元件走查一次
- [ ] 元件 API 一致性審查（prop naming convention 統一）

### v1.0.0 什麼時候發？

**等自己至少 3 個專案穩定使用、API 半年沒有 breaking change 的時候。**
不為了「看起來成熟」而提前發 1.0，0.x 反而給自己更多彈性。

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

## 佛系版本規劃

| 版本 | 觸發條件 | 內容 |
|------|---------|------|
| **v0.4.0** | 現在 | metadata 修正 + motion 拆分 + npm publish |
| **v0.5.0** | 下一個內部專案開局 | Quick Start 驗證 + 新專案需要的元件 |
| **v0.x.x** | 內部專案需求驅動 | 持續迭代，不設時間表 |
| **v1.0.0** | 3+ 專案穩定用、API 穩定半年 | API 凍結、semver 承諾 |

---

## 最小維護清單（每次發版）

做完這 5 件事就可以 publish，不需要更多：

1. `npm test` 全過
2. `npm run build` 成功
3. `npm run size` 沒超標
4. CHANGELOG 有更新
5. Changesets 走完流程

就這樣。其他的都是錦上添花。
