import { Pressable, Text, View } from 'react-native';
import { Copy, Heart } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { GlassCard, IconButton } from './ui';
import { colors } from '../theme';
import { formatDate } from '../lib/format';
import { useToast } from '../providers/ToastProvider';

export function PromptCard({ prompt, onFavorite, showContext = false }) {
  const toast = useToast();
  const copy = async () => { await Clipboard.setStringAsync(prompt.content); await Haptics.selectionAsync(); toast('Prompt copied'); };
  return <GlassCard onPress={() => router.push(`/prompt/${prompt.id}`)} label={`Open ${prompt.title}`}>
    <View className="flex-row items-start gap-3"><View className="min-w-0 flex-1"><Text numberOfLines={1} className="font-semibold text-[17px] text-ink">{prompt.title}</Text>{showContext && <Text className="mt-1 font-medium text-xs text-muted">{prompt.category?.folder?.name} · {prompt.category?.name}</Text>}<Text numberOfLines={3} className="mt-2 font-sans leading-5 text-secondary">{prompt.content}</Text><Text className="mt-3 font-sans text-xs text-muted">Updated {formatDate(prompt.updatedAt)}</Text></View><View className="gap-1"><Pressable accessibilityLabel={prompt.isFavorite ? 'Remove favorite' : 'Add favorite'} hitSlop={8} onPress={(event) => { event.stopPropagation(); onFavorite?.(prompt); }} className="h-10 w-10 items-center justify-center"><Heart size={19} color={colors.ink} fill={prompt.isFavorite ? colors.ink : 'transparent'} /></Pressable><IconButton label="Copy prompt" icon={Copy} onPress={(event) => { event.stopPropagation(); copy(); }} /></View></View>
  </GlassCard>;
}
