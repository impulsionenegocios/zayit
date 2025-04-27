<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-white">Lead Management</h1>
        <router-link 
          :to="{ name: 'CreateLead' }" 
          class="bg-zayit-blue hover:bg-zayit-blue/90 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
        >
          <Icon icon="mdi:plus" class="mr-2" />
          Add Lead
        </router-link>
      </div>
  
      <!-- View switcher tabs -->
      <div class="flex border-b border-white/10 mb-4">
        <button 
          @click="activeView = 'list'" 
          class="px-4 py-2 font-medium text-sm transition-colors"
          :class="activeView === 'list' ? 'text-zayit-blue border-b-2 border-zayit-blue -mb-px' : 'text-gray-400 hover:text-white'"
        >
          <Icon icon="mdi:format-list-bulleted" class="mr-2" />
          List View
        </button>
        <button 
          @click="activeView = 'kanban'" 
          class="px-4 py-2 font-medium text-sm transition-colors ml-4"
          :class="activeView === 'kanban' ? 'text-zayit-blue border-b-2 border-zayit-blue -mb-px' : 'text-gray-400 hover:text-white'"
        >
          <Icon icon="mdi:view-column" class="mr-2" />
          Kanban View
        </button>
      </div>
  
      <!-- View components -->
      <KeepAlive>
        <component 
          :is="activeView === 'list' ? LeadList : LeadKanban" 
          :initialViewMode="activeView"
          @view-change="handleViewChange"
        />
      </KeepAlive>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { Icon } from '@iconify/vue';
  import LeadList from './LeadList.vue';
  import LeadKanban from './LeadKanban.vue';
  
  // View mode state
  const activeView = ref<'list' | 'kanban'>('list');
  
  // Handle view change from child components
  function handleViewChange(mode: 'list' | 'kanban') {
    activeView.value = mode;
  }
  </script>