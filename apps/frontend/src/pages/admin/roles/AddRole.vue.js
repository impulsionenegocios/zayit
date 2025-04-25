import { useRoleForm } from '@/composables/roles/useRoleForm';
// Componentes visuais
import FormSection from '@/components/ui/forms/FormSection.vue';
import FormGrid from '@/components/ui/forms/FormGrid.vue';
import FormControl from '@/components/ui/forms/FormControl.vue';
import BaseInput from '@/components/ui/forms/BaseInput.vue';
// Lógica do formulário
const { name, nameError, blurName, nameMeta, salvar, carregando } = useRoleForm();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {[typeof FormSection, typeof FormSection, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(
  FormSection,
  new FormSection({
    title: 'Cadastrar Role',
    ...{ class: 'px-8' },
  }),
);
const __VLS_1 = __VLS_0(
  {
    title: 'Cadastrar Role',
    ...{ class: 'px-8' },
  },
  ...__VLS_functionalComponentArgsRest(__VLS_0),
);
var __VLS_3 = {};
__VLS_2.slots.default;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.form,
  __VLS_intrinsicElements.form,
)({
  ...{ onSubmit: __VLS_ctx.salvar },
});
/** @type {[typeof FormGrid, typeof FormGrid, ]} */ // @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(
  FormGrid,
  new FormGrid({
    cols: { base: 1, md: 2 },
    gap: 4,
  }),
);
const __VLS_5 = __VLS_4(
  {
    cols: { base: 1, md: 2 },
    gap: 4,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_4),
);
__VLS_6.slots.default;
/** @type {[typeof FormControl, typeof FormControl, ]} */ // @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(
  FormControl,
  new FormControl({
    label: 'Nome da Role',
    forLabel: 'name',
    error: __VLS_ctx.nameError,
    touched: __VLS_ctx.nameMeta.touched,
    valid: __VLS_ctx.nameMeta.valid,
    showSuccess: true,
  }),
);
const __VLS_8 = __VLS_7(
  {
    label: 'Nome da Role',
    forLabel: 'name',
    error: __VLS_ctx.nameError,
    touched: __VLS_ctx.nameMeta.touched,
    valid: __VLS_ctx.nameMeta.valid,
    showSuccess: true,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_7),
);
__VLS_9.slots.default;
/** @type {[typeof BaseInput, ]} */ // @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(
  BaseInput,
  new BaseInput({
    ...{ onBlur: {} },
    modelValue: __VLS_ctx.name,
    name: 'name',
    id: 'name',
    placeholder: 'Digite o nome da Role',
  }),
);
const __VLS_11 = __VLS_10(
  {
    ...{ onBlur: {} },
    modelValue: __VLS_ctx.name,
    name: 'name',
    id: 'name',
    placeholder: 'Digite o nome da Role',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_10),
);
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
  onBlur: __VLS_ctx.blurName,
};
var __VLS_12;
var __VLS_9;
var __VLS_6;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'flex justify-end mt-6' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.button,
  __VLS_intrinsicElements.button,
)({
  type: 'submit',
  ...{ class: 'btn-success btn' },
  disabled: __VLS_ctx.carregando,
});
if (__VLS_ctx.carregando) {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
} else {
  __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
var __VLS_2;
/** @type {__VLS_StyleScopedClasses['px-8']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['justify-end']} */ /** @type {__VLS_StyleScopedClasses['mt-6']} */ /** @type {__VLS_StyleScopedClasses['btn-success']} */ /** @type {__VLS_StyleScopedClasses['btn']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      FormSection: FormSection,
      FormGrid: FormGrid,
      FormControl: FormControl,
      BaseInput: BaseInput,
      name: name,
      nameError: nameError,
      blurName: blurName,
      nameMeta: nameMeta,
      salvar: salvar,
      carregando: carregando,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
