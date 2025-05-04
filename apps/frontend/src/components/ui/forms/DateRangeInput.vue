<template>
  <div class="flex gap-2 items-center">
    <BaseInput
      :modelValue="startDate"
      type="date"
      :placeholder="startPlaceholder || 'Data inicial'"
      :min="minDate"
      :max="endDate"
      @update:modelValue="updateStartDate"
    />
    <span class="text-white">até</span>
    <BaseInput
      :modelValue="endDate"
      type="date"
      :placeholder="endPlaceholder || 'Data final'"
      :min="startDate || minDate"
      :max="maxDate"
      @update:modelValue="updateEndDate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseInput from './BaseInput.vue';

const props = defineProps<{
  modelValue: { start: string; end: string };
  startPlaceholder?: string;
  endPlaceholder?: string;
  minDate?: string;
  maxDate?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: string; end: string }): void;
}>();

const startDate = computed(() => props.modelValue.start);
const endDate = computed(() => props.modelValue.end);

function updateStartDate(value: string) {
  emit('update:modelValue', { start: value, end: endDate.value });
}

function updateEndDate(value: string) {
  emit('update:modelValue', { start: startDate.value, end: value });
}
</script>
