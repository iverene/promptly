import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Folder, RotateCcw, ScrollText } from 'lucide-react';
import { Link } from 'wouter';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { useToast } from '../providers/ToastProvider';
import { ErrorState, GlassCard, IconButton, LoadingCards } from './ui';

export function ArchivedCollection({ type, limit, moreHref }) {
  const isFolder = type === 'folder';
  const queryClient = useQueryClient();
  const toast = useToast();
  const query = useQuery({
    queryKey: [isFolder ? 'folders' : 'prompts', 'archived'],
    queryFn: () => isFolder ? foldersApi.list({ archived: true }) : promptsApi.list({ archived: true }),
    placeholderData: (previousData) => previousData,
  });
  const restore = useMutation({
    mutationFn: (id) => isFolder ? foldersApi.update(id, { isArchived: false }) : promptsApi.update(id, { isArchived: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [isFolder ? 'folders' : 'prompts'] });
      toast(`${isFolder ? 'Folder' : 'Prompt'} restored`);
    },
    onError: (error) => toast(apiMessage(error), 'error'),
  });

  if (query.isLoading) return <LoadingCards grid />;
  if (query.isError) return <ErrorState message={apiMessage(query.error)} retry={query.refetch} />;

  const items = limit ? query.data?.slice(0, limit) : query.data;
  if (!items?.length) return <p className="rounded-[22px] border border-dashed border-black/20 bg-white/35 px-5 py-7 text-sm text-muted">No archived {isFolder ? 'folders' : 'prompts'}.</p>;

  return <>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => <GlassCard key={item.id}>
        <div className="flex items-center gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-black/20 bg-white/65">{isFolder ? <Folder size={18} strokeWidth={1.7} /> : <ScrollText size={18} strokeWidth={1.7} />}</span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-medium tracking-[-.03em]">{item.name || item.title}</h3>
            {!isFolder && <p className="mt-1 truncate text-[10px] uppercase tracking-[.12em] text-muted">{item.category.folder.name} · {item.category.name}</p>}
          </div>
          <IconButton icon={RotateCcw} label={`Restore ${type}`} onClick={() => restore.mutate(item.id)} />
        </div>
      </GlassCard>)}
    </div>
    {moreHref && query.data.length > limit && <div className="mt-5 flex justify-end"><Link href={moreHref} className="focus-ring inline-flex min-h-11 items-center justify-center border border-black bg-black px-5 text-sm font-medium text-white hover:bg-zinc-800">See more</Link></div>}
  </>;
}
