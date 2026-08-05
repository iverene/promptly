# Promptly Security Setup

Promptly is a private, single-user application. Its application tables intentionally do not contain user or ownership columns, so the backend authorizes exactly one Supabase Auth user ID.

## 1. Create the only allowed user

1. Open Supabase Dashboard → Authentication → Users.
2. Add your user with an email and strong unique password.
3. Copy the user's UUID into `ALLOWED_USER_ID` in the backend environment.
4. Test the credentials locally.
5. Open Authentication → General Configuration and turn off **Allow new users to sign up**.
6. Keep anonymous sign-ins disabled.

Create the user before disabling signups. If it already exists, disable signups now.

## 2. Configure secrets

Frontend variables are compiled into public browser code. Only these public values belong there:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

Backend variables stay private:

```env
DATABASE_URL=your-runtime-pooler-url
DIRECT_URL=your-migration-url
CORS_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
ALLOWED_USER_ID=your-supabase-auth-user-id
```

Never add the database password, direct connection string, secret key, or service-role key to a `VITE_` variable. Promptly does not need the service-role key.

## 3. Configure Vercel

Create one Vercel project from the repository root. The root `vercel.json` deploys `frontend/` and `backend/` as separate services on one domain.

Frontend production variables:

- `VITE_API_URL=/api`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Backend production variables:

- `DATABASE_URL` using the Supabase transaction pooler
- `DIRECT_URL` using the direct or session connection for Prisma generation/migrations
- `CORS_ORIGIN=https://your-production-domain.vercel.app`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `ALLOWED_USER_ID`

If the project uses a custom domain, update `CORS_ORIGIN` to include that exact origin. Same-origin API calls are already allowed by the frontend Content Security Policy.

## 4. Enable dashboard protections

These controls cannot be enabled through repository code:

- In the Vercel project, enable **Deployment Protection → Standard Protection** for preview deployments.
- If your plan supports private production deployments, protect production too as an additional layer. Application authentication must remain enabled regardless.
- Enable a Vercel WAF rate-limit rule for `/api/*`; the Express limiter is a baseline per function instance, while WAF enforcement applies before traffic reaches the function.
- Enable Vercel spend alerts and review Function logs after launch.
- Enable Supabase backups appropriate to the project plan and test a restore procedure.
- Keep Supabase Auth attack protection and rate limits enabled.

## 5. Launch checks

- Confirm `/health` returns `200` without authentication.
- Confirm `/api/folders` returns `401` without a token.
- Confirm your allowed account can use all Promptly workflows.
- Confirm another Supabase account receives `403`.
- Confirm an unapproved browser origin does not receive CORS access.
- Confirm direct links such as `/settings` load on Vercel.
- Run `npm audit --omit=dev` and the production frontend build before each release.
