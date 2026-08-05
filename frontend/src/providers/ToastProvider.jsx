import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 2800);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <ToastContext.Provider value={show}>
    {children}
    {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-[fade-in_.2s_ease-out] items-center gap-3 rounded-[18px] border border-white/15 bg-zinc-950/95 px-4 py-3 text-white shadow-2xl backdrop-blur-xl">
      {toast.type === 'error' ? <AlertCircle size={19} /> : <CheckCircle2 size={19} />}
      <span className="min-w-0 flex-1 text-sm font-medium">{toast.message}</span>
      <button onClick={() => setToast(null)} aria-label="Dismiss notification" className="focus-ring rounded-lg p-1 opacity-70 hover:opacity-100"><X size={17} /></button>
    </div>}
  </ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);

