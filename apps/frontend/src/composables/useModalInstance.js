// src/composables/useModalInstance.ts
import { inject } from 'vue';
export function useModalInstance() {
  const modal = inject('modal-instance');
  if (!modal) {
    throw new Error('useModalInstance() must be used inside a modal');
  }
  return modal;
}
