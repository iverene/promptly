import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi, promptsApi } from '../../src/api/resources';
import { apiMessage } from '../../src/api/client';
import { Button, ErrorState, Field, Header, Screen } from '../../src/components/ui';
import { useToast } from '../../src/providers/ToastProvider';

const schema = z.object({ categoryId: z.string().min(1, 'Choose a category'), title: z.string().trim().min(1, 'Title is required').max(180), content: z.string().trim().min(1, 'Prompt is required').max(30000), notes: z.string().trim().max(10000).optional() });
export default function PromptForm() {
  const params = useLocalSearchParams(); const id = params.id; const initialCategoryId = params.categoryId; const editing = Boolean(id); const toast = useToast(); const queryClient = useQueryClient();
  const prompt = useQuery({ queryKey: ['prompt', id], queryFn: () => promptsApi.get(id), enabled: editing });
  const sourceCategoryId = prompt.data?.categoryId ?? initialCategoryId;
  const sourceCategory = useQuery({ queryKey: ['category', sourceCategoryId], queryFn: () => categoriesApi.get(sourceCategoryId), enabled: Boolean(sourceCategoryId) });
  const folderId = prompt.data?.category?.folder?.id ?? sourceCategory.data?.folder?.id;
  const categories = useQuery({ queryKey: ['categories', folderId], queryFn: () => categoriesApi.list(folderId), enabled: Boolean(folderId) });
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { categoryId: initialCategoryId ?? '', title: '', content: '', notes: '' } });
  useEffect(() => { if (prompt.data) reset({ categoryId: prompt.data.categoryId, title: prompt.data.title, content: prompt.data.content, notes: prompt.data.notes ?? '' }); }, [prompt.data, reset]);
  const selected = watch('categoryId');
  const save = useMutation({ mutationFn: (values) => editing ? promptsApi.update(id, values) : promptsApi.create(values), onSuccess: (saved) => { queryClient.invalidateQueries({ queryKey: ['prompts'] }); queryClient.invalidateQueries({ queryKey: ['folder'] }); toast(editing ? 'Prompt updated' : 'Prompt saved'); router.replace(`/prompt/${saved.id}`); }, onError: (e) => toast(apiMessage(e), 'error') });
  if (prompt.isError) return <Screen><Header title="Edit prompt" back /><ErrorState message={apiMessage(prompt.error)} retry={prompt.refetch} /></Screen>;
  return <Screen><Header title={editing ? 'Edit prompt' : 'Create prompt'} back /><View className="gap-5 px-4 py-6">
    <View className="gap-2"><Text className="font-medium text-sm text-ink">Category</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{categories.data?.map((item) => <Pressable key={item.id} onPress={() => setValue('categoryId', item.id, { shouldValidate: true })} className={`min-h-11 justify-center rounded-2xl border px-4 ${selected === item.id ? 'border-black bg-black' : 'border-black/10 bg-white/70'}`}><Text className={`font-medium text-sm ${selected === item.id ? 'text-white' : 'text-ink'}`}>{item.name}</Text></Pressable>)}</ScrollView>{errors.categoryId && <Text className="text-xs text-red-700">{errors.categoryId.message}</Text>}</View>
    <Controller control={control} name="title" render={({ field: { onChange, onBlur, value, ref } }) => <Field ref={ref} label="Title" placeholder="Give this prompt a clear name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.title?.message} />} />
    <Controller control={control} name="content" render={({ field: { onChange, onBlur, value, ref } }) => <Field ref={ref} label="Prompt" placeholder="Write or paste your prompt…" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.content?.message} multiline />} />
    <Controller control={control} name="notes" render={({ field: { onChange, onBlur, value, ref } }) => <Field ref={ref} label="Notes (optional)" placeholder="Usage tips, settings, or reminders" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.notes?.message} multiline className="min-h-[120px]" />} />
    <Button title={editing ? 'Save changes' : 'Save prompt'} loading={save.isPending} onPress={handleSubmit((values) => save.mutate(values))} />
  </View></Screen>;
}

