---
"@arkite-ui/core": patch
---

FilterBarSearch / SearchInput: guard against password-manager autofill. Inputs now render `type="search"` + `name="search"` + `autoComplete="off"` (overridable via props on SearchInput), so a `type="password"` field on the same page no longer makes browsers autofill the saved username into the search box and silently filter your list.
