import { h, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useTagList } from '@/composables/crm/useTagList';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { useModal } from '@/composables/useModal';
import ConfirmModal from '@/components/ui/modals/ConfirmModal.vue';
import BaseTable from '@/components/layout/BaseTable.vue';
const router = useRouter();
const modal = useModal();
const { tags, isLoading, fetchTags, removeTag, bulkDeleteTags } = useTagList();
// Table columns definition
const columns = [
    { key: 'name', label: 'Tag Name' },
    { key: 'color', label: 'Color' },
    { key: 'created_at', label: 'Created' },
];
// Navigate to edit page
const editTag = (tag) => {
    router.push({ name: 'EditTag', params: { id: tag.id } });
};
// Confirm and delete a tag
const confirmDeleteTag = async (tag) => {
    try {
        const confirmed = await modal.open(ConfirmModal, {
            title: 'Delete Tag',
            props: {
                message: `Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`
            },
            size: 'sm'
        });
        if (confirmed) {
            await removeTag(tag.id);
        }
    }
    catch (error) {
        // Modal was dismissed
        console.log('Delete operation cancelled');
    }
};
// Handle bulk delete
const handleBulkDelete = async (ids) => {
    if (!ids.length)
        return;
    try {
        const confirmed = await modal.open(ConfirmModal, {
            title: 'Delete Tags',
            props: {
                message: `Are you sure you want to delete ${ids.length} tag(s)? This action cannot be undone.`
            },
            size: 'sm'
        });
        if (confirmed) {
            await bulkDeleteTags(ids.map(id => id.toString()));
        }
    }
    catch (error) {
        // Modal was dismissed
        console.log('Bulk delete operation cancelled');
    }
};
// Helper function for text contrast
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
// Add "Create Tag" action button
usePageActionButton({
    title: 'Create Tag',
    variant: 'primary',
    onClick: () => {
        router.push({ name: 'CreateTag' });
    },
    loading: false,
}, {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
});
// Load tags on component mount
onMounted(async () => {
    await fetchTags();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof BaseTable, typeof BaseTable, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(BaseTable, new BaseTable({
    ...{ 'onBulkDelete': {} },
    items: (__VLS_ctx.tags),
    perPage: (10),
    loading: (__VLS_ctx.isLoading),
    columns: (__VLS_ctx.columns),
}));
const __VLS_1 = __VLS_0({
    ...{ 'onBulkDelete': {} },
    items: (__VLS_ctx.tags),
    perPage: (10),
    loading: (__VLS_ctx.isLoading),
    columns: (__VLS_ctx.columns),
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
let __VLS_3;
let __VLS_4;
let __VLS_5;
const __VLS_6 = {
    onBulkDelete: (__VLS_ctx.handleBulkDelete)
};
var __VLS_7 = {};
__VLS_2.slots.default;
{
    const { 'cell:name': __VLS_thisSlot } = __VLS_2.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "w-4 h-4 rounded-full" },
        ...{ style: ({ backgroundColor: item.color }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.name);
}
{
    const { 'cell:color': __VLS_thisSlot } = __VLS_2.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center space-x-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-2 py-1 text-xs rounded" },
        ...{ style: ({ backgroundColor: item.color, color: __VLS_ctx.getContrastColor(item.color) }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm" },
    });
    (item.color);
}
{
    const { actions: __VLS_thisSlot } = __VLS_2.slots;
    const [{ item }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.editTag(item);
            } },
        ...{ class: "btn-primary px-3 py-3 rounded-full text-white cursor-pointer" },
        title: "Edit tag",
    });
    const __VLS_8 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        icon: "mdi:pencil",
    }));
    const __VLS_10 = __VLS_9({
        icon: "mdi:pencil",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.confirmDeleteTag(item);
            } },
        ...{ class: "btn-danger px-3 py-3 rounded-full text-white cursor-pointer" },
        title: "Delete tag",
    });
    const __VLS_12 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        icon: "mdi:delete",
    }));
    const __VLS_14 = __VLS_13({
        icon: "mdi:delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Icon: Icon,
            BaseTable: BaseTable,
            tags: tags,
            isLoading: isLoading,
            columns: columns,
            editTag: editTag,
            confirmDeleteTag: confirmDeleteTag,
            handleBulkDelete: handleBulkDelete,
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
