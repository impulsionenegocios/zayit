<template>
  <div class="space-y-6 relative">
    <!-- CRM Tab Navigation -->
    <div class="flex items-center space-x-6 border-b border-white/10 pb-1 px-4">
      <button
        @click="activeTab = 'leads'"
        class="text-sm font-medium"
        :class="tabClass('leads')"
      >
        Leads
      </button>

      <button
        @click="activeTab = 'tags'"
        class="text-sm font-medium"
        :class="tabClass('tags')"
      >
        Tags
      </button>

      <button
        @click="activeTab = 'settings'"
        class="text-sm font-medium"
        :class="tabClass('settings')"
      >
        Configurações
      </button>
    </div>

    <!-- View switcher tabs (only visible when leads tab is active) -->
    <div v-if="activeTab === 'leads'" class="flex justify-end items-end mr-8 absolute right-8">
      <button
        @click="activeView = 'list'"
        class="px-8 py-2 cursor-pointer font-medium text-sm transition-all duration-500 rounded-l-xl"
        :class="
          activeView === 'list'
            ? 'bg-zayit-blue text-white border-zayit-blue border'
            : 'bg-surface border border-zayit-blue text-white hover:bg-zayit-pink hover:border-zayit-pink hover:text-white'
        "
      >
        <Icon icon="mdi:format-list-bulleted" class="mr-2" />
        Lista
      </button>
      <button
        @click="activeView = 'kanban'"
        class="px-8 py-2 cursor-pointer font-medium text-sm transition-all duration-500 rounded-r-xl"
        :class="
          activeView === 'kanban'
            ? 'bg-zayit-blue text-white border-zayit-blue border'
            : 'bg-surface border border-zayit-blue text-white hover:bg-zayit-pink hover:border-zayit-pink hover:text-white'
        "
      >
        <Icon icon="mdi:view-column" class="mr-2" />
        Kanban
      </button>
    </div>

    <!-- Content based on active tab -->
    <div>
      <!-- Leads Tab Content -->
      <div v-if="activeTab === 'leads'">
        <KeepAlive>
          <component
            :is="activeView === 'list' ? LeadList : LeadKanban"
            :crm-id="crmId"
            :initial-view-mode="activeView"
            @view-change="handleViewChange"
          />
        </KeepAlive>
      </div>

      <!-- Tags Tab Content -->
      <div v-else-if="activeTab === 'tags'">
        <TagsList :crm-id="crmId" />
      </div>

      <!-- Settings Tab Content -->
      <div v-else-if="activeTab === 'settings'" class="space-y-8">
        <!-- CRM Form -->
        <div class="bg-surface rounded-lg shadow p-6">
          <CRMForm :crm-id="crmId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, h, computed, onUnmounted  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

import LeadList from '@/components/crm/leads/LeadList.vue';
import LeadKanban from '@/components/crm/leads/LeadKanban.vue';
import TagsList from '@/components/crm/tags/TagsList.vue';
import CRMForm from '@/components/crm/CRMForm.vue';
import { useCRMStore } from '@/stores/crm/crmStore';
import { useActionButton } from '@/stores/layout/actionButton';
import { createActionButton } from '@/helpers/createActionButton';

const route = useRoute();
const router = useRouter();
const crmId = route.params.crmId as string;
const actionButton = useActionButton();

const crmStore = useCRMStore();
const crmName = ref('');

// Active tab state (leads, tags, settings) - initialize based on route
const activeTab = ref<'leads' | 'tags' | 'settings'>(
  route.name === 'CRMTags' ? 'tags' : 
  route.name === 'CRMEdit' ? 'settings' : 
  'leads'
);

// Restore saved view mode from localStorage
const savedView = localStorage.getItem('activeView') as 'list' | 'kanban' | null;
const activeView = ref<'list' | 'kanban'>(savedView || 'list');

// Watch for view mode changes and save to localStorage
watch(activeView, (newValue) => {
  localStorage.setItem('activeView', newValue);
});

// Watch for tab changes to update action button
watch(activeTab, (newTab) => {
  updateActionButton(newTab);
});

onMounted(async () => {
  if (!crmId) {
    console.error('❌ crmId está undefined!');
    return;
  }

  await crmStore.fetchCRMs();
  const current = crmStore.crmById(crmId);
  crmName.value = current?.name || 'CRM';
  
  // Set initial action button based on active tab
  updateActionButton(activeTab.value);
});

// Clean up the action button when component is unmounted
onUnmounted(() => {
  actionButton.component = null;
});

function handleViewChange(mode: 'list' | 'kanban') {
  activeView.value = mode;
}

function tabClass(tabName: string) {
  return activeTab.value === tabName
    ? 'text-zayit-blue border-b-2 border-zayit-blue pb-1'
    : 'text-gray-400 hover:text-white pb-1 border-b-2 border-transparent';
}

// Update the action button based on the active tab
function updateActionButton(tab: string) {
  if (tab === 'leads') {
    actionButton.component = createActionButton(
      {
        title: 'Criar Lead',
        variant: 'primary',
        onClick: () => router.push({ name: 'CRMLeadCreate', params: { crmId } }),
      },
      {
        icon: () => h(Icon, { icon: 'mdi:plus' }),
      }
    );
  } else if (tab === 'tags') {
    actionButton.component = createActionButton(
      {
        title: 'Criar Tag',
        variant: 'primary',
        onClick: () => document.querySelector('.tag-form-trigger')?.dispatchEvent(new Event('click')),
      },
      {
        icon: () => h(Icon, { icon: 'mdi:plus' }),
      }
    );
  } else {
    // No action button for settings tab
    actionButton.component = null;
  }
}
</script>