# CareHub Healthcare - Deployment Guide

## 1. Environment Variables

Copy and fill in these files before deploying - never commit real secrets:

- `.env.example` → `.env` (root, used by `docker-compose.yml`)
- `backend/.env.example` → `backend/.env`
- `frontend/.env.example` → `frontend/.env`

| Variable | Used by | Description |
|---|---|---|
| `DATABASE_URL` | backend | PostgreSQL connection string |
| `JWT_SECRET_KEY` | backend | Long random secret for signing admin JWTs |
| `JWT_ALGORITHM` | backend | Default `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | backend | Admin session length, default `1440` |
| `ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | backend seed script | Creates the single admin account |
| `WHATSAPP_API_URL` | backend | Meta WhatsApp Cloud API base URL |
| `WHATSAPP_ACCESS_TOKEN` | backend | Meta Cloud API access token |
| `WHATSAPP_PHONE_NUMBER_ID` | backend | Meta Cloud API phone number ID |
| `WHATSAPP_DESTINATION_NUMBER` | backend | Clinic's WhatsApp number that receives booking alerts |
| `CORS_ORIGINS` | backend | Comma-separated list of allowed frontend origins |
| `VITE_API_BASE_URL` | frontend | Public API base URL, e.g. `https://api.carehubhealthcare.ae/api` |

## 2. PostgreSQL Setup

**Docker Compose (recommended for local/staging):**

```bash
docker compose up -d
```

**Managed PostgreSQL (production):** provision a PostgreSQL 16 instance (e.g. RDS, Azure Database for PostgreSQL,
or a managed provider) and set `DATABASE_URL` accordingly. Then run migrations:

```bash
cd backend
alembic upgrade head
python -m app.seed.seed_data   # optional - seeds sample data + the admin account
```

## 3. Backend Deployment

The FastAPI app is a standard ASGI app (`app.main:app`). Any ASGI host works (Railway, Render, Fly.io, a VM behind
Nginx, etc).

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For production, run behind a process manager (systemd, supervisor) or with multiple workers:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Put a reverse proxy (Nginx) in front for TLS termination, and set `CORS_ORIGINS` to the deployed frontend URL(s).

## 4. Frontend Deployment

```bash
cd frontend
npm install
npm run build
```

This produces a static build in `frontend/dist/`, deployable to any static host (Netlify, Vercel, S3 + CloudFront,
Nginx). Set `VITE_API_BASE_URL` at build time to point at the deployed backend's `/api` path.

## 5. WhatsApp Configuration

CareHub sends a WhatsApp message to `WHATSAPP_DESTINATION_NUMBER` whenever a new booking is created, via
`app/services/whatsapp_service.py`.

**Meta WhatsApp Cloud API (built-in):**
1. Create a Meta developer app with the WhatsApp product enabled.
2. Note the Phone Number ID and generate a permanent access token.
3. Set `WHATSAPP_API_URL=https://graph.facebook.com/v20.0`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and
   `WHATSAPP_DESTINATION_NUMBER` (the clinic's number, in international format without `+`).
4. Restart the backend. Verify with `POST /api/notifications/whatsapp/test` (admin authenticated).

**Switching providers (e.g. Twilio):** implement a class with the same `send(to, message) -> bool` interface as
`MetaCloudAPIProvider` in `whatsapp_service.py`, then update `WhatsAppService._build_provider` to select it based on
your own environment variables. No other application code needs to change.

If WhatsApp is not configured, notifications are skipped and logged - bookings are never lost or blocked.
