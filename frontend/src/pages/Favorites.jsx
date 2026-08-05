import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { EmptyState, ErrorState, Header, LoadingCards, Page, SectionTitle } from '../components/ui';
import { PromptCard } from '../components/PromptCard';
import { useToast } from '../providers/ToastProvider';

export default function Favorites() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const favorites = useQuery({ queryKey: ['prompts', 'favorites'], queryFn: () => promptsApi.list({ favorite: true }), placeholderData: (previousData) => previousData });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (error) => toast(apiMessage(error), 'error') });
  return <Page><Header title="Favorites" back="/home" />
    {favorites.isLoading ? <LoadingCards grid /> : favorites.isError ? <ErrorState message={apiMessage(favorites.error)} retry={favorites.refetch} /> : favorites.data?.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{favorites.data.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} showContext onFavorite={favorite.mutate} />)}</div> : <EmptyState title="No favorites yet" text="Use the heart on a prompt to keep it here." />}
  </Page>;
}
