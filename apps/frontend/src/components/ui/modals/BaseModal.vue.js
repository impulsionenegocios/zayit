import { computed } from 'vue';
const props = defineProps();
const sizeClass = computed(() => {
  const map = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };
  return map[props.size || 'md'];
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{
    class: [
      'rounded-lg shadow-lg bg-card p-6 w-full custom-scroll relative max-h-[80%] overflow-auto',
      __VLS_ctx.sizeClass,
    ],
  },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-between items-start mb-4' },
});
if (props?.title) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.h2,
    __VLS_intrinsicElements.h2,
  )({
    ...{ class: 'text-lg font-bold' },
  });
  props?.title;
}
if (!__VLS_ctx.persistent) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!!__VLS_ctx.persistent) return;
        __VLS_ctx.$emit('close');
      },
    },
    ...{ class: 'text-gray-500 hover:text-black text-xl absolute z-[90] right-8 top-4' },
  });
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'text-sm text-gray-700' },
});
var __VLS_0 = {};
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['bg-card']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['custom-scroll']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['max-h-[80%]']} */ /** @type {__VLS_StyleScopedClasses['overflow-auto']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['items-start']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['hover:text-black']} */ /** @type {__VLS_StyleScopedClasses['text-xl']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['z-[90]']} */ /** @type {__VLS_StyleScopedClasses['right-8']} */ /** @type {__VLS_StyleScopedClasses['top-4']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-gray-700']} */ // @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      sizeClass: sizeClass,
    };
  },
  __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
});
export default {}; /* PartiallyEnd: #4569/main.vue */
