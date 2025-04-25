import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTagForm } from '@/composables/crm/useTagForm';
// UI Components
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
const route = useRoute();
const tagId = route.params.id;
// Use tag form composable
const { name, nameError, blurName, nameMeta, color, colorError, blurColor, colorMeta, submitForm, loadTagData, isLoading, goBack } = useTagForm(tagId);
// Helper function to get contrasting text color for a background color
function getContrastColor(hexColor) {
    // If no color selected, default to white text
    if (!hexColor)
        return '#ffffff';
    // Remove # if present
    const hex = hexColor.replace('#', '');
    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
}
// Load tag data if editing existing tag
onMounted(() => {
    if (tagId) {
        loadTagData();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof FormSection, typeof FormSection, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(FormSection, new FormSection({
    title: (__VLS_ctx.tagId ? 'Edit Tag' : 'Create Tag'),
    ...{ class: "px-8" },
}));
const __VLS_1 = __VLS_0({
    title: (__VLS_ctx.tagId ? 'Edit Tag' : 'Create Tag'),
    ...{ class: "px-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.submitForm) },
});
/** @type {[typeof FormGrid, typeof FormGrid, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(FormGrid, new FormGrid({
    cols: (1),
    gap: (4),
}));
const __VLS_5 = __VLS_4({
    cols: (1),
    gap: (4),
}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_6.slots.default;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Tag Name",
    forLabel: "name",
    error: (__VLS_ctx.nameError),
    touched: (__VLS_ctx.nameMeta.touched),
    valid: (__VLS_ctx.nameMeta.valid),
    showSuccess: (true),
}));
const __VLS_8 = __VLS_7({
    label: "Tag Name",
    forLabel: "name",
    error: (__VLS_ctx.nameError),
    touched: (__VLS_ctx.nameMeta.touched),
    valid: (__VLS_ctx.nameMeta.valid),
    showSuccess: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.name),
    name: "name",
    id: "name",
    placeholder: "Enter tag name",
}));
const __VLS_11 = __VLS_10({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.name),
    name: "name",
    id: "name",
    placeholder: "Enter tag name",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onBlur: (__VLS_ctx.blurName)
};
var __VLS_12;
var __VLS_9;
/** @type {[typeof FormControl, typeof FormControl, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(FormControl, new FormControl({
    label: "Tag Color",
    forLabel: "color",
    error: (__VLS_ctx.colorError),
    touched: (__VLS_ctx.colorMeta.touched),
    valid: (__VLS_ctx.colorMeta.valid),
    showSuccess: (true),
}));
const __VLS_18 = __VLS_17({
    label: "Tag Color",
    forLabel: "color",
    error: (__VLS_ctx.colorError),
    touched: (__VLS_ctx.colorMeta.touched),
    valid: (__VLS_ctx.colorMeta.valid),
    showSuccess: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center space-x-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onBlur: (__VLS_ctx.blurColor) },
    type: "color",
    ...{ class: "h-10 w-10 rounded cursor-pointer" },
});
(__VLS_ctx.color);
/** @type {[typeof BaseInput, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(BaseInput, new BaseInput({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.color),
    name: "color",
    id: "color",
    placeholder: "#000000",
}));
const __VLS_21 = __VLS_20({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.color),
    name: "color",
    id: "color",
    placeholder: "#000000",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    onBlur: (__VLS_ctx.blurColor)
};
var __VLS_22;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-2 flex space-x-2 items-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "text-sm text-white/70" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "px-2 py-1 text-xs font-medium rounded" },
    ...{ style: ({ backgroundColor: __VLS_ctx.color, color: __VLS_ctx.getContrastColor(__VLS_ctx.color) }) },
});
(__VLS_ctx.name || 'Tag Preview');
var __VLS_19;
var __VLS_6;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex justify-end mt-6 space-x-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.goBack) },
    type: "button",
    ...{ class: "btn-default btn" },
    disabled: (__VLS_ctx.isLoading),
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn-success btn" },
    disabled: (__VLS_ctx.isLoading),
});
if (__VLS_ctx.isLoading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.tagId ? 'Updating...' : 'Creating...');
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.tagId ? 'Update Tag' : 'Create Tag');
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['px-8']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-10']} */ ;
/** @type {__VLS_StyleScopedClasses['w-10']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white/70']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-3']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-default']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FormSection: FormSection,
            FormGrid: FormGrid,
            FormControl: FormControl,
            BaseInput: BaseInput,
            tagId: tagId,
            name: name,
            nameError: nameError,
            blurName: blurName,
            nameMeta: nameMeta,
            color: color,
            colorError: colorError,
            blurColor: blurColor,
            colorMeta: colorMeta,
            submitForm: submitForm,
            isLoading: isLoading,
            goBack: goBack,
            getContrastColor: getContrastColor,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
