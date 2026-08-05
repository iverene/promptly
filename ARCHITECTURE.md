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

Creating a folder creates only the folder and its selected pastel color.
Categories are added explicitly from the folder screen; no categories are
generated automatically.

Opening a folder queries and displays its prompts directly through each
prompt's category relationship. Category routes remain available, and prompt
cards retain their folder and category context.

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
- Business logic
