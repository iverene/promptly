import { Archive, Copy, Heart, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ConfirmDialog, ErrorState, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { formatDate } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export default function PromptDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id) });
  const favorite = useMutation({ mutationFn: (isFavorite) => promptsApi.update(id, { isFavorite }), onSuccess: (saved) => { queryClient.setQueryData(['prompt', id], saved); queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast(saved.isFavorite ? 'Added to favorites' : 'Removed from favorites'); }, onError: (error) => toast(apiMessage(error), 'error') });
  const archive = useMutation({ mutationFn: () => promptsApi.update(id, { isArchived: true }), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt archived'); navigate(`/categories/${saved.categoryId}`); }, onError: (error) => toast(apiMessage(error), 'error') });
  const remove = useMutation({ mutationFn: () => promptsApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt deleted'); navigate(`/categories/${prompt.data.categoryId}`); }, onError: (error) => toast(apiMessage(error), 'error') });
  if (prompt.isLoading) return <Page><Header title="Prompt" back /><div className="pt-8"><LoadingCards count={2} /></div></Page>;
  if (prompt.isError) return <Page><Header title="Prompt" back /><div className="pt-8"><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></div></Page>;
  const data = prompt.data;
  const copy = async () => { await navigator.clipboard.writeText(data.content); toast('Prompt copied'); };

  return <Page className="max-w-5xl"><Header title={data.title} subtitle={`${data.category.folder.name} · ${data.category.name}`} back actions={<IconButton icon={Heart} label={data.isFavorite ? 'Remove favorite' : 'Add favorite'} onClick={() => favorite.mutate(!data.isFavorite)} className={data.isFavorite ? 'bg-black text-white' : ''} />} />
    <article className="mt-8 rounded-[30px] border border-black/8 bg-white/90 p-6 shadow-[0_18px_48px_rgba(17,17,17,.055)] sm:p-10"><p className="mb-5 text-[10px] font-medium uppercase tracking-[.2em] text-muted">Full prompt</p><p className="whitespace-pre-wrap text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.75] text-ink">{data.content}</p></article>
    {data.notes && <><SectionTitle eyebrow="Reference">Notes</SectionTitle><div className="glass rounded-[26px] p-6"><p className="whitespace-pre-wrap text-sm leading-7 text-secondary">{data.notes}</p></div></>}
    <p className="mt-5 text-center text-[10px] uppercase tracking-[.14em] text-muted">Updated {formatDate(data.updatedAt)}</p>
    <div className="glass sticky bottom-28 z-20 mt-7 grid gap-2 rounded-[28px] p-3 sm:grid-cols-2 lg:grid-cols-4"><Button title="Copy prompt" icon={Copy} onClick={copy} /><Button title="Edit" icon={Pencil} variant="secondary" onClick={() => navigate(`/prompts/${id}/edit`)} /><Button title="Archive" icon={Archive} variant="secondary" loading={archive.isPending} onClick={() => archive.mutate()} /><Button title="Delete" icon={Trash2} variant="danger" onClick={() => setDeleting(true)} /></div>
    <ConfirmDialog open={deleting} title="Delete prompt?" message="This action cannot be undone." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
