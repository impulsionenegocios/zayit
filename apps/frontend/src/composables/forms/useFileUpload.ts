import { ref, computed, onBeforeUnmount } from 'vue';
import imageCompression from 'browser-image-compression';
import api from '@/lib/axios';

export type UseFileUploadOptions = {
  multiple?: boolean;
  compress?: boolean;
  delayAfterUpload?: number;
  autoUpload?: boolean;
  uploadUrl?: string;
  uploadFieldName?: string;
};

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    multiple = false,
    compress = true,
    delayAfterUpload = 2000,
    autoUpload = false,
    uploadUrl = '',
    uploadFieldName = 'file',
  } = options;

  const files = ref<File[]>([]);
  const blobUrls = ref<string[]>([]);
  const uploadedFiles = ref<any[]>([]);
  const uploadProgress = ref<number[]>([]);

  const isDragging = ref(false);
  const isLoading = ref(false);
  const canUpload = ref(true);

  const previewUrls = computed(() => {
    blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
    const newUrls = files.value.map((file) => URL.createObjectURL(file));
    blobUrls.value = newUrls;
    return newUrls;
  });

  async function handleFileChange(event: Event) {
    if (!canUpload.value || isLoading.value) return;
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    await processFiles(Array.from(input.files));
  }

  async function handleDrop(event: DragEvent) {
    if (!event.dataTransfer?.files || !canUpload.value || isLoading.value) return;
    await processFiles(Array.from(event.dataTransfer.files));
    isDragging.value = false;
  }

  async function processFiles(fileList: File[]) {
    isLoading.value = true;
    canUpload.value = false;

    const processed = compress ? await compressFiles(fileList) : fileList;
    files.value = multiple ? processed : [processed[0]];

    if (autoUpload && uploadUrl) {
      await uploadAll();
    }

    isLoading.value = false;
    setTimeout(() => {
      canUpload.value = true;
    }, delayAfterUpload);
  }

  async function compressFiles(fileList: File[]) {
    const promises = fileList.map(async (file) => {
      if (!file.type.startsWith('image/')) return file;
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        return compressed;
      } catch (err) {
        console.error('Erro ao comprimir imagem:', err);
        return file;
      }
    });

    return await Promise.all(promises);
  }

  async function uploadAll() {
    if (!uploadUrl) return;

    uploadedFiles.value = [];
    uploadProgress.value = [];

    for (const [index, file] of files.value.entries()) {
      const form = new FormData();
      form.append(uploadFieldName, file);

      try {
        const { data } = await api.post(uploadUrl, form, {
          onUploadProgress: (e) => {
            uploadProgress.value[index] = Math.round((e.loaded * 100) / (e.total || 1));
          },
        });
        uploadedFiles.value[index] = data;
      } catch (err) {
        console.error(`Erro ao enviar arquivo ${index + 1}:`, err);
        uploadedFiles.value[index] = null;
      }
    }
  }

  function removeFile(index: number) {
    const el = document.querySelectorAll('.file-item')[index];
    if (el) {
      el.classList.add('opacity-0', 'scale-90', 'transition-all', 'duration-300');
    }

    setTimeout(() => {
      if (blobUrls.value[index]) {
        URL.revokeObjectURL(blobUrls.value[index]);
        blobUrls.value.splice(index, 1);
      }
      const newFiles = [...files.value];
      newFiles.splice(index, 1);
      files.value = newFiles;
      uploadedFiles.value.splice(index, 1);
      uploadProgress.value.splice(index, 1);
    }, 300);
  }

  function getFileName(blobUrl: string) {
    const index = previewUrls.value.findIndex((url) => url === blobUrl);
    return files.value[index]?.name ?? 'Arquivo';
  }

  function isImage(src: string) {
    return src.startsWith('blob:') || /\.(jpe?g|png|webp|gif)$/i.test(src);
  }

  function resetFiles() {
    blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
    blobUrls.value = [];
    files.value = [];
    uploadedFiles.value = [];
    uploadProgress.value = [];
  }

  onBeforeUnmount(() => {
    blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
  });

  return {
    files,
    previewUrls,
    uploadedFiles,
    uploadProgress,
    isDragging,
    isLoading,
    canUpload,
    isImage,
    handleFileChange,
    handleDrop,
    uploadAll,
    removeFile,
    getFileName,
    resetFiles,
  };
}
