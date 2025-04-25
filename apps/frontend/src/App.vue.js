import TailwindDebug from '@/components/dev/TailwindDebug.vue';
import ToastContainer from '@/components/ui/toast/ToastContainer.vue';
import ModalContainer from '@/components/ui/modals/ModalContainer.vue';
// vazio
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof ModalContainer, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ModalContainer, new ModalContainer({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof ToastContainer, ]} */ // @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(ToastContainer, new ToastContainer({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
/** @type {[typeof TailwindDebug, ]} */ // @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(TailwindDebug, new TailwindDebug({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_9 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ // @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      TailwindDebug: TailwindDebug,
      ToastContainer: ToastContainer,
      ModalContainer: ModalContainer,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
