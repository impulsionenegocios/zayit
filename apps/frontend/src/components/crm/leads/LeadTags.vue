<template>
  <div class="flex flex-wrap gap-2 mt-2">
    <span
      v-for="tag in tags"
      :key="tag.id"
      class="px-2 py-0.5 text-sm rounded-full text-white"
      :style="{ backgroundColor: tag.color }"
    >
      {{ tag.name }}
    </span>
    <span v-if="!tags.length" class="text-white/60">Nenhuma Tag</span>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '@/types';

defineProps<{
  tags: Tag[];
}>();
</script>
