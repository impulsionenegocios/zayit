<template>
  <div class="relative w-full">
    <div
      @click="toggleDropdown"
      class="w-full rounded-lg px-4 py-2 bg-surface border cursor-pointer flex items-center justify-between"
      :class="[
        error ? 'border-red-500' : 'border-gray-600',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    >
      <span class="text-white">
        {{ selectedLabel || placeholder }}
      </span>
      <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <ul
      v-show="isOpen"
      class="absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <li
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        class="px-4 py-2 cursor-pointer hover:bg-zayit-blue text-white"
      >
        {{ option.label }}
      </li>
      <li v-if="!options.length" class="px-4 py-2 text-sm text-white/60">
        Nenhuma opção encontrada
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

type SelectOption = {
  label: string;
  value: string | number;
};

const props = defineProps<{
  modelValue: string | number | null;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const isOpen = ref(false);

function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function selectOption(option: SelectOption) {
  emit('update:modelValue', option.value);
  isOpen.value = false;
}

const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue);
  return found?.label ?? '';
});
</script>
