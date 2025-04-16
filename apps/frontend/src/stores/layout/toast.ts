// src/stores/toast.ts
import { defineStore } from 'pinia';

let idCounter = 0;

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    addToast(toast: Omit<Toast, 'id'>) {
      const id = ++idCounter;
      const newToast: Toast = { id, ...toast };

      this.toasts.push(newToast);

      if (!toast.persistent) {
        setTimeout(() => {
          this.removeToast(id);
        }, toast.duration ?? 3000);
      }

      return id;
    },

    removeToast(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },

    dismissAll() {
      this.toasts = [];
    },

    // 👇 Helpers
    success(message: string, duration = 3000) {
      this.addToast({ type: 'success', message, duration });
    },
    error(message: string, duration = 3000) {
      this.addToast({ type: 'error', message, duration });
    },
    info(message: string, duration = 3000) {
      this.addToast({ type: 'info', message, duration });
    },
    warning(message: string, duration = 3000) {
      this.addToast({ type: 'warning', message, duration });
    },
  },
});

// Alias para import mais limpo
export const useToast = useToastStore;
