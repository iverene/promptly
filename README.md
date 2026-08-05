# Promptly

Promptly is a responsive web prompt library for fashion image and video workflows. It stores, organizes, searches, favorites, archives, and copies reusable prompts; it does not generate AI content.

## Structure

- `frontend/` — React, Vite, Tailwind CSS, Wouter, TanStack Query
- `backend/` — Express, Prisma, PostgreSQL, Zod

## Local setup

1. In Supabase Authentication, create your one Promptly user and copy its user ID. Then disable new user signups.
2. Copy `backend/.env.example` to `backend/.env`; configure the database URLs, Supabase URL and publishable key, `ALLOWED_USER_ID`, and exact frontend `CORS_ORIGIN`.
3. Copy `frontend/.env.example` to `frontend/.env`; configure `VITE_API_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Run `npm install` at the repository root.
5. Run `npm run prisma:generate --workspace backend` and `npm run prisma:migrate --workspace backend`.
6. Start the API with `npm run dev:backend` and Vite with `npm run dev:frontend`.

The API defaults to `http://localhost:4000/api`. Vite serves the website at `http://localhost:5173`.

## Production build

Run `npm run build --workspace frontend`. Deploy `frontend/dist/` to a static host and configure that host to route unknown paths to `index.html` for client-side routing. Set `VITE_API_URL` during the build to the deployed Express API URL.

## Security

Every `/api` route requires a valid Supabase session belonging to the single `ALLOWED_USER_ID`. The API also applies request and mutation rate limits, restrictive CORS, Helmet headers, safe request logging, Zod validation, and a 1 MB body limit. The Vercel frontend configuration adds SPA routing, CSP, anti-framing, referrer, permissions, and immutable asset-cache headers.

See [SECURITY.md](SECURITY.md) for the required Supabase and Vercel dashboard controls before production deployment.
