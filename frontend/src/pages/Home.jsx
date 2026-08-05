import { Folder, Plus, Settings } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { foldersApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { EmptyState, ErrorState, GlassCard, Header, IconButton, LoadingCards, Page, SearchField, SectionTitle } from '../components/ui';
import { PromptCard } from '../components/PromptCard';
import { formatDate, promptCount } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export default function Home() {
  const [search, setSearch] = useState(''); const [, navigate] = useLocation(); const queryClient = useQueryClient(); const toast = useToast();
  const folders = useQuery({ queryKey: ['folders', search], queryFn: () => foldersApi.list({ search }) });
  const favorites = useQuery({ queryKey: ['prompts', 'favorites'], queryFn: () => promptsApi.list({ favorite: true, limit: 6 }) });
  const recent = useQuery({ queryKey: ['prompts', 'recent'], queryFn: () => promptsApi.list({ recent: true, limit: 6 }) });
  const favorite = useMutation({ mutationFn: (prompt) => promptsApi.update(prompt.id, { isFavorite: !prompt.isFavorite }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }), onError: (e) => toast(apiMessage(e), 'error') });
  const promptSection = (query, empty) => query.isLoading ? <LoadingCards count={2} grid /> : query.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{query.data.map((item) => <PromptCard key={item.id} prompt={item} showContext onFavorite={favorite.mutate} />)}</div> : <p className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-sm text-muted">{empty}</p>;
  return <Page><Header title="Promptly" subtitle="Your fashion prompt library" actions={<IconButton icon={Settings} label="Settings" onClick={() => navigate('/settings')} />} />
    <div className="pt-6"><div className="max-w-2xl"><SearchField value={search} onChange={setSearch} placeholder="Search folders" /></div>
      {!search && <><SectionTitle eyebrow="Pinned">Favorites</SectionTitle>{promptSection(favorites, 'Favorite prompts will appear here.')}<SectionTitle eyebrow="Continue working">Recent prompts</SectionTitle>{promptSection(recent, 'Your recently edited prompts will appear here.')}</>}
      <SectionTitle eyebrow="Your library" action={<IconButton icon={Plus} label="Create folder" onClick={() => navigate('/folders/new')} />}>Folders</SectionTitle>
      {folders.isLoading ? <LoadingCards grid /> : folders.isError ? <ErrorState message={apiMessage(folders.error)} retry={folders.refetch} /> : folders.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{folders.data.map((item) => <GlassCard key={item.id} onClick={() => navigate(`/folders/${item.id}`)} label={`Open ${item.name}`} className="min-h-40"><div className="flex h-full items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-black text-white"><Folder size={22} /></span><div className="min-w-0 flex-1"><h3 className="truncate text-lg font-semibold">{item.name}</h3>{item.description && <p className="mt-1 line-clamp-2 text-sm leading-5 text-secondary">{item.description}</p>}<p className="mt-5 text-xs text-muted">{item.categories.length} categories · {promptCount(item)} prompts</p><p className="mt-1 text-xs text-muted">Updated {formatDate(item.updatedAt)}</p></div></div></GlassCard>)}</div> : <EmptyState title={search ? 'No matching folders' : 'No folders yet'} text={search ? 'Try another keyword.' : 'Create your first fashion folder to organize your prompts.'} action={!search ? () => navigate('/folders/new') : undefined} actionTitle="Create Folder" />}
    </div>
  </Page>;
}
