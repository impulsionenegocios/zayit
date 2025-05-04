<!-- src/components/ui/modals/BaseModal.vue -->
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click="!persistent && $emit('close')"
  >
    <div
      class="bg-card rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      :class="[sizeClass]"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b border-white/10">
        <h2 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h2>
        <button
          v-if="!persistent"
          @click="$emit('close')"
          class="text-white/60 hover:text-white transition-colors"
        >
          <Icon icon="mdi:close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 overflow-y-auto">
        <slot></slot>
      </div>

      <!-- Footer (optional) -->
      <div v-if="$slots.footer || showFooter" class="p-4 border-t border-white/10">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  title?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  persistent?: boolean;
  showFooter?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const sizeClass = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  } as const;

  return map[props.size || 'md'];
});
</script>
