<template>
  <div class="w-72 rounded-lg shadow flex flex-col gap-4">
    <!-- Header -->
    <div v-if="isEditing">
      <BaseInput
        v-model="editedName"
        @keydown.enter="saveEdit"
        @keydown.esc="cancelEdit"
        @blur="saveEdit"
      />
    </div>
    <h2 v-else class="font-semibold text-lg text-white flex justify-between items-center">
      <div class="flex gap-2">
        <span :class="`bg-${column.color} px-4 rounded`" @dblclick="startEdit">
          {{ column.name }}
        </span>
      </div>
      <div class="text-sm flex gap-2">
        <button @click="startEdit" title="Editar">✏️</button>
        <button @click="() => emit('delete')">🗑️</button>
      </div>
    </h2>

    <hr class="text-gray-600" />

    <!-- Cards + Adicionar -->
    <div class="bg-black rounded-3xl relative pb-4">
      <p v-if="!localCards.length" class="text-sm text-gray-400 text-center py-2">Sem cards</p>

      <draggable
        v-model="localCards"
        group="kanban"
        item-key="id"
        ghost-class="ghost"
        @change="updateCards"
        class="flex flex-col gap-2 flex-1 min-h-[220px] p-2 mb-8"
      >
        <template #item="{ element }">
          <div>
            <!-- Normal card -->
            <KanbanCard
              v-if="!element.__temp"
              :key="element.id"
              :card="element"
              @update="handleCardUpdate"
              @delete="handleCardDelete"
            />

            <!-- Card com input -->
            <div
              v-else
              class="transition-all mb-8 py-2 bg-[#20203a] duration-500 rounded-3xl cursor-pointer hover:bg-zayit-blue/80 text-white px-6 shadow group relative"
            >
              <input
                v-model="element.title"
                type="text"
                class="bg-transparent border-none focus:ring-none"
                style="--tw-ring-color: none"
                placeholder="Digite um nome aqui..."
                @keydown.enter="confirmAddCard"
                @keydown.esc="cancelAddCard"
                ref="inputRef"
              />
            </div>
          </div>
        </template>
      </draggable>

      <!-- Botão de adicionar -->
      <div class="absolute bottom-0 w-full">
        <div v-if="isAddingCard" class="flex justify-end bg-black rounded-b-3xl">
          <button
            class="w-full bg-zayit-blue py-2 rounded-bl-3xl cursor-pointer hover:bg-zayit-blue/80 transition-all duration-500"
            @click="confirmAddCard"
          >
            Adicionar
          </button>
          <button
            class="w-full bg-gray-800 py-2 rounded-br-3xl cursor-pointer hover:bg-gray-800/80 transition-all duration-500"
            @click="cancelAddCard"
          >
            Cancelar
          </button>
        </div>
        <button
          v-else
          class="h-12 w-full rounded-b-3xl cursor-pointer bg-black hover:bg-card transition"
          @click="handleAddCardRequest"
        >
          + Adicionar novo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import draggable from 'vuedraggable';
import KanbanCard from './KanbanCard.vue';
import BaseInput from '../forms/BaseInput.vue';

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
  __temp?: boolean;
}

const props = defineProps<{
  column: {
    id: string;
    color: string;
    name: string;
    cards: KanbanCardData[];
  };
}>();

const emit = defineEmits(['update:cards', 'update:name', 'delete']);

const localCards = ref<KanbanCardData[]>([...props.column.cards]);
const isEditing = ref(false);
const editedName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const isAddingCard = ref(false);
const tempCard = ref<KanbanCardData | null>(null);

watch(
  () => props.column.cards,
  (newVal) => {
    localCards.value = [...newVal];
  },
);

function updateCards() {
  emit('update:cards', [...localCards.value]);
}

function handleAddCardRequest() {
  if (isAddingCard.value) return;
  isAddingCard.value = true;
  tempCard.value = {
    id: crypto.randomUUID(),
    title: '',
    checklist: [],
    tags: [],
    __temp: true,
  };
  localCards.value.push(tempCard.value);
  nextTick(() => inputRef.value?.focus());
}

function confirmAddCard() {
  const title = tempCard.value?.title.trim();
  if (title) {
    localCards.value = localCards.value.filter((c) => c !== tempCard.value);
    emit('update:cards', [
      ...localCards.value,
      {
        id: crypto.randomUUID(),
        title,
        checklist: [],
        tags: [],
      },
    ]);
  }
  resetAddCard();
}

function cancelAddCard() {
  localCards.value = localCards.value.filter((c) => c !== tempCard.value);
  resetAddCard();
}

function resetAddCard() {
  isAddingCard.value = false;
  tempCard.value = null;
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
