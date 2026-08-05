import { Archive, Image, MoreHorizontal, Plus, Trash2, Video, WandSparkles } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ConfirmDialog, EmptyState, ErrorState, GlassCard, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const categoryIcons = { Image, Video, Movements: WandSparkles };
export default function FolderDetail() {
  const { id } = useParams(); const [, navigate] = useLocation(); const toast = useToast(); const queryClient = useQueryClient(); const [deleting, setDeleting] = useState(false);
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id) });
  const archive = useMutation({ mutationFn: () => foldersApi.update(id, { isArchived: true }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder archived'); navigate('/home'); }, onError: (e) => toast(apiMessage(e), 'error') });
  const remove = useMutation({ mutationFn: () => foldersApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder deleted'); navigate('/home'); }, onError: (e) => toast(apiMessage(e), 'error') });
  if (folder.isLoading) return <Page><Header title="Folder" back /><div className="pt-6"><LoadingCards grid /></div></Page>;
  if (folder.isError) return <Page><Header title="Folder" back /><div className="pt-6"><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></div></Page>;
  const data = folder.data;
  return <Page><Header title={data.name} subtitle={data.description || 'Fashion prompt folder'} back actions={<IconButton icon={MoreHorizontal} label="Edit folder" onClick={() => navigate(`/folders/${id}/edit`)} />} />
    <SectionTitle eyebrow="Organize" action={<IconButton icon={Plus} label="Add category" onClick={() => navigate(`/folders/${id}/categories/new`)} />}>Categories</SectionTitle>
    {data.categories.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.categories.map((category) => { const Icon = categoryIcons[category.name] || Image; return <GlassCard key={category.id} onClick={() => navigate(`/categories/${category.id}`)} label={`Open ${category.name}`}><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-zinc-100"><Icon size={22} /></span><div><h3 className="text-lg font-semibold">{category.name}</h3><p className="mt-1 text-sm text-muted">{category._count.prompts} prompts</p></div></div></GlassCard>; })}</div> : <EmptyState title="No categories yet" text="Add a category to start organizing prompts in this folder." action={() => navigate(`/folders/${id}/categories/new`)} actionTitle="Add Category" />}
    <SectionTitle eyebrow="Manage">Folder actions</SectionTitle><div className="glass flex flex-col gap-3 rounded-[22px] p-4 sm:flex-row"><Button title="Archive folder" icon={Archive} variant="secondary" loading={archive.isPending} onClick={() => archive.mutate()} /><Button title="Delete folder" icon={Trash2} variant="danger" onClick={() => setDeleting(true)} /></div>
    <ConfirmDialog open={deleting} title="Delete folder?" message="This permanently deletes all categories and prompts in this folder." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
