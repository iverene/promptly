import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { categoriesApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ErrorState, Field, Header, Page } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const schema = z.object({ categoryId: z.string().min(1, 'Choose a category'), title: z.string().trim().min(1, 'Title is required').max(180), content: z.string().trim().min(1, 'Prompt is required').max(30000), notes: z.string().trim().max(10000).optional() });
export default function PromptForm() {
  const params = useParams(); const id = params.id; const initialCategoryId = params.categoryId; const editing = Boolean(id); const [, navigate] = useLocation(); const toast = useToast(); const queryClient = useQueryClient();
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id), enabled: editing });
  const sourceCategoryId = prompt.data?.categoryId || initialCategoryId;
  const sourceCategory = useQuery({ queryKey: ['category', sourceCategoryId], queryFn: () => categoriesApi.get(sourceCategoryId), enabled: Boolean(sourceCategoryId) });
  const folderId = prompt.data?.category?.folder?.id || sourceCategory.data?.folder?.id;
  const categories = useQuery({ queryKey: ['categories', folderId], queryFn: () => categoriesApi.list(folderId), enabled: Boolean(folderId) });
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { categoryId: initialCategoryId || '', title: '', content: '', notes: '' } });
  useEffect(() => { if (prompt.data) reset({ categoryId: prompt.data.categoryId, title: prompt.data.title, content: prompt.data.content, notes: prompt.data.notes || '' }); }, [prompt.data, reset]);
  const selected = watch('categoryId');
  const save = useMutation({ mutationFn: (values) => editing ? promptsApi.update(id, values) : promptsApi.create(values), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); queryClient.invalidateQueries({ queryKey: ['folder'] }); toast(editing ? 'Prompt updated' : 'Prompt saved'); navigate(`/prompts/${saved.id}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  if (prompt.isError) return <Page><Header title="Edit prompt" back /><div className="pt-6"><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></div></Page>;
  return <Page className="max-w-5xl"><Header title={editing ? 'Edit prompt' : 'Create prompt'} back /><form className="glass-strong mt-6 grid gap-6 rounded-[26px] p-5 sm:p-8" onSubmit={handleSubmit((values) => save.mutate(values))}>
    <fieldset><legend className="mb-2 text-sm font-medium">Category</legend><div className="flex flex-wrap gap-2">{categories.data?.map((item) => <button type="button" key={item.id} onClick={() => setValue('categoryId', item.id, { shouldValidate: true })} className={`focus-ring min-h-11 rounded-2xl border px-4 text-sm font-medium transition ${selected === item.id ? 'border-black bg-black text-white' : 'border-black/10 bg-white/75 text-ink hover:bg-white'}`}>{item.name}</button>)}</div>{errors.categoryId && <p className="mt-2 text-xs text-danger">{errors.categoryId.message}</p>}</fieldset>
    <input type="hidden" {...register('categoryId')} /><Field label="Title" placeholder="Give this prompt a clear name" error={errors.title?.message} {...register('title')} /><Field label="Prompt" placeholder="Write or paste your prompt…" multiline error={errors.content?.message} {...register('content')} /><Field label="Notes (optional)" placeholder="Usage tips, settings, or reminders" multiline className="min-h-32" error={errors.notes?.message} {...register('notes')} /><div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Save prompt'} loading={save.isPending} /></div>
  </form></Page>;
}
