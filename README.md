# Promptly

Promptly is a responsive web prompt library for fashion image and video workflows. It stores, organizes, searches, favorites, archives, and copies reusable prompts; it does not generate AI content.

## Structure

- `frontend/` — React, Vite, Tailwind CSS, Wouter, TanStack Query
- `backend/` — Express, Prisma, PostgreSQL, Zod

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` (plus `DIRECT_URL` for Supabase migrations).
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the backend API URL.
3. Run `npm install` at the repository root.
4. Run `npm run prisma:generate --workspace backend` and `npm run prisma:migrate --workspace backend`.
5. Start the API with `npm run dev:backend` and Vite with `npm run dev:frontend`.

The API defaults to `http://localhost:4000/api`. Vite serves the website at `http://localhost:5173`.

## Production build

Run `npm run build --workspace frontend`. Deploy `frontend/dist/` to a static host and configure that host to route unknown paths to `index.html` for client-side routing. Set `VITE_API_URL` during the build to the deployed Express API URL.
