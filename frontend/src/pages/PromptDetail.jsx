import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, Heart, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { ActionMenu } from '../components/ActionMenu';
import { PromptContentCard } from '../components/PromptContentCard';
import { ConfirmDialog, ErrorState, Header, LoadingCards, Page, SectionTitle } from '../components/ui';
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
  const promptActions = [
    { label: 'Edit prompt', icon: Pencil, onClick: () => { setActionsOpen(false); navigate(`/prompts/${id}/edit`); } },
    { label: 'Archive prompt', icon: Archive, disabled: archive.isPending, onClick: () => { setActionsOpen(false); archive.mutate(); } },
    { label: 'Delete prompt', icon: Trash2, danger: true, onClick: () => { setActionsOpen(false); setDeleting(true); } },
  ];

  return <Page className="max-w-5xl">
    <Header title={data.title} back={`/folders/${data.category.folder.id}`} actions={<>
      <button type="button" aria-label={data.isFavorite ? 'Remove favorite' : 'Add favorite'} title={data.isFavorite ? 'Remove favorite' : 'Add favorite'} disabled={favorite.isPending} onClick={() => favorite.mutate(!data.isFavorite)} className={`focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-black/30 transition duration-200 disabled:opacity-50 ${data.isFavorite ? 'bg-black text-white' : 'bg-white/85 text-ink hover:bg-white'}`}><Heart size={19} strokeWidth={2} fill={data.isFavorite ? 'currentColor' : 'none'} /></button>
      <ActionMenu triggerIcon={MoreVertical} label="Prompt actions" open={actionsOpen} onToggle={() => setActionsOpen((open) => !open)} options={promptActions} />
    </>} />
    <PromptContentCard content={data.content} onCopy={copy} />
    {data.notes && <><SectionTitle>Notes</SectionTitle><div className="glass rounded-[26px] p-6"><p className="whitespace-pre-wrap text-sm leading-7 text-secondary">{data.notes}</p></div></>}
    <p className="mt-5 text-center text-[10px] uppercase tracking-[.14em] text-muted">Updated {formatDate(data.updatedAt)}</p>
    <ConfirmDialog open={deleting} title="Delete prompt?" message="This action cannot be undone." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
