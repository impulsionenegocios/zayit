<template>
  <label
    :for="id"
    class="flex items-center space-x-2 cursor-pointer select-none"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <input
      type="checkbox"
      :id="id"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
      class="peer hidden"
    />

    <div
      class="w-5 h-5 flex items-center justify-center border rounded bg-surface transition-all duration-150"
      :class="[
        error ? 'border-red-500' : 'border-gray-600',
        checked ? 'bg-zayit-blue border-zayit-blue' : '',
        disabled ? 'pointer-events-none' : '',
      ]"
    >
      <svg
        v-if="checked"
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.414a1 1 0 011.414-1.414L8 11.293l6.293-6.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <span class="text-sm text-white" v-if="label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean | (string | number)[]
  value?: string | number
  label?: string
  disabled?: boolean
  error?: string
  id?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | (string | number)[]): void
}>()

// Se o modelValue for um array (modo grupo) ou um booleano
const isArrayMode = computed(() => Array.isArray(props.modelValue))

const checked = computed(() => {
  if (isArrayMode.value) {
    // Em modo array, verifica se o valor (passado via prop "value") está incluído no array
    return props.value !== undefined && (props.modelValue as (string | number)[]).includes(props.value)
  }
  return props.modelValue as boolean
})

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const newValue = target.checked

  if (isArrayMode.value) {
    const currentArray = props.modelValue as (string | number)[]
    if (newValue) {
      // Adiciona o valor se ele não estiver presente
      if (props.value !== undefined && !currentArray.includes(props.value)) {
        emit('update:modelValue', [...currentArray, props.value])
      }
    } else {
      // Remove o valor se estiver presente
      if (props.value !== undefined && currentArray.includes(props.value)) {
        emit('update:modelValue', currentArray.filter((v) => v !== props.value))
      }
    }
  } else {
    emit('update:modelValue', newValue)
  }
}
</script>
