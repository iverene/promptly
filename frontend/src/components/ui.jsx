import { ArrowLeft, Archive, FolderHeart, Home, LoaderCircle, LogOut, Plus, Search, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../providers/AuthProvider';

export function AppShell({ children }) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const logout = async () => { queryClient.clear(); await signOut(); };
  const navigation = [{ to: '/home', label: 'Library', icon: Home }, { to: '/settings', label: 'Archive', icon: Archive }];
  return <div className="app-background min-h-screen">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-black/5 bg-white/55 p-5 backdrop-blur-2xl lg:flex lg:flex-col">
      <Link href="/home" className="focus-ring mb-10 flex items-center gap-3 rounded-2xl"><span className="grid size-11 place-items-center rounded-2xl bg-black text-lg font-semibold text-white">P</span><span><span className="block text-xl font-semibold tracking-[-.5px]">Promptly</span><span className="text-xs text-muted">Fashion prompt library</span></span></Link>
      <nav className="space-y-2">{navigation.map(({ to, label, icon: Icon }) => { const active = location === to; return <Link key={to} href={to} className={`focus-ring flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition ${active ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-secondary hover:bg-white/70 hover:text-ink'}`}><Icon size={19} /><span>{label}</span></Link>; })}</nav>
      <div className="mt-auto rounded-[22px] border border-white/80 bg-white/65 p-4"><FolderHeart className="mb-3" size={21} /><p className="truncate text-sm font-semibold">{user?.email}</p><p className="mt-1 text-xs leading-5 text-muted">Private library</p><button onClick={logout} className="focus-ring mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/70 text-xs font-semibold hover:bg-white"><LogOut size={16} />Sign out</button></div>
    </aside>
    <main className="min-h-screen pb-24 lg:ml-64 lg:pb-0">{children}</main>
    <nav className="glass fixed inset-x-4 bottom-4 z-40 flex h-16 items-center justify-around rounded-[22px] px-1 lg:hidden">{navigation.map(({ to, label, icon: Icon }) => <Link key={to} href={to} className={`focus-ring flex min-w-16 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium ${location === to ? 'text-ink' : 'text-muted'}`}><Icon size={20} /><span>{label}</span></Link>)}<Link href="/folders/new" className="focus-ring flex min-w-16 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-muted"><Plus size={20} /><span>New</span></Link><button onClick={logout} className="focus-ring flex min-w-16 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium text-muted"><LogOut size={20} /><span>Sign out</span></button></nav>
  </div>;
}

export function Page({ children, className = '' }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Header({ title, subtitle, back = false, actions }) {
  return <header className="sticky top-0 z-30 -mx-4 border-b border-black/5 bg-[#f5f5f5]/75 px-4 py-4 backdrop-blur-2xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
    <div className="mx-auto flex max-w-7xl items-center gap-3">
      {back && <IconButton label="Go back" icon={ArrowLeft} onClick={() => window.history.back()} />}
      <div className="min-w-0 flex-1"><h1 className="truncate text-[clamp(1.6rem,4vw,2.2rem)] font-semibold tracking-[-.8px] text-ink">{title}</h1>{subtitle && <p className="mt-0.5 truncate text-sm text-secondary">{subtitle}</p>}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </header>;
}

export function GlassCard({ children, className = '', onClick, label }) {
  const interactive = onClick ? { role: 'link', tabIndex: 0, onClick, onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }, 'aria-label': label } : {};
  return <div {...interactive} className={`glass rounded-[22px] p-4 transition duration-200 sm:p-5 ${onClick ? 'focus-ring cursor-pointer hover:-translate-y-0.5 hover:bg-white/85 hover:shadow-xl active:translate-y-0' : ''} ${className}`}>{children}</div>;
}

export function IconButton({ icon: Icon, onClick, label, danger = false, type = 'button' }) {
  return <button type={type} aria-label={label} title={label} onClick={onClick} className={`focus-ring grid size-11 shrink-0 place-items-center rounded-2xl border border-black/5 bg-white/70 transition hover:bg-white active:translate-y-px ${danger ? 'text-danger' : 'text-ink'}`}><Icon size={19} strokeWidth={2} /></button>;
}

export function Button({ title, onClick, icon: Icon, variant = 'primary', loading = false, disabled = false, type = 'button', className = '' }) {
  const variants = { primary: 'border-black bg-black text-white hover:bg-zinc-800', secondary: 'border-black/10 bg-white/75 text-ink hover:bg-white', danger: 'border-red-100 bg-white/75 text-danger hover:bg-red-50' };
  return <button type={type} disabled={disabled || loading} onClick={onClick} className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{loading ? <LoaderCircle className="animate-spin" size={19} /> : <>{Icon && <Icon size={18} />}<span>{title}</span></>}</button>;
}

export function Field({ label, error, multiline = false, className = '', ...props }) {
  const Component = multiline ? 'textarea' : 'input';
  return <label className="block"><span className="mb-2 block text-sm font-medium text-ink">{label}</span><Component className={`focus-ring w-full rounded-2xl border bg-white/85 px-4 text-base text-ink placeholder:text-muted ${multiline ? 'min-h-56 resize-y py-4 leading-7' : 'h-12'} ${error ? 'border-red-500' : 'border-black/10'} ${className}`} {...props} />{error && <span className="mt-2 block text-xs text-danger">{error}</span>}</label>;
}

export function SearchField({ value, onChange, placeholder = 'Search' }) {
  return <label className="glass focus-within:ring-2 focus-within:ring-black/10 flex h-12 items-center gap-3 rounded-2xl px-4"><Search size={19} className="shrink-0 text-secondary" /><span className="sr-only">{placeholder}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-muted" /></label>;
}

export function SectionTitle({ children, action, eyebrow }) {
  return <div className="mb-4 mt-8 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[.14em] text-muted">{eyebrow}</p>}<h2 className="text-xl font-semibold tracking-[-.4px] text-ink sm:text-2xl">{children}</h2></div>{action}</div>;
}

export function EmptyState({ title, text, action, actionTitle }) {
  return <div className="glass flex min-h-64 flex-col items-center justify-center rounded-[24px] px-6 py-12 text-center"><span className="mb-4 grid size-14 place-items-center rounded-2xl bg-white"><Sparkles size={23} /></span><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{text}</p>{action && <Button title={actionTitle} onClick={action} className="mt-5" />}</div>;
}

export function LoadingCards({ count = 3, grid = false }) {
  return <div className={grid ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4'}>{Array.from({ length: count }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-[22px] border border-white bg-zinc-200/70" />)}</div>;
}

export function ErrorState({ message, retry }) {
  return <div className="glass flex min-h-56 flex-col items-center justify-center rounded-[24px] px-6 py-10 text-center"><h3 className="font-semibold">Unable to load</h3><p className="mb-5 mt-2 text-sm text-secondary">{message}</p><Button title="Try again" variant="secondary" onClick={retry} /></div>;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose, loading = false }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/25 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="glass-strong w-full max-w-md rounded-[26px] p-6"><h2 id="dialog-title" className="text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-secondary">{message}</p><div className="mt-7 flex justify-end gap-3"><Button title="Cancel" variant="secondary" onClick={onClose} /><Button title={confirmLabel} variant="danger" loading={loading} onClick={onConfirm} /></div></div></div>;
}
