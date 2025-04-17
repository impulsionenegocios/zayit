<template>
  <div class="relative w-full">
    <label
      class="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-surface text-white hover:border-zayit-blue transition"
      :class="[
        error ? 'border-red-500' : 'border-gray-600',
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        class="hidden"
        type="file"
        :id="id"
        :accept="accept || 'image/*'"
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

        <div
          v-if="isLoading"
          class="mt-3 text-white text-sm text-center animate-pulse"
        >
          Compactando imagem...
        </div>
      </div>

      <!-- Exibe erros de validação -->
      <ul
        v-if="fileErrors.length"
        class="mt-2 text-sm text-red-400 list-disc pl-4"
      >
        <li v-for="(err, i) in fileErrors" :key="i">{{ err }}</li>
      </ul>

      <!-- Preview de arquivo existente -->
      <div
        v-if="existingFileUrl && !previewUrls.length && !fileRemoved"
        class="mt-4 grid grid-cols-1 gap-4"
      >
        <div
          class="file-item group relative bg-black/20 rounded-lg overflow-hidden border border-white/10 shadow-lg transition hover:shadow-xl"
        >
          <img
            v-if="isImage(existingFileUrl)"
            :src="existingFileUrl"
            class="w-full h-auto aspect-[4/3] object-cover transition group-hover:scale-105"
            alt="Arquivo atual"
          />
          <div
            v-else
            class="w-full aspect-[4/3] flex items-center justify-center text-sm text-white/60 bg-black/30"
          >
            Arquivo atual
          </div>

          <button
            type="button"
            @click.stop="removeExistingFile"
            class="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full z-10"
            title="Remover"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Preview de novos arquivos -->
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
            alt="Nova imagem"
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
import { computed, watch, ref } from 'vue';
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
  existingFileUrl?: string | null;
  onFileRemoved?: () => void;
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | File[] | null): void;
  (e: 'file-removed'): void;
}>()

const fileRemoved = ref(false);

const acceptText = computed(() => {
  return 'Apenas imagens: PNG, JPG, JPEG, WebP, etc';
})

const {
  files,
  previewUrls,
  fileErrors,
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
  accept: props.accept || 'image/*',
})

// Função para remover arquivo existente
const removeExistingFile = () => {
  fileRemoved.value = true;
  emit('file-removed');
  
  if (props.onFileRemoved) {
    props.onFileRemoved();
  }
}

// Atualiza o modelo quando os arquivos mudam
watch(files, () => {
  if (props.multiple) {
    emit('update:modelValue', files.value)
  } else {
    emit('update:modelValue', files.value[0] || null)
  }
})
</script>

