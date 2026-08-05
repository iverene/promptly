import { Archive, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { PromptCard } from '../components/PromptCard';
import { ConfirmDialog, EmptyState, ErrorState, Header, IconButton, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

export default function FolderDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id) });
  const prompts = useQuery({ queryKey: ['prompts', 'folder', id, search], queryFn: () => promptsApi.list({ folderId: id, search }) });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (error) => toast(apiMessage(error), 'error') });
  const archive = useMutation({ mutationFn: () => foldersApi.update(id, { isArchived: true }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder archived'); navigate('/home'); }, onError: (error) => toast(apiMessage(error), 'error') });
  const remove = useMutation({ mutationFn: () => foldersApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder deleted'); navigate('/home'); }, onError: (error) => toast(apiMessage(error), 'error') });

  if (folder.isLoading) return <Page><Header title="Folder" back /><div className="pt-8"><LoadingCards grid /></div></Page>;
  if (folder.isError) return <Page><Header title="Folder" back /><div className="pt-8"><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></div></Page>;

  const data = folder.data;
  const promptCount = data.categories.reduce((sum, item) => sum + item._count.prompts, 0);
  return <Page>
    <Header title={data.name} subtitle={data.description || 'Fashion prompt folder'} back actions={<><div className="relative"><IconButton icon={MoreHorizontal} label="Folder actions" onClick={() => setActionsOpen((open) => !open)} />{actionsOpen && <div className="glass-strong absolute right-0 top-14 z-40 grid w-52 gap-1 rounded-[22px] p-2"><button type="button" onClick={() => archive.mutate()} disabled={archive.isPending} className="focus-ring flex min-h-11 items-center gap-3 rounded-[16px] px-3 text-left text-sm hover:bg-white/70"><Archive size={17} />Archive folder</button><button type="button" onClick={() => { setActionsOpen(false); setDeleting(true); }} className="focus-ring flex min-h-11 items-center gap-3 rounded-[16px] px-3 text-left text-sm text-danger hover:bg-red-50/70"><Trash2 size={17} />Delete folder</button></div>}</div><IconButton icon={Pencil} label="Edit folder" onClick={() => navigate(`/folders/${id}/edit`)} /></>} />
    <div className="mt-8 rounded-[32px] border border-white/70 p-6 shadow-[inset_0_1px_rgba(255,255,255,.75),0_18px_48px_rgba(17,17,17,.07)] backdrop-blur-3xl sm:p-8" style={{ background: `color-mix(in srgb, ${data.color || '#F3EEDF'} 72%, transparent)` }}><p className="text-[10px] font-medium uppercase tracking-[.2em] text-secondary">Open folder</p><div className="mt-3 flex items-end justify-between gap-6"><h2 className="text-[clamp(3rem,8vw,5.5rem)] leading-none tracking-[-.055em]">{data.name}</h2><p className="pb-1 text-xs uppercase tracking-[.12em] text-secondary">{promptCount} prompts</p></div></div>
    <div className="mt-7 max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search prompts in this folder" /></div>
    <SectionTitle eyebrow="Inside this folder">Prompts</SectionTitle>
    {prompts.isLoading ? <LoadingCards grid /> : prompts.isError ? <ErrorState message={apiMessage(prompts.error)} retry={prompts.refetch} /> : prompts.data?.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{prompts.data.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} showContext categoryOnly onFavorite={favorite.mutate} />)}</div> : <EmptyState title={search ? 'No matching prompts' : 'No prompts yet'} text={search ? 'Try another keyword.' : 'Use the add button to create your first prompt in this folder.'} />}
    <ConfirmDialog open={deleting} title="Delete folder?" message="This permanently deletes all categories and prompts in this folder." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
