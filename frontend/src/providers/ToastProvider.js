import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef();
  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setToast({ message, type });
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    timer.current = setTimeout(() => Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setToast(null)), 2200);
  }, [opacity]);
  return <ToastContext.Provider value={show}>
    {children}
    {toast && <Animated.View accessibilityLiveRegion="polite" style={{ opacity }} className="absolute bottom-10 left-5 right-5 z-50 flex-row items-center gap-3 rounded-[18px] border border-white/20 bg-zinc-900/95 px-4 py-3">
      {toast.type === 'error' ? <AlertCircle color="#fff" size={19} /> : <CheckCircle2 color="#fff" size={19} />}
      <Text className="flex-1 font-medium text-sm text-white">{toast.message}</Text>
    </Animated.View>}
  </ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);

