<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-white">
          {{ crmName || 'CRM' }}
        </h1>
        <p class="text-sm text-gray-400">Gerencie os leads, tags e configurações deste CRM</p>
      </div>
    </div>

    <!-- CRM Tab Navigation -->
    <div class="flex items-center space-x-6 border-b border-white/10 pb-1">
      <RouterLink
        :to="{ name: 'CRMManagement', params: { crmId } }"
        class="text-sm font-medium"
        :class="tabClass('CRMManagement')"
      >
        Leads
      </RouterLink>

      <RouterLink
        :to="{ name: 'CRMTags', params: { crmId } }"
        class="text-sm font-medium"
        :class="tabClass('CRMTags')"
      >
        Tags
      </RouterLink>

      <<RouterLink
  :to="{ name: 'CRMEdit', params: { crmId } }"
        class="text-sm font-medium"
        :class="tabClass('CRMEdit')"
      >
        Configurações
      </RouterLink>
    </div>

    <!-- View switcher tabs -->
    <div class="flex border-b border-white/10 mb-4">
      <button
        @click="activeView = 'list'"
        class="px-4 py-2 font-medium text-sm transition-colors"
        :class="
          activeView === 'list'
            ? 'text-zayit-blue border-b-2 border-zayit-blue -mb-px'
            : 'text-gray-400 hover:text-white'
        "
      >
        <Icon icon="mdi:format-list-bulleted" class="mr-2" />
        Lista
      </button>
      <button
        @click="activeView = 'kanban'"
        class="px-4 py-2 font-medium text-sm transition-colors ml-4"
        :class="
          activeView === 'kanban'
            ? 'text-zayit-blue border-b-2 border-zayit-blue -mb-px'
            : 'text-gray-400 hover:text-white'
        "
      >
        <Icon icon="mdi:view-column" class="mr-2" />
        Kanban
      </button>
    </div>

    <!-- View Components -->
    <KeepAlive>
  <component
    :is="activeView === 'list' ? LeadList : LeadKanban"
    :crm-id="crmId"
    :initial-view-mode="activeView"
    @view-change="handleViewChange"
  />
</KeepAlive>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

import LeadList from '@/components/crm/leads/LeadList.vue';
import LeadKanban from '@/components/crm/leads/LeadKanban.vue';
import { useCRMStore } from '@/stores/crm/crmStore';

const route = useRoute();
const crmId = route.params.crmId as string;

const crmStore = useCRMStore();
const crmName = ref('');

onMounted(async () => {
  console.log('🧪 crmId:', crmId);
  if (!crmId) {
    console.error('❌ crmId está undefined!');
    return;
  }

  await crmStore.fetchCRMs();
  const current = crmStore.crmById(crmId);
  crmName.value = current?.name || 'CRM';
});

const savedView = localStorage.getItem('activeView') as 'list' | 'kanban' | null;
const activeView = ref<'list' | 'kanban'>(savedView || 'list');

watch(activeView, (newValue) => {
  localStorage.setItem('activeView', newValue);
});

function handleViewChange(mode: 'list' | 'kanban') {
  activeView.value = mode;
}

function tabClass(routeName: string) {
  return route.name === routeName
    ? 'text-zayit-blue border-b-2 border-zayit-blue pb-1'
    : 'text-gray-400 hover:text-white pb-1 border-b-2 border-transparent';
}
</script>
