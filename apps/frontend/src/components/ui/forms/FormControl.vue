<template>
  <div class="form-control space-y-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="forLabel"
      class="text-sm font-medium flex items-center gap-2 text-white/80"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="showSuccess && valid" class="text-green-400 text-xs">✔</span>
    </label>

    <!-- Campo (input, textarea, select, etc) -->
    <slot />

    <!-- Hint ou Erro -->
    <p v-if="hint && !error" class="text-xs text-white/50">
      <slot name="hint">{{ hint }}</slot>
    </p>

    <transition name="fade">
      <p v-if="error && touched" class="text-xs text-red-500">
        <slot name="error">{{ error }}</slot>
      </p>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string
  forLabel?: string
  hint?: string
  error?: string
  touched?: boolean
  valid?: boolean
  showSuccess?: boolean
}>()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
