<template>
    <TagsBoard  :initial-tags="minhasEtiquetas"/>
</template>
<script setup lang="ts">
    import TagsBoard from '@/components/ui/kanban/TagsBoard.vue';
    import { ref } from 'vue'

const minhasEtiquetas = ref([
  { id: '1', name: 'Urgente', color: '#F87171' },
  { id: '2', name: 'Planejamento', color: '#60A5FA' },
])
</script>