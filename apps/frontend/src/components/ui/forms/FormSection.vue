<template>
    <section class="form-section space-y-4 mb-8">
      <div v-if="title || description" class="space-y-1 mb-4">
        <h2 v-if="title" class="text-xl font-semibold text-white">{{ props.title }}</h2>
        <p v-if="description" class="text-sm text-white/60">{{ props.description }}</p>
      </div>
  
      <!-- Slot com os campos -->
      <div>
        <slot />
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    title?: string
    description?: string
  }>()
  </script>
  