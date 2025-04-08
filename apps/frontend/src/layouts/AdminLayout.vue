<template>
  <div>
    <!--TOPBAR-->
    <div class="h-16 fixed bg-black md:px-8 items-center flex justify-between w-full z-50">
      <div class="flex gap-4">
        <button
          @click="toggleSidebar"
          aria-controls="default-sidebar"
          type="button"
          class="md:hidden inline-flex items-center p-2 mt-2 ml-3 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
        >
          <span class="sr-only">Abrir sidebar</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <router-link to="/">
          <img class="h-12 cursor-pointer" src="@/assets/images/logo.png" alt="Voltar ao inicio" />
        </router-link>
      </div>
      <div class="flex gap-8">
        <div>oi</div>
        <div>oi</div>
        <div>oi</div>
      </div>
    </div>
    <!-- Overlay para fechar a sidebar ao clicar fora (somente mobile) -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black opacity-50 md:hidden"
        @click="closeSidebar"
      ></div>
    </transition>
    <!-- Container com h-screen para sidebar e conteúdo principal -->
    <div class="flex h-screen">
      <aside
        id="default-sidebar"
        :class="[
          'fixed top-0 left-0 mt-16 z-40 w-72 2xl:w-80 h-screen transition-transform ',
          sidebarOpen ? 'translate-x-0 ' : '-translate-x-full ',
          'md:translate-x-0 ',
        ]"
        aria-label="Sidenav"
      >
        <div class="relative overflow-y-auto py-5 px-3 h-full bg-black">
          <!-- Botão de fechar para mobile -->
          <button
            @click="closeSidebar"
            class="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span class="sr-only">Fechar sidebar</span>
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <!-- Conteúdo da sidebar -->
          <ul class="space-y-2">
            <li>
              <a
                href="#"
                class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Overview</span>
              </a>
            </li>
            <!-- Exemplo de item com dropdown animado -->
            <li>
              <div>
                <button
                  @click="toggleDropdown"
                  class="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    class="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="flex-1 ml-3 text-left whitespace-nowrap">Clientes</span>
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 transition-transform duration-200"
                    :class="dropdownOpen ? 'rotate-180' : ''"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
                <!-- Dropdown com transição -->
                <transition
                  name="dropdown"
                  enter-active-class="transition duration-300 ease-out"
                  leave-active-class="transition duration-200 ease-in"
                >
                  <ul v-show="dropdownOpen" class="py-2 space-y-2">
                    <li>
                      <router-link :to="{ name: 'Clientes' }" class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                        Ver Clientes

                      </router-link>
                    </li>
                  </ul>
                </transition>
              </div>
            </li>
          </ul>
        </div>
      </aside>
     <!-- Conteúdo principal -->
      <div class="flex-1 mt-16 overflow-y-auto md:ml-80 bg-surface rounded-2xl md:mr-4 md:mb-4 lg:mr-8 lg:mb-8">
        <Breadcrumb />
        <router-view />
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import {ref, onMounted, onBeforeUnmount} from 'vue'

const sidebarOpen = ref(false)
const dropdownOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
const handleClickOutside = (event: MouseEvent) => {
  const sidebar = documento.querySelect('#default-sidebar')

  if(
    sidebarOpen.value && sidebar && !sidebar.contains(event.target as Node) && !(event.target as HTMLElement).closest('[aria-controls="default-sidebar"]')

  ) {
    closeSidebar()
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Animação do dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}
.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animação fade para o overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
