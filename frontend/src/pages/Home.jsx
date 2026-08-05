import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { FolderCard } from '../components/FolderCard';
import { FolderGrid } from '../components/FolderGrid';
import { ProfileButton } from '../components/ProfileButton';
import { AddButton, EmptyState, ErrorState, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { useAuth } from '../providers/AuthProvider';

export default function Home() {
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const { displayName } = useAuth();
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }) });

  return <Page>
    <header className="pb-7 sm:pb-10">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-[clamp(3rem,9vw,6rem)] leading-[.82] tracking-[-.055em] text-ink lg:hidden">Promptly</h1>
        <ProfileButton displayName={displayName} onClick={() => navigate('/profile')} />
      </div>
    </header>
    <div className="sticky top-4 z-30 max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search your folders" /></div>
    <SectionTitle>Folders</SectionTitle>
    {folders.isLoading
      ? <LoadingCards count={4} grid mobileColumns />
      : folders.isError
        ? <ErrorState message={apiMessage(folders.error)} retry={folders.refetch} />
        : folders.data?.length
          ? <>
            <FolderGrid>{folders.data.map((folder) => <FolderCard key={folder.id} folder={folder} onClick={() => navigate(`/folders/${folder.id}`)} />)}</FolderGrid>
            {!search && <AddButton onClick={() => navigate('/folders/new')} label="Create folder" />}
          </>
          : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => navigate('/folders/new') : undefined} actionTitle="Create folder" />}
  </Page>;
}
