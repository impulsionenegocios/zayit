<template>
    <button
      v-if="props.title"
      type="button"
      class="px-8 py-3 min-w-36 rounded-3xl bg-gradient-to-t from-[#bd8aff] from-20% to-blue-500"
      @click="emit('click', $event)"
    >
      {{ props.title }}
    </button>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    title?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
  }>()
  </script>
  