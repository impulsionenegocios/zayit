<template>
  <div class="relative w-full">
    <!-- Ícone à esquerda -->
    <div
      v-if="$slots.icon"
      class="absolute text-white inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <slot name="icon" />
    </div>

    <!-- Input principal -->
    <input
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="['input-base', $slots.icon ? 'pl-10' : '', loading ? 'pr-10' : '']"
      v-model="inputValue"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    />

    <!-- Spinner de loading -->
    <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <div
        class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  name?: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'date'
    | 'datetime-local'
    | 'number'
    | 'search'
    | 'tel'
    | 'url';
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur'): void;
  (e: 'focus'): void;
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>
