<template>
  <div ref="wrapperRef" class="relative">
    <div class="relative">
      <!-- Input -->
      <input
        type="text"
        class="w-full px-4 py-2 bg-surface text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-zayit-blue"
        :placeholder="placeholder"
        v-model="query"
        @focus="isOpen = true"
        @click="isOpen = true"
      />

      <!-- Dropdown -->
      <ul
        v-show="isOpen"
        class="absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <li
          v-for="option in filteredOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-2 cursor-pointer hover:bg-zayit-blue text-white"
        >
          {{ option.label }}
        </li>
        <li v-if="!filteredOptions.length" class="px-4 py-2 text-sm text-white/60">
          Nenhuma opção encontrada
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

type Option = { label: string; value: string | number };

const props = defineProps<{
  modelValue: Option | null;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Option | null): void;
}>();

const query = ref('');
const isOpen = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
  if (!query.value) return props.options;
  return props.options.filter((o) => o.label.toLowerCase().includes(query.value.toLowerCase()));
});

function selectOption(option: Option) {
  emit('update:modelValue', option);
  query.value = option.label;
  isOpen.value = false;
}

watch(
  () => props.modelValue,
  (val) => {
    query.value = val?.label ?? '';
  },
  { immediate: true },
);

function handleClickOutside(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
