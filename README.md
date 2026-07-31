# CareHub Healthcare

## 1. Project Description

CareHub Healthcare is a health-package booking website and admin panel for a healthcare company in Dubai, UAE.
Customers can browse health packages and individual laboratory tests, mix them in a single cart, choose between a
Home Visit or Lab Visit, and submit a booking request without creating an account. Every booking is saved by the
backend API, appears immediately in the admin panel, and triggers a WhatsApp notification through a pluggable
WhatsApp Business API abstraction.

**This repository contains the frontend only.** The backend is a separately hosted service at
`https://arogyaplus-healthcare-api.onrender.com` (same API endpoints/responses as the original local FastAPI
backend). The frontend talks to it via `VITE_API_BASE_URL` — see [Installation](#11-installation).

## 2. Features

**Public website**
- Landing page with hero, featured packages, featured tests, "How It Works" and testimonials sections
- Full packages catalogue with search, category filter and price sort
- Full lab test catalogue with search, category filter and price sort
- Global cart that mixes packages and individual tests
- Home Visit / Lab Visit selection with live price recalculation
- Booking form with date and time-slot selection (7:00 AM - 6:00 PM) and full validation
- Booking success screen with a booking reference number
- Privacy Policy and Terms of Use pages
- Fully responsive (mobile, tablet, desktop)

**Admin panel**
- Single-administrator JWT authentication
- Dashboard with package/test/booking counts and recent bookings
- Package management, including assigning/removing included tests
- Test management
- Booking management with search, status and date filters, and status updates (New / Contacted / Done)

**Notifications**
- WhatsApp notification sent on every new booking, through a swappable provider abstraction
- Booking is never lost if the WhatsApp notification fails

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios, Zustand, React Hook Form, Zod, Lucide React |
| Backend | Hosted separately at `https://arogyaplus-healthcare-api.onrender.com` (not part of this repo) |
| Notifications | WhatsApp Business API abstraction (Meta Cloud API ready), handled by the backend service |
| Dev tooling | Environment variables, REST API |

## 4. Frontend

Built with Vite + React + TypeScript. Tailwind CSS provides the design system. Zustand stores manage the cart and
admin auth session; React Hook Form + Zod handle form state and validation; Axios wraps all API calls behind a
typed service layer in `src/services`.

## 5. Backend

The backend is a separate FastAPI service, hosted at `https://arogyaplus-healthcare-api.onrender.com`, and is not
part of this repository. It exposes the same REST API endpoints and response shapes documented in
[docs/API.md](docs/API.md) and [docs/DATABASE.md](docs/DATABASE.md) (kept here for reference only — those docs
describe the API contract this frontend expects, not code that lives in this repo).

## 6. Database

Managed entirely by the separately hosted backend service. See [docs/DATABASE.md](docs/DATABASE.md) for the schema
reference.

## 7. Authentication

A single administrator account authenticates with a username/email and password. On success the API returns a JWT
access token, which the frontend stores and attaches to every admin request. Expired or invalid tokens return
`401 Unauthorized` and the frontend redirects back to `/admin/login`. Customers never need an account.

## 8. API Handling

All frontend network calls go through a single Axios instance (`src/services/api.ts`) that attaches the admin JWT
automatically, normalises error messages, and never leaks raw backend errors to the UI. See
[docs/API.md](docs/API.md) for the full endpoint reference.

## 9. Notifications

`app/services/whatsapp_service.py` defines a `NotificationProvider` interface. The default `MetaCloudAPIProvider`
implementation sends messages via the Meta WhatsApp Cloud API using environment variables only - no hardcoded keys.
A different provider (e.g. Twilio) can be plugged in by implementing the same interface.

## 10. Project Structure

```
carehub-healthcare/
├── README.md
├── .gitignore
├── frontend/            # React + TypeScript + Vite app (this repo's only app)
└── docs/                # API and database reference documentation for the external backend
```

The backend lives in a separate repository/service and is not part of this project. See the full frontend tree in
`frontend/src` — organised by responsibility (components, pages, services, store, types, utils, etc).

## 11. Installation

### Prerequisites
- Node.js 18+

```bash
cd frontend
cp .env.example .env
npm install
```

`frontend/.env` sets `VITE_API_BASE_URL`, which already points at the hosted backend:

```
VITE_API_BASE_URL=https://arogyaplus-healthcare-api.onrender.com/api
```

Point it at a different backend (e.g. a local instance of the API service) if needed.

## 12. Frontend Installation

```bash
cd frontend
npm install
```

## 13. Backend

Not part of this repository. The hosted API is at `https://arogyaplus-healthcare-api.onrender.com` — see
[docs/API.md](docs/API.md) for the endpoint reference this frontend relies on.

## 14. Database

Not part of this repository — managed by the backend service. See [docs/DATABASE.md](docs/DATABASE.md) for the
schema reference.

## 15. Start Development Server

From `frontend/`:

```bash
npm run dev
```

The site runs at `http://localhost:5173` and talks to the hosted API at
`https://arogyaplus-healthcare-api.onrender.com`. Sign in to the admin panel at
`http://localhost:5173/admin/login` using the credentials configured on the backend service.

## 16. Running Tests

This starter project does not ship an automated test suite. Recommended checks before deploying:

```bash
cd frontend && npm run typecheck && npm run build
```

## 17. Authentication

See section 7 above. JWT tokens are valid for `ACCESS_TOKEN_EXPIRE_MINUTES` (default 1440 minutes / 24 hours).

## 18. Responsive Design

Every page is designed and tested against mobile (375px), tablet (768px), laptop (1024px) and desktop (1440px)
breakpoints, including the admin panel.

## 19. API Documentation

Interactive docs are auto-generated by the hosted backend's FastAPI instance at
`https://arogyaplus-healthcare-api.onrender.com/docs`. A written reference with request and response examples is in
[docs/API.md](docs/API.md).

## 20. Database Documentation

See [docs/DATABASE.md](docs/DATABASE.md) for tables, relationships and field descriptions (reference only — the
database itself is managed by the backend service, not this repo).

## 21. Deployment

This repository only needs a static/Node frontend deployment (e.g. Vercel, Netlify, or any static host after
`npm run build`), with `VITE_API_BASE_URL` set to `https://arogyaplus-healthcare-api.onrender.com/api`. Backend
deployment, PostgreSQL setup and WhatsApp configuration are handled by the separate backend service — see
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for that reference (kept for background, not applicable to this repo).

## 22. Future Improvements

- Multi-admin roles and permissions
- Online payment integration
- Customer accounts and booking history
- Advanced analytics and reporting
- Arabic/RTL localization
- LIMS / e-report integration
