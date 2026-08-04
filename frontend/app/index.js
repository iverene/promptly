import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function Splash() {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }).start();
    const timer = setTimeout(() => router.replace('/home'), 850);
    return () => clearTimeout(timer);
  }, [opacity]);
  return <View className="flex-1 items-center justify-center bg-canvas"><Animated.View style={{ opacity }} className="items-center"><View className="mb-5 h-14 w-14 items-center justify-center rounded-[20px] bg-black"><Text className="font-semibold text-2xl text-white">P</Text></View><Text className="font-semibold text-[36px] tracking-[-1.5px] text-ink">Promptly</Text><Text className="mt-2 font-sans text-sm text-muted">Your fashion prompt library</Text></Animated.View></View>;
}

