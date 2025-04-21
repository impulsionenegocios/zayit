<!-- src/components/kanban/AddCard.vue -->
<template>
  <div class="flex flex-col gap-2">
    <div v-if="showInput">
      <BaseInput
        v-model="newTitle"
        type="text"
        placeholder="Título do card"
        @keydown.enter="add"
        @keydown.esc="cancel"
        ref="inputRef"
      />
      <div class="flex gap-2 mt-2 justify-between">
        <button class="bg-zayit-blue px-4 rounded-lg py-2 w-full cursor-pointer" @click="add">Adicionar</button>
        <button class="bg-gray-800 px-4 py-2 rounded-lg cursor-pointer" @click="cancel">Cancelar</button>
      </div>
    </div>

    <button v-else class="text-sm text-zayit-blue hover:underline" @click="openInput">
      + Adicionar card
    </button>
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
  if (!newTitle.value.trim()) return;

  emit('add', {
    id: crypto.randomUUID(),
    title: newTitle.value.trim(),
  });

  newTitle.value = '';
  showInput.value = false;
}
</script>
