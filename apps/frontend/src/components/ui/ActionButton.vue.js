import { computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const variantClass = computed(() => {
    const v = props.variant || 'primary';
    return `btn-action-${v}`;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.emit('click', $event);
        } },
    type: (props.type ?? 'button'),
    ...{ class: "btn-action min-h-10" },
    ...{ class: ([__VLS_ctx.variantClass, __VLS_ctx.loading && 'btn-action-loading']) },
    disabled: (__VLS_ctx.disabled || __VLS_ctx.loading),
});
if (__VLS_ctx.$slots.icon) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "relative z-10 mr-2" },
    });
    var __VLS_0 = {};
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "relative z-10" },
});
(__VLS_ctx.loading ? '' : __VLS_ctx.title);
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['z-10']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            variantClass: variantClass,
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
export default {};
; /* PartiallyEnd: #4569/main.vue */
