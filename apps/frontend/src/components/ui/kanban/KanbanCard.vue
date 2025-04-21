<!-- src/components/kanban/KanbanCard.vue -->
<template>
  <div
    class="transition-all duration-500 cursor-pointer bg-zayit-blue hover:bg-zayit-blue/80 border hover:border-gray-900 border-gray-400 text-white p-3 rounded shadow group relative"
  >
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center" >
      <div class="font-medium text-sm cursor-pointer w-full h-full" @click="openEditModal">
        {{ card.title }}
      </div>
      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition text-sm">
        <button @click="toggleExpand" title="Detalhes">🔽</button>
        <button @click="$emit('delete', card.id)" title="Deletar">🗑️</button>
      </div>
    </div>
    <!-- Tags -->
    <div v-if="card.tags?.length" class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="tag in card.tags"
        :key="tag"
        class="text-xs bg-zinc-600 text-white px-2 py-0.5 rounded"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Checklist preview -->
    <div v-if="card.checklist?.length" class="text-xs text-gray-500 mt-2">
      ✅ {{ card.checklist.filter((c) => c.done).length }} / {{ card.checklist.length }} tarefas
    </div>

    <!-- Expansão -->
    <div v-if="isExpanded" class="mt-2 text-sm flex flex-col gap-2">
      <div>
        <label class="block font-semibold mb-1">Descrição:</label>
        <textarea
          v-model="localCard.description"
          class="w-full p-2 border rounded bg-gray-900 text-white text-sm"
        />
      </div>

      <div>
        <label class="block font-semibold mb-1">Checklist:</label>
        <ul class="flex flex-col gap-1">
          <li v-for="item in localCard.checklist" :key="item.id" class="flex items-center gap-2">
            <input type="checkbox" v-model="item.done" />
            <input
              v-model="item.text"
              class="w-full bg-transparent border-b border-gray-600 text-sm"
            />
          </li>
        </ul>
        <button class="text-xs text-zayit-blue hover:underline mt-2" @click="addChecklistItem">
          + Adicionar item
        </button>
      </div>

      <button class="btn btn-sm mt-2 self-end" @click="saveExpandedCard">Salvar alterações</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useModal } from '@/composables/useModal';
import EditCardModal from './EditCardModal.vue';

const props = defineProps<{
  card: {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
    checklist?: { id: string; text: string; done: boolean }[];
  };
}>();

const emit = defineEmits(['update', 'delete']);

const modal = useModal();

async function openEditModal() {
  try {
    const updated = await modal.open(EditCardModal, {
      props: { card: props.card },
      title: 'Editar Card',
      size: 'md',
    });
    emit('update', updated);
  } catch {
    // cancelado
  }
}

const isExpanded = ref(false);
const localCard = ref({ ...props.card });

watch(
  () => props.card,
  (newVal) => {
    localCard.value = { ...newVal };
  },
);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function addChecklistItem() {
  localCard.value.checklist = localCard.value.checklist || [];
  localCard.value.checklist.push({
    id: crypto.randomUUID(),
    text: '',
    done: false,
  });
}

function saveExpandedCard() {
  emit('update', { ...localCard.value });
}
</script>
