import { Archive, Image, MoreHorizontal, Plus, Trash2, Video, WandSparkles } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ConfirmDialog, EmptyState, ErrorState, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const categoryIcons = { Image, Video, Movements: WandSparkles };

export default function FolderDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id) });
  const archive = useMutation({ mutationFn: () => foldersApi.update(id, { isArchived: true }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder archived'); navigate('/home'); }, onError: (error) => toast(apiMessage(error), 'error') });
  const remove = useMutation({ mutationFn: () => foldersApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder deleted'); navigate('/home'); }, onError: (error) => toast(apiMessage(error), 'error') });

  if (folder.isLoading) return <Page><Header title="Folder" back /><div className="pt-8"><LoadingCards grid /></div></Page>;
  if (folder.isError) return <Page><Header title="Folder" back /><div className="pt-8"><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></div></Page>;

  const data = folder.data;
  return <Page>
    <Header title={data.name} subtitle={data.description || 'Fashion prompt folder'} back actions={<IconButton icon={MoreHorizontal} label="Edit folder" onClick={() => navigate(`/folders/${id}/edit`)} />} />
    <div className="mt-8 rounded-[30px] border border-black/10 p-6 sm:p-8" style={{ background: data.color || '#F3EEDF' }}><p className="text-[10px] font-medium uppercase tracking-[.2em] text-secondary">Open folder</p><div className="mt-3 flex items-end justify-between gap-6"><h2 className="text-[clamp(2.5rem,8vw,5rem)] font-medium leading-none tracking-[-.075em]">{data.name}</h2><p className="pb-1 text-xs uppercase tracking-[.12em] text-secondary">{data.categories.reduce((sum, item) => sum + item._count.prompts, 0)} prompts</p></div></div>
    <SectionTitle eyebrow="Filed by format" action={<IconButton icon={Plus} label="Add category" onClick={() => navigate(`/folders/${id}/categories/new`)} />}>Categories</SectionTitle>
    {data.categories.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.categories.map((category) => { const Icon = categoryIcons[category.name] || Image; return <button type="button" key={category.id} onClick={() => navigate(`/categories/${category.id}`)} className="focus-ring glass group flex min-h-40 flex-col justify-between rounded-[26px] p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:bg-white/78"><span className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-full border border-black/8 bg-white/65"><Icon size={20} strokeWidth={1.7} /></span><span className="text-[10px] uppercase tracking-[.16em] text-muted">{category._count.prompts} prompts</span></span><span className="mt-8 text-2xl font-medium tracking-[-.045em]">{category.name}</span></button>; })}</div> : <EmptyState title="No categories yet" text="Add a category to begin filing prompts in this folder." action={() => navigate(`/folders/${id}/categories/new`)} actionTitle="Add Category" />}
    <SectionTitle eyebrow="Manage">Folder actions</SectionTitle>
    <div className="glass flex flex-col gap-3 rounded-[26px] p-4 sm:flex-row"><Button title="Archive folder" icon={Archive} variant="secondary" loading={archive.isPending} onClick={() => archive.mutate()} /><Button title="Delete folder" icon={Trash2} variant="danger" onClick={() => setDeleting(true)} /></div>
    <ConfirmDialog open={deleting} title="Delete folder?" message="This permanently deletes all categories and prompts in this folder." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
