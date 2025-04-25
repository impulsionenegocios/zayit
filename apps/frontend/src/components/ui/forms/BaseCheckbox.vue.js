import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
// Se o modelValue for um array (modo grupo) ou um booleano
const isArrayMode = computed(() => Array.isArray(props.modelValue));
const checked = computed(() => {
  if (isArrayMode.value) {
    // Em modo array, verifica se o valor (passado via prop "value") está incluído no array
    return props.value !== undefined && props.modelValue.includes(props.value);
  }
  return props.modelValue;
});
function onChange(event) {
  const target = event.target;
  const newValue = target.checked;
  if (isArrayMode.value) {
    const currentArray = props.modelValue;
    if (newValue) {
      // Adiciona o valor se ele não estiver presente
      if (props.value !== undefined && !currentArray.includes(props.value)) {
        emit('update:modelValue', [...currentArray, props.value]);
      }
    } else {
      // Remove o valor se estiver presente
      if (props.value !== undefined && currentArray.includes(props.value)) {
        emit(
          'update:modelValue',
          currentArray.filter((v) => v !== props.value),
        );
      }
    }
  } else {
    emit('update:modelValue', newValue);
  }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.label,
  __VLS_intrinsicElements.label,
)({
  for: __VLS_ctx.id,
  ...{ class: 'flex items-center space-x-2 cursor-pointer select-none' },
  ...{ class: { 'opacity-50 cursor-not-allowed': __VLS_ctx.disabled } },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
  ...{ onChange: __VLS_ctx.onChange },
  type: 'checkbox',
  id: __VLS_ctx.id,
  checked: __VLS_ctx.checked,
  disabled: __VLS_ctx.disabled,
  ...{ class: 'peer hidden' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{
    class:
      'w-5 h-5 flex items-center justify-center border rounded bg-surface transition-all duration-150',
  },
  ...{
    class: [
      __VLS_ctx.error ? 'border-red-500' : 'border-gray-600',
      __VLS_ctx.checked ? 'bg-zayit-blue border-zayit-blue' : '',
      __VLS_ctx.disabled ? 'pointer-events-none' : '',
    ],
  },
});
if (__VLS_ctx.checked) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.svg,
    __VLS_intrinsicElements.svg,
  )({
    xmlns: 'http://www.w3.org/2000/svg',
    ...{ class: 'h-4 w-4 text-white' },
    viewBox: '0 0 20 20',
    fill: 'currentColor',
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.path)({
    'fill-rule': 'evenodd',
    d: 'M16.707 5.293a1 1 0 010 1.414l-7.364 7.364a1 1 0 01-1.414 0L3.293 9.414a1 1 0 011.414-1.414L8 11.293l6.293-6.293a1 1 0 011.414 0z',
    'clip-rule': 'evenodd',
  });
}
if (__VLS_ctx.label) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'text-sm text-white' },
  });
  __VLS_ctx.label;
}
/** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['space-x-2']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['select-none']} */ /** @type {__VLS_StyleScopedClasses['opacity-50']} */ /** @type {__VLS_StyleScopedClasses['cursor-not-allowed']} */ /** @type {__VLS_StyleScopedClasses['peer']} */ /** @type {__VLS_StyleScopedClasses['hidden']} */ /** @type {__VLS_StyleScopedClasses['w-5']} */ /** @type {__VLS_StyleScopedClasses['h-5']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['rounded']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['duration-150']} */ /** @type {__VLS_StyleScopedClasses['h-4']} */ /** @type {__VLS_StyleScopedClasses['w-4']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      checked: checked,
      onChange: onChange,
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
