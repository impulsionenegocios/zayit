import { useModal } from '@/composables/useModal';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import DocBlock from '@/components/docs/DocBlock.vue';
const modal = useModal();
async function abrirModal() {
    try {
        const confirmado = await modal.open(ConfirmModal, {
            title: 'Tem certeza?',
            props: {
                message: 'Essa ação não poderá ser desfeita.',
            },
            size: 'sm',
            persistent: false,
        });
        console.log('✅ Confirmado:', confirmado);
    }
    catch {
        console.log('❌ Cancelado');
    }
}
const modalCode = `
  import { useModal } from '@/stores/layout/modal'
  import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue'
  
  const modal = useModal()
  
  try {
    const result = await modal.open(ConfirmModal, {
      title: 'Tem certeza?',
      props: { message: 'Essa ação não poderá ser desfeita.' },
      size: 'sm',
      persistent: false,
    })
  
    console.log('Confirmado:', result)
  } catch {
    console.log('Cancelado')
  }
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
    title: "useModal + ModalContainer",
    description: "Exemplo completo de como abrir um modal global dinâmico com suporte a Promise e componente injetado.",
    code: (__VLS_ctx.modalCode),
}));
const __VLS_1 = __VLS_0({
    title: "useModal + ModalContainer",
    description: "Exemplo completo de como abrir um modal global dinâmico com suporte a Promise e componente injetado.",
    code: (__VLS_ctx.modalCode),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-x-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.abrirModal) },
    ...{ class: "btn-toast btn-toast-blue" },
});
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-10']} */ ;
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-toast-blue']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DocBlock: DocBlock,
            abrirModal: abrirModal,
            modalCode: modalCode,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
