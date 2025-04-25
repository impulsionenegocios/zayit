import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
const generateBreadcrumbs = (matched) => {
  const filteredRoutes = matched.filter((r) => r.meta?.breadcrumb);
  if (filteredRoutes.length === 0) return [];
  return filteredRoutes.map((route, index) => {
    const label = route.meta.breadcrumb ?? route.name ?? 'Página';
    return {
      label: String(label),
      path: index === filteredRoutes.length - 1 ? null : route.path,
      dynamic: route.params,
    };
  });
};
const route = useRoute();
const breadcrumbs = computed(() => {
  return generateBreadcrumbs(route.matched);
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.nav,
  __VLS_intrinsicElements.nav,
)({
  ...{ class: 'flex' },
  'aria-label': 'Breadcrumb',
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.ol,
  __VLS_intrinsicElements.ol,
)({
  ...{ class: 'flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse' },
});
for (const [crumb, index] of __VLS_getVForSourceType(__VLS_ctx.breadcrumbs)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.li,
    __VLS_intrinsicElements.li,
  )({
    key: index,
    ...{ class: 'inline-flex items-center justify-center mt-2' },
    'aria-current': index === __VLS_ctx.breadcrumbs.length - 1 ? 'page' : undefined,
  });
  if (index === 0) {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ class: 'inline-flex items-center text-sm font-medium text-gray-400' },
    });
    if (crumb.path) {
      const __VLS_0 = {}.RouterLink;
      /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ // @ts-ignore
      const __VLS_1 = __VLS_asFunctionalComponent(
        __VLS_0,
        new __VLS_0({
          to: crumb.path,
          ...{ class: 'hover:text-zayit-blue transition-all duration-500' },
        }),
      );
      const __VLS_2 = __VLS_1(
        {
          to: crumb.path,
          ...{ class: 'hover:text-zayit-blue transition-all duration-500' },
        },
        ...__VLS_functionalComponentArgsRest(__VLS_1),
      );
      __VLS_3.slots.default;
      crumb.label;
      var __VLS_3;
    } else {
      crumb.label;
    }
  } else {
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.div,
      __VLS_intrinsicElements.div,
    )({
      ...{ class: 'flex items-center' },
    });
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ class: 'text-gray-500' },
    });
    if (crumb.path) {
      const __VLS_4 = {}.RouterLink;
      /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.RouterLink, ]} */ // @ts-ignore
      const __VLS_5 = __VLS_asFunctionalComponent(
        __VLS_4,
        new __VLS_4({
          to: crumb.path,
          ...{ class: 'ms-1 text-sm font-medium md:ms-2 text-gray-100 hover:text-white' },
        }),
      );
      const __VLS_6 = __VLS_5(
        {
          to: crumb.path,
          ...{ class: 'ms-1 text-sm font-medium md:ms-2 text-gray-100 hover:text-white' },
        },
        ...__VLS_functionalComponentArgsRest(__VLS_5),
      );
      __VLS_7.slots.default;
      crumb.label;
      var __VLS_7;
    } else {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.span,
        __VLS_intrinsicElements.span,
      )({
        ...{ class: 'ms-1 text-sm font-medium text-gray-100 md:ms-2' },
      });
      crumb.label;
    }
  }
}
/** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['space-x-1']} */ /** @type {__VLS_StyleScopedClasses['md:space-x-2']} */ /** @type {__VLS_StyleScopedClasses['rtl:space-x-reverse']} */ /** @type {__VLS_StyleScopedClasses['inline-flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['mt-2']} */ /** @type {__VLS_StyleScopedClasses['inline-flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-gray-400']} */ /** @type {__VLS_StyleScopedClasses['hover:text-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['duration-500']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['text-gray-500']} */ /** @type {__VLS_StyleScopedClasses['ms-1']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['md:ms-2']} */ /** @type {__VLS_StyleScopedClasses['text-gray-100']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['ms-1']} */ /** @type {__VLS_StyleScopedClasses['text-sm']} */ /** @type {__VLS_StyleScopedClasses['font-medium']} */ /** @type {__VLS_StyleScopedClasses['text-gray-100']} */ /** @type {__VLS_StyleScopedClasses['md:ms-2']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      RouterLink: RouterLink,
      breadcrumbs: breadcrumbs,
    };
  },
});
export default (await import('vue')).defineComponent({
  setup() {
    return {};
  },
}); /* PartiallyEnd: #4569/main.vue */
