'use client';

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

export type ToastVariant = 'success' | 'error';

interface ToastEntry {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant: ToastVariant) => void;
}

const TOAST_TIMEOUT_MS = 4000;

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}

// Structure and ARIA only: the list and each entry carry no styling, so a
// project can position and paint them however it wants.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), TOAST_TIMEOUT_MS);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div data-toast-list>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-toast={toast.variant}
            role={toast.variant === 'success' ? 'status' : 'alert'}
          >
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss">
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
