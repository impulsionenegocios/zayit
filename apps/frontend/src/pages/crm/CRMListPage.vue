<template>
  <div>
    <CRMList />
  </div>
</template>

<script setup lang="ts">
import CRMList from '@/components/crm/CRMList.vue';
import { usePageActionButton } from '@/composables/usePageActionButton';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { Icon } from '@iconify/vue';

const router = useRouter();

// Add the "Create CRM" button to the top action bar
usePageActionButton(
  {
    title: 'Criar CRM',
    variant: 'primary',
    onClick: () => router.push({ name: 'CreateCRM' }),
  },
  {
    icon: () => h(Icon, { icon: 'mdi:plus' }),
  },
);
</script>
