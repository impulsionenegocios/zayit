<template>
  <button
    :class="[
      'inline-flex items-center rounded-lg font-medium transition-all duration-500 cursor-pointer',
      sizeClass,
      variantClass,
    ]"
    :disabled="disabled"
    :type="type"
    @click="$emit('click')"
  >
    <Icon v-if="icon" :icon="icon" class="mr-1" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  variant?: 'primary' | 'warning' | 'danger' | 'info' | 'success' | 'default';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>();

// Default type to 'button' to prevent form submission
const type = props.type || 'button';

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-zayit-blue text-white hover:bg-zayit-blue/80';
    case 'warning':
      return 'bg-zayit-warning text-white hover:bg-zayit-warning/10';
    case 'danger':
      return 'bg-zayit-danger text-white hover:bg-zayit-danger/80';
    case 'info':
      return 'bg-zayit-info text-white hover:bg-zayit-info/80';
    case 'success':
      return 'bg-zayit-success text-white hover:bg-zayit-success/80';
    case 'default':
      return 'bg-zayit-default text-white hover:bg-zayit-default/80';
    default:
      return '';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm px-3 py-1.5';
    case 'md':
      return 'text-base px-4 py-2';
    case 'lg':
      return 'text-lg px-5 py-3';
    default:
      return '';
  }
});
</script>
