import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LeadForm from '@/components/crm/leads/LeadForm.vue';
const route = useRoute();
const leadId = computed(() => route.params.id);
const isEditing = computed(() => !!leadId.value);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.h1,
  __VLS_intrinsicElements.h1,
)({
  ...{ class: 'text-2xl font-bold text-white mb-6' },
});
__VLS_ctx.isEditing ? 'Edit Lead' : 'Create Lead';
/** @type {[typeof LeadForm, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(
  LeadForm,
  new LeadForm({
    leadId: __VLS_ctx.leadId,
  }),
);
const __VLS_1 = __VLS_0(
  {
    leadId: __VLS_ctx.leadId,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_0),
);
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-6']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      LeadForm: LeadForm,
      leadId: leadId,
      isEditing: isEditing,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
