import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { requireAuth } from './middleware/auth.js';
import { apiRateLimit, mutationRateLimit } from './middleware/rateLimits.js';

export const app = express();
app.set('trust proxy', 1);
app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',').map((origin) => origin.trim()).filter(Boolean);
function isSameOriginRequest(request, origin) {
  if (!origin) return false;
  try {
    const requestOrigin = new URL(origin);
    const forwardedHost = request.get('x-forwarded-host')?.split(',')[0]?.trim();
    const forwardedProtocol = request.get('x-forwarded-proto')?.split(',')[0]?.trim();
    const host = forwardedHost || request.get('host');
    const protocol = forwardedProtocol || request.protocol;
    return requestOrigin.host === host && requestOrigin.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

function corsOptions(request) {
  return {
    origin(origin, callback) {
    const localDevelopmentOrigin = process.env.NODE_ENV !== 'production'
      && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin ?? '');
    if (!origin || allowedOrigins.includes(origin) || localDevelopmentOrigin || isSameOriginRequest(request, origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS.');
    error.status = 403;
    callback(error);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600,
  };
}
app.use((request, response, next) => cors(corsOptions(request))(request, response, next));
app.use(express.json({ limit: '1mb' }));
app.use(morgan((tokens, request, response) => [
  tokens.method(request, response), request.path, tokens.status(request, response),
  `${tokens['response-time'](request, response)} ms`,
].join(' ')));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRateLimit, mutationRateLimit, requireAuth, apiRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
