import { Folder, RotateCcw, ScrollText } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { ErrorState, GlassCard, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

export default function Settings() {
  const toast = useToast(); const queryClient = useQueryClient();
  const folders = useQuery({ queryKey: ['folders', 'archived'], queryFn: () => foldersApi.list({ archived: true }) });
  const prompts = useQuery({ queryKey: ['prompts', 'archived'], queryFn: () => promptsApi.list({ archived: true }) });
  const restore = useMutation({ mutationFn: ({ type, id }) => type === 'folder' ? foldersApi.update(id, { isArchived: false }) : promptsApi.update(id, { isArchived: false }), onSuccess: (_, item) => { queryClient.invalidateQueries(); toast(`${item.type === 'folder' ? 'Folder' : 'Prompt'} restored`); }, onError: (e) => toast(apiMessage(e), 'error') });
  const list = (query, type) => query.isLoading ? <LoadingCards count={2} grid /> : query.isError ? <ErrorState message={apiMessage(query.error)} retry={query.refetch} /> : query.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{query.data.map((item) => <GlassCard key={item.id}><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-zinc-100">{type === 'folder' ? <Folder size={20} /> : <ScrollText size={20} />}</span><div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{item.name || item.title}</h3>{type === 'prompt' && <p className="mt-1 truncate text-xs text-muted">{item.category.folder.name} / {item.category.name}</p>}</div><IconButton icon={RotateCcw} label={`Restore ${type}`} onClick={() => restore.mutate({ type, id: item.id })} /></div></GlassCard>)}</div> : <p className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-muted">No archived {type}s.</p>;
  return <Page><Header title="Archive" subtitle="Restore folders and prompts when you need them" back /><SectionTitle eyebrow="Folders">Archived folders</SectionTitle>{list(folders, 'folder')}<SectionTitle eyebrow="Prompts">Archived prompts</SectionTitle>{list(prompts, 'prompt')}<div className="mt-12 border-t border-black/5 py-8"><h2 className="font-semibold">About Promptly</h2><p className="mt-2 max-w-lg text-sm leading-6 text-secondary">A focused personal library for reusable fashion image and video prompts.</p><p className="mt-3 text-xs text-muted">Version 1.0.0 · Web edition</p></div></Page>;
}
