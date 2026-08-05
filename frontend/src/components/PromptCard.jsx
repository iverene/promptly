import { Copy, Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { formatDate } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export function PromptCard({ prompt, onFavorite, showContext = false, categoryOnly = false }) {
  const [, navigate] = useLocation();
  const toast = useToast();
  const copy = async (event) => { event.stopPropagation(); await navigator.clipboard.writeText(prompt.content); toast('Prompt copied'); };
  return <article onClick={() => navigate(`/prompts/${prompt.id}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') navigate(`/prompts/${prompt.id}`); }} role="link" tabIndex="0" aria-label={`Open ${prompt.title}`} className="focus-ring group flex min-h-56 cursor-pointer flex-col rounded-[24px] border border-black/20 bg-white/72 p-5 shadow-[0_12px_32px_rgba(17,17,17,.045)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 lg:min-h-48 lg:p-4">
    <div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-[10px] font-medium uppercase tracking-[.16em] text-muted">{showContext ? (categoryOnly ? prompt.category?.name : `${prompt.category?.folder?.name} · ${prompt.category?.name}`) : 'Prompt'}</p><h3 className="mt-2 line-clamp-2 text-xl font-medium leading-tight tracking-[-.04em]">{prompt.title}</h3></div><button aria-label={prompt.isFavorite ? 'Remove favorite' : 'Add favorite'} onClick={(event) => { event.stopPropagation(); onFavorite?.(prompt); }} className="focus-ring grid size-10 shrink-0 place-items-center rounded-full border border-black/20 bg-white/60 transition hover:bg-white"><Heart size={18} strokeWidth={1.7} fill={prompt.isFavorite ? 'currentColor' : 'none'} /></button></div>
    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-secondary">{prompt.content}</p>
    <div className="mt-5 flex items-center justify-between border-t border-black/15 pt-4"><span className="text-[11px] uppercase tracking-[.1em] text-muted">{formatDate(prompt.updatedAt)}</span><button aria-label="Copy prompt" onClick={copy} className="focus-ring flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-medium transition hover:bg-black/5"><Copy size={16} strokeWidth={1.7} />Copy</button></div>
  </article>;
}
