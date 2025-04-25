import { ref } from 'vue';
import BaseFileInput from '@/components/ui/forms/BaseFileInput.vue';
import DocBlock from '@/components/docs/DocBlock.vue';
const avatar = ref(null);
const avatarTemp = ref(null);
const manualCode = `<BaseFileInput
    v-model="avatar"
    :multiple="false"
    :auto-upload="false"
    :upload-url="'/uploads/avatar'"
    :upload-field-name="'avatar'"
  />`;
const autoCode = `<BaseFileInput
    v-model="avatarTemp"
    :auto-upload="true"
    :upload-url="'/uploads/temp'"
    :upload-field-name="'avatar'"
  />`;
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "p-8 space-y-10 bg-surface min-h-screen" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl text-white font-bold" },
});
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Upload manual no submit",
    description: "O envio só acontece quando você chamar manualmente `uploadAll()` ou submeter o formulário.",
    code: (__VLS_ctx.manualCode),
}));
const __VLS_1 = __VLS_0({
    title: "Upload manual no submit",
    description: "O envio só acontece quando você chamar manualmente `uploadAll()` ou submeter o formulário.",
    code: (__VLS_ctx.manualCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
/** @type {[typeof BaseFileInput, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(BaseFileInput, new BaseFileInput({
    modelValue: (__VLS_ctx.avatar),
    multiple: (false),
    autoUpload: (false),
    uploadUrl: ('/uploads/avatar'),
    uploadFieldName: ('avatar'),
}));
const __VLS_4 = __VLS_3({
    modelValue: (__VLS_ctx.avatar),
    multiple: (false),
    autoUpload: (false),
    uploadUrl: ('/uploads/avatar'),
    uploadFieldName: ('avatar'),
}, ...__VLS_functionalComponentArgsRest(__VLS_3));
var __VLS_2;
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "Upload automático ao selecionar",
    description: "Assim que a imagem for selecionada, ela será automaticamente compactada e enviada para o backend.",
    code: (__VLS_ctx.autoCode),
}));
const __VLS_7 = __VLS_6({
    title: "Upload automático ao selecionar",
    description: "Assim que a imagem for selecionada, ela será automaticamente compactada e enviada para o backend.",
    code: (__VLS_ctx.autoCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_8.slots.default;
/** @type {[typeof BaseFileInput, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(BaseFileInput, new BaseFileInput({
    modelValue: (__VLS_ctx.avatarTemp),
    autoUpload: (true),
    uploadUrl: ('/uploads/temp'),
    uploadFieldName: ('avatar'),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.avatarTemp),
    autoUpload: (true),
    uploadUrl: ('/uploads/temp'),
    uploadFieldName: ('avatar'),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_8;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            BaseFileInput: BaseFileInput,
            DocBlock: DocBlock,
            avatar: avatar,
            avatarTemp: avatarTemp,
            manualCode: manualCode,
            autoCode: autoCode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
