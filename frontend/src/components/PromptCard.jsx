import { Copy, Heart } from 'lucide-react';
import { useLocation } from 'wouter';
import { GlassCard, IconButton } from './ui';
import { formatDate } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export function PromptCard({ prompt, onFavorite, showContext = false }) {
  const [, navigate] = useLocation(); const toast = useToast();
  const copy = async (event) => { event.stopPropagation(); await navigator.clipboard.writeText(prompt.content); toast('Prompt copied'); };
  return <GlassCard onClick={() => navigate(`/prompts/${prompt.id}`)} label={`Open ${prompt.title}`} className="h-full">
    <div className="flex h-full items-start gap-3"><div className="min-w-0 flex-1"><h3 className="truncate text-[17px] font-semibold">{prompt.title}</h3>{showContext && <p className="mt-1 text-xs font-medium text-muted">{prompt.category?.folder?.name} · {prompt.category?.name}</p>}<p className="mt-2 line-clamp-3 text-sm leading-6 text-secondary">{prompt.content}</p><p className="mt-4 text-xs text-muted">Updated {formatDate(prompt.updatedAt)}</p></div><div className="flex shrink-0 flex-col gap-1"><button aria-label={prompt.isFavorite ? 'Remove favorite' : 'Add favorite'} onClick={(event) => { event.stopPropagation(); onFavorite?.(prompt); }} className="focus-ring grid size-10 place-items-center rounded-xl hover:bg-black/5"><Heart size={19} fill={prompt.isFavorite ? 'currentColor' : 'none'} /></button><IconButton label="Copy prompt" icon={Copy} onClick={copy} /></div></div>
  </GlassCard>;
}
