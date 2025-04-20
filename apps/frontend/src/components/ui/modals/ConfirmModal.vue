<template>
  <BaseModal :title="' '" :persistent="false" size="sm" @close="cancel">
    <div class="p-4 md:p-5 text-center text-gray-300 bg-card rounded-lg">
      <svg
        class="mx-auto mb-4 w-12 h-12 text-gray-200"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>

      <h3 class="mb-5 text-lg font-normal text-gray-400">
        {{ props.message }}
      </h3>

      <div class="flex justify-center gap-3">
        <button
          @click="confirm"
          type="button"
          class="text-white cursor-pointer bg-zayit-danger hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center transition-all duration-300"
        >
          Sim, Tenho Certeza
        </button>
        <button
          @click="cancel"
          type="button"
          class="py-2.5 px-5 text-sm font-medium cursor-pointer text-white bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-700 transition-all duration-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const props = defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'close', result: boolean): void;
}>();

const cancel = () => emit('close', false);
const confirm = () => emit('close', true);
</script>
