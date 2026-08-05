# Promptly — Schema

## folders
- id
- name
- description
- color
- is_archived
- created_at
- updated_at

## categories
- id
- folder_id
- name
- sort_order
- created_at
- updated_at

Categories are created explicitly from the prompt form. A new folder starts
empty, and a prompt must select an existing category or create a new one.

## prompts
- id
- category_id
- title
- content
- notes
- is_favorite
- is_archived
- created_at
- updated_at

## Relationships

Folder
└── Categories
    └── Prompts

A prompt belongs to one category.
A category belongs to one folder.

Search:
- Folder name
- Category name
- Prompt title
- Prompt content

No users table.
No tags.
Authentication is handled by Supabase Auth. The API permits the allowlisted
user ID and does not store a separate user record.
No AI generation tables.
No generated outputs.
No prompt versions.
