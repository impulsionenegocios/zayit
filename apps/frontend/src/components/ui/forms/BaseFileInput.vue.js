import { computed, watch, ref } from 'vue';
import { useFileUpload } from '@/composables/forms/useFileUpload';
import ConfirmModal from '../modals/ConfirmModal.vue';
import { useModal } from '@/composables/useModal';
const modal = useModal();
const props = defineProps();
const emit = defineEmits();
const fileRemoved = ref(false);
const acceptText = computed(() => {
    return 'Apenas imagens: PNG, JPG, JPEG, WebP, etc';
});
const { files, previewUrls, fileErrors, isDragging, isLoading, canUpload, handleFileChange, handleDrop, removeFile, isImage, getFileName, clear, } = useFileUpload({
    multiple: props.multiple,
    compress: true,
    delayAfterUpload: 2000,
    autoUpload: props.autoUpload,
    uploadUrl: props.uploadUrl,
    uploadFieldName: props.uploadFieldName,
    accept: props.accept || 'image/*',
    validateFileType: (file) => {
        if (!file.type.startsWith('image/')) {
            return 'Apenas arquivos de imagem são permitidos';
        }
        return null;
    },
});
// Função para remover arquivo existente
const removeExistingFile = async () => {
    try {
        const result = await modal.open(ConfirmModal, {
            title: 'Tem certeza?',
            props: { message: 'Você deseja mesmo remover este arquivo?' },
            size: 'sm',
            persistent: false,
        });
        if (result) {
            fileRemoved.value = true;
            emit('file-removed');
            if (props.onFileRemoved) {
                props.onFileRemoved();
            }
        }
    }
    catch { }
};
const resetarInput = () => {
    clear(); // limpa previews, arquivos e estados
    emit('update:modelValue', null); // zera o model vinculado externamente
    fileRemoved.value = false;
};
const __VLS_exposed = {
    resetarInput,
};
defineExpose(__VLS_exposed);
// Atualiza o modelo quando os arquivos mudam
watch(files, () => {
    if (props.multiple) {
        emit('update:modelValue', files.value);
    }
    else {
        emit('update:modelValue', files.value[0] || null);
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative w-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ onDragover: (...[$event]) => {
            __VLS_ctx.isDragging = true;
        } },
    ...{ onDragleave: (...[$event]) => {
            __VLS_ctx.isDragging = false;
        } },
    ...{ onDrop: (__VLS_ctx.handleDrop) },
    ...{ class: "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-surface text-white hover:border-zayit-blue transition" },
    ...{ class: ([
            __VLS_ctx.error ? 'border-red-500' : 'border-gray-600',
            __VLS_ctx.disabled || __VLS_ctx.isLoading ? 'opacity-50 cursor-not-allowed' : '',
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onChange: (__VLS_ctx.handleFileChange) },
    ...{ class: "hidden" },
    type: "file",
    id: (__VLS_ctx.id),
    accept: (__VLS_ctx.accept || 'image/*'),
    multiple: (__VLS_ctx.multiple),
    disabled: (__VLS_ctx.disabled || __VLS_ctx.isLoading || !__VLS_ctx.canUpload),
    ref: "inputRef",
});
/** @type {typeof __VLS_ctx.inputRef} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "text-center pointer-events-none" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-semibold text-zayit-blue" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs text-white/60 mt-1" },
});
(__VLS_ctx.acceptText);
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-3 text-white text-sm text-center animate-pulse" },
    });
}
if (__VLS_ctx.fileErrors.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
        ...{ class: "mt-2 text-sm text-red-400 list-disc pl-4" },
    });
    for (const [err, i] of __VLS_getVForSourceType((__VLS_ctx.fileErrors))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
            key: (i),
        });
        (err);
    }
}
if (__VLS_ctx.existingFileUrl && !__VLS_ctx.previewUrls.length && !__VLS_ctx.fileRemoved) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "max:w-[50%] h-[300px] bg-card mt-4 rounded-3xl" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "file-item group relative transition-all duration-500 bg-black/20 rounded-lg overflow-hidden border border-white/10 shadow-lg hover:shadow-xl" },
    });
    if (__VLS_ctx.isImage(__VLS_ctx.existingFileUrl)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
            src: (__VLS_ctx.existingFileUrl),
            ...{ class: "w-full transition-all duration-500 h-auto aspect-[4/3] object-contain p-4 group-hover:scale-105 max-h-[300px]" },
            alt: "Arquivo atual",
        });
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "w-full aspect-[4/3] flex items-center justify-center text-sm text-white/60 bg-black/30" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.removeExistingFile) },
        type: "button",
        ...{ class: "absolute top-1 right-1 bg-zayit-danger py-[2px] cursor-pointer hover:bg-red-600 text-white px-2 rounded-full z-10" },
        title: "Remover",
    });
}
if (__VLS_ctx.previewUrls.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "max:w-[50%] h-[300px] bg-card mt-4 rounded-3xl" },
    });
    for (const [src, i] of __VLS_getVForSourceType((__VLS_ctx.previewUrls))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (i),
            ...{ class: "file-item group relative transition-all duration-500 bg-black/20 rounded-lg overflow-hidden border border-white/10 shadow-lg hover:shadow-xl" },
        });
        if (__VLS_ctx.isImage(src)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
                src: (src),
                ...{ class: "w-full transition-all duration-500 h-auto aspect-[4/3] object-contain p-4 group-hover:scale-105 max-h-[300px]" },
                alt: "Nova imagem",
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "w-full aspect-[4/3] flex items-center justify-center text-sm text-white/60 bg-black/30" },
            });
            (__VLS_ctx.getFileName(src));
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.previewUrls.length))
                        return;
                    __VLS_ctx.removeFile(i);
                } },
            type: "button",
            ...{ class: "absolute top-1 right-1 bg-zayit-danger py-[2px] cursor-pointer hover:bg-red-600 text-white px-2 rounded-full z-10" },
            title: "Remover",
        });
    }
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:border-zayit-blue']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/60']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['list-disc']} */ ;
/** @type {__VLS_StyleScopedClasses['pl-4']} */ ;
/** @type {__VLS_StyleScopedClasses['max:w-[50%]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[300px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['file-item']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-[4/3]']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[300px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-[4/3]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/60']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/30']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-zayit-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['py-[2px]']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['max:w-[50%]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-[300px]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['file-item']} */ ;
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/20']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-white/10']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-all']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-500']} */ ;
/** @type {__VLS_StyleScopedClasses['h-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-[4/3]']} */ ;
/** @type {__VLS_StyleScopedClasses['object-contain']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['group-hover:scale-105']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-[300px]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['aspect-[4/3]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/60']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-black/30']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-zayit-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['py-[2px]']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            fileRemoved: fileRemoved,
            acceptText: acceptText,
            previewUrls: previewUrls,
            fileErrors: fileErrors,
            isDragging: isDragging,
            isLoading: isLoading,
            canUpload: canUpload,
            handleFileChange: handleFileChange,
            handleDrop: handleDrop,
            removeFile: removeFile,
            isImage: isImage,
            getFileName: getFileName,
            removeExistingFile: removeExistingFile,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {
            ...__VLS_exposed,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
