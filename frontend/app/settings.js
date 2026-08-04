import { Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Folder, RotateCcw } from 'lucide-react-native';
import { foldersApi, promptsApi } from '../src/api/resources';
import { apiMessage } from '../src/api/client';
import { EmptyState, ErrorState, GlassCard, Header, IconButton, LoadingCards, Screen, SectionTitle } from '../src/components/ui';
import { useToast } from '../src/providers/ToastProvider';

export default function Settings() {
  const toast = useToast(); const queryClient = useQueryClient();
  const folders = useQuery({ queryKey: ['folders', 'archived'], queryFn: () => foldersApi.list({ archived: true }) });
  const prompts = useQuery({ queryKey: ['prompts', 'archived'], queryFn: () => promptsApi.list({ archived: true }) });
  const restore = useMutation({ mutationFn: ({ type, id }) => type === 'folder' ? foldersApi.update(id, { isArchived: false }) : promptsApi.update(id, { isArchived: false }), onSuccess: (_, item) => { queryClient.invalidateQueries(); toast(`${item.type === 'folder' ? 'Folder' : 'Prompt'} restored`); }, onError: (e) => toast(apiMessage(e), 'error') });
  const list = (query, type) => query.isLoading ? <LoadingCards count={2} /> : query.isError ? <ErrorState message={apiMessage(query.error)} retry={query.refetch} /> : query.data?.length ? <View className="gap-3">{query.data.map((item) => <GlassCard key={item.id}><View className="flex-row items-center gap-3"><View className="h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100"><Folder size={20} color="#0A0A0A" /></View><View className="min-w-0 flex-1"><Text numberOfLines={1} className="font-semibold text-base text-ink">{item.name ?? item.title}</Text>{type === 'prompt' && <Text className="mt-1 text-xs text-muted">{item.category.folder.name} / {item.category.name}</Text>}</View><IconButton icon={RotateCcw} label={`Restore ${type}`} onPress={() => restore.mutate({ type, id: item.id })} /></View></GlassCard>)}</View> : <Text className="py-4 font-sans text-sm text-muted">No archived {type}s.</Text>;
  return <Screen><Header title="Settings" subtitle="Manage archived items" back /><View className="px-4"><SectionTitle>Archived folders</SectionTitle>{list(folders, 'folder')}<SectionTitle>Archived prompts</SectionTitle>{list(prompts, 'prompt')}<View className="mt-10 border-t border-black/5 py-6"><Text className="font-semibold text-base text-ink">About Promptly</Text><Text className="mt-2 font-sans leading-5 text-secondary">A focused, personal library for reusable fashion image and video prompts.</Text><Text className="mt-3 font-sans text-xs text-muted">Version 1.0.0</Text></View></View></Screen>;
}
