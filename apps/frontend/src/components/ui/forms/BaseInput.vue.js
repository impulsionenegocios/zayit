import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'relative w-full' },
});
if (__VLS_ctx.$slots.icon) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none' },
  });
  var __VLS_0 = {};
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
  ...{
    onFocus: (...[$event]) => {
      __VLS_ctx.$emit('focus');
    },
  },
  ...{
    onBlur: (...[$event]) => {
      __VLS_ctx.$emit('blur');
    },
  },
  name: __VLS_ctx.name,
  type: __VLS_ctx.type,
  placeholder: __VLS_ctx.placeholder,
  disabled: __VLS_ctx.disabled,
  readonly: __VLS_ctx.readonly,
  ...{
    class: ['input-base', __VLS_ctx.$slots.icon ? 'pl-10' : '', __VLS_ctx.loading ? 'pr-10' : ''],
  },
});
__VLS_ctx.inputValue;
if (__VLS_ctx.loading) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'absolute inset-y-0 right-0 flex items-center pr-3' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full' },
  });
}
/** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['inset-y-0']} */ /** @type {__VLS_StyleScopedClasses['left-0']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['pl-3']} */ /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ /** @type {__VLS_StyleScopedClasses['input-base']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['inset-y-0']} */ /** @type {__VLS_StyleScopedClasses['right-0']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['pr-3']} */ /** @type {__VLS_StyleScopedClasses['animate-spin']} */ /** @type {__VLS_StyleScopedClasses['h-4']} */ /** @type {__VLS_StyleScopedClasses['w-4']} */ /** @type {__VLS_StyleScopedClasses['border-2']} */ /** @type {__VLS_StyleScopedClasses['border-white']} */ /** @type {__VLS_StyleScopedClasses['border-t-transparent']} */ /** @type {__VLS_StyleScopedClasses['rounded-full']} */ // @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      inputValue: inputValue,
    };
  },
  __typeEmits: {},
  __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  __typeEmits: {},
  __typeProps: {},
});
export default {}; /* PartiallyEnd: #4569/main.vue */
