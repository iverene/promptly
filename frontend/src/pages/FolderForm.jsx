import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { FolderCard } from '../components/FolderCard';
import { FolderColorSelector } from '../components/FolderColorSelector';
import { Button, ErrorState, Field, Header, Page } from '../components/ui';
import { defaultFolderColor } from '../lib/folderColors';
import { useToast } from '../providers/ToastProvider';

const schema = z.object({ name: z.string().trim().min(1, 'Name is required').max(120), description: z.string().trim().max(500).optional(), color: z.string().regex(/^#[0-9a-fA-F]{6}$/) });

export default function FolderForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [, navigate] = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id), enabled: editing });
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', description: '', color: defaultFolderColor } });
  useEffect(() => { if (folder.data) reset({ name: folder.data.name, description: folder.data.description || '', color: folder.data.color || defaultFolderColor }); }, [folder.data, reset]);
  const values = watch();
  const save = useMutation({ mutationFn: (formValues) => editing ? foldersApi.update(id, formValues) : foldersApi.create(formValues), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['folders'] }); queryClient.invalidateQueries({ queryKey: ['folder', id] }); toast(editing ? 'Folder updated' : 'Folder created'); navigate(`/folders/${saved.id}`); }, onError: (error) => toast(apiMessage(error), 'error') });

  return <Page><Header title={editing ? 'Edit folder' : 'Create folder'} subtitle="Choose a color for your filing cabinet" back={editing ? `/folders/${id}` : '/home'} />
    {folder.isError ? <div className="pt-6"><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></div> : <div className="mt-4 grid gap-5 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
      <section className="mx-auto w-44 sm:w-56 lg:sticky lg:top-8 lg:w-full lg:max-w-xs"><FolderCard preview folder={{ name: values.name, description: values.description, color: values.color, categories: [], updatedAt: new Date().toISOString() }} /></section>
      <form className="glass-strong grid gap-5 rounded-[26px] p-4 sm:p-6" onSubmit={handleSubmit((formValues) => save.mutate(formValues))}>
        <Field label="Folder name" placeholder="e.g. Dress" autoFocus={!editing} error={errors.name?.message} {...register('name')} />
        <Field label="Description (optional)" placeholder="What belongs in this folder?" multiline className="!min-h-24" error={errors.description?.message} {...register('description')} />
        <FolderColorSelector value={values.color} onChange={(color) => setValue('color', color, { shouldValidate: true })} error={errors.color?.message} />
        <div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Create folder'} loading={save.isPending} /></div>
      </form>
    </div>}
  </Page>;
}
