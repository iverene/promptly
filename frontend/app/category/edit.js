import { Alert, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react-native';
import { categoriesApi } from '../../src/api/resources';
import { apiMessage } from '../../src/api/client';
import { Button, ErrorState, Field, Header, Screen } from '../../src/components/ui';
import { useToast } from '../../src/providers/ToastProvider';

const schema = z.object({ name: z.string().trim().min(1, 'Name is required').max(120) });
export default function CategoryForm() {
  const { id, folderId } = useLocalSearchParams(); const editing = Boolean(id); const toast = useToast(); const queryClient = useQueryClient();
  const category = useQuery({ queryKey: ['category', id], queryFn: () => categoriesApi.get(id), enabled: editing });
  const { control, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '' } });
  useEffect(() => { if (category.data) reset({ name: category.data.name }); }, [category.data, reset]);
  const save = useMutation({ mutationFn: (values) => editing ? categoriesApi.update(id, values) : categoriesApi.create({ ...values, folderId }), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['folder'] }); queryClient.invalidateQueries({ queryKey: ['category'] }); toast(editing ? 'Category updated' : 'Category added'); router.replace(`/folder/${saved.folderId}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  const remove = useMutation({ mutationFn: () => categoriesApi.remove(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['folder'] }); toast('Category deleted'); router.replace(`/folder/${category.data.folderId}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  const confirmDelete = () => Alert.alert('Delete category?', 'This permanently deletes every prompt in this category.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => remove.mutate() }]);
  return <Screen><Header title={editing ? 'Edit category' : 'Add category'} back /><View className="gap-5 px-4 py-6">{category.isError ? <ErrorState message={apiMessage(category.error)} retry={category.refetch} /> : <><Controller control={control} name="name" render={({ field: { onChange, onBlur, value, ref } }) => <Field ref={ref} label="Name" placeholder="e.g. Lighting" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} autoFocus={!editing} />} /><Button title={editing ? 'Save changes' : 'Add category'} loading={save.isPending} onPress={handleSubmit((values) => save.mutate(values))} />{editing && <Button title="Delete category" icon={Trash2} variant="danger" loading={remove.isPending} onPress={confirmDelete} />}</>}</View></Screen>;
}

