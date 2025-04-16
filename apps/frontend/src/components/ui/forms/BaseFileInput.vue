<template>
  <div class="relative w-full">
    <label
      class="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-surface text-white hover:border-zayit-blue transition"
      :class="[
        error ? 'border-red-500' : 'border-gray-600',
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        class="hidden"
        type="file"
        :id="id"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled || isLoading || !canUpload"
        @change="handleFileChange"
        ref="inputRef"
      />

      <div class="text-center pointer-events-none">
        <p class="text-sm">
          <span class="font-semibold text-zayit-blue">Clique para enviar</span>
          ou arraste para cá
        </p>
        <p class="text-xs text-white/60 mt-1">
          {{ acceptText }}
        </p>

        <div v-if="isLoading" class="mt-3 text-white text-sm text-center animate-pulse">
          Compactando imagem...
        </div>
      </div>

      <!-- Preview estilo FilePond -->
      <div
        v-if="previewUrls.length"
        class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        <div
          v-for="(src, i) in previewUrls"
          :key="i"
          class="file-item group relative bg-black/20 rounded-lg overflow-hidden border border-white/10 shadow-lg transition hover:shadow-xl"
        >
          <img
            v-if="isImage(src)"
            :src="src"
            class="w-full h-auto aspect-[4/3] object-cover transition group-hover:scale-105"
          />
          <div
            v-else
            class="w-full aspect-[4/3] flex items-center justify-center text-sm text-white/60 bg-black/30"
          >
            {{ getFileName(src) }}
          </div>

          <button
            type="button"
            @click.stop="removeFile(i)"
            class="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full z-10"
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useFileUpload } from '@/composables/forms/useFileUpload';

const props = defineProps<{
  modelValue: File | File[] | null;
  accept?: string;
  error?: string;
  multiple?: boolean;
  disabled?: boolean;
  id?: string;
  autoUpload?: boolean;
  uploadUrl?: string;
  uploadFieldName?: string;
}>();

const acceptText = computed(() => {
  if (props.accept?.includes('image')) return 'PNG, JPG, JPEG, WebP, etc';
  if (props.accept?.includes('pdf')) return 'PDF até 5MB';
  return 'Arquivos permitidos';
});

const {
  files,
  previewUrls,
  isDragging,
  isLoading,
  canUpload,
  handleFileChange,
  handleDrop,
  removeFile,
  isImage,
  getFileName,
} = useFileUpload({
  multiple: props.multiple,
  compress: true,
  delayAfterUpload: 2000,
  autoUpload: props.autoUpload,
  uploadUrl: props.uploadUrl,
  uploadFieldName: props.uploadFieldName,
});
</script>
