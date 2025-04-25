import { ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const isOpen = ref(false);
function toggleDropdown() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}
function selectOption(option) {
  emit('update:modelValue', option.value);
  isOpen.value = false;
}
const selectedLabel = computed(() => {
  const found = props.options.find((opt) => opt.value === props.modelValue);
  return found?.label ?? '';
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
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ onClick: __VLS_ctx.toggleDropdown },
  ...{
    class:
      'w-full rounded-lg px-4 py-2 bg-surface border cursor-pointer flex items-center justify-between',
  },
  ...{
    class: [
      __VLS_ctx.error ? 'border-red-500' : 'border-gray-600',
      __VLS_ctx.disabled ? 'opacity-50 cursor-not-allowed' : '',
    ],
  },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.span,
  __VLS_intrinsicElements.span,
)({
  ...{ class: 'text-white' },
});
__VLS_ctx.selectedLabel || __VLS_ctx.placeholder;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.svg,
  __VLS_intrinsicElements.svg,
)({
  ...{ class: 'h-4 w-4 text-white' },
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M19 9l-7 7-7-7',
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.ul,
  __VLS_intrinsicElements.ul,
)({
  ...{
    class:
      'absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto',
  },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(
  null,
  { ...__VLS_directiveBindingRestFields, value: __VLS_ctx.isOpen },
  null,
  null,
);
for (const [option] of __VLS_getVForSourceType(__VLS_ctx.options)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.li,
    __VLS_intrinsicElements.li,
  )({
    ...{
      onClick: (...[$event]) => {
        __VLS_ctx.selectOption(option);
      },
    },
    key: option.value,
    ...{ class: 'px-4 py-2 cursor-pointer hover:bg-zayit-blue text-white' },
  });
  option.label;
}
if (!__VLS_ctx.options.length) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.li,
    __VLS_intrinsicElements.li,
  )({
    ...{ class: 'px-4 py-2 text-sm text-white/60' },
  });
}
/** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-between']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['h-4']} */ /** @type {__VLS_StyleScopedClasses['w-4']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-gray-700']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['max-h-60']} */ /** @type {__VLS_StyleScopedClasses['overflow-auto']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['px-4']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-white/60']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      isOpen: isOpen,
      toggleDropdown: toggleDropdown,
      selectOption: selectOption,
      selectedLabel: selectedLabel,
    };
  },
  __typeEmits: {},
  __typeProps: {},
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  __typeEmits: {},
  __typeProps: {},
}); /* PartiallyEnd: #4569/main.vue */
