import { Plus } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { EmptyState, ErrorState, IconButton, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { FolderCard } from '../components/FolderCard';
import { PromptCard } from '../components/PromptCard';
import { useToast } from '../providers/ToastProvider';

export default function Home() {
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }) });
  const favorites = useQuery({ queryKey: ['prompts', 'favorites'], queryFn: () => promptsApi.list({ favorite: true, limit: 6 }) });
  const recent = useQuery({ queryKey: ['prompts', 'recent'], queryFn: () => promptsApi.list({ recent: true, limit: 6 }) });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (error) => toast(apiMessage(error), 'error') });
  const promptSection = (query, empty) => query.isLoading ? <LoadingCards count={3} grid /> : query.data?.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{query.data.map((item) => <PromptCard key={item.id} prompt={item} showContext onFavorite={favorite.mutate} />)}</div> : <p className="rounded-[22px] border border-dashed border-black/10 bg-white/35 px-5 py-7 text-sm text-muted">{empty}</p>;

  return <Page>
    <header className="pb-7 pt-4 sm:pb-10 sm:pt-8"><p className="text-[10px] font-medium uppercase tracking-[.24em] text-muted">Personal prompt library</p><div className="mt-3 flex items-end justify-between gap-5"><h1 className="text-[clamp(3rem,10vw,6.8rem)] font-medium leading-[.82] tracking-[-.085em] text-ink">Promptly</h1><span className="hidden max-w-52 pb-1 text-right text-xs leading-5 text-secondary sm:block">A quiet filing cabinet for your fashion ideas.</span></div></header>
    <div className="sticky top-4 z-30 max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search your folders" /></div>
    {!search && <><SectionTitle eyebrow="Saved for later">Favorites</SectionTitle>{promptSection(favorites, 'Favorite prompts will appear here.')}<SectionTitle eyebrow="Continue where you left off">Recent prompts</SectionTitle>{promptSection(recent, 'Your recently edited prompts will appear here.')}</>}
    <SectionTitle eyebrow="Your filing cabinet" action={<IconButton icon={Plus} label="Create folder" onClick={() => navigate('/folders/new')} />}>Folders</SectionTitle>
    {folders.isLoading ? <LoadingCards grid /> : folders.isError ? <ErrorState message={apiMessage(folders.error)} retry={folders.refetch} /> : folders.data?.length ? <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">{folders.data.map((folder) => <FolderCard key={folder.id} folder={folder} onClick={() => navigate(`/folders/${folder.id}`)} />)}</div> : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => navigate('/folders/new') : undefined} actionTitle="Create Folder" />}
    <button onClick={() => navigate('/folders/new')} aria-label="Create folder" className="focus-ring fixed bottom-28 right-5 z-30 grid size-14 place-items-center rounded-full bg-black text-white shadow-[0_16px_34px_rgba(0,0,0,.24)] transition duration-200 hover:-translate-y-1 sm:right-8 lg:right-10"><Plus size={22} /></button>
  </Page>;
}
