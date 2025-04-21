<template>
  <main class="flex-1 flex flex-col">
    <div class="relative">
      <KanbanBoard class="absolute" />
    </div>
  </main>
</template>

<script setup lang="ts">
import KanbanBoard from '@/components/ui/kanban/KanbanBoard.vue';
</script>
