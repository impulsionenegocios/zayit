<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-surface rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
      <h3 class="text-xl font-bold">{{ title }}</h3>
      <p class="text-gray-300">{{ message }}</p>
      <div class="flex justify-end space-x-3 pt-2">
        <DefaultButton variant="default" @click="$emit('cancel')">
          {{ cancelText }}
        </DefaultButton>
        <DefaultButton variant="danger" @click="$emit('confirm')">
          {{ confirmText }}
        </DefaultButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultButton from '@/components/ui/buttons/DefaultButton.vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
});

defineEmits(['confirm', 'cancel']);
</script>
