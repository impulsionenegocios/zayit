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
        'fixed top-0 left-0 mt-16 z-40 w-72 2xl:w-80 h-screen transition-transform',
        open ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ]"
      aria-label="Sidenav"
    >
      <div class="relative overflow-y-auto py-5 px-3 h-full bg-black">
        <button
          @click="$emit('close')"
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
  
        <ul class="space-y-2">
          <li>
            <router-link
              to="/superadmin"
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
            </router-link>
          </li>
  
          <li>
            <div>
              <button
                @click="dropdownOpen = !dropdownOpen"
                :aria-expanded="dropdownOpen"
                class="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
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
              <transition
                name="dropdown"
                enter-active-class="transition duration-300 ease-out"
                leave-active-class="transition duration-200 ease-in"
              >
                <ul v-show="dropdownOpen" class="py-2 space-y-2">
                  <li>
                    <router-link
                      :to="{ name: 'Clientes' }"
                      class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    >
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
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  defineProps<{
    open: boolean
  }>()
  
  defineEmits<{
    (e: 'close'): void
  }>()
  
  const dropdownOpen = ref(false)
  </script>
  