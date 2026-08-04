# Promptly — Architecture

## Structure

React Native + Expo
      |
   Axios
      |
Express API
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
- Navigation
- Search
- Copy
- Forms
- API calls

Backend responsibilities:
- CRUD
- Validation
- Transactions
- Business logic