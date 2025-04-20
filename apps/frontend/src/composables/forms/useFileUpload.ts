import { ref, computed, onBeforeUnmount, watch } from 'vue';
import imageCompression from 'browser-image-compression';
import api from '@/lib/axios';

export type UseFileUploadOptions = {
  multiple?: boolean;
  compress?: boolean;
  delayAfterUpload?: number;
  autoUpload?: boolean;
  uploadUrl?: string;
  uploadFieldName?: string;
  accept?: string; // opção para validação de tipos permitidos
  validateFileType?: (file: File) => string | null; // função personalizada para validação de tipo
};

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    multiple = false,
    compress = true,
    delayAfterUpload = 2000,
    autoUpload = false,
    uploadUrl = '',
    uploadFieldName = 'file',
    accept,
    validateFileType: customValidateFileType,
  } = options;

  const files = ref<File[]>([]);
  const blobUrls = ref<string[]>([]);
  const uploadedFiles = ref<any[]>([]);
  const uploadProgress = ref<number[]>([]);
  const fileErrors = ref<string[]>([]);

  const isDragging = ref(false);
  const isLoading = ref(false);
  const canUpload = ref(true);

  const previewUrls = computed(() => {
    // Revoga URLs anteriores para evitar vazamentos de memória
    blobUrls.value.forEach((url) => URL.revokeObjectURL(url));
    const newUrls = files.value.map((file) => URL.createObjectURL(file));
    blobUrls.value = newUrls;
    return newUrls;
  });

  // Tamanho máximo: 5MB
  const MAX_SIZE_MB = 5;

  // Validação de tipo de arquivo.
  // Se "accept" for fornecido, valida comparando com os tipos permitidos.
  // Adicionalmente, rejeita arquivos PSD (imagem do Photoshop).
  function validateFileType(file: File): boolean {
    // Rejeitar PSD mesmo que o MIME comece com "image/"
    if (file.type === 'image/vnd.adobe.photoshop') {
      return false;
    }
    if (!accept) return true; // Sem restrição se não houver
    const allowedTypes = accept.split(',').map((t) => t.trim());
    for (const type of allowedTypes) {
      if (type === '*') return true;
      if (type.endsWith('/*')) {
        const prefix = type.split('/')[0];
        if (file.type.startsWith(prefix + '/')) return true;
      } else if (file.type === type) {
        return true;
      }
    }
    return false;
  }

  // Validação de tamanho: para arquivos PDF ou demais que não sejam imagens, tamanho <= 5MB.
  function validateFileSize(file: File): boolean {
    if (file.type.includes('pdf') || !file.type.startsWith('image/')) {
      return file.size <= MAX_SIZE_MB * 1024 * 1024;
    }
    return true;
  }

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
    fileErrors.value = []; // Limpa erros anteriores

    // Valida e filtra arquivos válidos
    const validFiles: File[] = [];
    for (const file of fileList) {
      if (customValidateFileType) {
        const errorMessage = customValidateFileType(file);
        if (errorMessage) {
          fileErrors.value.push(errorMessage);
          continue;
        }
      } 
      else if (!validateFileType(file)) {
        fileErrors.value.push(`"${file.name}" tem tipo inválido.`);
        continue;
      }
      
      if (!validateFileSize(file)) {
        fileErrors.value.push(`"${file.name}" excede ${MAX_SIZE_MB}MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      isLoading.value = false;
      setTimeout(() => {
        canUpload.value = true;
      }, delayAfterUpload);
      return;
    }

    // Processa os arquivos: compressão se necessário
    const processed = compress ? await compressFiles(validFiles) : validFiles;
    files.value = multiple ? processed : [processed[0]];

    if (autoUpload && uploadUrl) {
      await uploadAll();
    }

    isLoading.value = false;
    setTimeout(() => {
      canUpload.value = true;
    }, delayAfterUpload);
  }

  async function compressFiles(fileList: File[]): Promise<File[]> {
    const promises = fileList.map(async (file) => {
      // Apenas tenta comprimir se for imagem que não seja PSD
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
        // Se ocorrer erro na compressão, retorna o arquivo original
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
            uploadProgress.value[index] = Math.round(
              (e.loaded * 100) / (e.total || 1)
            );
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
  function clear() {
    // Revoga todos os blobs antigos
    blobUrls.value.forEach((url) => URL.revokeObjectURL(url))
  
    // Limpa todos os estados
    files.value = []
    blobUrls.value = []
    uploadedFiles.value = []
    uploadProgress.value = []
    fileErrors.value = []
  
    // Restaura flags
    isDragging.value = false
    isLoading.value = false
    canUpload.value = true
  }
  
  return {
    files,
    previewUrls,
    uploadedFiles,
    uploadProgress,
    fileErrors,
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
    clear
  };
}
