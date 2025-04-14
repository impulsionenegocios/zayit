<template>
    <label
      :for="id"
      class="flex items-center space-x-3 cursor-pointer select-none"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
      <!-- Hidden input para acessibilidade -->
      <input
        type="checkbox"
        :id="id"
        :checked="modelValue"
        :disabled="disabled"
        @change="onChange"
        class="sr-only"
      />
  
      <!-- Switch visual -->
      <div
        class="w-10 h-6 rounded-full relative transition-colors duration-200 ease-in-out"
        :class="[
          modelValue ? 'bg-zayit-blue' : 'bg-gray-600',
          error ? 'border border-red-500' : '',
        ]"
      >
        <span
          class="absolute left-0 top-0.5 h-5 w-5 bg-white rounded-full shadow-md transform transition-transform duration-200"
          :class="modelValue ? 'translate-x-4' : 'translate-x-0.5'"
        />
      </div>
  
      <span class="text-sm text-white" v-if="label">{{ label }}</span>
    </label>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean
    label?: string
    disabled?: boolean
    error?: string
    id?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
  }>()
  
  function onChange(event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.checked)
  }
  </script>
  