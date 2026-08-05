import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'wouter';
import { z } from 'zod';
import { foldersApi } from '../api/resources';
import { apiMessage } from '../api/client';
import { FolderCard } from '../components/FolderCard';
import { Button, ErrorState, Field, Header, Page } from '../components/ui';
import { defaultFolderColor, folderColors } from '../lib/folderColors';
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
        <fieldset><legend className="mb-2 text-xs font-medium uppercase tracking-[.12em] text-secondary">Folder color</legend><div className="flex flex-wrap gap-2.5">{folderColors.map((color) => <button type="button" key={color.value} onClick={() => setValue('color', color.value, { shouldValidate: true })} aria-label={color.name} title={color.name} className="focus-ring relative size-10 shrink-0 rounded-full border border-black/15 transition duration-200 hover:-translate-y-0.5 sm:size-11" style={{ background: color.value }}>{values.color === color.value && <Check className="absolute inset-0 m-auto" size={16} strokeWidth={2} />}</button>)}<label title="Custom color" className="focus-within:ring-2 focus-within:ring-black relative grid size-10 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-black/25 bg-white/70 sm:size-11"><Plus size={16} /><input type="color" aria-label="Custom folder color" value={values.color} onChange={(event) => setValue('color', event.target.value, { shouldValidate: true })} className="absolute inset-0 cursor-pointer opacity-0" /></label></div>{errors.color && <p className="mt-2 text-xs text-danger">{errors.color.message}</p>}</fieldset>
        <div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Create folder'} loading={save.isPending} /></div>
      </form>
    </div>}
  </Page>;
}
