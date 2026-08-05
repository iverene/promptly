# Promptly — Architecture

## Structure

React + Vite Website
      |
Supabase Auth + Axios
      |
Express API
      |
JWT verification + allowlist
      |
Controllers
      |
Services
      |
Prisma
      |
Supabase PostgreSQL

## Backend Modules
- Folder
- Category
- Prompt

## MVC Flow
Routes → Controllers → Services → Prisma

## API
GET/POST/PATCH/DELETE
- /folders
- /categories
- /prompts

When creating a folder, execute one transaction:
1. Create folder
2. Create Image category
3. Create Video category
4. Create Movements category
Rollback if any step fails.

Frontend responsibilities:
- UI
- Responsive client-side navigation with Wouter
- Search
- Copy
- Forms
- API calls
- Authentication and session handling

Frontend implementation:
- React
- Vite
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Axios
- Lucide React

Backend responsibilities:
- CRUD
- Authentication and authorization
- Rate limiting
- Validation
- Transactions
- Business logic
