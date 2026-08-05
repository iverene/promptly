import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { categoriesApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ConfirmDialog, ErrorState, Field, Header, Page } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const schema = z.object({ name: z.string().trim().min(1, 'Name is required').max(120) });
export default function CategoryForm() {
  const params = useParams(); const id = params.id; const folderId = params.folderId; const editing = Boolean(id); const [, navigate] = useLocation(); const toast = useToast(); const queryClient = useQueryClient(); const [deleting, setDeleting] = useState(false);
  const category = useQuery({ queryKey: ['category', id], queryFn: () => categoriesApi.get(id), enabled: editing });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '' } });
  useEffect(() => { if (category.data) reset({ name: category.data.name }); }, [category.data, reset]);
  const save = useMutation({ mutationFn: (values) => editing ? categoriesApi.update(id, values) : categoriesApi.create({ ...values, folderId }), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['folder'] }); queryClient.invalidateQueries({ queryKey: ['category'] }); toast(editing ? 'Category updated' : 'Category added'); navigate(`/folders/${saved.folderId}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  const remove = useMutation({ mutationFn: () => categoriesApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folder'] }); toast('Category deleted'); navigate(`/folders/${category.data.folderId}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  return <Page className="max-w-3xl"><Header title={editing ? 'Edit category' : 'Add category'} subtitle="Create a clear label for this prompt type" back /><div className="glass-strong mt-8 rounded-[30px] p-5 sm:p-8">{category.isError ? <ErrorState message={apiMessage(category.error)} retry={category.refetch} /> : <form className="grid gap-7" onSubmit={handleSubmit((values) => save.mutate(values))}><Field label="Category name" placeholder="e.g. Movements" autoFocus={!editing} error={errors.name?.message} {...register('name')} /><div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">{editing ? <Button title="Delete category" icon={Trash2} variant="danger" onClick={() => setDeleting(true)} /> : <span />}<Button type="submit" title={editing ? 'Save changes' : 'Add category'} loading={save.isPending} /></div></form>}</div><ConfirmDialog open={deleting} title="Delete category?" message="This permanently deletes every prompt in this category." onClose={() => setDeleting(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} /></Page>;
}
