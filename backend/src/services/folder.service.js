import { prisma } from '../config/prisma.js';
import { HttpError } from '../lib/http.js';

const defaultCategories = ['Image', 'Video', 'Movements'];
const includeSummary = {
  categories: {
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { prompts: { where: { isArchived: false } } } } },
  },
};

export const folderService = {
  list({ search = '', archived = false }) {
    return prisma.folder.findMany({
      where: { isArchived: archived, ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}) },
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
    return prisma.$transaction((tx) => tx.folder.create({
      data: {
        ...data,
        categories: { create: defaultCategories.map((name, sortOrder) => ({ name, sortOrder })) },
      },
      include: includeSummary,
    }));
  },
  update(id, data) {
    return prisma.folder.update({ where: { id }, data, include: includeSummary });
  },
  remove(id) {
    return prisma.folder.delete({ where: { id } });
  },
};

