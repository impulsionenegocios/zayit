<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import TopBar from '@/components/layout/TopBar.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useActionButton } from '@/stores/layout/actionButton';
import BackButton from '@/components/ui/buttons/BackButton.vue';
const sidebarOpen = ref(false);
const actionButton = useActionButton();
const route = useRoute();

const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value);
const closeSidebar = () => (sidebarOpen.value = false);
</script>

<template>
  <div class="h-16 lg:hidden fixed bg-black w-full flex items-center justify-between z-50 lg:px-8">
    <div class="flex items-center gap-4">
      <button
        @click="toggleSidebar"
        aria-controls="default-sidebar"
        :aria-expanded="sidebarOpen"
        class="lg:hidden inline-flex items-center p-2 ml-3 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
      >
        <span class="sr-only">Abrir sidebar</span>
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <router-link to="/">
        <img class="h-12 cursor-pointer" src="@/assets/images/logo.png" alt="Voltar ao início" />
      </router-link>
    </div>
  </div>
  <div>
    <Sidebar :open="sidebarOpen" @close="closeSidebar" />
    <div class="flex h-screen">
      <div
        class="flex-1 relative custom-scroll mt-8 overflow-y-auto lg:ml-64 2xl:ml-76 bg-surface rounded-2xl lg:mr-8 lg:mb-8"
      >
        <nav class="flex items-center justify-between p-4 absolute h-16 pt-4 mt-8 lg:mt-0 bg-card w-full">
          <div class="flex items-center space-x-4">
            <span class="text-2xl text-gray-100">{{ route.name || 'Página' }}</span>
            <Breadcrumb />
          </div>
          <component :is="actionButton.component" v-if="actionButton.component" />
        </nav>
        <BackButton 
              label="Back" 
              class="lg:mt-20 mt-28  mx-4"
              aria-label="Go back to previous page"
              fallback-route="/"
            />
        <router-view class="mt-8" />
      </div>
    </div>
  </div>
</template>
