import { Settings2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { useState } from 'react';
import { categoriesApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { EmptyState, ErrorState, Header, IconButton, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { PromptCard } from '../components/PromptCard';
import { useToast } from '../providers/ToastProvider';

export default function CategoryDetail() {
  const { id } = useParams();
  const [search, setSearch] = useState('');
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const toast = useToast();
  const category = useQuery({ queryKey: ['category', id], queryFn: () => categoriesApi.get(id) });
  const prompts = useQuery({ queryKey: ['prompts', id, search], queryFn: () => promptsApi.list({ categoryId: id, search }) });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (error) => toast(apiMessage(error), 'error') });

  return <Page><Header title={category.data?.name || 'Category'} subtitle={category.data?.folder?.name} back actions={<IconButton icon={Settings2} label="Edit category" onClick={() => navigate(`/categories/${id}/edit`)} />} />
    <div className="pt-8"><div className="max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search this category" /></div>
      <SectionTitle eyebrow={category.data?.folder?.name}>Prompts</SectionTitle>
      {category.isError ? <ErrorState message={apiMessage(category.error)} retry={category.refetch} /> : prompts.isLoading ? <LoadingCards grid /> : prompts.isError ? <ErrorState message={apiMessage(prompts.error)} retry={prompts.refetch} /> : prompts.data?.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{prompts.data.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} onFavorite={favorite.mutate} />)}</div> : <EmptyState title={search ? 'No matching prompts' : 'No prompts here yet'} text={search ? 'Try another keyword.' : 'Create your first prompt in this category.'} action={!search ? () => navigate(`/categories/${id}/prompts/new`) : undefined} actionTitle="Create Prompt" />}
    </div>
  </Page>;
}
