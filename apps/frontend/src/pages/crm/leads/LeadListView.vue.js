import LeadList from '@/components/crm/leads/LeadList.vue';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { Icon } from '@iconify/vue';
const router = useRouter();
// Add the "Create Lead" button to the top action bar
usePageActionButton(
  {
    title: 'Create Lead',
    variant: 'primary',
    onClick: () => router.push('/leads/new'),
  },
  {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
  },
);
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
/** @type {[typeof LeadList, ]} */ // @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(LeadList, new LeadList({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ /** @type {__VLS_StyleScopedClasses['font-bold']} */ /** @type {__VLS_StyleScopedClasses['text-white']} */ /** @type {__VLS_StyleScopedClasses['mb-6']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      LeadList: LeadList,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
