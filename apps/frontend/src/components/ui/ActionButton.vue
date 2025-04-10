<template>
  <button
    :type="props.type ?? 'button'"
    class="btn"
    :class="[variantClass, loading && 'btn-loading']"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
  >
    <!-- Ícone à esquerda -->
    <span v-if="$slots.icon" class="relative z-10 mr-2">
      <slot name="icon" />
    </span>

    <!-- Título -->
    <span class="relative z-10">
      {{ loading ? 'Carregando...' : title }}
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
  return `btn-${v}`;
});
</script>
