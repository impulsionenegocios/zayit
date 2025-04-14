<!-- src/components/ui/forms/FormGrid.vue -->
<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  cols?: number | Record<string, number>
  gap?: number
}>()

const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']

const colClassFromValue = (prefix: string | null, cols: number) =>
  `${prefix ? prefix + ':' : ''}grid-cols-${cols}`

const computedClasses = computed(() => {
  const cols = props.cols ?? 2

  const colClasses = typeof cols === 'number'
    ? colClassFromValue(null, cols)
    : Object.entries(cols)
        .map(([bp, val]) =>
          colClassFromValue(bp === 'base' ? null : (breakpoints.includes(bp) ? bp : null), val)
        )
        .join(' ')

  const gapClass = props.gap ? `gap-${props.gap}` : 'gap-4'

  return `grid ${colClasses} ${gapClass}`
})
</script>
