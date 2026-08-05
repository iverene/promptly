import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { AddButton, EmptyState, ErrorState, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { FolderCard } from '../components/FolderCard';
import { useAuth } from '../providers/AuthProvider';

export default function Home() {
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const { displayName } = useAuth();
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }), placeholderData: (previousData) => previousData });

  return <Page>
    <header className="pb-7 sm:pb-10"><div className="flex items-end justify-between gap-5"><h1 className="text-[clamp(3rem,9vw,6rem)] leading-[.82] tracking-[-.055em] text-ink">Promptly</h1><button onClick={() => navigate('/profile')} aria-label={`Open ${displayName}'s profile`} className="focus-ring glass flex size-12 shrink-0 items-center justify-center rounded-full p-2 text-sm font-medium sm:h-auto sm:w-auto sm:gap-2 sm:py-2 sm:pl-2 sm:pr-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-xs uppercase text-white">{displayName.charAt(0)}</span><span className="hidden max-w-32 truncate sm:block">{displayName}</span></button></div></header>
    <div className="sticky top-4 z-30 max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search your folders" /></div>
    <SectionTitle>Folders</SectionTitle>
    {folders.isLoading ? <LoadingCards count={4} grid mobileColumns /> : folders.isError ? <ErrorState message={apiMessage(folders.error)} retry={folders.refetch} /> : folders.data?.length ? <><div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-7 xl:grid-cols-3">{folders.data.map((folder) => <FolderCard key={folder.id} folder={folder} onClick={() => navigate(`/folders/${folder.id}`)} />)}</div>{!search && <AddButton onClick={() => navigate('/folders/new')} label="Create folder" />}</> : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => navigate('/folders/new') : undefined} actionTitle="Create folder" />}
  </Page>;
}
