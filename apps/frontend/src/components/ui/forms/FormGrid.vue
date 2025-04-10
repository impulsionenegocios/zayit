<template>
    <div :class="computedClasses">
      <slot />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps<{
    cols?: number
    gap?: number | string
    responsive?: boolean
  }>()
  
  const computedClasses = computed(() => {
    const colClass = props.responsive
      ? `grid-cols-1 md:grid-cols-${props.cols ?? 2}`
      : `grid-cols-${props.cols ?? 2}`
    return `grid ${colClass} gap-${props.gap ?? 4}`
  })
  </script>
  