import { prisma } from '../config/prisma.js';
import { HttpError } from '../lib/http.js';

const withCount = { folder: { select: { id: true, name: true } }, _count: { select: { prompts: { where: { isArchived: false } } } } };

export const categoryService = {
  list(folderId) {
    return prisma.category.findMany({ where: folderId ? { folderId } : {}, include: withCount, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] });
  },
  async get(id) {
    const category = await prisma.category.findUnique({ where: { id }, include: withCount });
    if (!category) throw new HttpError(404, 'Category not found');
    return category;
  },
  async create(data) {
    const sortOrder = data.sortOrder ?? await prisma.category.count({ where: { folderId: data.folderId } });
    return prisma.category.create({ data: { ...data, sortOrder }, include: withCount });
  },
  update(id, data) { return prisma.category.update({ where: { id }, data, include: withCount }); },
  remove(id) { return prisma.category.delete({ where: { id } }); },
};

