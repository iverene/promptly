import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
const allowedUserId = process.env.ALLOWED_USER_ID;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;

export async function requireAuth(request, response, next) {
  if (!supabase || !allowedUserId) {
    return response.status(503).json({ error: 'API authentication is not configured.' });
  }

  const authorization = request.headers.authorization;
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) return response.status(401).json({ error: 'Authentication required.' });

  try {
    const { data, error } = await supabase.auth.getClaims(match[1]);
    const claims = data?.claims;
    if (error || !claims?.sub) return response.status(401).json({ error: 'Invalid or expired session.' });
    if (claims.sub !== allowedUserId) return response.status(403).json({ error: 'This account is not authorized.' });

    request.auth = { userId: claims.sub, email: claims.email };
    next();
  } catch {
    response.status(401).json({ error: 'Unable to verify this session.' });
  }
}

