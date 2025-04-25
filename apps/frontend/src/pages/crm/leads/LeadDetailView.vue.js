import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LeadDetail from '@/components/crm/leads/leadDetail.vue';
const route = useRoute();
const leadId = computed(() => route.params.id);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
/** @type {[typeof LeadDetail, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(
  LeadDetail,
  new LeadDetail({
    leadId: __VLS_ctx.leadId,
  }),
);
const __VLS_1 = __VLS_0(
  {
    leadId: __VLS_ctx.leadId,
  },
  ...__VLS_functionalComponentArgsRest(__VLS_0),
);
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      LeadDetail: LeadDetail,
      leadId: leadId,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
