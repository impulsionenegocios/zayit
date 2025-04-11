<template>
    <select
      :id="id"
      :value="modelValue"
      @change="onChange"
      :disabled="disabled"
      :class="[
        'w-full rounded-lg px-4 py-2 bg-gray-700 border',
        error ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500',
        'text-white placeholder-gray-400',
        'focus:outline-none focus:ring-1 focus:ring-blue-500',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    >
      <option disabled value="">{{ placeholder }}</option>
  
      <!-- Slot customizado tem prioridade -->
      <slot v-if="$slots.default" />
  
      <!-- Se não tiver slot, renderiza opções automaticamente -->
      <template v-else>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </template>
    </select>
  </template>
  
  <script setup lang="ts">
  type SelectOption = {
    label: string
    value: string | number
  }
  
  const props = defineProps<{
    modelValue: string | number | null
    options?: SelectOption[]
    placeholder?: string
    disabled?: boolean
    error?: string
    id?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
  }>()
  
  function onChange(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
  }
  </script>
  