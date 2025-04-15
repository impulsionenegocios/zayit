<template>
  <button
    :type="props.type ?? 'button'"
    class="btn-action min-h-10"
    :class="[variantClass, loading && 'btn-action-loading']"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <!-- Ícone à esquerda -->
    <span v-if="$slots.icon" class="relative z-10 mr-2">
      <slot name="icon" />
    </span>

    <!-- Título -->
    <span class="relative z-10">
      {{ loading ? '' : title }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'button';
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const variantClass = computed(() => {
  const v = props.variant || 'primary';
  return `btn-action-${v}`;
});
</script>
