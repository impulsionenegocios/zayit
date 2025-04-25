// src/stores/toast.ts
import { defineStore } from 'pinia';
let idCounter = 0;
export const useToastStore = defineStore('toast', {
    state: () => ({
        toasts: [],
    }),
    actions: {
        addToast(toast) {
            const id = ++idCounter;
            const newToast = { id, ...toast };
            this.toasts.push(newToast);
            if (!toast.persistent) {
                setTimeout(() => {
                    this.removeToast(id);
                }, toast.duration ?? 3000);
            }
            return id;
        },
        removeToast(id) {
            this.toasts = this.toasts.filter((t) => t.id !== id);
        },
        dismissAll() {
            this.toasts = [];
        },
        // 👇 Helpers
        success(message, duration = 3000) {
            this.addToast({ type: 'success', message, duration });
        },
        error(message, duration = 3000) {
            this.addToast({ type: 'error', message, duration });
        },
        info(message, duration = 3000) {
            this.addToast({ type: 'info', message, duration });
        },
        warning(message, duration = 3000) {
            this.addToast({ type: 'warning', message, duration });
        },
    },
});
// Alias para import mais limpo
export const useToast = useToastStore;
