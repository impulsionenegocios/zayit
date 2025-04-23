<!-- src/components/kanban/KanbanBoard.vue -->
<template>
  <div class="flex-1 overflow-x-auto flex gap-4 px-4">
    <KanbanColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @update:cards="cards => onUpdateCards(col.id, cards)"
      @update:name="name  => onUpdateColumnName(col.id, name)"
      @delete="()    => onDeleteColumn(col.id)"
      class="min-w-[200px]"
    />
    <AddColumn @add="onAddColumn" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KanbanColumn from './KanbanColumn.vue'
import AddColumn from './AddColumn.vue'

// use o serviço correto
import {
  fetchColumns,
  createColumn,
  updateColumn,
  deleteColumn as apiDeleteColumn,
} from '@/services/crm'  // antes era crm, mude para kanban

// tipagem de checklist
interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

// cada card
export interface KanbanCard {
  id: string
  title: string
  description?: string
  tags?: string[]
  checklist?: ChecklistItem[]
  created_at?: string
}

// cada coluna contém um array de cards
export interface KanbanColumnData {
  id: string
  name: string
  color: string
  cards: KanbanCard[]    // <<< aqui é array, não string
}

const columns = ref<KanbanColumnData[]>([])

onMounted(async () => {
  try {
    columns.value = await fetchColumns()
  } catch (err) {
    console.error('Erro ao carregar colunas:', err)
  }
})

async function onAddColumn(payload: { name: string; color: string }) {
  try {
    const nova = await createColumn({ name: payload.name, color: payload.color })
    columns.value.push(nova)
  } catch (err) {
    console.error('Erro ao criar coluna:', err)
  }
}

async function onDeleteColumn(id: string) {
  try {
    await apiDeleteColumn(id)
    columns.value = columns.value.filter(c => c.id !== id)
  } catch (err) {
    console.error(`Erro ao deletar coluna ${id}:`, err)
  }
}

async function onUpdateColumnName(id: string, name: string) {
  try {
    await updateColumn(id, { name })
    const col = columns.value.find(c => c.id === id)
    if (col) col.name = name
  } catch (err) {
    console.error(`Erro ao renomear coluna ${id}:`, err)
  }
}

async function onUpdateCards(id: string, cards: KanbanCard[]) {
  try {
    await updateColumn(id, { cards })
    const col = columns.value.find(c => c.id === id)
    if (col) col.cards = cards
  } catch (err) {
    console.error(`Erro ao atualizar cards da coluna ${id}:`, err)
  }
}
</script>

<style scoped>
/* overflow-x-auto no container já trata o scroll */
</style>
