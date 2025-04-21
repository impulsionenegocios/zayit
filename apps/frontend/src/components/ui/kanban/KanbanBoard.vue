<!-- src/components/kanban/KanbanBoard.vue -->
<template>
  <div class="flex-1 overflow-x-auto flex gap-4 px-4">
    <KanbanColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @update:cards="(cards) => updateCards(col.id, cards)"
      @update:name="(name) => updateColumnName(col.id, name)"
      @delete="deleteColumn(col.id)"
      class="min-w-[200px]"
    />

    <AddColumn @add="addColumn" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import KanbanColumn from './KanbanColumn.vue';
import AddColumn from './AddColumn.vue';

// Tipos
interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  checklist?: ChecklistItem[];
  created_at: string;
}

interface KanbanColumnData {
  id: string;
  name: string;
  color: string;
  cards: KanbanCard[];
}

// Estado
const columns = ref<KanbanColumnData[]>([
  {
    id: 'todo',
    name: 'A Fazer',
    color: 'zayit-warning',
    cards: [
      { id: '1', title: 'Criar estrutura base', created_at: '21/04/2025' },
      { id: '2', title: 'Estilizar colunas e cards', created_at: '21/04/2025' },
    ],
  },
  {
    id: 'doing',
    name: 'Em Progresso',
    color: 'zayit-info',
    cards: [{ id: '3', title: 'Implementar', created_at: '21/04/2025' }],
  },
  {
    id: 'done',
    name: 'Concluído',
    color: 'zayit-success',
    cards: [{ id: '4', title: 'Setup inicial', created_at: '21/04/2025' }],
  },
]);

// Manipuladores
function addColumn(col: KanbanColumnData) {
  columns.value.push(col);
}

function deleteColumn(colId: string) {
  columns.value = columns.value.filter((c) => c.id !== colId);
}

function updateColumnName(colId: string, newName: string) {
  const col = columns.value.find((c) => c.id === colId);
  if (col) col.name = newName;
}

function updateCards(columnId: string, newCards: KanbanCard[]) {
  const col = columns.value.find((c) => c.id === columnId);
  if (col) col.cards = newCards;
}
</script>
