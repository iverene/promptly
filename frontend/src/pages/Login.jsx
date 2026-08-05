import { useState } from 'react';
import { KeyRound, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

export function AuthLoading() {
  return <main className="app-background grid min-h-screen place-items-center"><div className="flex items-center gap-3 text-sm font-medium text-secondary"><LoaderCircle className="animate-spin" size={20} />Securing your library…</div></main>;
}

export function AuthSetupRequired() {
  return <main className="app-background grid min-h-screen place-items-center p-4"><section className="glass-strong w-full max-w-lg rounded-[28px] p-7 sm:p-9"><span className="mb-5 grid size-14 place-items-center rounded-2xl bg-black text-white"><LockKeyhole size={23} /></span><h1 className="text-2xl font-semibold tracking-[-.6px]">Authentication setup required</h1><p className="mt-3 text-sm leading-6 text-secondary">Add the Supabase URL and publishable key to <code className="rounded bg-black/5 px-1.5 py-1">frontend/.env</code>, then restart Vite.</p><pre className="mt-5 overflow-x-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-200">VITE_SUPABASE_URL=https://…supabase.co{`\n`}VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…</pre></section></main>;
}

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) setError('Unable to sign in. Check your email and password.');
    setSubmitting(false);
  };
  return <main className="app-background grid min-h-screen place-items-center p-4"><section className="glass-strong w-full max-w-md rounded-[28px] p-6 sm:p-9"><div className="mb-8"><span className="mb-5 grid size-14 place-items-center rounded-[20px] bg-black text-xl font-semibold text-white">P</span><h1 className="text-3xl font-semibold tracking-[-1px]">Welcome to Promptly</h1><p className="mt-2 text-sm leading-6 text-secondary">Sign in to open your private fashion prompt library.</p></div><form onSubmit={submit} className="grid gap-5"><label><span className="mb-2 block text-sm font-medium">Email</span><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="focus-ring h-12 w-full rounded-2xl border border-black/10 bg-white/90 px-4" placeholder="you@example.com" /></label><label><span className="mb-2 block text-sm font-medium">Password</span><input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="focus-ring h-12 w-full rounded-2xl border border-black/10 bg-white/90 px-4" placeholder="Your password" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-danger">{error}</p>}<button disabled={submitting} className="focus-ring mt-1 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60">{submitting ? <LoaderCircle className="animate-spin" size={18} /> : <KeyRound size={18} />}{submitting ? 'Signing in…' : 'Sign in'}</button></form></section></main>;
}
