import { storeToRefs } from 'pinia';
import { useModalStore } from '@/stores/layout/modal';
import ModalInstanceProvider from './ModalInstanceProvider.vue';
const store = useModalStore();
const { modals } = storeToRefs(store);
const { close, cancel } = store;
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection
// CSS variable injection end
if (__VLS_ctx.modals.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'fixed inset-0 z-50 flex items-center justify-center' },
  });
  const __VLS_0 = {}.TransitionGroup;
  /** @type {[typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, typeof __VLS_components.TransitionGroup, typeof __VLS_components.transitionGroup, ]} */ // @ts-ignore
  const __VLS_1 = __VLS_asFunctionalComponent(
    __VLS_0,
    new __VLS_0({
      name: 'modal-fade',
      tag: 'div',
    }),
  );
  const __VLS_2 = __VLS_1(
    {
      name: 'modal-fade',
      tag: 'div',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_1),
  );
  __VLS_3.slots.default;
  for (const [modal] of __VLS_getVForSourceType(__VLS_ctx.modals)) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{
        onClick: (...[$event]) => {
          if (!__VLS_ctx.modals.length) return;
          !modal.persistent && __VLS_ctx.cancel(modal.id);
        },
      },
      key: modal.id,
      ...{ class: 'fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm' },
    });
    /** @type {[typeof ModalInstanceProvider, typeof ModalInstanceProvider, ]} */ // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(
      ModalInstanceProvider,
      new ModalInstanceProvider({
        resolve: modal.resolve,
        reject: modal.reject,
      }),
    );
    const __VLS_5 = __VLS_4(
      {
        resolve: modal.resolve,
        reject: modal.reject,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_4),
    );
    __VLS_6.slots.default;
    const __VLS_7 = modal.component;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(
      __VLS_7,
      new __VLS_7({
        ...{ onClose: {} },
        ...modal.props,
      }),
    );
    const __VLS_9 = __VLS_8(
      {
        ...{ onClose: {} },
        ...modal.props,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_8),
    );
    let __VLS_11;
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = {
      onClose: (result) => __VLS_ctx.close(modal.id, result),
    };
    var __VLS_10;
    var __VLS_6;
  }
  var __VLS_3;
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['bg-black/50']} */ /** @type {__VLS_StyleScopedClasses['backdrop-blur-sm']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      ModalInstanceProvider: ModalInstanceProvider,
      modals: modals,
      close: close,
      cancel: cancel,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
