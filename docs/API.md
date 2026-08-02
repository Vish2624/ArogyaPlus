# ArogyaPlus API Reference — Frontend Integration Guide

Base URL: `/api` (prepend your API origin, e.g. `https://arogyaplus-healthcare-api.onrender.com/api`)

All request/response bodies are JSON unless noted (uploads use `multipart/form-data`).

**Auth:** Admin-only endpoints require `Authorization: Bearer <token>`, obtained from `POST /auth/login`. There is no customer-facing auth — public endpoints need no token.

**Decimal fields** (`lab_price`, `home_price`, `original_lab_price`, `original_home_price`, `total_amount`, `price`) must be returned as JSON **numbers**, never strings. Returning `"499.00"` instead of `499.0` breaks arithmetic on the frontend.

**Soft delete:** every admin-managed resource uses a `status` column (`1` active / `2` inactive / `-1` deleted) internally. This is **not** exposed in any response — deleted rows simply stop appearing in every list/get endpoint (public and admin). You never need to filter on it client-side.

**Errors:** validation failures return `422` with FastAPI's standard `{"detail": [...]}` shape. Business-rule failures (duplicate name, wrong password, not found) return `400`/`404` with `{"detail": "<message>"}`.

---

## Pagination

Seven list endpoints now return a **paginated envelope** instead of a flat array. The single exception is `GET /banners` (public) which stays a flat array.

**Paginated response shape** (applies to all 7 endpoints listed below):
```json
{
  "items": [ /* resource objects */ ],
  "total_rows": 42,
  "total_pages": 5,
  "current_page": 1,
  "page_size": 10
}
```

**Query params** accepted by every paginated endpoint:
- `page` — 1-based page number (default: `1`)
- `page_size` — items per page (default: `10`)

Endpoints that support pagination:

| Endpoint | Extra query params |
|---|---|
| `GET /packages` | `search`, `category`, `sort` |
| `GET /admin/packages` | `search`, `category` |
| `GET /tests` | `search`, `category`, `sort` |
| `GET /admin/tests` | `search`, `category` |
| `GET /admin/banners` | — |
| `GET /admin/bookings` | `search`, `status_filter`, `booking_date` |
| `GET /admin/parameters` | `search` |

> `GET /banners` (public) still returns a **plain array** — do not wrap it.

---

## Auth

### `POST /auth/login`
No auth. Body:
```json
{ "username": "admin", "password": "••••••••" }
```
`200`:
```json
{ "access_token": "eyJ...", "token_type": "bearer" }
```
`401` on bad credentials.

### `GET /auth/me`
Auth required. Returns the logged-in admin:
```json
{ "id": 1, "username": "admin", "email": "admin@arogyaplus.health", "created_at": "2026-01-01T10:00:00Z" }
```

### `PATCH /auth/me`
Auth required. All fields optional — only send what changed.
```json
{ "email": "newemail@arogyaplus.com", "current_password": "old", "new_password": "new" }
```
- Sending `new_password` requires a correct `current_password` → `400 "Current password is incorrect."` otherwise.
- Sending `email` that's already used by another admin → `400 "Email is already in use."`
- `200`: updated `AdminOut` (same shape as `GET /auth/me`).

### `POST /auth/change-password`
Auth required. Body: `{ "current_password": "...", "new_password": "..." }` (min 8 chars). `200 { "message": "Password updated successfully." }`, `400` on wrong current password.

---

## Packages

`Package` object:
```json
{
  "id": 1,
  "name": "Vital Guard Silver",
  "description": "Essential health screening...",
  "category": "Essential",
  "image_url": null,
  "lab_price": 249.0,
  "home_price": 299.0,
  "original_lab_price": 349.0,
  "original_home_price": 399.0,
  "tat": "24 hours",
  "fasting_required": true,
  "is_active": true,
  "is_featured": true,
  "display_order": 0,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z",
  "tests": [ /* Test objects, see below */ ]
}
```

**`fasting_required`** — `true` (fasting required), `false` (non-fasting), or `null` (not specified). Stored as `BOOLEAN NULL` in the DB.

**`display_order`** — lower value = appears first in the public listing. `null` means no explicit order; fall back to `id` ascending on the client. Must be persisted when sent via `PUT`.

**`lab_price` / `home_price` / `original_lab_price` / `original_home_price`** — always returned as JSON **numbers** (e.g. `249.0`), never strings.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/packages` | No | Paginated. Query: `search`, `category`, `sort` (`price_asc`\|`price_desc`), `page`, `page_size`. Only active, non-deleted packages. |
| GET | `/packages/{id}` | No | 404 if inactive/missing. |
| GET | `/admin/packages` | Yes | Paginated. All packages incl. inactive. |
| GET | `/admin/packages/{id}` | Yes | |
| POST | `/admin/packages` | Yes | Body below. `201`. |
| PUT | `/admin/packages/{id}` | Yes | Partial update — send only changed fields. |
| DELETE | `/admin/packages/{id}` | Yes | `204`. Soft delete. |
| PATCH | `/admin/packages/{id}/tests` | Yes | Body `{ "test_ids": [1,2,3] }` — replaces the full test list. |
| DELETE | `/admin/packages/{id}/tests/{test_id}` | Yes | Removes one test from the package. |

**POST/PUT body** (all fields except `name`/`lab_price`/`home_price` optional on `PUT`):
```json
{
  "name": "Complete Wellness Profile",
  "description": "...",
  "category": "Comprehensive",
  "image_url": null,
  "lab_price": 499.0,
  "home_price": 599.0,
  "original_lab_price": 699.0,
  "original_home_price": 799.0,
  "tat": "48 hours",
  "fasting_required": true,
  "is_active": true,
  "is_featured": false,
  "display_order": 2,
  "test_ids": [1, 2, 3]
}
```

---

## Tests

`Test` object:
```json
{
  "id": 1,
  "name": "HbA1c",
  "description": "Reflects average blood sugar...",
  "category": "Diabetes",
  "sample_type": "Blood",
  "image_url": null,
  "lab_price": 90.0,
  "home_price": 120.0,
  "original_lab_price": null,
  "original_home_price": null,
  "tat": "24 hours",
  "fasting_required": true,
  "is_active": true,
  "display_order": 0,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z",
  "parameters": [ /* Parameter objects, ordered — see below */ ]
}
```

**`fasting_required`** — `true`, `false`, or `null`. Same as on packages.

**`display_order`** — same as on packages.

**`lab_price` / `home_price` / `original_lab_price` / `original_home_price`** — always JSON **numbers**.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/tests` | No | Paginated. Query: `search`, `category`, `sort` (`price_asc`\|`price_desc`), `page`, `page_size`. |
| GET | `/tests/{id}` | No | |
| GET | `/admin/tests` | Yes | Paginated. |
| GET | `/admin/tests/{id}` | Yes | |
| POST | `/admin/tests` | Yes | Body below (no `parameters`/`parameter_ids` — see linking endpoints). |
| PUT | `/admin/tests/{id}` | Yes | Partial update. |
| DELETE | `/admin/tests/{id}` | Yes | `204`. Soft delete. |

**POST/PUT body:**
```json
{
  "name": "HbA1c",
  "description": "...",
  "category": "Diabetes",
  "sample_type": "Blood",
  "image_url": null,
  "lab_price": 90.0,
  "home_price": 120.0,
  "original_lab_price": null,
  "original_home_price": null,
  "tat": "24 hours",
  "fasting_required": true,
  "is_active": true,
  "display_order": 0
}
```

### Test ↔ Parameter linking

`parameters[]` on a `Test` is always ordered by position (first = shown first). Manage it with these endpoints — each returns the **full updated `Test` object**, so replace your local copy with the response.

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/admin/tests/{id}/parameters` | Yes | `{ "parameter_id": 5 }` | Appends to the end. `400` if already linked, `404` if test/parameter missing. |
| DELETE | `/admin/tests/{id}/parameters/{parameter_id}` | Yes | — | `404` if not linked. |
| PUT | `/admin/tests/{id}/parameters/reorder` | Yes | `{ "ordered_ids": [5, 1, 3] }` | Must contain **exactly** the test's current linked parameter IDs. `400` otherwise. |

---

## Parameters

A clinical metric (e.g. Haemoglobin) that can be attached to multiple tests via the linking endpoints above.

`Parameter` object:
```json
{
  "id": 1,
  "name": "Haemoglobin",
  "unit": "g/dL",
  "reference_range": "13.5–17.5",
  "method": "Photometry",
  "description": null,
  "is_active": true,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z"
}
```

There is no public/customer-facing parameters endpoint — these are only ever viewed as part of a `Test`'s `parameters[]` array, or managed directly in the admin parameters library.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/admin/parameters` | Yes | Paginated. Query: `search` (name, case-insensitive), `page`, `page_size`. Ordered by name. |
| POST | `/admin/parameters` | Yes | `name` required + unique; `400` if taken. |
| PUT | `/admin/parameters/{id}` | Yes | Partial update; renaming to a taken name → `400`. |
| DELETE | `/admin/parameters/{id}` | Yes | `204`. Also unlinks it from every test. |

**POST/PUT body:**
```json
{
  "name": "Haemoglobin",
  "unit": "g/dL",
  "reference_range": "13.5–17.5",
  "method": "Photometry",
  "description": null,
  "is_active": true
}
```

---

## Bookings

`Booking` object:
```json
{
  "id": 1,
  "booking_reference": "AP-260726-A1B2",
  "customer_name": "Aisha Khan",
  "age": 32,
  "gender": "Female",
  "phone": "+971501234567",
  "email": "aisha@example.com",
  "address": "Villa 12, Al Wasl Road, Jumeirah, Dubai",
  "preferred_date": "2026-08-01",
  "time_slot": "09:00 AM",
  "visit_mode": "home",
  "payment_mode": "cash",
  "total_amount": 419.0,
  "status": "New",
  "created_at": "2026-07-26T09:00:00Z",
  "updated_at": "2026-07-26T09:00:00Z",
  "items": [
    {
      "id": 1,
      "item_type": "package",
      "item_id": 1,
      "item_name": "Vital Guard Silver",
      "price": 299.0,
      "quantity": 1
    }
  ]
}
```

**`address`** — optional string. Must be stored in DB and returned in all booking responses (was previously accepted but silently dropped).

**`payment_mode`** — `"cash"` or `"online"`. Must be stored in DB and returned in all booking responses.

**`total_amount`** and `items[].price` — always JSON **numbers**, never strings.

`status` is a workflow string: `"New" | "Contacted" | "Done"`.

`gender` is `"Male" | "Female"`. `visit_mode` is `"home" | "lab"`.

`time_slot` must be one of:
`"07:00 AM"`, `"08:00 AM"`, `"09:00 AM"`, `"10:00 AM"`, `"11:00 AM"`, `"12:00 PM"`, `"01:00 PM"`, `"02:00 PM"`, `"03:00 PM"`, `"04:00 PM"`, `"05:00 PM"`, `"06:00 PM"`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/bookings` | No | Creates booking, fires WhatsApp notification. |
| GET | `/admin/bookings` | Yes | Paginated. Query: `search` (name/phone/email/reference), `status_filter` (`New`\|`Contacted`\|`Done`), `booking_date` (YYYY-MM-DD), `page`, `page_size`. |
| GET | `/admin/bookings/{id}` | Yes | |
| PATCH | `/admin/bookings/{id}/status` | Yes | Body `{ "status": "Contacted" }`. |
| GET | `/admin/dashboard/stats` | Yes | Counts + `recent_bookings` (last 5, full `Booking` shape). |

**POST /bookings body:**
```json
{
  "customer_name": "Aisha Khan",
  "age": 32,
  "gender": "Female",
  "phone": "+971501234567",
  "email": "aisha@example.com",
  "address": "Villa 12, Al Wasl Road, Jumeirah, Dubai",
  "preferred_date": "2026-08-01",
  "time_slot": "09:00 AM",
  "visit_mode": "home",
  "payment_mode": "cash",
  "items": [
    { "item_type": "package", "item_id": 1 },
    { "item_type": "test", "item_id": 5 }
  ]
}
```

`201` response — lightweight confirmation (not the full booking):
```json
{
  "booking_reference": "AP-260726-A1B2",
  "total_amount": 419.0,
  "status": "New",
  "message": "Your booking has been received. Our team will contact you shortly."
}
```

Validation rules: `customer_name` letters/spaces/`.`/`'`/`-` only; `phone` 7–15 digits; `preferred_date` can't be in the past; `time_slot` must match the list exactly. Expect `422` with per-field messages if validation fails.

---

## Banners

`Banner` object:
```json
{
  "id": 1,
  "image_url": "https://...",
  "title": "Summer Health Check",
  "subtitle": "Up to 30% off all packages",
  "tags": "Sale,Featured",
  "link_url": "/packages",
  "display_order": 0,
  "is_active": true,
  "created_at": "2026-01-01T10:00:00Z"
}
```

`tags` is a comma-separated string (e.g. `"Sale,New"`) — split it client-side.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/banners` | No | **Plain array** (not paginated). Active banners only, ordered by `display_order`. |
| GET | `/admin/banners` | Yes | **Paginated.** All banners incl. inactive. |
| POST | `/admin/banners` | Yes | `image_url` + `is_active` required, rest optional. `201`. |
| PUT | `/admin/banners/{id}` | Yes | Partial update, `404` if missing. |
| DELETE | `/admin/banners/{id}` | Yes | `204`, soft delete. |

---

## Image Upload

### `POST /admin/uploads/image`
Auth required. `multipart/form-data`, field name `file`. JPG/PNG/WebP only, max 5 MB.

`200`:
```json
{ "url": "/static/uploads/abc123.jpg" }
```

`url` is relative to the API origin (not the `/api` prefix). Prepend your API origin (e.g. `https://arogyaplus-healthcare-api.onrender.com`) to build the full image URL, then use it as-is for `image_url` fields on packages, tests, and banners.

---

## DB changes required (summary for backend)

| Table | Column | Type | Action |
|---|---|---|---|
| `tests` | `fasting_required` | `BOOLEAN NULL DEFAULT NULL` | Add |
| `packages` | `fasting_required` | `BOOLEAN NULL DEFAULT NULL` | Add |
| `bookings` | `address` | `TEXT NULL` | Already exists — ensure it is persisted (not dropped) |
| `bookings` | `payment_mode` | `VARCHAR(10) NULL` | Add |
| `tests` | `display_order` | `INTEGER NULL` | Already exists — ensure it is persisted via `PUT` |
| `packages` | `display_order` | `INTEGER NULL` | Already exists — ensure it is persisted via `PUT` |

---

## Changes since previous API version

| # | What changed | Type |
|---|---|---|
| 1 | 7 list endpoints now return paginated envelope `{ items, total_pages, current_page, page_size, total_rows }` | Breaking change |
| 2 | `fasting_required: boolean \| null` added to Test and Package objects | New field |
| 3 | `payment_mode: "cash" \| "online"` added to Booking (create body + all responses) | New field |
| 4 | `address` on Booking is now actually persisted and returned (was silently dropped before) | Bug fix |
| 5 | `display_order` on Test and Package is now persisted via `PUT` (was accepted but ignored) | Bug fix |
| 6 | All price/amount fields (`lab_price`, `home_price`, `original_*`, `total_amount`, `price`) serialized as JSON numbers | Bug fix |
| 7 | Test ↔ Parameter linking endpoints (`POST/DELETE/PUT /admin/tests/{id}/parameters/...`) must work reliably | Verify/fix |
| 8 | `GET /banners` stays a plain array — only `GET /admin/banners` is paginated | Clarification |
