import { Archive, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { PromptCard } from '../components/PromptCard';
import { Button, ConfirmDialog, EmptyState, ErrorState, Header, IconButton, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

export default function FolderDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id) });
  const prompts = useQuery({ queryKey: ['prompts', 'folder', id, search], queryFn: () => promptsApi.list({ folderId: id, search }) });
  const favorite = useMutation({
    mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }),
    onError: (error) => toast(apiMessage(error), 'error'),
  });
  const archive = useMutation({ mutationFn: () => foldersApi.update(id, { isArchived: true }), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder archived'); navigate('/home'); }, onError: (error) => toast(apiMessage(error), 'error') });
  const remove = useMutation({ mutationFn: () => foldersApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast('Folder deleted'); navigate('/home'); }, onError: (error) => toast(apiMessage(error), 'error') });

  if (folder.isLoading) return <Page><Header title="Folder" back /><div className="pt-6"><LoadingCards grid /></div></Page>;
  if (folder.isError) return <Page><Header title="Folder" back /><div className="pt-6"><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></div></Page>;

  const data = folder.data;
  return <Page>
    <Header title={data.name} subtitle={data.description || 'Fashion prompt folder'} back actions={<><IconButton icon={MoreHorizontal} label="Edit folder" onClick={() => navigate(`/folders/${id}/edit`)} /><IconButton icon={Plus} label="Create prompt" onClick={() => navigate(`/folders/${id}/prompts/new`)} /></>} />
    <div className="pt-6"><SearchField value={search} onChange={setSearch} placeholder="Search prompts in this folder" /></div>
    <SectionTitle eyebrow="Inside this folder">Prompts</SectionTitle>
    {prompts.isLoading ? <LoadingCards grid /> : prompts.isError ? <ErrorState message={apiMessage(prompts.error)} retry={prompts.refetch} /> : prompts.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{prompts.data.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} showContext categoryOnly onFavorite={favorite.mutate} />)}</div> : <EmptyState title={search ? 'No matching prompts' : 'No prompts here yet'} text={search ? 'Try another keyword.' : 'Create a prompt, then choose or create its category in the form.'} action={!search ? () => navigate(`/folders/${id}/prompts/new`) : undefined} actionTitle="Create Prompt" />}
    <SectionTitle eyebrow="Manage">Folder actions</SectionTitle>
    <div className="glass flex flex-col gap-3 rounded-[22px] p-4 sm:flex-row"><Button title="Archive folder" icon={Archive} variant="secondary" loading={archive.isPending} onClick={() => archive.mutate()} /><Button title="Delete folder" icon={Trash2} variant="danger" onClick={() => setDeleting(true)} /></div>
    <ConfirmDialog open={deleting} title="Delete folder?" message="This permanently deletes all categories and prompts in this folder." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} />
  </Page>;
}
