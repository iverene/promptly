import { useEffect } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { foldersApi } from '../../src/api/resources';
import { apiMessage } from '../../src/api/client';
import { Button, ErrorState, Field, Header, Screen } from '../../src/components/ui';
import { useToast } from '../../src/providers/ToastProvider';

const schema = z.object({ name: z.string().trim().min(1, 'Name is required').max(120), description: z.string().trim().max(500).optional() });
export default function FolderForm() {
  const { id } = useLocalSearchParams(); const editing = Boolean(id); const toast = useToast(); const queryClient = useQueryClient();
  const folder = useQuery({ queryKey: ['folder', id], queryFn: () => foldersApi.get(id), enabled: editing });
  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', description: '' } });
  useEffect(() => { if (folder.data) reset({ name: folder.data.name, description: folder.data.description ?? '' }); }, [folder.data, reset]);
  const save = useMutation({ mutationFn: (values) => editing ? foldersApi.update(id, values) : foldersApi.create(values), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['folders'] }); queryClient.invalidateQueries({ queryKey: ['folder', id] }); toast(editing ? 'Folder updated' : 'Folder created'); router.replace(`/folder/${saved.id}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  return <Screen><Header title={editing ? 'Edit folder' : 'Create folder'} subtitle={!editing ? 'Image, Video, and Movements are added automatically.' : undefined} back /><View className="gap-5 px-4 py-6">
    {folder.isError ? <ErrorState message={apiMessage(folder.error)} retry={folder.refetch} /> : <><Controller control={control} name="name" render={({ field: { onChange, onBlur, value, ref } }) => <Field ref={ref} label="Name" placeholder="e.g. Dress" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} autoFocus={!editing} />} /><Controller control={control} name="description" render={({ field: { onChange, onBlur, value, ref } }) => <Field ref={ref} label="Description (optional)" placeholder="What belongs in this folder?" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.description?.message} multiline className="min-h-[120px]" />} /><Button title={editing ? 'Save changes' : 'Create folder'} loading={save.isPending} onPress={handleSubmit((values) => save.mutate(values))} /></>}
  </View></Screen>;
}

