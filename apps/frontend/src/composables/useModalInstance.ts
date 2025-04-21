// src/composables/useModalInstance.ts
import { inject } from 'vue';

export function useModalInstance() {
  const modal = inject<{
    resolve: (val: any) => void;
    reject: (reason?: any) => void;
  }>('modal-instance');

  if (!modal) {
    throw new Error('useModalInstance() must be used inside a modal');
  }

  return modal;
}
