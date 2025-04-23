<template>
    <div>
      <h1 class="text-2xl font-bold text-white mb-6">Leads & Clients</h1>
      
      <LeadList />
    </div>
  </template>
  
  <script setup lang="ts">
  import LeadList from '@/components/crm/leads/LeadList.vue';
  import { usePageActionButton } from '@/composables/usePageActionButton';
  import { useRouter } from 'vue-router';
  import { h } from 'vue';
  import { Icon } from '@iconify/vue';
  
  const router = useRouter();
  
  // Add the "Create Lead" button to the top action bar
  usePageActionButton(
    {
      title: 'Create Lead',
      variant: 'primary',
      onClick: () => router.push('/leads/new'),
    },
    {
      icon: () => h(Icon, { icon: 'mdi:plus' }),
    }
  );
  </script>