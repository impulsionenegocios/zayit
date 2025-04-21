<!-- src/components/layout/Sidebar.vue -->
<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 bg-black opacity-50 md:hidden z-40"
      @click="$emit('close')"
    ></div>
  </transition>
  <aside
    id="default-sidebar"
    :class="[
      'fixed top-0 left-0 z-40 w-72 2xl:w-80 h-screen transition-transform mt-16 md:mt-0',
      open ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
    ]"
    aria-label="Sidenav"
  >
    <div class="relative h-full overflow-y-auto py-5 px-3 bg-black">
      <!-- Cabeçalho interno para desktop (logo) -->
      <div class="items-center justify-center mb-4 hidden md:flex">
        <router-link to="/">
          <img
            class="h-12 cursor-pointer"
            src="@/assets/images/logo-dark.png"
            alt="Voltar ao início"
          />
        </router-link>
      </div>
      <ul class="space-y-2">
        <li v-for="(item, index) in menuItems" :key="index">
          <div v-if="!item.subitems">
            <router-link
              :to="item.to"
              class="flex items-center p-2 cursor-pointer text-base font-normal rounded-lg hover:bg-zayit-blue h-12 hover:text-white transition-all duration-300 group"
              :class="isActive(item.to) ? 'sidebar-active hover:!text-white' : ''"
            >
              <Icon :icon="item.icon" />
              <span class="ml-3">{{ item.label }}</span>
            </router-link>
          </div>
          <div v-else>
            <button
              @click="toggleDropdown(index)"
              :aria-expanded="item.dropdownOpen"
              class="flex items-center p-2 w-full cursor-pointer text-base font-normal rounded-lg group hover:bg-zayit-blue h-12 hover:text-white transition-all duration-300"
              :class="isDropdownActive(item) ? 'sidebar-active hover:!text-white' : ''"
            >
              <Icon :icon="item.icon" />
              <span class="flex-1 ml-3 text-left whitespace-nowrap">
                {{ item.label }}
              </span>
              <Icon :icon="item.dropdownIcon" />
            </button>

            <transition
              name="dropdown"
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[300px]"
              leave-from-class="opacity-100 max-h-[300px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <ul v-show="item.dropdownOpen" class="overflow-hidden py-2 space-y-2 ml-11">
                <li v-for="(subitem, subIndex) in item.subitems" :key="subIndex">
                  <router-link
                    :to="subitem.to"
                    class="flex items-center p-2 pl-6 w-full text-base font-normal rounded-lg transition duration-300 group h-12 hover:bg-zayit-blue hover:text-white"
                    :class="isActive(subitem.to) ? 'sidebar-active hover:!text-white' : ''"
                  >
                    {{ subitem.label }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

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
      {
        label: 'Ver Kanban',
        to: { name: 'Ver Kanban' },
      },
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

function isActive(to: string | { name: string }): boolean {
  if (typeof to === 'string') {
    return route.path === to;
  } else if (to && 'name' in to) {
    return route.name === to.name;
  }
  return false;
}

function isDropdownActive(item: any): boolean {
  if (!item.subitems) return false;
  return item.subitems.some((sub: any) => isActive(sub.to));
}

function toggleDropdown(index: number) {
  menuItems.value[index].dropdownOpen = !menuItems.value[index].dropdownOpen;
}

// Ativa o dropdown com base na rota atual
function activateDropdownsFromRoute() {
  menuItems.value.forEach((item) => {
    if (item.subitems) {
      const shouldOpen = item.subitems.some((sub: any) => isActive(sub.to));
      item.dropdownOpen = shouldOpen;
    }
  });
}

onMounted(activateDropdownsFromRoute);
watch(() => route.fullPath, activateDropdownsFromRoute);
</script>
