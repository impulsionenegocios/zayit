import { computed } from 'vue';
const props = defineProps();
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
const colClassFromValue = (prefix, cols) => `${prefix ? prefix + ':' : ''}grid-cols-${cols}`;
const computedClasses = computed(() => {
  const cols = props.cols ?? 2;
  const colClasses =
    typeof cols === 'number'
      ? colClassFromValue(null, cols)
      : Object.entries(cols)
          .map(([bp, val]) =>
            colClassFromValue(bp === 'base' ? null : breakpoints.includes(bp) ? bp : null, val),
          )
          .join(' ');
  const gapClass = props.gap ? `gap-${props.gap}` : 'gap-4';
  return `grid ${colClasses} ${gapClass}`;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: __VLS_ctx.computedClasses },
});
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      computedClasses: computedClasses,
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
