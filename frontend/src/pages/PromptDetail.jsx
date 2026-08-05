import { Archive, Copy, Heart, MoreVertical as MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { ConfirmDialog, ErrorState, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { formatDate } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export default function PromptDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id) });
  const favorite = useMutation({ mutationFn: (isFavorite) => promptsApi.update(id, { isFavorite }), onSuccess: (saved) => { queryClient.setQueryData(['prompt', id], saved); queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast(saved.isFavorite ? 'Added to favorites' : 'Removed from favorites'); }, onError: (error) => toast(apiMessage(error), 'error') });
  const archive = useMutation({ mutationFn: () => promptsApi.update(id, { isArchived: true }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt archived'); navigate(`/folders/${prompt.data.category.folder.id}`); }, onError: (error) => toast(apiMessage(error), 'error') });
  const remove = useMutation({ mutationFn: () => promptsApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt deleted'); navigate(`/folders/${prompt.data.category.folder.id}`); }, onError: (error) => toast(apiMessage(error), 'error') });
  if (prompt.isLoading) return <Page><Header title="Prompt" back /><div className="pt-8"><LoadingCards /></div></Page>;
  if (prompt.isError) return <Page><Header title="Prompt" back /><div className="pt-8"><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></div></Page>;
  const data = prompt.data;
  const copy = async () => { await navigator.clipboard.writeText(data.content); toast('Prompt copied'); };

  return <Page className="max-w-5xl"><Header title={data.title} back={`/folders/${data.category.folder.id}`} actions={<><button type="button" aria-label={data.isFavorite ? 'Remove favorite' : 'Add favorite'} title={data.isFavorite ? 'Remove favorite' : 'Add favorite'} disabled={favorite.isPending} onClick={() => favorite.mutate(!data.isFavorite)} className={`focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-black/30 transition duration-200 disabled:opacity-50 ${data.isFavorite ? 'bg-black text-white' : 'bg-white/85 text-ink hover:bg-white'}`}><Heart size={19} strokeWidth={2} fill={data.isFavorite ? 'currentColor' : 'none'} /></button><div className="relative"><IconButton icon={MoreHorizontal} label="Prompt actions" onClick={() => setActionsOpen((open) => !open)} />{actionsOpen && <div className="glass-strong absolute right-0 top-14 z-40 grid w-48 gap-1 rounded-[20px] p-2"><button type="button" onClick={() => { setActionsOpen(false); navigate(`/prompts/${id}/edit`); }} className="focus-ring flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-left text-sm hover:bg-white/70"><Pencil size={17} />Edit prompt</button><button type="button" disabled={archive.isPending} onClick={() => { setActionsOpen(false); archive.mutate(); }} className="focus-ring flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-left text-sm hover:bg-white/70 disabled:opacity-50"><Archive size={17} />Archive prompt</button><button type="button" onClick={() => { setActionsOpen(false); setDeleting(true); }} className="focus-ring flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-left text-sm text-danger hover:bg-red-50/70"><Trash2 size={17} />Delete prompt</button></div>}</div></>} />
    <article className="mt-8 rounded-[30px] border border-black/20 bg-white/90 p-6 shadow-[0_18px_48px_rgba(17,17,17,.055)] sm:p-10"><div className="flex items-center justify-between gap-4"><p className="text-[10px] font-medium uppercase tracking-[.2em] text-muted">Full prompt</p><IconButton icon={Copy} label="Copy prompt" onClick={copy} className="size-10 bg-white" /></div><p className="mt-5 whitespace-pre-wrap text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.75] text-ink">{data.content}</p></article>
    {data.notes && <><SectionTitle eyebrow="Reference">Notes</SectionTitle><div className="glass rounded-[26px] p-6"><p className="whitespace-pre-wrap text-sm leading-7 text-secondary">{data.notes}</p></div></>}
    <p className="mt-5 text-center text-[10px] uppercase tracking-[.14em] text-muted">Updated {formatDate(data.updatedAt)}</p>
    <ConfirmDialog open={deleting} title="Delete prompt?" message="This action cannot be undone." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
