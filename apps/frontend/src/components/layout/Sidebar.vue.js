import { watch, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';
const props = defineProps();
const emit = defineEmits();
const route = useRoute();
const menuItems = ref([
  {
    label: 'Overview',
    icon: 'ic:round-dashboard',
    to: '/superadmin',
  },
  {
    label: 'Clientes',
    icon: 'mdi-account-tie',
    dropdownOpen: false,
    dropdownIcon: 'lsicon:down-outline',
    subitems: [
      {
        label: 'Ver Clientes',
        to: { name: 'VerClientes' },
      },
      {
        label: 'Ver Roles',
        to: { name: 'VerRoles' },
      },
      // {
      //   label: 'Ver Kanban',
      //   to: { name: 'Ver Kanban' },
      // },
    ],
  },
  // {
  //   label: 'Crm',
  //   icon: 'mdi:leads',
  //   dropdownOpen: false,
  //   dropdownIcon:'lsicon:down-outline',
  //   subitems: [
  //     {
  //       label: 'Ver Leads',
  //       to: { name: 'Ver Kanban' }
  //     },
  //     {
  //       label: 'Origens',
  //       to: { name: 'Ver Kanban' }
  //     },
  //     {
  //       label: 'Etiquetas',
  //       to: { name: 'Ver Tags' }
  //     },
  //   ]
  // },
  {
    label: 'CRM',
    icon: 'mdi:account-group',
    dropdownOpen: false,
    dropdownIcon: 'lsicon:down-outline',
    subitems: [
      {
        label: 'Leads & Clients',
        to: { name: 'LeadList' },
      },
      {
        label: 'Tags',
        to: { name: 'TagsList' },
      },
      // {
      //   label: 'Tasks',
      //   to: { name: 'VerKanban' },
      // },
      // {
      //   label: 'Dashboard',
      //   to: { name: 'Dashboard' },
      // },
    ],
  },
  {
    label: 'Docs',
    icon: 'material-symbols:docs',
    dropdownOpen: false,
    dropdownIcon: 'lsicon:down-outline',
    subitems: [
      {
        label: 'File Upload',
        to: { name: 'Docs Upload' },
      },
      {
        label: 'Inputs',
        to: { name: 'Docs Inputs' },
      },
      {
        label: 'Form Layout',
        to: { name: 'Docs Layout' },
      },
      {
        label: 'Toasts',
        to: { name: 'Docs Toasts' },
      },
      {
        label: 'Modal',
        to: { name: 'Docs Modal' },
      },
      {
        label: 'Table',
        to: { name: 'Docs Table' },
      },
    ],
  },
]);
function isActive(to) {
  if (typeof to === 'string') {
    return route.path === to;
  } else if (to && 'name' in to) {
    return route.name === to.name;
  }
  return false;
}
function isDropdownActive(item) {
  if (!item.subitems) return false;
  return item.subitems.some((sub) => isActive(sub.to));
}
function toggleDropdown(index) {
  menuItems.value[index].dropdownOpen = !menuItems.value[index].dropdownOpen;
}
// Ativa o dropdown com base na rota atual
function activateDropdownsFromRoute() {
  menuItems.value.forEach((item) => {
    if (item.subitems) {
      const shouldOpen = item.subitems.some((sub) => isActive(sub.to));
      item.dropdownOpen = shouldOpen;
    }
  });
}
onMounted(activateDropdownsFromRoute);
watch(() => route.fullPath, activateDropdownsFromRoute);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ // @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(
  __VLS_0,
  new __VLS_0({
    name: 'fade',
  }),
);
const __VLS_2 = __VLS_1(
  {
    name: 'fade',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_1),
);
__VLS_3.slots.default;
if (__VLS_ctx.open) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.div,
    __VLS_intrinsicElements.div,
  )({
    ...{
      onClick: (...[$event]) => {
        if (!__VLS_ctx.open) return;
        __VLS_ctx.$emit('close');
      },
    },
    ...{ class: 'fixed inset-0 bg-black opacity-50 lg:hidden z-40' },
  });
}
var __VLS_3;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.aside,
  __VLS_intrinsicElements.aside,
)({
  id: 'default-sidebar',
  ...{
    class: [
      'fixed top-0 left-0 z-40 w-64 2xl:w-76 h-screen transition-transform mt-16 lg:mt-0',
      __VLS_ctx.open ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ],
  },
  'aria-label': 'Sidenav',
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'relative h-full overflow-y-auto py-5 px-3 bg-black' },
});
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.div,
  __VLS_intrinsicElements.div,
)({
  ...{ class: 'items-center justify-center mb-4 hidden lg:flex' },
});
const __VLS_4 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ // @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(
  __VLS_4,
  new __VLS_4({
    to: '/',
  }),
);
const __VLS_6 = __VLS_5(
  {
    to: '/',
  },
  ...__VLS_functionalComponentArgsRest(__VLS_5),
);
__VLS_7.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
  ...{ class: 'h-12 cursor-pointer' },
  src: '@/assets/images/logo-dark.png',
  alt: 'Voltar ao início',
});
var __VLS_7;
__VLS_asFunctionalElement(
  __VLS_intrinsicElements.ul,
  __VLS_intrinsicElements.ul,
)({
  ...{ class: 'space-y-2' },
});
for (const [item, index] of __VLS_getVForSourceType(__VLS_ctx.menuItems)) {
  __VLS_asFunctionalElement(
    __VLS_intrinsicElements.li,
    __VLS_intrinsicElements.li,
  )({
    key: index,
  });
  if (!item.subitems) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_8 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(
      __VLS_8,
      new __VLS_8({
        to: item.to,
        ...{
          class:
            'flex items-center p-2 cursor-pointer text-base font-normal rounded-lg hover:bg-zayit-blue h-12 hover:text-white transition-all duration-300 group',
        },
        ...{ class: __VLS_ctx.isActive(item.to) ? 'sidebar-active hover:!text-white' : '' },
      }),
    );
    const __VLS_10 = __VLS_9(
      {
        to: item.to,
        ...{
          class:
            'flex items-center p-2 cursor-pointer text-base font-normal rounded-lg hover:bg-zayit-blue h-12 hover:text-white transition-all duration-300 group',
        },
        ...{ class: __VLS_ctx.isActive(item.to) ? 'sidebar-active hover:!text-white' : '' },
      },
      ...__VLS_functionalComponentArgsRest(__VLS_9),
    );
    __VLS_11.slots.default;
    const __VLS_12 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(
      __VLS_12,
      new __VLS_12({
        icon: item.icon,
      }),
    );
    const __VLS_14 = __VLS_13(
      {
        icon: item.icon,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_13),
    );
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ class: 'ml-3' },
    });
    item.label;
    var __VLS_11;
  } else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.button,
      __VLS_intrinsicElements.button,
    )({
      ...{
        onClick: (...[$event]) => {
          if (!!!item.subitems) return;
          __VLS_ctx.toggleDropdown(index);
        },
      },
      'aria-expanded': item.dropdownOpen,
      ...{
        class:
          'flex items-center p-2 w-full cursor-pointer text-base font-normal rounded-lg group hover:bg-zayit-blue h-12 hover:text-white transition-all duration-300',
      },
      ...{ class: __VLS_ctx.isDropdownActive(item) ? 'sidebar-active hover:!text-white' : '' },
    });
    const __VLS_16 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(
      __VLS_16,
      new __VLS_16({
        icon: item.icon,
      }),
    );
    const __VLS_18 = __VLS_17(
      {
        icon: item.icon,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_17),
    );
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.span,
      __VLS_intrinsicElements.span,
    )({
      ...{ class: 'flex-1 ml-3 text-left whitespace-nowrap' },
    });
    item.label;
    const __VLS_20 = {}.Icon;
    /** @type {[typeof __VLS_components.Icon, ]} */ // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(
      __VLS_20,
      new __VLS_20({
        icon: item.dropdownIcon,
      }),
    );
    const __VLS_22 = __VLS_21(
      {
        icon: item.dropdownIcon,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_21),
    );
    const __VLS_24 = {}.transition;
    /** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(
      __VLS_24,
      new __VLS_24({
        name: 'dropdown',
        enterActiveClass: 'transition-all duration-300 ease-out',
        leaveActiveClass: 'transition-all duration-200 ease-in',
        enterFromClass: 'opacity-0 max-h-0',
        enterToClass: 'opacity-100 max-h-[300px]',
        leaveFromClass: 'opacity-100 max-h-[300px]',
        leaveToClass: 'opacity-0 max-h-0',
        persisted: true,
      }),
    );
    const __VLS_26 = __VLS_25(
      {
        name: 'dropdown',
        enterActiveClass: 'transition-all duration-300 ease-out',
        leaveActiveClass: 'transition-all duration-200 ease-in',
        enterFromClass: 'opacity-0 max-h-0',
        enterToClass: 'opacity-100 max-h-[300px]',
        leaveFromClass: 'opacity-100 max-h-[300px]',
        leaveToClass: 'opacity-0 max-h-0',
        persisted: true,
      },
      ...__VLS_functionalComponentArgsRest(__VLS_25),
    );
    __VLS_27.slots.default;
    __VLS_asFunctionalElement(
      __VLS_intrinsicElements.ul,
      __VLS_intrinsicElements.ul,
    )({
      ...{ class: 'overflow-hidden py-2 space-y-2 ml-11' },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow)(
      null,
      { ...__VLS_directiveBindingRestFields, value: item.dropdownOpen },
      null,
      null,
    );
    for (const [subitem, subIndex] of __VLS_getVForSourceType(item.subitems)) {
      __VLS_asFunctionalElement(
        __VLS_intrinsicElements.li,
        __VLS_intrinsicElements.li,
      )({
        key: subIndex,
      });
      const __VLS_28 = {}.RouterLink;
      /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ // @ts-ignore
      const __VLS_29 = __VLS_asFunctionalComponent(
        __VLS_28,
        new __VLS_28({
          to: subitem.to,
          ...{
            class:
              'flex items-center p-2 pl-6 w-full text-base font-normal rounded-lg transition duration-300 group h-12 hover:bg-zayit-blue hover:text-white',
          },
          ...{ class: __VLS_ctx.isActive(subitem.to) ? 'sidebar-active hover:!text-white' : '' },
        }),
      );
      const __VLS_30 = __VLS_29(
        {
          to: subitem.to,
          ...{
            class:
              'flex items-center p-2 pl-6 w-full text-base font-normal rounded-lg transition duration-300 group h-12 hover:bg-zayit-blue hover:text-white',
          },
          ...{ class: __VLS_ctx.isActive(subitem.to) ? 'sidebar-active hover:!text-white' : '' },
        },
        ...__VLS_functionalComponentArgsRest(__VLS_29),
      );
      __VLS_31.slots.default;
      subitem.label;
      var __VLS_31;
    }
    var __VLS_27;
  }
}
/** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['inset-0']} */ /** @type {__VLS_StyleScopedClasses['bg-black']} */ /** @type {__VLS_StyleScopedClasses['opacity-50']} */ /** @type {__VLS_StyleScopedClasses['lg:hidden']} */ /** @type {__VLS_StyleScopedClasses['z-40']} */ /** @type {__VLS_StyleScopedClasses['fixed']} */ /** @type {__VLS_StyleScopedClasses['top-0']} */ /** @type {__VLS_StyleScopedClasses['left-0']} */ /** @type {__VLS_StyleScopedClasses['z-40']} */ /** @type {__VLS_StyleScopedClasses['w-64']} */ /** @type {__VLS_StyleScopedClasses['2xl:w-76']} */ /** @type {__VLS_StyleScopedClasses['h-screen']} */ /** @type {__VLS_StyleScopedClasses['transition-transform']} */ /** @type {__VLS_StyleScopedClasses['mt-16']} */ /** @type {__VLS_StyleScopedClasses['lg:mt-0']} */ /** @type {__VLS_StyleScopedClasses['lg:translate-x-0']} */ /** @type {__VLS_StyleScopedClasses['relative']} */ /** @type {__VLS_StyleScopedClasses['h-full']} */ /** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ /** @type {__VLS_StyleScopedClasses['py-5']} */ /** @type {__VLS_StyleScopedClasses['px-3']} */ /** @type {__VLS_StyleScopedClasses['bg-black']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['justify-center']} */ /** @type {__VLS_StyleScopedClasses['mb-4']} */ /** @type {__VLS_StyleScopedClasses['hidden']} */ /** @type {__VLS_StyleScopedClasses['lg:flex']} */ /** @type {__VLS_StyleScopedClasses['h-12']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['space-y-2']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-normal']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['h-12']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['duration-300']} */ /** @type {__VLS_StyleScopedClasses['group']} */ /** @type {__VLS_StyleScopedClasses['ml-3']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-normal']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['group']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['h-12']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ /** @type {__VLS_StyleScopedClasses['transition-all']} */ /** @type {__VLS_StyleScopedClasses['duration-300']} */ /** @type {__VLS_StyleScopedClasses['flex-1']} */ /** @type {__VLS_StyleScopedClasses['ml-3']} */ /** @type {__VLS_StyleScopedClasses['text-left']} */ /** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ /** @type {__VLS_StyleScopedClasses['py-2']} */ /** @type {__VLS_StyleScopedClasses['space-y-2']} */ /** @type {__VLS_StyleScopedClasses['ml-11']} */ /** @type {__VLS_StyleScopedClasses['flex']} */ /** @type {__VLS_StyleScopedClasses['items-center']} */ /** @type {__VLS_StyleScopedClasses['p-2']} */ /** @type {__VLS_StyleScopedClasses['pl-6']} */ /** @type {__VLS_StyleScopedClasses['w-full']} */ /** @type {__VLS_StyleScopedClasses['text-base']} */ /** @type {__VLS_StyleScopedClasses['font-normal']} */ /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ /** @type {__VLS_StyleScopedClasses['transition']} */ /** @type {__VLS_StyleScopedClasses['duration-300']} */ /** @type {__VLS_StyleScopedClasses['group']} */ /** @type {__VLS_StyleScopedClasses['h-12']} */ /** @type {__VLS_StyleScopedClasses['hover:bg-zayit-blue']} */ /** @type {__VLS_StyleScopedClasses['hover:text-white']} */ var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
  setup() {
    return {
      Icon: Icon,
      menuItems: menuItems,
      isActive: isActive,
      isDropdownActive: isDropdownActive,
      toggleDropdown: toggleDropdown,
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
