<!-- src/components/ui/modals/ModalInstanceProvider.vue -->
<script setup lang="ts">
import { provide } from 'vue';

const props = defineProps<{
  resolve: (val: any) => void;
  reject: (reason?: any) => void;
}>();

provide('modal-instance', {
  resolve: props.resolve,
  reject: props.reject,
});
</script>

<template>
  <slot />
</template>
