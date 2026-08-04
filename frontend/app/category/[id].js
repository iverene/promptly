import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Settings2 } from 'lucide-react-native';
import { categoriesApi, promptsApi } from '../../src/api/resources';
import { apiMessage } from '../../src/api/client';
import { EmptyState, ErrorState, Header, IconButton, LoadingCards, Screen, SearchField } from '../../src/components/ui';
import { PromptCard } from '../../src/components/PromptCard';
import { useToast } from '../../src/providers/ToastProvider';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams(); const [search, setSearch] = useState(''); const queryClient = useQueryClient(); const toast = useToast();
  const category = useQuery({ queryKey: ['category', id], queryFn: () => categoriesApi.get(id) });
  const prompts = useQuery({ queryKey: ['prompts', id, search], queryFn: () => promptsApi.list({ categoryId: id, search }) });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (e) => toast(apiMessage(e), 'error') });
  const title = category.data?.name ?? 'Category'; const context = category.data?.folder?.name;
  return <Screen><Header title={title} subtitle={context} back right={<View className="flex-row gap-2"><IconButton icon={Settings2} label="Edit category" onPress={() => router.push({ pathname: '/category/edit', params: { id } })} /><IconButton icon={Plus} label="Create prompt" onPress={() => router.push({ pathname: '/prompt/edit', params: { categoryId: id } })} /></View>} />
    <View className="px-4"><View className="my-5"><SearchField value={search} onChangeText={setSearch} placeholder="Search prompts" /></View>
      {category.isError ? <ErrorState message={apiMessage(category.error)} retry={category.refetch} /> : prompts.isLoading ? <LoadingCards /> : prompts.isError ? <ErrorState message={apiMessage(prompts.error)} retry={prompts.refetch} /> : prompts.data?.length ? <View className="gap-3">{prompts.data.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} onFavorite={favorite.mutate} />)}</View> : <EmptyState title={search ? 'No matching prompts' : 'No prompts here yet'} text={search ? 'Try another keyword.' : 'Create your first prompt in this category.'} action={!search ? () => router.push({ pathname: '/prompt/edit', params: { categoryId: id } }) : undefined} actionTitle="Create Prompt" />}
    </View>
  </Screen>;
}
