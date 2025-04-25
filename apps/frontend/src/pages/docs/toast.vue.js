import { useToast } from '@/stores/layout/toast';
import DocBlock from '@/components/docs/DocBlock.vue';
const toast = useToast();
const toastCode = `
  const toast = useToast()
  
  toast.success('Operação realizada com sucesso!')
  toast.error('Ocorreu um erro inesperado!')
  toast.info('Essa é uma informação importante.')
  toast.warning('Atenção: algo requer cuidado.')
  `.trim();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "p-8 space-y-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-2xl text-white font-bold" },
});
/** @type {[typeof DocBlock, typeof DocBlock, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(DocBlock, new DocBlock({
    title: "useToast + ToastContainer",
    description: "Exemplo completo de como disparar notificações toast globais com Pinia.",
    code: (__VLS_ctx.toastCode),
}));
const __VLS_1 = __VLS_0({
    title: "useToast + ToastContainer",
    description: "Exemplo completo de como disparar notificações toast globais com Pinia.",
    code: (__VLS_ctx.toastCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toast.success('Operação realizada com sucesso!');
        } },
    ...{ class: "btn-toast btn-toast-green" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toast.error('Ocorreu um erro inesperado!');
        } },
    ...{ class: "btn-toast btn-toast-red" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toast.info('Essa é uma informação importante.');
        } },
    ...{ class: "btn-toast btn-toast-blue" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.toast.warning('Atenção: algo requer cuidado.');
        } },
    ...{ class: "btn-toast btn-toast-yellow" },
});
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast-green']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast-red']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast-blue']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast-yellow']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocBlock: DocBlock,
            toast: toast,
            toastCode: toastCode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
