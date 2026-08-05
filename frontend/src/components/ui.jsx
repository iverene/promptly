import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Archive, ChevronLeft, Heart, Home, LoaderCircle, Plus, Search, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'wouter';

function logicalBackTarget(location) {
  const editMatch = location.match(/^\/(folders|categories|prompts)\/([^/]+)\/edit$/);
  if (editMatch) return `/${editMatch[1]}/${editMatch[2]}`;
  const nestedCreateMatch = location.match(/^\/folders\/([^/]+)\/(?:categories|prompts)\/new$/);
  if (nestedCreateMatch) return `/folders/${nestedCreateMatch[1]}`;
  const categoryPromptMatch = location.match(/^\/categories\/([^/]+)\/prompts\/new$/);
  if (categoryPromptMatch) return `/categories/${categoryPromptMatch[1]}`;
  return '/home';
}

export function AppShell({ children }) {
  const [location] = useLocation();
  const navigation = [{ to: '/home', label: 'Home', icon: Home }, { to: '/favorites', label: 'Favorites', icon: Heart }, { to: '/settings', label: 'Archive', icon: Archive }];
  const categoryMatch = location.match(/^\/categories\/([^/]+)$/);
  const createAction = categoryMatch ? { to: `/categories/${categoryMatch[1]}/prompts/new`, label: 'Create prompt' } : null;
  return <div className="app-background min-h-screen">
    <main className="relative z-10 min-h-screen pb-32 lg:pb-10 lg:pl-[13.5rem]">{children}</main>
    <nav aria-label="Primary navigation" className="primary-nav">
      <Link href="/home" className="primary-nav__brand focus-ring">Promptly</Link>
      <div className="primary-nav__items">
        {navigation.map(({ to, label, icon: Icon }) => {
          const active = location === to || (to === '/home' && /^\/(folders|categories|prompts)\//.test(location)) || (to === '/settings' && location.startsWith('/archive/'));
          return <Link key={to} href={to} aria-current={active ? 'page' : undefined} className={`primary-nav__item focus-ring ${active ? 'is-active' : ''}`}><span className="primary-nav__icon"><Icon size={20} strokeWidth={1.8} /></span><span className="primary-nav__label">{label}</span></Link>;
        })}
      </div>
    </nav>
    {createAction && <Link href={createAction.to} aria-label={createAction.label} title={createAction.label} className="focus-ring fixed bottom-32 right-5 z-40 grid size-14 place-items-center rounded-full bg-black text-white transition duration-200 hover:-translate-y-1 hover:bg-zinc-800 sm:right-8 lg:bottom-10 lg:right-10"><Plus size={21} /></Link>}
  </div>;
}

export function Page({ children, className = '' }) {
  return <div className={`page-shell soft-enter mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8 lg:px-8 ${className}`}>{children}</div>;
}

export function Header({ title, back = false, actions }) {
  const [location, navigate] = useLocation();
  const goBack = () => typeof back === 'function' ? back() : navigate(typeof back === 'string' ? back : logicalBackTarget(location));
  return <header className="relative z-30 bg-transparent pb-4">
    <div className="flex items-center gap-5">
      {back && <button type="button" aria-label="Go back" title="Go back" onClick={goBack} className="focus-ring grid size-10 shrink-0 place-items-center bg-transparent text-ink transition duration-200 hover:-translate-x-0.5"><ChevronLeft size={27} strokeWidth={1.6} /></button>}
      <div className="min-w-0 flex-1"><h1 className="truncate pl-1 text-[clamp(1.45rem,3vw,1.9rem)] tracking-[-.035em] text-ink">{title}</h1></div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </header>;
}

export function GlassCard({ children, className = '', onClick, label }) {
  const interactive = onClick ? { role: 'link', tabIndex: 0, onClick, onKeyDown: (event) => { if (event.key === 'Enter' || event.key === ' ') onClick(); }, 'aria-label': label } : {};
  return <div {...interactive} className={`glass rounded-[24px] p-5 transition duration-200 lg:p-4 ${onClick ? 'focus-ring cursor-pointer hover:-translate-y-0.5 hover:bg-white/76 active:translate-y-0' : ''} ${className}`}>{children}</div>;
}

export function IconButton({ icon: Icon, onClick, label, danger = false, type = 'button', className = '' }) {
  return <button type={type} aria-label={label} title={label} onClick={onClick} className={`focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-black/20 bg-white/58 transition duration-200 hover:bg-white active:translate-y-px ${danger ? 'text-danger' : 'text-ink'} ${className}`}><Icon size={18} strokeWidth={1.8} /></button>;
}

export function AddButton({ onClick, label, embedded = false }) {
  const button = <button type="button" onClick={onClick} aria-label={label} title={label} className={`focus-ring z-40 grid size-14 place-items-center rounded-full bg-black text-white transition duration-200 hover:-translate-y-1 hover:bg-zinc-800 ${embedded ? 'mb-5' : 'fixed bottom-32 right-5 sm:right-8 lg:bottom-10 lg:right-10'}`}><Plus size={21} /></button>;
  return embedded ? button : createPortal(button, document.body);
}

export function Button({ title, onClick, icon: Icon, variant = 'primary', loading = false, disabled = false, type = 'button', className = '' }) {
  const variants = { primary: 'border-black bg-black text-white hover:bg-zinc-800', secondary: 'border-black/20 bg-white/65 text-ink hover:bg-white', danger: 'border-red-200 bg-white/65 text-danger hover:bg-red-50' };
  return <button type={type} disabled={disabled || loading} onClick={onClick} className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <>{Icon && <Icon size={18} strokeWidth={1.8} />}<span>{title}</span></>}</button>;
}

export function Field({ label, error, multiline = false, className = '', ...props }) {
  const Component = multiline ? 'textarea' : 'input';
  return <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[.12em] text-secondary">{label}</span><Component className={`focus-ring w-full rounded-[18px] border bg-white/76 px-4 text-base text-ink shadow-[inset_0_1px_rgba(255,255,255,.8)] placeholder:text-muted ${multiline ? 'min-h-56 resize-y py-4 leading-7' : 'h-13'} ${error ? 'border-red-500' : 'border-black/20'} ${className}`} {...props} autoComplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" />{error && <span className="mt-2 block text-xs text-danger">{error}</span>}</label>;
}

export function SearchField({ value, onChange, placeholder = 'Search' }) {
  return <label className="glass focus-within:ring-2 focus-within:ring-black/10 flex h-14 items-center gap-3 rounded-full px-5 lg:h-12 lg:px-4"><Search size={18} strokeWidth={1.8} className="shrink-0 text-secondary" /><span className="sr-only">{placeholder}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted lg:text-sm" /></label>;
}

export function SectionTitle({ children, action }) {
  return <div className="mb-4 mt-10 flex items-end justify-between gap-4"><h2 className="text-[clamp(1.35rem,2.5vw,1.75rem)] tracking-[-.035em] text-ink">{children}</h2>{action}</div>;
}

export function EmptyState({ title, text, action, actionTitle }) {
  const EmptyIcon = title.startsWith('No matching') ? Search : Sparkles;
  return <div className="glass flex min-h-64 flex-col items-center justify-center rounded-[28px] px-6 py-12 text-center lg:min-h-48 lg:py-8">{action ? <AddButton onClick={action} label={actionTitle} embedded /> : <span className="mb-5 grid size-14 place-items-center rounded-full border border-black/20 bg-white/65"><EmptyIcon size={21} strokeWidth={1.7} /></span>}<h3 className="text-xl font-medium tracking-[-.035em]">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-secondary">{text}</p></div>;
}

export function LoadingCards({ count, grid = false, mobileColumns = false }) {
  const resolvedCount = grid ? Math.max(count ?? 0, 3) : (count ?? 1);
  return <div aria-label="Loading content" role="status" className={grid ? `grid gap-5 ${mobileColumns ? 'grid-cols-2 ' : ''}md:grid-cols-2 xl:grid-cols-3` : 'grid gap-4'}>{Array.from({ length: resolvedCount }).map((_, index) => {
    const responsiveVisibility = index >= 3 ? 'hidden' : grid && index === 1 && !mobileColumns ? 'hidden md:block' : grid && index === 2 ? 'hidden xl:block' : '';
    return <div key={index} aria-hidden="true" className={`skeleton h-40 rounded-[24px] border border-black/15 lg:h-36 ${responsiveVisibility}`} />;
  })}</div>;
}

export function ErrorState({ message, retry }) {
  return <div className="glass flex min-h-56 flex-col items-center justify-center rounded-[28px] px-6 py-10 text-center lg:min-h-44 lg:py-7"><h3 className="text-lg font-medium">Unable to load</h3><p className="mb-5 mt-2 text-sm text-secondary">{message}</p><Button title="Try again" variant="secondary" onClick={retry} /></div>;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose, loading = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const scrollY = window.scrollY;
    const body = document.body;
    const root = document.documentElement;
    const previousBody = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow };
    const previousRootOverflow = root.style.overflow;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    root.style.overflow = 'hidden';
    return () => {
      Object.assign(body.style, previousBody);
      root.style.overflow = previousRootOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => { if (event.key === 'Escape' && !loading) onClose(); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [loading, onClose, open]);

  if (!open) return null;
  return createPortal(<div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden overscroll-none bg-black/30 p-5 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-message" className="soft-enter w-full max-w-xs rounded-[22px] border border-black/20 bg-white p-5 shadow-[0_22px_60px_rgba(17,17,17,.2)]"><h2 id="dialog-title" className="text-xl tracking-[-.035em]">{title}</h2><p id="dialog-message" className="mt-2 text-sm leading-6 text-secondary">{message}</p><div className="mt-5 grid grid-cols-2 gap-2"><Button title="Cancel" variant="secondary" disabled={loading} onClick={onClose} className="w-full" /><Button title={confirmLabel} variant="danger" loading={loading} onClick={onConfirm} className="w-full" /></div></div></div>, document.body);
}
