import { defineStore } from 'pinia';
import { markRaw } from 'vue'; // ← import necessário
let idCounter = 0;
export const useModalStore = defineStore('modal', {
  state: () => ({
    modals: [],
  }),
  actions: {
    open(options) {
      return new Promise((resolve, reject) => {
        const id = ++idCounter;
        const modal = {
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
    close(id, result) {
      const modal = this.modals.find((m) => m.id === id);
      if (modal) {
        modal.resolve(result);
        this.modals = this.modals.filter((m) => m.id !== id);
      }
    },
    cancel(id) {
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
