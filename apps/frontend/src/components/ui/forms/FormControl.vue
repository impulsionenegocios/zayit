<template>
  <div class="form-control space-y-1">
    <!-- Label -->
    <label v-if="label" :for="forLabel" class="text-sm font-medium text-white/80">
      <slot name="label">{{ props.label }}</slot>
    </label>

    <!-- Slot principal (input, textarea etc) -->
    <slot />

    <!-- Hint ou erro -->
    <p v-if="hint && !error" class="text-xs text-white/50">
      <slot name="hint">{{ props.hint }}</slot>
    </p>
    <p v-if="error" class="text-xs text-red-500">
      <slot name="error">{{ props.error }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  forLabel?: string
  hint?: string
  error?: string
}>()
</script>
