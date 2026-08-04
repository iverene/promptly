import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Folder, Plus, Settings } from 'lucide-react-native';
import { foldersApi, promptsApi } from '../src/api/resources';
import { apiMessage } from '../src/api/client';
import { EmptyState, ErrorState, GlassCard, Header, IconButton, LoadingCards, Screen, SearchField, SectionTitle } from '../src/components/ui';
import { PromptCard } from '../src/components/PromptCard';
import { formatDate, promptCount } from '../src/lib/format';
import { colors } from '../src/theme';
import { useToast } from '../src/providers/ToastProvider';

export default function Home() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const toast = useToast();
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }) });
  const favorites = useQuery({ queryKey: ['prompts', 'favorites'], queryFn: () => promptsApi.list({ favorite: true, limit: 5 }) });
  const recent = useQuery({ queryKey: ['prompts', 'recent'], queryFn: () => promptsApi.list({ recent: true, limit: 5 }) });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (e) => toast(apiMessage(e), 'error') });
  const renderPrompts = (query, empty) => query.isLoading ? <LoadingCards count={2} /> : query.data?.length ? <View className="gap-3">{query.data.map((item) => <PromptCard key={item.id} prompt={item} showContext onFavorite={favorite.mutate} />)}</View> : <Text className="py-4 font-sans text-sm text-muted">{empty}</Text>;
  return <Screen><Header title="Promptly" subtitle="Your fashion prompt library" right={<IconButton icon={Settings} label="Settings" onPress={() => router.push('/settings')} />} />
    <View className="px-4"><View className="mt-5"><SearchField value={search} onChangeText={setSearch} placeholder="Search folders" /></View>
      {!search && <><SectionTitle>Favorites</SectionTitle>{renderPrompts(favorites, 'Favorite prompts will appear here.')}<SectionTitle>Recent prompts</SectionTitle>{renderPrompts(recent, 'Your recently edited prompts will appear here.')}</>}
      <SectionTitle action={<IconButton icon={Plus} label="Create folder" onPress={() => router.push('/folder/edit')} />}>Folders</SectionTitle>
      {folders.isLoading ? <LoadingCards /> : folders.isError ? <ErrorState message={apiMessage(folders.error)} retry={folders.refetch} /> : folders.data?.length ? <View className="gap-3">{folders.data.map((item) => <GlassCard key={item.id} label={`Open ${item.name}`} onPress={() => router.push(`/folder/${item.id}`)}><View className="flex-row items-start gap-4"><View className="h-12 w-12 items-center justify-center rounded-2xl bg-black"><Folder size={22} color="#fff" /></View><View className="min-w-0 flex-1"><Text className="font-semibold text-lg text-ink">{item.name}</Text>{item.description && <Text numberOfLines={2} className="mt-1 font-sans text-sm text-secondary">{item.description}</Text>}<Text className="mt-3 font-sans text-xs text-muted">{item.categories.length} categories · {promptCount(item)} prompts · {formatDate(item.updatedAt)}</Text></View></View></GlassCard>)}</View> : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => router.push('/folder/edit') : undefined} actionTitle="Create Folder" />}
    </View>
  </Screen>;
}

