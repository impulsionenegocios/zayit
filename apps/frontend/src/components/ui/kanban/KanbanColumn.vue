<template>
  <div class="w-72 bg-card rounded-lg shadow p-4 flex flex-col gap-4">
    <!-- Header -->
    <div v-if="isEditing">
      <input
        v-model="editedName"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        @blur="saveEdit"
        class="w-full p-1 text-sm border rounded bg-card text-white"
      />
    </div>
    <h2
      v-else
      class="font-semibold text-lg text-white flex justify-between items-center"
    >
      <span @dblclick="startEdit">{{ column.name }}</span>
      <div class="text-sm flex gap-2">
        <button @click="startEdit" title="Editar">✏️</button>
        <button @click="() => emit('delete')">🗑️</button>
      </div>
    </h2>
    <p v-if="!localCards.length" class="text-sm text-gray-400 text-center">Sem cards</p>
    <!-- Cards arrastáveis com transição personalizada -->
    <draggable
      v-model="localCards"
      group="kanban"
      item-key="id"
      @change="updateCards"
      ghost-class="ghost"
      class="flex flex-col gap-2 flex-1 min-h-[120px]"
    >
      <template #item="{ element }">
        <KanbanCard
          :key="element.id"
          :card="element"
          @update="handleCardUpdate"
          @delete="handleCardDelete"
        />
      </template>
    </draggable>
    
    <!-- Estado vazio -->
    <!-- Adicionar novo card -->
    <AddCard @add="handleAddCard" />
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { ref, watch } from 'vue';
import KanbanCard from './KanbanCard.vue';
import AddCard from './AddCard.vue';

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface KanbanCardData {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  checklist?: ChecklistItem[];
}

const props = defineProps<{
  column: {
    id: string;
    name: string;
    cards: KanbanCardData[];
  };
}>();

const emit = defineEmits(['update:cards', 'update:name', 'delete']);

const localCards = ref<KanbanCardData[]>([...props.column.cards]);
const isEditing = ref(false);
const editedName = ref('');

watch(
  () => props.column.cards,
  (newVal) => {
    localCards.value = [...newVal];
  },
);

function updateCards() {
  emit('update:cards', [...localCards.value]);
}

function handleAddCard(card: KanbanCardData) {
  localCards.value.push(card);
  updateCards();
}

function handleCardUpdate(updatedCard: KanbanCardData) {
  const index = localCards.value.findIndex((c) => c.id === updatedCard.id);
  if (index !== -1) {
    localCards.value[index] = updatedCard;
    updateCards();
  }
}

function handleCardDelete(cardId: string) {
  localCards.value = localCards.value.filter((c) => c.id !== cardId);
  updateCards();
}

function startEdit() {
  isEditing.value = true;
  editedName.value = props.column.name;
}

function cancelEdit() {
  isEditing.value = false;
}

function saveEdit() {
  const name = editedName.value.trim();
  if (name && name !== props.column.name) {
    emit('update:name', name);
  }
  isEditing.value = false;
}
</script>