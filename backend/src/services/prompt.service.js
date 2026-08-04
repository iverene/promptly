import { prisma } from '../config/prisma.js';
import { HttpError } from '../lib/http.js';

const context = { category: { include: { folder: { select: { id: true, name: true } } } } };

export const promptService = {
  list({ categoryId, search = '', archived = false, favorite, recent, limit = 50 }) {
    return prisma.prompt.findMany({
      where: {
        isArchived: archived,
        ...(categoryId ? { categoryId } : {}),
        ...(favorite !== undefined ? { isFavorite: favorite } : {}),
        ...(search ? { OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } },
        ] } : {}),
      },
      include: context,
      orderBy: { updatedAt: 'desc' },
      take: recent ? Math.min(limit, 10) : limit,
    });
  },
  async get(id) {
    const prompt = await prisma.prompt.findUnique({ where: { id }, include: context });
    if (!prompt) throw new HttpError(404, 'Prompt not found');
    return prompt;
  },
  create(data) { return prisma.prompt.create({ data, include: context }); },
  update(id, data) { return prisma.prompt.update({ where: { id }, data, include: context }); },
  remove(id) { return prisma.prompt.delete({ where: { id } }); },
};

