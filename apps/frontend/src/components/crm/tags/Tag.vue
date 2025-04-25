<template>
  <div
    class="inline-flex items-center rounded px-2 py-1 text-xs font-medium transition-colors"
    :class="{
      'cursor-pointer hover:opacity-80': selectable || deletable,
      'opacity-60': disabled,
    }"
    :style="{
      backgroundColor: tag.color,
      color: getContrastColor(tag.color),
    }"
    @click="handleClick"
  >
    {{ tag.name }}

    <!-- Delete button if deletable -->
    <button
      v-if="deletable"
      class="ml-1 text-current hover:text-white"
      @click.stop="handleDelete"
      :disabled="disabled"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Tag } from '@/types';

const props = defineProps<{
  tag: Tag;
  selectable?: boolean;
  deletable?: boolean;
  disabled?: boolean;
  selected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click', tag: Tag): void;
  (e: 'delete', tag: Tag): void;
}>();

// Helper function to get contrasting text color
function getContrastColor(hexColor: string): string {
  if (!hexColor) return '#ffffff';

  const hex = hexColor.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Click handler
function handleClick() {
  if (props.selectable && !props.disabled) {
    emit('click', props.tag);
  }
}

// Delete handler
function handleDelete() {
  if (props.deletable && !props.disabled) {
    emit('delete', props.tag);
  }
}
</script>
