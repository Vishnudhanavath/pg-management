import { create } from 'zustand';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (title: string, description?: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (title, description, type = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, title, description, type }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast(title, description, 'success', duration),
  warning: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast(title, description, 'warning', duration),
  error: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast(title, description, 'error', duration),
  info: (title: string, description?: string, duration?: number) =>
    useToastStore.getState().addToast(title, description, 'info', duration),
};
