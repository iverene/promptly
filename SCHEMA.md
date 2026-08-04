# Promptly — Schema

## folders
- id
- name
- description
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

Default categories created with every new folder:
- Image
- Video
- Movements

Users may add more categories.

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
No authentication.
No AI generation tables.
No generated outputs.
No prompt versions.
