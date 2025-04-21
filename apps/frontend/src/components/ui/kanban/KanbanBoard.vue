<!-- src/components/kanban/KanbanBoard.vue -->
<template>
  <div class="flex gap-4 overflow-x-auto px-4 py-6">
    <KanbanColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @update:cards="(cards) => updateCards(col.id, cards)"
      @update:name="(name) => updateColumnName(col.id, name)"
      @delete="deleteColumn(col.id)"
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
}

interface KanbanColumnData {
  id: string;
  name: string;
  cards: KanbanCard[];
}

// Estado
const columns = ref<KanbanColumnData[]>([
  {
    id: 'todo',
    name: 'A Fazer',
    cards: [
      { id: '1', title: 'Criar estrutura base' },
      { id: '2', title: 'Estilizar colunas e cards' },
    ],
  },
  {
    id: 'doing',
    name: 'Em Progresso',
    cards: [{ id: '3', title: 'Implementar drag-and-drop' }],
  },
  {
    id: 'done',
    name: 'Concluído',
    cards: [{ id: '4', title: 'Setup inicial' }],
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
