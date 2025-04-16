<!-- src/components/ui/modals/ModalContainer.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center" v-if="modals.length">
    <transition-group name="modal-fade" tag="div">
      <div
        v-for="modal in modals"
        :key="modal.id"
        class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="!modal.persistent && cancel(modal.id)"
      >
        <component
          :is="modal.component"
          v-bind="modal.props"
          @close="(result: any) => close(modal.id, result)"
        />
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/layout/modal';

const store = useModalStore();
const { modals } = storeToRefs(store);
const { close, cancel } = store;
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
