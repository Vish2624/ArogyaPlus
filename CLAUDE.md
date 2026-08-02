# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `frontend/`:

```bash
npm run dev          # start dev server at http://localhost:5173
npm run typecheck    # type-check without emitting (run before any commit)
npm run build        # tsc -b + vite build (full production check)
npm run lint         # eslint over the whole src tree
```

No automated test suite exists. The canonical pre-deploy check is `npm run typecheck && npm run build`.

## Architecture

**Frontend-only repo.** The backend is a separate hosted FastAPI service at
`https://arogyaplus-healthcare-api.onrender.com`. The API base URL is set via
`frontend/.env` → `VITE_API_BASE_URL`. See `docs/API.md` for the full endpoint contract.

### Key structural decisions

- `src/services/api.ts` — single Axios instance. Attaches the admin JWT from `localStorage` on every
  request. A 401 response automatically clears the token and redirects to `/admin/login`. All service
  modules import from here; never create a second Axios instance.

- `src/services/{package,test,booking,auth,banner,parameter,upload}Service.ts` — one file per resource.
  Each exports typed async functions. `normalizePackage` / `normalizeTest` coerce price fields from
  the backend's string decimals (`"499.00"`) to JS numbers; this must happen at the service layer,
  not in components.

- `src/store/cartStore.ts` — Zustand store persisted to `localStorage` (`carehub_cart`). Holds
  `items: CartItem[]`, `visitMode: "home" | "lab"`, and drawer open state. `useCartTotal()` is a
  derived selector exported from the same file. Cart items carry both `labPrice` and `homePrice` so
  the total recalculates instantly when the user switches visit mode.

- `src/store/authStore.ts` — non-persisted Zustand store (token is read from `localStorage` at
  init). `isAuthenticated` is the gate used by `ProtectedRoute`.

- `src/routes/AppRoutes.tsx` — all routes in one file. Public pages nest under `<PublicLayout>`;
  admin pages nest under `<ProtectedRoute><AdminLayout>`. `/admin/login` is standalone.

- `src/layouts/PublicLayout.tsx` — wraps every public page with `<Header>`, `<Footer>`,
  `<CartDrawer>`, `<DisclaimerTicker>` (top and bottom), `<QuickAccessButtons>`, and `<Toast>`.

### Path alias

`@` maps to `frontend/src` (configured in `vite.config.ts` and `tsconfig.json`). Always use
`@/...` imports, never relative `../` chains.

### Types

`src/types/` defines the shared domain model:
- `package.ts` — `Package`, `PackageInput`
- `test.ts` — `Test`, `TestInput`
- `booking.ts` — `Booking`, `BookingCreatePayload`, `BookingItem`, `VisitMode`, `CartItemType`,
  `BookingStatus`, `DashboardStats`, `TIME_SLOTS`
- `auth.ts` — `AdminUser`
- `banner.ts`, `parameter.ts` — Banner, Parameter

### Known backend quirks (handle in service layer)

- Price fields (`lab_price`, `home_price`, etc.) are serialized as JSON strings, not numbers.
  Always coerce with `Number()` in the `normalize*` functions before returning to the rest of the app.
- `address` on `Booking` responses is currently silently dropped by the backend even though it is
  accepted on `POST /bookings` — the field is typed `address?: string | null` to reflect this.
- `display_order` on `Package` is not yet persisted by the backend — the service falls back to `id`
  order and `adminReorderPackages` fans out individual `PUT` calls until a batch endpoint exists.

### Admin token

Key: `carehub_admin_token` in `localStorage` (exported as `ADMIN_TOKEN_KEY` from `src/services/api.ts`).
JWT lifetime is 24 hours (configured on the backend service).

### Contact / branding constants

`src/utils/constants.ts` is the single source of truth for the brand name (`ArogyaPlus`), phone,
WhatsApp link, email, and address. Use it instead of hardcoding strings in components.
