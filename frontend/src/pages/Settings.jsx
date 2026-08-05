import { Folder, RotateCcw, ScrollText } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { ErrorState, GlassCard, Header, IconButton, LoadingCards, Page, SectionTitle } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

export default function Settings() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const folders = useQuery({ queryKey: ['folders', 'archived'], queryFn: () => foldersApi.list({ archived: true }) });
  const prompts = useQuery({ queryKey: ['prompts', 'archived'], queryFn: () => promptsApi.list({ archived: true }) });
  const restore = useMutation({ mutationFn: ({ type, id }) => type === 'folder' ? foldersApi.update(id, { isArchived: false }) : promptsApi.update(id, { isArchived: false }), onSuccess: (_, item) => { queryClient.invalidateQueries(); toast(`${item.type === 'folder' ? 'Folder' : 'Prompt'} restored`); }, onError: (error) => toast(apiMessage(error), 'error') });
  const list = (query, type) => query.isLoading ? <LoadingCards count={2} grid /> : query.isError ? <ErrorState message={apiMessage(query.error)} retry={query.refetch} /> : query.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{query.data.map((item) => <GlassCard key={item.id}><div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-full border border-black/8 bg-white/65">{type === 'folder' ? <Folder size={19} strokeWidth={1.7} /> : <ScrollText size={19} strokeWidth={1.7} />}</span><div className="min-w-0 flex-1"><h3 className="truncate text-lg font-medium tracking-[-.03em]">{item.name || item.title}</h3>{type === 'prompt' && <p className="mt-1 truncate text-[10px] uppercase tracking-[.12em] text-muted">{item.category.folder.name} · {item.category.name}</p>}</div><IconButton icon={RotateCcw} label={`Restore ${type}`} onClick={() => restore.mutate({ type, id: item.id })} /></div></GlassCard>)}</div> : <p className="rounded-[22px] border border-dashed border-black/10 bg-white/35 px-5 py-7 text-sm text-muted">No archived {type}s.</p>;
  return <Page><Header title="Archive" subtitle="A quiet place for things you may need later" back /><SectionTitle eyebrow="Filed away">Archived folders</SectionTitle>{list(folders, 'folder')}<SectionTitle eyebrow="Saved prompts">Archived prompts</SectionTitle>{list(prompts, 'prompt')}<div className="mt-14 border-t border-black/8 py-8"><p className="text-[10px] uppercase tracking-[.18em] text-muted">Promptly · Web edition</p><h2 className="mt-3 text-2xl font-medium tracking-[-.045em]">A focused personal library.</h2><p className="mt-2 max-w-lg text-sm leading-6 text-secondary">Designed for reusable fashion image and video prompts.</p></div></Page>;
}
