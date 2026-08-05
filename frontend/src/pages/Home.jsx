import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Archive, MoreHorizontal, Trash2, X } from 'lucide-react';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { ActionMenu } from '../components/ActionMenu';
import { FolderCard } from '../components/FolderCard';
import { FolderGrid } from '../components/FolderGrid';
import { ProfileButton } from '../components/ProfileButton';
import { AddButton, ConfirmDialog, EmptyState, ErrorState, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from '../providers/ToastProvider';

export default function Home() {
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const { displayName } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }) });
  const selectionMode = selectedIds.length > 0;
  const countLabel = `${selectedIds.length} folder${selectedIds.length === 1 ? '' : 's'}`;
  const clearSelection = () => { setSelectedIds([]); setActionsOpen(false); };
  const toggleSelection = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const beginSelection = (id) => setSelectedIds((current) => current.includes(id) ? current : [...current, id]);
  const archiveSelected = useMutation({
    mutationFn: () => Promise.all(selectedIds.map((id) => foldersApi.update(id, { isArchived: true }))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast(`${countLabel} archived`);
      clearSelection();
    },
    onError: (error) => toast(apiMessage(error), 'error'),
  });
  const deleteSelected = useMutation({
    mutationFn: () => Promise.all(selectedIds.map((id) => foldersApi.remove(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      toast(`${countLabel} deleted`);
      setDeleteOpen(false);
      clearSelection();
    },
    onError: (error) => toast(apiMessage(error), 'error'),
  });
  const selectionActions = [
    { label: `Archive ${countLabel}`, icon: Archive, disabled: archiveSelected.isPending, onClick: () => { setActionsOpen(false); archiveSelected.mutate(); } },
    { label: `Delete ${countLabel}`, icon: Trash2, danger: true, disabled: deleteSelected.isPending, onClick: () => { setActionsOpen(false); setDeleteOpen(true); } },
  ];

  return <Page>
    <header className="pb-7 sm:pb-10">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] leading-[.82] tracking-[-.055em] text-ink lg:hidden">Promptly</h1>
        <div className="flex items-center gap-2">
          {selectionMode && <>
            <span className="hidden text-xs font-medium text-secondary sm:block">{countLabel} selected</span>
            <ActionMenu triggerIcon={MoreHorizontal} label="Selected folder actions" open={actionsOpen} onToggle={() => setActionsOpen((open) => !open)} options={selectionActions} />
            <button type="button" onClick={clearSelection} aria-label="Cancel folder selection" title="Cancel selection" className="focus-ring grid size-10 place-items-center border border-black/20 bg-white/70 text-ink"><X size={18} /></button>
          </>}
          <ProfileButton displayName={displayName} onClick={() => navigate('/profile')} />
        </div>
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
            <FolderGrid>{folders.data.map((folder) => <FolderCard key={folder.id} folder={folder} onClick={() => navigate(`/folders/${folder.id}`)} onLongPress={beginSelection} onSelect={toggleSelection} selected={selectedIds.includes(folder.id)} selectionMode={selectionMode} />)}</FolderGrid>
            {!search && !selectionMode && <AddButton onClick={() => navigate('/folders/new')} label="Create folder" />}
          </>
          : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => navigate('/folders/new') : undefined} actionTitle="Create folder" />}
    <ConfirmDialog open={deleteOpen} title={`Delete ${countLabel}?`} message="This permanently deletes the selected folders, including their categories and prompts." onClose={() => { if (!deleteSelected.isPending) setDeleteOpen(false); }} onConfirm={() => deleteSelected.mutate()} loading={deleteSelected.isPending} />
  </Page>;
}
