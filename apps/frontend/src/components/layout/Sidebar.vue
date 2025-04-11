<!-- src/components/layout/Sidebar.vue -->
<template>
  <!-- Overlay (apenas em mobile) que fecha a sidebar ao clicar fora -->
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
      'md:translate-x-0'
    ]"
    aria-label="Sidenav"
  >
    <div class="relative h-full overflow-y-auto py-5 px-3 bg-black">
      <!-- Cabeçalho interno para desktop (logo) -->
      <div class="items-center justify-between mb-4 hidden md:flex">
        <router-link to="/">
          <img
            class="h-12 cursor-pointer"
            src="@/assets/images/logo.png"
            alt="Voltar ao início"
          />
        </router-link>
      </div>

      <!-- Menu de navegação gerado via v-for -->
      <ul class="space-y-2">
        <li v-for="(item, index) in menuItems" :key="index">
          <!-- Item sem subitens -->
          <div v-if="!item.subitems">
            <router-link
              :to="item.to"
              class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 h-12 hover:text-black transition-all duration-300 group"
              :class="isActive(item.to) ? 'sidebar-active hover:!text-white' : ''"
            >
              <Icon :icon="item.icon" />
              <span class="ml-3">{{ item.label }}</span>
            </router-link>
          </div>

          <!-- Item com dropdown (subitens) -->
          <div v-else>
            <button
              @click="toggleDropdown(index)"
              :aria-expanded="item.dropdownOpen"
              class="flex items-center p-2 w-full text-base font-normal rounded-lg group hover:bg-gray-100 h-12 hover:text-black transition-all duration-300"
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
              enter-active-class="transition duration-300 ease-out"
              leave-active-class="transition duration-200 ease-in"
            >
              <ul v-show="item.dropdownOpen" class="py-2 space-y-2  ml-11">
                <li
                  v-for="(subitem, subIndex) in item.subitems"
                  :key="subIndex"
                >
                  <router-link
                    :to="subitem.to"
                    class="flex items-center p-2 pl-6 w-full text-base font-normal rounded-lg transition duration-300 group h-12 hover:bg-gray-100 hover:text-black"
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
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

// Declaração das props e emit do componente
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

// Acessa a rota atual para comparação
const route = useRoute()

// Definição do array de itens do menu
const menuItems = ref([
  {
    label: 'Overview',
    icon: 'ic:round-dashboard',
    to: '/superadmin'
  },
  {
    label: 'Clientes',
    icon: 'mdi-account-tie',
    dropdownOpen: false,
    dropdownIcon: 'lsicon:down-outline',
    subitems: [
      {
        label: 'Ver Clientes',
        to: { name: 'Clientes' }
      }
    ]
  }
])

function isActive(to: string | { name: string }): boolean {
  if (typeof to === 'string') {
    return route.path === to
  } else if (to && 'name' in to) {
    return route.name === to.name
  }
  return false
}

// Se o item tiver subitens, verifica se algum deles está ativo
function isDropdownActive(item: any): boolean {
  if (!item.subitems) return false
  return item.subitems.some((sub: any) => isActive(sub.to))
}

// Função para alternar o estado aberto/fechado do dropdown por índice
function toggleDropdown(index: number) {
  menuItems.value[index].dropdownOpen = !menuItems.value[index].dropdownOpen
}
</script>
