# Prop Rename 遷移影響審查（消費端實測）

> 稽核日期：2026-07-03
> 依據：[API_CONSISTENCY.md](API_CONSISTENCY.md) 的 v0.7.0 breaking 清理計畫（P0/P1/P2）
> 統計原則：僅計入「該 prop 所屬元件確實 import 自 `@arkite-ui/core`」的用例；同名 local 元件不計。所有數字經 import 驗證，非估算。

## 摘要表（8 項變更 × 7 個 consumer 專案）

| # | 變更項目 | ark-crm | ark-connect | ark-finance | ark-shield | ark-harvest | ark-museum/web | ark-museum/field | 合計 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| P0-1 | `variant="error"` → `destructive`（Alert/Progress/CircularProgress/Toast） | 145 | 8 | 0 | 6 | 6 | 9 | 1 | **175** |
| P0-2 | `error`(string) → `errorMessage`（ImageUpload/FormField/FormMessage） | 0 | 0 | 0 | 0 | 39 | 0 | 0 | **39** |
| P0-3 | `<Tabs onValueChange>` → `onChange` | 17 | 3 | 0 | 0 | 1 | 0 | 0 | **21** |
| P1-4 | `CommandDialog onOpenChange`→`onClose` / `Alert onDismiss`→`onClose` | 3 | 0 | 0 | 0 | 2 | 0 | 0 | **5** |
| P1-5 | `LoadingOverlay visible` → `open` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| P2-6 | `CircularProgress size`(number) → `diameter` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| P2-7 | import `Switch` / `Toggle`（檔案數） | 7 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 3 | 3 / 0 | 0 / 0 | **10 / 4** |
| P2-8 | `<Tree checkedKeys>` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| — | （參考）import `@arkite-ui/core` 的檔案數（採用規模） | 210 | 33 | 38 | 29 | 28 | 35 | 11 | **384** |

補充說明：

- **P0-1 的 175 筆全部落在 `Alert`**（皆為 `<Alert variant="error">`）。`Progress` / `CircularProgress` / `Toast` 的 `variant="error"`、以及 `toast({ variant: 'error' })` 物件寫法在所有專案為 **0**（`CircularProgress` 元件本身完全未被使用）。另有 3 筆 `<EmptyState variant="error">`（ark-crm 三個 ErrorBoundary），依計畫 `EmptyState` 的 `error` 為「錯誤態」語義**保留、不改**，故不計入。
- **`toast.error(...)` 方法式呼叫**：ark-crm 10、ark-connect 0、ark-finance 126、ark-shield 4、ark-harvest 70、museum/web 57、museum/field 14，**合計 281**。此為 toast 的便捷方法 API，**不屬於本次 variant 值 rename 的範圍**，但量體極大，若 toast API 一併調整需另行評估。
- **P1-4 的 `CommandDialog` 在所有專案為 0**（`CommandDialog` 未被使用），5 筆全部是 `<Alert dismissible onDismiss>`。

## P0 非零 cell 的實際檔案清單

### P0-1 `<Alert variant="error">`（括號為單檔出現次數，未標示者為 1）

**ark-connect（8）** — 皆 1 筆
- web/src/app/(public)/account/verification/page.tsx
- web/src/app/(public)/account/wallet/page.tsx
- web/src/app/(public)/checkout/page.tsx
- web/src/app/(public)/forgot-password/page.tsx
- web/src/app/(public)/login/page.tsx
- web/src/app/(public)/orders/[id]/page.tsx
- web/src/app/(public)/page.tsx
- web/src/app/(public)/register/page.tsx

**ark-shield（6）** — 皆 1 筆
- web/src/pages/app/AssessmentWizard/StepUpload.tsx
- web/src/pages/app/AssessmentWizard/WizardPage.tsx
- web/src/pages/auth/ActivatePage.tsx
- web/src/pages/auth/AdminLoginPage.tsx
- web/src/pages/auth/ApplicationPage.tsx
- web/src/pages/auth/LoginPage.tsx

**ark-harvest（6）** — 皆 1 筆
- web/src/components/sources/WebhookSubscriptionPanel.tsx
- web/src/pages/admin/CompaniesPage.tsx
- web/src/pages/admin/RunsPage.tsx
- web/src/pages/admin/SettingsPage.tsx
- web/src/pages/auth/AdminLoginPage.tsx
- web/src/pages/auth/LoginPage.tsx

**ark-museum/web（9）**
- apps/web/src/components/institution/MembersCard.tsx (2)
- apps/web/src/pages/Users.tsx (2)
- apps/web/src/components/batch/FieldDefsTab.tsx
- apps/web/src/components/collection/FromCollectionModal.tsx
- apps/web/src/pages/CollectionItemNew.tsx
- apps/web/src/pages/InstitutionDetail.tsx
- apps/web/src/pages/Institutions.tsx

**ark-museum/field（1）**
- apps/field/src/pages/Login.tsx

**ark-crm（145，共約 120 檔）** — 標注 2 筆以上者，其餘皆 1 筆：
- 3 筆：apps/company-tenant/src/pages/LoginPage.tsx；packages/pages/src/Company/GoogleReviewListPage.tsx
- 2 筆：apps/company-admin/src/pages/{LoginPage,ProfileSettingsPage,SetPasswordPage,SignupPage}.tsx；apps/company-tenant/src/pages/{ProfileInfoPage,SetPasswordPage}.tsx；apps/platform-admin/src/pages/{LoginPage,ProfileSettingsPage,SectionTemplatePage}.tsx；packages/pages/src/Company/{CMSPageFormPage,EventHistoryPage,NotificationSendPage,PayrollPeriodDetailPage,ProductGroupListPage,RoleListPage,ServiceSessionListPage,SocialChannelListPage,StoreSettlementDetailPage}.tsx；packages/pages/src/Company/SocialPost/PostDetailPage.tsx；packages/pages/src/Platform/AgentSpace/{AgentFormPage,JobDetailPage,JobListPage}.tsx
- 1 筆（apps/）：company-admin/src/pages/SelectCompanyPage.tsx；company-tenant/src/pages/{BookingConfirmPage,ProfileAppointmentDetailPage,ProfileOrderDetailPage,ShopCheckoutPage,WaitlistQueuePage,WalletDepositPage}.tsx；platform-admin/src/pages/{AISettingsPage,CreateCompanyPage,CustomerDetailPage,MfaSettingsPage,PlatformEmailProviderListPage,PlatformEmailTemplateListPage,PlatformNotificationTemplateListPage,PlatformSMSTemplateListPage,ProductDetailPage,ProductServiceTemplatePage,ProductTypeSectionConfigPage,SMSProviderListPage,StoreTypeSectionConfigPage,UserFormPage}.tsx；platform-admin/src/pages/CompanyDetail/Tabs/{BasicInfoTab,MemberSectionTab,ProductTab,ServiceCommitmentTab,StoreTab}.tsx
- 1 筆（packages/pages/src/Company/）：AppointmentFormPage, AppointmentPage, ClockRecordListPage, ClockRecordPage, CMSPageListPage, CommissionRecordListPage, CommissionRuleListPage, ComponentLibraryFormPage, ComponentLibraryPage, ComponentLibraryPreviewPage, CustomerFormPage, CustomerListPage, EmailCampaignListPage, EmailLogListPage, EmailTemplateListPage, LINETemplateListPage, OnlineProductFormPage, OnlineProductListPage, OrderCreatePage, OrderDetailPage, OrderListPage, PaymentSettingsPage, PayrollPeriodListPage, PayrollRecordListPage, PointEventFormPage, PointEventListPage, PointManualIssuePage, PointTransactionListPage, ProductFormPage, ProductGroupFormPage, ProductListPage, ProductStoreRelationFormPage, ProductStoreRelationListPage, PromotionFormPage, PromotionListPage, RefundRequestListPage, ReportPage, RoleEditPage, ServiceCommitmentFormPage, ServiceCommitmentListPage, ServiceCompletionListPage, ServiceSessionFormPage, ServiceTemplateFormPage, ServiceTemplateListPage, SMSLogListPage, SMSSendPage, SMSTemplateListPage, SocialChannelFormPage, StockManagementPage, StoreFormPage, StoreListPage, StorePickerLayout, StoreServiceUsageListPage, StoreSettlementListPage, StoreStaffFormPage, StoreStaffListPage, WaitlistPage, WaitlistResourcesPage；SocialPost/ComposerPage.tsx
- 1 筆（packages/pages/src/Platform/）：AgentSpace/{ActionFormPage,ActionListPage,AgentListPage,ScheduleListPage,SkillFormPage,SkillListPage,WorkflowFormPage,WorkflowListPage}.tsx；DomainTypeListPage.tsx；RoleTemplateFormPage.tsx

### P0-2 `<FormField error={…string}>`（皆 ark-harvest；括號為單檔次數）

- web/src/pages/admin/AdminsPage.tsx (8)
- web/src/pages/admin/CompaniesPage.tsx (7)
- web/src/pages/admin/UsersPage.tsx (6)
- web/src/pages/admin/SchedulesPage.tsx (3)
- web/src/pages/admin/WebhooksPage.tsx (3)
- web/src/pages/admin/SourcesPage.tsx (3)
- web/src/pages/admin/TeamPage.tsx (3)
- web/src/pages/admin/ApiKeysPage.tsx (2)
- web/src/pages/auth/AdminLoginPage.tsx (2)
- web/src/pages/auth/LoginPage.tsx (2)

（皆為 `error={errors.x?.message}` 字串型；`ImageUpload` 與 `FormMessage` 均無 `error=` prop，計 0。）

### P0-3 `<Tabs onValueChange>`（皆 1 筆）

**ark-crm（17）**
- packages/pages/src/Company/{PointManualIssuePage, NotificationSendPage, NotificationTemplatePage, NotificationLogPage, CMSPageFormPage, CommissionRuleFormPage, PointEventFormPage, SEOSettingsPage, ReportPage, NotificationConfigPage, SocialChannelFormPage}.tsx
- apps/company-tenant/src/pages/{ProfileAppointmentsPage, ProfileOrdersPage}.tsx
- apps/platform-admin/src/pages/{ProductServiceTemplatePage, CompanyDetailPage, ProfileSettingsPage}.tsx
- apps/company-admin/src/pages/ProfileSettingsPage.tsx

**ark-connect（3）**
- web/src/app/(admin)/admin/voip/page.tsx
- web/src/app/(admin)/admin/audit/page.tsx
- web/src/app/(admin)/admin/pricing/page.tsx

**ark-harvest（1）**
- web/src/pages/admin/TranslationsPage.tsx

### P1-4 `<Alert onDismiss>`

**ark-crm（3）**：packages/pages/src/Company/{OnlineProductFormPage, OrderCreatePage, ProductFormPage}.tsx
**ark-harvest（2）**：web/src/pages/auth/{LoginPage, AdminLoginPage}.tsx

## 結論

**幾乎零成本（可直接定版、無需遷移）**

- **P1-5 `LoadingOverlay visible→open`**、**P2-6 `CircularProgress size→diameter`**、**P2-8 `Tree defaultCheckedKeys`**：7 個專案全數 0 用例（相關元件根本未被使用）。
- **P1-4 的 `CommandDialog onOpenChange→onClose`**：0 用例。
- **Toast/Progress/CircularProgress 的 `variant="error"`**：0 用例——variant rename 實際只透過 `Alert` 產生衝擊。

**需要實質遷移工作**

- **P0-1 `Alert variant="error"→destructive`**：175 筆、跨 6 個專案約 147 檔，是本次最大宗、必做的機械式全域取代。
- **P0-3 `Tabs onValueChange→onChange`**：21 筆、集中在 ark-crm(17)。
- **P0-2 `FormField error→errorMessage`**：39 筆、**完全集中在 ark-harvest**（10 檔，react-hook-form 表單），是單一專案內最密集的一項。
- **P1-4 `Alert onDismiss→onClose`**：5 筆，小量但屬破壞性。
- **P2-7 `Switch`/`Toggle`**：`Switch` 被 10 檔 import、`Toggle` 被 4 檔 import。與文件建議一致——**保留 `Switch` 為規範名**衝擊較小，將 `Toggle` deprecated 只影響 4 檔。

**受影響最深的專案：ark-crm**（採用規模 210 檔）。單它就吃下 P0-1 的 145/175、P0-3 的 17/21、以及全部 P1-4 的 3/5。次高風險為 **ark-harvest**（獨吞 P0-2 全部 39 筆 + P0-1 6 + P0-3 1 + P1-4 2）。

**額外提醒（不在本次 rename 範圍，但量體最大）**：`toast.error()` 方法式呼叫共 **281 筆**，其中 ark-finance(126)、ark-harvest(70)、museum/web(57) 最密集。ark-finance 幾乎不用 `Alert`（P0/P1 全 0），但其 UI 錯誤回饋全走 `toast.error()`——若日後 toast 方法 API 也要動，ark-finance 會從「幾乎不受影響」瞬間變成重災區，建議在定版 toast API 時一併決策。

## 非 consumer（未使用 @arkite-ui/core，本次無影響）

- **ark-rendoc-web/web**：使用的是另一套 `@arkite/ui`（改名前的舊套件），對 `@arkite-ui/core` 0 用例。
- ark-idea、ark-launch、ark-playbook、ark-rendoc、ark-voice：經確認 0 arkite-ui 使用。
- 依指示排除：ark-crew、chronoark-one。
