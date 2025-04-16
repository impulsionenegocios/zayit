import { defineStore } from 'pinia';
import { markRaw } from 'vue'; // ← import necessário

let idCounter = 0;

export interface ModalOptions {
  id?: number;
  title?: string;
  component?: any;
  props?: Record<string, any>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  persistent?: boolean;
  showFooter?: boolean;
}

export interface Modal extends Required<ModalOptions> {
  resolve: (val: any) => void;
  reject: (reason?: any) => void;
}

export const useModalStore = defineStore('modal', {
  state: () => ({
    modals: [] as Modal[],
  }),

  actions: {
    open(options: ModalOptions) {
      return new Promise((resolve, reject) => {
        const id = ++idCounter;
        const modal: Modal = {
          id,
          title: options.title ?? '',
          component: markRaw(options.component),
          props: options.props ?? {},
          size: options.size ?? 'md',
          persistent: options.persistent ?? false,
          showFooter: options.showFooter ?? true,
          resolve,
          reject,
        };

        this.modals.push(modal);
      });
    },

    close(id: number, result?: any) {
      const modal = this.modals.find((m) => m.id === id);
      if (modal) {
        modal.resolve(result);
        this.modals = this.modals.filter((m) => m.id !== id);
      }
    },

    cancel(id: number) {
      const modal = this.modals.find((m) => m.id === id);
      if (modal) {
        modal.reject('cancelled');
        this.modals = this.modals.filter((m) => m.id !== id);
      }
    },

    dismissAll() {
      this.modals.forEach((m) => m.reject('dismissed'));
      this.modals = [];
    },
  },
});
