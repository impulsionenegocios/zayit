import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useToast } from '@/composables/useToast';
import { getTags, createTag } from '@/services/tagService';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseModal from '@/components/ui/modals/BaseModal.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import Tag from './Tag.vue';
const props = defineProps();
const emit = defineEmits();
// State
const allTags = ref([]);
const searchQuery = ref('');
const showDropdown = ref(false);
const showCreateModal = ref(false);
const newTagName = ref('');
const newTagColor = ref('#6366F1');
const isCreating = ref(false);
const toast = useToast();
// Compute selected and filtered
const selectedTags = computed(() =>
  allTags.value.filter((tag) => props.modelValue.includes(tag.id)),
);
const filteredTags = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return allTags.value.filter(
    (tag) => tag.name.toLowerCase().includes(q) && !props.modelValue.includes(tag.id),
  );
});
const tagExists = computed(() => {
  if (!searchQuery.value) return true;
  return allTags.value.some((tag) => tag.name.toLowerCase() === searchQuery.value.toLowerCase());
});
// Handlers
function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
}
function addTag(tag) {
  emit('update:modelValue', [...props.modelValue, tag.id]);
  searchQuery.value = '';
}
function removeTag(tag) {
  emit(
    'update:modelValue',
    props.modelValue.filter((id) => id !== tag.id),
  );
}
function createNewTag() {
  if (!searchQuery.value.trim()) return;
  showCreateModal.value = true;
  newTagName.value = searchQuery.value;
  searchQuery.value = '';
}
async function saveNewTag() {
  if (!newTagName.value.trim()) return;
  isCreating.value = true;
  try {
    const { data } = await createTag({ name: newTagName.value, color: newTagColor.value });
    const tag = {
      id: data.id,
      name: newTagName.value,
      color: newTagColor.value,
      created_at: new Date().toISOString(),
    };
    allTags.value.push(tag);
    addTag(tag);
    toast.success('Tag created successfully');
    showCreateModal.value = false;
    newTagName.value = '';
    newTagColor.value = '#6366F1';
  } catch {
    toast.error('Error creating tag');
  } finally {
    isCreating.value = false;
  }
}
function getContrastColor(hex) {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map((c) => parseInt(c, 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#000' : '#fff';
}
// Load tags
async function loadTags() {
  try {
    const { data } = await getTags();
    allTags.value = data;
  } catch {
    console.error('Error loading tags');
  }
}
onMounted(loadTags);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-2' },
});
if (__VLS_ctx.selectedTags.length > 0) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex flex-wrap gap-2 mb-2' },
  });
  for (const [tag] of __VLS_getVForSourceType(__VLS_ctx.selectedTags)) {
    /** @type {[typeof Tag, ]} */ // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(
      Tag,
      new Tag({
        ...{ onDelete: {} },
        key: tag.id,
        tag: tag,
        deletable: true,
      }),
    );
    const __VLS_1 = __VLS_0(
      {
        ...{ onDelete: {} },
        key: tag.id,
        tag: tag,
        deletable: true,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_0),
    );
    let __VLS_3;
    let __VLS_4;
    let __VLS_5;
    const __VLS_6 = {
      onDelete: (...[$event]) => {
        if (!(__VLS_ctx.selectedTags.length > 0)) return;
        __VLS_ctx.removeTag(tag);
      },
    };
    var __VLS_2;
  }
}
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'relative' },
});
/** @type {[typeof BaseInput, typeof BaseInput, ]} */ // @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    ...{ onFocus: {} },
    ...{ onBlur: {} },
    modelValue: __VLS_ctx.searchQuery,
    placeholder: 'Search tags...',
  }),
);
const __VLS_8 = __VLS_7(
  {
    ...{ onFocus: {} },
    ...{ onBlur: {} },
    modelValue: __VLS_ctx.searchQuery,
    placeholder: 'Search tags...',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_7),
);
let __VLS_10;
let __VLS_11;
let __VLS_12;
const __VLS_13 = {
  onFocus: (...[$event]) => {
    __VLS_ctx.showDropdown = true;
  },
};
const __VLS_14 = {
  onBlur: __VLS_ctx.handleBlur,
};
__VLS_9.slots.default;
{
  const { icon: __VLS_thisSlot } = __VLS_9.slots;
  const __VLS_15 = {}.Icon;
  /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
  const __VLS_16 = __VLS_asFunctionalComponent(
    __VLS_15,
    new __VLS_15({
      icon: 'mdi:magnify',
      ...{ class: 'text-gray-400' },
    }),
  );
  const __VLS_17 = __VLS_16(
    {
      icon: 'mdi:magnify',
      ...{ class: 'text-gray-400' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_16),
  );
}
var __VLS_9;
if (__VLS_ctx.showDropdown && __VLS_ctx.filteredTags.length > 0) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      class:
        'absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto',
    },
  });
  for (const [tag] of __VLS_getVForSourceType(__VLS_ctx.filteredTags)) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{
        onMousedown: (...[$event]) => {
          if (!(__VLS_ctx.showDropdown && __VLS_ctx.filteredTags.length > 0)) return;
          __VLS_ctx.addTag(tag);
        },
      },
      key: tag.id,
      ...{ class: 'p-2 hover:bg-zayit-blue/30 cursor-pointer' },
    });
    /** @type {[typeof Tag, ]} */ // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent(
      Tag,
      new Tag({
        tag: tag,
      }),
    );
    const __VLS_20 = __VLS_19(
      {
        tag: tag,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_19),
    );
  }
  if (__VLS_ctx.canCreateTags && __VLS_ctx.searchQuery && !__VLS_ctx.tagExists) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ onMousedown: __VLS_ctx.createNewTag },
      ...{ class: 'p-2 hover:bg-zayit-blue/30 cursor-pointer border-t border-gray-700' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex items-center text-zayit-blue' },
    });
    const __VLS_22 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent(
      __VLS_22,
      new __VLS_22({
        icon: 'mdi:plus',
        ...{ class: 'mr-1' },
      }),
    );
    const __VLS_24 = __VLS_23(
      {
        icon: 'mdi:plus',
        ...{ class: 'mr-1' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_23),
    );
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_ctx.searchQuery;
  }
} else if (__VLS_ctx.showDropdown && __VLS_ctx.searchQuery && __VLS_ctx.filteredTags.length === 0) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      class:
        'absolute z-50 mt-1 w-full bg-surface border border-gray-700 rounded-lg shadow-lg p-4 text-center text-gray-400',
    },
  });
  if (__VLS_ctx.canCreateTags) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ onMousedown: __VLS_ctx.createNewTag },
      ...{ class: 'mt-2 text-zayit-blue cursor-pointer' },
    });
    const __VLS_26 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(
      __VLS_26,
      new __VLS_26({
        icon: 'mdi:plus',
        ...{ class: 'mr-1' },
      }),
    );
    const __VLS_28 = __VLS_27(
      {
        icon: 'mdi:plus',
        ...{ class: 'mr-1' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_27),
    );
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_ctx.searchQuery;
  }
}
if (__VLS_ctx.showCreateModal) {
  /** @type {[typeof BaseModal, typeof BaseModal, ]} */ // @ts-ignore
  const __VLS_30 = __VLS_asFunctionalComponent(
    BaseModal,
    new BaseModal({
      ...{ onClose: {} },
      title: 'Create New Tag',
      size: 'sm',
    }),
  );
  const __VLS_31 = __VLS_30(
    {
      ...{ onClose: {} },
      title: 'Create New Tag',
      size: 'sm',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_30),
  );
  let __VLS_33;
  let __VLS_34;
  let __VLS_35;
  const __VLS_36 = {
    onClose: (...[$event]) => {
      if (!__VLS_ctx.showCreateModal) return;
      __VLS_ctx.showCreateModal = false;
    },
  };
  __VLS_32.slots.default;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'space-y-4' },
  });
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_37 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Tag Name',
      forLabel: 'newTagName',
    }),
  );
  const __VLS_38 = __VLS_37(
    {
      label: 'Tag Name',
      forLabel: 'newTagName',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_37),
  );
  __VLS_39.slots.default;
  /** @type {[typeof BaseInput, ]} */ // @ts-ignore
  const __VLS_40 = __VLS_asFunctionalComponent(
    BaseInput,
    new BaseInput({
      modelValue: __VLS_ctx.newTagName,
      id: 'newTagName',
      placeholder: 'Enter tag name',
    }),
  );
  const __VLS_41 = __VLS_40(
    {
      modelValue: __VLS_ctx.newTagName,
      id: 'newTagName',
      placeholder: 'Enter tag name',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_40),
  );
  var __VLS_39;
  /** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
  const __VLS_43 = __VLS_asFunctionalComponent(
    FormControl,
    new FormControl({
      label: 'Tag Color',
      forLabel: 'newTagColor',
    }),
  );
  const __VLS_44 = __VLS_43(
    {
      label: 'Tag Color',
      forLabel: 'newTagColor',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_43),
  );
  __VLS_45.slots.default;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex items-center space-x-3' },
  });
  __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    type: 'color',
    ...{ class: 'h-10 w-10 rounded cursor-pointer' },
  });
  __VLS_ctx.newTagColor;
  /** @type {[typeof BaseInput, ]} */ // @ts-ignore
  const __VLS_46 = __VLS_asFunctionalComponent(
    BaseInput,
    new BaseInput({
      modelValue: __VLS_ctx.newTagColor,
      id: 'newTagColor',
      placeholder: '#000000',
    }),
  );
  const __VLS_47 = __VLS_46(
    {
      modelValue: __VLS_ctx.newTagColor,
      id: 'newTagColor',
      placeholder: '#000000',
    },
    ...__VLS_functionalComponentArgsRest(__VLS_46),
  );
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'mt-2 flex space-x-2 items-center' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.span,
    __VLS_intrinsicElements.span,
  )({
    ...{ class: 'text-sm text-white/70' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'px-2 py-1 text-xs font-medium rounded' },
    ...{
      style: {
        backgroundColor: __VLS_ctx.newTagColor,
        color: __VLS_ctx.getContrastColor(__VLS_ctx.newTagColor),
      },
    },
  });
  __VLS_ctx.newTagName || 'Tag Preview';
  var __VLS_45;
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{ class: 'flex justify-end space-x-3 pt-4' },
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.showCreateModal) return;
        __VLS_ctx.showCreateModal = false;
      },
    },
    ...{ class: 'btn btn-secondary' },
    disabled: __VLS_ctx.isCreating,
  });
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.button,
    __VLS_intrinsicElements.button,
  )({
    ...{ onClick: __VLS_ctx.saveNewTag },
    ...{ class: 'btn btn-primary' },
    disabled: __VLS_ctx.isCreating,
  });
  __VLS_ctx.isCreating ? 'Creating...' : 'Create Tag';
  var __VLS_32;
}
/** @type {__VLS_StyleScopedClasses['space-y-2']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ /** @type {__VLS_StyleScopedClasses['gap-2']} */ /** @type {__VLS_StyleScopedClasses['mb-2']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-gray-700']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['max-h-60']} */ /** @type {__VLS_StyleScopedClasses['overflow-auto']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-zayit-blue/30']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-zayit-blue/30']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['border-t']} */ /** @type {__VLS_StyleScopedClasses['border-gray-700']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['absolute']} */ /** @type {__VLS_StyleScopedClasses['z-50']} */ /** @type {__VLS_StyleScopedClasses['mt-1']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['border']} */ /** @type {__VLS_StyleScopedClasses['border-gray-700']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow-lg']} */ /** @type {__VLS_StyleScopedClasses['p-4']} */ /** @type {__VLS_StyleScopedClasses['text-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ /** @type {__VLS_StyleScopedClasses['text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['space-x-3']} */ /** @type {__VLS_StyleScopedClasses['h-10']} */ /** @type {__VLS_StyleScopedClasses['w-10']} */ /** @type {__VLS_StyleScopedClasses['rounded']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['space-x-2']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['text-white/70']} */ /** @type {__VLS_StyleScopedClasses['px-2']} */ /** @type {__VLS_StyleScopedClasses['py-1']} */ /** @type {__VLS_StyleScopedClasses['text-xs']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['rounded']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['space-x-3']} */ /** @type {__VLS_StyleScopedClasses['pt-4']} */ /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ /** @type {__VLS_StyleScopedClasses['btn']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Icon: Icon,
      BaseInput: BaseInput,
      BaseModal: BaseModal,
      FormControl: FormControl,
      Tag: Tag,
      searchQuery: searchQuery,
      showDropdown: showDropdown,
      showCreateModal: showCreateModal,
      newTagName: newTagName,
      newTagColor: newTagColor,
      isCreating: isCreating,
      selectedTags: selectedTags,
      filteredTags: filteredTags,
      tagExists: tagExists,
      handleBlur: handleBlur,
      addTag: addTag,
      removeTag: removeTag,
      createNewTag: createNewTag,
      saveNewTag: saveNewTag,
      getContrastColor: getContrastColor,
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
