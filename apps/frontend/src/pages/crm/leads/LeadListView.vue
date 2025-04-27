<template>
  <div>
    <LeadManagement />
  </div>
</template>

<script setup lang="ts">
import LeadList from '@/components/crm/leads/LeadList.vue';
import LeadManagement from '@/components/crm/leads/LeadManagement.vue';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { Icon } from '@iconify/vue';

const router = useRouter();

// Add the "Create Lead" button to the top action bar
usePageActionButton(
  {
    title: 'Criar Lead',
    variant: 'primary',
    onClick: () => router.push({ name: 'CreateLead' }), // ← aqui o nome da rota
  },
  {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
  },
);
</script>
