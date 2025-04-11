<!-- src/components/ui/forms/FormGrid.vue -->
<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
  responsive?: boolean
}>()

const colMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

const gapMap = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

const computedClasses = computed(() => {
  const colClass = colMap[props.cols ?? 2] ?? 'grid-cols-2'
  const gapClass = gapMap[props.gap ?? 4] ?? 'gap-4'

  const finalCol = props.responsive !== false
    ? `grid-cols-1 sm:${colClass}`
    : colClass

  return `grid ${finalCol} ${gapClass}`
})
</script>
