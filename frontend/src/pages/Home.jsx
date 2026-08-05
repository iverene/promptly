import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { EmptyState, ErrorState, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { FolderCard } from '../components/FolderCard';
import { useAuth } from '../providers/AuthProvider';

export default function Home() {
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const { displayName } = useAuth();
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }) });

  return <Page>
    <header className="pb-7 pt-4 sm:pb-10 sm:pt-8"><p className="text-[10px] font-medium uppercase tracking-[.24em] text-muted">Personal prompt library</p><div className="mt-3 flex items-end justify-between gap-5"><h1 className="text-[clamp(3.6rem,11vw,7.5rem)] leading-[.78] tracking-[-.065em] text-ink">Promptly</h1><button onClick={() => navigate('/profile')} className="focus-ring glass flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-medium"><span className="grid size-8 place-items-center rounded-full bg-black text-xs uppercase text-white">{displayName.charAt(0)}</span><span className="hidden max-w-32 truncate sm:block">{displayName}</span></button></div></header>
    <div className="sticky top-4 z-30 max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search your folders" /></div>
    <SectionTitle eyebrow="Your filing cabinet">Folders</SectionTitle>
    {folders.isLoading ? <LoadingCards grid /> : folders.isError ? <ErrorState message={apiMessage(folders.error)} retry={folders.refetch} /> : folders.data?.length ? <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">{folders.data.map((folder) => <FolderCard key={folder.id} folder={folder} onClick={() => navigate(`/folders/${folder.id}`)} />)}</div> : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => navigate('/folders/new') : undefined} actionTitle="Create Folder" />}
  </Page>;
}
