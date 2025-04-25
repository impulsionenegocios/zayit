import { ref, watch, computed, onMounted, nextTick } from 'vue';
const props = defineProps();
const emit = defineEmits();
const textareaRef = ref(null);
const resizeClass = computed(() => {
    return {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
    }[props.resize ?? 'none'];
});
function onInput(event) {
    const target = event.target;
    emit('update:modelValue', target.value);
    if (props.autogrow)
        adjustHeight();
}
function adjustHeight() {
    if (textareaRef.value) {
        textareaRef.value.style.height = 'auto';
        textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px';
    }
}
onMounted(() => {
    if (props.autogrow)
        nextTick(adjustHeight);
});
watch(() => props.modelValue, () => {
    if (props.autogrow)
        nextTick(adjustHeight);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative w-full" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.textarea)({
    ...{ onInput: (__VLS_ctx.onInput) },
    ref: "textareaRef",
    id: (__VLS_ctx.id),
    value: (__VLS_ctx.modelValue),
    placeholder: (__VLS_ctx.placeholder),
    disabled: (__VLS_ctx.disabled),
    maxlength: (__VLS_ctx.maxlength),
    rows: (__VLS_ctx.rows),
    ...{ class: "input-base" },
    ...{ style: {} },
});
/** @type {typeof __VLS_ctx.textareaRef} */ ;
if (__VLS_ctx.maxlength) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute bottom-1 right-2 text-xs text-white/50 pointer-events-none focus:border-zayit-blue" },
    });
    (__VLS_ctx.modelValue?.length);
    (__VLS_ctx.maxlength);
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['input-base']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-1']} */ ;
/** @type {__VLS_StyleScopedClasses['right-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/50']} */ ;
/** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-zayit-blue']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            textareaRef: textareaRef,
            onInput: onInput,
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
