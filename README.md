# Promptly

Promptly is a mobile-first prompt library for fashion image and video workflows. It stores, organizes, searches, favorites, archives, and copies reusable prompts; it does not generate AI content.

## Structure

- `frontend/` — Expo, React Native, Expo Router, NativeWind, TanStack Query
- `backend/` — Express, Prisma, PostgreSQL, Zod

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` (plus `DIRECT_URL` for Supabase migrations).
2. Copy `frontend/.env.example` to `frontend/.env` and set `EXPO_PUBLIC_API_URL` to an address reachable by the device.
3. Run `npm install` at the repository root.
4. Run `npm run prisma:generate --workspace backend` and `npm run prisma:migrate --workspace backend`.
5. Start the API with `npm run dev:backend` and Expo with `npm run dev:frontend`.

The API defaults to `http://localhost:4000/api`. On a physical phone, use the computer's LAN IP in the frontend environment file.

