import { z } from 'zod';

const text = (label, max = 120) => z.string().trim().min(1, `${label} is required`).max(max);
const optionalText = (max) => z.string().trim().max(max).optional().nullable();
const folderColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Choose a valid folder color');

export const idParams = z.object({ id: z.string().min(1) });
export const folderCreate = z.object({ name: text('Name'), description: optionalText(500), color: folderColor.optional() });
export const folderUpdate = folderCreate.partial().extend({ isArchived: z.boolean().optional() });
export const categoryCreate = z.object({ folderId: z.string().min(1), name: text('Name'), sortOrder: z.number().int().nonnegative().optional() });
export const categoryUpdate = z.object({ name: text('Name').optional(), sortOrder: z.number().int().nonnegative().optional() });
export const promptCreate = z.object({
  categoryId: z.string().min(1), title: text('Title', 180), content: text('Prompt', 30000),
  notes: optionalText(10000), isFavorite: z.boolean().optional(),
});
export const promptUpdate = promptCreate.partial().extend({ isArchived: z.boolean().optional() });
