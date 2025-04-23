<template>
  <div
    class="w-72 h-fit bg-gray-200 dark:bg-gray-700 border-dashed border-2 border-gray-400 dark:border-gray-500 rounded-lg flex items-center justify-center p-4 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    @click="handleClick"
  >
    <div v-if="!showInput" class="text-gray-600 dark:text-gray-200 text-sm">+ Adicionar coluna</div>

    <div v-else class="flex flex-col gap-2 w-full" @click.stop>
      <input
        v-model="columnName"
        placeholder="Nome da coluna"
        class="p-2 text-sm border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        ref="inputRef"
        @keydown.enter="add"
        @keydown.esc="cancel"
      />
      <div class="flex gap-2">
        <button class="btn btn-sm btn-primary" @click="add">Adicionar</button>
        <button class="btn btn-sm btn-secondary" @click="cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const emit = defineEmits(['add']);
const showInput = ref(false);
const columnName = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

function handleClick() {
  if (!showInput.value) {
    showInput.value = true;
    nextTick(() => inputRef.value?.focus());
  }
}

function cancel() {
  columnName.value = '';
  showInput.value = false;
}

function add() {
  if (!columnName.value.trim()) return;
  emit('add', {
    id: crypto.randomUUID(),
    name: columnName.value.trim(),
    cards: [],
  });
  cancel();
}
</script>
