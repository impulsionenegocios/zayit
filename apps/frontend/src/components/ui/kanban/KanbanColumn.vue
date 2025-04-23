<!-- src/components/kanban/KanbanBoard.vue -->
<template>
  <div class="flex gap-4 overflow-x-auto p-4">
    <KanbanColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      @delete="onDeleteColumn"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import { fetchColumns, deleteColumn as apiDeleteColumn } from '@/services/crm'

interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

interface Card {
  id: string
  title: string
  description?: string
  tags?: string[]
  checklist?: ChecklistItem[]
}

interface Column {
  id: string
  name: string
  color: string
  cards: Card[]
}

const columns = ref<Column[]>([])

onMounted(async () => {
  try {
    columns.value = await fetchColumns()
  } catch (err) {
    console.error('Erro ao carregar colunas:', err)
  }
})

/**
 * Handler disparado quando o KanbanColumn emite 'delete'
 */
async function onDeleteColumn(columnId: string) {
  try {
    await apiDeleteColumn(columnId)
    columns.value = columns.value.filter(c => c.id !== columnId)
  } catch (err) {
    console.error(`Erro ao deletar coluna ${columnId}:`, err)
  }
}
</script>

<style scoped>
/* A classe overflow-x-auto no container já cuida do scroll horizontal */
</style>
