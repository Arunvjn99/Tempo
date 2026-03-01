# Multi-Tenant Company Branding Audit

**Date:** 2025-03-01  
**Context:** Auth trigger that inserted `company_id` into profiles on signup was removed. Company-based branding was not applying because `profiles.company_id` stayed NULL.

---

## 1. Signup flow

**Location:** `src/pages/auth/Signup.tsx`, `src/context/AuthContext.tsx`

- **Auth:** `AuthContext.signUp()` calls `supabase.auth.signUp()`. Metadata (name, company_id, location) is passed in `options.data` for reference only; it is **not** written to `profiles` by Supabase.
- **Profile update (application layer):** After `signUp()` succeeds, the app updates the profile in the same request flow:
  - `supabase.from("profiles").update({ name, location, company_id, role: "user" }).eq("id", user.id)`
  - `company_id` is the **UUID** from the signup form (company dropdown value).
  - Done **before** `signOut()` so the session is valid for RLS.
- **No trigger:** Company assignment is application-layer only; no DB trigger is used.

**Note:** If your project has no trigger that creates a row in `profiles` on `auth.users` insert, the update may affect 0 rows. In that case, consider creating the profile row in the app (e.g. upsert) or adding a minimal trigger that inserts `profiles(id)` on `auth.users` insert.

---

## 2. Company dropdown (UUID)

**Location:** `src/pages/auth/Signup.tsx`

- Companies are loaded from `supabase.from("companies").select("id, name")`.
- The `<select>` uses `<option value={c.id}>` — **value is company UUID**, not name.
- Form state `companyId` is set from `e.target.value` and passed to `signUp` metadata and to `profiles.company_id` in the update above.

---

## 3. useUser() / UserContext

**Location:** `src/context/UserContext.tsx`

- **Profile:** Fetched once when `authUser` is set: `supabase.from("profiles").select("id, name, company_id, location, role").eq("id", authUser.id).single()`.
- **Company:** Fetched only when `profile.company_id` is non-empty: `supabase.from("companies").select("id, name, primary_color, secondary_color, branding_json, logo_url").eq("id", profile.company_id).single()`.
- **If `company_id` is null:** A **console.warn** is logged (in DEV), `company` is set to null, `setCompanyBranding("", undefined)` is called (default theme), and no company fetch is performed.
- **No duplicate fetches:** Single `useEffect` depending on `authUser` and `authLoading`; one profile fetch, one company fetch when applicable.
- **No race:** Uses a `cancelled` flag so that late responses do not overwrite state.

---

## 4. useTheme() / ThemeContext – branding source

**Location:** `src/context/ThemeContext.tsx`, `src/theme/themeManager.ts`

- **Branding source:** Only the **companies** table is used for theme:
  - `UserContext` fetches `companies.branding_json`, `logo_url`, `primary_color`, `secondary_color`.
  - It calls `setCompanyBranding(company.name, company.branding_json, company.logo_url)` and sets CSS vars from `primary_color` / `secondary_color`.
- **company_branding table:** **Not used** anywhere in app code. Theme resolution is:
  1. `companies.branding_json` (and `companies.logo_url`, `primary_color`, `secondary_color`)
  2. ThemeManager fallbacks (defaultThemeMap, fallbackTheme)
- **Theme editor:** `companyBrandingService.updateCompanyBranding()` writes to **companies** (`branding_json`, etc.), not `company_branding`.

---

## 5. When theme is applied

- **Login:** `onAuthStateChange` sets user → `UserContext` effect runs → profile → company → `setCompanyBranding` and CSS vars.
- **Page refresh:** `getSession()` restores user → same flow as login.
- **Signup:** Profile is updated with `company_id` before redirect. After the user verifies and signs in, the next load runs the same flow; theme is then applied from their company.

---

## 6. Defensive checks and warnings

- **Missing `profile.company_id`:** Theme load is skipped; default theme is used; in DEV, `console.warn("[UserContext] profile.company_id is missing; ...")` is logged.
- **Company fetch failure:** Company is set to null, default theme applied; in DEV, `console.warn("[UserContext] company fetch failed for company_id:", ...)` is logged.
- **Signup profile update failure:** In DEV, `console.warn("[signup] profiles update failed ...")` is logged; user still proceeds to verify (branding will apply after profile is fixed).

---

## 7. Separation of concerns

- **AuthContext:** Auth only (signIn, signUp, signOut, session). No profile or company logic.
- **UserContext:** Profile and company fetch; calls ThemeContext’s `setCompanyBranding` and `setBrandingLoading`. No auth logic beyond consuming `useAuth()`.
- **ThemeContext:** Holds mode (light/dark/system), applies theme from `companyTheme` (and override). Does not fetch data; receives branding from UserContext.
- **Signup page:** Orchestrates signUp, then profile update, then signOut and redirect. Company dropdown stores UUID and passes it to the profile update.

---

## 8. Files touched in this audit/refactor

| File | Change |
|------|--------|
| `src/pages/auth/Signup.tsx` | After signUp, update `profiles` with name, location, company_id (UUID), role = "user"; comment that dropdown value is UUID. |
| `src/context/UserContext.tsx` | Defensive check and console.warn when `company_id` is missing; console.warn on company fetch failure; file comment that branding is from companies only. |
| `docs/MULTI_TENANT_BRANDING_AUDIT.md` | This audit. |

No references to `company_branding` exist in application code; only in docs and in `supabase/migrations/company_branding.sql` (legacy table).
