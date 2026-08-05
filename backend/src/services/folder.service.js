import { prisma } from '../config/prisma.js';
import { HttpError } from '../lib/http.js';

const includeSummary = {
  categories: {
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { prompts: { where: { isArchived: false } } } } },
  },
};

export const folderService = {
  list({ search = '', archived = false }) {
    const normalizedSearch = search.trim();
    return prisma.folder.findMany({
      where: { isArchived: archived, ...(normalizedSearch ? { name: { startsWith: normalizedSearch, mode: 'insensitive' } } : {}) },
      include: includeSummary,
      orderBy: { updatedAt: 'desc' },
    });
  },
  async get(id) {
    const folder = await prisma.folder.findUnique({ where: { id }, include: includeSummary });
    if (!folder) throw new HttpError(404, 'Folder not found');
    return folder;
  },
  create(data) {
    return prisma.folder.create({ data, include: includeSummary });
  },
  update(id, data) {
    return prisma.folder.update({ where: { id }, data, include: includeSummary });
  },
  remove(id) {
    return prisma.folder.delete({ where: { id } });
  },
};
