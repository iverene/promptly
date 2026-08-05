import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { categoriesApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { CategoryPicker } from '../components/CategoryPicker';
import { Button, ErrorState, Field, Header, Page } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const schema = z.object({
  categoryId: z.string().optional(),
  categoryName: z.string().trim().max(120, 'Category name is too long').optional(),
  title: z.string().trim().min(1, 'Title is required').max(180),
  content: z.string().trim().min(1, 'Prompt is required').max(30000),
  notes: z.string().trim().max(10000).optional(),
}).superRefine((values, context) => {
  if (!values.categoryId && !values.categoryName) context.addIssue({ code: 'custom', path: ['categoryName'], message: 'Choose a category or enter a new one' });
});

export default function PromptForm() {
  const params = useParams();
  const id = params.id;
  const initialCategoryId = params.categoryId;
  const editing = Boolean(id);
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [categoryOpen, setCategoryOpen] = useState(false);
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
  const categoryLabel = selectedCategory?.name || categoryName.trim() || (selected ? sourceCategory.data?.name : '') || 'Select a category';

  const createCategory = useMutation({
    mutationFn: () => categoriesApi.create({ folderId, name: categoryName.trim() }),
    onSuccess: (created) => {
      queryClient.setQueryData(['categories', folderId], (current = []) => [...current, created]);
      queryClient.invalidateQueries({ queryKey: ['folder', folderId] });
      setValue('categoryId', created.id, { shouldValidate: true });
      setValue('categoryName', '', { shouldValidate: true });
      setCategoryOpen(false);
      toast('Category added');
    },
    onError: (error) => toast(apiMessage(error), 'error'),
  });

  const save = useMutation({
    mutationFn: async ({ categoryName: newCategoryName, ...values }) => {
      let categoryId = values.categoryId;
      if (!categoryId) {
        const category = await categoriesApi.create({ folderId, name: newCategoryName });
        categoryId = category.id;
      }
      const payload = { ...values, categoryId };
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
      <fieldset>
        <legend className="mb-3 text-xs font-medium uppercase tracking-[.12em] text-secondary">Category</legend>
        <button type="button" aria-haspopup="dialog" aria-expanded={categoryOpen} onClick={() => setCategoryOpen(true)} className="focus-ring flex h-13 w-full items-center justify-between gap-4 rounded-none border border-black/20 bg-white/76 px-4 text-left text-sm transition hover:bg-white"><span className={selected || categoryName.trim() ? 'text-ink' : 'text-muted'}>{categoryLabel}</span><ChevronDown size={18} className="shrink-0" /></button>
        {categories.isError && <p className="mt-2 text-xs text-danger">{apiMessage(categories.error)}</p>}
        {errors.categoryName && <p className="mt-2 text-xs text-danger">{errors.categoryName.message}</p>}
      </fieldset>
      <input type="hidden" {...register('categoryId')} />
      <input type="hidden" {...register('categoryName')} />
      <Field label="Title" placeholder="Give this prompt a clear name" error={errors.title?.message} {...register('title')} />
      <Field label="Prompt" placeholder="Write or paste your prompt…" multiline error={errors.content?.message} {...register('content')} />
      <Field label="Notes (optional)" placeholder="Usage tips, settings, or reminders" multiline className="min-h-32" error={errors.notes?.message} {...register('notes')} />
      <div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Save prompt'} loading={save.isPending} disabled={!folderId || categories.isLoading} /></div>
    </form>
    <CategoryPicker
      open={categoryOpen}
      onClose={() => setCategoryOpen(false)}
      categories={categories.data}
      loading={categories.isLoading}
      selected={selected}
      categoryName={categoryName}
      onNameChange={(name) => { createCategory.reset(); setValue('categoryName', name, { shouldValidate: true }); if (name) setValue('categoryId', '', { shouldValidate: true }); }}
      onSelect={(categoryId) => { setValue('categoryId', categoryId, { shouldValidate: true }); setValue('categoryName', '', { shouldValidate: true }); }}
      onCreate={() => createCategory.mutate()}
      creating={createCategory.isPending}
      error={createCategory.isError ? apiMessage(createCategory.error) : errors.categoryName?.message}
    />
  </Page>;
}
