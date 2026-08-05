import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { categoriesApi, promptsApi } from '../api/resources';
import { apiMessage } from '../api/client';
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

  useEffect(() => {
    if (!categoryOpen) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [categoryOpen]);

  const selected = watch('categoryId');
  const categoryName = watch('categoryName');
  const selectedCategory = categories.data?.find((item) => item.id === selected);
  const categoryLabel = selectedCategory?.name || categoryName?.trim() || (selected ? sourceCategory.data?.name : '') || 'Select a category';
  const save = useMutation({
    mutationFn: async ({ categoryName, ...values }) => {
      let categoryId = values.categoryId;
      if (!categoryId) {
        const category = await categoriesApi.create({ folderId, name: categoryName });
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

  return <Page className="max-w-5xl"><Header title={editing ? 'Edit prompt' : 'Create prompt'} back={editing ? `/prompts/${id}` : folderId ? `/folders/${folderId}` : '/home'} /><form className="mt-8 grid gap-7" onSubmit={handleSubmit((values) => save.mutate(values))}>
    <fieldset>
      <legend className="mb-3 text-xs font-medium uppercase tracking-[.12em] text-secondary">Category</legend>
      <button type="button" aria-haspopup="dialog" aria-expanded={categoryOpen} onClick={() => setCategoryOpen(true)} className="focus-ring flex h-13 w-full items-center justify-between gap-4 rounded-[18px] border border-black/20 bg-white/76 px-4 text-left text-sm transition hover:bg-white"><span className={selected || categoryName?.trim() ? 'text-ink' : 'text-muted'}>{categoryLabel}</span><ChevronDown size={18} className="shrink-0" /></button>
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
    {categoryOpen && createPortal(<div className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden overscroll-none bg-black/30 p-3 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCategoryOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="category-picker-title" className="glass-strong soft-enter flex max-h-[80vh] w-full max-w-md flex-col rounded-[28px] p-5 sm:p-6"><header className="flex items-center justify-between gap-4 border-b border-black/20 pb-4"><h2 id="category-picker-title" className="text-xl">Categories</h2><button type="button" onClick={() => setCategoryOpen(false)} className="focus-ring min-h-10 rounded-full border border-black/30 bg-white/75 px-4 text-sm font-medium hover:bg-white">Confirm</button></header><div className="mt-5 flex gap-2"><input value={categoryName || ''} onChange={(event) => { setValue('categoryName', event.target.value, { shouldValidate: true }); if (event.target.value) setValue('categoryId', '', { shouldValidate: true }); }} autoComplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-bwignore="true" placeholder="New category name" aria-label="New category name" className="focus-ring h-12 min-w-0 flex-1 rounded-[16px] border border-black/30 bg-white/80 px-4 text-sm placeholder:text-muted" /><button type="button" aria-label="Use new category" disabled={!categoryName?.trim()} onClick={() => { setValue('categoryId', '', { shouldValidate: true }); setCategoryOpen(false); }} className="focus-ring grid size-12 shrink-0 place-items-center rounded-full border border-black/30 bg-white/80 disabled:cursor-not-allowed disabled:opacity-35"><Plus size={19} /></button></div>{errors.categoryName && <p className="mt-2 text-xs text-danger">{errors.categoryName.message}</p>}<div className="mt-5 max-h-72 overflow-y-auto overscroll-contain pr-1">{categories.isLoading ? <p className="py-6 text-center text-sm text-muted">Loading categories…</p> : categories.data?.length ? categories.data.map((item) => <button key={item.id} type="button" onClick={() => { setValue('categoryId', item.id, { shouldValidate: true }); setValue('categoryName', '', { shouldValidate: true }); }} className={`focus-ring flex min-h-12 w-full items-center justify-between gap-4 border-b border-dashed border-black/20 px-2 text-left text-sm transition hover:bg-white/45 ${selected === item.id ? 'font-semibold text-ink' : 'text-secondary'}`}><span className="truncate">{item.name}</span>{selected === item.id && <Check size={17} />}</button>) : <p className="py-6 text-center text-sm text-muted">No categories yet.</p>}</div></section></div>, document.body)}
  </Page>;
}
