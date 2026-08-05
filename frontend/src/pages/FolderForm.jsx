import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { Button, ErrorState, Field, Header, Page } from '../components/ui';
import { useToast } from '../providers/ToastProvider';

const schema = z.object({ name: z.string().trim().min(1, 'Name is required').max(120), description: z.string().trim().max(500).optional() });
export default function FolderForm() {
  const { id } = useParams(); const editing = Boolean(id); const [, navigate] = useLocation(); const toast = useToast(); const queryClient = useQueryClient();
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id), enabled: editing });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', description: '' } });
  useEffect(() => { if (folder.data) reset({ name: folder.data.name, description: folder.data.description || '' }); }, [folder.data, reset]);
  const save = useMutation({ mutationFn: (values) => editing ? foldersApi.update(id, values) : foldersApi.create(values), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['folders'] }); queryClient.invalidateQueries({ queryKey: ['folder', id] }); toast(editing ? 'Folder updated' : 'Folder created'); navigate(`/folders/${saved.id}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  return <Page className="max-w-4xl"><Header title={editing ? 'Edit folder' : 'Create folder'} subtitle={!editing ? 'Create a space for related prompts.' : undefined} back /><div className="glass-strong mt-6 rounded-[26px] p-5 sm:p-8">{folder.isError ? <ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /> : <form className="grid gap-6" onSubmit={handleSubmit((values) => save.mutate(values))}><Field label="Name" placeholder="e.g. Dress" autoFocus={!editing} error={errors.name?.message} {...register('name')} /><Field label="Description (optional)" placeholder="What belongs in this folder?" multiline className="min-h-32" error={errors.description?.message} {...register('description')} /><div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Create folder'} loading={save.isPending} /></div></form>}</div></Page>;
}
