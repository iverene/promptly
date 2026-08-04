import { Alert, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, Image, MoreHorizontal, Plus, Trash2, Video, WandSparkles } from 'lucide-react-native';
import { foldersApi } from '../../src/api/resources';
import { apiMessage } from '../../src/api/client';
import { Button, EmptyState, ErrorState, GlassCard, Header, IconButton, LoadingCards, Screen, SectionTitle } from '../../src/components/ui';
import { colors } from '../../src/theme';
import { useToast } from '../../src/providers/ToastProvider';

const icons = { Image, Video, Movements: WandSparkles };
export default function FolderDetail() {
  const { id } = useLocalSearchParams(); const toast = useToast(); const queryClient = useQueryClient();
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id) });
  const mutate = useMutation({ mutationFn: ({ action }) => action(), onSuccess: (_, variables) => { queryClient.invalidateQueries({ queryKey: ['folders'] }); toast(variables.message); router.replace('/home'); }, onError: (e) => toast(apiMessage(e), 'error') });
  const confirmDelete = () => Alert.alert('Delete folder?', 'This permanently deletes all categories and prompts in this folder.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => mutate.mutate({ action: () => foldersApi.remove(id), message: 'Folder deleted' }) }]);
  if (folder.isLoading) return <Screen><Header title="Folder" back /><View className="p-4"><LoadingCards /></View></Screen>;
  if (folder.isError) return <Screen><Header title="Folder" back /><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></Screen>;
  const data = folder.data;
  return <Screen><Header title={data.name} subtitle={data.description || 'Fashion prompt folder'} back right={<IconButton icon={MoreHorizontal} label="Edit folder" onPress={() => router.push({ pathname: '/folder/edit', params: { id } })} />} /><View className="px-4"><SectionTitle action={<IconButton icon={Plus} label="Add category" onPress={() => router.push({ pathname: '/category/edit', params: { folderId: id } })} />}>Categories</SectionTitle>
    {data.categories.length ? <View className="gap-3">{data.categories.map((category) => { const Icon = icons[category.name] ?? Image; return <GlassCard key={category.id} label={`Open ${category.name}`} onPress={() => router.push(`/category/${category.id}`)}><View className="flex-row items-center gap-4"><View className="h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100"><Icon size={22} color={colors.ink} /></View><View className="flex-1"><Text className="font-semibold text-lg text-ink">{category.name}</Text><Text className="mt-1 font-sans text-sm text-muted">{category._count.prompts} prompts</Text></View></View></GlassCard>; })}</View> : <EmptyState title="No categories yet" text="Add a category to start organizing prompts in this folder." action={() => router.push({ pathname: '/category/edit', params: { folderId: id } })} actionTitle="Add Category" />}
    <SectionTitle>Folder actions</SectionTitle><View className="gap-3"><Button title="Archive folder" icon={Archive} variant="secondary" onPress={() => mutate.mutate({ action: () => foldersApi.update(id, { isArchived: true }), message: 'Folder archived' })} /><Button title="Delete folder" icon={Trash2} variant="danger" onPress={confirmDelete} /></View>
  </View></Screen>;
}

