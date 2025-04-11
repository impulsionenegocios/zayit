<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import TopBar from '@/components/layout/TopBar.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import { useActionButton } from '@/stores/layout/actionButton';

const sidebarOpen = ref(false);
const actionButton = useActionButton();
const route = useRoute();

const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value);
const closeSidebar = () => (sidebarOpen.value = false);
</script>

<template>
  <div class="h-16 md:hidden fixed bg-black w-full flex items-center justify-between z-50 md:px-8">
      <div class="flex items-center gap-4">
        <button
          @click="toggleSidebar"
          aria-controls="default-sidebar"
          :aria-expanded="sidebarOpen"
          class="md:hidden inline-flex items-center p-2 ml-3 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
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
          <img
            class="h-12 cursor-pointer"
            src="@/assets/images/logo.png"
            alt="Voltar ao início"
          />
        </router-link>
      </div>
      </div>
  <div>
    <Sidebar :open="sidebarOpen" @close="closeSidebar" />
    <div class="flex h-screen">
      <div
        class="flex-1 mt-16 overflow-y-auto md:ml-80 bg-surface rounded-2xl md:mr-4 md:mb-4 lg:mr-8 lg:mb-8"
      >
        <nav class="flex items-center justify-between p-4">
          <div class="flex items-center space-x-4">
            <span class="text-2xl text-gray-100">{{ route.name || 'Página' }}</span>
            <Breadcrumb />
          </div>
          <component :is="actionButton.component" v-if="actionButton.component" />
        </nav>
        <router-view />
      </div>
    </div>
  </div>
</template>
