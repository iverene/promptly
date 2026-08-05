import { ArrowLeft, Archive, Heart, LoaderCircle, Plus, Search, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function AppShell({ children }) {
  const [location] = useLocation();
  const navigation = [{ to: '/favorites', label: 'Favorites', icon: Heart }, { to: '/settings', label: 'Archive', icon: Archive }];
  const folderMatch = location.match(/^\/folders\/([^/]+)$/);
  const categoryMatch = location.match(/^\/categories\/([^/]+)$/);
  const createAction = location === '/home'
    ? { to: '/folders/new', label: 'Create folder' }
    : folderMatch && folderMatch[1] !== 'new'
      ? { to: `/folders/${folderMatch[1]}/prompts/new`, label: 'Create prompt' }
      : categoryMatch
        ? { to: `/categories/${categoryMatch[1]}/prompts/new`, label: 'Create prompt' }
        : null;
  return <div className="app-background min-h-screen">
    <main className="relative z-10 min-h-screen pb-32">{children}</main>
    <nav aria-label="Primary navigation" className="glass fixed bottom-5 left-1/2 z-40 flex h-[68px] w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 items-center justify-around rounded-full px-2 shadow-[0_20px_50px_rgba(0,0,0,.14)]">
      {navigation.map(({ to, label, icon: Icon }) => { const active = location === to; return <Link key={to} href={to} className={`focus-ring flex h-12 min-w-28 items-center justify-center gap-2 rounded-full px-4 text-xs font-medium transition duration-200 ${active ? 'bg-white/85 text-ink shadow-sm' : 'text-muted hover:bg-white/45 hover:text-ink'}`}><Icon size={18} /><span>{label}</span></Link>; })}
    </nav>
    {createAction && <Link href={createAction.to} aria-label={createAction.label} title={createAction.label} className="focus-ring glass-strong fixed bottom-28 right-5 z-40 grid size-16 place-items-center rounded-full bg-black text-white shadow-[0_20px_45px_rgba(0,0,0,.22)] transition duration-200 hover:-translate-y-1 sm:right-8 lg:right-10"><Plus size={23} /></Link>}
  </div>;
}

export function Page({ children, className = '' }) {
  return <div className={`soft-enter mx-auto w-full max-w-6xl px-5 pb-10 pt-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>;
}

export function Header({ title, subtitle, back = false, actions }) {
  return <header className="glass sticky top-4 z-30 rounded-[26px] px-4 py-3.5 sm:px-5">
    <div className="flex items-center gap-3">
      {back && <IconButton label="Go back" icon={ArrowLeft} onClick={() => window.history.back()} />}
      <div className="min-w-0 flex-1"><h1 className="truncate text-[clamp(1.7rem,4vw,2.25rem)] tracking-[-.035em] text-ink">{title}</h1>{subtitle && <p className="mt-0.5 truncate text-xs tracking-wide text-secondary">{subtitle}</p>}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </header>;
}

export function GlassCard({ children, className = '', onClick, label }) {
  const interactive = onClick ? { role: 'link', tabIndex: 0, onClick, onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }, 'aria-label': label } : {};
  return <div {...interactive} className={`glass rounded-[24px] p-5 transition duration-200 ${onClick ? 'focus-ring cursor-pointer hover:-translate-y-0.5 hover:bg-white/76 active:translate-y-0' : ''} ${className}`}>{children}</div>;
}

export function IconButton({ icon: Icon, onClick, label, danger = false, type = 'button', className = '' }) {
  return <button type={type} aria-label={label} title={label} onClick={onClick} className={`focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-black/8 bg-white/58 transition duration-200 hover:bg-white active:translate-y-px ${danger ? 'text-danger' : 'text-ink'} ${className}`}><Icon size={18} strokeWidth={1.8} /></button>;
}

export function Button({ title, onClick, icon: Icon, variant = 'primary', loading = false, disabled = false, type = 'button', className = '' }) {
  const variants = { primary: 'border-black bg-black text-white hover:bg-zinc-800', secondary: 'border-black/10 bg-white/65 text-ink hover:bg-white', danger: 'border-red-100 bg-white/65 text-danger hover:bg-red-50' };
  return <button type={type} disabled={disabled || loading} onClick={onClick} className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <>{Icon && <Icon size={18} strokeWidth={1.8} />}<span>{title}</span></>}</button>;
}

export function Field({ label, error, multiline = false, className = '', ...props }) {
  const Component = multiline ? 'textarea' : 'input';
  return <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-secondary">{label}</span><Component className={`focus-ring w-full rounded-[18px] border bg-white/76 px-4 text-base text-ink shadow-[inset_0_1px_rgba(255,255,255,.8)] placeholder:text-muted ${multiline ? 'min-h-56 resize-y py-4 leading-7' : 'h-13'} ${error ? 'border-red-500' : 'border-black/10'} ${className}`} {...props} />{error && <span className="mt-2 block text-xs text-danger">{error}</span>}</label>;
}

export function SearchField({ value, onChange, placeholder = 'Search' }) {
  return <label className="glass focus-within:ring-2 focus-within:ring-black/10 flex h-14 items-center gap-3 rounded-full px-5"><Search size={18} strokeWidth={1.8} className="shrink-0 text-secondary" /><span className="sr-only">{placeholder}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted" /></label>;
}

export function SectionTitle({ children, action, eyebrow }) {
  return <div className="mb-4 mt-10 flex items-end justify-between gap-4"><div>{eyebrow && <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[.2em] text-muted">{eyebrow}</p>}<h2 className="text-[clamp(1.55rem,3vw,2rem)] tracking-[-.035em] text-ink">{children}</h2></div>{action}</div>;
}

export function EmptyState({ title, text, action, actionTitle }) {
  return <div className="glass flex min-h-64 flex-col items-center justify-center rounded-[28px] px-6 py-12 text-center"><span className="mb-5 grid size-14 place-items-center rounded-full border border-black/8 bg-white/65"><Sparkles size={21} strokeWidth={1.7} /></span><h3 className="text-xl font-medium tracking-[-.035em]">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{text}</p>{action && <Button title={actionTitle} onClick={action} className="mt-6" />}</div>;
}

export function LoadingCards({ count = 3, grid = false }) {
  return <div className={grid ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : 'grid gap-4'}>{Array.from({ length: count }).map((_, index) => <div key={index} className="skeleton h-40 rounded-[24px] border border-white/70" />)}</div>;
}

export function ErrorState({ message, retry }) {
  return <div className="glass flex min-h-56 flex-col items-center justify-center rounded-[28px] px-6 py-10 text-center"><h3 className="text-lg font-medium">Unable to load</h3><p className="mb-5 mt-2 text-sm text-secondary">{message}</p><Button title="Try again" variant="secondary" onClick={retry} /></div>;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose, loading = false }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-4 backdrop-blur-md" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="glass-strong soft-enter w-full max-w-md rounded-[30px] p-6"><span className="mx-auto mb-5 block h-1 w-10 rounded-full bg-black/15" /><h2 id="dialog-title" className="text-2xl font-medium tracking-[-.045em]">{title}</h2><p className="mt-3 text-sm leading-6 text-secondary">{message}</p><div className="mt-7 flex justify-end gap-3"><Button title="Cancel" variant="secondary" onClick={onClose} /><Button title={confirmLabel} variant="danger" loading={loading} onClick={onConfirm} /></div></div></div>;
}
