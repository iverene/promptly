import { useState } from 'react';
import { KeyRound, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '../providers/AuthProvider';

export function AuthLoading() {
  return <main className="app-background grid min-h-screen place-items-center"><div className="glass flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium text-secondary"><LoaderCircle className="animate-spin" size={18} />Securing your library…</div></main>;
}

export function AuthSetupRequired() {
  return <main className="app-background grid min-h-screen place-items-center p-5"><section className="glass-strong soft-enter w-full max-w-lg rounded-[32px] p-7 sm:p-10"><span className="mb-7 grid size-14 place-items-center rounded-full bg-black text-white"><LockKeyhole size={21} strokeWidth={1.7} /></span><p className="text-[10px] uppercase tracking-[.2em] text-muted">Promptly setup</p><h1 className="mt-3 text-4xl font-medium tracking-[-.065em]">Authentication required.</h1><p className="mt-4 text-sm leading-6 text-secondary">Add the Supabase URL and publishable key to <code className="rounded bg-black/5 px-1.5 py-1">frontend/.env</code>, then restart Vite.</p><pre className="mt-6 overflow-x-auto rounded-[20px] bg-zinc-950 p-5 text-xs leading-6 text-zinc-200">VITE_SUPABASE_URL=https://…supabase.co{`\n`}VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…</pre></section></main>;
}

export default function Login() {
  const { signIn } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    if (signInError) setError(signInError.message || 'Unable to sign in. Check your email and password.');
    else navigate('/home', { replace: true });
    setSubmitting(false);
  };
  return <main className="app-background grid min-h-screen place-items-center p-5"><div className="soft-enter grid w-full max-w-5xl overflow-hidden rounded-[34px] border border-black/20 bg-white/58 shadow-[0_28px_80px_rgba(17,17,17,.09)] backdrop-blur-2xl lg:grid-cols-[1.05fr_.95fr]">
    <section className="hidden min-h-[620px] flex-col justify-between bg-black p-12 text-white lg:flex"><span className="text-2xl font-medium tracking-[-.05em]">Promptly.</span><div><h1 className="mt-5 max-w-lg text-5xl font-medium leading-[.9] tracking-[-.075em]">Every good idea, filed beautifully.</h1></div></section>
    <section className="flex min-h-[560px] flex-col justify-center p-7 sm:p-12"><span className="mb-8 grid size-14 place-items-center rounded-full bg-black text-xl font-medium text-white lg:hidden">P</span><p className="text-[10px] uppercase tracking-[.2em] text-muted">Welcome back</p><h2 className="mt-3 text-4xl font-medium tracking-[-.065em]">Open your library.</h2><p className="mt-3 text-sm leading-6 text-secondary">Sign in to your private Promptly collection.</p><form onSubmit={submit} autoComplete="off" data-form-type="other" className="mt-9 grid gap-5"><label><span className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-secondary">Email</span><input required type="email" name="promptly-account-email" autoComplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" value={email} onChange={(event) => setEmail(event.target.value)} className="focus-ring h-13 w-full rounded-[18px] border border-black/20 bg-white/80 px-4" placeholder="you@example.com" /></label><label><span className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-secondary">Password</span><input required type="password" name="promptly-account-secret" autoComplete="new-password" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" value={password} onChange={(event) => setPassword(event.target.value)} className="focus-ring h-13 w-full rounded-[18px] border border-black/20 bg-white/80 px-4" placeholder="Your password" /></label>{error && <p role="alert" className="rounded-[16px] bg-red-50 px-4 py-3 text-sm text-danger">{error}</p>}<button disabled={submitting} className="focus-ring mt-2 flex min-h-13 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60">{submitting ? <LoaderCircle className="animate-spin" size={18} /> : <KeyRound size={18} strokeWidth={1.7} />}{submitting ? 'Signing in…' : 'Sign in'}</button></form></section>
  </div></main>;
}
