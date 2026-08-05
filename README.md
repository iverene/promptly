# Promptly

Promptly is a private, responsive prompt library for organizing reusable fashion image and video prompts. It stores, searches, favorites, archives, categorizes, and copies prompts; it does not generate AI content.

The frontend is an installable Progressive Web App (PWA) for mobile and desktop.

## Features

- Folder-based prompt organization with custom pastel or hex colors
- Explicit categories created while composing a prompt
- Prefix search: results must start with the entered text
- Favorite, copy, edit, archive, restore, and delete workflows
- Archive overview showing five folders and five prompts, with full-list pages
- Persistent Supabase authentication and a single-user backend allowlist
- Responsive mobile bottom navigation and desktop sidebar navigation
- Install prompt, standalone display mode, app shortcuts, and offline app-shell caching
- Reusable React components for folders, categories, action menus, colors, prompts, and installation UI

## Technology

### Frontend

- React 19 and Vite 8
- Tailwind CSS 4
- Wouter
- TanStack Query
- React Hook Form and Zod
- Axios
- Supabase Auth
- Lucide React

### Backend

- Node.js 20+
- Express 5
- Prisma 6
- PostgreSQL hosted by Supabase
- Supabase JWT verification
- Zod validation, Helmet, CORS, and rate limiting

## Project structure

```text
frontend/
  public/                 PWA manifest, service worker, and icons
  src/components/         Reusable UI components
  src/pages/              Route-level screens
  src/providers/          Authentication and toast state
  src/api/                Axios and Supabase clients

backend/
  prisma/                 Database schema and migrations
  src/controllers/        HTTP controllers
  src/services/           Business and Prisma operations
  src/middleware/         Authentication, security, and errors
  src/routes/             API routes
```

The request flow is:

```text
React PWA → Supabase Auth → Express API → Prisma → Supabase PostgreSQL
```

## Prerequisites

- Node.js 20 or later
- npm
- A Supabase project
- One Supabase Auth user
- Supabase pooled and direct PostgreSQL connection strings

## Local setup

1. Create the only allowed account in Supabase Authentication.
2. Copy its user UUID for `ALLOWED_USER_ID`.
3. After the account exists and has been tested, disable **Allow new users to sign up** and keep anonymous sign-ins disabled.
4. Copy the environment templates:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

On Windows, copy the files through File Explorer or PowerShell.

5. Install dependencies from the repository root:

```bash
npm install
```

6. Generate Prisma Client and create/apply the local migration:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
```

7. Start the backend and frontend in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

The API defaults to `http://localhost:4000/api`. Vite runs at `http://localhost:5173`.

## Environment variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

`VITE_API_URL` must include `/api`. Every `VITE_*` value is compiled into public browser code, so never put a database password, secret key, or service-role key in the frontend.

### Backend (`backend/.env`)

```env
DATABASE_URL="your-supabase-transaction-pooler-url"
DIRECT_URL="your-supabase-direct-or-session-url"
PORT=4000
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
ALLOWED_USER_ID=your-supabase-auth-user-uuid
```

Promptly does not use the Supabase service-role key. Keep it out of this project unless a future server-only feature explicitly requires it.

## Application workflow

1. Create a folder and choose a color.
2. Open the folder to view its prompts directly.
3. Create a prompt.
4. Select an existing category or enter a name and press `+` to create and select a new category immediately.
5. Enter the title, prompt text, and optional notes, then save.
6. Favorite, copy, edit, archive, or delete the prompt from its detail page.

Creating a folder does not create automatic categories.

The Archive page displays up to five archived folders and five archived prompts. A **See more** button opens the complete list for that archive type.

## PWA and installation

The PWA implementation includes:

- `frontend/public/manifest.webmanifest`
- `frontend/public/sw.js`
- 192px, 512px, and maskable icons
- Home, Favorites, and Archive shortcuts
- A browser install prompt for Chrome, Edge, and Android
- **Share → Add to Home Screen** guidance for iPhone and iPad
- Offline caching of the application shell and static same-origin assets

Authenticated API requests, `/api/*`, mutation requests, and cross-origin requests are never stored by the service worker.

Service-worker registration is enabled for production builds. Test installation locally with:

```bash
npm run build --workspace frontend
npm run preview --workspace frontend
```

Then open the Vite Preview URL. A deployed PWA must use HTTPS; localhost is the development exception.

If the application is already installed or the install prompt was dismissed during the current browser session, the prompt will not be shown again immediately.

## Checks and production build

Run repository checks:

```bash
npm run check
```

Build the frontend:

```bash
npm run build --workspace frontend
```

Apply committed production migrations before or during backend deployment:

```bash
npm run prisma:deploy --workspace backend
```

## Production deployment

Deploy the repository as one Vercel project containing the `frontend` and `backend` services. The root `vercel.json` sends `/api/*` to Express and all other routes to Vite, so both services share one stable production domain.

### Frontend

The `frontend` service uses Vite and publishes `dist`. The included `frontend/vercel.json` provides SPA rewrites, security headers, PWA headers, and asset caching.

Set:

```env
VITE_API_URL=/api
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Redeploy after changing a `VITE_*` value because these values are embedded during the build.

### Backend

The `backend` service is automatically detected as Express from `backend/src/app.js`. Set:

```env
DATABASE_URL=your-supabase-runtime-pooler-url
DIRECT_URL=your-supabase-migration-url
CORS_ORIGIN=https://your-production-domain.com
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
ALLOWED_USER_ID=your-supabase-auth-user-uuid
NODE_ENV=production
```

`CORS_ORIGIN` is the frontend origin only: no path and no trailing slash. Multiple exact origins can be comma-separated:

```env
CORS_ORIGIN=https://promptly.example.com,https://promptly.vercel.app
```

Use the Supabase transaction pooler for `DATABASE_URL` because Vercel Functions can create concurrent database connections. `DIRECT_URL` remains the direct/session connection used for Prisma migrations. See [Using Express.js with Vercel](https://vercel.com/kb/guide/ship-a-express-app-on-vercel).

### Supabase Authentication

In Supabase Authentication URL configuration:

- Set **Site URL** to the deployed frontend origin.
- Add any approved frontend callback URLs if authentication methods later require redirects.
- Keep public signups and anonymous sign-ins disabled for this private deployment.

## Security

Every `/api` route requires a verified Supabase session belonging to `ALLOWED_USER_ID`. The backend retries genuine transient verification failures, distinguishes expired sessions from outages, and briefly caches verified token claims without storing browser sessions.

The API also applies restrictive CORS, request and mutation rate limits, Helmet headers, safe request logging, Zod validation, and a 1 MB JSON limit. The frontend deployment config includes CSP, anti-framing, referrer, permissions, SPA-routing, PWA, and static-asset headers.

Before launch, verify:

- `/health` returns `200` without authentication.
- `/api/folders` returns `401` without a token.
- The allowed account can complete every workflow.
- Another Supabase account receives `403`.
- An unapproved origin is rejected by CORS.
- Direct frontend routes load after refresh.
- The PWA manifest, service worker, icons, and install prompt work over HTTPS.
- Database backups and restore procedures are configured.

See [SECURITY.md](SECURITY.md) for the complete production security checklist. See [ARCHITECTURE.md](ARCHITECTURE.md), [SCHEMA.md](SCHEMA.md), and [DESIGN.md](DESIGN.md) for implementation details.
