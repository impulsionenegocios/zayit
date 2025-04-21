<!-- src/components/ui/modals/BaseModal.vue -->
<template>
  <div
    :class="[
      'rounded-lg shadow-lg bg-card p-6 w-full custom-scroll relative max-h-[80%] overflow-auto',
      sizeClass,
    ]"
  >
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <h2 v-if="props?.title" class="text-lg font-bold">{{ props?.title }}</h2>
      <button
        v-if="!persistent"
        @click="$emit('close')"
        class="text-gray-500 hover:text-black text-xl absolute z-[90] right-8 top-4"
      >
        ✕
      </button>
    </div>

    <!-- Body -->
    <div class="text-sm text-gray-700">
      <slot />
    </div>

    <!-- Footer -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  persistent?: boolean;
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
