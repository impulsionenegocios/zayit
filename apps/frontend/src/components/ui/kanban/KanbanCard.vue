<!-- src/components/kanban/KanbanCard.vue -->
<template>
  <div
    class="transition-all py-2 bg-[#20203a] duration-500 rounded-3xl cursor-pointer hover:bg-zayit-blue/80 text-white px-6 shadow group relative"
  >
    <div class="flex gap-1 absolute right-4 transition text-sm">
      <button @click="$emit('delete', card.id)" title="Deletar">🗑️</button>
    </div>
    <!-- Tags -->
    <div v-if="card.tags?.length" class="flex flex-wrap gap-1">
      <span
        v-for="tag in card.tags"
        :key="tag"
        class="text-xs bg-zinc-600 text-white px-6 py-0.5 rounded"
      >
        {{ tag }}
      </span>
    </div>
    <!-- Titulo -->
    <div class="flex justify-between items-center">
      <div class="font-medium text-md cursor-pointer w-full h-full" @click="openEditModal">
        {{ card.title }}
      </div>
    </div>
    <!-- Checklist preview -->
    <div v-if="card.checklist?.length" class="text-xs text-gray-500 mt-2">
      ✅ {{ card.checklist.filter((c) => c.done).length }} / {{ card.checklist.length }} tarefas
    </div>
    <div>comentarios</div>
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
