<!-- src/components/layout/TopBar.vue -->
<template>
  <div class="h-16 fixed bg-black md:px-8 items-center flex justify-between w-full z-50">
    <div class="flex gap-4">
      <button
        @click="$emit('toggleSidebar')"
        aria-controls="default-sidebar"
        :aria-expanded="sidebarOpen"
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
        <img class="h-12 cursor-pointer" src="@/assets/images/logo.png" alt="Voltar ao início" />
      </router-link>
    </div>
    <div class="flex gap-8">
      <div>Perfil</div>
      <div>Notificações</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sidebarOpen: boolean;
}>();

defineEmits<{
  (e: 'toggleSidebar'): void;
}>();
</script>
