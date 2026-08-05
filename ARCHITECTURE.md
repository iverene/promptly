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

Creating a folder creates only the folder. Categories are prompt metadata: the
prompt form lets the user select an existing category in that folder or create
a new category inline before saving the prompt.

The folder detail API queries prompts through their category's `folder_id`, so
opening a folder displays its prompts directly.

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
