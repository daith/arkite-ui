---
"@arkite-ui/core": minor
---

Add `LocaleProvider` + built-in `enUS` / `zhTW` locales. Every built-in component string (placeholders, empty states, pagination labels, calendar weekday/month names, and all aria-labels) now resolves through the locale context, so Chinese apps get Chinese screen-reader labels with one provider at the root:

```tsx
import { LocaleProvider, zhTW } from '@arkite-ui/core'

<LocaleProvider locale={zhTW}>
  <App />
</LocaleProvider>
```

Partial locales are supported (missing keys fall back to English), and explicit component props always win over locale values. Without a provider nothing changes — defaults are the same English strings as before.
