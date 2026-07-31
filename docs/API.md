# CareHub Healthcare - API Reference

Base URL (development): `http://localhost:8000/api`

All request/response bodies are JSON. Admin endpoints require an `Authorization: Bearer <token>` header.
Validation errors return `422` with `{"detail": [{"field": "...", "message": "..."}]}`. Unexpected server errors
return a generic `500` message and never expose internal details.

---

## Authentication

### POST /auth/login

Log in as the administrator.

Request:
```json
{ "username": "admin", "password": "your-password" }
```

Response `200`:
```json
{ "access_token": "eyJhbGciOi...", "token_type": "bearer" }
```

Response `401`:
```json
{ "detail": "Invalid username or password." }
```

### GET /auth/me

Returns the authenticated admin's profile. Requires a valid token.

Response `200`:
```json
{ "id": 1, "username": "admin", "email": "admin@carehub.ae", "created_at": "2026-01-01T10:00:00Z" }
```

---

## Packages (public)

### GET /packages

Query params: `search`, `category`, `sort` (`price_asc` | `price_desc`). Returns only active packages.

Response `200`:
```json
[
  {
    "id": 1,
    "name": "Vital Guard Silver Health Check",
    "description": "Essential health screening...",
    "category": "Essential",
    "image_url": null,
    "lab_price": 249.0,
    "home_price": 299.0,
    "is_active": true,
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-01T10:00:00Z",
    "tests": [ { "id": 1, "name": "Complete Hemogram (CBC)", "...": "..." } ]
  }
]
```

### GET /packages/{id}

Returns a single active package, or `404` if not found.

---

## Packages (admin)

All routes below are under `/admin/packages` and require authentication.

| Method | Path | Description |
|---|---|---|
| GET | `/admin/packages` | List all packages (active and inactive) |
| GET | `/admin/packages/{id}` | Get a single package |
| POST | `/admin/packages` | Create a package |
| PUT | `/admin/packages/{id}` | Update a package |
| DELETE | `/admin/packages/{id}` | Delete a package |
| PATCH | `/admin/packages/{id}/tests` | Replace the package's included tests |
| DELETE | `/admin/packages/{id}/tests/{test_id}` | Remove a single test from a package |

Create/update request body:
```json
{
  "name": "Complete Wellness Profile",
  "description": "Comprehensive full-body check-up...",
  "category": "Comprehensive",
  "image_url": null,
  "lab_price": 499.0,
  "home_price": 599.0,
  "is_active": true,
  "test_ids": [1, 2, 3]
}
```

---

## Tests (public)

### GET /tests

Query params: `search`, `category`, `sort` (`price_asc` | `price_desc`). Returns only active tests.

### GET /tests/{id}

Returns a single active test, or `404` if not found.

---

## Tests (admin)

All routes below are under `/admin/tests` and require authentication.

| Method | Path | Description |
|---|---|---|
| GET | `/admin/tests` | List all tests (active and inactive) |
| GET | `/admin/tests/{id}` | Get a single test |
| POST | `/admin/tests` | Create a test |
| PUT | `/admin/tests/{id}` | Update a test |
| DELETE | `/admin/tests/{id}` | Delete a test |

Create/update request body:
```json
{
  "name": "HbA1c",
  "description": "Reflects average blood sugar levels...",
  "category": "Diabetes",
  "lab_price": 90.0,
  "home_price": 120.0,
  "tat": "24 hours",
  "is_active": true
}
```

---

## Bookings

### POST /bookings (public)

Submits a new booking request. No authentication required.

Request:
```json
{
  "customer_name": "Aisha Khan",
  "age": 32,
  "gender": "Female",
  "phone": "501234567",
  "email": "aisha@example.com",
  "preferred_date": "2026-08-01",
  "time_slot": "09:00 AM",
  "visit_mode": "home",
  "items": [
    { "item_type": "package", "item_id": 1 },
    { "item_type": "test", "item_id": 5 }
  ]
}
```

Response `201`:
```json
{
  "booking_reference": "CH-260726-A1B2",
  "total_amount": 419.0,
  "status": "New",
  "message": "Your booking has been received. Our team will contact you shortly."
}
```

Validation rules: name letters only, phone digits only (7-15 digits), valid email, date not in the past, time slot
must be one of the 12 allowed slots (7:00 AM - 6:00 PM), age between 1 and 99, at least one cart item.

### GET /admin/bookings (admin)

Query params: `search`, `status_filter` (`New` | `Contacted` | `Done`), `booking_date` (`YYYY-MM-DD`).

### GET /admin/bookings/{id} (admin)

Returns full booking detail including line items.

### PATCH /admin/bookings/{id}/status (admin)

Request:
```json
{ "status": "Contacted" }
```

### GET /admin/dashboard/stats (admin)

Returns dashboard counts and the five most recent bookings.

```json
{
  "total_packages": 3,
  "total_tests": 7,
  "total_bookings": 12,
  "new_bookings": 4,
  "status_summary": { "New": 4, "Contacted": 5, "Done": 3 },
  "recent_bookings": [ "...booking objects..." ]
}
```

---

## Notifications

### POST /notifications/whatsapp/test (admin)

Sends a test WhatsApp message to `WHATSAPP_DESTINATION_NUMBER` using the configured provider.

Response `200`:
```json
{ "sent": true, "configured": true, "message": "Test message sent." }
```
