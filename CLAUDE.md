# Pyrus → Telegram Sync (admin UI)

Vite + React 18 admin panel for managing integrations on the backend at `../Pyrus automation with tg`.

## Stack
TypeScript (ESM), React 18, Vite 5, TanStack Query v5, react-hook-form + zod resolver, lucide-react. No router (single page), no test runner.

## Layout (`src/`)
- `main.tsx` — wraps `<App/>` with `QueryClientProvider` + `AuthProvider`.
- `App.tsx` — gates on `useAuth().isAuthenticated`: shows `LoginScreen` or `AppShell` + `IntegrationsPage`.
- `lib/`
  - `auth.tsx` — **client-side only** auth. Compares against `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` (default `admin`/`admin`), persists username in `localStorage` (`pyrus-admin-session`). Does NOT send any token to the API.
  - `api.ts` — fetch wrapper. `VITE_API_BASE_URL` (default `http://localhost:3000`). No `Authorization` header. Sets `Content-Type: application/json` only when there's a body.
  - `hooks.ts` — React Query hooks: `useIntegrations`, `useIntegration`, `useCreateIntegration`, `useUpdateIntegration`, `useDeleteIntegration`. Mutations invalidate `['integrations']` and `['integration', id]`.
- `components/`
  - `AppShell.tsx` — layout shell + logout.
  - `LoginScreen.tsx` — username/password form, calls `useAuth().login`.
  - `IntegrationsPage.tsx` — top-level page; orchestrates table + side panel.
  - `IntegrationsTable.tsx` — paginated list with search.
  - `IntegrationPanel.tsx` — create/edit drawer using `integrationForm.ts` (zod schema + RHF defaults).
  - `WatchRulesEditor.tsx` — nested array editor for watch rules.
  - `StaleReplyRulesEditor.tsx` — nested array editor for stale-reply rules: each rule has `threshold_amount + threshold_unit (minutes/hours/days)`, `is_enabled`, and a `responders` sub-array (user/role/form + Pyrus ID).
  - `TopicIconRulesEditor.tsx` — match rules (user/role/form/field) with color swatches (6 Telegram presets) and emoji preset grid + custom emoji ID input. Loads presets from `GET /api/topic-icons` via `useTopicIconPresets`. When `match_type === 'field'` the row swaps "Pyrus ID" for "Field ID" + adds a "Choice ID" input (matched against multiple_choice fields' `choice_id`).
  - `StaleAlertsSection.tsx` — section in the integration form for the stale-alerts forum topic: topic name + color swatch + emoji picker (same widgets as `TopicIconRulesEditor`). Reuses `useTopicIconPresets`.
  - `ConfirmDialog.tsx`, `StatusBadge.tsx` — small primitives.
- `types/api.ts` — shared API DTOs (`Integration`, `IntegrationPayload`, `IntegrationsResponse`, `ApiErrorPayload`, `StaleReplyRule`, `StaleResponder`, `StaleAlertsSettings`, `TopicIconRule`, `TopicIconPreset`).
- `styles.css` — single global stylesheet (no Tailwind / CSS modules).

## Conventions
- ESM imports, no `.js` suffix needed (Vite resolves TS).
- Server state lives in TanStack Query; never duplicate it in component state.
- Forms use `react-hook-form` with `zodResolver`; shared schema/defaults in `components/integrationForm.ts`.
- Error messages surfaced from API via `parseResponse` (`payload.message || payload.error`).

## Auth model (important)
The UI does NOT send credentials to the backend. The backend's `requireAdminAuth` is opt-in: keep `ADMIN_API_KEY` unset on the server, or wire `api.ts` to send `Authorization: Bearer <key>` if you set one.

## Env (`VITE_*`)
- `VITE_API_BASE_URL` — backend URL (default `http://localhost:3000`).
- `VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD` — client-side login creds (defaults `admin`/`admin`).

## Scripts
- `npm run dev` — Vite dev server, `--host 0.0.0.0`. Default port from Vite config.
- `npm run build` — `tsc -b && vite build`.
- `npm run preview`.

## Topic icons (form section)
Block "Topic icons": list of rules, each picks color (one of 6 Telegram presets) and/or a custom emoji preset (from `getForumTopicIconStickers`). First matching rule (by `sort_order`) defines the new topic's appearance. Existing topics are not re-styled — Telegram doesn't allow changing `icon_color` after creation. Presets are loaded once via `useTopicIconPresets` (6h staleTime).

## Stale-reply rules (form section)
The integration form has a "Stale-task alerts" block (`stale_alerts.topic_name`, defaults to `Не отвеченные задачи`) and a "Stale-reply rules" array. Each rule = threshold + responders allowlist; on save the backend replaces all rules atomically (same pattern as `watch_rules`). Renaming the topic clears the stored thread ID so the next alert creates a fresh forum topic.

## Companion
Backend at `../Pyrus automation with tg`. Backend CORS reflects request origin when `ADMIN_ALLOWED_ORIGINS` is unset, so local dev works out of the box.
