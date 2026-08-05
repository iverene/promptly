import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const authStorageKey = 'promptly-auth-session';
const projectRef = (() => { try { return new URL(supabaseUrl).hostname.split('.')[0]; } catch { return ''; } })();

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
        storageKey: authStorageKey,
      },
    })
  : null;

let refreshPromise;

export function clearPersistedSession() {
  window.localStorage.removeItem(authStorageKey);
  if (projectRef) window.localStorage.removeItem(`sb-${projectRef}-auth-token`);
}

export async function getValidSession(forceRefresh = false) {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  const expiresSoon = session?.expires_at && (session.expires_at * 1000) - Date.now() < 60_000;
  if (!session || (!forceRefresh && !expiresSoon)) return session;

  if (!refreshPromise) {
    refreshPromise = supabase.auth.refreshSession()
      .then(({ data: refreshed, error }) => error ? null : refreshed.session)
      .catch(() => null)
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}
