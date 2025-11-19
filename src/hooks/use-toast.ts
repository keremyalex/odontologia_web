import { useState, useCallback } from 'react';

interface ToastData {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastState extends ToastData {
  id: string;
  open: boolean;
}

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: ToastData) => {
    const id = (++toastId).toString();
    const newToast: ToastState = {
      id,
      title,
      description,
      variant,
      open: true,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);

    return {
      id,
      dismiss: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
    };
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    } else {
      setToasts([]);
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
};