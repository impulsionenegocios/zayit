import { useRouter } from 'vue-router';
import { useLeadForm } from '@/composables/crm/useLeadForm';
import { Icon } from '@iconify/vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
import BaseTextarea from '@/components/ui/forms/BaseTextarea.vue';
import BaseSelect from '@/components/ui/forms/BaseSelect.vue';
import TagSelector from '@/components/crm/tags/TagSelector.vue';
const props = defineProps();
const router = useRouter();
// Use our lead form composable
const {
  form,
  errors,
  isSubmitting,
  isEditing,
  handleSubmit,
  cancel,
  sourceOptions,
  statusOptions,
  selectedTagIds, // Get the selectedTagIds from the composable
} = useLeadForm(props.leadId);
// The TagSelector component now handles all tag-related functionality:
// - Fetching available tags from the backend
// - Searching and filtering tags
// - Creating new tags
// - Selecting/deselecting tags
// - Managing the selected tags state
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'bg-surface rounded-lg shadow p-6 space-y-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.form,
  __VLS_intrinsicElements.form,
)({
  ...{ onSubmit: __VLS_ctx.handleSubmit },
  ...{ class: 'space-y-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-lg font-medium text-white' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
});
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Name',
    forLabel: 'name',
    error: __VLS_ctx.errors.name,
    touched: true,
  }),
);
const __VLS_1 = __VLS_0(
  {
    label: 'Name',
    forLabel: 'name',
    error: __VLS_ctx.errors.name,
    touched: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_0),
);
__VLS_2.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    modelValue: __VLS_ctx.form.name,
    id: 'name',
    placeholder: 'Full name',
    error: !!__VLS_ctx.errors.name,
  }),
);
const __VLS_4 = __VLS_3(
  {
    modelValue: __VLS_ctx.form.name,
    id: 'name',
    placeholder: 'Full name',
    error: !!__VLS_ctx.errors.name,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_3),
);
var __VLS_2;
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Email',
    forLabel: 'email',
    error: __VLS_ctx.errors.email,
    touched: true,
  }),
);
const __VLS_7 = __VLS_6(
  {
    label: 'Email',
    forLabel: 'email',
    error: __VLS_ctx.errors.email,
    touched: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_6),
);
__VLS_8.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    modelValue: __VLS_ctx.form.email,
    id: 'email',
    type: 'email',
    placeholder: 'Email address',
    error: !!__VLS_ctx.errors.email,
  }),
);
const __VLS_10 = __VLS_9(
  {
    modelValue: __VLS_ctx.form.email,
    id: 'email',
    type: 'email',
    placeholder: 'Email address',
    error: !!__VLS_ctx.errors.email,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_9),
);
var __VLS_8;
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Phone',
    forLabel: 'phone',
    error: __VLS_ctx.errors.phone,
    touched: true,
  }),
);
const __VLS_13 = __VLS_12(
  {
    label: 'Phone',
    forLabel: 'phone',
    error: __VLS_ctx.errors.phone,
    touched: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_12),
);
__VLS_14.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    modelValue: __VLS_ctx.form.phone,
    id: 'phone',
    placeholder: 'Phone number',
    error: !!__VLS_ctx.errors.phone,
  }),
);
const __VLS_16 = __VLS_15(
  {
    modelValue: __VLS_ctx.form.phone,
    id: 'phone',
    placeholder: 'Phone number',
    error: !!__VLS_ctx.errors.phone,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_15),
);
var __VLS_14;
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Birth Date',
    forLabel: 'birthDate',
  }),
);
const __VLS_19 = __VLS_18(
  {
    label: 'Birth Date',
    forLabel: 'birthDate',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_18),
);
__VLS_20.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    modelValue: __VLS_ctx.form.birthDate,
    id: 'birthDate',
    type: 'date',
    placeholder: 'Birth date (optional)',
  }),
);
const __VLS_22 = __VLS_21(
  {
    modelValue: __VLS_ctx.form.birthDate,
    id: 'birthDate',
    type: 'date',
    placeholder: 'Birth date (optional)',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_21),
);
var __VLS_20;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-lg font-medium text-white' },
});
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Address',
    forLabel: 'address',
  }),
);
const __VLS_25 = __VLS_24(
  {
    label: 'Address',
    forLabel: 'address',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_24),
);
__VLS_26.slots.default;
/** @type {[typeof BaseTextarea, ]} */ // @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(
  BaseTextarea,
  new BaseTextarea({
    modelValue: __VLS_ctx.form.address,
    id: 'address',
    placeholder: 'Full address (optional)',
    rows: 3,
  }),
);
const __VLS_28 = __VLS_27(
  {
    modelValue: __VLS_ctx.form.address,
    id: 'address',
    placeholder: 'Full address (optional)',
    rows: 3,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_27),
);
var __VLS_26;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-lg font-medium text-white' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
});
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Source',
    forLabel: 'source',
  }),
);
const __VLS_31 = __VLS_30(
  {
    label: 'Source',
    forLabel: 'source',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_30),
);
__VLS_32.slots.default;
/** @type {[typeof BaseSelect, ]} */ // @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(
  BaseSelect,
  new BaseSelect({
    modelValue: __VLS_ctx.form.source,
    id: 'source',
    options: __VLS_ctx.sourceOptions,
    placeholder: 'Select source',
  }),
);
const __VLS_34 = __VLS_33(
  {
    modelValue: __VLS_ctx.form.source,
    id: 'source',
    options: __VLS_ctx.sourceOptions,
    placeholder: 'Select source',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_33),
);
var __VLS_32;
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Status',
    forLabel: 'status',
    error: __VLS_ctx.errors.status,
    touched: true,
  }),
);
const __VLS_37 = __VLS_36(
  {
    label: 'Status',
    forLabel: 'status',
    error: __VLS_ctx.errors.status,
    touched: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_36),
);
__VLS_38.slots.default;
/** @type {[typeof BaseSelect, ]} */ // @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent(
  BaseSelect,
  new BaseSelect({
    modelValue: __VLS_ctx.form.status,
    id: 'status',
    options: __VLS_ctx.statusOptions,
    placeholder: 'Select status',
    error: !!__VLS_ctx.errors.status,
  }),
);
const __VLS_40 = __VLS_39(
  {
    modelValue: __VLS_ctx.form.status,
    id: 'status',
    options: __VLS_ctx.statusOptions,
    placeholder: 'Select status',
    error: !!__VLS_ctx.errors.status,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_39),
);
var __VLS_38;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'space-y-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h3,
  __VLS_intrinsicElements.h3,
)({
  ...{ class: 'text-lg font-medium text-white' },
});
/** @type {[typeof TagSelector, ]} */ // @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(
  TagSelector,
  new TagSelector({
    modelValue: __VLS_ctx.selectedTagIds,
    canCreateTags: true,
  }),
);
const __VLS_43 = __VLS_42(
  {
    modelValue: __VLS_ctx.selectedTagIds,
    canCreateTags: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_42),
);
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-end gap-3 pt-4' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  ...{ onClick: __VLS_ctx.cancel },
  type: 'button',
  ...{ class: 'btn-secondary' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  type: 'submit',
  ...{ class: 'btn-primary' },
  disabled: __VLS_ctx.isSubmitting,
});
if (__VLS_ctx.isSubmitting) {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  const __VLS_45 = {}.Icon;
  /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
  const __VLS_46 = __VLS_asFunctionalComponent(
    __VLS_45,
    new __VLS_45({
      icon: 'mdi:loading',
      ...{ class: 'animate-spin mr-1' },
    }),
  );
  const __VLS_47 = __VLS_46(
    {
      icon: 'mdi:loading',
      ...{ class: 'animate-spin mr-1' },
    },
    ...__VLS_functionalComponentArgsRest(__VLS_46),
  );
} else {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
  __VLS_ctx.isEditing ? 'Update Lead' : 'Create Lead';
}
/** @type {__VLS_StyleScopedClasses['bg-surface']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['shadow']} */ /** @type {__VLS_StyleScopedClasses['p-6']} */ /** @type {__VLS_StyleScopedClasses['space-y-6']} */ /** @type {__VLS_StyleScopedClasses['space-y-6']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['grid']} */ /** @type {__VLS_StyleScopedClasses['grid-cols-1']} */ /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ /** @type {__VLS_StyleScopedClasses['gap-4']} */ /** @type {__VLS_StyleScopedClasses['space-y-4']} */ /** @type {__VLS_StyleScopedClasses['text-lg']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['gap-3']} */ /** @type {__VLS_StyleScopedClasses['pt-4']} */ /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ /** @type {__VLS_StyleScopedClasses['btn-primary']} */ /** @type {__VLS_StyleScopedClasses['animate-spin']} */ /** @type {__VLS_StyleScopedClasses['mr-1']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Icon: Icon,
      FormControl: FormControl,
      BaseInput: BaseInput,
      BaseTextarea: BaseTextarea,
      BaseSelect: BaseSelect,
      TagSelector: TagSelector,
      form: form,
      errors: errors,
      isSubmitting: isSubmitting,
      isEditing: isEditing,
      handleSubmit: handleSubmit,
      cancel: cancel,
      sourceOptions: sourceOptions,
      statusOptions: statusOptions,
      selectedTagIds: selectedTagIds,
    };
  },
  __typeProps: {},
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
  __typeProps: {},
}); /* PartiallyEnd: #4569/main.vue */
