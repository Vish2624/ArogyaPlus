# CareHub Healthcare - Database Documentation

Engine: PostgreSQL 16. Schema is managed with Alembic (`backend/alembic/versions/0001_initial.py`).

## Tables

### admins

The single administrator account.

| Column | Type | Notes |
|---|---|---|
| id | integer, PK | |
| username | varchar(50), unique | |
| email | varchar(255), unique | |
| password_hash | varchar(255) | bcrypt hash, never plain text |
| created_at | timestamptz | default now() |

### tests

Individual laboratory tests.

| Column | Type | Notes |
|---|---|---|
| id | integer, PK | |
| name | varchar(150) | |
| description | text, nullable | |
| category | varchar(100), nullable | |
| lab_price | numeric(10,2) | AED |
| home_price | numeric(10,2) | AED |
| tat | varchar(50), nullable | report turnaround time, e.g. "24 hours" |
| is_active | boolean | default true |
| created_at / updated_at | timestamptz | |

### packages

Health packages made up of one or more tests.

| Column | Type | Notes |
|---|---|---|
| id | integer, PK | |
| name | varchar(150) | |
| description | text, nullable | |
| category | varchar(100), nullable | |
| image_url | varchar(500), nullable | |
| lab_price | numeric(10,2) | AED |
| home_price | numeric(10,2) | AED |
| is_active | boolean | default true |
| created_at / updated_at | timestamptz | |

### package_tests

Many-to-many association between `packages` and `tests`.

| Column | Type | Notes |
|---|---|---|
| package_id | integer, FK → packages.id (cascade delete) | composite PK |
| test_id | integer, FK → tests.id (cascade delete) | composite PK |

### bookings

A customer's booking request. No account/user table is involved - bookings are anonymous.

| Column | Type | Notes |
|---|---|---|
| id | integer, PK | |
| booking_reference | varchar(30), unique | e.g. `CH-260726-A1B2` |
| customer_name | varchar(150) | |
| age | integer | 1-99 |
| gender | varchar(10) | `Male` \| `Female` |
| phone | varchar(30) | digits only |
| email | varchar(255) | |
| preferred_date | date | |
| time_slot | varchar(20) | one of 12 slots, 07:00 AM - 06:00 PM |
| visit_mode | varchar(10) | `home` \| `lab` |
| total_amount | numeric(10,2) | sum of item prices at the chosen visit mode |
| status | varchar(20) | `New` \| `Contacted` \| `Done`, default `New` |
| created_at / updated_at | timestamptz | |

### booking_items

Line items for a booking. `item_id` references either a `package` or a `test` depending on `item_type` (no FK
constraint, since it is polymorphic); `item_name` and `price` are snapshotted at booking time so historical bookings
remain accurate even if a package/test is later edited or removed.

| Column | Type | Notes |
|---|---|---|
| id | integer, PK | |
| booking_id | integer, FK → bookings.id (cascade delete) | |
| item_type | varchar(10) | `package` \| `test` |
| item_id | integer | id of the package or test at booking time |
| item_name | varchar(150) | snapshot of the name |
| price | numeric(10,2) | snapshot of the price for the chosen visit mode |
| quantity | integer | default 1 |

## Relationships

- `packages` ↔ `tests` is many-to-many via `package_tests`.
- `bookings` → `booking_items` is one-to-many, cascade delete.
- `booking_items.item_id` is a soft reference to either `packages.id` or `tests.id`, disambiguated by `item_type`.
