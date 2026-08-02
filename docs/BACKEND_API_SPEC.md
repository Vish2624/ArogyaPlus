# Backend API Spec — What Needs to Be Built / Updated

Base URL: `/api`  
All request/response bodies are JSON unless noted.  
Admin endpoints require `Authorization: Bearer <token>`.  
Decimal price fields **must be returned as numbers** (not strings) — the frontend coerces them, but returning real numbers is the correct contract.

---

## Section 1 — APIs That Already Exist and Work

These are live and the frontend consumes them correctly. No changes needed unless noted.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/login` | No | Returns `{ access_token, token_type }` |
| GET | `/auth/me` | Yes | Returns `AdminUser` object |
| GET | `/packages` | No | Query: `search`, `category`, `sort` (`price_asc`\|`price_desc`) |
| GET | `/packages/{id}` | No | Returns single active package or 404 |
| GET | `/admin/packages` | Yes | Returns all packages incl. inactive |
| GET | `/admin/packages/{id}` | Yes | |
| POST | `/admin/packages` | Yes | |
| PUT | `/admin/packages/{id}` | Yes | Also used to replace the test list via `test_ids` |
| DELETE | `/admin/packages/{id}` | Yes | |
| GET | `/tests` | No | Query: `search`, `category`, `sort` |
| GET | `/tests/{id}` | No | |
| GET | `/admin/tests` | Yes | |
| GET | `/admin/tests/{id}` | Yes | |
| POST | `/admin/tests` | Yes | |
| PUT | `/admin/tests/{id}` | Yes | |
| DELETE | `/admin/tests/{id}` | Yes | |
| POST | `/bookings` | No | Creates booking + triggers WhatsApp |
| GET | `/admin/bookings` | Yes | Query: `search`, `status_filter`, `booking_date` |
| GET | `/admin/bookings/{id}` | Yes | Returns booking with `items[]` |
| PATCH | `/admin/bookings/{id}/status` | Yes | Body: `{ status }` |
| GET | `/admin/dashboard/stats` | Yes | Returns counts + recent 5 bookings |
| POST | `/notifications/whatsapp/test` | Yes | Sends test WhatsApp message |

---

## Section 2 — Existing APIs That Need Schema Updates

These endpoints exist and are called, but the **database tables are missing columns** that the frontend expects. Each requires a migration + serializer update.

---

### 2a. Packages — missing columns

**DB migration needed on `packages` table:**

| Column | Type | Notes |
|---|---|---|
| `original_lab_price` | `numeric(10,2)`, nullable | Strike-through "was" price for lab visit |
| `original_home_price` | `numeric(10,2)`, nullable | Strike-through "was" price for home visit |
| `tat` | `varchar(50)`, nullable | Report turnaround time, e.g. `"24 hours"` |
| `is_featured` | `boolean` | Default `false`. Used to show on home page carousel |
| `display_order` | `integer`, nullable | Lower = shown first on home page. Default `null` (frontend falls back to `id` order) |

**Updated response shape for all package endpoints (`GET /packages`, `GET /packages/{id}`, admin variants, POST, PUT):**

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
  "is_active": true,
  "is_featured": true,
  "display_order": 0,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z",
  "tests": [ /* Test objects — see 2b */ ]
}
```

**Updated request body for `POST /admin/packages` and `PUT /admin/packages/{id}`** (add the new fields):

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
  "is_active": true,
  "is_featured": false,
  "display_order": 2,
  "test_ids": [1, 2, 3]
}
```

All new fields are **optional** in PUT (partial update). `original_*` and `tat` and `display_order` default to `null`, `is_featured` defaults to `false`.

---

### 2b. Tests — missing columns

**DB migration needed on `tests` table:**

| Column | Type | Notes |
|---|---|---|
| `sample_type` | `varchar(100)`, nullable | e.g. `"Blood"`, `"Urine"` |
| `image_url` | `varchar(500)`, nullable | Uploaded image URL |
| `original_lab_price` | `numeric(10,2)`, nullable | Strike-through "was" price for lab visit |
| `original_home_price` | `numeric(10,2)`, nullable | Strike-through "was" price for home visit |
| `display_order` | `integer`, nullable | Lower = shown first on home page. Default `null` |

**Updated response shape for all test endpoints:**

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
  "is_active": true,
  "display_order": 0,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-01T10:00:00Z",
  "parameters": [ /* Parameter objects — see Section 3c */ ]
}
```

**Updated request body for `POST /admin/tests` and `PUT /admin/tests/{id}`:**

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
  "is_active": true,
  "display_order": 0
}
```

Note: `parameters` are managed via separate endpoints (Section 3c) — do not accept `parameter_ids` here.

---

### 2c. Bookings — missing `address` column

**DB migration needed on `bookings` table:**

| Column | Type | Notes |
|---|---|---|
| `address` | `text`, nullable | Customer's collection address (required for home visits) |

**Updated `POST /bookings` request body** (add `address`):

```json
{
  "customer_name": "Aisha Khan",
  "age": 32,
  "gender": "Female",
  "phone": "501234567",
  "email": "aisha@example.com",
  "address": "Villa 12, Al Wasl Road, Jumeirah, Dubai",
  "preferred_date": "2026-08-01",
  "time_slot": "09:00 AM",
  "visit_mode": "home",
  "items": [
    { "item_type": "package", "item_id": 1 },
    { "item_type": "test", "item_id": 5 }
  ]
}
```

`address` is optional at the API level (customers may leave it blank).

**Updated booking response shape** — all booking endpoints (`GET /admin/bookings`, `GET /admin/bookings/{id}`, `GET /admin/dashboard/stats` recent_bookings) must include `address`:

```json
{
  "id": 1,
  "booking_reference": "CH-260726-A1B2",
  "customer_name": "Aisha Khan",
  "age": 32,
  "gender": "Female",
  "phone": "501234567",
  "email": "aisha@example.com",
  "address": "Villa 12, Al Wasl Road, Jumeirah, Dubai",
  "preferred_date": "2026-08-01",
  "time_slot": "09:00 AM",
  "visit_mode": "home",
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

---

### 2d. Auth — missing profile update endpoint

`PATCH /auth/me` is called by the admin profile page but does not exist yet.

**Request body** (all fields optional — only send what changed):

```json
{
  "email": "newemail@arogyaplus.com",
  "current_password": "oldpassword123",
  "new_password": "newpassword456"
}
```

Rules:
- If `new_password` is provided, `current_password` must also be provided and must match. Return `400` if it doesn't.
- If only `email` is provided, password is not touched.
- Any omitted field is left unchanged.

**Response `200`** — updated `AdminUser`:

```json
{
  "id": 1,
  "username": "admin",
  "email": "newemail@arogyaplus.com",
  "created_at": "2026-01-01T10:00:00Z"
}
```

**Error responses:**
- `400` `{ "detail": "Current password is incorrect." }` — wrong current password
- `400` `{ "detail": "Email is already in use." }` — duplicate email

---

## Section 3 — New APIs That Need to Be Created

These endpoints are called by the frontend but don't exist on the backend at all.

---

### 3a. Banners

New `banners` table required:

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK | |
| `image_url` | `varchar(500)` | Required |
| `title` | `varchar(150)`, nullable | |
| `subtitle` | `varchar(255)`, nullable | |
| `tags` | `text`, nullable | Comma-separated tag string, e.g. `"Sale,New"` |
| `link_url` | `varchar(500)`, nullable | Optional CTA URL |
| `display_order` | integer | Default `0`. Lower = shown first |
| `is_active` | boolean | Default `true` |
| `created_at` | timestamptz | |

**Banner object shape** (used in all responses below):

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

---

#### GET /banners (public)

Returns all active banners ordered by `display_order` ascending.  
No auth required.

Response `200`: `Banner[]` (only `is_active = true` records)

---

#### GET /admin/banners

Returns **all** banners (active and inactive) ordered by `display_order`.  
Auth required.

Response `200`: `Banner[]`

---

#### POST /admin/banners

Auth required.

Request body:

```json
{
  "image_url": "https://...",
  "title": "Summer Health Check",
  "subtitle": "Up to 30% off",
  "tags": "Sale",
  "link_url": "/packages",
  "display_order": 0,
  "is_active": true
}
```

`image_url` and `is_active` are required. All others optional (default `null` / `0`).

Response `201`: `Banner`

---

#### PUT /admin/banners/{id}

Auth required. Full or partial update (all fields optional).

Request body: same shape as POST (all fields optional).

Response `200`: updated `Banner`  
Response `404` if not found.

---

#### DELETE /admin/banners/{id}

Auth required.

Response `204` No Content  
Response `404` if not found.

---

### 3b. Image Upload

#### POST /admin/uploads/image

Auth required. Accepts `multipart/form-data`.

Form field: `file` — the image file (JPEG, PNG, WebP etc.)

Response `200`:

```json
{
  "url": "/static/uploads/abc123.jpg"
}
```

The path should be relative to the API origin (e.g. `/static/uploads/…`), not prefixed with `/api`. The frontend prepends the API origin automatically. Serve the file from this path statically.

Max file size and type validation are at the backend's discretion.

---

### 3c. Parameters

A **parameter** is a clinical test metric (e.g. Haemoglobin, with a unit of `g/dL` and a reference range). Tests can have many parameters, ordered within each test.

New tables required:

**`parameters` table:**

| Column | Type | Notes |
|---|---|---|
| `id` | integer, PK | |
| `name` | `varchar(150)`, unique | e.g. `"Haemoglobin"` |
| `unit` | `varchar(50)`, nullable | e.g. `"g/dL"` |
| `reference_range` | `varchar(100)`, nullable | e.g. `"13.5–17.5"` |
| `method` | `varchar(100)`, nullable | e.g. `"Photometry"` |
| `description` | `text`, nullable | |
| `is_active` | boolean | Default `true` |
| `created_at` / `updated_at` | timestamptz | |

**`test_parameters` join table** (many-to-many, ordered):

| Column | Type | Notes |
|---|---|---|
| `test_id` | integer, FK → tests.id (cascade delete) | composite PK |
| `parameter_id` | integer, FK → parameters.id (cascade delete) | composite PK |
| `position` | integer | Order within the test. Lower = shown first. Default `0` |

**Parameter object shape:**

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

---

#### GET /admin/parameters

Auth required. Query param: `search` (optional, case-insensitive name match).

Response `200`: `Parameter[]` ordered by `name` ascending.

```json
[
  { "id": 1, "name": "Haemoglobin", "unit": "g/dL", ... },
  { "id": 2, "name": "Platelets", "unit": "×10³/μL", ... }
]
```

---

#### POST /admin/parameters

Auth required.

Request body:

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

`name` and `is_active` are required. All others optional.

Response `201`: `Parameter`  
Response `400` if `name` is already taken.

---

#### PUT /admin/parameters/{id}

Auth required. Full or partial update.

Request body: same shape as POST (all fields optional).

Response `200`: updated `Parameter`  
Response `404` if not found.

---

#### DELETE /admin/parameters/{id}

Auth required. Should also remove the parameter from any `test_parameters` rows (cascade).

Response `204` No Content  
Response `404` if not found.

---

### 3d. Test ↔ Parameter Linking

These endpoints manage which parameters belong to a specific test, and in what order. The `GET /admin/tests/{id}` and `GET /tests/{id}` responses must include the linked `parameters[]` array, ordered by `test_parameters.position` ascending (see Section 2b).

---

#### POST /admin/tests/{id}/parameters

Adds a parameter to a test. Auth required.

Request body:

```json
{ "parameter_id": 5 }
```

Appends to the end of the test's parameter list (highest existing `position + 1`).

Response `200`: full updated `Test` object (with `parameters[]` already ordered).

```json
{
  "id": 3,
  "name": "Complete Hemogram",
  ...
  "parameters": [
    { "id": 1, "name": "Haemoglobin", ... },
    { "id": 5, "name": "Platelets", ... }
  ]
}
```

Response `404` if test or parameter not found.  
Response `400` if parameter is already linked to this test.

---

#### DELETE /admin/tests/{id}/parameters/{parameter_id}

Removes a parameter from a test. Auth required.

Response `200`: full updated `Test` object (with remaining `parameters[]`).  
Response `404` if the link doesn't exist.

---

#### PUT /admin/tests/{id}/parameters/reorder

Replaces the position order of a test's parameters. Auth required.

Request body:

```json
{ "ordered_ids": [5, 1, 3] }
```

`ordered_ids` must contain exactly the IDs of all parameters currently linked to this test (no more, no fewer). Assigns `position = 0, 1, 2, ...` in the given order.

Response `200`: full updated `Test` object (with `parameters[]` in new order).  
Response `400` if the provided IDs don't exactly match the test's current linked parameters.

---

## Section 4 — Summary Checklist

### DB migrations needed

- [ ] `packages`: add `original_lab_price`, `original_home_price`, `tat`, `is_featured`, `display_order`
- [ ] `tests`: add `sample_type`, `image_url`, `original_lab_price`, `original_home_price`, `display_order`
- [ ] `bookings`: add `address`
- [ ] New table: `banners`
- [ ] New table: `parameters`
- [ ] New table: `test_parameters` (join, with `position` column)

### Endpoints to add

- [ ] `PATCH /auth/me` — admin profile update (email + password)
- [ ] `GET /banners` — public active banners list
- [ ] `GET /admin/banners` — all banners
- [ ] `POST /admin/banners` — create banner
- [ ] `PUT /admin/banners/{id}` — update banner
- [ ] `DELETE /admin/banners/{id}` — delete banner
- [ ] `POST /admin/uploads/image` — image upload, returns URL
- [ ] `GET /admin/parameters` — list parameters (with `?search=`)
- [ ] `POST /admin/parameters` — create parameter
- [ ] `PUT /admin/parameters/{id}` — update parameter
- [ ] `DELETE /admin/parameters/{id}` — delete parameter
- [ ] `POST /admin/tests/{id}/parameters` — link parameter to test
- [ ] `DELETE /admin/tests/{id}/parameters/{parameter_id}` — unlink parameter from test
- [ ] `PUT /admin/tests/{id}/parameters/reorder` — reorder a test's parameters

### Serializer / schema updates needed

- [ ] All package responses: include the 5 new columns
- [ ] All test responses: include the 5 new columns + `parameters[]` array (ordered by `position`)
- [ ] All booking responses: include `address`
- [ ] `POST /admin/packages` + `PUT /admin/packages/{id}` request bodies: accept new fields
- [ ] `POST /admin/tests` + `PUT /admin/tests/{id}` request bodies: accept new fields
- [ ] `POST /bookings` request body: accept `address`
