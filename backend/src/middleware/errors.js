import { Prisma } from '@prisma/client';

export function notFound(request, response) {
  response.status(404).json({ error: `Route ${request.method} ${request.originalUrl} not found` });
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return response.status(409).json({ error: 'That name already exists here.' });
    if (error.code === 'P2025') return response.status(404).json({ error: 'The requested item was not found.' });
  }
  const status = error.status ?? 500;
  if (status >= 500) console.error(error);
  response.status(status).json({ error: error.message ?? 'Unexpected server error', details: error.details });
}

