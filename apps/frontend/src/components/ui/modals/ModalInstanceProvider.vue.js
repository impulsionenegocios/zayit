import { provide } from 'vue';
const props = defineProps();
provide('modal-instance', {
  resolve: props.resolve,
  reject: props.reject,
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
var __VLS_0 = {};
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {};
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
