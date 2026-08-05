import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearPersistedSession, getValidSession, supabase, supabaseConfigured } from '../api/supabase';

const AuthContext = createContext(null);

function userDisplayName(user) {
  return user?.user_metadata?.display_name
    || user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'Promptly user';
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }

    let mounted = true;
    let initialized = false;
    getValidSession(true).then((storedSession) => {
      if (mounted) {
        initialized = true;
        setSession(storedSession);
        setLoading(false);
      }
    }).catch(() => { if (mounted) setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!initialized && event === 'INITIAL_SESSION') return;
      if (mounted) { setSession(nextSession); setLoading(false); }
    });
    const unauthorized = () => {
      clearPersistedSession();
      if (mounted) setSession(null);
    };
    window.addEventListener('promptly:unauthorized', unauthorized);
    return () => { mounted = false; subscription.unsubscribe(); window.removeEventListener('promptly:unauthorized', unauthorized); };
  }, []);

  const updateDisplayName = useCallback(async (displayName) => {
    const result = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } });
    if (result.data.user) setSession((current) => current ? { ...current, user: result.data.user } : current);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    const result = await supabase.auth.signOut();
    if (result.error) clearPersistedSession();
    setSession(null);
    return { error: null };
  }, []);

  const value = useMemo(() => ({
    configured: supabaseConfigured,
    loading,
    session,
    user: session?.user ?? null,
    displayName: userDisplayName(session?.user),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut,
    updateDisplayName,
  }), [loading, session, signOut, updateDisplayName]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
