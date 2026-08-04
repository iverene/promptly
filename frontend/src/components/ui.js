import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, shadows } from '../theme';

export function Screen({ children, scroll = true, className = '', contentClassName = '' }) {
  const insets = useSafeAreaInsets();
  const Container = scroll ? ScrollView : View;
  return <View className={`flex-1 bg-canvas ${className}`}>
    <View pointerEvents="none" className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-zinc-200/60" />
    <Container keyboardShouldPersistTaps="handled" contentContainerStyle={scroll ? { flexGrow: 1, paddingBottom: Math.max(32, insets.bottom + 20) } : undefined} className={contentClassName}>
      {children}
    </Container>
  </View>;
}

export function Header({ title, subtitle, back = false, right }) {
  const insets = useSafeAreaInsets();
  return <BlurView intensity={55} tint="light" style={{ paddingTop: insets.top + 8 }} className="z-20 border-b border-black/5 bg-white/60 px-4 pb-4">
    <View className="flex-row items-center gap-3">
      {back && <IconButton label="Go back" onPress={() => router.back()} icon={ArrowLeft} />}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-semibold text-[26px] tracking-[-0.6px] text-ink">{title}</Text>
        {subtitle ? <Text numberOfLines={1} className="mt-0.5 font-sans text-sm text-secondary">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  </BlurView>;
}

export function GlassCard({ children, className = '', onPress, label }) {
  const content = <View style={shadows} className={`overflow-hidden rounded-[22px] border border-white/80 bg-white/75 p-4 ${className}`}>{children}</View>;
  return onPress ? <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} className="active:translate-y-px active:opacity-75">{content}</Pressable> : content;
}

export function IconButton({ icon: Icon, onPress, label, danger = false }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={8} onPress={onPress} className="h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white/70 active:opacity-60">
    <Icon size={20} color={danger ? colors.danger : colors.ink} strokeWidth={2} />
  </Pressable>;
}

export function Button({ title, onPress, icon: Icon, variant = 'primary', loading = false, disabled = false, className = '' }) {
  const primary = variant === 'primary';
  return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress} className={`min-h-12 flex-row items-center justify-center gap-2 rounded-2xl border px-5 active:opacity-70 ${primary ? 'border-black bg-black' : variant === 'danger' ? 'border-red-100 bg-white/70' : 'border-black/10 bg-white/70'} ${className}`}>
    {loading ? <ActivityIndicator color={primary ? '#fff' : colors.ink} /> : <>{Icon && <Icon size={19} color={primary ? '#fff' : variant === 'danger' ? colors.danger : colors.ink} />}<Text className={`font-semibold text-base ${primary ? 'text-white' : variant === 'danger' ? 'text-red-700' : 'text-ink'}`}>{title}</Text></>}
  </Pressable>;
}

export const Field = forwardRef(function Field({ label, error, multiline = false, className = '', ...props }, ref) {
  return <View className="gap-2">
    <Text className="font-medium text-sm text-ink">{label}</Text>
    <TextInput ref={ref} multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} placeholderTextColor={colors.muted} className={`rounded-2xl border bg-white/85 px-4 font-sans text-base text-ink ${multiline ? 'min-h-[220px] py-4 leading-6' : 'h-12'} ${error ? 'border-red-500' : 'border-black/10'} ${className}`} {...props} />
    {error ? <Text className="font-sans text-xs text-red-700">{error}</Text> : null}
  </View>;
});

export function SearchField({ value, onChangeText, placeholder = 'Search' }) {
  return <View className="h-12 flex-row items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4">
    <Search color={colors.secondary} size={19} />
    <TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} className="flex-1 font-sans text-base text-ink" />
  </View>;
}

export function SectionTitle({ children, action }) {
  return <View className="mb-3 mt-6 flex-row items-center justify-between"><Text className="font-semibold text-xl tracking-[-0.3px] text-ink">{children}</Text>{action}</View>;
}

export function EmptyState({ title, text, action, actionTitle }) {
  return <View className="items-center px-7 py-12"><View className="mb-4 h-14 w-14 items-center justify-center rounded-2xl bg-white/80"><Sparkles size={23} color={colors.ink} /></View><Text className="font-semibold text-lg text-ink">{title}</Text><Text className="mb-5 mt-2 text-center font-sans leading-5 text-secondary">{text}</Text>{action && <Button title={actionTitle} onPress={action} />}</View>;
}

export function LoadingCards({ count = 3 }) {
  return <View className="gap-3">{Array.from({ length: count }).map((_, index) => <View key={index} className="h-28 animate-pulse rounded-[22px] border border-white bg-zinc-200/70" />)}</View>;
}

export function ErrorState({ message, retry }) {
  return <View className="items-center px-6 py-12"><Text className="font-semibold text-base text-ink">Unable to load</Text><Text className="mb-4 mt-2 text-center text-secondary">{message}</Text><Button title="Try again" variant="secondary" onPress={retry} /></View>;
}
