// src/views/crm/CRMDashboardPage.vue
<template>
  <div>
    <CRMDashboard :crm-id="crmId" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import CRMDashboard from '@/components/crm/crm/CRMDashboard.vue';

const route = useRoute();
const crmId = route.params.id as string;
</script>