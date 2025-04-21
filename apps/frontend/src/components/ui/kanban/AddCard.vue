<template>
  <div class="w-full">
    <!-- "Card visual" para adicionar novo -->
    <div
      v-if="showInput"
      class="bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 rounded p-3 flex flex-col gap-2"
    >
      <BaseInput
        v-model="newTitle"
        type="text"
        placeholder="Título do card"
        @keydown.enter="add"
        @keydown.esc="cancel"
        ref="inputRef"
      />
      <div class="flex gap-2 justify-end">
        <button class="btn btn-sm btn-primary" @click="add">Adicionar</button>
        <button class="btn btn-sm btn-secondary" @click="cancel">Cancelar</button>
      </div>
    </div>

    <!-- Botão de adicionar -->
    <div
      v-else
      class="bg-gray-100 dark:bg-gray-800 text-sm text-zayit-blue hover:underline cursor-pointer rounded p-3 mt-1"
      @click="openInput"
    >
      + Adicionar card
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import BaseInput from '../forms/BaseInput.vue';

const emit = defineEmits(['add']);
const showInput = ref(false);
const newTitle = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

function openInput() {
  showInput.value = true;
  nextTick(() => inputRef.value?.focus());
}

function cancel() {
  newTitle.value = '';
  showInput.value = false;
}

function add() {
  const title = newTitle.value.trim();
  if (!title) return;

  emit('add', {
    id: crypto.randomUUID(),
    title,
  });

  cancel();
}
</script>
