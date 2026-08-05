import { rateLimit } from 'express-rate-limit';

const common = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
};

export const apiRateLimit = rateLimit({ ...common, limit: 120 });

export const mutationRateLimit = rateLimit({
  ...common,
  limit: 40,
  skip: (request) => ['GET', 'HEAD', 'OPTIONS'].includes(request.method),
});

