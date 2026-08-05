import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const sequence = useRef(0);
  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);
  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    const normalizedType = type === 'error' ? 'error' : 'success';
    sequence.current += 1;
    setToast({ id: sequence.current, message: String(message || 'Something went wrong'), type: normalizedType });
    timer.current = setTimeout(() => setToast(null), normalizedType === 'error' ? 5000 : 3200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <ToastContext.Provider value={show}>
    {children}
    {toast && <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+1rem)] z-[70] flex justify-center px-4 sm:justify-end sm:px-6">
      <div key={toast.id} role={toast.type === 'error' ? 'alert' : 'status'} aria-live={toast.type === 'error' ? 'assertive' : 'polite'} aria-atomic="true" className={`toast-enter pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[20px] border px-4 py-3 shadow-[0_16px_45px_rgba(17,17,17,.16)] backdrop-blur-2xl ${toast.type === 'error' ? 'border-red-300 bg-red-50/95 text-danger' : 'border-black/40 bg-white/95 text-ink'}`}>
        <span className={`grid size-8 shrink-0 place-items-center rounded-full ${toast.type === 'error' ? 'bg-red-100' : 'bg-black text-white'}`}>{toast.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}</span>
        <span className="min-w-0 flex-1 text-sm font-medium leading-5">{toast.message}</span>
        <button type="button" onClick={dismiss} aria-label="Dismiss notification" className="focus-ring grid size-8 shrink-0 place-items-center rounded-full opacity-65 transition hover:bg-black/5 hover:opacity-100"><X size={16} /></button>
      </div>
    </div>}
  </ToastContext.Provider>;
}

export const useToast = () => useContext(ToastContext);
