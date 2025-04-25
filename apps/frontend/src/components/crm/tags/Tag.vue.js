import { defineProps, defineEmits } from 'vue';
const props = defineProps();
const emit = defineEmits();
// Helper function to get contrasting text color
function getContrastColor(hexColor) {
    if (!hexColor)
        return '#ffffff';
    const hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
}
// Click handler
function handleClick() {
    if (props.selectable && !props.disabled) {
        emit('click', props.tag);
    }
}
// Delete handler
function handleDelete() {
    if (props.deletable && !props.disabled) {
        emit('delete', props.tag);
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onClick: (__VLS_ctx.handleClick) },
    ...{ class: "inline-flex items-center rounded px-2 py-1 text-xs font-medium transition-colors" },
    ...{ class: ({
            'cursor-pointer hover:opacity-80': __VLS_ctx.selectable || __VLS_ctx.deletable,
            'opacity-60': __VLS_ctx.disabled
        }) },
    ...{ style: ({
            backgroundColor: __VLS_ctx.tag.color,
            color: __VLS_ctx.getContrastColor(__VLS_ctx.tag.color)
        }) },
});
(__VLS_ctx.tag.name);
if (__VLS_ctx.deletable) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.handleDelete) },
        ...{ class: "ml-1 text-current hover:text-white" },
        disabled: (__VLS_ctx.disabled),
    });
}
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:opacity-80']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-60']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-current']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-white']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            getContrastColor: getContrastColor,
            handleClick: handleClick,
            handleDelete: handleDelete,
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
});
; /* PartiallyEnd: #4569/main.vue */
