import { useModalStore } from '@/stores/layout/modal';
export function useModal() {
  const store = useModalStore();
  async function open(component, options = {}) {
    return store.open({
      component,
      ...options,
    });
  }
  return {
    open,
    close: store.close,
    cancel: store.cancel,
    dismissAll: store.dismissAll,
  };
}
