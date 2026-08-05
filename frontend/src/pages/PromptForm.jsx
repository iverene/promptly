import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { categoriesApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ErrorState, Field, Header, Page } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const schema = z.object({
  categoryId: z.string().min(1, 'Select or add a category'),
  categoryName: z.string().trim().max(120, 'Category name is too long').optional(),
  title: z.string().trim().min(1, 'Title is required').max(180),
  content: z.string().trim().min(1, 'Prompt is required').max(30000),
  notes: z.string().trim().max(10000).optional(),
});

export default function PromptForm() {
  const params = useParams();
  const id = params.id;
  const initialCategoryId = params.categoryId;
  const editing = Boolean(id);
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id), enabled: editing });
  const sourceCategoryId = prompt.data?.categoryId || initialCategoryId;
  const sourceCategory = useQuery({ queryKey: ['category', sourceCategoryId], queryFn: () => categoriesApi.get(sourceCategoryId), enabled: Boolean(sourceCategoryId) });
  const folderId = params.folderId || prompt.data?.category?.folder?.id || sourceCategory.data?.folder?.id;
  const categories = useQuery({ queryKey: ['categories', folderId], queryFn: () => categoriesApi.list(folderId), enabled: Boolean(folderId) });
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { categoryId: initialCategoryId || '', categoryName: '', title: '', content: '', notes: '' } });

  useEffect(() => {
    if (prompt.data) reset({ categoryId: prompt.data.categoryId, categoryName: '', title: prompt.data.title, content: prompt.data.content, notes: prompt.data.notes || '' });
  }, [prompt.data, reset]);

  const selected = watch('categoryId');
  const categoryName = watch('categoryName') || '';
  const selectedCategory = categories.data?.find((item) => item.id === selected);

  const createCategory = useMutation({
    mutationFn: () => categoriesApi.create({ folderId, name: categoryName.trim() }),
    onSuccess: (created) => {
      queryClient.setQueryData(['categories', folderId], (current = []) => [...current, created]);
      queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
      setValue('categoryId', created.id, { shouldValidate: true });
      setValue('categoryName', '', { shouldValidate: true });
      toast('Category created');
    },
    onError: (error) => toast(apiMessage(error), 'error'),
  });

  const save = useMutation({
    mutationFn: async ({ categoryName: _categoryName, ...values }) => {
      const payload = values;
      return editing ? promptsApi.update(id, payload) : promptsApi.create(payload);
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['folder'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast(editing ? 'Prompt updated' : 'Prompt saved');
      navigate(`/prompts/${saved.id}`);
    },
    onError: (error) => toast(apiMessage(error), 'error'),
  });

  if (prompt.isError) return <Page><Header title="Edit prompt" back /><div className="pt-6"><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></div></Page>;
  if (sourceCategory.isError) return <Page><Header title={editing ? 'Edit prompt' : 'Create prompt'} back /><div className="pt-6"><ErrorState message={apiMessage(sourceCategory.error)} retry={sourceCategory.refetch} /></div></Page>;

  return <Page className="max-w-5xl">
    <Header title={editing ? 'Edit prompt' : 'Create prompt'} back={editing ? `/prompts/${id}` : folderId ? `/folders/${folderId}` : '/home'} />
    <form className="mt-8 grid gap-7" onSubmit={handleSubmit((values) => save.mutate(values))}>
      <fieldset className="grid gap-3">
        <legend className="mb-3 text-xs font-medium uppercase tracking-[.12em] text-secondary">Category</legend>
        <select value={selected} onChange={(event) => { setValue('categoryId', event.target.value, { shouldValidate: true }); setValue('categoryName', '', { shouldValidate: true }); }} disabled={!folderId || categories.isLoading} className="focus-ring h-13 w-full border border-black/20 bg-white/76 px-4 text-sm text-ink disabled:opacity-50">
          <option value="">Select an existing category</option>
          {selected && !selectedCategory && sourceCategory.data && <option value={selected}>{sourceCategory.data.name}</option>}
          {categories.data?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input value={categoryName} onChange={(event) => { createCategory.reset(); setValue('categoryName', event.target.value, { shouldValidate: true }); if (event.target.value) setValue('categoryId', '', { shouldValidate: true }); }} onKeyDown={(event) => { if (event.key === 'Enter' && folderId && categoryName.trim() && !createCategory.isPending) { event.preventDefault(); createCategory.mutate(); } }} autoComplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" placeholder="Add a new category" aria-label="New category name" className="focus-ring h-13 min-w-0 flex-1 border border-black/20 bg-white/76 px-4 text-sm placeholder:text-muted" />
          <button type="button" onClick={() => createCategory.mutate()} disabled={!folderId || !categoryName.trim() || createCategory.isPending} className="focus-ring inline-flex h-13 shrink-0 items-center justify-center gap-2 border border-black bg-black px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{createCategory.isPending ? 'Adding…' : <><Plus size={17} />Add</>}</button>
        </div>
        {categories.isError && <p className="mt-2 text-xs text-danger">{apiMessage(categories.error)}</p>}
        {errors.categoryId && <p className="mt-2 text-xs text-danger">{errors.categoryId.message}</p>}
      </fieldset>
      <input type="hidden" {...register('categoryId')} />
      <input type="hidden" {...register('categoryName')} />
      <Field label="Title" placeholder="Give this prompt a clear name" error={errors.title?.message} {...register('title')} />
      <Field label="Prompt" placeholder="Write or paste your prompt…" multiline error={errors.content?.message} {...register('content')} />
      <Field label="Notes (optional)" placeholder="Usage tips, settings, or reminders" multiline className="min-h-32" error={errors.notes?.message} {...register('notes')} />
      <div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Save prompt'} loading={save.isPending} disabled={!folderId || categories.isLoading} /></div>
    </form>
  </Page>;
}
