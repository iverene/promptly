import { Archive, Copy, Heart, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ConfirmDialog, ErrorState, GlassCard, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { formatDate } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export default function PromptDetail() {
  const { id } = useParams(); const [, navigate] = useLocation(); const toast = useToast(); const queryClient = useQueryClient(); const [deleting, setDeleting] = useState(false);
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id) });
  const favorite = useMutation({ mutationFn: (isFavorite) => promptsApi.update(id, { isFavorite }), onSuccess: (saved) => { queryClient.setQueryData(['prompt', id], saved); queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast(saved.isFavorite ? 'Added to favorites' : 'Removed from favorites'); }, onError: (e) => toast(apiMessage(e), 'error') });
  const archive = useMutation({ mutationFn: () => promptsApi.update(id, { isArchived: true }), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt archived'); navigate(`/folders/${saved.category.folder.id}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  const remove = useMutation({ mutationFn: () => promptsApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt deleted'); navigate(`/folders/${prompt.data.category.folder.id}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  if (prompt.isLoading) return <Page><Header title="Prompt" back /><div className="pt-6"><LoadingCards count={2} /></div></Page>;
  if (prompt.isError) return <Page><Header title="Prompt" back /><div className="pt-6"><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></div></Page>;
  const data = prompt.data;
  const copy = async () => { await navigator.clipboard.writeText(data.content); toast('Prompt copied'); };
  return <Page className="max-w-5xl"><Header title={data.title} subtitle={`${data.category.folder.name} / ${data.category.name}`} back actions={<IconButton icon={Heart} label={data.isFavorite ? 'Remove favorite' : 'Add favorite'} onClick={() => favorite.mutate(!data.isFavorite)} />} />
    <div className="pt-6"><GlassCard className="glass-strong"><p className="whitespace-pre-wrap text-base leading-8 text-ink">{data.content}</p></GlassCard>
      {data.notes && <><SectionTitle eyebrow="Reference">Notes</SectionTitle><GlassCard className="bg-white/85"><p className="whitespace-pre-wrap text-sm leading-7 text-secondary">{data.notes}</p></GlassCard></>}
      <p className="mt-4 text-center text-xs text-muted">Updated {formatDate(data.updatedAt)}</p>
      <div className="glass sticky bottom-4 mt-7 grid gap-3 rounded-[22px] p-3 sm:grid-cols-2 lg:grid-cols-4"><Button title="Copy prompt" icon={Copy} onClick={copy} /><Button title="Edit prompt" icon={Pencil} variant="secondary" onClick={() => navigate(`/prompts/${id}/edit`)} /><Button title="Archive" icon={Archive} variant="secondary" loading={archive.isPending} onClick={() => archive.mutate()} /><Button title="Delete" icon={Trash2} variant="danger" onClick={() => setDeleting(true)} /></div>
    </div><ConfirmDialog open={deleting} title="Delete prompt?" message="This action cannot be undone." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
