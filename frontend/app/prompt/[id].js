import { Alert, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Archive, Copy, Heart, Pencil, Trash2 } from 'lucide-react-native';
import { promptsApi } from '../../src/api/resources';
import { apiMessage } from '../../src/api/client';
import { Button, ErrorState, GlassCard, Header, IconButton, LoadingCards, Screen, SectionTitle } from '../../src/components/ui';
import { formatDate } from '../../src/lib/format';
import { useToast } from '../../src/providers/ToastProvider';

export default function PromptDetail() {
  const { id } = useLocalSearchParams(); const toast = useToast(); const queryClient = useQueryClient();
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id) });
  const update = useMutation({ mutationFn: (body) => promptsApi.update(id, body), onSuccess: (saved) => { queryClient.setQueryData(['prompt', id], saved); queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt updated'); }, onError: (e) => toast(apiMessage(e), 'error') });
  const remove = useMutation({ mutationFn: () => promptsApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); toast('Prompt deleted'); router.replace('/home'); }, onError: (e) => toast(apiMessage(e), 'error') });
  if (prompt.isLoading) return <Screen><Header title="Prompt" back /><View className="p-4"><LoadingCards count={2} /></View></Screen>;
  if (prompt.isError) return <Screen><Header title="Prompt" back /><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></Screen>;
  const data = prompt.data; const copy = async () => { await Clipboard.setStringAsync(data.content); await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); toast('Prompt copied'); };
  const confirmDelete = () => Alert.alert('Delete prompt?', 'This action cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => remove.mutate() }]);
  return <Screen><Header title={data.title} subtitle={`${data.category.folder.name} / ${data.category.name}`} back right={<IconButton icon={Heart} label={data.isFavorite ? 'Remove favorite' : 'Add favorite'} onPress={() => update.mutate({ isFavorite: !data.isFavorite })} />} /><View className="px-4 py-6"><GlassCard className="bg-white/90"><Text selectable className="font-sans text-base leading-7 text-ink">{data.content}</Text></GlassCard>
    {data.notes && <><SectionTitle>Notes</SectionTitle><GlassCard className="bg-white/85"><Text selectable className="font-sans leading-6 text-secondary">{data.notes}</Text></GlassCard></>}
    <Text className="mt-4 text-center font-sans text-xs text-muted">Updated {formatDate(data.updatedAt)}</Text>
    <View className="mt-6 gap-3"><Button title="Copy prompt" icon={Copy} onPress={copy} /><Button title="Edit prompt" icon={Pencil} variant="secondary" onPress={() => router.push({ pathname: '/prompt/edit', params: { id } })} /><Button title="Archive prompt" icon={Archive} variant="secondary" onPress={() => update.mutate({ isArchived: true })} /><Button title="Delete prompt" icon={Trash2} variant="danger" onPress={confirmDelete} /></View>
  </View></Screen>;
}

