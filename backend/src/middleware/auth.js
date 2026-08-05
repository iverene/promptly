import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
const allowedUserId = process.env.ALLOWED_USER_ID;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;
const verifiedTokenCache = new Map();

function verificationUnavailable(error) {
  if (Number.isFinite(error?.status)) return error.status >= 500;
  const networkErrorNames = new Set(['AuthRetryableFetchError', 'TypeError', 'AbortError', 'TimeoutError']);
  if (networkErrorNames.has(error?.name)) return true;
  return /fetch|network|socket|timeout|econn|enotfound|eai_again/i.test(error?.message ?? '');
}

async function verifyAccessToken(accessToken) {
  const tokenKey = createHash('sha256').update(accessToken).digest('base64url');
  const cached = verifiedTokenCache.get(tokenKey);
  if (cached?.validUntil > Date.now()) return { data: { user: cached.user }, error: null };
  verifiedTokenCache.delete(tokenKey);

  let lastResult;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const { data, error } = await supabase.auth.getClaims(accessToken);
      const claims = data?.claims;
      if (claims?.sub) {
        const user = { id: claims.sub, email: claims.email };
        const tokenExpiresAt = Number(claims.exp) * 1_000;
        const validUntil = Math.min(tokenExpiresAt || Date.now(), Date.now() + 5 * 60_000);
        if (validUntil > Date.now()) verifiedTokenCache.set(tokenKey, { user, validUntil });
        return { data: { user }, error: null };
      }
      lastResult = { data: null, error: error ?? { status: 401, name: 'InvalidTokenError' } };
      if (!verificationUnavailable(lastResult.error)) return lastResult;
    } catch (error) {
      lastResult = { data: null, error };
    }
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return lastResult;
}

export async function requireAuth(request, response, next) {
  if (!supabase || !allowedUserId) {
    return response.status(503).json({ error: 'API authentication is not configured.' });
  }

  const authorization = request.headers.authorization;
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) return response.status(401).json({ error: 'Authentication required.' });

  try {
    const { data, error } = await verifyAccessToken(match[1]);
    const user = data?.user;
    if (error || !user?.id) {
      if (verificationUnavailable(error)) {
        console.error('Session verification unavailable:', error?.name, error?.status ?? 'no-status');
        response.set('Retry-After', '2');
        return response.status(503).json({ error: 'Session verification is temporarily unavailable.' });
      }
      return response.status(401).json({ error: 'Invalid or expired session.' });
    }
    if (user.id !== allowedUserId) return response.status(403).json({ error: 'This account is not authorized.' });

    request.auth = { userId: user.id, email: user.email };
    next();
  } catch (error) {
    console.error('Unexpected session verification failure:', error?.name, error?.message);
    response.status(503).json({ error: 'Session verification is temporarily unavailable.' });
  }
}
