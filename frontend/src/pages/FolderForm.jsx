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

  return <Page><Header title={editing ? 'Edit folder' : 'Create folder'} subtitle="Choose a color for your filing cabinet" back />
    {folder.isError ? <div className="pt-8"><ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /></div> : <div className="mt-8 grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
      <section className="lg:sticky lg:top-28"><p className="mb-4 text-[10px] font-medium uppercase tracking-[.2em] text-muted">Live preview</p><FolderCard preview folder={{ name: values.name, description: values.description, color: values.color, categories: [], updatedAt: new Date().toISOString() }} /></section>
      <form className="glass-strong grid gap-7 rounded-[30px] p-5 sm:p-8" onSubmit={handleSubmit((formValues) => save.mutate(formValues))}>
        <Field label="Folder name" placeholder="e.g. Dress" autoFocus={!editing} error={errors.name?.message} {...register('name')} />
        <Field label="Description (optional)" placeholder="What belongs in this folder?" multiline className="min-h-28" error={errors.description?.message} {...register('description')} />
        <fieldset><legend className="mb-3 text-xs font-medium uppercase tracking-[.12em] text-secondary">Folder color</legend><div className="grid grid-cols-4 gap-3 sm:grid-cols-5">{folderColors.map((color) => <button type="button" key={color.value} onClick={() => setValue('color', color.value, { shouldValidate: true })} aria-label={color.name} title={color.name} className="focus-ring relative aspect-square rounded-full border border-black/15 transition duration-200 hover:-translate-y-0.5" style={{ background: color.value }}>{values.color === color.value && <Check className="absolute inset-0 m-auto" size={18} strokeWidth={2} />}</button>)}<label title="Custom color" className="focus-within:ring-2 focus-within:ring-black relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-full border border-dashed border-black/25 bg-white/70"><Plus size={18} /><input type="color" aria-label="Custom folder color" value={values.color} onChange={(event) => setValue('color', event.target.value, { shouldValidate: true })} className="absolute inset-0 cursor-pointer opacity-0" /></label></div>{errors.color && <p className="mt-2 text-xs text-danger">{errors.color.message}</p>}</fieldset>
        <div className="flex justify-end"><Button type="submit" title={editing ? 'Save changes' : 'Create folder'} loading={save.isPending} /></div>
      </form>
    </div>}
  </Page>;
}
