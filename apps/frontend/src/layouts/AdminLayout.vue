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
  <div>
    <TopBar :sidebarOpen="sidebarOpen" @toggleSidebar="toggleSidebar" />
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
